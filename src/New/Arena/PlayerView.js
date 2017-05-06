//Player view
var PlayerView = (function () {
    "use strict";
    var PlayerView = function (gameConfig, slot, isPlayer, changeSeatCallback, lockOnCallback, fishLockStatus) {
        // this._changeSeatCallback = changeSeatCallback;
        const changeSeat = (slot) =>{
            changeSeatCallback(slot);
        };

        const onLockOnRequest = (state) =>{
            lockOnCallback(state);
        };

        this._playerViewStaticPrefabInstance = new PlayerViewStaticPrefab(gameConfig, slot, isPlayer,
            changeSeat, onLockOnRequest, fishLockStatus);
    };

    const proto = PlayerView.prototype;

    proto.updateView = function(playerData, isChangeSeat){
        this._playerViewStaticPrefabInstance.updatePlayerData(playerData, isChangeSeat);
    };

    proto.clearPlayerData = function () {
        this._playerViewStaticPrefabInstance.clearPlayerData();
    };

    proto.destroyView = function () {
        // this._playerViewStaticPrefabInstance.parent.removeChild(this._playerViewStaticPrefabInstance);
        this._playerViewStaticPrefabInstance.destroyView();
        this._playerViewStaticPrefabInstance = null;
    };

    proto.showAwardMedal = function (amount) {
        this._playerViewStaticPrefabInstance.showAwardMedal(amount);
    };

    proto.setMultiplier = function (amount) {
        this._playerViewStaticPrefabInstance.setMultiplier(amount);
    };

    return PlayerView;
}());