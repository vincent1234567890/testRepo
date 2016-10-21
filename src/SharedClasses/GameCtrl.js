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
        this.connectToMasterServer();
        return true;
    },
    connectToMasterServer:function () {
        var gameAPIServerUrl = 'ws://3dfishing88888.sinonet.sg:8080';
        var localNames = ['localhost', '127.0.0.1', '127.0.1.1', '0.0.0.0'];
        if (localNames.indexOf(window.location.hostname) >= 0) {
            //gameAPIServerUrl = 'ws://localhost:8080';
            gameAPIServerUrl = 'ws://192.168.1.1:8080';
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
        if (level !== null) {
            this._selectLevel = level;
            //this.m_bIsLoadingFight = false;
            this.startNewGame();
        }
        else {
            this.gameState = GAMEPLAY;
            var newScene = new GameScene("Scene_Main", 1);
            this.setCurScene(newScene);
            wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, 1);
        }
    },
    startNewGame:function () {
        this.gameState = GAMEPLAY;
        var gameScene = new GameScene("Scene_Main", this._selectLevel);
        this.setCurScene(gameScene);

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

                var receiver = clientReceiver(ioSocket, gameCtrl);
            }
        ).catch(console.error.bind(console));

        cc.director.runScene(this.getCurScene());
        wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, this._selectLevel);
    },
    populateNewGame: function (players, fishes, bullets, serverGameTime) {
        const gameConfig = this.getGameConfig();

        const arena = new FishGameArena(false, gameConfig);

        this.setArena(arena);

        // @todo To get up-to-date, create the cannons for the other players,
        // @todo add all the fishes (and maybe even add some in-transit bullets)
    },
    home:function () {
        this.gameState = GAMEHOME;
        var mainMenuScene = MainMenuScene.create();
        mainMenuScene.initWithDef("");
        this.setCurScene(mainMenuScene);
        this.runGame();
    },
    option:function () {
        this.gameState = GAMEHOME;
        var mainMenuScene = MainMenuScene.create();
        mainMenuScene.initWithDef("");
        this.setCurScene(mainMenuScene);
        this.getCurScene().showSelectStage();
        this.runGame();
    },
    homeWithStage:function () {
        this.gameState = GAMEHOME;

        var mainMenuScene = new MainMenuScene();
        mainMenuScene.initWithDef("");
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

GameCtrl._sharedGame = null;
