/**
 * Created by eugeneseah on 27/10/16.
 */

/*
 Current structure : GameManager    -> GameView
 -> x PlayerViewManager  -> CannonManager -> CannonView
 -> PlayerView -> PlayerViewStaticPrefab
 */
"use strict";

let GameManager = function () {
    let debug = false;

    let _gameConfig;

    let _fishGameArena;

    let _touchLayer;

    //convenience
    let _loggedIn = false;

    // var _serverInformer;

    //player
    let _playerSlot;
    let _playerId;
    let _lastShotTime;

    //parent node for UI parenting
    let _parentNode;

    //Managers
    let _loginManager;
    let _playerViews = [];
    let _fishManager;
    let _playerPositions = [];
    let _lobbyManager;
    let _scoreboardManager;
    let _optionsManager;

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

    let initialiseGame = function (parent, fishGameArena) {

        initialiseParent(parent);


        GameView.initialise(_parentNode);

        _fishGameArena = fishGameArena;
        _lastShotTime = -Infinity;
        _fishManager = new FishViewManager(_parentNode, _fishGameArena);


        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i] = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions[i], i == _playerSlot);
        }

        _optionsManager = new OptionsManager(_parentNode, undefined, undefined, onLeaveArena);

        initialiseTouch();
    };

    let initialiseTouch = function () {
        if(_touchLayer){
            _parentNode.removeChild(_touchLayer);
        }
        // if (!_touchLayer) {
        _touchLayer = new TouchLayerRefactored(touchAt);
        _parentNode.addChild(_touchLayer, -1);
        // }
    };

    let touchAt = function (pos) {

        const lastShootTime = this._lastShotTime || -Infinity;
        const now = _fishGameArena.getGameTime();
        const timeSinceLastShot = now - lastShootTime;
        if (timeSinceLastShot < _gameConfig.shootInterval) {
            // console.log("TOO FAST!");
            return;
        }

        this._lastShotTime = now;

        let rot = _playerViews[_playerSlot].turnTo(pos);
        const bulletId = _playerId + ':' + getPlayerBulletId();

        ClientServerConnect.getServerInformer().bulletFired(bulletId, rot);
    };

    let getPlayerBulletId = function () {
        return _playerViews[_playerSlot].getNextBulletId();
    };


    let shootTo = function (playerId, pos) {
        for (let p of _playerPositions) {
            if (p && p.id == playerId) {
                return _playerViews[p.slot].shootTo(pos);
            }
        }
        ;
    };

    let setGameState = function (config, playerId, playerSlot) {
        console.log(JSON.stringify(config));
        _gameConfig = config;
        _playerId = playerId;
        _playerSlot = playerSlot;

    };

    let updateMultiplayerState = function (playerData) {
        console.log(playerData);
        //{id: playerId, name: playerName, slot: playerSlot}
        _playerPositions[playerData.slot] = playerData;
        _playerViews[playerData.slot].updatePlayerData(playerData);
    };

    let createFish = function (fishId, fishType) {
        return _fishManager.addFish(fishId, fishType);
    };

    let removeFish = function (fishId) {
        return _fishManager.removeFish(fishId);
    };

    let updateEverything = function () {
        _fishManager.update();
    };

    let getGameConfig = function () {
        return _gameConfig;
    };

    let goToLogin = function () {
        if (!_loggedIn) {
            _loginManager.goToLogin();
        }
    };

    let login = function (onSuccess, onFailure) {
        let loginInfo = _loginManager.getLoginInfo();
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
        // _loginManager.saveLoginInfo();
        PlayerPreferences.setLoginDetails(_loginManager.getLoginInfo());
        _loginManager.destroyView();

        createLobby();
    }

    function onLeaveArena() {
        ClientServerConnect.getServerInformer().leaveGame();

        ClientServerConnect.requestStats()
            .then(
                stats => {
                    console.log("stats:" + JSON.stringify(stats));
                    goToScoreboard(stats);
                }
            );
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
        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i].destroyView();
            delete _playerViews[i];
        }
        _fishGameArena = null;
        _lastShotTime = -Infinity;
        _optionsManager.destroyView();
    }


    return {
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

    // return GameManager;
}();