/**
 * Created by eugeneseah on 6/2/17.
 */
"use strict";
const GameTicker = cc.Node.extend( {

    //no need.
    _callback:null,
    _className:"GameTicker",
    _isPaused: true,

    ctor: function (callback) {
        this._callback = callback;
        cc.Node.prototype.ctor.call(this);
        this.scheduleUpdate();
    },

    pauseTicker(){
        this._isPaused = true;
    },

    unpauseTicker(){
        this._isPaused = false;
    },

    update: function (delta) {
        if(this._isPaused){
            return;
        }
        this._callback();
    },
});