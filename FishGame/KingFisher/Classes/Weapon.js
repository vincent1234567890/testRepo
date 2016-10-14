/// switchIn animation finished notify message
var WEAPON_SWITCHIN_FINISHED = "WEAPON_SwitchIn_Finished";

/// switchOut animation finished notify message
var WEAPON_SWITCHOUT_FINISHED = "WEAPON_SwitchOut_Finished";

/// switchOut2 for special weapon animation finished notify message
var WEAPON_SWITCHOUT2_FINISHED = "WEAPON_SwitchOut2_Finished";

/// special weapon run out energy, change back to normal weapon notify message
var WEAPON_SWITCHBACK_NORMAL = "WEAPON_Switchback_Normal";

var SHOOT_ANIMATIONTAG = 444;
var SWITCHIN_ANIMATIONTAG = 111;
var SWITCHIN2_ANIMATIONTAG = 1111;
var SWITCHOUT_ANIMATIONTAG = 777;
var SWITCHOUT2_ANIMATIONTAG = 7777;

/**
 Base class for all weapons. When expand weapon system, normal weapon will
 inherit from WeaponCannonBase class, special weapon will inherit from
 WeaponSpecialBase class.
 */
var Weapon = cc.Node.extend({
    _weaponDirection:null,
    _isShootable:true,
    _isSwitching:false,
    _cannonLevel:0,
    _weaponPosition:null,
    _delegate:null,
    _weaponSprite:null,
    _shootAnimation:null,
    _shootFlag:null,
    getWeaponDirection:function () {
        return this._weaponDirection;
    },
    setWeaponDirection:function (v) {
        this._weaponDirection = v;
    },
    getIsShootable:function () {
        return this._isShootable;
    },
    setIsShootable:function (v) {
        this._isShootable = v;
    },
    getIsSwitching:function () {
        return this._isSwitching;
    },
    setIsSwitching:function (v) {
        this._isSwitching = v;
    },
    getCannonLevel:function () {
        return this._cannonLevel;
    },
    setCannonLevel:function (v) {
        this._cannonLevel = v;
    },
    getWeaponPosition:function () {
        return this._weaponPosition;
    },
    setWeaponPosition:function (v) {
        this._weaponPosition = v;
    },
    getDelegate:function () {
        return this._delegate;
    },
    setDelegate:function (v) {
        this._delegate = v;
    },
    getWeaponSprite:function () {
        return this._weaponSprite;
    },
    setWeaponSprite:function (v) {
        this._weaponSprite = v;
    },
    getShootAnimation:function () {
        return this._shootAnimation;
    },
    setShootAnimation:function (v) {
        this._shootAnimation = v;
    },
    getShootFlag:function () {
        return this._shootFlag;
    },
    setShootFlag:function (v) {
        this._shootFlag = v;
    },
    /**
     Init weapon and create sprite & shoot animation with given name
     The spriteName is normal sprite name
     The spriteShoot is shooting sprite name
     The pos param determine base point of sprite
     The shootAnimationDelay param determine delay time between shooting animation
     images
     */
    initWeapon:function (spriteName, spriteShoot, pos, shootAnimationDelay) {
        if (arguments.length < 4) {
            return true;
        }
        this._isShootable = false;
        this._isSwitching = false;
        this._weaponPosition = pos;
        this.setVisible(false);
        this.setContentSize(cc.SizeMake(200, 100));
        var cannon = cc.Sprite.createWithSpriteFrameName(spriteName);

        this.setWeaponSprite(cannon);

        this.setPosition(pos);
        this.addChild(this.getWeaponSprite(), 30);

        this.getWeaponSprite().setPosition(cc.p(this.getContentSize().width / 2, cannon.getContentSize().height / 2 - 58));

        var frameCache = cc.SpriteFrameCache.getInstance();
        var normalSprite = frameCache.getSpriteFrame(spriteName);
        var shootSprite = frameCache.getSpriteFrame(spriteShoot);
        var frames = [];
        frames.push(normalSprite, shootSprite);

        var animation = cc.Animation.create(frames, shootAnimationDelay);
        this.setShootAnimation(cc.Animate.create(animation));
        this.getShootAnimation().setTag(SHOOT_ANIMATIONTAG);

        return true;
    },

    /**
     Switch to this weapon, show switching animation and make self visible. For
     switching between normal weapons
     */
    switchIn:function () {
        this._isSwitching = true;
        this._isShootable = false;

        this.getWeaponSprite().setScale(0.2);
        var moveby = cc.ScaleTo.create(0.2, 1.0);
        var callback = cc.CallFunc.create(this, this.switchFinished, WEAPON_SWITCHIN_FINISHED);

        var sequence = cc.Sequence.create(moveby, callback);
        sequence.setTag(SWITCHIN_ANIMATIONTAG);
        this.getWeaponSprite().runAction(sequence);
    },

    /**
     Switch to this weapon, show switching animation and make self visible. For
     switching between normal and special weapons
     The animationDelay param determine switch animation duration
     */
    switchIn2:function (animationDelay) {
        this._isSwitching = true;
        this._isShootable = false;

        if (this.getWeaponSprite().getPosition().y > 0) {
            this.getWeaponSprite().setPosition(cc.pSub(this.getWeaponSprite().getPosition(), cc.p(0, 100)));
        }
        var moveby = cc.MoveBy.create(animationDelay, cc.p(0, 100));
        var callBack = cc.CallFunc.create(this, this.switchFinished, WEAPON_SWITCHIN_FINISHED);

        var sequence = cc.Sequence.create(moveby, callBack);
        sequence.setTag(SWITCHIN2_ANIMATIONTAG);
        this.getWeaponSprite().runAction(sequence);
    },

    /**
     Switch to other weapon, show switching animation and hide self. For switching
     between normal weapons.
     */
    switchOut:function () {
        this._isSwitching = true;
        this._isShootable = false;

        var moveby = cc.ScaleTo.create(0.2, 0.1);
        var callback = cc.CallFunc.create(this, this.switchFinished, WEAPON_SWITCHOUT_FINISHED);

        var sequence = cc.Sequence.create(moveby, callback);
        sequence.setTag(SWITCHOUT_ANIMATIONTAG);
        this.getWeaponSprite().runAction(sequence);
    },

    /**
     Switch to other weapon, show switching animation and hide self. For switching
     between normal and special weapons.
     The animationDelay param determine switch animation duration
     */
    switchOut2:function (animationDelay) {
        this._isSwitching = true;
        this._isShootable = false;

        var moveby = cc.MoveBy.create(animationDelay, cc.p(0, -100));
        var callBack = cc.CallFunc.create(this, this.switchFinished, WEAPON_SWITCHOUT2_FINISHED);

        var sequence = cc.Sequence.create(moveby, callBack);
        sequence.setTag(SWITCHOUT2_ANIMATIONTAG);
        this.getWeaponSprite().runAction(sequence);
    },

    /**
     Shoot to target position, and show shooting animation
     */
    shootTo:function (targetPos) {
        this.setDirection(targetPos);
    },

    /**
     Change weapon direction, use for switching between normal weapons, make
     new weapon keep old direction as old weapon, it should be call before
     switchIn function when switching weapons, to make switching animation
     smoothly.
     */
    setDirection:function (newDirection) {
        var direction = cc.pNormalize(cc.pSub(newDirection, this.getPosition()));
        var ang = Math.atan2(direction.x, direction.y);
        this.getWeaponSprite().setRotation(ang / Math.PI * 180.0);

        this._weaponDirection = newDirection;
    },

    /**
     Change normal cannon switching button status
     The enable param determin wheather button can be pressed or not
     */
    setButtonsEnable:function (enable) {
    },

    /**
     Change weapon is visible or not. If subclass has it's own sprite, subclass must
     override this function to implement the show and hide of it's own sprite.
     */
    changeVisible:function (isVisible) {
        this.setVisible(isVisible);
        this.getWeaponSprite().setVisible(isVisible);
    },

    stopFunction:function () {
        this.getWeaponSprite().stopAllActions();
    },

    switchFinished:function (sender, event) {
        var eventName = event;

        if (WEAPON_SWITCHIN_FINISHED == eventName) {
            this._isShootable = true;
            this._delegate.weaponSwitchInFinished(this);
        }
        else if (WEAPON_SWITCHOUT_FINISHED == eventName) {
            this.getWeaponSprite().setVisible(false);
            this.removeFromParentAndCleanup(true);
            this._delegate.weaponSwitchOutFinished(this);
        }
        else if (WEAPON_SWITCHOUT2_FINISHED == eventName) {
            if (this._cannonLevel >= FishWeaponType.eWeaponLevel8 && this._cannonLevel != FishWeaponType.eWeaponLevel10) {
                this.removeFromParentAndCleanup(true);
            }
            this.getWeaponSprite().setVisible(false);
            this._delegate.weaponSwitchOutFinished(this);
        }

        this._isSwitching = false;
    }

});