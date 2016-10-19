var WeaponSpecialRay = WeaponSpecial.extend({
    xRayLightSprite:null,
    _targetPos:null,
    getXRayLightSprite:function () {
        return this.xRayLightSprite;
    },
    setXRayLightSprite:function (v) {
        this.xRayLightSprite = v;
    },
    /**
     Init special weapon Ray base class
     The pos param determine base point of sprite
     The energy param determine init energy count
     The shootCost determine energy cost per shoot
     */
    initWeapon:function (pos, energy, shootCost) {
        if (this._super("actor_cannon_jiguang_02.png", "actor_cannon_jiguang_01.png", pos, 0.5, energy, shootCost)) {
            this.setCannonLevel(FishWeaponType.eWeaponLevel8);
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this._weaponSprite.setAnchorPoint(cc.p(0.5, 75.0 / 180.0));
            return true;
        }
        return false;
    },
    /**
     Add rainbow effect for ray weapon at special position
     The rbPos param determine rainbow postion
     */
    addRainbow:function () {
        var cache = cc.spriteFrameCache;
        // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
        cache.addSpriteFrames(ImageName("caihong.plist"));

        var frames = [];
        for (var i = 1; i <= 6; i++) {
            var frameName = "caihong_" + i + ".png";
            var frame = cache.getSpriteFrame(frameName);
            frames.push(frame);
        }

        var firstFrame = "caihong_1.png";
        var animation = cc.Animation.create(frames, 0.1);
        var rainbow = new cc.Sprite("#" + firstFrame);
        var rainbowAnimate = cc.Animate.create(animation);
        rainbow.runAction(cc.RepeatForever.create(rainbowAnimate));
        rainbow.setAnchorPoint(cc.p(0.5, 0.5));
        rainbow.setPosition(cc.pAdd(this.getPosition(), cc.p(0, -57)));
        GameCtrl.sharedGame().getCurScene().addChild(rainbow, BulletActorZValue, 456 + this.getActorType());
        frames = [];
    },
    /**
     Remove rainbow effect after shooting
     */
    removeRainbow:function () {
        var spRainbow = GameCtrl.sharedGame().getCurScene().getChildByTag(456 + this.getActorType());
        if (spRainbow) {
            spRainbow.stopAllActions();
            spRainbow.removeFromParentAndCleanup(true);
        }
    },
    /**
     Show ray shoot effect, internal use only
     */
    addSpriteX:function (file, imageFile, p, r, sc) {
        var sprite = new BaseSprite();
        sprite.initWithFile(file, imageFile);

        /*var s = cc.SpriteBatchNode.create(imageFile);*/
        sprite.setPosition(p);
        sprite.setScale(sc);
        this._weaponSprite.addChild(sprite, 1, 999);
        sprite.setAction(0);
        sprite.setUpdatebySelf(true);
        sprite.setRotation(r);
        this.setXRayLightSprite(sprite);
    },

    addRayBullet:function (posStr, type) {
        if (GameCtrl.sharedGame().getGameState() != GAMEPLAY)
            return;

        playEffect(LASER_EFFECT);

        var targetPosition = cc.p(Math.sin(this.getWeaponSprite().getRotation() / 180 * Math.PI) * 100,
            Math.cos(this.getWeaponSprite().getRotation() / 180 * Math.PI) * 100);
        targetPosition = cc.pAdd(targetPosition, this.getPosition());
        var bullet = ActorFactory.create("RayBulletActor");
        var direction = cc.pNormalize(cc.pSub(targetPosition, this.getPosition()));
        bullet.resetState();
        bullet.setGroup(GroupHeroBullet);
        bullet.setMoveDirection(direction);
        var ang = Math.atan2(direction.x, direction.y);
        bullet.setShootFlag(this.getShootFlag());
        bullet.setPosition(cc.pAdd(this.getPosition(), cc.p(8, -20)));
        bullet.setTargetPosition(targetPosition);
        bullet.setUpdatebySelf(false);
        bullet.setZOrder(BulletActorZValue * 2);
        bullet.playAction(14);
        bullet.setUpdatebySelf(true);
        bullet.setActionDidStopSelector(this.removeSelfFromScene, bullet);
        bullet.setRotation(ang / Math.PI * 180);

        if (type) {
            bullet.setActorType(type);
        }
        else {
            bullet.setActorType(this.getActorType());
        }

        GameCtrl.sharedGame().getCurScene().addActor(bullet);

        var delay1 = cc.DelayTime.create(0.8);
        var callback1 = cc.CallFunc.create(this, this.startCameraAnimation);
        var delay = cc.DelayTime.create(2.2);
        var callback = cc.CallFunc.create(this, this.doSpecialShootFinish);
        this.runAction(cc.Sequence.create(delay1, callback1, delay, callback));
        this.getWeaponSprite().getChildByTag(999).removeFromParentAndCleanup(true);

        var currentScene = GameCtrl.sharedGame().getCurScene();
        if (type) {
            currentScene.cancelChange(type);
        }
        else {
            currentScene.cancelChange(this.getActorType());
        }
    },
    switchIn:function () {
        this._isSwitching = true;
        playEffect(CHANGECANNON_EFFECT);

        this._super(1);

        PlayerActor.sharedActor().setCurWeaponLevel(this.getCannonLevel());
    },
    switchOut:function () {
        if (GameCtrl.sharedGame().getGameState() != GAMEPLAY)
            return;

        this._isSwitching = true;
        this._super(2);
    },
    shootTo:function (targetPos) {
        this.setDirection(targetPos);

        if (this.getIsShooting() || !this.getIsShootable()) {
            return;
        }
        var direction = cc.pNormalize(cc.pSub(targetPos, this.getPosition()));
        var ang = Math.atan2(direction.x, direction.y);
        this.getWeaponSprite().setRotation(ang / Math.PI * 180 + this.getRotation());

        PlayerActor.sharedActor().setLaserMoney(0);
        var useLaser = wrapper.getIntegerForKey(kUseLaser);
        if (useLaser == 2) {
            wrapper.setIntegerForKey(kUseLaser, 3);
            var LaserNum = wrapper.getIntegerForKey(kLaserNum);
            LaserNum--;
            wrapper.setIntegerForKey(kLaserNum, LaserNum);
            wrapper.setIntegerForKey(kLaserSign, PlayerActor.laserSign(""+LaserNum));
        }

        this.checkAndCleanOldNormalGain();
        this.setIsShooting(true);
        this.updateEnergy();

        this.addSpriteX(ImageName("xuli"), ImageName("SmallItem.png"), cc.p(46, 125), 0, 1);

        this.schedule(this.doAddRayBullet, 2);
        this._targetPos = cc.p(targetPos.x,targetPos.y);

        this.getWeaponSprite().runAction(this.getShootAnimation());
        this.removeRainbow();
    },
    doAddRayBullet:function () {
        this.unschedule(this.doAddRayBullet);
        this.addRayBullet(this._targetPos);
    },
    doSpecialShootFinish:function () {
        this.specialShootingFinished(0);
    }
});