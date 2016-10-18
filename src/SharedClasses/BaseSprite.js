var BaseSpriteDebug = true;
var s_scale = 0;
var defaultScale = 1.0;

var ANI_HEADER = 0x4D494E41;
var ANI_VERSION = 0x0001;

var USECENTER = true;
var USE_BATCH_NODE = true;

var _getSpriteScale = function () {
    if (s_scale == 0) {
        var scaleArr = [2.0, 1.0, 1.0];
        // 定义不同分辨率下需要的位置和大小值
        //s_scale = scaleArr[CCResource.getIndex()];
        s_scale = scaleArr[1];
    }
    return s_scale;
};

function SPTile(tileIndex, angle, scaleArr, flipArr, position, anchorPt, color, opacity) {
    this.tileIndex = tileIndex || 0;
    this.angle = angle || 0;
    this.scale = scaleArr || [];
    this.flip = flipArr || [];
    this.position = position || cc.PointZero();
    this.anchorPt = anchorPt || cc.PointZero();
    this.color = color || cc.white();
    this.opacity = opacity || 0;
}

function SPPolygon(vertex, count) {
    this.vertex = vertex || 0;
    this.count = count || 0;
}

function Collision(rectData, rectCount, polygonData, polyCount, boundingBox) {
    this.rectData = rectData || [];
    this.rectCount = rectCount || 0;
    this.polygonData = polygonData || [];
    this.polyCount = polyCount || 0;
    this.boundingBox = boundingBox || cc.RectZero();
}

function Frame(tileData, tileCount, referencePt, refptCount, collisionData) {
    this.tileData = tileData || [];
    this.tileCount = tileCount || 0;
    this.referencePt = referencePt || [];
    this.refptCount = refptCount || 0;
    this.collisionData = collisionData || new Collision();
}

function FrameA(index, delay) {
    this.index = index || 0;
    this.delay = delay || 0;
}

function Action(loop, frames, frameCount) {
    this.loop = loop || false;
    this.frames = frames || [];
    this.frameCount = frameCount || 0;
}

var NSDataStream = cc.Class.extend({
    _offset:0,
    _data:null,

    initWithContentsOfMappedFile:function (filePath) {
        this._offset = 0;
        this._data = cc.loader.getRes(filePath);
        return true;
    },

    _checkSize:function (neededBits) {
        if (!(this._offset + Math.ceil(neededBits / 8) < this._data.length)) {
            throw new Error("Index out of bound");
        }
    },

    _decodeFloat:function (precisionBits, exponentBits) {
        var length = precisionBits + exponentBits + 1;
        var size = length >> 3;
        this._checkSize(length);

        var bias = Math.pow(2, exponentBits - 1) - 1;
        var signal = this._readBits(precisionBits + exponentBits, 1, size);
        var exponent = this._readBits(precisionBits, exponentBits, size);
        var significand = 0;
        var divisor = 2;
        var curByte = 0; //length + (-precisionBits >> 3) - 1;
        do {
            var byteValue = this._readByte(++curByte, size);
            var startBit = precisionBits % 8 || 8;
            var mask = 1 << startBit;
            while (mask >>= 1) {
                if (byteValue & mask) {
                    significand += 1 / divisor;
                }
                divisor *= 2;
            }
        } while (precisionBits -= startBit);

        this._offset += size;

        return exponent == (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
            : (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
            : Math.pow(2, exponent - bias) * (1 + significand) : 0);
    },

    _readByte:function (i, size) {
        return this._data[this._offset + size - i - 1];
    },

    _decodeInt:function (bits, signed) {
        var x = this._readBits(0, bits, bits / 8), max = Math.pow(2, bits);
        var result = signed && x >= max / 2 ? x - max : x;

        this._offset += bits / 8;
        return result;
    },

    _shl:function (a, b) {
        for (++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
        return a;
    },

    _readBits:function (start, length, size) {
        var offsetLeft = (start + length) % 8;
        var offsetRight = start % 8;
        var curByte = size - (start >> 3) - 1;
        var lastByte = size + (-(start + length) >> 3);
        var diff = curByte - lastByte;

        var sum = (this._readByte(curByte, size) >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1);

        if (diff && offsetLeft) {
            sum += (this._readByte(lastByte++, size) & ((1 << offsetLeft) - 1)) << (diff-- << 3) - offsetRight;
        }

        while (diff) {
            sum += this._shl(this._readByte(lastByte++, size), (diff-- << 3) - offsetRight);
        }
        return sum;
    },

    readInteger:function () {
        return this._decodeInt(32, true);
    },
    readSingle:function () {
        return this._decodeFloat(23, 8);
    },
    readShort:function () {
        return this._decodeInt(16, true);
    },
    readByte:function () {
        var readByte = this._data[this._offset];
        this._offset += 1;
        return readByte;
    }
});

NSDataStream.streamWithContentsOfMappedFile = function (filePath) {
    var pRet = new NSDataStream();
    if (pRet && pRet.initWithContentsOfMappedFile(filePath)) {
        return pRet
    }
    return null;
};

var _SPData_cache = null;

function purgeSpriteDataCache() {
    _SPData_cache = null;
}

var integerToColor3B = function (intValue) {
    intValue = intValue || 0;

    var offset = 0xff;
    var retColor = new cc.Color3B();
    retColor.r = intValue & (offset);
    retColor.g = (intValue >> 8) & offset;
    retColor.b = (intValue >> 16) & offset;
    return retColor;
};

var SpriteData = cc.Class.extend({
    tileData:null,
    tileCount:0,

    frameData:null,
    frameCount:0,

    actionData:null,
    actionCount:0,

    initWithFile:function (filePath) {
        var i, j, k;

        var fullPath = filePath + ".sprite";
        //todo need to
        //fullPath = ImageName(fullPath);
        var data = NSDataStream.streamWithContentsOfMappedFile(fullPath);

        var header = data.readInteger();
        if (header != ANI_HEADER)
            return false;
        else {
            var version = data.readInteger();
            if (version < ANI_VERSION)
                return false;
        }

        //read tile
        this.tileCount = data.readInteger();
        this.tileData = [];

        for (i = 0; i < this.tileCount; i++) {
            this.tileData[i] = new cc.Rect();
            this.tileData[i].origin.x = (data.readShort()) / _getSpriteScale();
            this.tileData[i].origin.y = (data.readShort()) / _getSpriteScale();
            this.tileData[i].size.width = (data.readShort()) / _getSpriteScale();
            this.tileData[i].size.height = (data.readShort()) / _getSpriteScale();
        }

        //read frame
        this.frameCount = data.readInteger();
        this.frameData = [];
        for (i = 0; i < this.frameCount; i++) {
            this.frameData[i] = new Frame();
            this.frameData[i].tileCount = data.readInteger();

            //read frame tile
            this.frameData[i].tileData = [];
            var tile = this.frameData[i].tileData;
            for (j = 0; j < this.frameData[i].tileCount; j++) {
                tile[j] = new SPTile();
                tile[j].tileIndex = data.readShort(); //tile index
                tile[j].position.x = (data.readShort()) / _getSpriteScale(); //tile x
                tile[j].position.y = (data.readShort()) / _getSpriteScale(); //tile y
                tile[j].anchorPt.x = data.readSingle(); //tile transform
                tile[j].anchorPt.y = data.readSingle(); //tile transform
                tile[j].angle = data.readSingle();
                tile[j].color = integerToColor3B(data.readInteger());
                tile[j].opacity = data.readByte();
                tile[j].scale[0] = data.readSingle() * defaultScale;
                tile[j].scale[1] = data.readSingle() * defaultScale;
                tile[j].flip[0] = data.readByte() ? true : false;
                tile[j].flip[1] = data.readByte() ? true : false;
            }

            //read collision
            var invaild = data.readByte() ? true : false;
            if (invaild) {
                // read boundingBox
                this.frameData[i].collisionData = new Collision();
                var col = this.frameData[i].collisionData;
                col.boundingBox.origin.x = (data.readShort()) / _getSpriteScale();
                col.boundingBox.origin.y = (data.readShort()) / _getSpriteScale();
                col.boundingBox.size.width = (data.readShort()) / _getSpriteScale();
                col.boundingBox.size.height = (data.readShort()) / _getSpriteScale();

                if ((col.rectCount = data.readInteger()) > 0) {
                    col.rectData = [];
                    for (j = 0; j < col.rectCount; j++) {
                        col.rectData[j] = new cc.Rect();
                        col.rectData[j].origin.x = (data.readShort()) / _getSpriteScale();
                        col.rectData[j].origin.y = (data.readShort()) / _getSpriteScale();
                        col.rectData[j].size.width = (data.readShort()) / _getSpriteScale();
                        col.rectData[j].size.height = (data.readShort()) / _getSpriteScale();
                    }
                }
                if ((col.polyCount = data.readInteger()) > 0) {
                    for (j = 0; j < col.polyCount; j++) {
                        col.polygonData[j] = new SPPolygon();
                        if ((col.polygonData[j].count = data.readInteger()) > 0) {
                            for (k = 0; k < col.polygonData[j].count; k++) {
                                col.polygonData[j].vertex[k] = new cc.Point();
                                col.polygonData[j].vertex[k].x = (data.readShort()) / _getSpriteScale();
                                col.polygonData[j].vertex[k].y = (data.readShort()) / _getSpriteScale();
                            }
                        }
                    }
                }
            }

            if ((this.frameData[i].refptCount = data.readInteger()) > 0) {
                this.frameData[i].referencePt = [];
                var pt = this.frameData[i].referencePt;
                for (j = 0; j < this.frameData[i].refptCount; j++) {
                    pt[j] = new cc.Point(0, 0);
                    pt[j].x = (data.readShort()) / _getSpriteScale();
                    pt[j].y = (data.readShort()) / _getSpriteScale();
                }
            }
        }
        //read action
        this.actionData = [];
        if ((this.actionCount = data.readInteger()) > 0) {
            for (i = 0; i < this.actionCount; i++) {
                this.actionData[i] = new Action();
                this.actionData[i].loop = data.readByte() ? true : false;
                if ((this.actionData[i].frameCount = data.readInteger()) > 0) {
                    this.actionData[i].frames = [];
                    var fa = this.actionData[i].frames;
                    for (j = 0; j < this.actionData[i].frameCount; j++) {
                        fa[j] = new FrameA();
                        fa[j].index = data.readShort();
                        fa[j].delay = data.readInteger();
                    }
                }
            }
        }
        return true;
    }
});

SpriteData.fromCache = function (filePath) {
    if (!_SPData_cache)
        _SPData_cache = {};

    if (!_SPData_cache.hasOwnProperty(filePath)) {
        var sd = new SpriteData();
        sd.initWithFile(filePath);
        _SPData_cache[filePath] = sd;
    }
    return _SPData_cache[filePath];
};

var BaseSprite = cc.Sprite.extend({
    _actionIndex:0,
    _lastTime:null,
    _firstUpdate:null,
    _disableUpdate:true,
    _stopByNotLoop:false,
    _sequenceIndex:0,
    _delegate:null,
    _didStopSelector:null,
    getCurRotation:function () {
        return -this._rotationRadians;
    },
    initWithFile:function (defName, imgName) {
        this._super(imgName);
        this._actionIndex = 0;
        this._sequenceIndex = 0;
        this._disableUpdate = true;
        this._stopByNotLoop = false;
        //this._sd = cc.FileUtils.getInstance().dictionaryWithContentsOfFileThreadSafe(defName + ".plist");
        this._sd = SpriteData.fromCache(defName);
        this.resetContentSize();
    },

    _currTimeValue:null,
    update:function () {
        //call cc.Node.update(), but this function do nothing
        //this._super();

        this._currTimeValue = cc.Time.gettimeofdayCocos2d(this._currTimeValue);

        if (!this._firstUpdate) {
            this._firstUpdate = true;
            this._lastTime = new cc.timeval();
            this._lastTime.tv_usec = this._currTimeValue.tv_usec;
            this._lastTime.tv_sec = this._currTimeValue.tv_sec;
        }

        var currActionData = this._sd.actionData[this._actionIndex];
        if (!currActionData)
            return;

        var dms = currActionData.frames[this._sequenceIndex].delay / 1000;
        var subTime = (this._currTimeValue.tv_sec - this._lastTime.tv_sec) + (this._currTimeValue.tv_usec - this._lastTime.tv_usec) / 1000000.0;

        if (((subTime >= dms) || (subTime < 0)) && !this._stopByNotLoop) {
            this._sequenceIndex = (this._sequenceIndex + 1) % currActionData.frameCount;
            this._lastTime.tv_usec = this._currTimeValue.tv_usec;
            this._lastTime.tv_sec = this._currTimeValue.tv_sec;

            if (!currActionData.loop && ((this._sequenceIndex + 1) == currActionData.frameCount)) {
                this._stopByNotLoop = true;
                if (this._delegate && this._didStopSelector) {
                    this._didStopSelector.call(this._delegate);
                }
            }
        }
    },

    setUpdatebySelf:function (enable) {
        if (this._disableUpdate && enable) {
            this.schedule(this.update);
        }
        if (!this._disableUpdate && !enable) {
            this.unschedule(this.update);
        }
        this._disableUpdate = !enable;
    },
    setActionDidStopSelector:function (selector, delegate) {
        this._delegate = delegate;
        this._didStopSelector = selector;
    },
    getUpdatebySelfValue:function () {
        return !this._disableUpdate;
    },
    setAction:function (actionIndex) {
        if (actionIndex < 0 || actionIndex >= this._sd.actionCount) {
            //KingFisher cc.log("indexOutOfBounds");
        }
        else {
            this._actionIndex = actionIndex;
            this._sequenceIndex = 0;
            this._firstUpdate = false;
            this._stopByNotLoop = false;
        }
    },
    getAction:function () {
        return this._actionIndex;
    },
    getActionCount:function () {
        return this._sd.actionCount;
    },
    referencePointCount:function () {
        var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
        return this._sd.frameData[frameIndex].refptCount;
    },
    referencePoint:function (index) {
        var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
        return this._sd.frameData[frameIndex].referencePt[index];
    },
    getSequenceIndex:function () {
        return this._sequenceIndex;
    },

    visit:function (ctx) {
        // quick return if not visible
        if (!this._isVisible) {
            return;
        }

        var context = ctx || cc.renderContext;

        //if (cc.renderContextType == cc.CANVAS) {
        context.save();
        this.transform(context);

        var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
        var tiles = this._sd.frameData[frameIndex];

        for (var i = 0; i < tiles.tileCount; i++) {
            var tile = tiles.tileData[i];
            //var rect = cc.RectFromString(this._sd.tileData[tile.tileIndex]);
            var rect = this._sd.tileData[tile.tileIndex];

            context.save();
            this.transformForSub(context, rect, tile);
            this.draw(context, rect, tile);
            context.restore();
        }

        this._orderOfArrival = 0;
        context.restore();
        //}
        cc.g_NumberOfDraws++;
    },

    transformForSub:function (ctx, rect, tile) {
        var context = ctx || cc.renderContext;
        // transformations
        //var _position = cc.PointFromString(tile.position);
        var _position = tile.position;

        //if (cc.renderContextType == cc.CANVAS) {
        context.translate(0 | _position.x, -(0 | _position.y));

        var _rotation = tile.angle * (Math.PI / 180);

        if (_rotation != 0) {
            context.rotate(_rotation);
        }

        if ((tile.scale[0] != 1) || (tile.scale[1] != 1)) {
            context.scale(tile.scale[0], tile.scale[1]);
        }
        //}
    },

    draw:function (ctx, rect, tile) {
        var context = ctx || cc.renderContext;
        //if (cc.renderContextType == cc.CANVAS) {

        var mpX = 0, mpY = 0;
        var width = rect.size.width;
        var height = rect.size.height;

        this._opacity = tile.opacity;
        context.globalAlpha = this._opacity / 255;

        //var anchorPoint = cc.PointFromString(tile.anchorPt);
        var anchorPoint = tile.anchorPt;

        var _filpX = tile.flip[0];
        if (_filpX) {
            mpX = 0 | (width / 2 - anchorPoint.x * width);
            context.translate(mpX, 0);
            context.scale(-1, 1);
        }
        var _filpY = tile.flip[1];
        if (_filpY) {
            mpY = -(0 | (height / 2 - anchorPoint.y * height));
            context.translate(0, mpY);
            context.scale(1, -1);
        }

        var posX = 0 | ( -anchorPoint.x * width - mpX);
        var posY = 0 | ( -anchorPoint.y * height + mpY);

        context.drawImage(this._texture, rect.origin.x, rect.origin.y, width, height, posX, -(posY + height), width, height);

        /* if (BaseSpriteDebug) {
         context.strokeStyle = "rgba(0,255,0,1)";
         var vertices1 = [cc.p(posX, posY), cc.p(posX + rect.size.width, posY), cc.p(posX + rect.size.width, posY + rect.size.height),
         cc.p(posX, posY + rect.size.height)];
         cc.drawingUtil.drawPoly(vertices1, 4, true);

         var posX1 = 0 | ( -this._anchorPointInPoints.x - 0 + this._offsetPosition.x);
         var posY1 = 0 | ( -this._anchorPointInPoints.y + 0 + this._offsetPosition.y);
         context.strokeStyle = "rgba(255,28,28,1)";
         var vertices1 = [cc.p(posX1, posY1), cc.p(posX1 + this._contentSize.width, posY1), cc.p(posX1 + this._contentSize.width, posY1 + this._contentSize.height),
         cc.p(posX1, posY1 + this._contentSize.height)];
         cc.drawingUtil.drawPoly(vertices1, 4, true);
         }*/
        //}
    },

    collidesWith:function (plane) {
        if (!this._isAlive || !plane.getIsAlive()) {
            return false;
        }

        if (!this.isVisible() || !plane.isVisible()) {
            return false;
        }

        var thisCollides = this.getCollidesCount();
        var spxCollides = plane.getCollidesCount();

        if (thisCollides == 0 || spxCollides == 0) {
            return false;
        }

        var _frame = this.getSequenceFrame();
        var frame = plane.getSequenceFrame();

        for (var i = 0; i < thisCollides; i++) {
            var rect1 = this._sd.frameData[_frame].collisionData.rectData[i];
            //rect1 = cc.RectFromString(rect1);

            var ptCenter1 = cc.pAdd(rect1.origin, cc.p(rect1.size.width / 2, rect1.size.height / 2));
            var radius1 = Math.sqrt(Math.pow(rect1.size.width / 2, 2) + Math.pow(rect1.size.height / 2, 2));
            ptCenter1 = cc.pRotateByAngle(ptCenter1, cc.PointZero(), this.getCurRotation());
            ptCenter1 = cc.pAdd(this.getPosition(), ptCenter1);

            /*var xx = ptCenter1.x - rect1.size.width / 2;
             var yy = ptCenter1.y - rect1.size.height / 2;


             rect1 = cc.RectMake(xx, yy, rect1.size.width, rect1.size.height);*/
            for (var j = 0; j < spxCollides; j++) {
                var rect2 = plane._sd.frameData[frame].collisionData.rectData[j];
                //rect2 = cc.RectFromString(rect2);
                var ptCenter2 = cc.pAdd(rect2.origin, cc.p(rect2.size.width / 2, rect2.size.height / 2));
                var radius2 = Math.sqrt(Math.pow(rect2.size.width / 2, 2) + Math.pow(rect2.size.height / 2, 2));
                ptCenter2 = cc.pRotateByAngle(ptCenter2, cc.PointZero(), plane.getCurRotation());
                ptCenter2 = cc.pAdd(plane.getPosition(), ptCenter2);

                /*xx = ptCenter2.x - rect2.size.width / 2;
                 yy = ptCenter2.y - rect2.size.height / 2;

                 rect2 = cc.RectMake(xx, yy, rect2.size.width, rect2.size.height);*/
                var dis = cc.pDistance(ptCenter1, ptCenter2);
                if (dis <= (radius1 + radius2)) {
                    return true;
                }

            }
        }
        return false;
    },
    collideIndexWith:function (plane) {
        if (!this._isAlive || !plane.getIsAlive()) {
            return -1;
        }

        if (!this.isVisible() || !plane.isVisible()) {
            return -1;
        }

        var thisCollides = this.getCollidesCount();
        var spxCollides = plane.getCollidesCount();
        if (thisCollides == 0 || spxCollides == 0) {
            return -1;
        }

        var _frame = this.getSequenceFrame();
        var frame = plane.getSequenceFrame();

        for (var i = 0; i < thisCollides; i++) {
            var rect1 = this._sd.frameData[_frame].collisionData.rectData[i];
            //rect1 = cc.RectFromString(rect1);
            var ptCenter1 = cc.pAdd(rect1.origin, cc.p(rect1.size.width / 2, rect1.size.height / 2));

            var radius1 = Math.sqrt(Math.pow(rect1.size.width / 2, 2) + Math.pow(rect1.size.height / 2, 2));

            ptCenter1 = cc.pRotateByAngle(ptCenter1, cc.PointZero(), this.getCurRotation());
            ptCenter1 = cc.pAdd(this.getPosition(), ptCenter1);
            /*var xx = ptCenter1.x - rect1.size.width / 2;
             var yy = ptCenter1.y - rect1.size.height / 2;

             rect1 = cc.RectMake(xx, yy, rect1.size.width, rect1.size.height);*/
            for (var j = 0; j < spxCollides; j++) {
                var rect2 = plane._sd.frameData[frame].collisionData.rectData[j];
                //rect2 = cc.RectFromString(rect2);
                var ptCenter2 = cc.pAdd(rect2.origin, cc.p(rect2.size.width / 2, rect2.size.height / 2));
                var radius2 = Math.sqrt(Math.pow(rect2.size.width / 2, 2) + Math.pow(rect2.size.height / 2, 2));

                ptCenter2 = cc.pRotateByAngle(ptCenter2, cc.PointZero(), plane.getCurRotation());
                ptCenter2 = cc.pAdd(plane.getPosition(), ptCenter2);

                /*xx = ptCenter2.x - rect2.size.width / 2;
                 yy = ptCenter2.y - rect2.size.height / 2;

                 rect2 = cc.RectMake(xx, yy, rect2.size.width, rect2.size.height);*/
                var dus = cc.pDistance(ptCenter1, ptCenter2);
                if (dus <= (radius1 + radius2)) {
                    return j;
                }

            }
        }
        return -1;
    },
    collidesWithRect:function (rect, collides) {
        var _frame = this.getSequenceFrame();
        var rect1 = this._sd.frameData[_frame].collisionData.rectData[collides];
        //rect1 = cc.RectFromString(rect1);
        var xx = rect1.origin.x + this.getPosition().x;
        var yy = rect1.origin.y + this.getPosition().y;
        rect1 = cc.RectMake(xx, yy, rect1.size.width, rect1.size.height);
        return cc.Rect.CCRectIntersectsRect(rect, rect1);
    },
    setContentSize:function (size) {
        if (!cc.Size.CCSizeEqualToSize(size, this._contentSize)) {
            //save dirty region when before change
            //this._addDirtyRegionToDirector(this.getBoundingBoxToWorld());
            this._contentSize = size;

            this._anchorPointInPoints = cc.p(this._contentSize.width * this._anchorPoint.x,
                this._contentSize.height * this._anchorPoint.y);
            //save dirty region when before change
            //this._addDirtyRegionToDirector(this.getBoundingBoxToWorld());
            this.setNodeDirty();
        }
    },
    resetContentSize:function () {
        // 计算鱼的大小，乌龟比较麻烦，把所有的小图都加起来
        var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
        var fishSize = new cc.Size();
        for (var i = 0; i < this._sd.frameData[frameIndex].tileCount; i++) {
            var tile = this._sd.frameData[frameIndex].tileData[i];
            //var size = cc.RectFromString(this._sd.tileData[tile.tileIndex]).size;
            var size = this._sd.tileData[tile.tileIndex].size;
            fishSize.width = size.width;
            fishSize.height = size.height;
        }
        this.setContentSize(fishSize);
    },
    getSpriteTileRect:function () {
        var frameIndex = this._sd.actionData[this._actionIndex].frames[0].index;
        var tile = this._sd.frameData[frameIndex].tileData[0];
        return this._sd.tileData[tile.tileIndex];
    },
    getSequenceFrame:function () {
        return this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
    },
    getCollidesCount:function () {
        var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
        if (this._sd.frameData[frameIndex].collisionData) {
            return this._sd.frameData[frameIndex].collisionData.rectCount;
        }
        return 0;
    },
    getSize:function () {
        return this.getContentSize();
    }
});