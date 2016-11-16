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
    var debug = false;

    var _gameConfig;

    var _fishGameArena;

    var _touchLayer;

    // var _serverInformer;

    //player
    var _playerSlot;
    var _playerId;
    var _lastShotTime;

    //parent node for UI parenting
    var _parentNode;

    //Managers
    var _loginManager;
    var _playerViews = [];
    var _fishManager;
    var _playerPositions = [];
    var _lobbyManager;

    function initialiseLogin(parent){
        _parentNode = new cc.Node();
        parent.addChild(_parentNode,99999);
        _loginManager = new LoginManager(_parentNode);
    }

    var initialiseGame = function (parent, fishGameArena) {

        _parentNode = new cc.Node();
        parent.addChild(_parentNode,99999);

        GameView.initialise(_parentNode);

        _fishGameArena = fishGameArena;
        _lastShotTime = -Infinity;
        _fishManager = new FishViewManager(_parentNode, _fishGameArena);


        for (var i = 0; i < _gameConfig.maxPlayers ; i++){
            _playerViews[i] = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions[i], i == _playerSlot);
        }

        initialiseTouch();
    };

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

        ClientServerConnect.getServerInformer().bulletFired(bulletId, rot);
    };

    var getPlayerBulletId = function(){
        return _playerViews[_playerSlot].getNextBulletId();
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
    };

    var getGameConfig = function () {
        return _gameConfig;
    };

    var goToLogin = function () {
        _loginManager.goToLogin();
    };

    var login = function () {
        var loginInfo = _loginManager.getLogin();
        ClientServerConnect.login(loginInfo.name,loginInfo.pass);
    };

    var goTolobby = function (parent) {
        var parent = _parentNode.parent;
        parent.removeChild(_parentNode);
        _parentNode = new cc.Node();
        parent.addChild(_parentNode,99999);
        // cc.director.runScene(_parentNode);

        _lobbyManager = new LobbyManager(_parentNode);


    };


    var GameManager = {
        initialiseLogin : initialiseLogin,
        initialiseGame : initialiseGame,
        setGameState : setGameState,
        updateMultiplayerState : updateMultiplayerState,
        shootTo : shootTo, //slightly unsatisfactory
        createFish : createFish,
        removeFish : removeFish,
        updateEverything : updateEverything,
        // setServerInformer : setServerInformer,
        goToLogin : goToLogin,
        login : login,
        goToLobby : goTolobby,


        //debug
        debug : debug,

        //hack-ish for debug, to be removed
        getGameConfig : getGameConfig,
    };

    return GameManager;
}();