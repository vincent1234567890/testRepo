/**
 * Created by eugeneseah on 10/3/17.
 */

const JackpotManager = (function () {
    "use strict";

    const JackpotManager = function (gameConfig, index, isPlayer) {

    };

    const proto = JackpotManager.prototype;

    proto.shootTo = function (pos) {
        return this._cannonManager.shootTo(pos);
    };

    proto.getNextBulletId = function () {
        return (_bulletId++).toString(36);
    };

    proto.updatePlayerData = function (playerData) {
        this._playerView.updateView(playerData);
        if (typeof playerData.gunId === 'number') {
            this._cannonManager.forceSetGun(playerData.gunId);
        }
    };

    proto.clearPlayerData = function () {
        this._playerView.clearPlayerData();
        this._cannonManager.forceClearGun();
    };

    proto.destroyView = function(){
        this._playerView.destroyView();
        this._playerView = null;
        this._cannonManager.destroyView();
        this._cannonManager = null;
    };

    return JackpotManager;
}());