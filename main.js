

var kUserDefaultKeyAdsPlateform = "kUserDefaultKeyAdsPlateform";
var AdsPlateformNon = 0;	        //non
var AdsPlateformTapjoy = 1;			  //tapjoy
var AdsPlateformPunchBox = 2;         //PunchBox
var AdsPlateformFlurry = 3;           //FlurryClip
var AdsDuration = 10000;
var LoadingDuration = 0;
var PackagedApp = (window.chrome && window.chrome.storage != null);

var playEffect = function (effectFilePath) {
    var ret = GamePreference.getInstance().getPlayEffect();
    if (ret) {
        return  cc.audioEngine.playEffect(effectFilePath);
    }
};
var playMusic = function (musicfile, loop) {
    if (!musicfile) {
        musicfile = res.music_1;
    }
    var ret = GamePreference.getInstance().getPlayMusic();
    if (ret) {
        return cc.audioEngine.playMusic( musicfile, loop);
    }
};

var eTag_MainMenu_StartMenu_menu = 997;
var eZOrder_MainMenu_StartMenu_menu = 10;

// var AnchorPointCenter = new cc.p(0.5, 0.5);
// var AnchorPointTop = new cc.p(0.5, 1);
// var AnchorPointTopRight = new cc.p(1, 1);
// var AnchorPointRight = new cc.p(1, 0.5);
// var AnchorPointBottomRight = new cc.p(1, 0);
// var AnchorPointBottom = new cc.p(0.5, 0);
// var AnchorPointBottomLeft = new cc.p(0, 0);
// var AnchorPointLeft = new cc.p(0, 0.5);
// var AnchorPointTopLeft = new cc.p(0, 1);


//////////////////////////////////////////////////////////////////////////
// implement VisableRect
//////////////////////////////////////////////////////////////////////////



var cocos2dApp = cc.game.onStart = function() {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(1366, 768, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    //load resources

    // var scene = LogoScene.scene();
    //move global into app
    AnchorPointCenter = new cc.p(0.5, 0.5);
    AnchorPointTop = new cc.p(0.5, 1);
    AnchorPointTopRight = new cc.p(1, 1);
    AnchorPointRight = new cc.p(1, 0.5);
    AnchorPointBottomRight = new cc.p(1, 0);
    AnchorPointBottom = new cc.p(0.5, 0);
    AnchorPointBottomLeft = new cc.p(0, 0);
    AnchorPointLeft = new cc.p(0, 0.5);
    AnchorPointTopLeft = new cc.p(0, 1);

    s_rcVisible = cc.rect();
    s_ptCenter = cc.p();
    s_ptTop = cc.p();
    s_ptTopRight = cc.p();
    s_ptRight = cc.p();
    s_ptBottomRight = cc.p();
    s_ptBottom = cc.p();
    s_ptLeft = cc.p();
    s_ptTopLeft = cc.p();


    LoadingDuration = Date.now();
    var self = this;

    cc.LoadingScreen.preload(g_resources, function () {
        // cc.director.runScene(new LogoScene());
        // cc.director.runScene(new TestScene());
        // cc.director.runScene(new StartMenuLayer());
        ClientServerConnect.connectToMasterServer();
        GameCtrl.sharedGame().home();
    }, this);
    // },
   // var  applicationDidFinishLaunching = function () {
   //      // initialize director
   //      var director = cc.director;
   //
   //      this.checkUserData();
   //
   //      // 根据玩家的设置来设置游戏中的背景音乐以及音效的音量
   //      if (!wrapper.getBooleanForKey(KGameInitData)) {
   //          GamePreference.getInstance().setCloseLocalPush(true);
   //          GamePreference.getInstance().setPlayMusic(true);
   //          GamePreference.getInstance().setPlayEffect(true);
   //          GamePreference.getInstance().updateSoftPref();
   //          wrapper.setBooleanForKey(KGameInitData, true);
   //      }
   //      var bgVolume = GamePreference.getInstance().getPlayMusic() ? 1 : 0;
   //      var effectVolume = GamePreference.getInstance().getPlayEffect() ? 1 : 0;
   //      cc.audioEngine.setMusicVolume(bgVolume);
   //      cc.audioEngine.setEffectsVolume(effectVolume);
   //
   //      // 记录第一次打开游戏的时间
   //      var time = wrapper.getFloatForKey(kFirstOpenTime, 0);
   //      if (time == 0) {
   //          wrapper.getFloatForKey(kFirstOpenTime, (new Date()).getTime());
   //          this._newGame = true;
   //      } else {
   //          this._newGame = false;
   //      }
   //
   //      // set the shoot bullet count
   //      if (!wrapper.getBooleanForKey(kTutorialPlayed) && this._newGame) {
   //          GameSetting.getInstance().setBulletShootCount(0);
   //      } else {
   //          GameSetting.getInstance().setBulletShootCount(11);
   //      }
   //
   //      // init the player data
   //      this.initDataBase();
   //
   //      // turn on display FPS
   //      director.setDisplayStats(this.config['showFPS']);
   //
   //      // set FPS. the default value is 1.0/60 if you don't call this
   //      director.setAnimationInterval(1.0 / this.config['frameRate']);
   //
   //
   //      // run
   //      // director.runWithScene(new this.startScene());
   //      // cc.LoadingScreen.preload(g_resources, function () {
   //      //     cc.director.runScene(new TestScene());
   //      // }, this);
   //
   //      return true;
   //  }
    //,
        // initDataBase = function () {
        //     // load the player info
        //     PlayerActor.sharedActor().loadStates();
        //
        //     if (PackagedApp) {
        //         // cc.Director.getInstance().getScheduler().scheduleSelector(this.pushUserData, this, 12);
        //         cc.director.getScheduler().schedule(this.pushUserData, this, 12);
        //     }
        // },
        // checkUserData = function () {
        //     var first = wrapper.getBooleanForKey(IsFirst, true);
        //
        //     if (first) {
        //         this.transformUserDefault();
        //         wrapper.setBooleanForKey(IsFirst, false);
        //     }
        // },
        // transformUserDefault = function () {
        //     wrapper.setBooleanForKey(kUseAcceler, true);
        //     wrapper.setBooleanForKey(kPlayMusic, true);
        //     wrapper.setBooleanForKey(kPlayEffect, true);
        //     wrapper.setBooleanForKey(kRate, true);
        //     wrapper.setBooleanForKey(kColseLocalPush, true);
        //     wrapper.setBooleanForKey(kNewFishPrompt, true);
        //     wrapper.setBooleanForKey(kTutorialPlayed, false);
        //     wrapper.setBooleanForKey(kIsPaying, true);
        //     wrapper.setBooleanForKey(kAddStarfish, true);
        //     wrapper.setBooleanForKey(kTutorialAwardReceived, false);
        //     wrapper.setIntegerForKey(kStartupCount, 1);
        //     wrapper.setIntegerForKey(kUserDefaultKeyAdsPlateform, 0);
        //     wrapper.setIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY, 0);
        //     wrapper.setIntegerForKey(kWeiBoAdd, 0);
        //     wrapper.setIntegerForKey(kUseLaser, 0);
        //     wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, 0);
        //     wrapper.setIntegerForKey(kLaserNum, 0);
        //     wrapper.setIntegerForKey(kLaserSign, PlayerActor.laserSign("0"));
        //     wrapper.setFloatForKey(kFirstOpenTime, (new Date()).getTime());
        // },
        // syncUserData = function () {
        //     var self = this;
        //     if (window.chrome && window.chrome.storage && window.chrome.storage.sync) {
        //         window['chrome']['storage']['sync'].get(["GameConfig", "PlayerEntity"], function (data) {
        //             self._setLocalStorage(data)
        //         });
        //     }
        // },
        // _setLocalStorage = function (data) {
        //     var gameConfig = data["GameConfig"];
        //     if (gameConfig) {
        //         wrapper.setBooleanForKey(kUseAcceler, gameConfig[kUseAcceler]);
        //         wrapper.setBooleanForKey(kPlayMusic, gameConfig[kPlayMusic]);
        //         wrapper.setBooleanForKey(kPlayEffect, gameConfig[kPlayEffect]);
        //         wrapper.setBooleanForKey(kRate, gameConfig[kRate]);
        //         wrapper.setBooleanForKey(kColseLocalPush, gameConfig[kColseLocalPush]);
        //         wrapper.setBooleanForKey(kNewFishPrompt, gameConfig[kNewFishPrompt]);
        //         wrapper.setBooleanForKey(kTutorialPlayed, gameConfig[kTutorialPlayed]);
        //         wrapper.setBooleanForKey(kIsPaying, gameConfig[kIsPaying]);
        //         wrapper.setBooleanForKey(kAddStarfish, gameConfig[kAddStarfish]);
        //         wrapper.setBooleanForKey(kTutorialAwardReceived, gameConfig[kTutorialAwardReceived]);
        //         wrapper.setIntegerForKey(kStartupCount, gameConfig[kStartupCount]);
        //         wrapper.setIntegerForKey(kUserDefaultKeyAdsPlateform, gameConfig[kUserDefaultKeyAdsPlateform]);
        //         wrapper.setIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY, gameConfig[CURRENT_SPECIAL_WEAPON_KEY]);
        //         wrapper.setIntegerForKey(kWeiBoAdd, gameConfig[kWeiBoAdd]);
        //         wrapper.setIntegerForKey(kUseLaser, gameConfig[kUseLaser]);
        //         wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, gameConfig[UserDefaultsKeyPreviousPlayedStage]);
        //         wrapper.setIntegerForKey(kLaserNum, gameConfig[kLaserNum]);
        //         wrapper.setIntegerForKey(kLaserSign, gameConfig[kLaserSign]);
        //         wrapper.getFloatForKey(kFirstOpenTime, gameConfig[kFirstOpenTime]);
        //         wrapper.setBooleanForKey(IsFirst, gameConfig[IsFirst]);
        //         wrapper.setBooleanForKey(kHaveSaveData, gameConfig[kHaveSaveData]);
        //         wrapper.setIntegerForKey(KCurrentMusicPlayType, gameConfig[KCurrentMusicPlayType]);
        //         wrapper.setBooleanForKey(kNewFishPrompt, gameConfig[kNewFishPrompt]);
        //         wrapper.setBooleanForKey(KGameInitData, gameConfig[KGameInitData]);
        //     }
        //
        //     var playerEntity = data["PlayerEntity"];
        //     if (playerEntity) {
        //         wrapper.setStringForKey(KEY_PLAYER_ENTITY, playerEntity);
        //     }
        //     cc.LoadingScreen.getInstance().removeSelft();
        //     cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        //
        //     var self = this;
        //     window.onbeforeunload = function () {
        //         PlayerActor.sharedActor().savePlayerEntiy();
        //         PlayerActor.sharedActor().playerLogout();
        //         //var playerEntityStr = wrapper.getStringForKey("PlayerEntity");
        //         /*cc.log("=============");
        //          cc.log("VIEW P="+PlayerActor.sharedActor().getPlayerMoney());
        //          cc.log("VIEW L="+PlayerEntity_Wrapper.getInstance()["playerMoney"]);
        //          cc.log("=============");*/
        //         if (PackagedApp) {
        //             self.pushUserData();
        //         }
        //         self.pauseGame();
        //         var tmpArray = cc.LocalizedString.localizedString("Quit Game").split("|");
        //         return tmpArray[0 | ((tmpArray.length - 1) * Math.random())];
        //     }
        // },
        // pauseGame = function () {
        //     cc.director.pause();
        //     var a = setTimeout(function () {
        //         clearTimeout(a);
        //         cc.director.resume();
        //     }, 100);
        // },
        // pushUserData = function () {
        //     var KingFisherData = {};
        //     var gameConfig = {};
        //
        //     gameConfig[kUseAcceler] = wrapper.getBooleanForKey(kUseAcceler);
        //     gameConfig[kPlayMusic] = wrapper.getBooleanForKey(kPlayMusic);
        //     gameConfig[kPlayEffect] = wrapper.getBooleanForKey(kPlayEffect);
        //     gameConfig[kRate] = wrapper.getBooleanForKey(kRate);
        //     gameConfig[kColseLocalPush] = wrapper.getBooleanForKey(kColseLocalPush);
        //     gameConfig[kNewFishPrompt] = wrapper.getBooleanForKey(kNewFishPrompt);
        //     gameConfig[kTutorialPlayed] = wrapper.getBooleanForKey(kTutorialPlayed);
        //     gameConfig[kIsPaying] = wrapper.getBooleanForKey(kIsPaying);
        //     gameConfig[kAddStarfish] = wrapper.getBooleanForKey(kAddStarfish);
        //     gameConfig[kTutorialAwardReceived] = wrapper.getBooleanForKey(kTutorialAwardReceived);
        //     gameConfig[kStartupCount] = wrapper.getIntegerForKey(kStartupCount);
        //     gameConfig[kUserDefaultKeyAdsPlateform] = wrapper.getIntegerForKey(kUserDefaultKeyAdsPlateform);
        //     gameConfig[CURRENT_SPECIAL_WEAPON_KEY] = wrapper.getIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY);
        //     gameConfig[kWeiBoAdd] = wrapper.getIntegerForKey(kWeiBoAdd);
        //     gameConfig[kUseLaser] = wrapper.getIntegerForKey(kUseLaser);
        //     gameConfig[UserDefaultsKeyPreviousPlayedStage] = wrapper.getIntegerForKey(UserDefaultsKeyPreviousPlayedStage);
        //     gameConfig[kLaserNum] = wrapper.getIntegerForKey(kLaserNum);
        //     gameConfig[kLaserSign] = wrapper.getIntegerForKey(kLaserSign);
        //     gameConfig[kFirstOpenTime] = wrapper.getFloatForKey(kFirstOpenTime);
        //     gameConfig[IsFirst] = wrapper.getBooleanForKey(IsFirst);
        //     gameConfig[kHaveSaveData] = wrapper.getBooleanForKey(kHaveSaveData);
        //     gameConfig[KCurrentMusicPlayType] = wrapper.getIntegerForKey(KCurrentMusicPlayType);
        //     gameConfig[kNewFishPrompt] = wrapper.getBooleanForKey(kNewFishPrompt);
        //     gameConfig[KGameInitData] = wrapper.getBooleanForKey(KGameInitData);
        //
        //     var playerEntity = wrapper.getStringForKey(KEY_PLAYER_ENTITY);
        //     //var playerEntity = JSON.stringify(PlayerEntity_Wrapper.getInstance());
        //
        //     KingFisherData["GameConfig"] = gameConfig;
        //
        //     if (playerEntity) {
        //         KingFisherData["PlayerEntity"] = playerEntity;
        //     }
        //
        //     if (window.chrome && window.chrome.storage && window.chrome.storage.sync) {
        //         window.chrome.storage.sync.set(KingFisherData);
        //     }
        // }
};

cc.game.run();

var VisibleRect = {
    rect : function () {
        if (s_rcVisible.width == 0) {
            var s = cc.winSize;
            s_rcVisible = cc.rect(0, 0, s.width, s.height);
        }
        return s_rcVisible;
    },
    center:function () {
        if (s_ptCenter.x == 0) {
            var rc = this.rect();
            s_ptCenter.x = rc.x + rc.width / 2;
            s_ptCenter.y = rc.y + rc.height / 2;
        }
        return s_ptCenter;
    },
    top:function () {
        if (s_ptTop.x == 0) {
            var rc = this.rect();
            s_ptTop.x = rc.x + rc.width / 2;
            s_ptTop.y = rc.y + rc.height;
        }
        return s_ptTop;
    },
    topRight:function () {
        if (s_ptTopRight.x == 0) {
            var rc = this.rect();
            s_ptTopRight.x = rc.x + rc.width;
            s_ptTopRight.y = rc.y + rc.height;
        }
        return s_ptTopRight;
    },
    right:function () {
        if (s_ptRight.x == 0) {
            var rc = this.rect();
            s_ptRight.x = rc.x + rc.width;
            s_ptRight.y = rc.y + rc.height / 2;
        }
        return s_ptRight;
    },
    bottomRight:function () {
        if (s_ptBottomRight.x == 0) {
            var rc = this.rect();
            s_ptBottomRight.x = rc.x + rc.width;
            s_ptBottomRight.y = rc.y;
        }
        return s_ptBottomRight;
    },
    bottom:function () {
        if (s_ptBottom.x == 0) {
            var rc = this.rect();
            s_ptBottom.x = rc.x + rc.width / 2;
            s_ptBottom.y = rc.y;
        }
        return s_ptBottom;
    },
    bottomLeft:function () {
        return this.rect();
    },
    left:function () {
        if (s_ptLeft.x == 0) {
            var rc = this.rect();
            s_ptLeft.x = rc.x;
            s_ptLeft.y = rc.y + rc.height / 2;
        }
        return s_ptLeft;
    },
    topLeft:function () {
        if (s_ptTopLeft.x == 0) {
            var rc = this.rect();
            s_ptTopLeft.x = rc.x;
            s_ptTopLeft.y = rc.y + rc.height;
        }
        return s_ptTopLeft;
    }
};
