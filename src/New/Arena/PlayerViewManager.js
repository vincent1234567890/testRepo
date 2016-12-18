/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";
const PlayerViewManager = (function () {
    let _bulletId;

    const PlayerViewManager = function (parent, gameConfig, index, isPlayer) {
        _bulletId = 0;

        this._cannonManager = new CannonManager(parent, gameConfig, index, isPlayer);

        this._playerView = new PlayerView(parent, gameConfig, index);// not ideal

    };

    const proto = PlayerViewManager.prototype;

    // proto.turnTo = function (pos) {
    //     return this._cannonManager.turnTo(pos);
    // };

    proto.shootTo = function (pos) {
        return this._cannonManager.shootTo(pos);
    };

    proto.getNextBulletId = function () {
        return (_bulletId++).toString(36);
    };

    proto.updatePlayerData = function (playerData) {
        // this._playerData = playerData;
        // this._playerName = playerData.playerName;
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
    };


    return PlayerViewManager;
}());

