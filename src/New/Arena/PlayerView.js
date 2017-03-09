/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";
var PlayerView = (function () {

    var PlayerView = function (gameConfig, slot, isPlayer) {
        this._playerViewStaticPrefabInstance = new PlayerViewStaticPrefab(gameConfig, slot, isPlayer);
    };

    PlayerView.prototype.updateView = function(playerData){
        this._playerViewStaticPrefabInstance.updatePlayerData(playerData);
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