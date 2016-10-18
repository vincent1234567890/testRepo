var LevinStormWeaponSprite = "weapon_lightning.png";
var LevinStormWeaponShoot = "weapon_lightning.png";
var LevinStormWeaponEffect = "weapon_lightning_effect1.png";

var LevinStormXuliTag = 7878;

var WeaponSpecialLevinStorm = WeaponSpecial.extend({
    _weaponEffect:null,
    _targetPoint:null,
    _isPowerUp:false,
    _levinStormBulletSoundEffect:0,
    initWeapon:function (pos, energy, shootCost) {
        var strweaponSprite = "weaponLevinStorm.png";
        var strweaponShoot = "weaponLevinStorm.png";
        cc.spriteFrameCache.addSpriteFrames(ImageName("LevinStorm_xuli1.plist"));
        cc.spriteFrameCache.addSpriteFrames(ImageName("LevinStorm_xuli2.plist"));
        if (this._super(strweaponSprite, strweaponShoot, pos, 0.5, energy, shootCost)) {
            this.setCannonLevel(FishWeaponType.eWeaponLevel9);
            this._isPowerUp = false;
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this.loadWeaponEffect();
            this._weaponSprite.setAnchorPoint(cc.p(0.5, 0.34));
            return true;
        }
        return false;
    },
    loadWeaponEffect:function () {
        var cache = cc.spriteFrameCache;
        var frames = [];
        for (var i = 1; i <= 5; i++) {
            var frameName = "xl0" + i + ".png";
            var frame = cache.getSpriteFrame(frameName);
            frames.push(frame);
        }

        var firstFrame = "xl01.png";
        var animation = cc.Animation.create(frames, 0.1);
        var xuli01 = cc.Sprite.createWithSpriteFrameName(firstFrame);
        var xuli01Animate = cc.Animate.create(animation);
        xuli01.runAction(cc.RepeatForever.create(xuli01Animate));
        xuli01.setAnchorPoint(cc.p(0.5, 0.5));

        xuli01.setPosition(cc.p(48, 51));
        this.getWeaponSprite().addChild(xuli01, BulletActorZValue);
        frames = [];
    },
    stopLevinStormBulletSoundEffect:function () {
        cc.audioEngine.stopEffect(this._levinStormBulletSoundEffect);
    },
    createLevinStormBullet:function (pos) {
        if (GameCtrl.sharedGame().getGameState() != GAMEPLAY)
            return;

        var bullet = ActorFactory.create("LevinStormBulletActor");
        var direction = cc.pNormalize(cc.pSub(pos, this.getPosition()));
        bullet.resetState();
        bullet.updateInfo();
        bullet.setGroup(GroupHeroBullet);
        bullet.setMoveDirection(direction);
        var ang = Math.atan2(direction.x, direction.y);
        bullet.setShootFlag(this.getShootFlag());
        bullet.setPosition(cc.pAdd(this.getPosition(), cc.p(-26, 0)));
        bullet.setSpeed(600);

        bullet.setTargetPosition(pos);
        bullet.setZOrder(BulletActorZValue * 2);
        bullet.setRotation(ang / Math.PI * 180);

        GameCtrl.sharedGame().getCurScene().addActor(bullet);

        var currentScene = GameCtrl.sharedGame().getCurScene();
        currentScene.cancelChange();
        cc.Director.getInstance().getScheduler().scheduleSelector(this.specialShootingFinished, this, 2.0, false);
        this._isPowerUp = false;
    },
    addLevinStormBullet:function (dt) {
        cc.Director.getInstance().getScheduler().unscheduleSelector(this.addLevinStormBullet, this);
        //KingFisher cc.log("Playing add bullet sound.");
        this._levinStormBulletSoundEffect = playEffect(LEVINSTORM_EFFECT);
        this.createLevinStormBullet(this._targetPoint);
        this.getWeaponSprite().getChildByTag(LevinStormXuliTag).removeFromParentAndCleanup(true);
    },
    powerUp:function () {
        var cache = cc.spriteFrameCache;
        var frames = [];
        for (var i = 1; i <= 5; i++) {
            var frameName = "x0" + i + ".png";
            var frame = cache.getSpriteFrame(frameName);
            frames.push(frame);
        }

        var firstFrame = "x01.png";
        var animation = cc.Animation.create(frames, 0.1);
        var xuli02 = cc.Sprite.createWithSpriteFrameName(firstFrame);
        var xuli02Animate = cc.Animate.create(animation);
        xuli02.runAction(cc.RepeatForever.create(xuli02Animate));
        xuli02.setAnchorPoint(cc.p(0.5, 0.5));

        xuli02.setPosition(cc.p(48, 51));
        this._weaponSprite.addChild(xuli02, BulletActorZValue, LevinStormXuliTag);
        frames = [];
        this._isPowerUp = true;
    },
    shootTo:function (targetPos) {
        if (this._isShooting || this._isPowerUp) {
            return;
        }

        this.setDirection(targetPos);

        this._targetPoint = targetPos;
        this._isShooting = true;

        PlayerActor.sharedActor().setLaserMoney(0);
        var useLaser = wrapper.getIntegerForKey(kUseLaser);
        if (useLaser == 2) {
            wrapper.setIntegerForKey(kUseLaser, 3);
            var LaserNum = wrapper.getIntegerForKey(kLaserNum);
            var temLaserNum = (LaserNum > 0) ? LaserNum - 1 : 0;
            wrapper.setIntegerForKey(kLaserNum, temLaserNum);
            wrapper.setIntegerForKey(kLaserSign, PlayerActor.laserSign(""+temLaserNum));
        }

        this.checkAndCleanOldNormalGain();
        this.updateEnergy();
        this.powerUp();
        cc.Director.getInstance().getScheduler().scheduleSelector(this.addLevinStormBullet, this, 2, false);

        this._weaponSprite.runAction(this._shootAnimation);
    }
});

