/**
 * Created by eugeneseah on 27/10/16.
 */
const PlayerViewManager = (function () {
    "use strict";
    let _bulletId;

    const PlayerViewManager = function (gameConfig, index, isPlayer, changeSeatCallback) {
        _bulletId = 0;
        this._cannonManager = new CannonManager(gameConfig, index, isPlayer);

        this._gameConfig = gameConfig;

        const changeSeat = (slot) =>{
            changeSeatCallback(slot);
        };

        this._playerView = new PlayerView(gameConfig, index, isPlayer, changeSeat);// not ideal : could have been parented to cannon and rotated accordingly
    };

    const proto = PlayerViewManager.prototype;



    proto.shootTo = function (pos) {
        return this._cannonManager.shootTo(pos);
    };

    proto.getNextBulletId = function () {
        return (_bulletId++).toString(36);
    };

    proto.updatePlayerData = function (playerData, isChangeSeat) {
        this._playerView.updateView(playerData, isChangeSeat);
        if (isChangeSeat != null){
            console.log(playerData);
            this._cannonManager.showGun();
            this._cannonManager.setUpCannonChangeMenu(this._gameConfig, playerData.slot);
        }
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

