/**
 * Created by eugeneseah on 26/10/16.
 */

var PlayerView = (function () {
    "use strict";
    var PlayerView = function (gameConfig, slot, isPlayer, changeSeatCallback) {
        this._changeSeatCallback = changeSeatCallback;
        const changeSeat = (slot) =>{
            changeSeatCallback(slot);
        };
        this._playerViewStaticPrefabInstance = new PlayerViewStaticPrefab(gameConfig, slot, isPlayer, changeSeat);
    };

    PlayerView.prototype.updateView = function(playerData, isChangeSeat){
        this._playerViewStaticPrefabInstance.updatePlayerData(playerData, isChangeSeat);
    };

    PlayerView.prototype.clearPlayerData = function () {
        this._playerViewStaticPrefabInstance.clearPlayerData();
    };

    PlayerView.prototype.destroyView = function () {
        // this._playerViewStaticPrefabInstance.parent.removeChild(this._playerViewStaticPrefabInstance);
        this._playerViewStaticPrefabInstance.destroyView();
        this._playerViewStaticPrefabInstance = null;
    };

    return PlayerView;
}());