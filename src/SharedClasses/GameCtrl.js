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
    init:function () {
        this.setIsNewGame(true);
        this.setIsPassStage(false);
        return true;
    },
    runGame:function () {
        cc.Director.getInstance().replaceScene(this.getCurScene());
    },
    newGame:function (level) {
        if (level !== null) {
            this._selectLevel = level;
            //this.m_bIsLoadingFight = false;
            this.startNewGame();
        }
        else {
            this.gameState = GAMEPLAY;
            var newScene = new GameScene();
            newScene.initWithDef("Scene_Main", 1);
            this.setCurScene(newScene);
            wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, 1);
        }
    },
    startNewGame:function () {
        this.gameState = GAMEPLAY;
        var gameScene = new GameScene();
        gameScene.initWithDef("Scene_Main", this._selectLevel);
        this.setCurScene(gameScene);

        cc.Director.getInstance().replaceScene(this.getCurScene());
        wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, this._selectLevel);
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

    run:function () {
        cc.Director.getInstance().runWithScene(LogoScene.scene());
    },
    setCurScene:function (s) {
        if (this._curScene != s) {
            if (this._curScene) {
                this._curScene.onExit();
            }
            this._curScene = s;
            if (this._curScene) {
                cc.Director.getInstance().replaceScene(s);
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
        cc.Director.getInstance().replaceScene(this.getCurScene().getScene());
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
    }
});

GameCtrl.sharedGame = function () {

    //cc.Assert(this._sharedGame, "Havn't call setSharedGame");
    if (!this._sharedGame) {
        this._sharedGame = new GameCtrl();
        if (this._sharedGame.init()) {
            return this._sharedGame;
        }
    } else {
        return this._sharedGame;
    }
    return null;
};

GameCtrl._sharedGame = null;
