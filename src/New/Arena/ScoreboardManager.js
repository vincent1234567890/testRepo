/**
 * Created by eugeneseah on 16/11/16.
 */

var ScoreboardManager = (function () {
    "use strict";
    let _parentGoToLobby;
    let _parentGoToNewRoom;
    var ScoreboardManager = function (data, parentGoToLobby, parentGoToNewRoom) {
        // this.parent = new cc.Node();
        cc.spriteFrameCache.addSpriteFrames(res.ScoreboardPlist);
        _parentGoToLobby = parentGoToLobby;
        _parentGoToNewRoom = parentGoToNewRoom;
        this.displayView(data)
    };
    // ScoreboardManager.prototype.getView = function(parent, data){
    //     return this.parent;
    // };



    function goToLobby() {
        _parentGoToLobby();
    }

    function goToNewRoom() {
        _parentGoToNewRoom();
    }

    const proto = ScoreboardManager.prototype;

    proto.displayView = function(data){
        this._view = new ScoreboardView(this, data, goToLobby, goToNewRoom);
    };

    proto.destroyView = function(){
        this._view.destroyView();
        this._view = null;
    };

    return ScoreboardManager;
})();