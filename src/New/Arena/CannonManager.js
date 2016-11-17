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
        this._currentValue = 1;
        this._cannon.updateCannonPowerLabel(this._currentValue);
        // this._posDebug = pos;
    };

    CannonManager.prototype.shootTo = function (pos) {
        this._cannon.turnTo(pos);
        return this._cannon.spawnBullet(pos);
    };

    CannonManager.prototype.turnTo = function (pos) {
        return this._cannon.turnTo(pos);
    };

    CannonManager.prototype.increaseCannon = function () {
        this._currentValue++;
        this._cannon.updateCannonPowerLabel(this._currentValue);
        GameCtrl.informServer.gunSelected(this._currentValue);
    };

    CannonManager.prototype.decreaseCannon = function () {
        this._currentValue--;
        this._cannon.updateCannonPowerLabel(this._currentValue);
        GameCtrl.informServer.gunSelected(this._currentValue);
    };

    CannonManager.prototype.getCurrentValue = function () {
        return this._currentValue;
    };

    return CannonManager;
}());