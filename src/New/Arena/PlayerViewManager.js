const PlayerViewManager = (function () {
    "use strict";
    let _bulletId;

    /**
     * Player View manager
     * @param {Object} gameConfig game config from the Server.
     * @param {Number} index
     * @param {Boolean} isPlayer
     * @param {function} changeSeatCallback the callback, when player change seat.
     * @param lockOnCallback
     * @param fishLockStatus
     * @constructor
     */
    const PlayerViewManager = function (gameConfig, index, isPlayer, changeSeatCallback, lockOnCallback, fishLockStatus) {
        _bulletId = 0;
        this._cannonManager = new CannonManager(gameConfig, index, isPlayer);

        this._gameConfig = gameConfig;

        const changeSeat = (slot) =>{
            changeSeatCallback(slot);
        };

        const onLockOnRequest = (state) =>{
            lockOnCallback(state);
        };

        this._playerView = new PlayerView(gameConfig, index, isPlayer, changeSeat, onLockOnRequest, fishLockStatus);
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
        this._cannonManager.showGun();
        if (isChangeSeat != null){
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

    proto.showAwardMedal = function (type, amount) {
        this._playerView.showAwardMedal(type, amount);
    };

    proto.setMultiplier = function (multiplier) {
        this._playerView.setMultiplier(multiplier);
        this._cannonManager.setMultiplier(multiplier);
    };

    return PlayerViewManager;
}());

