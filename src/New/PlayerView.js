/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";
var PlayerView = (function () {

    var PlayerView = function (parent,pos, cannonPositions, slot) {
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
        this.playerViewStaticPrefabInstance = new PlayerViewStaticPrefab(parent, pos, undefined, undefined, cannonPositions,slot);
    }

    // PlayerView.prototype.

    // var PlayerView = function () {
    //     initialise : initialise,
    // }

    return PlayerView;
}());