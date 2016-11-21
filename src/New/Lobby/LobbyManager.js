/**
 * Created by eugeneseah on 15/11/16.
 */
var LobbyManager = function () {
    var LobbyManager = function (parent) {
        this._parent = parent;
        this.doView(parent);
    };

    LobbyManager.prototype.doView = function(parent){
        this._view = new LobbyView(parent);
    };
    return LobbyManager;
}();