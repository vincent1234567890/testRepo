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
    let _channelType;
    let _currentScene;
    let _isFishLockOn = false;
    let _fishLockOnCallback;  //terribly messy should have a gameViewModel class eventually
    let _currentFishLockOnId;

    //convenience
    let _loggedIn = false; //can remove

    //Managers
    // let _loginManager;
    let _fishManager;
    let _lobbyManager;
    let _floatingMenuManager;
    let _jackpotManager;
    let _scoreboardManager;
    // let _optionsManager;
    let _bulletManager;
    let _netManager;
    let _lobbyWaterCausticsManager;

    //?? only use is for clientReceiver to query if playerId == player
    let _playerId;

    //Callback to AppManager
    let _goToLobbyCallback;
    let _gameSelectedCallback;

    function initialiseLogin(parent) {
        console.log("initialise");
        GameView.initialise(parent);

        // _loginManager = new LoginManager();
    }

    const initialiseGame = function (parent, fishGameArena) {
        // _lobbyManager.resetView();
        GameView.initialise(parent, _gameConfig, fishGameArena, onFishLockButtonPress, getFishLockStatus);

        _fishManager = new FishViewManager(fishGameArena, _gameConfig, GameView.caughtFishAnimationEnd , getFishLockStatus, onFishLockSelected);
        new BackToLobbyButton(onLeaveArena);
        _bulletManager = new BulletManager(fishGameArena);
        _netManager = new NetManager();
        _floatingMenuManager.reattach();
        _jackpotManager.reattach();

        BlockingManager.destroyView();

        GameView.goToGame(_currentScene);
        ef.gameController.enterGame();
    };

    const enterSeatSelectionScene = function(parent){
        GameView.goToSeatSelection(parent);

        _floatingMenuManager.reattach();
        //_jackpotManager.reattach();

        if(_floatingMenuManager){
            _floatingMenuManager.hideAll();
        }
        BlockingManager.destroyView();
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

    const setGameLogData = function (gameSummaryData) {
        _floatingMenuManager.setGameSummaryData(gameSummaryData);
    };

    const setConsumptionLogData = function (consumptionLogData) {
        _floatingMenuManager.setConsumptionLogData(consumptionLogData);
    };

    const setGameState = function (config, playerId, playerSlot) {
        // console.log(JSON.stringify(config));
        _gameConfig = config;
        _playerId = playerId;
        GameView.setMyPlayerData(playerId,playerSlot);
    };

    const updateMultiplayerState = function (playerData, oldSlot) {
        GameView.updateMultiplayerState(playerData, oldSlot);
    };

    const clearPlayerState = function (slot) {
        GameView.clearPlayerState(slot);
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

    function goToLobby(goToLobbyCallback, gameSelectedCallback) {
        _goToLobbyCallback = goToLobbyCallback;
        _gameSelectedCallback = gameSelectedCallback;
        // GameView.initialise();
        _loggedIn = true;

        // Login was successful, so save the user's details
        // _loginManager.saveLoginInfo();
        // PlayerPreferences.setLoginDetails(_loginManager.getLoginInfo());
        // _loginManager.destroyView();

        ClientServerConnect.requestMyData().then(
            stats => {
                console.log("requestMyData",stats);
                _playerData = stats.data;
                return ClientServerConnect.getGameSummaries(7);
            }
        ).then(
            gameSummaries => {
                createLobby();
                setGameLogData(gameSummaries);
                // return ClientServerConnect.getConsumptionLog().then(
                //
                // );
            }
        ).catch(console.error);
    }

    function setupPostLoginListeners () {
        // These are things we should do immediately after logging in:
        // Listen for a creditChangeEvent (e.g. caused by an external /recharge request, gift from grandma, etc.)
        ClientServerConnect.listenForEvent('creditChangeEvent', data => {
            if (_playerData) {
                _playerData.playerState.score += data.amount;
                if (_lobbyManager) {
                    _lobbyManager.updateView(_playerData);
                }
            }
        });
        ClientServerConnect.listenForEvent('jpVals', jpVals => {
            if (_jackpotManager) {
                _jackpotManager.updateJackpot({data: jpVals});
            }
        });
    }

    function onLeaveArena() {
        ClientServerConnect.leaveGame();
        exitToLobby();
    }

    function createLobby() {
        if (!_lobbyManager) {
            _lobbyManager = new LobbyManager(_playerData, onGameSelected);
            _lobbyWaterCausticsManager = new LobbyWaterCaustics();   //todo need delete
            _floatingMenuManager = new FloatingMenu(_playerData, requestConsumptionLogHandle);
            _jackpotManager = new JackpotManager();
            ClientServerConnect.getCurrentJackpotValues().then(
                values => {
                    _jackpotManager.updateJackpot(values);
                }
            );
        }
    }

    function exitToLobby() {
        ef.gameController.leaveGame();
        ClientServerConnect.requestMyData().then(
            stats => {
                console.log(stats);
                _playerData = stats.data;
                _lobbyManager.updateView(_playerData);
            }
        ).catch(console.error);
        if (_floatingMenuManager) {
            _floatingMenuManager.unattach();
        }
        if (_jackpotManager) {
            _jackpotManager.unattach();
        }
        destroyArena();
        ClientServerConnect.getCurrentJackpotValues().then(
            values => {
                _jackpotManager.updateJackpot(values);
            }
        );
        _goToLobbyCallback();
    }

    // function showPostGameStats () { // used to be for post game stats but feature has been removed
    //     // ClientServerConnect.requestStats().then(
    //     //     stats => {
    //     //         goToScoreboard(stats);
    //     //     }
    //     // ).catch(console.error);
    //     // exitToLobby();
    // }

    // function goToScoreboard(stats) {
    //     if (!_scoreboardManager) {
    //         _scoreboardManager = new ScoreboardManager(stats.data.recentGames[0], exitToLobby, goToNewRoom);
    //     } else {
    //         _scoreboardManager.destroyView();
    //         _scoreboardManager.displayView(stats.data.recentGames[0]);
    //     }
    // }

    // function goToNewRoom() {
    //     resetArena();
    //     ClientServerConnect.joinGame(_currentScene.gameName).catch(console.error);
    // }

    function destroyArena(){
        resetArena();
        GameView.destroyArena();
    }

    function resetArena(){
        if (_fishManager) {
            _fishManager.destroyView();
        }
        if (_bulletManager) {
            _bulletManager.destroyView();
        }
        if (_scoreboardManager) {
            _scoreboardManager.destroyView();
        }
        if(_floatingMenuManager){
            _floatingMenuManager.hideAll();
        }
        BlockingManager.destroyView();
        GameView.resetArena();
        _isFishLockOn = false;
        _fishLockOnCallback = undefined;
    }

    function onGameSelected(chosenScene){
        _currentScene = chosenScene;
        _gameSelectedCallback(chosenScene.gameName, _playerData);
    }

    function seatSelected(type, seat) {
        //console.log("seatSelected:", type, seat);
        WaitingPanel.showPanel();
        ClientServerConnect.joinGame(_currentScene.gameName, seat, type).catch(
            function (error) {
                _lobbyManager.resetView();
                console.log(error);
            }
        );
    }

    function roomSelected (joinPrefs) {
        //console.log("roomSelected:", joinPrefs);
        WaitingPanel.showPanel();
        let prom = null;
        if (!joinPrefs.serverUrl || !joinPrefs.roomId) {
            // Treat this as an express join
            prom = ClientServerConnect.joinGame(_currentScene.gameName, null, joinPrefs.singlePlay ? TableType.SINGLE : TableType.MULTIPLE, joinPrefs.spectate);
        } else {
            // Server and room were specified
            prom = ClientServerConnect.joinGameInSpecificRoom(joinPrefs.serverUrl, joinPrefs.roomId, joinPrefs.slot, joinPrefs.spectate);
        }
        return prom.catch(error => {
            _lobbyManager.resetView();
            throw error;
        });
    }

    function isCurrentPlayer (playerId) {
        return playerId === _playerId;
    }

    function resetLobby (){
        _jackpotManager.reattach();
        _floatingMenuManager.reattach();
        _lobbyManager.resetView();
    }

    function updateJackpotPool(value) {
        _jackpotManager.updateJackpot(value);
    }

    function getFishLockStatus(){
        return _isFishLockOn;
    }

    function onFishLockButtonPress(state){
        _isFishLockOn = state.state;
        _fishLockOnCallback = state.callback;
        if (!_isFishLockOn){
            //release the locked fish.
            ClientServerConnect.unsetFishLockRequest();
            unsetLockForFishId(_currentFishLockOnId);  //unlock on client directly.
        }
    }

    function onFishLockSelected (fishId){
        _currentFishLockOnId = fishId;
        ClientServerConnect.setFishLockRequest(fishId);
        _fishLockOnCallback(true);
    }

    function unsetLockForFishId(fishId) {
        if (fishId === _currentFishLockOnId){
            //_isFishLockOn = false;
            _fishLockOnCallback(false);
            _fishManager.unsetLock();
            _currentFishLockOnId = null;
        }
    }

    function requestConsumptionLogHandle(playerGameNumber, roundNumber) {
        // console.log(playerGameNumber, roundNumber);
        ClientServerConnect.getConsumptionLog(playerGameNumber, roundNumber, undefined, 99999).then(
            consumptionData => {
                console.log(consumptionData);
                _floatingMenuManager.setConsumptionLogData(consumptionData);
            }
        );
    }

    function getPlayerData(){
        return _playerData;
    }

    //dev for dev scene
    function development(parent) {
    }

    return {
        initialiseLogin: initialiseLogin,
        setupPostLoginListeners: setupPostLoginListeners,
        initialiseGame: initialiseGame,

        //Lobby stuff
        goToLobby: goToLobby,
        resetLobby : resetLobby,

        //Menu stuff
        updateJackpotPool : updateJackpotPool,
        // setGameLogData : setGameLogData,
        // setConsumptionLogData : setConsumptionLogData,

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
        // showPostGameStats: showPostGameStats,
        unsetLockForFishId : unsetLockForFishId,
        getPlayerData: getPlayerData,
        setChannelType: channelType => _channelType = channelType,
        getChannelType: () => _channelType,
        enterSeatSelectionScene : enterSeatSelectionScene,
        seatSelected : seatSelected,
        roomSelected: roomSelected,

        exitToLobby : exitToLobby,

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
