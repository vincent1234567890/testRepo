/**
 * Created by eugeneseah on 25/10/16.
 */

/*
    Current structure - > GameView -> x PlayerViews -> CannonManager -> CannonView
                                                    -> PlayerViewStaticPrefab
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