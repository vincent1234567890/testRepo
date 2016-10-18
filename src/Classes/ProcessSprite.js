var kTagProcessSprite = 50;
var kTagBlood = 51;
var kActionMoveTo = 52;

var kFullState = 0;
var kHalfState = 1;
var kLessState = 2;

var ProcessDef = cc.Class.extend({
    backgroundImage:null,
    bloodImage:null,
    offset:null,
    totalValue:null,
    currentValue:null,
    curState:kFullState,
    preState:kFullState,
    getTotalValue:function () {
        return this.totalValue;
    },
    setTotalValue:function (v) {
        this.totalValue = v;
    },
    getCurrentValue:function () {
        return this.currentValue;
    },
    setCurrentValue:function (v) {
        this.currentValue = v;
    },
    getCurState:function () {
        return this.curState;
    },
    setCurState:function (v) {
        this.curState = v;
    },
    getPreState:function () {
        return this.preState;
    },
    setPreState:function (v) {
        this.preState = v;
    },
    getBackgroundImage:function () {
        return this.backgroundImage;
    },
    setBackgroundImage:function (str) {
        this.backgroundImage = str;
    },
    getBloodImage:function () {
        return this.bloodImage;
    },
    setBloodImage:function (str) {
        this.bloodImage = str;
    },
    getOffset:function () {
        return this.offset;
    },
    setOffset:function (s) {
        this.offset = s;
    }
});

ProcessDef.defaultDef = function () {
    var temp = new ProcessDef();
    temp.totalValue = 100;
    temp.currentValue = 50;
    temp.backgroundImage = "ui_slot_01.png";
    temp.bloodImage = "ui_slot_02.png";
    temp.offset = cc.SizeMake(0, 0);
    return temp;
};

var ProcessSprite = cc.Sprite.extend({
    processDef:0,
    originalBloodSize:null,
    originalPosition:null,
    fullSprite:0,
    halfSprite:0,
    lessSprite:0,
    moveSprite:0,
    isPlayineFade:false,
    needFade:false,
    getNeedFade:function () {
        return this.needFade;
    },
    setNeedFade:function (v) {
        this.needFade = v;
    },
    initWithDef:function (def) {
        if (def == 0) {
            return false;
        }
        this.needFade = false;
        if (this.initWithFile(ImageName(def.getBackgroundImage()))) {
            this.processDef = def;
            this.fullSprite = cc.Sprite.create(ImageName(def.getBloodImage()));
            this.halfSprite = cc.Sprite.create(ImageName(def.getBloodImage()));
            this.lessSprite = cc.Sprite.create(ImageName(def.getBloodImage()));
            var sprite = cc.Sprite.create(ImageName(def.getBloodImage()));

            this.originalBloodSize = sprite.getContentSize();
            this.addChild(sprite, 1, kTagBlood);
            this.originalPosition = cc.p(0/* + def.getOffset().width*/, sprite.getContentSize().height / 2/* + def.getOffset().height*/);
            sprite.setPosition(this.originalPosition);

            var spriteBg = cc.Sprite.create(ImageName(def.getBackgroundImage()));
            this.addChild(spriteBg, 2);
            spriteBg.setPosition(cc.p(spriteBg.getContentSize().width / 2, spriteBg.getContentSize().height / 2));

            this.updatePosition();
        }
        return true;
    },
    setBloodValue:function (value) {
        if (value > this.processDef.getTotalValue()) {
            return;
        }
        this.processDef.setCurrentValue(value);
        var processSprite = this.getChildByTag(kTagBlood);
        if (value <= this.processDef.getTotalValue() / 3) {
            if (!this.needFade) {
                this.needFade = true;
                this.isPlayineFade = false;
            }
            processSprite.setDisplayFrame(this.lessSprite.displayFrame());
        }
        else if (value <= this.processDef.getTotalValue() / 2) {
            processSprite.setDisplayFrame(this.halfSprite.displayFrame());
            this.needFade = false;
            this.isPlayineFade = false;
        }
        else {
            processSprite.setDisplayFrame(this.fullSprite.displayFrame());
            this.needFade = false;
            this.isPlayineFade = false;
        }

        var fadeOut = cc.FadeOut.create(0.2);
        var fadeIn = cc.FadeIn.create(0.2);
        var sequ = cc.Sequence.actions(fadeOut, fadeIn, 0);
        var forever = cc.RepeatForever.create(sequ);
        if (this.needFade) {
            if (!this.isPlayineFade) {
                this.isPlayineFade = true;
            }
        }
        else {
            processSprite.stopAllActions();
            processSprite.setOpacity(255);
        }

        this.updatePosition();
    },
    updatePosition:function () {
        var processSprite = this.getChildByTag(kTagBlood);
        var ratio = this.processDef.getCurrentValue() / this.processDef.getTotalValue();

        if (ratio > 1.0) {
            ratio = 1.0;
        }

        processSprite.setTextureRect(new cc.Rect(0, 0, this.originalBloodSize.width * ratio, this.originalBloodSize.height));

        var pos = cc.pAdd(this.originalPosition, cc.p(processSprite.getContentSize().width / 2, 0));
        processSprite.setPosition(pos);

        if (this.moveSprite) {
            this.moveSprite.setAnchorPoint(cc.p(0, 0));
            this.moveSprite.setPosition(cc.p(this.originalBloodSize.width * (ratio) - 3 - 5 * (ratio), 2));
        }
    },

    getProcessDef:function () {
        return this.processDef;
    },
    setProcessDef:function (def) {
        this.processDef = def;
    },
    getOriginalBloodSize:function () {
        return this.originalBloodSize;
    },
    setOriginalBloodSize:function (s) {
        this.originalBloodSize = s;
    },
    getOriginalPosition:function () {
        return this.originalPosition;
    },
    setOriginalPosition:function (p) {
        this.originalPosition = p;
    },
    getFullSprite:function () {
        return this.fullSprite;
    },
    setFullSprite:function (sprite) {
        if (sprite != this.fullSprite) {
            this.fullSprite = sprite;
        }
    },
    getHalfSprite:function () {
        return this.halfSprite;
    },
    setHalfSprite:function (sprite) {
        if (sprite != this.halfSprite) {
            this.halfSprite = sprite;
        }
    },
    getLessSprite:function () {
        return this.lessSprite;
    },
    setLessSprite:function (sprite) {
        if (sprite != this.lessSprite) {
            this.lessSprite = sprite;
        }
    },
    getMoveSprite:function () {
        return this.moveSprite;
    },
    setMoveSprite:function (sprite) {
        if (sprite != this.moveSprite) {
            this.moveSprite = sprite;
        }
    }
});