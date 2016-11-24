/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";

var CannonManager = (function () {

    function CannonManager(parent, pos, isPlayer) {
        this._cannon = new CannonView(parent, pos);
        if (isPlayer) {
            this._cannon.setupCannonChangeMenu(parent, this, pos, this.decreaseCannon, this.increaseCannon);
        }
        this.selectGun(0);
    };

    CannonManager.prototype.shootTo = function (pos) {
        this._cannon.turnTo(pos);
        return this._cannon.spawnBullet(pos);
    };

    CannonManager.prototype.turnTo = function (pos) {
        return this._cannon.turnTo(pos);
    };

    CannonManager.prototype.increaseCannon = function () {
        this.selectGun(this._currentGunId + 1);
    };

    CannonManager.prototype.decreaseCannon = function () {
        this.selectGun(this._currentGunId - 1);
    };

    CannonManager.prototype.selectGun = function (nextGunId) {
        const nextGunClass = GameManager.getGameConfig().gunClasses[nextGunId];

        if (!nextGunClass) {
            // Cannot select that gun - it doesn't exist!
            return;
        }

        this._currentGunId = nextGunId;
        this._cannon.updateCannonPowerLabel(nextGunClass.value);
        ClientServerConnect.getServerInformer().gunSelected(this._currentGunId);
    };

    CannonManager.prototype.getCurrentGunClass = function () {
        return GameManager.getGameConfig().gunClasses[this._currentGunId];
    };

    CannonManager.prototype.getCurrentValue = function () {
        return this.getCurrentGunClass().value;
    };

    CannonManager.prototype.destroyView = function () {
        this._cannon.parent.removeChild(this._cannon);
        this._cannon = null;
    };

    return CannonManager;
}());