var Starfish = BaseActor.extend({
    _isMoveToFirst:false,
    speed:0,
    delta:0,
    delIng:false,
    firstPt:cc.p(0, 0),
    index:0,
    centerPt:null,
    moveAgle:0,
    multiple:1,
    ctor:function (def) {
        this._def = def;
        this._super(res.StarfishSprite, res.StarfishPNG);
        this.playAction(0);
        this.setGroup(GroupStarfishActor);
        this._isMoveToFirst = false;
        this.delta = cc.pNormalize(cc.p(-512, -384));
        this.speed = 400;
        this.delIng = false;
    },
    getDelIng:function () {
        return this.delIng;
    },
    setDelIng:function (v) {
        this.delIng = v;
    },
    getFirstPt:function () {
        return this.firstPt;
    },
    setFirstPt:function (v) {
        this.firstPt = v;
    },
    getIndex:function () {
        return this.index;
    },
    setIndex:function (v) {
        this.index = v;
    },
    getCenterPt:function () {
        return this.centerPt;
    },
    setCenterPt:function (v) {
        this.centerPt = v;
    },
    getMoveAgle:function () {
        return this.moveAgle;
    },
    setMoveAgle:function (v) {
        this.moveAgle = v;
    },
    getMultiple:function () {
        return this.multiple;
    },
    setMultiple:function (v) {
        this.multiple = v;
    },
    addScoreNumber:function () {
        var labelNum = cc.LabelAtlas.create(10 * this.multiple, ImageName("prizenum.png"), PrizeNum_TextWidth, PrizeNum_TextHeight, '0');
        var prizeSprite = new cc.Sprite("#prizesign1.png");

        var movePoition = cc.p(0, 48);
        var move = cc.p(prizeSprite.getContentSize().width / 2, -prizeSprite.getContentSize().height / 2);

        var sequ = cc.sequence(cc.fadeIn(0.35), cc.delayTime.create(0.35), cc.fadeOut(0.35));
        var spawn = cc.spawn(sequ, cc.moveBy(1.05, movePoition));
        prizeSprite.runAction(cc.sequence(spawn, cc.callFunc(this.getScene().removeSprite, this.getScene())));
        prizeSprite.setPosition(this.getPosition());
        prizeSprite.setScale(1);

        var sequ1 = cc.sequence(cc.fadeIn(0.35), cc.delayTime(0.35), cc.fadeOut(0.35));
        var spawn1 = cc.spawn(sequ1, cc.moveBy(1.05, movePoition));

        labelNum.runAction(cc.sequence(spawn1, cc.callFunc(this.getScene().removeSprite, this.getScene())));
        labelNum.setPosition(cc.pAdd(this.getPosition(), move));
        this.getScene().addChild(labelNum, 100);
        this.getScene().addChild(prizeSprite, 100);
    },
    DeleteStarfish:function () {
        if (this.delIng) {
            return;
        }
        this.delIng = true;
        this.playAction(1);
        cc.director.getScheduler().schedule(this.addGold, this, 0.5, false);
    },
    addGold:function (dt) {
        cc.director.getScheduler().unschedule(this.addGold, this);
        playEffect(COIN_EFFECT1);
        var particle = new cc.ParticleSystem(ImageName("goldlizi.plist"));
        var goldcoin = ActorFactory.create("GoldPrizeActor");
        goldcoin.setPoint(10 * this.multiple);
        goldcoin.setPosition(this.getPosition());
        goldcoin.setParticle(particle);
        goldcoin.resetState();
        goldcoin.dropGoldPrizeWithFishPoint(goldcoin.getPosition(), cc.p(384, 0));
        particle.setPosition(this.getPosition());
        this.getScene().addChild(particle, 10);
        this.getScene().addActor(goldcoin);

        this.addScoreNumber();
        PlayerActor.sharedActor().setPlayerMoney(PlayerActor.sharedActor().getPlayerMoney() + 10 * this.multiple);
        //ApparkDataManagerWrapper.addCoinsEarned(10 * this.multiple);
        this.removeSelfFromScene();
    },
    initFirstPt:function (pt) {
        this.setFirstPt(pt);
        this.delta = cc.pNormalize(cc.pSub(this.getFirstPt(), VisibleRect.topRight()));
    },

    update:function (dt) {
        if (this._isMoveToFirst) {
            this.moveByCircle(dt);
        }
        else {
            this.moveByLine(dt);
        }

        this._super();
        var _time = cc.Time.gettimeofdayCocos2d();

        if (!this._firstUpdate) {
            this._firstUpdate = true;
            this._lastTime = _time;
        }

        var dms = this._sd.actionData[this._actionIndex].frames[this._sequenceIndex].delay / 1000;
        var subTime = (_time.tv_sec - this._lastTime.tv_sec) + (_time.tv_usec - this._lastTime.tv_usec) / 1000000.0;

        if (((subTime >= dms) || (subTime < 0)) && !this._stopByNotLoop) {
            this._sequenceIndex = (this._sequenceIndex + 1) % this._sd.actionData[this._actionIndex].frameCount;
            this._lastTime = _time;

            if (!this._sd.actionData[this._actionIndex].loop && ((this._sequenceIndex + 1) == this._sd.actionData[this._actionIndex].frameCount)) {
                this._stopByNotLoop = true;
                if (this._delegate && this._didStopSelector) {
                    this._didStopSelector.call(this._delegate);
                }
            }
        }
    },
    resetState:function () {
        this._isMoveToFirst = false;
        this.delIng = false;
        this._super();
    },
    collideWith:function (plane) {
        if (plane instanceof LevinStormBulletActor || plane instanceof  RayBulletActor) {
            return false;
        }

        return this.handleCollide(plane);
    },
    removeSelfFromScene:function () {
        cc.director.getScheduler().unscheduleAllSelectorsForTarget(this);
        this._super();
    },
    moveByLine:function (dt) {
        if (this._isMoveToFirst) {
            return;
        }

        this.setPosition(cc.pAdd(this.getPosition(), cc.p(this.speed * 0.017 * this.delta.x, this.speed * 0.017 * this.delta.y)));
        if (this.getPosition().x < this.getFirstPt().x && this.getPosition().y < this.getFirstPt().y) {
            this._isMoveToFirst = true;
        }
    },
    moveByCircle:function (dt) {
        //moveAngle
    }
});