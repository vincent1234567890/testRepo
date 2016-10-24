var BaseSprite = (function() {
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
        this.position = position || new cc.Point(0, 0);
        this.anchorPt = anchorPt || new cc.Point(0, 0);
        this.color = color || cc.color.WHITE;
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
        this.boundingBox = boundingBox || new cc.Rect(0, 0, 0, 0);
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
        _offset: 0,
        _data: null,
        debugString: null,

        initWithContentsOfMappedFile: function (filePath) {
            this._offset = 0;
            this._data = cc.loader.getRes(filePath);
            this.debugString = filePath;
            return true;
        },

        _checkSize: function (neededBits) {
            if (!(this._offset + Math.ceil(neededBits / 8) < this._data.length)) {
                throw new Error("Index out of bound");
            }
        },

        _decodeFloat: function (precisionBits, exponentBits) {
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

        _readByte: function (i, size) {
            return this._data[this._offset + size - i - 1];
        },

        _decodeInt: function (bits, signed) {
            var x = this._readBits(0, bits, bits / 8), max = Math.pow(2, bits);
            var result = signed && x >= max / 2 ? x - max : x;

            this._offset += bits / 8;
            return result;
        },

        _shl: function (a, b) {
            for (++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
            return a;
        },

        _readBits: function (start, length, size) {
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

        readInteger: function () {
            return this._decodeInt(32, true);
        },
        readSingle: function () {
            return this._decodeFloat(23, 8);
        },
        readShort: function () {
            return this._decodeInt(16, true);
        },
        readByte: function () {
            var readByte = this._data[this._offset];
            this._offset += 1;
            return readByte;
        }
    });

    NSDataStream.getSpriteData = function (filePath) {
        var pRet = new NSDataStream();
        if (pRet && pRet.initWithContentsOfMappedFile(filePath)) {
            return pRet
        }
        return null;
    };

    var _SPData_cache = {};

    var integerToColor3B = function (intValue) {
        intValue = intValue || 0;

        var offset = 0xff;
        return new cc.Color(intValue & (offset), (intValue >> 8) & offset, (intValue >> 16) & offset);
    };

    var SpriteData = cc.Class.extend({
        tileData: null,
        tileCount: 0,

        frameData: null,
        frameCount: 0,

        actionData: null,
        actionCount: 0,

        initWithFile: function (filePath) {
            var i, j, k;

            //var fullPath = filePath;
            //fullPath = ImageName(fullPath);
            var data = NSDataStream.getSpriteData(filePath);

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
                this.tileData[i] = new cc.Rect(0, 0, 0, 0);
                this.tileData[i].x = (data.readShort()) / _getSpriteScale();
                this.tileData[i].y = (data.readShort()) / _getSpriteScale();
                this.tileData[i].width = (data.readShort()) / _getSpriteScale();
                this.tileData[i].height = (data.readShort()) / _getSpriteScale();
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
                    col.boundingBox.x = (data.readShort()) / _getSpriteScale();
                    col.boundingBox.y = (data.readShort()) / _getSpriteScale();
                    col.boundingBox.width = (data.readShort()) / _getSpriteScale();
                    col.boundingBox.height = (data.readShort()) / _getSpriteScale();

                    if ((col.rectCount = data.readInteger()) > 0) {
                        col.rectData = [];
                        for (j = 0; j < col.rectCount; j++) {
                            col.rectData[j] = new cc.Rect(0, 0, 0, 0);
                            col.rectData[j].x = (data.readShort()) / _getSpriteScale();
                            col.rectData[j].y = (data.readShort()) / _getSpriteScale();
                            col.rectData[j].width = (data.readShort()) / _getSpriteScale();
                            col.rectData[j].height = (data.readShort()) / _getSpriteScale();
                        }
                    }
                    if ((col.polyCount = data.readInteger()) > 0) {
                        for (j = 0; j < col.polyCount; j++) {
                            col.polygonData[j] = new SPPolygon();
                            if ((col.polygonData[j].count = data.readInteger()) > 0) {
                                for (k = 0; k < col.polygonData[j].count; k++) {
                                    col.polygonData[j].vertex[k] = new cc.Point(0, 0);
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
        if (!_SPData_cache.hasOwnProperty(filePath)) {
            var sd = new SpriteData();
            sd.initWithFile(filePath);
            _SPData_cache[filePath] = sd;
        }
        return _SPData_cache[filePath];
    };

    var BaseSprite = cc.Sprite.extend({
        _actionIndex: 0,
        _lastTime: null,
        _firstUpdate: null,
        _disableUpdate: true,
        _stopByNotLoop: false,
        _sequenceIndex: 0,

        _delegate: null,
        _didStopSelector: null,

        _currTimeValue: null,

        getCurRotation: function () {
            return -this._rotationRadians;
        },

        ctor: function (defName, imgName) {
            cc.Sprite.prototype.ctor.call(this, imgName);

            this._actionIndex = 0;
            this._sequenceIndex = 0;
            this._disableUpdate = true;
            this._stopByNotLoop = false;

            this._sd = SpriteData.fromCache(defName);

            this.resetContentSize();
        },

        update: function (delta) {
            //cc.Node.prototype.update.call(this);  //do nothing

            this._currTimeValue = Date.now();
            if (!this._firstUpdate) {
                this._firstUpdate = true;
                this._lastTime = this._currTimeValue;
            }

            var currActionData = this._sd.actionData[this._actionIndex];
            if (!currActionData)
                return;

            var dms = currActionData.frames[this._sequenceIndex].delay / 1000;
            var subTime = (this._currTimeValue - this._lastTime) / 1000;
            if (((subTime >= dms) || (subTime < 0)) && !this._stopByNotLoop) {
                this._sequenceIndex = (this._sequenceIndex + 1) % currActionData.frameCount;
                this._lastTime = this._currTimeValue;

                if (!currActionData.loop && ((this._sequenceIndex + 1) == currActionData.frameCount)) {
                    this._stopByNotLoop = true;
                    if (this._delegate && this._didStopSelector) {
                        this._didStopSelector.call(this._delegate);
                    }
                }
            }
            this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        },

        setUpdatebySelf: function (enable) {
            if (this._disableUpdate && enable) {
                this.schedule(this.update);
            }
            if (!this._disableUpdate && !enable) {
                this.unschedule(this.update);
            }
            this._disableUpdate = !enable;
        },

        setActionDidStopSelector: function (selector, delegate) {
            this._delegate = delegate;
            this._didStopSelector = selector;
        },

        getUpdatebySelfValue: function () {
            return !this._disableUpdate;
        },

        setAction: function (actionIndex) {
            if (actionIndex < 0 || actionIndex >= this._sd.actionCount) {
                //KingFisher cc.log("indexOutOfBounds");
            } else {
                this._actionIndex = actionIndex;
                this._sequenceIndex = 0;
                this._firstUpdate = false;
                this._stopByNotLoop = false;
            }
        },

        getAction: function () {
            return this._actionIndex;
        },

        getActionCount: function () {
            return this._sd.actionCount;
        },

        referencePointCount: function () {
            var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
            return this._sd.frameData[frameIndex].refptCount;
        },

        referencePoint: function (index) {
            var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
            return this._sd.frameData[frameIndex].referencePt[index];
        },

        getSequenceIndex: function () {
            return this._sequenceIndex;
        },

        collidesWith: function (plane) {
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

                var ptCenter1 = cc.pAdd(rect1, cc.p(rect1.width / 2, rect1.height / 2));
                var radius1 = Math.sqrt(Math.pow(rect1.width / 2, 2) + Math.pow(rect1.height / 2, 2));
                ptCenter1 = cc.pRotateByAngle(ptCenter1, new cc.Point(0, 0), this.getCurRotation());
                ptCenter1 = cc.pAdd(this.getPosition(), ptCenter1);

                /*var xx = ptCenter1.x - rect1.width / 2;
                 var yy = ptCenter1.y - rect1.height / 2;


                 rect1 = new cc.Rect(xx, yy, rect1.width, rect1.height);*/
                for (var j = 0; j < spxCollides; j++) {
                    var rect2 = plane._sd.frameData[frame].collisionData.rectData[j];
                    //rect2 = cc.RectFromString(rect2);
                    var ptCenter2 = cc.pAdd(rect2, cc.p(rect2.width / 2, rect2.height / 2));
                    var radius2 = Math.sqrt(Math.pow(rect2.width / 2, 2) + Math.pow(rect2.height / 2, 2));
                    ptCenter2 = cc.pRotateByAngle(ptCenter2, new cc.Point(0, 0), plane.getCurRotation());
                    ptCenter2 = cc.pAdd(plane.getPosition(), ptCenter2);

                    /*xx = ptCenter2.x - rect2.width / 2;
                     yy = ptCenter2.y - rect2.height / 2;

                     rect2 = new cc.Rect(xx, yy, rect2.width, rect2.height);*/
                    var dis = cc.pDistance(ptCenter1, ptCenter2);
                    if (dis <= (radius1 + radius2)) {
                        return true;
                    }

                }
            }
            return false;
        },

        collideIndexWith: function (plane) {
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
                var ptCenter1 = cc.pAdd(rect1, cc.p(rect1.width / 2, rect1.height / 2));

                var radius1 = Math.sqrt(Math.pow(rect1.width / 2, 2) + Math.pow(rect1.height / 2, 2));

                ptCenter1 = cc.pRotateByAngle(ptCenter1, new cc.Point(0, 0), this.getCurRotation());
                ptCenter1 = cc.pAdd(this.getPosition(), ptCenter1);
                /*var xx = ptCenter1.x - rect1.width / 2;
                 var yy = ptCenter1.y - rect1.height / 2;

                 rect1 = new cc.Rect(xx, yy, rect1.width, rect1.height);*/
                for (var j = 0; j < spxCollides; j++) {
                    var rect2 = plane._sd.frameData[frame].collisionData.rectData[j];
                    //rect2 = cc.RectFromString(rect2);
                    var ptCenter2 = cc.pAdd(rect2, cc.p(rect2.width / 2, rect2.height / 2));
                    var radius2 = Math.sqrt(Math.pow(rect2.width / 2, 2) + Math.pow(rect2.height / 2, 2));

                    ptCenter2 = cc.pRotateByAngle(ptCenter2, new cc.Point(0, 0), plane.getCurRotation());
                    ptCenter2 = cc.pAdd(plane.getPosition(), ptCenter2);

                    /*xx = ptCenter2.x - rect2.width / 2;
                     yy = ptCenter2.y - rect2.height / 2;

                     rect2 = new cc.Rect(xx, yy, rect2.width, rect2.height);*/
                    var dus = cc.pDistance(ptCenter1, ptCenter2);
                    if (dus <= (radius1 + radius2)) {
                        return j;
                    }

                }
            }
            return -1;
        },

        collidesWithRect: function (rect, collides) {
            var _frame = this.getSequenceFrame();
            var rect1 = this._sd.frameData[_frame].collisionData.rectData[collides];
            //rect1 = cc.RectFromString(rect1);
            var xx = rect1.x + this.getPosition().x;
            var yy = rect1.y + this.getPosition().y;
            rect1 = new cc.Rect(xx, yy, rect1.width, rect1.height);
            return cc.rectIntersectsRect(rect, rect1);
        },

        setContentSize: function (size, height) {
            if (height)
                size = new cc.Size(size, height);
            if (!cc.sizeEqualToSize(size, this._contentSize)) {
                this._contentSize = size;

                this._anchorPointInPoints = cc.p(this._contentSize.width * this._anchorPoint.x,
                    this._contentSize.height * this._anchorPoint.y);
                this.setNodeDirty();
            }
        },

        resetContentSize: function () {
            // 计算鱼的大小，乌龟比较麻烦，把所有的小图都加起来
            var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
            var fishSize = new cc.Size();
            for (var i = 0; i < this._sd.frameData[frameIndex].tileCount; i++) {
                var tile = this._sd.frameData[frameIndex].tileData[i];
                //var size = cc.RectFromString(this._sd.tileData[tile.tileIndex]).size;
                var size = this._sd.tileData[tile.tileIndex];
                fishSize.width = size.width;
                fishSize.height = size.height;
            }
            this.setContentSize(fishSize);
        },

        getSpriteTileRect: function () {
            var frameIndex = this._sd.actionData[this._actionIndex].frames[0].index;
            var tile = this._sd.frameData[frameIndex].tileData[0];
            return this._sd.tileData[tile.tileIndex];
        },

        getSequenceFrame: function () {
            return this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
        },

        getCollidesCount: function () {
            var frameIndex = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].index;
            if (this._sd.frameData[frameIndex].collisionData) {
                return this._sd.frameData[frameIndex].collisionData.rectCount;
            }
            return 0;
        },

        getSize: function () {
            return this.getContentSize();
        },

        _createRenderCmd: function () {
            if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
                return new BaseSprite.CanvasRenderCmd(this);
            else
                return new BaseSprite.WebGLRenderCmd(this);
        }
    });

    //Base Sprite Canvas render command
    BaseSprite.CanvasRenderCmd = function (renderable) {
        cc.Sprite.CanvasRenderCmd.call(this, renderable);

        this._tileTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
        this._tileWorldTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
    };

    var canvasProto = BaseSprite.CanvasRenderCmd.prototype = Object.create(cc.Sprite.CanvasRenderCmd.prototype);
    canvasProto.constructor = BaseSprite.CanvasRenderCmd;

    canvasProto._drawSprite = function (wrapper, texture, rect, tile) {
        var _flipX = tile.flip[0], _flipY = tile.flip[1], context = wrapper.getContext();

        var width = rect.width, height = rect.height;
        var locX = 0, locY = -height;

        if (_flipX || _flipY)
            wrapper.save();
        if (_flipX) {
            locX = -rect.width;
            context.scale(-1, 1);
        }
        if (_flipY) {
            locY = 0;
            context.scale(1, -1);
        }

        if (texture && texture._htmlElementObj) {
            var image = texture._htmlElementObj;
            context.drawImage(image,
                rect.x, rect.y, width, height,
                locX, locY, width, height);
        }

        if (_flipX || _flipY)
            wrapper.restore();
    };

    canvasProto._transformForSub = function (tile,rect) {
        var pt = this._worldTransform;
        var anchorPoint = tile.anchorPt;

        var t = this._tileTransform,
            wt = this._tileWorldTransform;         //get the world transform

        var position = tile.position, rotation = tile.angle;

        var hasRotation = rotation !== 0;
        var sx = tile.scale[0], sy = tile.scale[1];
        var appX = anchorPoint.x * rect.width, appY = anchorPoint.y * rect.height;

        if (hasRotation) {
            // position
            t.tx = position.x;
            t.ty = position.y;

            // rotation
            if (hasRotation) {
                var rotationRadiansX = rotation * 0.017453292519943295;  //0.017453292519943295 = (Math.PI / 180);   for performance
                t.c = Math.sin(rotationRadiansX);
                t.d = Math.cos(rotationRadiansX);
                t.a = t.d;
                t.b = -t.c;
            }

            // scale
            t.a *= sx;
            t.b *= sx;
            t.c *= sy;
            t.d *= sy;

            if (appX || appY) {
                t.tx -= t.a * appX + t.c * appY;
                t.ty -= t.b * appX + t.d * appY;
            }

            // cc.AffineTransformConcat is incorrect at get world transform
            wt.a = t.a * pt.a + t.b * pt.c;                               //a
            wt.b = t.a * pt.b + t.b * pt.d;                               //b
            wt.c = t.c * pt.a + t.d * pt.c;                               //c
            wt.d = t.c * pt.b + t.d * pt.d;                               //d
            wt.tx = pt.a * t.tx + pt.c * t.ty + pt.tx;
            wt.ty = pt.d * t.ty + pt.ty + pt.b * t.tx;
        } else {
            t.a = sx;
            t.b = 0;
            t.c = 0;
            t.d = sy;
            t.tx = position.x;
            t.ty = position.y;

            if (appX || appY) {
                t.tx -= t.a * appX;
                t.ty -= t.d * appY;
            }

            wt.a = t.a * pt.a + t.b * pt.c;
            wt.b = t.a * pt.b + t.b * pt.d;
            wt.c = t.c * pt.a + t.d * pt.c;
            wt.d = t.c * pt.b + t.d * pt.d;
            wt.tx = t.tx * pt.a + t.ty * pt.c + pt.tx;
            wt.ty = t.tx * pt.b + t.ty * pt.d + pt.ty;
        }
    };

    canvasProto.rendering = function (ctx, scaleX, scaleY) {
        var node = this._node;
        var alpha = (this._displayedOpacity / 255);
        var texture = this._textureToRender || node._texture;

        if ((texture && !texture._textureLoaded) || alpha === 0)
            return;

        var wrapper = ctx || cc._renderContext;
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(this._blendFuncStr);
        wrapper.setGlobalAlpha(alpha);

        var spriteData = node._sd;
        var frameIdx = spriteData.actionData[node._actionIndex].frames[node._sequenceIndex].index;
        var tiles = spriteData.frameData[frameIdx];

        for (var i = 0; i < tiles.tileCount; i++) {
            var tile = tiles.tileData[i];
            var rect = spriteData.tileData[tile.tileIndex];
            this._transformForSub(tile, rect);
            wrapper.setTransform(this._tileWorldTransform, scaleX, scaleY);
            this._drawSprite(wrapper, texture, rect, tile);
        }

        cc.g_NumberOfDraws++;
    };

    // Base Sprite of fishes WebGL render command
    BaseSprite.WebGLRenderCmd = function (renderable) {
        cc.Sprite.WebGLRenderCmd.call(this, renderable);

        this._tileTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
        this._tileWorldTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
    };

    var webGLProto = BaseSprite.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    webGLProto.constructor = BaseSprite.WebGLRenderCmd;

    webGLProto.uploadData = function (f32Buffer, ui32Buffer, vertexDataOffset) {
        var node = this._node, locTexture = node._texture;
        if (!(locTexture && locTexture._textureLoaded && node._rect.width && node._rect.height) || !this._displayedOpacity)
            return false;

        // Fill in vertex data with quad information (4 vertices for sprite)
        var opacity = this._displayedOpacity;
        var r = this._displayedColor.r,
            g = this._displayedColor.g,
            b = this._displayedColor.b;
        if (node._opacityModifyRGB) {
            var a = opacity / 255;
            r *= a;
            g *= a;
            b *= a;
        }
        this._color[0] = ((opacity<<24) | (b<<16) | (g<<8) | r);
        var z = node._vertexZ;

        var spriteData = node._sd;
        var frameIdx = spriteData.actionData[node._actionIndex].frames[node._sequenceIndex].index;
        var tiles = spriteData.frameData[frameIdx];

        var len = 0, vertices = this._vertices, offset = vertexDataOffset, vertex;
        for (var i = 0; i < tiles.tileCount; i++) {
            var tile = tiles.tileData[i];
            var rect = spriteData.tileData[tile.tileIndex];

            this._setTextureCoordsForSub(tile, rect);
            this._transformForSub(tile, rect);

            var vLen = vertices.length;
            for(var j = 0; j < vLen; j++) {
                vertex = vertices[j];
                f32Buffer[offset] = vertex.x;
                f32Buffer[offset + 1] = vertex.y;
                f32Buffer[offset + 2] = z;
                ui32Buffer[offset + 3] = this._color[0];
                f32Buffer[offset + 4] = vertex.u;
                f32Buffer[offset + 5] = vertex.v;
                offset += 6;
            }
            len += vLen;
        }
        return len;
    };

    webGLProto._transformForSub = function (tile, rect) {
        var pt = this._worldTransform;
        var anchorPoint = tile.anchorPt;

        var t = this._tileTransform,
            wt = this._tileWorldTransform;         //get the world transform

        var position = tile.position, rotation = tile.angle;

        var hasRotation = rotation !== 0;
        var sx = tile.scale[0], sy = tile.scale[1];
        var appX = anchorPoint.x * rect.width, appY = anchorPoint.y * rect.height;

        if (hasRotation) {
            // position
            t.tx = position.x;
            t.ty = position.y;

            // rotation
            if (hasRotation) {
                var rotationRadiansX = rotation * 0.017453292519943295;  //0.017453292519943295 = (Math.PI / 180);   for performance
                t.c = Math.sin(rotationRadiansX);
                t.d = Math.cos(rotationRadiansX);
                t.a = t.d;
                t.b = -t.c;
            }

            // scale
            t.a *= sx;
            t.b *= sx;
            t.c *= sy;
            t.d *= sy;

            if (appX || appY) {
                t.tx -= t.a * appX + t.c * appY;
                t.ty -= t.b * appX + t.d * appY;
            }

            // cc.AffineTransformConcat is incorrect at get world transform
            wt.a = t.a * pt.a + t.b * pt.c;                               //a
            wt.b = t.a * pt.b + t.b * pt.d;                               //b
            wt.c = t.c * pt.a + t.d * pt.c;                               //c
            wt.d = t.c * pt.b + t.d * pt.d;                               //d
            wt.tx = pt.a * t.tx + pt.c * t.ty + pt.tx;
            wt.ty = pt.d * t.ty + pt.ty + pt.b * t.tx;
        } else {
            t.a = sx;
            t.b = 0;
            t.c = 0;
            t.d = sy;
            t.tx = position.x;
            t.ty = position.y;

            if (appX || appY) {
                t.tx -= t.a * appX;
                t.ty -= t.d * appY;
            }

            wt.a = t.a * pt.a + t.b * pt.c;
            wt.b = t.a * pt.b + t.b * pt.d;
            wt.c = t.c * pt.a + t.d * pt.c;
            wt.d = t.c * pt.b + t.d * pt.d;
            wt.tx = t.tx * pt.a + t.ty * pt.c + pt.tx;
            wt.ty = t.tx * pt.b + t.ty * pt.d + pt.ty;
        }

        var node = this._node,
            lx = node._offsetPosition.x, rx = lx + rect.width,
            by = node._offsetPosition.y, ty = by + rect.height;

        var vertices = this._vertices;
        vertices[0].x = lx * wt.a + ty * wt.c + wt.tx; // tl
        vertices[0].y = lx * wt.b + ty * wt.d + wt.ty;
        vertices[1].x = lx * wt.a + by * wt.c + wt.tx; // bl
        vertices[1].y = lx * wt.b + by * wt.d + wt.ty;
        vertices[2].x = rx * wt.a + ty * wt.c + wt.tx; // tr
        vertices[2].y = rx * wt.b + ty * wt.d + wt.ty;
        vertices[3].x = rx * wt.a + by * wt.c + wt.tx; // br
        vertices[3].y = rx * wt.b + by * wt.d + wt.ty;
    };

    webGLProto._setTextureCoordsForSub = function (tile, rect) {
        //rect = cc.rectPointsToPixels(rect);  //todo need test
        var node = this._node;

        var tex = node._batchNode ? node.textureAtlas.texture : node._texture;
        var uvs = this._vertices;
        if (!tex)
            return;

        var atlasWidth = tex.pixelsWidth;
        var atlasHeight = tex.pixelsHeight;

        var left, right, top, bottom, tempSwap;
        left = rect.x / atlasWidth;
        right = (rect.x + rect.width) / atlasWidth;
        top = rect.y / atlasHeight;
        bottom = (rect.y + rect.height) / atlasHeight;

        var _flippedX = tile.flip[0], _flippedY = tile.flip[1];
        if (_flippedX) {
            tempSwap = left;
            left = right;
            right = tempSwap;
        }

        if (_flippedY) {
            tempSwap = top;
            top = bottom;
            bottom = tempSwap;
        }

        uvs[0].u = left;   // tl
        uvs[0].v = top;    // tl
        uvs[1].u = left;   // bl
        uvs[1].v = bottom; // bl
        uvs[2].u = right;  // tr
        uvs[2].v = top;    // tr
        uvs[3].u = right;  // br
        uvs[3].v = bottom; // br
    };
    return BaseSprite;
})();