/**
 * Created by eugeneseah on 27/10/16.
 */
const PlayerViewManager = (function () {
    "use strict";
    let _bulletId;

    const PlayerViewManager = function (gameConfig, index, isPlayer) {
        _bulletId = 0;
        this._cannonManager = new CannonManager(gameConfig, index, isPlayer);
        this._playerView = new PlayerView(gameConfig, index);// not ideal
    };

    const proto = PlayerViewManager.prototype;

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

    return PlayerViewManager;
}());

