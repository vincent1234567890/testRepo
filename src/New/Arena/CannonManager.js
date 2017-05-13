//use for manage cannon.
const CannonManager = (function () {
    "use strict";
    let _gameConfig;  //reference to game config.

    function CannonManager(gameConfig, index, isPlayer) {
        _gameConfig = gameConfig;
        // cc.spriteFrameCache.addSpriteFrames(res.Cannon1Plist);
        const plists = ResourceLoader.getPlists("Weapons");
        for ( let list in plists){
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }
        this._cannon = new CannonView(gameConfig, index);
        if (isPlayer) {
            this.setUpCannonChangeMenu(gameConfig, index);
            // this._cannon.setupCannonChangeMenu(this, gameConfig, index, this.decreaseCannon, this.increaseCannon);
            this.forceSetGun(0);
        }else{
            this.forceClearGun();
        }
    }

    let proto = CannonManager.prototype;

    proto.shootTo = function (pos) {
        this._cannon.shootTo(pos);
        // return this._cannon.spawnBullet(pos);
    };

    proto.setUpCannonChangeMenu = function (gameConfig, index) {
        this._cannon.setupCannonChangeMenu(this, gameConfig, index, this.decreaseCannon, this.increaseCannon);
        // this.forceSetGun(0);
    };

    proto.increaseCannon = function () {
        this.selectGun(this._currentGunId + 1);
    };

    proto.decreaseCannon = function () {
        this.selectGun(this._currentGunId - 1);
    };

    /**
     * Try to switch to another gun (for the current player only).
     */
    proto.selectGun = function (nextGunId) {
        // @todo Pass the arena or serviceLocator down to this cannon, so it can check the following
        //if (!getArena().canSwitchGun()) {
        //    return;
        //}
        const nextGunClass = _gameConfig.gunClasses[nextGunId];

        if (!nextGunClass) {
            // Cannot select that gun - it doesn't exist!
            return;
        }

        ClientServerConnect.getServerInformer().gunSelected(nextGunId);
        this.forceSetGun(nextGunId);
    };

    /**
     * Switch to another gun.  Used when the server tells us that another player has changed gun, or when the current
     * player has successfully changed gun.
     */
    proto.forceSetGun = function (gunId) {
        const gunClass = _gameConfig.gunClasses[gunId];
        if (this._currentGunId !== gunId) {
            this._cannon.updateCannonPowerLabel(gunClass.value);
        }
        this._currentGunId = gunId;
    };

    proto.forceClearGun = function () {
        // this._cannon.clearCannonPowerLabel();
        this._cannon.hideView();
    };

    proto.showGun = function () {
        this._cannon.showView();
    };

    proto.getCurrentGunClass = function () {
        return _gameConfig.gunClasses[this._currentGunId];
    };

    proto.getCurrentValue = function () {
        return this.getCurrentGunClass().value;
    };

    proto.destroyView = function () {
        // this._cannon.parent.removeChild(this._cannon);
        this._cannon.destroyView();
        this._cannon = null;
    };

    proto.setMultiplier = function (multiplier) {
        this._cannon.setMultiplier(multiplier);
    };

    return CannonManager;
}());