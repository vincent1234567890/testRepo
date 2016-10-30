/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";

var CannonManager = (function () {



    function CannonManager(parent, pos){
        this._cannon = new CannonView(parent, pos);
        this._currentValue = 1;
    };

    CannonManager.prototype.shootTo = function (pos) {
        this._cannon.turnTo(pos);
        return this._cannon.spawnBullet(pos);
    };

    CannonManager.prototype.turnTo = function (pos) {
        return this._cannon.turnTo(pos);
    };
    
    CannonManager.prototype.increaseCannon = function () {
        this._currentValue++ ;
    }

    CannonManager.prototype.decreaseCannon = function () {
        this._currentValue--;
    }

    CannonManager.prototype.getCurrentValue = function (){
        return this._currentValue;
    }

    return CannonManager;
}());