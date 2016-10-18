var kOverlapPixels = 5.0;
var speedValue = 160;
var PARAM_X = screenWidth / 1280.0;
var PARAM_Y = screenHeight / 752.0;

var GameBackgroundLayer = cc.Layer.extend({
    _bgIdx:0,
    _bg:null,
    _spsprite:false,
    beChanged:null,
    initWith:function (level) {
        if (this.init()) {
            this._bgIdx = level;
            this.initBackground(this._bgIdx);
            // cc.spriteFrameCache.addSpriteFrames("npc.plist");
            this.playMusic(level);
        }
        return true;
    },

    transition:function () {
        this.beChanged = false;
        cc.spriteFrameCache.addSpriteFrames(ImageName("sea.plist"));
        this.schedule(this.updateBg);
        this.playsea();
    },
    updateBg:function (dt) {
        var s = this.getChildByTag(100);
        var x = s.getPosition().x - dt * 200;
        for (var i = 0; i < 12; i++) {
            var sp = this.getChildByTag(100 + i);
            sp.setPosition(cc.pAdd(sp.getPosition(), cc.p(-dt * speedValue, 0)));
        }

        var w = screenWidth - x;
        if (w <= 0) w = 0;
        if (w >= screenWidth) w = screenWidth;

        if (this.beChanged) {
            var bg = this.getChildByTag(991);
            bg.setTextureRect(new cc.Rect(0, 0, bg.getTextureRect().width - dt * speedValue, screenHeight));
            if (bg.getTextureRect().width < 0) {
                this.beChanged = false;
                bg.setTextureRect(new cc.Rect(0,0,0,0));
                var sp = this.getChildByTag(990);
                this.reorderChild(sp, -2);
                bg.removeFromParentAndCleanup(true);
            }
        }

        if (x <= -s.getContentSize().width / 2) {
            for (var i = 0; i < 12; i++) {
                this.getChildByTag(100 + i).stopAllActions();
                this.removeChildByTag(100 + i, true);
            }
            cc.spriteFrameCache.removeSpriteFramesFromFile(ImageName("sea.plist"));

            this.unschedule(this.updateBg);
        }
    },
    shakeScreen:function () {
    },
    playMusic:function (level) {
        switch (level) {
            case 1:
                playMusic(BACK_MUSIC1, true);
                break;
            case 2:
                playMusic(BACK_MUSIC2, true);
                break;
            case 3:
                playMusic(BACK_MUSIC3, true);
                break;
            default:
                break;
        }
    },
    removeFromParentAndCleanup:function (cleanup) {
        cc.spriteFrameCache.removeSpriteFramesFromFile(ImageName("sea.plist"));
        this._super(cleanup);
    },
    getBgIdx:function () {
        return this._bgIdx;
    },
    setBgIdx:function (v) {
        this._bgIdx = v;
    },
    getSpsprite:function () {
        return this._spsprite;
    },
    setSpsprite:function (v) {
        this._spsprite = v;
    },
    addSpriteX:function (file, imageFile, p, r, sc) {
        var sprite = new SPSprite();
        sprite.initWithFile(file);
        var s = cc.SpriteBatchNode.create(imageFile);

        s.setPosition(p);
        s.setRotation(r);
        s.setScale(sc);
        this.addChild(s);
        sprite.setAction(0);
        sprite.setUpdatebySelf(true);
        this.setSpsprite(sprite);
    },
    removeEffect:function (sender) {
        sender.removeFromParentAndCleanup(true);
    },
    initNPCLevel1:function () {
        for (var i = 0; i < 7; i++) {
            var tmp = this.getChildByTag(993 + i);
            if (tmp) {
                this.removeChild(tmp, true);
            }
        }
        var haibei1 = cc.Sprite.createWithSpriteFrameName("haibei_001.png");
        var haibeiAni = this.haibeiAni();
        haibei1.runAction(haibeiAni);
        this.addChild(haibei1, 0, 999);
        haibei1.setPosition(cc.p(375 * PARAM_X, 593 * PARAM_Y));

        var pangxie = cc.Sprite.createWithSpriteFrameName("pangxie_001.png");
        var pangxieAni1 = this.pangxieAni();
        pangxie.runAction(pangxieAni1);
        this.addChild(pangxie, 0, 997);
        pangxie.setPosition(cc.p(671 * PARAM_X, 588 * PARAM_Y));

        var haixing = cc.Sprite.createWithSpriteFrameName("haixing_001.png");
        var haixingAni1 = this.haixingAni();
        haixing.runAction(haixingAni1);
        this.addChild(haixing, 0, 996);
        haixing.setPosition(cc.p(656 * PARAM_X, 423 * PARAM_Y));

        var longxia1 = cc.Sprite.createWithSpriteFrameName("longxia_001.png");
        var longxiaAni1 = this.longxiaAni();
        longxia1.runAction(longxiaAni1);
        this.addChild(longxia1, 0, 995);
        longxia1.setRotation(100);
        longxia1.setPosition(cc.p(1004 * PARAM_X, 494 * PARAM_Y));

        var longxia2 = cc.Sprite.createWithSpriteFrameName("longxia_001.png");
        var longxiaAni2 = this.longxiaAni();
        longxia2.runAction(longxiaAni2);
        this.addChild(longxia2, 0, 994);
        longxia2.setRotation(30);
        longxia2.setPosition(cc.p(373 * PARAM_X, 69 * PARAM_Y));

        var longxia3 = cc.Sprite.createWithSpriteFrameName("longxia_001.png");
        var longxiaAni3 = this.longxiaAni();
        longxia3.runAction(longxiaAni3);
        longxia3.setRotation(290);
        this.addChild(longxia3, 0, 993);
        longxia3.setPosition(cc.p(725 * PARAM_X, 103 * PARAM_Y));
    },
    initNPCLevel2:function () {
        for (var i = 0; i < 7; i++) {
            var tmp = this.getChildByTag(993 + i);
            if (tmp) {
                this.removeChild(tmp, true);
            }
        }

        var pangxie = cc.Sprite.createWithSpriteFrameName("pangxie_001.png");
        var pangxieAni1 = this.pangxieAni();
        pangxie.runAction(pangxieAni1);
        this.addChild(pangxie, 0, 999);
        pangxie.setPosition(cc.p(181 * PARAM_X, 196 * PARAM_Y));

        var pangxie2 = cc.Sprite.createWithSpriteFrameName("pangxie_001.png");
        var pangxieAni2 = this.pangxieAni();
        pangxie2.runAction(pangxieAni2);
        this.addChild(pangxie2, 0, 998);
        pangxie2.setPosition(cc.p(1088 * PARAM_X, 632 * PARAM_Y));

        var pangxie3 = cc.Sprite.createWithSpriteFrameName("pangxie_001.png");
        var pangxieAni3 = this.pangxieAni();
        pangxie3.runAction(pangxieAni3);
        this.addChild(pangxie3, 0, 997);
        pangxie3.setPosition(cc.p(181 * PARAM_X, 196 * PARAM_Y));


        var jijuxie1 = cc.Sprite.createWithSpriteFrameName("jijuxie_001.png");
        var pjijuxieAni1 = this.jijuxieAni();
        jijuxie1.runAction(pjijuxieAni1);
        this.addChild(jijuxie1, 0, 996);
        jijuxie1.setPosition(cc.p(516 * PARAM_X, 118 * PARAM_Y));

        var haima1 = cc.Sprite.createWithSpriteFrameName("haima_001.png");
        var haimaAni1 = this.haimaAni();
        haima1.runAction(haimaAni1);
        this.addChild(haima1, 0, 995);
        haima1.setPosition(cc.p(191 * PARAM_X, 313 * PARAM_Y));

        var haima2 = cc.Sprite.createWithSpriteFrameName("haima_001.png");
        var haimaAni2 = this.haimaAni();
        haima2.runAction(haimaAni1);
        this.addChild(haima2, 0, 994);
        haima2.setPosition(cc.p(903 * PARAM_X, 487 * PARAM_Y));

        var longxia1 = cc.Sprite.createWithSpriteFrameName("longxia_001.png");
        var longxiaAni1 = this.longxiaAni();
        longxia1.runAction(longxiaAni1);
        this.addChild(longxia1, 0, 993);
        longxia1.setRotation(100);
        longxia1.setPosition(cc.p(306 * PARAM_X, 597 * PARAM_Y));
    },
    initNPCLevel3:function () {
        for (var i = 0; i < 7; i++) {
            var tmp = this.getChildByTag(993 + i);
            if (tmp) {
                this.removeChild(tmp, true);
            }
        }

        var pangxie = cc.Sprite.createWithSpriteFrameName("pangxie_001.png");
        var pangxieAni1 = this.pangxieAni();
        pangxie.runAction(pangxieAni1);
        this.addChild(pangxie, 0, 999);
        pangxie.setPosition(cc.p(246 * PARAM_X, 222 * PARAM_Y));

        var haixing = cc.Sprite.createWithSpriteFrameName("haixing_001.png");
        var haixingAni1 = this.haixingAni();
        haixing.runAction(haixingAni1);
        this.addChild(haixing, 0, 998);
        haixing.setPosition(cc.p(884 * PARAM_X, 349 * PARAM_Y));

        var jijuxie1 = cc.Sprite.createWithSpriteFrameName("jijuxie_001.png");
        var pjijuxieAni1 = this.jijuxieAni();
        jijuxie1.runAction(pjijuxieAni1);
        this.addChild(jijuxie1, 0, 997);
        jijuxie1.setPosition(cc.p(191 * PARAM_X, 304 * PARAM_Y));

        var jijuxie2 = cc.Sprite.createWithSpriteFrameName("jijuxie_001.png");
        var pjijuxieAni2 = this.jijuxieAni();
        jijuxie2.runAction(pjijuxieAni2);
        this.addChild(jijuxie2, 0, 996);
        jijuxie2.setPosition(cc.p(1063 * PARAM_X, 173 * PARAM_Y));

        var longxia1 = cc.Sprite.createWithSpriteFrameName("longxia_001.png");
        var longxiaAni1 = this.longxiaAni();
        longxia1.runAction(longxiaAni1);
        this.addChild(longxia1, 0, 995);
        longxia1.setRotation(100);
        longxia1.setPosition(cc.p(463 * PARAM_X, 450 * PARAM_Y));
    },
    initNPCLevel4:function () {
        for (var i = 0; i < 7; i++) {
            var tmp = this.getChildByTag(993 + i);
            if (tmp) {
                this.removeChild(tmp, true);
            }
        }

        var haibei1 = cc.Sprite.createWithSpriteFrameName("haibei_001.png");
        var haibeiAni = this.haibeiAni();
        haibei1.runAction(haibeiAni);
        this.addChild(haibei1, 0, 999);
        haibei1.setPosition(cc.p(940 * PARAM_X, 113 * PARAM_Y));

        var haixing = cc.Sprite.createWithSpriteFrameName("haixing_001.png");
        var haixingAni1 = this.haixingAni();
        haixing.runAction(haixingAni1);
        this.addChild(haixing, 0, 998);
        haixing.setPosition(cc.p(998 * PARAM_X, 349 * PARAM_Y));

        var jijuxie1 = cc.Sprite.createWithSpriteFrameName("jijuxie_001.png");
        var pjijuxieAni1 = this.jijuxieAni();
        jijuxie1.runAction(pjijuxieAni1);
        this.addChild(jijuxie1, 0, 997);
        jijuxie1.setPosition(cc.p(931 * PARAM_X, 401 * PARAM_Y));

        var haima1 = cc.Sprite.createWithSpriteFrameName("haima_001.png");
        var haimaAni1 = this.haimaAni();
        haima1.runAction(haimaAni1);
        this.addChild(haima1, 0, 996);
        haima1.setPosition(cc.p(401 * PARAM_X, 289 * PARAM_Y));
    },
    initBackground:function (curStage) {
        if (curStage) {
            this._bgIdx = curStage;
            this._bg = cc.Sprite.create(ImageName("bj0" + curStage + "_01.jpg"));
        } else {
            this._bgIdx = 0;
            this._bg = cc.Sprite.create(ImageName("bj01_01.jpg"));
        }

        this._bg.setPosition(VisibleRect.center());
        this.addChild(this._bg, -2, 990);
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._bg.setScale(Multiple);

    },
    haibeiAni:function () {
        var frames = [];
        var cache = cc.spriteFrameCache;

        for (var i = 0; i < 25; i++) {
            var frame = cache.getSpriteFrame("haibei_001.png");
            frames.push(frame);
        }

        for (var i = 1; i < 6; i++) {
            var frame = cache.getSpriteFrame("haibei_00" + i + ".png");
            frames.push(frame);
        }

        for (var i = 0; i < 20; i++) {
            var frame = cache.getSpriteFrame("haibei_005.png");
            frames.push(frame);
        }

        for (var i = 5; i > 0; i--) {
            var frame = cache.getSpriteFrame("haibei_00" + i + ".png");
            frames.push(frame);
        }
        var animation = cc.Animation.create(frames, 0.15);
        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        return forever;
    },
    pangxieAni:function () {
        var frames = [];
        var cache = cc.spriteFrameCache;

        for (var i = 1; i < 6; i++) {
            var frame = cache.getSpriteFrame("pangxie_00" + i + ".png");
            frames.push(frame);
        }

        for (var i = 0; i < 10; i++) {
            var frame = cache.getSpriteFrame("pangxie_005.png");
            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, 0.15);
        var moveby = cc.MoveBy.create(0.75, cc.p(20, 20));
        var moveby1 = cc.MoveBy.create(1.5, cc.p(0, 0));

        var reverse = moveby.reverse();

        var sequ1 = cc.Sequence.actions(moveby, moveby1, reverse, moveby1, 0);
        var sequ2 = cc.Sequence.actions(cc.Animate.create(animation), cc.Animate.create(animation), 0);
        var spawn = cc.Spawn.create(sequ1, sequ2);
        var forever = cc.RepeatForever.create(spawn);
        return forever;
    },
    haixingAni:function () {
        var frames = [];
        var cache = cc.spriteFrameCache;

        for (var i = 1; i < 6; i++) {
            var frame = cache.getSpriteFrame("haixing_00" + i + ".png");
            frames.push(frame);
        }

        for (var i = 5; i > 0; i--) {
            var frame = cache.getSpriteFrame("haixing_00" + i + ".png");
            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, 0.15);
        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        return forever;
    },
    longxiaAni:function () {
        var frames = [];
        var cache = cc.spriteFrameCache;

        for (var i = 1; i < 6; i++) {
            var frame = cache.getSpriteFrame("longxia_00" + i + ".png");
            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, 0.15);
        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        return forever;
    },
    jijuxieAni:function () {
        var frames = [];
        var cache = cc.spriteFrameCache;

        for (var i = 0; i < 15; i++) {
            var frame = cache.getSpriteFrame("jijuxie_005.png");
            frames.push(frame);
        }

        for (var i = 5; i > 0; i--) {
            var frame = cache.getSpriteFrame("jijuxie_00" + i + ".png");
            frames.push(frame);
        }

        for (var i = 0; i < 5; i++) {
            var frame = cache.getSpriteFrame("jijuxie_001.png");
            frames.push(frame);
        }

        for (var i = 1; i < 6; i++) {
            var frame = cache.getSpriteFrame("jijuxie_00" + i + ".png");
            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, 0.15);
        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        return forever;
    },
    haimaAni:function () {
        var frames = [];
        var cache = cc.spriteFrameCache;


        for (var i = 1; i < 5; i++) {
            var frame = cache.getSpriteFrame("haima_00" + i + ".png");
            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, 0.3);
        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        return forever;
    },
    initNPC:function (level) {
    },
    playsea:function (fabScale, yScale) {
        playEffect(SURF_EFFECT);
        if (fabScale == null) fabScale = 6;
        if (yScale == null) yScale = 60;

        var firstFrame = "water_001.png";
        var temp = 1;
        for (var i = 0; i < 12; i++) {
            temp++;
            if (temp > 10) {
                temp = 1;
            }
            var sprite = cc.Sprite.createWithSpriteFrameName(firstFrame);
            var p = temp;
            var frames = [];
            var cache = cc.spriteFrameCache;

            for (var j = 1; j <= 10; j++) {
                if (p > 10) {
                    p = 1;
                }
                var frameName = "water_0" + ((p < 10) ? "0" + p : p) + ".png";
                var frame = cache.getSpriteFrame(frameName);
                frames.push(frame);
                p++;
            }

            var animation = cc.Animation.create(frames, 0.1);

            sprite.runAction(cc.RepeatForever.create(cc.Animate.create(animation)));
            sprite.setAnchorPoint(cc.p(0.5, 0.5));
            sprite.setPosition(cc.p(VisibleRect.right().x + Math.abs((i - 4)) * fabScale, (i + 0.5) * yScale));
            this.addChild(sprite, 10, 100 + i);
        }
    },
    removeSprite:function (sender) {
        cc.spriteFrameCache.removeSpriteFramesFromFile(ImageName("sea.plist"));
        sender.removeFromParentAndCleanup(true);
    }
});


GameBackgroundLayer.create = function (level) {
    var ret = new GameBackgroundLayer();
    if (ret.initWith(level)) {
        return ret;
    }
    return null;
};