var GAMEHOME = 0;
var GAMELOAD = 1;
var GAMEPLAY = 2;
var GAMEOVER = 3;

var GameCtrl = cc.Class.extend({
    _curScene:null,
    stage:FishLevel.eFishLevel1,
    gameState:GAMEHOME,
    isNewGame:true,
    isPassStage:false,
    loaded:false,
    _curLevel:FishLevel.eFishLevel1,
    _selectLevel:1,
    m_nMultiLevel:null,
    m_bIsLoadingFight:null,
    myPlanType:null,
    ctor:function () {
        this.setIsNewGame(true);
        this.setIsPassStage(false);
        if (GameCtrl.isOnlineGame()) {
            this.connectToMasterServer();
        }
        return true;
    },
    connectToMasterServer:function () {
        const useJoeysServerDuringDevelopment = true;

        let gameAPIServerUrl = 'ws://3dfishing88888.sinonet.sg:8080';

        const localNames = ['localhost', '127.0.0.1', '127.0.1.1', '0.0.0.0'];
        const doingDevelopment = (localNames.indexOf(window.location.hostname) >= 0);
        if (doingDevelopment && useJoeysServerDuringDevelopment) {
            gameAPIServerUrl = 'ws://192.168.1.1:8088';
        }

        var gameCtrl = this;

        var client = new WebSocketClient(gameAPIServerUrl);
        var gameService = new GameServices.GameService();
        client.addService(gameService);

        gameCtrl.setGameWSClient(client);

        client.connect();
        client.addEventListener('open', function () {
            // Wrapper which listens for game events
            var ioSocket = socketUtils.getIOSocketFromClient(client);
            // This object has on() and off() functions for receiving messages, and send() for sending them.
            gameCtrl.setGameIOSocket(ioSocket);

            Promise.resolve().then(
                () => client.callAPIOnce('game', 'requestServer', {})
            ).then(
                (serverList) => {
                    console.log("serverList:", serverList);
                    // Future: Maybe ping the servers here, then connect to the closest one
                }
            ).catch(console.error.bind(console));
        });
    },
    runGame:function () {
        cc.director.runScene(this.getCurScene());
    },
    newGame:function (level) {
        if (!level) {
            level = 1;
        }
        //this.m_bIsLoadingFight = false;
        this._selectLevel = level;

        if (GameCtrl.isOnlineGame()) {
            this.joinOnlineGame();
        } else {
            this.startGameScene();
        }
    },
    joinOnlineGame:function () {
        var gameCtrl = this;
        var client = this.getGameWSClient();

        Promise.resolve().then(
            () => {
                // Create a test player
                var playerName = "testplayername" + Date.now() + Math.floor(Math.random() * 100000000);
                var playerData = {
                    name: playerName,
                    email: playerName + '@testmail189543.com',
                    password: 'test_password.12345',
                };
                return client.callAPIOnce('game', 'registerNewPlayer', playerData).then(
                    response => response.data
                );
            }
        ).then(
            // Log in
            (testPlayer) => client.callAPIOnce('game', 'login', {
                id: testPlayer.id,
                password: 'test_password.12345'
            })
        ).then(
            loginResponse => {
                console.log("loginResponse:", loginResponse);
                return client.callAPIOnce('game', 'joinGame', {})
            }
        ).then(
            joinResponse => {
                console.log("joinResponse:", joinResponse);

                var ioSocket = gameCtrl.getGameIOSocket();

                socketUtils.simulateNetworkLatency(ioSocket, 200);

                var receiver = clientReceiver(ioSocket, gameCtrl);

                var informServer = serverInformer(ioSocket);
                GameCtrl.informServer = informServer;

                // gameCtrl.startGameScene() will be run by clientReceiver when everything is ready.
            }
        ).catch(console.error.bind(console));
    },
    startGameScene: function () {
        this.gameState = GAMEPLAY;
        var gameScene = new GameScene("Scene_Main", this._selectLevel);
        this.setCurScene(gameScene);

        cc.director.runScene(this.getCurScene());
        sino.fishGroup.loadResource(this.getCurScene());
        sino.fishGroup.init();

        wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, this._selectLevel);
    },
    home:function () {
        this.gameState = GAMEHOME;
        var mainMenuScene = MainMenuScene.create();
        // mainMenuScene.initWithDef("");
        this.setCurScene(mainMenuScene);
        this.runGame();
    },
    option:function () {
        this.gameState = GAMEHOME;
        var mainMenuScene = MainMenuScene.create();
        // mainMenuScene.initWithDef("");
        this.setCurScene(mainMenuScene);
        this.getCurScene().showSelectStage();
        this.runGame();
    },
    homeWithStage:function () {
        this.gameState = GAMEHOME;

        var mainMenuScene = new MainMenuScene();
        // mainMenuScene.initWithDef("");
        this.setCurScene(mainMenuScene);
        this.getCurScene().showSelectStage();

        this.runGame();
    },
    save:function () {
        var pCurScene = this.getCurScene();
        if (pCurScene && pCurScene.getSPSceneType() == eGameScene) {
            pCurScene.saveState();
        }
        else if (this.loaded) {

        }
    },
    setGameWSClient:function (client) {
        this.gameWSClient = client;
    },
    getGameWSClient:function () {
        return this.gameWSClient;
    },
    setGameIOSocket:function (ioSocket) {
        this.gameIOSocket = ioSocket;
    },
    getGameIOSocket:function () {
        return this.gameIOSocket;
    },
    setArena:function (arena) {
        this.arena = arena;
    },
    getArena:function () {
        return this.arena;
    },
    setMyPlayerId:function (myPlayerId) {
        this.myPlayerId = myPlayerId;
    },
    getMyPlayerId:function () {
        return this.myPlayerId;
    },

    run:function () {
        cc.director.runScene(LogoScene.scene());
    },
    setCurScene:function (s) {
        if (this._curScene != s) {
            if (this._curScene) {
                this._curScene.onExit();
            }
            this._curScene = s;
            if (this._curScene) {
                cc.director.runScene(s);
            }
        }
    },
    getCurScene:function () {
        return this._curScene;
    },
    changeScene:function () {
        if (this._curScene) {
            this._curScene.cleanResources();
        }

        if (UseTestGroupScene) {
            this._curScene = new FightScene();
        } else {
            this._curScene = new GameScene();
        }
        var def = "Scene_Main";
        this._curScene.initWithDef(def, 1);
        cc.director.runScene(this.getCurScene().getScene());
    },
    getPlanType:function () {
        return this.myPlanType;
    },
    setPlanType:function (v) {
        this.myPlanType = v;
    },
    getStage:function () {
        return this.stage;
    },
    setStage:function (v) {
        this.stage = v;
    },
    getGameState:function () {
        return this.gameState;
    },
    setGameState:function (v) {
        this.gameState = v;
    },
    getIsNewGame:function () {
        return this.isNewGame;
    },
    setIsNewGame:function (v) {
        this.isNewGame = v;
    },
    getIsPassStage:function () {
        return this.isPassStage;
    },
    setIsPassStage:function (v) {
        this.isPassStage = v;
    },
    setSharedGame:function (game) {
        GameCtrl._sharedGame = game;
    },
    setGameConfig:function (gameConfig) {
        this.gameConfig = gameConfig;
    },
    getGameConfig:function () {
        return this.gameConfig;
    },
});

GameCtrl.sharedGame = function () {

    //cc.Assert(this._sharedGame, "Havn't call setSharedGame");
    if (!this._sharedGame) {
        this._sharedGame = new GameCtrl();
    }
    return this._sharedGame;
};
GameCtrl.isOnlineGame = function () {
    // This allows us to switch the game back into offline play mode.
    //
    // But its other purpose is simply to explain parts of the code:
    //
    //     if (GameCtrl.isOnlineGame()) {
    //         // online code
    //     } else {
    //         // offline code
    //     }
    return true;
};

GameCtrl._sharedGame = null;
