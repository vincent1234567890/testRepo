/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";

var GameManager = function(){
    // var _gameView;
    var _gameConfig;
    var _playerId;
    var _parentNode;

    var _topLeft;
    var _topRight;
    var _bottomLeft;
    var _bottomRight;

    //production
    // var _other;

    var initialiseTouch = function (gameManager) {
        gameManager._touchLayer = TouchLayer.create();
        gameManager._touchLayer.setDelegate(gameManager);
        _parentNode.addChild(gameManager._touchLayer, 1000);
    }

    //callback for touchlayer
    //bad : refactor touchlayer
    var controlNewPosition = function (control, pos, yPos) {
        var rot = this._playerViewManager.turnTo(pos);
        const bulletId = _playerId + ':' + getPlayerBulletId();
        GameCtrl.informServer.bulletFired(bulletId, rot);
    }

    var getPlayerBulletId = function(){
        return GameManager._playerViewManager.getNextBulletId();
    }

    var initialise = function (parent) {

        _parentNode = new cc.Node();
        parent.addChild(_parentNode,99999);
        GameView.initialise(_parentNode);

        //for testing
        // _gameConfig.cannonPositions[1] = [cc.winSize.width - 125, 56];
        _gameConfig.cannonPositions[0] = [125,56];
        _gameConfig.cannonPositions[1] = [1400 - 125,56];
        _gameConfig.cannonPositions[2] = [125,56];
        _gameConfig.cannonPositions[3] = [125,56];



        this.bottomLeft = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions, 0);
        // this.bottomRight = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions, 1);

        // this._cannonManager = new CannonManager(this._playerViewStaticPrefab, cc.p(150,60));
        initialiseTouch(this);
    }

    var shootTo = function(pos){
        return this._playerViewManager.shootTo(pos);
    }

    var setGameConfig = function (config) {
        console.log(JSON.stringify(config));
        _gameConfig = config;
    }

    var setPlayerId = function (playerId) {
        _playerId = playerId;
    }

    var GameManager = {
        initialise : initialise,
        setGameConfig : setGameConfig,
        setPlayerId : setPlayerId,
        shootTo : shootTo, //sliohtly unsatisfactory

        //change to callback strategy instead of reverse public call
        controlNewPosition : controlNewPosition,
    }

    return GameManager;

}();