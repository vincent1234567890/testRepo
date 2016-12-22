/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyManager = (function () {
    let LobbyManager = function (playerData) {
        this._parent = new cc.Node();
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        // this._parent = parent;
        this.doView(playerData);
    };

    LobbyManager.prototype.getView = function () {
        return this._parent;
    };

    LobbyManager.prototype.doView = function(playerData){
        if (this._view){
            this._parent.removeChild(this._view);
        }
        this._view = new LobbyView(this._parent, playerData);
    };

    return LobbyManager;
}());