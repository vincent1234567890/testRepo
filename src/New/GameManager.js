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
    let _loggedIn = false; //can remove

    //Managers
    // let _loginManager;
    let _fishManager;
    let _lobbyManager;
    let _floatingMenuManager;
    let _jackpotManager;
    let _scoreboardManager;
    let _optionsManager;
    let _bulletManager;
    let _netManager;
    let _lobbyWaterCausticsManager;

    //?? only use is for clientReceiver to query if playerId == player
    let _playerId;

    //Callback to AppManager
    let _goToLobbyCallback;


    function initialiseLogin(parent) {
        GameView.initialise(parent);
        // _loginManager = new LoginManager();
    }

    const initialiseGame = function (parent, fishGameArena) {
        // _lobbyManager.resetView();
        GameView.initialise(parent, _gameConfig, fishGameArena);

        _fishManager = new FishViewManager(fishGameArena, _gameConfig, GameView.caughtFishAnimationEnd);
        _optionsManager = new OptionsManager(onSettingsButton, undefined, onLeaveArena);
        _optionsManager.displayView(_gameConfig);
        _bulletManager = new BulletManager(fishGameArena);
        _netManager = new NetManager();
        _floatingMenuManager.reattach();
        _jackpotManager.reattach();

        BlockingManager.destroyView();

        GameView.goToGame(_currentScene);
    };

    const shootTo = function (playerId, gunId, angle, bulletId) {
        GameView.shootTo(playerId, angle);
        return _bulletManager.createBullet(gunId, bulletId);
    };

    const explodeBullet = function(bulletId){
        const bulletData = _bulletManager.explodeBullet(bulletId);
        if (bulletData) {
            _netManager.explodeAt(_gameConfig,bulletData);
        }
    };

    const removeBullet = function(bulletId){
        _bulletManager.removeBullet(bulletId);
    };

    const setGameState = function (config, playerId, playerSlot) {
        // console.log(JSON.stringify(config));
        _gameConfig = config;
        _playerId = playerId;
        GameView.setMyPlayerData(playerId,playerSlot)
    };

    const updateMultiplayerState = function (playerData, oldSlot) {
        GameView.updateMultiplayerState(playerData, oldSlot);
    };

    const clearPlayerState = function (slot) {
        GameView.clearPlayerState(slot)
    };

    const createFish = function (fishId, fishType) {
        return _fishManager.addFish(fishId, fishType);
    };

    const caughtFish = function (playerSlot,fishId){
        // console.log("caught fish :" ,fishId);
        _fishManager.caughtFish(fishId, playerSlot);

    };

    const removeFish = function (fishId) {
        _fishManager.removeFish(undefined, {id: fishId});
    };

    const updateEverything = function () {
        GameView.updateArena();
        _fishManager.update();
        _bulletManager.update();
    };

    const getGameConfig = function () {
        return _gameConfig;
    };

    // const goToLogin = function () {
    //     if (!_loggedIn) {
    //         _loginManager.goToLogin();
    //     }
    // };

    // const login = function (onSuccess, onFailure) {
    //     let loginInfo = _loginManager.getLoginInfo();
    //     ClientServerConnect.login(loginInfo.name, loginInfo.pass, function (data) {
    //         if (data) {
    //             _playerData = data;
    //             onSuccess();
    //         } else {
    //             onFailure();
    //         }
    //     });
    // };

    function goToLobby(goToLobbyCallback) {
        _goToLobbyCallback = goToLobbyCallback;
        // GameView.initialise();
        _loggedIn = true;

        // Login was successful, so save the user's details
        // _loginManager.saveLoginInfo();
        // PlayerPreferences.setLoginDetails(_loginManager.getLoginInfo());
        // _loginManager.destroyView();

        ClientServerConnect.requestMyData().then(
            stats => {
                console.log(stats);
                _playerData = stats.data;
                createLobby();
            }
        ).catch(console.error);

        // createLobby();

        // These are things we should do immediately after logging in:
        // Listen for a creditChangeEvent (e.g. caused by an external /recharge request, gift from grandma, etc.)
        ClientServerConnect.listenForEvent('creditChangeEvent', data => {
            //assertEqual(typeof data.scoreChange, 'number');
            _playerData.playerState.score += data.amount;
            // Now we want to update the view
            // We need to update this label in the LobbyView: new cc.LabelTTF(formatWithCommas(playerData.playerState.score), fontDef);
            // This would probably be a nice solution:
            //LobbyManager._view.updatePlayerData(_playerData);
            // But for now:
            createLobby();
            // We could also notify the player, either with an alert box, or just some flashing / bouncing / animation on the score label
        });
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
            _lobbyManager = new LobbyManager(_playerData, onSettingsButton, onGameSelected, onRequestShowProfile);
            // _profileManger = new ProfileManager();
            _optionsManager = new OptionsManager(onSettingsButton, undefined, onLeaveArena);
            _lobbyWaterCausticsManager = new LobbyWaterCaustics();
            _floatingMenuManager = new FloatingMenu(onSettingsButton);
            _jackpotManager = new JackpotManager();
            _jackpotManager.updateJackpot(999999999);
            ClientServerConnect.getCurrentJackpotValues();
        }else {
            _lobbyManager.displayView(_playerData, onSettingsButton, onGameSelected,onRequestShowProfile);
        }
    }

    function exitToLobby() {

        destroyArena();
        _goToLobbyCallback();
        ClientServerConnect.getCurrentJackpotValues();
        ClientServerConnect.requestMyData();

        // createLobby();

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
            _scoreboardManager.destroyView();
            _scoreboardManager.displayView(stats.data.recentGames[0]);
        }
    }

    function goToNewRoom() {
        resetArena();
        ClientServerConnect.joinGame(_currentScene.gameName).catch(console.error);
    }

    function destroyArena(){
        resetArena();
        GameView.destroyArena();
    }

    function resetArena(){
        if (_optionsManager) {
            _optionsManager.destroyView();
        }
        if (_fishManager) {
            _fishManager.destroyView();
        }
        if (_bulletManager) {
            _bulletManager.destroyView();
        }
        if (_scoreboardManager) {
            _scoreboardManager.destroyView();
        }
        BlockingManager.destroyView();
        GameView.resetArena();
    }

    function onSettingsButton(){
        _optionsManager.showSettings();
    }

    function onGameSelected(chosenScene){
        _currentScene = chosenScene;
        ClientServerConnect.joinGame(_currentScene.gameName).catch(
            function (error) {
                _lobbyManager.resetView();
                console.log(error);
            }
        );
    }

    function isCurrentPlayer (playerId) {
        return playerId === _playerId;
    }

    function onRequestShowProfile(){

    }

    function resetLobby (){
        _jackpotManager.reattach();
        _floatingMenuManager.reattach();
        _lobbyManager.resetView();
    }

    function updateJackpotPool(value) {
        _jackpotManager.updateJackpot(value)
    }

    //dev for dev scene
    function development(parent) {
        _optionsManager = new OptionsManager(onSettingsButton);
    }


    return {
        initialiseLogin: initialiseLogin,
        initialiseGame: initialiseGame,

        //Lobby stuff
        goToLobby: goToLobby,
        resetLobby : resetLobby,

        //Menu stuff
        updateJackpotPool : updateJackpotPool,

        //Game stuff
        setGameState: setGameState,
        updateMultiplayerState: updateMultiplayerState,
        clearPlayerState: clearPlayerState,
        shootTo: shootTo,
        explodeBullet: explodeBullet,
        removeBullet: removeBullet,
        createFish: createFish,
        removeFish: removeFish,
        caughtFish: caughtFish,
        updateEverything: updateEverything,
        showPostGameStats: showPostGameStats,

        //Misc
        isCurrentPlayer: isCurrentPlayer,

        //current only used to reset
        destroyArena : destroyArena,

        //debug
        debug: debug,

        //hack-ish for debug, to be removed
        getGameConfig: getGameConfig,

        //for development positioning
        development: development,
    };

}();
