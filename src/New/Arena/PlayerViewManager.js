/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";
var PlayerViewManager = (function () {
    var _bulletId;

    var PlayerViewManager = function (parent, pos, isPlayer) {
        _bulletId = 0;

        this._cannonManager = new CannonManager(parent, pos, isPlayer);

        this._playerView = new PlayerView(parent, pos);// not ideal

    };

    var proto = PlayerViewManager.prototype;

    proto.turnTo = function (pos) {
        return this._cannonManager.turnTo(pos);
    };

    proto.shootTo = function (pos) {
        return this._cannonManager.shootTo(pos);
    };

    proto.getNextBulletId = function () {
        return (_bulletId++).toString(36);
    };

    proto.updatePlayerData = function (playerData) {
        this._playerData = playerData;
        // this._playerName = playerData.playerName;
        this._playerView.updateView(playerData);
        if (typeof playerData.gunId === 'number') {
            this._cannonManager.forceSetGun(playerData.gunId);
        }
    };

    proto.clearPlayerData = function () {
        this._playerView.clearPlayerData();
        this._cannonManager.forceClearGun();
    }

    proto.destroyView = function(){
        this._playerView.destroyView();
        this._playerView = null;
    };


    return PlayerViewManager;
}());

