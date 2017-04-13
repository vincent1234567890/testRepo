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
        return true;
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
            // this.joinOnlineGame();
            // GameManager.login();
        } else {
            this.startGameScene();
        }
    },

    startGameScene: function (fishGameArena) {
        // Sometimes for testing, I want to create lag on the game packets but not on the initial packets.
        // So I only start simulating the network latency here, not earlier.
        //var ioSocket = ClientServerConnect.getGameIOSocket();
        //socketUtils.simulateNetworkLatency(ioSocket, 500);

        this.setArena(fishGameArena);
        this.gameState = GAMEPLAY;
        var gameScene = new GameScene("Scene_Main", this._selectLevel);
        this.setCurScene(gameScene);

        cc.director.runScene(this.getCurScene());
        GameManager.initialiseGame(gameScene, fishGameArena);
        sino.fishGroup.loadResource(this.getCurScene());
        sino.fishGroup.init();

        wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, this._selectLevel);
    },
    home:function () {
        this.gameState = GAMEHOME;
        var mainMenuScene = MainMenuScene.create();
        // mainMenuScene.initWithDef("");
        this.setCurScene(mainMenuScene);
        GameManager.initialiseLogin(mainMenuScene);
        GameManager.goToLogin();
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
