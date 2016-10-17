// 此枚举类型用于替换 isKindOfClass 函数的判断  
var BulletType = {
    eBaseBullet:0,
    eRayBullet:1,
    eLevinStormBullet:2,
    eHarpoonBullet:3,
    eSwirlBullet:4
};

var BulletActor = BaseActor.extend({
    _particle:null,
    _curWeaponLevel:0,
    _actorType:null,
    _damage:null,
    _speed:null,
    _startSize:null,
    _endSize:null,
    _beLive:null,
    _beHit:null,
    _groupFlag:null,
    _shootFlag:null,
    _targetPosition:null,
    _moveDirection:null,
    _gunShootDistance:null,
    _maxShootDistance:null,
    initWithDef:function (def) {
        var ret = this.initWithSpriteName("bullet", "SmallItem.png");

        if (ret) {
            this._group = GroupHeroBullet;
            this._curWeaponLevel = FishWeaponType.eWeaponLevel1;
            this.playAction(this._curWeaponLevel + 8);
        }

        return ret;
    },
    resetState:function () {
        this._super();
        this._actorType = ActorType.eActorTypeNormal;
        this._gunShootDistance = 0.0;
    },
    removeSelfFromScene:function () {
        if (this._particle) {
            this._particle.stopSystem();
            this._particle.setVisible(false);
            this._particle.removeFromParentAndCleanup(true);
            this.setParticle(null);
        }

        var curConsume = PlayerActor.sharedActor().getCurConsume();
        curConsume += this._curWeaponLevel;
        PlayerActor.sharedActor().setCurConsume(curConsume);
        this._super();
    },
    update:function (dt) {
        if (!this.getIsAlive()) {
            return;
        }
        this._gunShootDistance += this._speed * dt;
        if (this._gunShootDistance > this._maxShootDistance) {
            this.addFishNet();
        }

        if (this._gunShootDistance > this._maxShootDistance || !cc.Rect.CCRectContainsPoint(EScreenRect, this.getPosition())) {
            this._isAlive = false;
            this.removeSelfFromScene();
            return;
        }

        var nextStep = cc.pAdd(this.getPosition(), cc.p(this._speed * dt * this._moveDirection.x, this._speed * dt * this._moveDirection.y));
        var Dir = cc.pSub(nextStep, this.getPosition());
        //Dir = cc.pNormalize(Dir);
        var ang = Math.atan2(Dir.x, Dir.y);
        this.setPosition(nextStep);

        if (this._particle) {
            this._particle.setPosition(this.getPosition());
            if (ang < 0) {
                this._particle.setAngle(270 - ang / Math.PI * 180);
            }
            else {
                this._particle.setAngle(270 - ang / Math.PI * 180);
            }
        }
        this.setRotation(ang / Math.PI * 180);
    },
    updateInfo:function () {
        this._maxShootDistance = GameSetting.getInstance().getBulletDistanceArray()[this.getCurWeaponLevel()] * AutoAdapterScreen.getInstance().getScaleMultiple();
        this._speed = GameSetting.getInstance().getBulletSpeedArray()[this.getCurWeaponLevel() - 1];
    },
    getBaseActortype:function () {
        return BaseActorType.eBulletActor;
    },
    getBulletType:function () {
        return BulletType.eBaseBullet;
    },

    collisionEvent:function () {
        this.removeSelfFromScene();
    },
    finalEvent:function () {
    },
    addFishNet:function () {
        playEffect(NET_EFFECT);

        var cNetName = "FishNetActor" + this._curWeaponLevel;
        var net = ActorFactory.create(cNetName);

        var tempPar;
        if (this._curWeaponLevel == FishWeaponType.eWeaponLevel5) {
            tempPar = ParticleSystemFactory.getInstance().createParticle(ImageName("lizibianhua1.plist"));
            tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
        } else if (this._curWeaponLevel == FishWeaponType.eWeaponLevel6) {
            tempPar = ParticleSystemFactory.getInstance().createParticle(ImageName("lizibianhua2.plist"));
            tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
        } else if (this._curWeaponLevel == FishWeaponType.eWeaponLevel7) {
            tempPar = ParticleSystemFactory.getInstance().createParticle(ImageName("lizibianhua3.plist"));
            tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
        } else if (this._curWeaponLevel == FishWeaponType.eWeaponLevel10) {
            tempPar = ParticleSystemFactory.getInstance().createParticle(ImageName("lizibianhua3.plist"));
            tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
        } else {
            tempPar = ParticleSystemFactory.getInstance().createParticle(ImageName("yuwanglizi.plist"));
        }

        net.setParticle(tempPar);
        tempPar.setPosition(this.getPosition());

        //tempPar._dontTint = true;
        GameCtrl.sharedGame().getCurScene().addChild(tempPar, BulletActorZValue + 1);

        net.setGroup(GroupFishNetActor);
        net.resetState();
        net.updateInfo();
        net.setPosition(this.getPosition());
        net.setZOrder(BulletActorZValue);
        net.playCatchAction();
        net.setActorType(this._actorType);
        GameCtrl.sharedGame().getCurScene().addActor(net);
    },
    getParticle:function () {
        return this._particle;
    },
    setParticle:function (v) {
        if (v != this._particle) {
            this._particle = v;
        }
    },
    getCurWeaponLevel:function () {
        return this._curWeaponLevel;
    },
    setCurWeaponLevel:function (v) {
        this._curWeaponLevel = v;
    },
    getActorType:function () {
        return this._actorType;
    },
    setActorType:function (v) {
        this._actorType = v;
    },
    getDamage:function () {
        return this._damage;
    },
    setDamage:function (v) {
        this._damage = v;
    },
    getSpeed:function () {
        return this._speed;
    },
    setSpeed:function (v) {
        this._speed = v;
    },
    getStartSize:function () {
        return this._startSize;
    },
    setStartSize:function (v) {
        this._startSize = v;
    },
    getEndSize:function () {
        return this._endSize;
    },
    setEndSize:function (v) {
        this._endSize = v;
    },
    getBeLive:function () {
        return this._beLive;
    },
    setBeLive:function (v) {
        this._beLive = v;
    },
    getBeHit:function () {
        return this._beHit;
    },
    setBeHit:function (v) {
        this._beHit = v;
    },
    getTargetPosition:function () {
        return this._targetPosition;
    },
    setTargetPosition:function (v) {
        this._targetPosition = v;
    },
    getMoveDirection:function () {
        return this._moveDirection;
    },
    setMoveDirection:function (v) {
        this._moveDirection = v;
    },
    getGroupFlag:function () {
        return this._groupFlag;
    },
    setGroupFlag:function (v) {
        this._groupFlag = v;
    },
    getShootFlag:function () {
        return this._shootFlag;
    },
    setShootFlag:function (v) {
        this._shootFlag = v;
    }
});

var BulletActor10 = BulletActor.extend({
    initWithDef:function (def) {
        var spriteBN = GameCtrl.sharedGame().getCurScene().getChildByTag(TAG_BATCH_NODE_SMALLITEM);
        var ret = this.initWithSpriteName("bullet10", "bullet10.png");
        if (ret) {
            this._curWeaponLevel = FishWeaponType.eWeaponLevel10;
            this._group = GroupHeroBullet;
            //this.playAction(1);
        }

        return ret;
    },
    getBulletType:function () {
        return BulletType.eBaseBullet;
    }
});

var LevinStormBulletActor = BulletActor.extend({
    explodeActor:null,
    explodeNode:null,
    bExplode:null,
    _soundEffectID:null,
    getBulletType:function () {
        return BulletType.eLevinStormBullet;
    },
    initWithDef:function (def_) {
        var ret = this.initWithSpriteName("weapon_lightning_effect3_12", "weapon_lightning_effect3_12.png");
        if (ret) {
            this._curWeaponLevel = FishWeaponType.eWeaponLevel9;
            this._group = GroupHeroBullet;
            this.setScaleY(this._gunShootDistance / 356);
            this.setVisible(false);
            this.playAction(0);
        }

        return ret;
    },
    collideWith:function (plane) {
        /*var pStar = plane instanceof  Starfish;*/
        if (!this.getIsAlive() || !plane.getIsAlive()/* || pStar != null*/) {
            return false;
        }

        if (this.bExplode) {
            var dis = Math.sqrt(Math.pow((plane.getPosition().x - this.getPosition().x), 2) + Math.pow((plane.getPosition().y - this.getPosition().y), 2));

            if (dis < 100) {
                return true;
            }
        }

        return false;
    },
    resetState:function () {
        this._super();
        this.setVisible(true);
        this.bExplode = false;
    },
    hideLightingBullet:function () {
        this.setVisible(false);
    },
    hideLightingBulle:function () {
    },
    explodeEffect:function (positon) {
        if (this.bExplode || !this.getIsAlive()) {
            return;
        }
        this.bExplode = true;
        this.getScene().startCameraAnimation();

        this._soundEffectID = playEffect(LEVINSTORM_EFFECT);

        this.setVisible(false);

        var temp = new BaseSprite();
        temp.initWithFile(ImageName("Levin_explosion"), ImageName("Levin_explosion.png"));
        this.setExplodeActor(temp);

        this.getExplodeActor().setAction(0);
        this.getExplodeActor().setUpdatebySelf(true);

        var offsetPos = cc.p(this.getExplodeActor().getContentSize().width / 2, this.getExplodeActor().getContentSize().height / 2);
        this.getExplodeActor().setPosition(this.getPosition());

        this.getScene().addChild(this.getExplodeActor(), this.getZOrder() + 1, this.getZOrder() + 1);

        cc.Director.getInstance().getScheduler().scheduleSelector(this.removeSelfFromScene2, this, 2, false);
    },
    refreshBulletState:function () {
        var Dir = this.getMoveDirection();
        cc.pNormalize(Dir);
        var ang = Math.atan2(Dir.x, Dir.y);

        this._particle.setPosition(this.getPosition());

        if (ang < 0) {
            this._particle.setAngle(270 - ang / Math.PI * 180);
        }
        else {
            this._particle.setAngle(270 - ang / Math.PI * 180);
        }

        this.setRotation(ang / Math.PI * 180);
    },
    update:function (dt) {
        if (!this.getIsAlive()) {
            return;
        }

        if (!cc.Rect.CCRectContainsPoint(LEVINBULLETALIVERECT, this.getPosition())) {
            if (!this.bExplode)
                this.explodeEffect(this._targetPosition);
            return;
        }

        if (!this.bExplode) {
            this._gunShootDistance += this._speed * dt;
            this.setScaleY(this._gunShootDistance / 356);
            var nextStep = cc.pAdd(this.getPosition(), cc.p(this._speed * dt * this.getMoveDirection().x, this._speed * dt * this.getMoveDirection().y));

            var dis1 = Math.sqrt(Math.pow((this._targetPosition.x - this.getPosition().x), 2.0) + Math.pow((this._targetPosition.y - this.getPosition().y), 2.0));
            var dis2 = Math.sqrt(Math.pow((this._targetPosition.x - nextStep.x), 2.0) + Math.pow((this._targetPosition.y - nextStep.y), 2.0));
            if (dis2 > dis1)
                this.explodeEffect(this._targetPosition);
            else
                this.setPosition(nextStep);
        }
    },
    removeSelfFromScene:function () {
        cc.Director.getInstance().getScheduler().unscheduleAllSelectorsForTarget(this);

        if (this.bExplode) {
            this.getExplodeActor().stopAllActions();
            this.getExplodeActor().setUpdatebySelf(false);
            this.getScene().removeChildByTag(this.getZOrder() + 1, true);
        }
        this._super();
        this.setVisible(true);
    },
    removeSelfFromScene2:function (dt) {
        cc.Director.getInstance().getScheduler().unscheduleSelector(this.removeSelfFromScene2, this);
        this.removeSelfFromScene();
    },
    collisionEvent:function () {
    },
    finalEvent:function () {
        return false;
    },
    getExplodeActor:function () {
        return this.explodeActor;
    },
    setExplodeActor:function (v) {
        this.explodeActor = v;
    },
    getExplodeNode:function () {
        return this.explodeNode;
    },
    setExplodeNode:function (v) {
        this.explodeNode = v;
    },
    getBExplode:function () {
        return this.bExplode;
    },
    setBExplode:function (v) {
        this.bExplode = v;
    }
});

var SwirlBulletActor = BulletActor.extend({
    bStop:null,
    fMaxLiveTime:null,
    fLiveTime:null,
    bDisappear:null,
    initWithDef:function (def_) {
        var ret = this.initWithSpriteName("xuanwo-hd", "xuanwo.png");
        if (ret) {
            this.setScale(cc.p(1.5, 1.5));
            this.setCurWeaponLevel(FishWeaponType.eWeaponLevel12);
            this._group = GroupHeroBullet;
        }

        return ret;

    },
    collideWith:function (plane) {
        if (!this._isAlive || !plane.getIsAlive()) {
            return false;
        }

        var dis = Math.sqrt(Math.pow((plane.getPosition().x - this.getPosition().x), 2) + Math.pow((plane.getPosition().y - this.getPosition().y), 2));

        if (dis < 100) {
            return true;
        }

        return true;
    },
    resetState:function () {
        this._super();
        this.bStop = false;
        this.bDisappear = false;
        this.fMaxLiveTime = 5;
        this.fLiveTime = 0;
    },
    removeSelfFromScene:function () {
        cc.Scheduler.getInstance().unscheduleAllSelectorsForTarget(this);

        if (this.bExplode) {
            this.getExplodeNode().stopAllActions();
            this.getExplodeActor().schedule(this.update);
            this.getScene().getLayer().removeChildByTag(this.getZOrder() + 1, true);
        }
        this._super();
        this.setVisible(true);
    },
    update:function (dt) {
        if (!this._isAlive || this.bDisappear) {
            return;
        }
        this.fLiveTime += dt;
        this._gunShootDistance += this._speed * dt;

        if (this.fLiveTime > this.fMaxLiveTime) {
            this.bDisappear = true;
            this.playAction(2);
            return;
        }

        if (this._gunShootDistance > this._maxShootDistance) {
            this.bStop = true;
        }

        if (!this.bStop) {
            var nextStep = cc.pAdd(this.getPosition(), cc.p(this._speed * dt * this.getMoveDirection().x, this._speed * dt * this.getMoveDirection().y));
            this.setPosition(nextStep);
        }
    },
    updateInfo:function () {
        this._super();
        this._maxShootDistance = Math.sqrt(Math.pow(this._targetPosition.x - this.getPosition().x, 2) + Math.pow(this._targetPosition.y - this.getPosition().y, 2));
    },

    refreshBulletState:function () {
        var Dir = this.getMoveDirection();
        cc.pNormalize(Dir);
        var ang = Math.atan2(Dir.x, Dir.y);

        this._particle.setPosition(this.getPosition());

        if (ang < 0) {
            this._particle.setAngle(270 - ang / Math.PI * 180);
        }
        else {
            this._particle.setAngle(270 - ang / Math.PI * 180);
        }

        this.setRotation(ang / Math.PI * 180);
    },
    didActionEndChange:function () {
        if (this._curAction == 0) {
            this.playAction(1);
        }
        else if (this._curAction == 2) {
            this._isAlive = false;
            this.removeSelfFromScene();
        }
    },

    collisionEvent:function () {
        this.explodeEffect(this.getPosition());
    },
    finalEvent:function () {
        return this.bDisappear;
    },

    getBulletType:function () {
        return BulletType.eSwirlBullet;
    },
    getBStop:function () {
        return this.bStop;
    },
    setBStop:function (v) {
        this.bStop = v;
    },
    getFMaxLiveTime:function () {
        return this.fMaxLiveTime;
    },
    setFMaxLiveTime:function (v) {
        this.fMaxLiveTime = v;
    },
    getFLiveTime:function () {
        return this.fLiveTime;
    },
    setFLiveTime:function (v) {
        this.fLiveTime = v;
    }
});

var RayBulletActor = BulletActor.extend({
    initWithDef:function (def) {
        var ret = this.initWithSpriteName("bullet", "SmallItem.png");
        if (ret) {
            this._curWeaponLevel = FishWeaponType.eWeaponLevel8;
            this._group = GroupHeroBullet;
            this.playAction(14);
        }

        return ret;
    },
    update:function () {
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
    getBulletType:function () {
        return BulletType.eRayBullet;
    }
});

var XuliActor = BaseActor.extend({
    initWithDef:function (def) {
        var spriteBN = GameCtrl.sharedGame().getCurScene().getLayer().getChildByTag(TAG_BATCH_NODE_SMALLITEM);
        var ret = this.initWithSpriteName("xuli", "SmallItem.png");
        if (ret) {
            this.setGroup(GroupHeroBullet);
        }

        return ret;
    },
    getBaseActortype:function () {
        return BulletType.eXuliActor;
    }
});

var HarpoonBulletActor = BulletActor.extend({
    initWithDef:function (def) {
        var ret = this.initWithSpriteName("weapon_harpoon", "weapon_harpoon.png");
        if (ret) {
            this._group = GroupHeroBullet;
            this.setCurWeaponLevel(FishWeaponType.eWeaponLevel1);
            this.playAction(0);
            this._group = GroupHeroBullet;
        }
        return ret;
    },
    update:function (dt) {
        if (!this._isAlive) {
            return;
        }
        this._gunShootDistance += this.speed * dt;
        if (this._gunShootDistance > this._maxShootDistance) {
           this.addFishNet();
        }
        if (this._gunShootDistance > this._maxShootDistance || !cc.Rect.CCRectContainsPoint(EScreenRect, this.getPosition())) {
            this._isAlive = false;
            this.removeSelfFromScene();
            return;
        }

        var nextStep = cc.pAdd(this.getPosition(), cc.p(this._speed * dt * this.getMoveDirection().x, this._speed * dt * this.getMoveDirection().y));
        var Dir = cc.pSub(nextStep, this.getPosition());
        cc.pNormalize(Dir);
        var ang = Math.atan2(Dir.x, Dir.y);
        this.setPosition(nextStep);

        this._particle.setPosition(this.getPosition());
        if (ang < 0) {
            this._particle.setAngle(270 - ang / Math.PI * 180);
        }
        else {
            this._particle.setAngle(270 - ang / Math.PI * 180);
        }

        this.setRotation(ang / Math.PI * 180);
    },
    removeSelfFromScene:function () {
        if (this._particle) {
            this._particle.stopSystem();
            this._particle.setVisible(false);
            this._particle.removeFromParentAndCleanup(true);
            this.setParticle(null);
        }
        var nValue = PlayerActor.sharedActor().getCurConsume() + this.getCurWeaponLevel();
        PlayerActor.sharedActor().setCurConsume(nValue);

        this.removeSelfFromScene();
    },
    getBulletType:function () {
        return BulletType.eHarpoonBullet;
    }
});