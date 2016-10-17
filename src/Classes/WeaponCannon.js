var CannonPowUp = 1;
var CannonPowDow = 0;
var CannonMenu = 2;

var kParticleTag = 111;

var WEAPON_SWITC_CANNONLEVEL = "WEAPON_Switch_CannonLevel";

var WeaponCannon = Weapon.extend({
    _decreaseCannon:null,
    _increaseCannon:null,
    /**
     Init weapon and create sprite & shoot animation with given name
     The weaponLevel param is normal cannon weapon level
     The pos param determine base point of sprite
     */
    initWeapon:function (weaponLevel, pos) {
        if (arguments.length < 2) {
            return true;
        }

        if (FishWeaponType.eWeaponLevel10 != weaponLevel) {
            if (weaponLevel < FishWeaponType.eWeaponLevel1 || weaponLevel > FishWeaponType.eWeaponLevel7) {
                return false; // Illeagle normal cannon weapon level
            }
        }

        var spriteName = "actor_cannon1_" + weaponLevel + "1.png";
        var shootName = "actor_cannon1_" + weaponLevel + "2.png";
        if (!this._super(spriteName, shootName, pos, 0.1)) return;
        this._cannonLevel = weaponLevel;
        this.setAnchorPoint(cc.p(0.5, 0.5));
        var menuLeft = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_63.png"), cc.Sprite.createWithSpriteFrameName("ui_button_64.png"), this, this.changeWeapon);
        menuLeft.setTag(CannonPowDow);
        menuLeft.setScale(0.7);

        var menuRight = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_65.png"), cc.Sprite.createWithSpriteFrameName("ui_button_66.png"), this, this.changeWeapon);
        menuRight.setTag(CannonPowUp);
        menuRight.setScale(0.7);

        menuLeft.setPosition(cc.pAdd(cc.p(this.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-70, -20)));
        menuRight.setPosition(cc.pAdd(cc.p(this.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(70, -20)));

        var menu = cc.Menu.create(menuLeft, menuRight);
        this.addChild(menu, 10, CannonMenu);
        menu.setPosition(cc.p(0, 0));

        this.setButtonsEnable(false);
        this.setDecreaseCannon(menuLeft);
        this.setIncreaseCannon(menuRight);

        return true;
    },

    changeWeapon:function (sender) {
        if (this._isSwitching) {
            return;
        }

        this.setButtonsEnable(false);

        playEffect(BUTTON_EFFECT);
        var playerActor = PlayerActor.sharedActor();

        if (sender.getTag() == CannonPowUp) {
            playerActor.changeWeapon();
        }
        else {
            playerActor.changeWeaponReverse();
        }

        var curLv = playerActor.getCurWeaponLevel();

        this.getDelegate().weaponSwitchNormalLevel(curLv);

        /*
         currentScene.removeChildByTag(kParticleTag, true);
         var partic = cc.ParticleSystemQuad.create(ImageName("huanpao02.plist"));
         partic.setPosition(cc.pAdd(this.getPosition(), cc.p(0, 0)));
         currentScene.addChild(partic, 111, kParticleTag);*/
    },
    switchIn:function () {
        PlayerActor.sharedActor().setCurWeaponLevel(this.getCannonLevel());
        this._super();
        this.setButtonsEnable(true);
    },
    switchIn2:function (animationDelay) {
        PlayerActor.sharedActor().setCurWeaponLevel(this.getCannonLevel());
        this._super(animationDelay);
    },
    setButtonsEnable:function (enable) {
        var menu = this.getChildByTag(CannonMenu);
        for (var i = 0; i < menu.getChildren().length; i++) {
            var item = menu.getChildren()[i];
            item.setEnabled(enable);
        }
    },
    shootTo:function (targetPos) {
        this.setDirection(targetPos);
        return;

        if (!this._isShootable)
            return;

        var distance = cc.pDistance(cc.PointZero(), cc.p(30, 23));

        this.getWeaponSprite().stopAction(this.getShootAnimation());
        this.getWeaponSprite().setScale(1.0);

        //var pParticle = cc.ParticleSystemQuad.create(ImageName("_particle.plist"));
        //TODO foundn't this file
        var pParticle = ParticleSystemFactory.getInstance().createParticle(ImageName("particle.plist"));
        pParticle.setDrawMode(cc.PARTICLE_SHAPE_MODE);
        pParticle.setShapeType(cc.PARTICLE_STAR_SHAPE);
        var sourcePos = cc.pAdd(this.getPosition(), cc.p(-25, 0));
        var direction = cc.pNormalize(cc.pSub(targetPos, sourcePos));

        this.getWeaponSprite().runAction(this.getShootAnimation());

        //Nacson shootStart
        var bulletName = this._cannonLevel;
        //ApparkDataManagerWrapper.shootStart(bulletName, this.getShootFlag());

        var bullet = ActorFactory.create("BulletActor");
        bullet.setParticle(pParticle);
        bullet.setShootFlag(this.getShootFlag());
        bullet.setCurWeaponLevel(this.getCannonLevel());
        bullet.resetState();
        bullet.updateInfo();
        bullet.setGroup(GroupHeroBullet);
        bullet.setMoveDirection(direction);
        bullet.setPosition(this.convertToWorldSpace(this.getWeaponSprite().getPosition()));
        //bullet.setPosition(cc.pSub(this.getPosition(), cc.p(33, 0)));
        pParticle.setPosition(cc.pAdd(this.getPosition(), cc.pMult(direction, distance)));
        bullet.setTargetPosition(targetPos);
        var bulletSpeed = GameSetting.getInstance().getBulletSpeedArray()[this.getCannonLevel()];
        bullet.setSpeed(bulletSpeed);

        bullet.playAction(7 + this.getCannonLevel() - 1);
        bullet.setZOrder(BulletActorZValue);

        var ang = Math.atan2(direction.x, direction.y);
        this.getWeaponSprite().setRotation(ang / Math.PI * 180);
        GameCtrl.sharedGame().getCurScene().addChild(pParticle, 10);
        GameCtrl.sharedGame().getCurScene().addActor(bullet);

        PlayerActor.sharedActor().shootFinished(bullet.getCurWeaponLevel());
        playEffect(FIRE_EFFECT);
    },
    changeVisible:function (isVisible) {
        this._super(isVisible);
        this.getDecreaseCannon().setVisible(isVisible);
        this.getIncreaseCannon().setVisible(isVisible);
    },
    getDecreaseCannon:function () {
        return this._decreaseCannon;
    },
    setDecreaseCannon:function (v) {
        this._decreaseCannon = v;
    },
    getIncreaseCannon:function () {
        return this._increaseCannon;
    },
    setIncreaseCannon:function (v) {
        this._increaseCannon = v;
    }
});

/**
 Base class for normal cannon weapons.
 */
var WeaponCannonExt = WeaponCannon.extend({
    _currentActorType:null,
    getCurrentActorType:function () {
        return this._currentActorType;
    },
    setCurrentActorType:function (v) {
        this._currentActorType = v;
    },
    setDirection:function (newDirection) {
        if (ActorType.eActorTypeNormal == this.getCurrentActorType()) {
            this._super(newDirection);
        }
        else {
            var direction = cc.pNormalize(cc.pSub(newDirection, this.getPosition()));
            var ang = Math.atan2(direction.x, direction.y);
            this.getWeaponSprite().setRotation(ang / Math.PI * 180.0 - this.getRotation());
            this.setWeaponDirection(newDirection);
        }
    },
    initWeapon:function (weaponLevel, pos, actorType) {
        var bRet = this._super(weaponLevel, pos);
        if (bRet) {
            this.setCurrentActorType(actorType);
        }

        return bRet;
    },
    shootTo:function (targetPosition, type) {
        this.setDirection(targetPosition);
        var distance = cc.pDistance(cc.PointZero(), cc.p(50, 33));
        this.getWeaponSprite().stopAction(this.getShootAnimation());
        this.getWeaponSprite().setScale(1.0);

        this.getWeaponSprite().runAction(this.getShootAnimation());

        var bullet;
        if (this.getCannonLevel() == 10) {
            bullet = ActorFactory.create("BulletActor10");
        }
        else {
            bullet = ActorFactory.create("BulletActor");
        }

        var particle = ParticleSystemFactory.getInstance().createParticle(ImageName("particle.plist"));
        particle.setDrawMode(cc.PARTICLE_SHAPE_MODE);
        particle.setShapeType(cc.PARTICLE_STAR_SHAPE);

        particle._dontTint = true;
        bullet.setParticle(particle);
        bullet.setShootFlag(this.getShootFlag());
        bullet.setCurWeaponLevel(this.getCannonLevel());
        bullet.resetState();
        bullet.updateInfo();
        bullet.setGroup(GroupHeroBullet);
        var bulletPos = this.convertToWorldSpace(this.getWeaponSprite().getPosition());
        var direction = cc.pNormalize(cc.pSub(targetPosition, bulletPos));
        bullet.setMoveDirection(direction);
        bullet.setPosition(bulletPos);
        particle.setPosition(cc.pAdd(this.getPosition(), cc.pMult(direction, distance)));

        bullet.setTargetPosition(targetPosition);
        var speedSetArray = GameSetting.getInstance().getBulletSpeedArray();
        var bulletSpeed = speedSetArray[this.getCannonLevel()];
        bullet.setSpeed(bulletSpeed);

        bullet.playAction(7 + this.getCannonLevel() - 1);
        if (type) {
            bullet.setActorType(type);
        }
        bullet.setZOrder(BulletActorZValue);

        var ang = Math.atan2(direction.x, direction.y);
        this.getWeaponSprite().setRotation((ang / Math.PI * 180.0 - this.getRotation()));
        GameCtrl.sharedGame().getCurScene().addChild(particle, 10);
        GameCtrl.sharedGame().getCurScene().addActor(bullet);

        switch (type) {
            case ActorType.eActorTypeTL:
                PlayerActor.sharedActorTL().shootFinished(bullet.getCurWeaponLevel());
                break;

            case ActorType.eActorTypeTR:
                PlayerActor.sharedActorTR().shootFinished(bullet.getCurWeaponLevel());
                break;

            case ActorType.eActorTypeBR:
                PlayerActor.sharedActorTR().shootFinished(bullet.getCurWeaponLevel());
                break;

            case ActorType.eActorTypeBL:
                PlayerActor.sharedActorTR().shootFinished(bullet.getCurWeaponLevel());
                break;

            case ActorType.eActorTypeNormal:
            default:
                PlayerActor.sharedActor().shootFinished(bullet.getCurWeaponLevel());
                break;
        }

        playEffect(FIRE_EFFECT);
    }
});


var WeaponCannon1 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel1, pos, actorType);
    }
});

var WeaponCannon2 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel2, pos, actorType);
    }
});

var WeaponCannon3 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel3, pos, actorType);
    }
});

var WeaponCannon4 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel4, pos, actorType);
    }
});

var WeaponCannon5 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel5, pos, actorType);
    }
});

var WeaponCannon6 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel6, pos, actorType);
    }
});

var WeaponCannon7 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel7, pos, actorType);
    }
});

var WeaponCannon10 = WeaponCannonExt.extend({
    initWeapon:function (pos, actorType) {
        return this._super(FishWeaponType.eWeaponLevel10, pos, actorType);
    }
});