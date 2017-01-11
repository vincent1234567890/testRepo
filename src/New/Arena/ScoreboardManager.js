/**
 * Created by eugeneseah on 16/11/16.
 */

var ScoreboardManager = (function () {
    "use strict";
    var ScoreboardManager = function (data, parentGoToLobby, parentGoToNewRoom) {
        // this.parent = new cc.Node();
        cc.spriteFrameCache.addSpriteFrames(res.ScoreboardPlist);
        this._parentGoToLobby = parentGoToLobby;
        this._parentGoToNewRoom = parentGoToNewRoom;
        this.doView(data)
    };
    // ScoreboardManager.prototype.getView = function(parent, data){
    //     return this.parent;
    // };



    function goToLobby() {
        this._parentGoToLobby();
    }

    function goToNewRoom() {
        this._parentGoToNewRoom();
    }

    const proto = ScoreboardManager.prototype;

    proto.doView = function(data){
        this._view = new ScoreboardView(this, data, goToLobby, goToNewRoom);
    };

    proto.destroyView = function(){
        this._view.destroyView();
        this._view = null;
    };

    return ScoreboardManager;
})();