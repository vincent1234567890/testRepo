/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyManager = (function () {
    let LobbyManager = function (parent, playerData, settingsCallback) {
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        this._parent = parent;
        this.doView(parent, playerData, settingsCallback);
    };

    LobbyManager.prototype.doView = function(parent, playerData, settingsCallback){
        if (this._view){
            this._parent.removeChild(this._view);
        }
        this._view = new LobbyView(parent, playerData, settingsCallback);
    };

    return LobbyManager;
}());