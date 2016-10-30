/**
 * Created by eugeneseah on 25/10/16.
 */



var GameView = function(){

    var initialise = function (parent) {
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);

        // this._playerView = new PlayerView(parent);
    }

    var GameView = {
        initialise : initialise,
    }

    return GameView;

}();