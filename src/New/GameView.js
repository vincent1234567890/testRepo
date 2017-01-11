/**
 * Created by eugeneseah on 25/10/16.
 */



const GameView = function(){
    "use strict";

    let _parentNode;
    let _curretBKG;
    let _touchLayer

    function initialise (parentNode) {
        // _parentNode = parentNode;

        // this._playerView = new PlayerView(parent);
        initialiseParent(parentNode);
    }

    function initialiseParent(parent) {
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
        if (parent === undefined && _parentNode && _parentNode.parent) {
            parent = _parentNode.parent;
        }
        if (_parentNode && _parentNode.parent) {
            _parentNode.parent.removeChild(_parentNode);
        }
        _parentNode = new cc.Node();
        parent.addChild(_parentNode, 99999);
    }

    function goToGame (touchAt) {

        if (_curretBKG){
            _parentNode.removeChild(_curretBKG);
        }
        _curretBKG = new cc.Sprite(res.GameBackground1);
        _curretBKG.setPosition(cc.view.getDesignResolutionSize().width/2, cc.view.getDesignResolutionSize().height/2);
        _parentNode.addChild(_curretBKG,-5);

        initialiseTouch(touchAt);
    }

    function goBackToLobby() {//hack
        _parentNode.parent.backToMenu();
    }

    function addView(view, depth){
        // if (parent){
        //     initialiseParent(parent);
        // }

        _parentNode.addChild(view, depth);
    }

    function destroyView(view){
        _parentNode.removeChild(view);
    }

    const initialiseTouch = function (touchAt) {
        if(_touchLayer){
            _parentNode.removeChild(_touchLayer);
        }

        _touchLayer = new TouchLayerRefactored(touchAt);
        _parentNode.addChild(_touchLayer, -1);
    };

    return {
        initialise : initialise,
        // parentNode : _parentNode,
        goToGame : goToGame,
        goBackToLobby : goBackToLobby,
        addView : addView,
        destroyView : destroyView,
    }



}();