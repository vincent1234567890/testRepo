/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var kUserDefaultKeyAdsPlateform = "kUserDefaultKeyAdsPlateform";
var AdsPlateformNon = 0;	        //non
var AdsPlateformTapjoy = 1;			  //tapjoy
var AdsPlateformPunchBox = 2;         //PunchBox
var AdsPlateformFlurry = 3;           //FlurryClip
var AdsDuration = 10000;
var LoadingDuration = 0;
var PackagedApp = (window['chrome']['storage'] != null);

var playEffect = function (effectFilePath) {
    var ret = GamePreference.getInstance().getPlayEffect();
    if (ret) {
        var soundid = cc.AudioEngine.getInstance().playEffect("Resource/sound/" + effectFilePath);
        return soundid;
    }
};
var playMusic = function (musicfile, loop) {
    if (!musicfile) {
        musicfile = "music_1";
    }
    var ret = GamePreference.getInstance().getPlayMusic();
    if (ret) {
        var musicid = cc.AudioEngine.getInstance().playBackgroundMusic("Resource/music/" + musicfile, loop);
        return musicid;
    }
};

var eTag_MainMenu_StartMenu_menu = 997;
var eZOrder_MainMenu_StartMenu_menu = 10;

var AnchorPointCenter = new cc.Point(0.5, 0.5);
var AnchorPointTop = new cc.Point(0.5, 1);
var AnchorPointTopRight = new cc.Point(1, 1);
var AnchorPointRight = new cc.Point(1, 0.5);
var AnchorPointBottomRight = new cc.Point(1, 0);
var AnchorPointBottom = new cc.Point(0.5, 0);
var AnchorPointBottomLeft = new cc.Point(0, 0);
var AnchorPointLeft = new cc.Point(0, 0.5);
var AnchorPointTopLeft = new cc.Point(0, 1);

//////////////////////////////////////////////////////////////////////////
// implement VisableRect
//////////////////////////////////////////////////////////////////////////

var s_rcVisible = cc.RectZero();
var s_ptCenter = cc.PointZero();
var s_ptTop = cc.PointZero();
var s_ptTopRight = cc.PointZero();
var s_ptRight = cc.PointZero();
var s_ptBottomRight = cc.PointZero();
var s_ptBottom = cc.PointZero();
var s_ptLeft = cc.PointZero();
var s_ptTopLeft = cc.PointZero();

var cocos2dApp = cc.Application.extend({
    config:document.querySelector('#cocos2d-html5')['c'],
    _newGame:true,
    ctor:function (scene) {
        if (cc.Browser.type != "chrome") {
            if (cc.Application.getCurrentLanguage() == cc.LANGUAGE_CHINESE) {
                alert(cc.LocalizedString.localizedString("Chrome"))
            } else {
                alert(cc.LocalizedString.localizedString("Chrome"))
            }
            return;
        }
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        AutoAdapterScreen.getInstance().setWinSize(this.config['tag']);
        window.addEventListener("resize", function (event) {
            AutoAdapterScreen.getInstance().adjustSize();
        });
        cc.AudioEngine.getInstance().init("ogg");

        LoadingDuration = Date.now();
        var self = this;
        cc.Loader.getInstance().onloading = function () {
            if (!PackagedApp) {
                cc.LoadingScreen.getInstance().draw();
            }
        };
        cc.Loader.getInstance().onload = function () {
            if (PackagedApp) {
                self.syncUserData();
            } else {
                cc.LoadingScreen.getInstance().removeSelft();
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            }


            /*var delta = Date.now() - LoadingDuration;
             if (delta > AdsDuration) {
             self.syncUserData();
             cc.LoadingScreen.getInstance().removeSelft();
             cc.AppController.shareAppController().didFinishLaunchingWithOptions();
             }
             else {
             var tmpTime = AdsDuration - delta;
             var sec = 0 | (tmpTime / 1000);
             var adInterval = setInterval(function () {
             if (sec > 0) {
             cc.$("#Percent").innerHTML = "The game will start in " + sec;
             sec--;
             }
             else {
             clearInterval(adInterval);
             self.syncUserData();
             cc.LoadingScreen.getInstance().removeSelft();
             cc.AppController.shareAppController().didFinishLaunchingWithOptions();
             }
             }, 1000);


             //cc.Director.getInstance().getScheduler().scheduleSelector(this.startGame, this, tmpTime, false);
             }*/
        };

        setTimeout(function () {
            cc.Loader.getInstance().preload(g_ressources);
        }, 1);

        cc.Resource.getInstance().setResPath(g_Path);

        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();

        this.checkUserData();

        // 根据玩家的设置来设置游戏中的背景音乐以及音效的音量
        if (!wrapper.getBooleanForKey(KGameInitData)) {
            GamePreference.getInstance().setCloseLocalPush(true);
            GamePreference.getInstance().setPlayMusic(true);
            GamePreference.getInstance().setPlayEffect(true);
            GamePreference.getInstance().updateSoftPref();
            wrapper.setBooleanForKey(KGameInitData, true);
        }
        var bgVolume = GamePreference.getInstance().getPlayMusic() ? 1 : 0;
        var effectVolume = GamePreference.getInstance().getPlayEffect() ? 1 : 0;
        cc.AudioEngine.getInstance().setBackgroundMusicVolume(bgVolume);
        cc.AudioEngine.getInstance().setEffectsVolume(effectVolume);

        // 记录第一次打开游戏的时间
        var time = wrapper.getFloatForKey(kFirstOpenTime, 0);
        if (time == 0) {
            wrapper.getFloatForKey(kFirstOpenTime, (new Date()).getTime());
            this._newGame = true;
        }
        else {
            this._newGame = false;
        }

        // set the shoot bullet count
        if (!wrapper.getBooleanForKey(kTutorialPlayed) && this._newGame) {
            GameSetting.getInstance().setBulletShootCount(0);
        }
        else {
            GameSetting.getInstance().setBulletShootCount(11);
        }

        // init the player data
        this.initDataBase();

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        // run
        director.runWithScene(new this.startScene());

        return true;
    },
    initDataBase:function () {
        // load the player info
        PlayerActor.sharedActor().loadStates();

        if (PackagedApp) {
            cc.Director.getInstance().getScheduler().scheduleSelector(this.pushUserData, this, 12);
        }
    },
    checkUserData:function () {
        var first = wrapper.getBooleanForKey(IsFirst, true);

        if (first) {
            this.transformUserDefault();
            wrapper.setBooleanForKey(IsFirst, false);
        }
    },
    transformUserDefault:function () {
        wrapper.setBooleanForKey(kUseAcceler, true);
        wrapper.setBooleanForKey(kPlayMusic, true);
        wrapper.setBooleanForKey(kPlayEffect, true);
        wrapper.setBooleanForKey(kRate, true);
        wrapper.setBooleanForKey(kColseLocalPush, true);
        wrapper.setBooleanForKey(kNewFishPrompt, true);
        wrapper.setBooleanForKey(kTutorialPlayed, false);
        wrapper.setBooleanForKey(kIsPaying, true);
        wrapper.setBooleanForKey(kAddStarfish, true);
        wrapper.setBooleanForKey(kTutorialAwardReceived, false);
        wrapper.setIntegerForKey(kStartupCount, 1);
        wrapper.setIntegerForKey(kUserDefaultKeyAdsPlateform, 0);
        wrapper.setIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY, 0);
        wrapper.setIntegerForKey(kWeiBoAdd, 0);
        wrapper.setIntegerForKey(kUseLaser, 0);
        wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, 0);
        wrapper.setIntegerForKey(kLaserNum, 0);
        wrapper.setIntegerForKey(kLaserSign, PlayerActor.laserSign("0"));
        wrapper.setFloatForKey(kFirstOpenTime, (new Date()).getTime());
    },
    syncUserData:function () {
        var self = this;
        window['chrome']['storage']['sync'].get(["GameConfig", "PlayerEntity"], function (data) {
            self._setLocalStorage(data)
        });
    },
    _setLocalStorage:function (data) {
        var gameConfig = data["GameConfig"];
        if (gameConfig) {
            wrapper.setBooleanForKey(kUseAcceler, gameConfig[kUseAcceler]);
            wrapper.setBooleanForKey(kPlayMusic, gameConfig[kPlayMusic]);
            wrapper.setBooleanForKey(kPlayEffect, gameConfig[kPlayEffect]);
            wrapper.setBooleanForKey(kRate, gameConfig[kRate]);
            wrapper.setBooleanForKey(kColseLocalPush, gameConfig[kColseLocalPush]);
            wrapper.setBooleanForKey(kNewFishPrompt, gameConfig[kNewFishPrompt]);
            wrapper.setBooleanForKey(kTutorialPlayed, gameConfig[kTutorialPlayed]);
            wrapper.setBooleanForKey(kIsPaying, gameConfig[kIsPaying]);
            wrapper.setBooleanForKey(kAddStarfish, gameConfig[kAddStarfish]);
            wrapper.setBooleanForKey(kTutorialAwardReceived, gameConfig[kTutorialAwardReceived]);
            wrapper.setIntegerForKey(kStartupCount, gameConfig[kStartupCount]);
            wrapper.setIntegerForKey(kUserDefaultKeyAdsPlateform, gameConfig[kUserDefaultKeyAdsPlateform]);
            wrapper.setIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY, gameConfig[CURRENT_SPECIAL_WEAPON_KEY]);
            wrapper.setIntegerForKey(kWeiBoAdd, gameConfig[kWeiBoAdd]);
            wrapper.setIntegerForKey(kUseLaser, gameConfig[kUseLaser]);
            wrapper.setIntegerForKey(UserDefaultsKeyPreviousPlayedStage, gameConfig[UserDefaultsKeyPreviousPlayedStage]);
            wrapper.setIntegerForKey(kLaserNum, gameConfig[kLaserNum]);
            wrapper.setIntegerForKey(kLaserSign, gameConfig[kLaserSign]);
            wrapper.getFloatForKey(kFirstOpenTime, gameConfig[kFirstOpenTime]);
            wrapper.setBooleanForKey(IsFirst, gameConfig[IsFirst]);
            wrapper.setBooleanForKey(kHaveSaveData, gameConfig[kHaveSaveData]);
            wrapper.setIntegerForKey(KCurrentMusicPlayType, gameConfig[KCurrentMusicPlayType]);
            wrapper.setBooleanForKey(kNewFishPrompt, gameConfig[kNewFishPrompt]);
            wrapper.setBooleanForKey(KGameInitData, gameConfig[KGameInitData]);
        }

        var playerEntity = data["PlayerEntity"];
        if (playerEntity) {
            wrapper.setStringForKey(KEY_PLAYER_ENTITY, playerEntity);
        }
        cc.LoadingScreen.getInstance().removeSelft();
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();

        var self = this;
        window.onbeforeunload = function () {
            PlayerActor.sharedActor().savePlayerEntiy();
            PlayerActor.sharedActor().playerLogout();
            //var playerEntityStr = wrapper.getStringForKey("PlayerEntity");
            /*cc.log("=============");
             cc.log("VIEW P:"+PlayerActor.sharedActor().getPlayerMoney());
             cc.log("VIEW L:"+PlayerEntity_Wrapper.getInstance()["playerMoney"]);
             cc.log("=============");*/
            if (PackagedApp) {
                self.pushUserData();
            }
            self.pauseGame();
            var tmpArray = cc.LocalizedString.localizedString("Quit Game").split("|");
            return tmpArray[0 | ((tmpArray.length - 1) * Math.random())];
        }
    },
    pauseGame:function () {
        cc.Director.getInstance().pause();
        var a = setTimeout(function () {
            clearTimeout(a);
            cc.Director.getInstance().resume();
        }, 100);
    },
    pushUserData:function () {
        var KingFisherData = {};
        var gameConfig = {};

        gameConfig[kUseAcceler] = wrapper.getBooleanForKey(kUseAcceler);
        gameConfig[kPlayMusic] = wrapper.getBooleanForKey(kPlayMusic);
        gameConfig[kPlayEffect] = wrapper.getBooleanForKey(kPlayEffect);
        gameConfig[kRate] = wrapper.getBooleanForKey(kRate);
        gameConfig[kColseLocalPush] = wrapper.getBooleanForKey(kColseLocalPush);
        gameConfig[kNewFishPrompt] = wrapper.getBooleanForKey(kNewFishPrompt);
        gameConfig[kTutorialPlayed] = wrapper.getBooleanForKey(kTutorialPlayed);
        gameConfig[kIsPaying] = wrapper.getBooleanForKey(kIsPaying);
        gameConfig[kAddStarfish] = wrapper.getBooleanForKey(kAddStarfish);
        gameConfig[kTutorialAwardReceived] = wrapper.getBooleanForKey(kTutorialAwardReceived);
        gameConfig[kStartupCount] = wrapper.getIntegerForKey(kStartupCount);
        gameConfig[kUserDefaultKeyAdsPlateform] = wrapper.getIntegerForKey(kUserDefaultKeyAdsPlateform);
        gameConfig[CURRENT_SPECIAL_WEAPON_KEY] = wrapper.getIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY);
        gameConfig[kWeiBoAdd] = wrapper.getIntegerForKey(kWeiBoAdd);
        gameConfig[kUseLaser] = wrapper.getIntegerForKey(kUseLaser);
        gameConfig[UserDefaultsKeyPreviousPlayedStage] = wrapper.getIntegerForKey(UserDefaultsKeyPreviousPlayedStage);
        gameConfig[kLaserNum] = wrapper.getIntegerForKey(kLaserNum);
        gameConfig[kLaserSign] = wrapper.getIntegerForKey(kLaserSign);
        gameConfig[kFirstOpenTime] = wrapper.getFloatForKey(kFirstOpenTime);
        gameConfig[IsFirst] = wrapper.getBooleanForKey(IsFirst);
        gameConfig[kHaveSaveData] = wrapper.getBooleanForKey(kHaveSaveData);
        gameConfig[KCurrentMusicPlayType] = wrapper.getIntegerForKey(KCurrentMusicPlayType);
        gameConfig[kNewFishPrompt] = wrapper.getBooleanForKey(kNewFishPrompt);
        gameConfig[KGameInitData] = wrapper.getBooleanForKey(KGameInitData);

        var playerEntity = wrapper.getStringForKey(KEY_PLAYER_ENTITY);
        //var playerEntity = JSON.stringify(PlayerEntity_Wrapper.getInstance());

        KingFisherData["GameConfig"] = gameConfig;

        if (playerEntity) {
            KingFisherData["PlayerEntity"] = playerEntity;
        }

        window['chrome']['storage']['sync'].set(KingFisherData);
    }
});

var myApp = new cocos2dApp(LogoScene.scene);
//var myApp = new cocos2dApp(MainMenuScene.create);

var VisibleRect = {
    rect:function () {
        if (s_rcVisible.size.width == 0) {
            var s = cc.Director.getInstance().getWinSize();
            s_rcVisible = cc.RectMake(0, 0, s.width, s.height);
        }
        return s_rcVisible;
    },
    center:function () {
        if (s_ptCenter.x == 0) {
            var rc = this.rect();
            s_ptCenter.x = rc.origin.x + rc.size.width / 2;
            s_ptCenter.y = rc.origin.y + rc.size.height / 2;
        }
        return s_ptCenter;
    },
    top:function () {
        if (s_ptTop.x == 0) {
            var rc = this.rect();
            s_ptTop.x = rc.origin.x + rc.size.width / 2;
            s_ptTop.y = rc.origin.y + rc.size.height;
        }
        return s_ptTop;
    },
    topRight:function () {
        if (s_ptTopRight.x == 0) {
            var rc = this.rect();
            s_ptTopRight.x = rc.origin.x + rc.size.width;
            s_ptTopRight.y = rc.origin.y + rc.size.height;
        }
        return s_ptTopRight;
    },
    right:function () {
        if (s_ptRight.x == 0) {
            var rc = this.rect();
            s_ptRight.x = rc.origin.x + rc.size.width;
            s_ptRight.y = rc.origin.y + rc.size.height / 2;
        }
        return s_ptRight;
    },
    bottomRight:function () {
        if (s_ptBottomRight.x == 0) {
            var rc = this.rect();
            s_ptBottomRight.x = rc.origin.x + rc.size.width;
            s_ptBottomRight.y = rc.origin.y;
        }
        return s_ptBottomRight;
    },
    bottom:function () {
        if (s_ptBottom.x == 0) {
            var rc = this.rect();
            s_ptBottom.x = rc.origin.x + rc.size.width / 2;
            s_ptBottom.y = rc.origin.y;
        }
        return s_ptBottom;
    },
    bottomLeft:function () {
        return this.rect().origin;
    },
    left:function () {
        if (s_ptLeft.x == 0) {
            var rc = this.rect();
            s_ptLeft.x = rc.origin.x;
            s_ptLeft.y = rc.origin.y + rc.size.height / 2;
        }
        return s_ptLeft;
    },
    topLeft:function () {
        if (s_ptTopLeft.x == 0) {
            var rc = this.rect();
            s_ptTopLeft.x = rc.origin.x;
            s_ptTopLeft.y = rc.origin.y + rc.size.height;
        }
        return s_ptTopLeft;
    }
};
