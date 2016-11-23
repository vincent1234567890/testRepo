/**
 * Created by eugeneseah on 16/11/16.
 */

var ScoreboardManager = (function () {

    var ScoreboardManager = function (parent, data, parentGoToLobby, parentGoToNewRoom) {
        cc.spriteFrameCache.addSpriteFrames(res.ScoreboardPlist);
        this._parentGoToLobby = parentGoToLobby;
        this._parentGoToNewRoom = parentGoToNewRoom;
        this.doView(parent, data)
    };

    ScoreboardManager.prototype.doView = function(parent, data){
        this._view = new ScoreboardView(parent, this, data, goToLobby, goToNewRoom);
    };

    function goToLobby() {
        this._parentGoToLobby();
    }

    function goToNewRoom() {
        this._parentGoToNewRoom();
    }

    return ScoreboardManager;
})();