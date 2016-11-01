/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";
var PlayerView = (function () {

    var PlayerView = function (parent, pos) {
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
        this._playerViewStaticPrefabInstance = new PlayerViewStaticPrefab(parent, pos);
    };

    PlayerView.prototype.updateView = function(playerData){
        this._playerViewStaticPrefabInstance.updatePlayerData(playerData);
    };




    // PlayerView.prototype.

    // var PlayerView = function () {
    //     initialise : initialise,
    // }

    return PlayerView;
}());