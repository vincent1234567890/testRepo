/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";
var PlayerViewManager = (function () {
    var _bulletId;

    var PlayerViewManager = function (parent, cannonPositions, slot, isPlayer) {
        _bulletId = 0;
        this._cannonManager = new CannonManager( parent, cannonPositions[slot]);
        // this._cannonManager = new CannonManager( parent, [125,56]);

        this._playerView = new PlayerView(parent, cannonPositions, slot, isPlayer, this._cannonManager);// not ideal

    };

    PlayerViewManager.prototype.turnTo = function(pos){
        return this._cannonManager.turnTo(pos);
    };

    PlayerViewManager.prototype.shootTo = function(pos){
        return this._cannonManager.shootTo(pos);
    };

    PlayerViewManager.prototype.getNextBulletId = function(){
        return _bulletId++;
    }

    // var PlayerView = function () {
    //     initialise : initialise,
    // }

    return PlayerViewManager;
}());