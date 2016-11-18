/**
 * Created by eugeneseah on 25/10/16.
 */



var GameView = function(){

    var _parentNode;

    var initialise = function (parentNode) {
        _parentNode = parentNode;
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);

        // this._playerView = new PlayerView(parent);
    }

    var GameView = {
        initialise : initialise,
        parentNode : _parentNode,
    }

    return GameView;

}();