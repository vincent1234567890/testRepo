/**
 * Created by eugeneseah on 16/11/16.
 */

var ScoreboardManager = (function () {

    var ScoreboardManager = function (parent, parentGoToLobby, parentGoToNewRoom) {
        cc.spriteFrameCache.addSpriteFrames(res.ScoreboardPlist);
        this._parentGoToLobby = parentGoToLobby;
        this._parentGoToNewRoom = parentGoToNewRoom;
        this.doView(parent)
    };

    ScoreboardManager.prototype.doView = function(parent){
        this._view = new ScoreboardView(parent, this, goToLobby, goToNewRoom);
    };

    function goToLobby() {
        this._parentGoToLobby();
        // this._view.parent.removeChild(this._view);
    }

    function goToNewRoom() {
        this._parentGoToNewRoom();
        this._view.parent.removeChild(this._view);
    }

    return ScoreboardManager;
})();