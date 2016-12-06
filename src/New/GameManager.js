/**
 * Created by eugeneseah on 27/10/16.
 */

/*
 Current structure : GameManager    -> GameView
 -> x PlayerViewManager  -> CannonManager -> CannonView
 -> PlayerView -> PlayerViewStaticPrefab
 */
"use strict";

const GameManager = function () {
    let debug = false;

    let _gameConfig;

    let _fishGameArena;

    let _touchLayer;

    //convenience
    let _loggedIn = false;

    //player
    let _playerSlot;
    let _playerId;
    let _lastShotTime;
    let _isRotated = false;

    //parent node for UI parenting
    let _parentNode;

    //Managers
    let _loginManager;
    let _playerViews = [];
    let _fishManager;
    // let _playerPositions = [];
    let _lobbyManager;
    let _scoreboardManager;
    let _optionsManager;
    let _bulletManager;

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

    const initialiseGame = function (parent, fishGameArena) {
        initialiseParent(parent);

        GameView.initialise(_parentNode);

        _fishGameArena = fishGameArena;
        _lastShotTime = -Infinity;

        if (_gameConfig.cannonPositions[_playerSlot][1] > cc.view.getDesignResolutionSize().height / 2){
            console.log(_gameConfig.cannonPositions[_playerSlot]);
            console.log("player" + _playerSlot);
            // cc._canvas.rotate(180);
            _isRotated = true;
        }
        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            const index = getPlayerSlot(i);
            // console.log(index);
            _playerViews[index] = new PlayerViewManager(_parentNode, _gameConfig.cannonPositions[index], i == _playerSlot);
        }
        _fishManager = new FishViewManager(_parentNode, _fishGameArena);

        _optionsManager = new OptionsManager(_parentNode, undefined, undefined, onLeaveArena);

        _bulletManager = new BulletManager(_parentNode, _fishGameArena);

        initialiseTouch();
    };

    const initialiseTouch = function () {
        if(_touchLayer){
            _parentNode.removeChild(_touchLayer);
        }

        _touchLayer = new TouchLayerRefactored(touchAt);
        _parentNode.addChild(_touchLayer, -1);
    };

    const touchAt = function (pos) {

        const lastShootTime = this._lastShotTime || -Infinity;
        const now = _fishGameArena.getGameTime();
        const timeSinceLastShot = now - lastShootTime;
        if (timeSinceLastShot < _gameConfig.shootInterval) {
            // console.log("TOO FAST!");
            return;
        }

        this._lastShotTime = now;

        let slot = getPlayerSlot(_playerSlot);

        const direction = cc.pNormalize(cc.pSub(pos, new cc.p(_gameConfig.cannonPositions[slot][0], _gameConfig.cannonPositions[slot][1])));
        const rot = Math.atan2(direction.x, direction.y);
        _playerViews[slot].shootTo(rot * 180 / Math.PI);

        let info = getRotatedView(undefined,rot);

        const bulletId = _playerId + ':' + getPlayerBulletId();

        ClientServerConnect.getServerInformer().bulletFired(bulletId, info.rotation / 180 * Math.PI);
    };

    const getPlayerBulletId = function () {
        return _playerViews[getPlayerSlot(_playerSlot)].getNextBulletId();
    };



    const shootTo = function (playerId, angle, bulletId) {

        let arenaPlayer = _fishGameArena.getPlayer(playerId);
        console.log(arenaPlayer.slot);
        let slot = getPlayerSlot(arenaPlayer.slot);

        let info = getRotatedView(undefined, angle );
        _playerViews[slot].shootTo(info.rotation ); //here

        return _bulletManager.createBullet(_gameConfig.cannonPositions[slot], angle, bulletId);
    };

    const explodeBullet = function(bulletId){
        _bulletManager.explodeBullet(bulletId);
    };

    const setGameState = function (config, playerId, playerSlot) {
        // console.log(JSON.stringify(config));
        _gameConfig = config;
        _playerId = playerId;
        _playerSlot = playerSlot;

    };

    const updateMultiplayerState = function (playerData) {
        // console.log("SLOT: "+playerData.slot);
        const slot = getPlayerSlot(playerData.slot);

        _playerViews[slot].updatePlayerData(playerData);
    };

    const clearPlayerState = function (slot) {
        _playerViews[slot].clearPlayerData();
    };

    const createFish = function (fishId, fishType) {
        return _fishManager.addFish(fishId, fishType);
    };

    const removeFish = function (fishId) {
        return _fishManager.removeFish(fishId);
    };

    const updateEverything = function () {
        _fishGameArena.updateEverything();
        _fishManager.update();
        _bulletManager.update();
    };

    const getGameConfig = function () {
        return _gameConfig;
    };

    const goToLogin = function () {
        if (!_loggedIn) {
            _loginManager.goToLogin();
        }
    };

    const login = function (onSuccess, onFailure) {
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
        //ClientServerConnect.getServerInformer().leaveGame();
        Promise.resolve().then(
            () => ClientServerConnect.leaveGame()
        ).then(
            () => showPostGameStats()
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

    function showPostGameStats () {
        ClientServerConnect.requestStats().then(
            stats => {
                // console.log("stats:" + JSON.stringify(stats));
                goToScoreboard(stats);
            }
        ).catch(console.error);
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
        resetArena();
        ClientServerConnect.joinGame(0).catch(console.error);
    }


    function development(parent) {
        console.log("GameManager:development");
        initialiseParent(parent);
        // goToScoreboard()
        _optionsManager = new OptionsManager(_parentNode);
    }

    function destroyArena(){
        resetArena();
        _fishManager.destroyView();
        _bulletManager.destroyView();
        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i].destroyView();
            delete _playerViews[i];
        }
        _fishGameArena = null;
        _lastShotTime = -Infinity;
        _optionsManager.destroyView();
    }

    function resetArena(){
        _isRotated = false;
        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            clearPlayerState(i);
        }
    }

    function getPlayerSlot(slot){
        if (_isRotated)
            return _gameConfig.maxPlayers- slot-1;
        return slot;
    }

    function getRotatedView(position, rotation){ //position in array, rotation in radians, output in degrees
        let x;
        let y;
        let rot = 0;
        if (_isRotated){
            // console.log("isrotate");
            if (position) {
                x = cc.view.getDesignResolutionSize().width - position[0];
                y = cc.view.getDesignResolutionSize().height - position[1];
            }
            if (rotation) {
                rot = 270 - (rotation * 180 / Math.PI);

            }
        }else {
            if (position) {
                x = position[0];
                y = position[1];
            }
            if (rotation) {
                rot = 90 -rotation * 180 / Math.PI;
            }
        }
        return {position : [x,y], rotation : rot}
    }


    return {
        initialiseLogin: initialiseLogin,
        initialiseGame: initialiseGame,
        setGameState: setGameState,
        updateMultiplayerState: updateMultiplayerState,
        clearPlayerState: clearPlayerState,
        shootTo: shootTo,
        explodeBullet: explodeBullet,
        createFish: createFish,
        removeFish: removeFish,
        updateEverything: updateEverything,
        showPostGameStats: showPostGameStats,
        goToLogin: goToLogin,
        login: login,
        goToLobby: goToLobby,

        getRotatedView : getRotatedView,

        //debug
        debug: debug,

        //hack-ish for debug, to be removed
        getGameConfig: getGameConfig,

        //for development positioning
        development: development,
    };

    // return GameManager;
}();
