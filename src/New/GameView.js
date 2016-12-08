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
        if (_curretBKG){
            _parentNode.removeChild(_curretBKG);
        }
        _curretBKG = new cc.Sprite(res.GameBackground1);
        _curretBKG.setPosition(cc.view.getDesignResolutionSize().width/2, cc.view.getDesignResolutionSize().height/2);
        _parentNode.addChild(_curretBKG,-5);
    };

    return {
        initialise : initialise,
        parentNode : _parentNode,
        goToGame :goToGame,
    }


}();