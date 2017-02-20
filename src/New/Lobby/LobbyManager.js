/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyManager = (function () {
    "use strict";
// <<<<<<< HEAD
//     let LobbyManager = function (playerData) {
//         this._parent = new cc.Node();
//         cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
//         // this._parent = parent;
//         this.displayView(playerData);
//     };
//
//     LobbyManager.prototype.getView = function () {
//         return this._parent;
//     };
//
//     LobbyManager.prototype.displayView = function(playerData){
//         if (this._view){
//             this._parent.removeChild(this._view);
//         }
//         this._view = new LobbyView(this._parent, playerData);
// =======

    let _profileManager;

    const LobbyManager = function (playerData, settingsCallback, onGameSelectedCallback) {
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        this._parent = parent;
        _profileManager = new ProfileManager();
        this.displayView(playerData, settingsCallback,onGameSelectedCallback);
    };

    LobbyManager.prototype.displayView = function(playerData, settingsCallback, onGameSelectedCallback){
        if (this._view){
            // this._parent.removeChild(this._view);
            this._view.destroyView();
        }
        this._view = new LobbyView(playerData, settingsCallback,onGameSelectedCallback, onRequestShowProfile);
    };

    function onRequestShowProfile(){
        _profileManager.displayView();


    }

    return LobbyManager;
}());