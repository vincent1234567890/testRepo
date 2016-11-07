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

    var _touchLayer;

    //player
    var _playerSlot;
    var _playerId;
    var _lastShotTime;

    //parent node for UI parenting
    var _parentNode;

    //Managers
    var _playerViews = [];
    var _fishManager;

    //to be refactored in to player object?
    var _playerPositions = [];

    var initialiseTouch = function () {
        if(!_touchLayer) {
            _touchLayer = new TouchLayerRefactored(touchAt);
            _parentNode.addChild(_touchLayer, -1);
        }
    };

    var touchAt = function (pos) {

        const lastShootTime = this._lastShotTime || -Infinity;
        const now = _fishGameArena.getGameTime();
        const timeSinceLastShot = now - lastShootTime;
        if (timeSinceLastShot < _gameConfig.shootInterval) {
            // console.log("TOO FAST!");
            return;
        }

        this._lastShotTime = now;

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
        _fishGameArena = fishGameArena;
        _lastShotTime = -Infinity;
        _fishManager = new FishViewManager(_parentNode, _fishGameArena);

        GameView.initialise(_parentNode);

        for (var i = 0; i < _gameConfig.maxPlayers ; i++){
            _playerViews[i] = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions[i], i == _playerSlot);
        }

        initialiseTouch();
    };

    var shootTo = function(playerId,pos){
        for (var p of _playerPositions){
            if(p && p.id == playerId){
                return _playerViews[p.slot].shootTo(pos);
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
        //{id: playerId, name: playerName, slot: playerSlot}
        _playerPositions[playerData.slot] = playerData;
        _playerViews[playerData.slot].updatePlayerData(playerData);
    };

    var createFish = function(fishId, fishType){
        return _fishManager.addFish(fishId,fishType);
    };
    
    var removeFish = function (fishId) {
        return _fishManager.removeFish(fishId);
    };

    var updateEverything = function () {
        _fishManager.update();
    }


    var GameManager = {
        initialise : initialise,
        setGameState : setGameState,
        updateMultiplayerState : updateMultiplayerState,
        shootTo : shootTo, //sliohtly unsatisfactory
        createFish : createFish,
        removeFish : removeFish,
        updateEverything : updateEverything,
    };

    return GameManager;
}();