var WeaponManager = cc.Class.extend({
    _isSpecialChangeBackNormal:false,
    _currentWeapon:null, // 当前使用的武器
    _changeToWeapon:null, // 将要切换到的新武器
    _oldWeapon:null, // 切换前的武器(用于切换到特殊武器时保存普通武器)
    _defaultWeaponPosition:cc.p(0, 0), // 默认武器位置
    _weaponRotation:0, // 旋转角度(多人对战不同位置)
    _isChangeToSpecialWeapon:false, // 是否正在从特殊武器切换回普通武器
    _isShootable:true, // 当前是否允许射击
    _isWeaponVisible:true, // 武器当前是否可见(用于鱼缸模式)
    _isWeaponSwitching:false, // 当前是否正在切换武器
    _curScene:null, // 当前场景
    _spriteMiss:null,
    ctor:function (pos, rotation, parentScene) {
        // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
        // this._super();
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(res.CannonPlist);
        cache.addSpriteFrames(ImageName("cannon10.plist"));
        cache.addSpriteFrames(ImageName("weaponLevinStorm.plist"));

        this._defaultWeaponPosition = pos;
        this._weaponRotation = rotation;
        this.setCurScene(parentScene);
        this._isChangeToSpecialWeapon = false;
        this._isWeaponVisible = true;
        this._isShootable = true;
        this.resetWeapon();
        this._nextBulletId = 0;
        //this._curScene = GameCtrl.sharedGame().getCurScene();
        // console.log("WeaponManager");
        // debugger
    },

    getIsSpecialChangeBackNormal:function () {
        return this._isSpecialChangeBackNormal;
    },
    setIsSpecialChangeBackNormal:function (v) {
        this._isSpecialChangeBackNormal = v;
    },
    getCurrentWeapon:function () {
        return this._currentWeapon;
    },
    setCurrentWeapon:function (v) {
        this._currentWeapon = v;
    },
    getChangeToWeapon:function () {
        return this._changeToWeapon;
    },
    setChangeToWeapon:function (v) {
        this._changeToWeapon = v;
    },

    getOldWeapon:function () {
        return this._oldWeapon;
    },
    setOldWeapon:function (v) {
        this._oldWeapon = v;
    },

    getDefaultWeaponPosition:function () {
        return this._defaultWeaponPosition;
    },
    setDefaultWeaponPosition:function (v) {
        this._defaultWeaponPosition = v;
    },

    getWeaponRotation:function () {
        return this._weaponRotation;
    },
    setWeaponRotation:function (v) {
        this._weaponRotation = v;
    },

    getIsChangeToSpecialWeapon:function () {
        return this._isChangeToSpecialWeapon;
    },
    setIsChangeToSpecialWeapon:function (v) {
        this._isChangeToSpecialWeapon = v;
    },

    getIsShootable:function () {
        return this._isShootable;
    },
    setIsShootable:function (v) {
        this._isShootable = v;
    },

    getNextBulletId:function () {
        return this._nextBulletId++;
    },

    getIsWeaponVisible:function () {
        return this._isWeaponVisible;
    },
    setIsWeaponVisible:function (v) {
        this._isWeaponVisible = v;
    },

    getIsWeaponSwitching:function () {
        return this._isWeaponSwitching;
    },
    setIsWeaponSwitching:function (v) {
        this._isWeaponSwitching = v;
    },

    getCurScene:function () {
        return this._curScene;
    },
    setCurScene:function (v) {
        this._curScene = v;
    },

    getSpriteMiss:function () {
        return this._spriteMiss;
    },
    setSpriteMiss:function (v) {
        this._spriteMiss = v;
    },
    /**
     Init weaponmanager with default settings
     The pos param determine default weapon position
     The rotation param determine weapon rotation angle
     */
    // initWithDefaults:function
    //
    //     return true;
    // },

    /**
     Implement the swithing between normal cannon levels
     The newLevel param determine which level will be changed to
     */
    performCannonSwitch:function (newLevel) {
        if ((FishWeaponType.eWeaponLevel1 != newLevel) && (FishWeaponType.eWeaponLevel10 != newLevel)) {
            if (FishWeaponType.eWeaponLevel1 > newLevel || FishWeaponType.eWeaponLevel7 < newLevel || this._isWeaponSwitching) {
                return;
            }
        }

        var weaponTemp;
        this._isWeaponSwitching = true;

        switch (newLevel) {
            case FishWeaponType.eWeaponLevel1:
                weaponTemp = new WeaponCannon1(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            case FishWeaponType.eWeaponLevel2:
                weaponTemp = new WeaponCannon2(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            case FishWeaponType.eWeaponLevel3:
                weaponTemp = new WeaponCannon3(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            case FishWeaponType.eWeaponLevel4:
                weaponTemp = new WeaponCannon4(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            case FishWeaponType.eWeaponLevel5:
                weaponTemp = new WeaponCannon5(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            case FishWeaponType.eWeaponLevel6:
                weaponTemp = new WeaponCannon6(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            case FishWeaponType.eWeaponLevel7:
                weaponTemp = new WeaponCannon7(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            case FishWeaponType.eWeaponLevel10:
                weaponTemp = new WeaponCannon10(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                break;
            default:
                break;
        }

        this.getCurScene().addChild(weaponTemp, 110);

        this.setChangeToWeapon(weaponTemp);
        weaponTemp.setDirection(this.getCurrentWeapon().getWeaponDirection());
        weaponTemp.setRotation(this.getWeaponRotation());
        weaponTemp.setDelegate(this);
        if (FishWeaponType.eWeaponLevel8 == this.getCurrentWeapon().getCannonLevel()) {
            this.getCurrentWeapon().switchOut2(1.0);
        }
        else {
            this.getCurrentWeapon().switchOut();
        }
    },

    /**
     Reset weapons to cannon level 1, and reset weapon status
     */
    resetWeapon:function () {
        this.setIsSpecialChangeBackNormal(false);
        this.setIsChangeToSpecialWeapon(false);

        if (this.getChangeToWeapon()) {
            this.getChangeToWeapon().stopFunction();
            this.getChangeToWeapon().removeFromParentAndCleanup(true);
            this.setChangeToWeapon(null);
        }

        if (this.getOldWeapon()) {
            this.getOldWeapon().stopFunction();
            this.getOldWeapon().removeFromParentAndCleanup(true);
            this.setOldWeapon(null);
        }

        if (this.getCurrentWeapon()) {
            this.getCurrentWeapon().stopFunction();
            this.getCurrentWeapon().removeFromParentAndCleanup(true);
            this.setCurrentWeapon(null);
        }


        var curWeapon;

        // 判断如果地图为3 即：加勒比海 则默认开启10级炮
        if (this.getCurScene().getCurStage() == 3) {
            curWeapon = new WeaponCannon10(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
            this.setCurrentWeapon(curWeapon);
            PlayerActor.sharedActor().setCurWeaponLevel(FishWeaponType.eWeaponLevel10);
        }
        else
            curWeapon = new WeaponCannon1(this._defaultWeaponPosition, ActorType.eActorTypeNormal);

        // curWeapon.initWeapon(this._defaultWeaponPosition, ActorType.eActorTypeNormal);

        this.setCurrentWeapon(curWeapon);

        this.getCurScene().addChild(curWeapon, 110);

        curWeapon.setDelegate(this);
        curWeapon.setRotation(this.getWeaponRotation());
        curWeapon.setDirection(cc.pAdd(curWeapon.getPosition(), cc.p(0, 30)));
        curWeapon.getWeaponSprite().setVisible(true);
        curWeapon.setVisible(true);
        curWeapon.setButtonsEnable(true);
        curWeapon.setIsShootable(true);
        this.setIsWeaponSwitching(false);
    },

    /**
     Change to special weapon
     The weaponID param determine special weapon kind
     */
    changeToSpecialWeapon:function (weaponID) {
        if (this._isChangeToSpecialWeapon || this._isSpecialChangeBackNormal || this._isWeaponSwitching) {
            return;
        }

        if (FishWeaponType.eWeaponLevel8 == weaponID) {
            playEffect(CHANGECANNON_EFFECT);
            this.setIsWeaponSwitching(true);
            this.setIsShootable(false);
            this.setWeaponButtonEnable(false);
            var weapon = new WeaponSpecialRay(this._defaultWeaponPosition, 1500, 1500);
            weapon.setActorType(ActorType.eActorTypeNormal);
            this.setChangeToWeapon(weapon);
            this.getChangeToWeapon().addRainbow();
            weapon.setDelegate(this);
            this.getCurScene().addChild(weapon, 110);
            var curWeapon = this.getCurrentWeapon();
            weapon.setDirection(curWeapon.getWeaponDirection());
            weapon.setRotation(this.getWeaponRotation());
            this.getCurrentWeapon().switchOut2(1.0);
            this.setIsChangeToSpecialWeapon(true);
        }
        else if (FishWeaponType.eWeaponLevel9 == weaponID) {
            playEffect(CHANGECANNON_EFFECT);
            this.setIsWeaponSwitching(true);
            this.setIsShootable(false);
            this.setWeaponButtonEnable(false);
            this.setIsShootable(false);
            var levinStorm = new WeaponSpecialLevinStorm(this.getDefaultWeaponPosition(), 1500, 1500);

            this.setChangeToWeapon(levinStorm);
            this.getChangeToWeapon().setDelegate(this);
            this.getCurScene().addChild(this.getChangeToWeapon(), 110);
            var weapon = this.getChangeToWeapon();
            var curWeapon = this.getCurrentWeapon();
            weapon.setDirection(curWeapon.getWeaponDirection());
            weapon.setRotation(this.getWeaponRotation());
            this.getCurrentWeapon().switchOut2(1.0);
            this.setIsChangeToSpecialWeapon(true);
        }
    },

    /**
     Set level switch buttons of weapon status
     The isEnable param determine button state
     */
    setWeaponButtonEnable:function (isEnable) {
        var currentWeaponLevel = this.getCurrentWeaponLevel();
        if (FishWeaponType.eWeaponLevel1 <= currentWeaponLevel && FishWeaponType.eWeaponLevel7 >= currentWeaponLevel && FishWeaponType.eWeaponLevel10 == currentWeaponLevel) {
            this.getCurrentWeapon().setButtonsEnable(isEnable);
        }
    },

    /**
     Set weapon is visible or not
     The isVisible param determine visible state
     */
    setWeaponVisible:function (isVisible) {
        this.getCurrentWeapon().changeVisible(isVisible);
    },

    /**
     Change current weapons direction to newDirection
     */
    updateWeaponDirection:function (isWeaponShootable) {
        this.getCurrentWeapon().setDirection(isWeaponShootable);
    },

    /**
     Use current weapon shoot to target position
     */
    shootTo:function (pos, type) {
        if (GameCtrl.isOnlineGame()) {
            const playerGameId = GameCtrl.sharedGame().getMyPlayerId();
            const bulletId = playerGameId + ':' + this.getNextBulletId();
            //const angle = Math.PI - this.getWeaponRotation() * Math.PI / 180;
            const direction = cc.v2fsub(pos, this.getDefaultWeaponPosition());
            const angle = Math.atan(direction.x, direction.y);
            GameCtrl.informServer.bulletFired(bulletId, angle);
            playEffect(FIRE_EFFECT);
            return;
        }

        //if (this.getCurrentWeapon().getIsShootable()) {
        if (true) {

            if (type) {
                this.getCurrentWeapon().shootTo(pos, type);
            }
            else {
                this.getCurrentWeapon().shootTo(pos);
            }
            var clock = (new Date()).getTime();
            this.getCurrentWeapon().setShootFlag(clock);
            if (this.getCurrentWeaponLevel() < 8) {
                //Nacson 每天每次开炮时间
            } else if (this.getCurrentWeaponLevel() == 8) {
                //Nacson 每天使用激光时间点
                //ApparkDataManagerWrapper.logEvent(USERLOG_CLICK_LASER, 0);
            } else if (this.getCurrentWeaponLevel() == 9) {
                //Nacson 每天使用闪电时间点
                //ApparkDataManagerWrapper.logEvent(USERLOG_CLICK_LIGHTNING, 0);
            }
        }
        else {
            this.getCurrentWeapon().setDirection(pos);
        }
    },

    /**
     Set weapon shootable
     */
    setWeaponShootable:function (isWeaponShootable) {

    },

    /**
     Get weapon level of current used weapon
     */
    getCurrentWeaponLevel:function () {
        return this.getCurrentWeapon().getCannonLevel();
    },

    /**
     Show super weapon missed notification
     */
    superWeaponMissed:function () {

        this.setSpriteMiss(cc.Sprite.create(ImageName("LevinStorm_miss.png")));
        this.getSpriteMiss().setScale(0.0);
        this.getSpriteMiss().setAnchorPoint(cc.p(0.5, 0.5));
        this.getSpriteMiss().setPosition(VisibleRect.center());

        GameCtrl.sharedGame().getCurScene().addChild(this.getSpriteMiss(), 150);
        this.getSpriteMiss().setVisible(true);
        var sequence = cc.sequence(
            cc.scaleTo(0.2, 1.0), cc.scaleTo(0.15, 0.8), cc.scaleTo(0.15, 1.0),
            cc.delayTime(0.5), cc.fadeOut(0.4), cc.callFunc(this.clearMissNotice, this));
        this.getSpriteMiss().runAction(sequence);
    },

    clearMissNotice:function (sender, data) {
        if (this.getSpriteMiss()) {
            this.getSpriteMiss().removeFromParentAndCleanup(true);
            this.setSpriteMiss(null);
        }
    },

    /// protocol function to receive weapon notify message
    weaponSwitchInFinished:function (weapon) {
        this.setIsWeaponSwitching(false);
        this.getCurrentWeapon().changeVisible(this.getIsWeaponVisible());
        PlayerActor.sharedActor().setCurWeaponLevel(this.getCurrentWeapon().getCannonLevel());
        if (this.getIsSpecialChangeBackNormal()) {
            this.setIsSpecialChangeBackNormal(false);
            this.setWeaponButtonEnable(true);
            if (this.getCurrentWeapon().getCannonLevel() < FishWeaponType.eWeaponLevel8 || this.getCurrentWeapon().getCannonLevel() == FishWeaponType.eWeaponLevel10) {
                wrapper.setIntegerForKey(kUseLaser, 0);
                var oldNormalGain = wrapper.getIntegerForKey(kOldLaserNum);
                PlayerActor.sharedActor().updateNormalGain(oldNormalGain);

            }
        }
    },
    /// protocol function to receive weapon notify message
    weaponSwitchOutFinished:function (weapon) {
        if (this.getIsSpecialChangeBackNormal()) {
            var orgWeapon = this.getOldWeapon();
            if (orgWeapon == null) {
                orgWeapon = new WeaponCannon1(this._defaultWeaponPosition, ActorType.eActorTypeNormal);
                this.getCurScene().addChild(orgWeapon, 110);
                orgWeapon.setRotation(this.getWeaponRotation());
                orgWeapon.setDelegate(this);
            }
            var curWeapon = this.getCurrentWeapon();
            orgWeapon.setDirection(curWeapon.getWeaponDirection());
            this.setCurrentWeapon(null);
            this.setCurrentWeapon(orgWeapon);
            this.getCurrentWeapon().changeVisible(this.getIsWeaponVisible());
            this.getCurrentWeapon().switchIn2(1.0);
            this.setOldWeapon(null);
            this.setIsChangeToSpecialWeapon(false);
        }
        else if (this.getIsChangeToSpecialWeapon()) {
            this.setOldWeapon(this.getCurrentWeapon());
            this.setCurrentWeapon(this.getChangeToWeapon());
            this.getCurrentWeapon().changeVisible(this.getIsWeaponVisible());
            this.getOldWeapon().changeVisible(false);
            this.getCurrentWeapon().switchIn2(1.0);
            this.setChangeToWeapon(null);
        }
        else {
            if (this.getChangeToWeapon()) {
                this.setCurrentWeapon(this.getChangeToWeapon());
                this.getCurrentWeapon().changeVisible(this.getIsWeaponVisible());
                this.getCurrentWeapon().switchIn();
                this.setChangeToWeapon(null);
            }
        }
    },

    /// protocol function to receive weapon notify message
    weaponSwitchBackNormal:function (weapon) {
        this.setIsWeaponSwitching(true);
        this.setIsShootable(false);
        this.setIsSpecialChangeBackNormal(true);
        this.getCurrentWeapon().setPosition(this._defaultWeaponPosition);
        this.getCurrentWeapon().switchOut2(2.0);
    },

    /// protocol function to receive weapon notify message
    weaponSwitchNormalLevel:function (newLevel) {
        this.setIsShootable(false);
        this.performCannonSwitch(newLevel);
    }
});