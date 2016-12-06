/**
 * Created by eugeneseah on 25/10/16.
 */



const GameView = function(){

    let _parentNode;
    let _curretBKG;

    let initialise = function (parentNode) {
        _parentNode = parentNode;
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);


        // this._playerView = new PlayerView(parent);
    };

    let goToGame = function () {
        _curretBKG = new cc.Sprite()
    };

    return {
        initialise : initialise,
        parentNode : _parentNode,
        goToGame :goToGame,
    }


}();