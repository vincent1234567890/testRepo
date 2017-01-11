/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyManager = (function () {
// <<<<<<< HEAD
//     let LobbyManager = function (playerData) {
//         this._parent = new cc.Node();
//         cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
//         // this._parent = parent;
//         this.doView(playerData);
//     };
//
//     LobbyManager.prototype.getView = function () {
//         return this._parent;
//     };
//
//     LobbyManager.prototype.doView = function(playerData){
//         if (this._view){
//             this._parent.removeChild(this._view);
//         }
//         this._view = new LobbyView(this._parent, playerData);
// =======
    const LobbyManager = function (playerData, settingsCallback) {
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        this._parent = parent;
        this.doView(playerData, settingsCallback);
    };

    LobbyManager.prototype.doView = function(playerData, settingsCallback){
        if (this._view){
            // this._parent.removeChild(this._view);
            this._view.destroyView();
        }
        this._view = new LobbyView(playerData, settingsCallback);
    };

    return LobbyManager;
}());