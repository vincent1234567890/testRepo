var FishNetActor = BaseActor.extend({
    _particle:null,
    _hitRandom:null,
    _hitRandomArray:null,
    _aliveTime:null,
    _passTime:null,
    _curRatio:null,
    _groupFlag:null,
    _fishNetSource:null,
    _curWeaponLevel:null,
    _beginAnimation:null,
    _shootFlag:null,
    _actorType:null,
    _netLevel:null,
    initWithDef:function (def, weaponType) {
        this.initWithSpriteName("bullet", "SmallItem.png");

        this.setGroup(GroupFishNetActor);
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel1);
        this._aliveTime = 1.0;
        this._passTime = 0.0;
        this._curRatio = 100;
        this.setFishNetSource(FishNetSource.eFishNetSourceBullet);
        return true;
    },

    resetState:function () {
        this._super();
        this.setBeginAnimation(true);
        this._passTime = 0.0;
        this._curAction = 0;
        this.setCurRatio(100);
        this.setAction(this._curAction);
        this.setActorType(ActorType.eActorTypeNormal);
        this.setFishNetSource(FishNetSource.eFishNetSourceBullet);
    },
    removeSelfFromScene:function () {
        if (this._particle) {
            this._particle.stopSystem();
            this._particle.setVisible(false);
            this._particle.removeFromParentAndCleanup(true);
        }

        this.setParticle(null);

        if (PlayerActor.sharedActor().getCurConsume() >= GameSetting.getInstance().getConsumeMoney()) {
            var scene = PlayerActor.sharedActor().getScene();
            var stage = scene.getOddsNumber();
            GameSetting.getInstance().computeReturnRatio(stage);
        }
        this._super();
    },
    getBaseActortype:function () {
        return BaseActorType.eFishNetActor;
    },
    getHitRandomFromLevel:function (level) {
        return 1;
    },
    playCatchAction:function () {
        this.playAction(this._curWeaponLevel - 1);
        this.setActionDidStopSelector(this.removeSelfFromScene, this);
    },
    canSecKilling:function () {
        var levelAvaliable = (this.getCurWeaponLevel() == FishWeaponType.eWeaponLevel7);
        var sourceAvaliable = (this.getFishNetSource() == FishNetSource.eFishNetSourceBullet);
        var ret = levelAvaliable && sourceAvaliable;
        return ret;
    },

    getParticle:function () {
        return this._particle;
    },
    setParticle:function (v) {
        if (v != this._particle) {
            this._particle = v;
        }
    },
    getCurRatio:function () {
        return this._curRatio;
    },
    setCurRatio:function (v) {
        this._curRatio = v;
    },
    getGroupFlag:function () {
        return this._groupFlag;
    },
    setGroupFlag:function (v) {
        this._groupFlag = v;
    },
    getFishNetSource:function () {
        return this._fishNetSource;
    },
    setFishNetSource:function (v) {
        this._fishNetSource = v;
    },
    getCurWeaponLevel:function () {
        return this._curWeaponLevel;
    },
    setCurWeaponLevel:function (v) {
        this._curWeaponLevel = v;
    },
    getBeginAnimation:function () {
        return this._beginAnimation;
    },
    setBeginAnimation:function (v) {
        this._beginAnimation = v;
    },

    getShootFlag:function () {
        return this._shootFlag;
    },
    setShootFlag:function (v) {
        this._shootFlag = v;
    },

    getActorType:function () {
        return this._actorType;
    },
    setActorType:function (v) {
        this._actorType = v;
    },

    getNetLevel:function () {
        return this._netLevel;
    },
    setNetLevel:function (v) {
        this._netLevel = v;
    }
});


var FishNetActor1 = FishNetActor.extend({
    initWithDef:function (def) {
        //return this._super(def, FishWeaponType.eWeaponLevel1);
        this.initWithSpriteName("bullet", "SmallItem.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel1);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(this.getCurWeaponLevel() - 1);
    }
});

var FishNetActor2 = FishNetActor.extend({
    initWithDef:function (def, weaponType) {
        //return this._super(def, FishWeaponType.eWeaponLevel2);
        this.initWithSpriteName("bullet", "SmallItem.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel2);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(this.getCurWeaponLevel() - 1);
    }
});

var FishNetActor3 = FishNetActor.extend({
    initWithDef:function (def, weaponType) {
        //return this._super(def, FishWeaponType.eWeaponLevel3);
        this.initWithSpriteName("bullet", "SmallItem.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel3);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(this.getCurWeaponLevel() - 1);
    }
});

var FishNetActor4 = FishNetActor.extend({
    initWithDef:function (def, weaponType) {
        //return this._super(def, FishWeaponType.eWeaponLevel4);
        this.initWithSpriteName("bullet", "SmallItem.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel4);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(this.getCurWeaponLevel() - 1);
    }
});

var FishNetActor5 = FishNetActor.extend({
    initWithDef:function (def, weaponType) {
        //return this._super(def, FishWeaponType.eWeaponLevel5);
        this.initWithSpriteName("bullet", "SmallItem.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel5);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(this.getCurWeaponLevel() - 1);
    }
});

var FishNetActor6 = FishNetActor.extend({
    initWithDef:function (def, weaponType) {
        //return this._super(def, FishWeaponType.eWeaponLevel6);
        this.initWithSpriteName("bullet", "SmallItem.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel6);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(this.getCurWeaponLevel() - 1);
    }
});

var FishNetActor7 = FishNetActor.extend({
    initWithDef:function (def, weaponType) {
        //return this._super(def, FishWeaponType.eWeaponLevel7);
        this.initWithSpriteName("bullet", "SmallItem.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel7);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(this.getCurWeaponLevel() - 1);
    }
});

var FishNetActor10 = FishNetActor.extend({
    initWithDef:function (def, weaponType) {
        //return this._super(def, FishWeaponType.eWeaponLevel10);
        this.initWithSpriteName("bullet10", "bullet10.png");
        this.setCurWeaponLevel(FishWeaponType.eWeaponLevel10);
        this._aliveTime = 1.0;
        this.setGroup(GroupFishNetActor);
        this.playAction(0);
    }
});