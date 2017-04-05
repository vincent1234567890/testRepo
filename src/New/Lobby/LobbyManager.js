/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyManager = (function () {
    "use strict";

    let _profileManager;
    let _lobbyTheme;

    const LobbyManager = function (playerData, settingsCallback, onGameSelectedCallback) {
        _lobbyTheme = ThemeDataManager.getThemeDataList("LobbyData");

        const plists = ResourceLoader.getPlists("Lobby");
        for ( let list in plists){
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }
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