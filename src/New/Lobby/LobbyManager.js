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
    let _lobbyTheme;

    const LobbyManager = function (playerData, settingsCallback, onGameSelectedCallback) {
        _lobbyTheme = ThemeDataManager.getThemeDataList("LobbyData");
        // const gameList = _lobbyTheme.GameList;
        // for ( let i = 0; i < gameList.length; i++ )
        // {
        //     cc.spriteFrameCache.addSpriteFrames(res["GameType" + gameList[i] + "Plist"]);
        // }
        const plists = ResourceLoader.getPlists("Lobby");
        for ( let list in plists){
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }
        // cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        this._parent = parent;
        _profileManager = new ProfileManager();
        this.displayView(playerData, settingsCallback,onGameSelectedCallback);
    };

    LobbyManager.prototype.displayView = function(playerData, settingsCallback, onGameSelectedCallback){
        if (this._view){
            // this._parent.removeChild(this._view);
            this._view.destroyView();
        }
        this._view = new LobbyView(playerData,_lobbyTheme, settingsCallback,onGameSelectedCallback, onRequestShowProfile);
    };

    function onRequestShowProfile(){
        _profileManager.displayView();
    }

    LobbyManager.prototype.resetView = function(){
        this._view.resetView();
    };

    return LobbyManager;
}());