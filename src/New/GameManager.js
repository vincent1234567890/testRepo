/**
 * Created by eugeneseah on 27/10/16.
 */

/*
 Current structure :
 GameManager    -> GameView
                -> x PlayerViewManager  -> CannonManager -> CannonView
                -> PlayerView -> PlayerViewStaticPrefab
                etc
 */


const GameManager = function () {
    "use strict";
    let debug = false;

    //GameState
    let _gameConfig;
    let _playerData;
    let _currentScene;

    //convenience
    let _loggedIn = false;

    //Managers
    let _loginManager;
    let _fishManager;
    let _lobbyManager;
    let _scoreboardManager;
    let _optionsManager;
    let _bulletManager;
    let _netManager;

    function initialiseLogin(parent) {
        GameView.initialise(parent);
        _loginManager = new LoginManager();
    }

    const initialiseGame = function (parent, fishGameArena) {
        GameView.initialise(parent, _gameConfig, fishGameArena);

        _fishManager = new FishViewManager(fishGameArena);
        _optionsManager = new OptionsManager(onSettingsButton, undefined, onLeaveArena);
        _optionsManager.doView(_gameConfig);
        _bulletManager = new BulletManager(fishGameArena);
        _netManager = new NetManager();

        GameView.goToGame(_currentScene);
    };

    const shootTo = function (playerId, angle, bulletId) {
        GameView.shootTo(playerId, angle);
        return _bulletManager.createBullet(bulletId);
    };

    const explodeBullet = function(bulletId){
        const bulletData = _bulletManager.explodeBullet(bulletId);
        if (bulletData) {
            _netManager.explodeAt(bulletData);
        }
    };

    const setGameState = function (config, playerId, playerSlot) {
        // console.log(JSON.stringify(config));
        _gameConfig = config;
        GameView.setMyPlayerData(playerId,playerSlot)
    };

    const updateMultiplayerState = function (playerData) {
        GameView.updateMultiplayerState(playerData);
    };

    const clearPlayerState = function (slot) {
        GameView.clearPlayerState(slot)
    };

    const createFish = function (fishId, fishType) {
        return _fishManager.addFish(fishId, fishType);
    };

    const caughtFish = function (fishId){
        _fishManager.caughtFish(fishId);
    };

    const removeFish = function (fishId) {
        _fishManager.removeFish(undefined,fishId);
    };

    const updateEverything = function () {
        GameView.updateArena();
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
        ClientServerConnect.login(loginInfo.name, loginInfo.pass, function (data) {
            if (data) {
                _playerData = data;
                onSuccess();
            } else {
                onFailure();
            }
        });
    };

    function goToLobby() {
        GameView.initialise();
        _loggedIn = true;

        // Login was successful, so save the user's details
        // _loginManager.saveLoginInfo();
        PlayerPreferences.setLoginDetails(_loginManager.getLoginInfo());
        _loginManager.destroyView();

        ClientServerConnect.requestMyData().then(
            stats => {
                console.log(stats);
                _playerData = stats.data;
                createLobby();
            }
        );
    }

    function onLeaveArena() {
        Promise.resolve().then(
            () => ClientServerConnect.leaveGame()
        ).then(
            () => showPostGameStats()
        ).catch(console.error);
    }

    function createLobby() {
        if (!_lobbyManager) {
            _lobbyManager = new LobbyManager(_playerData, onSettingsButton, onGameSelected,onRequestShowProfile);
            // _profileManger = new ProfileManager();
            _optionsManager = new OptionsManager(onSettingsButton, undefined, onLeaveArena);
        }else {
            _lobbyManager.doView(_playerData, onSettingsButton, onGameSelected,onRequestShowProfile);
        }
    }

    function exitToLobby() {
        destroyArena();
        GameView.goBackToLobby();
        createLobby();
    }

    function showPostGameStats () {
        ClientServerConnect.requestStats().then(
            stats => {
                goToScoreboard(stats);
            }
        ).catch(console.error);
    }

    function goToScoreboard(stats) {
        if (!_scoreboardManager) {
            _scoreboardManager = new ScoreboardManager(stats.data.recentGames[0], exitToLobby, goToNewRoom);
        } else {
            _scoreboardManager.doView(stats.data.recentGames[0]);
        }
    }

    function goToNewRoom() {
        resetArena();
        ClientServerConnect.joinGame(_currentScene).catch(console.error);
    }

    function destroyArena(){
        resetArena();
        GameView.destroyArena();
    }

    function resetArena(){
        _optionsManager.destroyView();
        _fishManager.destroyView();
        _bulletManager.destroyView();
        _scoreboardManager.destroyView();
        GameView.resetArena();
    }

    function onSettingsButton(){
        // GameView.initialise();
        _optionsManager.showSettings();
    }

    function onGameSelected(chosenScene){
        _currentScene = chosenScene;
        ClientServerConnect.joinGame(_currentScene).catch(console.error);
    }

    function onRequestShowProfile(){

    }

    //dev for dev scene
    function development(parent) {
        _optionsManager = new OptionsManager(onSettingsButton);
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
        caughtFish: caughtFish,
        updateEverything: updateEverything,
        showPostGameStats: showPostGameStats,
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

}();
