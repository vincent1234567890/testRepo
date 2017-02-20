/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";

const CannonManager = (function () {

    let _gameConfig;

    function CannonManager(gameConfig, index, isPlayer) {
        _gameConfig = gameConfig;
        // cc.spriteFrameCache.addSpriteFrames(res.Cannon1Plist);
        const plists = ResourceLoader.getPlists("Weapons");
        for ( let list in plists){
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }
        this._cannon = new CannonView(gameConfig, index);
        if (isPlayer) {
            this._cannon.setupCannonChangeMenu(this, gameConfig, index, this.decreaseCannon, this.increaseCannon);
            // this.forceSetGun(0);
        }

    }

    let proto = CannonManager.prototype;

    proto.shootTo = function (pos) {
        this._cannon.shootTo(pos);
        // return this._cannon.spawnBullet(pos);
    };

    // CannonManager.prototype.turnTo = function (pos) {
    //     return this._cannon.turnTo(pos);
    // };

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
        if (this._currentGunId != gunId) {
            this._cannon.updateCannonPowerLabel(gunClass.value);
        }
        this._currentGunId = gunId;
    };

    proto.forceClearGun = function () {
        this._cannon.clearCannonPowerLabel();
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

    return CannonManager;
}());