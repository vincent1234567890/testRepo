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
        if (this._playerData.score > this._cannonManager.getCurrentValue()) {
            return this._cannonManager.shootTo(pos);
        }
    };

    proto.getNextBulletId = function () {
        return _bulletId++;
    };

    proto.updatePlayerData = function (playerData) {
        this._playerData = playerData;
        // this._playerName = playerData.playerName;
        this._playerView.updateView(playerData);
    };


    return PlayerViewManager;
}());