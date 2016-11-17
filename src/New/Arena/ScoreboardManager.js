/**
 * Created by eugeneseah on 16/11/16.
 */

var ScoreboardManager = (function () {

    var ScoreboardManager = function (parent, parentGoToLobby, parentGoToNewRoom) {
        cc.spriteFrameCache.addSpriteFrames(res.ScoreboardPlist);
        this._view = new ScoreboardView(parent, this, goToLobby, goToNewRoom);
        this._parentGoToLobby = parentGoToLobby;
        this._parentGoToNewRoom = parentGoToNewRoom;
    };

    function goToLobby() {
        this._parentGoToLobby();
    };

    function goToNewRoom() {
        this._parentGoToNewRoom();
    };

    return ScoreboardManager;
})();