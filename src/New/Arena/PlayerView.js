/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";
var PlayerView = (function () {

    var PlayerView = function (parent, gameConfig, slot) {
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
        this._playerViewStaticPrefabInstance = new PlayerViewStaticPrefab(parent, gameConfig, slot);
    };

    PlayerView.prototype.updateView = function(playerData){
        this._playerViewStaticPrefabInstance.updatePlayerData(playerData);
    };

    PlayerView.prototype.clearPlayerData = function () {
        this._playerViewStaticPrefabInstance.clearPlayerData();
    }

    PlayerView.prototype.destroyView = function () {
        // this._playerViewStaticPrefabInstance.parent.removeChild(this._playerViewStaticPrefabInstance);
        this._playerViewStaticPrefabInstance.destroyView();
        this._playerViewStaticPrefabInstance = null;
    };

    return PlayerView;
}());