/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyManager = (function () {
    let LobbyManager = function (parent) {
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        this._parent = parent;
        this.doView(parent);
    };

    LobbyManager.prototype.doView = function(parent){
        if (this._view){
            this._parent.removeChild(this._view);
        }
        this._view = new LobbyView(parent);
    };

    return LobbyManager;
}());