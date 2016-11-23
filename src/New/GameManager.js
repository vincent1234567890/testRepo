/**
 * Created by eugeneseah on 27/10/16.
 */

/*
 Current structure : GameManager    -> GameView
 -> x PlayerViewManager  -> CannonManager -> CannonView
 -> PlayerView -> PlayerViewStaticPrefab
 */
"use strict";

var GameManager = function () {
    var debug = false;

    var _gameConfig;

    var _fishGameArena;

    var _touchLayer;

    //convenience
    var _loggedIn = false;

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
    var _scoreboardManager;
    var _optionsManager;

    function initialiseParent(parent) {
        if (parent === undefined && _parentNode && _parentNode.parent) {
            parent = _parentNode.parent;
        }
        if (_parentNode && _parentNode.parent) {
            _parentNode.parent.removeChild(_parentNode);
        }
        _parentNode = new cc.Node();
        parent.addChild(_parentNode, 99999);
    }

    function initialiseLogin(parent) {
        initialiseParent(parent);
        _loginManager = new LoginManager(_parentNode);
    }

    var initialiseGame = function (parent, fishGameArena) {

        initialiseParent(parent);


        GameView.initialise(_parentNode);

        _fishGameArena = fishGameArena;
        _lastShotTime = -Infinity;
        _fishManager = new FishViewManager(_parentNode, _fishGameArena);


        for (var i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i] = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions[i], i == _playerSlot);
        }

        _optionsManager = new OptionsManager(_parentNode, undefined, undefined, onLeaveArena);

        initialiseTouch();
    };

    var initialiseTouch = function () {
        if(_touchLayer){
            _parentNode.removeChild(_touchLayer);
        }
        // if (!_touchLayer) {
        _touchLayer = new TouchLayerRefactored(touchAt);
        _parentNode.addChild(_touchLayer, -1);
        // }
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

    var getPlayerBulletId = function () {
        return _playerViews[_playerSlot].getNextBulletId();
    };


    var shootTo = function (playerId, pos) {
        for (var p of _playerPositions) {
            if (p && p.id == playerId) {
                return _playerViews[p.slot].shootTo(pos);
            }
        }
        ;
    };

    var setGameState = function (config, playerId, playerSlot) {
        console.log(JSON.stringify(config));
        _gameConfig = config;
        _playerId = playerId;
        _playerSlot = playerSlot;

    };

    var updateMultiplayerState = function (playerData) {
        console.log(playerData);
        //{id: playerId, name: playerName, slot: playerSlot}
        _playerPositions[playerData.slot] = playerData;
        _playerViews[playerData.slot].updatePlayerData(playerData);
    };

    var createFish = function (fishId, fishType) {
        return _fishManager.addFish(fishId, fishType);
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
        if (!_loggedIn) {
            _loginManager.goToLogin();
        }
    };

    var login = function (onSuccess, onFailure) {
        var loginInfo = _loginManager.getLogin();
        ClientServerConnect.login(loginInfo.name, loginInfo.pass, function (success) {
            if (success) {
                onSuccess();
            } else {
                onFailure();
            }
        });
    };

    function goToLobby() {
        initialiseParent();

        _loggedIn = true;

        // Login was successful, so save the user's details
        _loginManager.saveLoginInfo();
        _loginManager.destroyView();

        createLobby();
    }

    function onLeaveArena() {
        //ClientServerConnect.getServerInformer().leaveGame();
        Promise.resolve().then(
            () => ClientServerConnect.leaveGame()
        ).then(
            () => ClientServerConnect.requestStats()
        ).then(
            stats => {
                console.log("stats:" + JSON.stringify(stats));
                goToScoreboard(stats);
            }
        ).catch(console.error);

        // ClientServerConnect.getServerInformer().requestStatsForThisGame();
        // ClientServerConnect.resetArena(); <---?
    }

    function createLobby() {
        if (!_lobbyManager)
            _lobbyManager = new LobbyManager(_parentNode);
        else {
            _lobbyManager.doView(_parentNode);
        }
    }

    function exitToLobby() {
        destroyArena();
        _parentNode.parent.backToMenu();
        createLobby();
    }

    function goToScoreboard(stats) {
        if (!_scoreboardManager) {
            _scoreboardManager = new ScoreboardManager(_parentNode, stats.data.recentGames[0], exitToLobby, goToNewRoom);
        } else {
            _scoreboardManager.doView(_parentNode, stats.data.recentGames[0]);
        }
        // _parentNode.addChild(_scoreboardManager);
    }

    function goToNewRoom() {
        console.log("Joey, I'm going to a new room!");

    }


    function development(parent) {
        console.log("GameManager:development");
        initialiseParent(parent);
        // goToScoreboard()
        _optionsManager = new OptionsManager(_parentNode);
    }

    function destroyArena(){
        _fishManager.destroyView();
        for (var i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i].destroyView();
            delete _playerViews[i];
        }
        _fishGameArena = null;
        _lastShotTime = -Infinity;
        _optionsManager.destroyView();
    }


    var GameManager = {
        initialiseLogin: initialiseLogin,
        initialiseGame: initialiseGame,
        setGameState: setGameState,
        updateMultiplayerState: updateMultiplayerState,
        shootTo: shootTo, //slightly unsatisfactory
        createFish: createFish,
        removeFish: removeFish,
        updateEverything: updateEverything,
        // goToScoreboard : goToScoreboard,
        // setServerInformer : setServerInformer,
        goToLogin: goToLogin,
        login: login,
        goToLobby: goToLobby,


        //debug
        debug: debug,

        //hack-ish for debug, to be removed
        getGameConfig: getGameConfig,

        //for development positioning
        development: development,
    };

    return GameManager;
}();