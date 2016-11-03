/**
 * Created by eugeneseah on 27/10/16.
 */

/*
 Current structure : GameManager    -> GameView
                                    -> x PlayerViewManager  -> CannonManager -> CannonView
                                                            -> PlayerView -> PlayerViewStaticPrefab
 */
"use strict";

var GameManager = function(){
    var _gameConfig;

    // var fishGameArena;
    var _fishGameArena;

    //player
    var _playerSlot;
    var _playerId;
    var _lastShotTime;

    //parent node for UI parenting
    var _parentNode;

    var _playerViews = [];

    //to be refactored in to player object?
    var _playerPositions = [];

    var initialiseTouch = function (gameManager) {
        gameManager._touchLayer = new TouchLayerRefactored(controlNewPosition);
        // gameManager._touchLayer.setDelegate(gameManager);
        _parentNode.addChild(gameManager._touchLayer, 1000);
    };

    //callback for touchlayer
    //bad : refactor touchlayer
    var controlNewPosition = function (control, pos, yPos) {

        const lastShootTime = this._lastShotTime || -Infinity;
        const now = this._fishGameArena.getGameTime();
        const timeSinceLastShot = now - lastShootTime;
        if (timeSinceLastShot < 0.98 * _gameConfig.shootInterval) {
            // console.log("TOOFAST");
            return;
        }

        this._lastShotTime = now;

        // change this to current player position
        var rot = _playerViews[_playerSlot].turnTo(pos);
        const bulletId = _playerId + ':' + getPlayerBulletId();


        GameCtrl.informServer.bulletFired(bulletId, rot);
    };

    var getPlayerBulletId = function(){
        return _playerViews[_playerSlot].getNextBulletId();
    };

    var initialise = function (parent, fishGameArena) {
        _parentNode = new cc.Node();
        parent.addChild(_parentNode,99999);
        this._fishGameArena = fishGameArena;
        this._lastShotTime = -Infinity;

        GameView.initialise(_parentNode);

        for (var i = 0; i < _gameConfig.maxPlayers ; i++){
            _playerViews[i] = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions[i], i == _playerSlot);
        }

        initialiseTouch(this);
    };

    var shootTo = function(playerId,pos){
        for (var p of _playerPositions){
            if(p && p.playerId == playerId){
                return _playerViews[p.playerSlot].shootTo(pos);
            }
        };
    };

    var setGameState = function (config, playerId, playerSlot) {
        console.log(JSON.stringify(config));
        _gameConfig = config;
        _playerId = playerId;
        _playerSlot = playerSlot;
    };

    var updateMultiplayerState = function(playerData){
        console.log(playerData);
        //{playerId : playerId, playerName : playerName, playerSlot : playerSlot}
        _playerPositions[playerData.playerSlot] = playerData;
        _playerViews[playerData.playerSlot].updatePlayerData(playerData);
    }


    var GameManager = {
        initialise : initialise,
        setGameState : setGameState,
        updateMultiplayerState : updateMultiplayerState,
        // setPlayerId : setPlayerId,
        shootTo : shootTo, //sliohtly unsatisfactory

        //change to callback strategy instead of reverse public call
        // controlNewPosition : controlNewPosition,
    };

    return GameManager;
}();