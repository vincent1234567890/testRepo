/**
 Base class for all special weapons.
 */
var WeaponSpecial = Weapon.extend({
    _currentEnergy:null,
    _energyPerShoot:null,
    _isShooting:null,
    _actorType:null,
    getCurrentEnergy:function () {
        return this._currentEnergy;
    },
    setCurrentEnergy:function (v) {
        this._currentEnergy = v;
    },
    getEnergyPerShoot:function () {
        return this._energyPerShoot;
    },
    setEnergyPerShoot:function (v) {
        this._energyPerShoot = v;
    },
    getIsShooting:function () {
        return this._isShooting;
    },
    setIsShooting:function (v) {
        this._isShooting = v;
    },
    getActorType:function () {
        return this._actorType;
    },
    setActorType:function (v) {
        this._actorType = v;
    },
    /**
     Init special weapon
     The spriteName is normal sprite name
     The spriteShoot is shooting sprite name
     The pos param determine base point of sprite
     The animationDelay param determine delay time between shooting animation images
     The energy param determine init energy count
     The shootCost determine energy cost per shoot
     */
    initWeapon:function (spriteName, spriteShoot, pos, animationDelay, energy, shootCost) {
        if (this._super(spriteName, spriteShoot, pos, animationDelay)) {
            this._currentEnergy = energy;
            this._energyPerShoot = shootCost;
            this._isShooting = false;
            return true;
        }

        return false;
    },
    /**
     After every shooting, update energy to determine weather can shoot more
     */
    updateEnergy:function () {
        this._currentEnergy -= this._energyPerShoot;
        if (this._currentEnergy < this._energyPerShoot) {
            this._isShootable = false;
        }
    },
    checkAndCleanOldNormalGain:function () {
        var powerWeaponGain = GameCtrl.sharedGame().getCurScene().getOddsNumber();
        if (PlayerActor.sharedActor().getNormalGain() >= powerWeaponGain) {
            wrapper.setIntegerForKey(kOldLaserNum, 0);
        }
    },
    specialShootingFinished:function (dt) {
        cc.director.getScheduler().unschedule(this.specialShootingFinished, this);
        this._isShooting = false;
        if (this._currentEnergy < this._energyPerShoot) {
            this._delegate.weaponSwitchBackNormal(this);
        }
        else {
            this._isShootable = true;
        }
    },
    changeVisible:function (isVisible) {
        this._super(isVisible);

        var spRainbow = GameCtrl.sharedGame().getCurScene().getChildByTag(456 + this.getActorType());
        if (spRainbow) {
            spRainbow.setVisible(isVisible);
        }
    },
    setDirection:function (newDirection) {
        if (this._isShooting) {
            return;
        }
        this._super(newDirection);
    },
    startCameraAnimation:function () {
        var pScene = GameCtrl.sharedGame().getCurScene();
        pScene.startCameraAnimation();
    }
});
