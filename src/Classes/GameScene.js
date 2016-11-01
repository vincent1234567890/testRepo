var SPSceneType = {
    eSPScene:0,
    eGameScene:1,
    eFightScene:2
};

var kTutorialTotalStep = 26;
var kAddCoidParticleTag = 112;
var kAchieveParticleTag = 113;
var kAchieveLayerTag = 115;
var kTutorialHintTag = 116;
var kSkipTutorialTag = 117;
var kSkipTutorialSkipTag = 118;
var kSkipTutorialDoneTag = 119;
var kShareToWeiBoTag = 120;
var kParticleDoubleTag = 121;
var kMarkTag = 122;

var DoubleSpriteNum = 126;
var kBackGoundLayerTag = 127;

var LUIREMINDERTAG = 1001;

var kUINewFishOneTag = 1002;
var kUINewFishTwoTag = 1003;
var kUIAdvertisement = 1004;

var USERINFO_YDEFAULT_POS_PAD = 0;
var CAMRA_XDEFAULT_POS_PAD = 0;
var YMOVE_SPEED_PAD = 30 / 60;
var XMOVE_SPEED_PAD = 400 / 60;
var USERINFO_YMOVETO_POS_PAD = 55;
var CAMRA_XMOVETO_POS_PAD = -758;  //208
var YMOVE_SPEED_STEP_PAD = 0.3;
var XMOVE_SPEED_STEP_PAD = 1.2;
var COMPACT_SHOW_POS_PAD = 74;
var COMPACT_HIDE_POS_PAD = (74 - 341);

var AD_IN_FINAL_POS_PAD = -2;
var AD_OUT_FINAL_POS_PAD = -92;

var USERINFO_YDEFAULT_POS_PHONE = 0;
var CAMRA_XDEFAULT_POS_PHONE = 0;
var YMOVE_SPEED_PHONE = 112 / 60;
var XMOVE_SPEED_PHONE = 200 / 60;
var USERINFO_YMOVETO_POS_PHONE = 50;
var CAMRA_XMOVETO_POS_PHONE = -320;
var YMOVE_SPEED_STEP_PHONE = 0.15;
var XMOVE_SPEED_STEP_PHONE = 0.6;
var COMPACT_SHOW_POS_PHONE = 6;
var COMPACT_HIDE_POS_PHONE = 6 - 154;

var AD_IN_FINAL_POS_PHONE = 0;
var AD_OUT_FINAL_POS_PHONE = -50;


var BANNER_UI_MOVEDELAY = 0.5;

var CaptiveRateStandard = 0;
var CaptiveRateZero = 1;
var CaptiveRateHundredPercent = 2;

var kAdBannerPositionTop = 0;
var kAdBannerPositionBottom = 1;

var kTagPrizeSprite = 29;
var kTagPrizeLight1 = 30;
var kTagPrizeLight2 = 31;
var kTagPrizeBG = 32;
var kTagPrizeNOTICE = 33;
var kTagPrizeLABEL = 34;
var kTagPrizeLight3 = 35;
var kTagPrizeLight4 = 50;

var kNoAdBanner = 0;
var kAdBannerMoveIn = 1;
var kAdBannerMoveOut = 2;
var kAdBannerRestoreUI = 3;
var kAdBannerMoveInDelay = 4;
var kAdBannerMoveOutDelay = 5;

var BannerAdTyp = {
    BannerAdPause:0, // 暂停界面的广告条
    BannerAdGame:1, // 游戏过程中的广告条
    BannerAdAll:2          // 这个枚举值主要是在隐藏广告条时使用，在显示广告条时必须明确指定是暂停界面还是游戏界面
};

var AD_SHOWN_TIME = AdsController.getAdsDuration();      // 每次广告的显示时间
var AD_INTERVEL = AdsController.getAdsInterval() + AD_SHOWN_TIME;      // 显示广告的时间间隔

var GameScene = cc.Scene.extend({
    _movePoint:null,
    _musicIdx:0,
    _touchLen:0,
    _tempNumber:0,
    _tempdt:0,
    _delayTimeCount:0,
    _xMoveSpeed:0,
    _yMoveSpeed:0,
    // UI
    _scoreBar:null,
    _userInfoLayer:null,
    _shootCount:0,
    _dictionaryFish:null,
    //bg
    _backgroundLayer:null,
    _gamepassTime:0,
    _items:null,
    _time:0,
    _maxTime:0,
    _pathIndex:null,
    // prepare next waver
    _prepareNextWave:false,
    _preparingNextWave:false,
    _curWaveTime:0,
    _perWaveTime:0,
    _accTimer:0,
    _ksprite:null,
    _testPlistName:"",
    _addPrizeFlag:0,
    _showHint:false,
    _uiInfo:null,
    _tutorialBlackLayer:null,
    _skipTutorialButton:null,
    _userBtn:null,
    _prizeNetCount:0,
    _camera:null,
    _isShowAllMenu:false,
    _blurBackgroundLayer:null,
    _processsprite:null,
    _addPrizeFishGroupFinish:false,
    _addCoinTime:0,

    _bigPrizeExist:false,
    _layer:null,
    _savingImage:false,
    _isPLayGameMainSessionController:null,
    _adMobBannerProcessType:null,
    _cancelTutorialLayer:null,
    _tutorialConfirmLayer:null,
    //coefficient multiplication
    _oddsNumber:1,
    _controlChesh:false,
    _chest_FishID:0,
    _achievementShowNum:0,
    _removeActoraParam:null,
    _isPause:false,
    _gameover:false,
    _curStage:0,
    _cannonActor:null,
    _addPrizeGroup:false,
    _playTutorial:false,
    _pastTime:0,
    _shootPosList:null,
    _level:0,
    _canSendBullet:false,
    _timeScale:0,
    _chestGameLayer:null,
    _compactUserInfo:null,
    _messageCenter:null,
    _prizeSprite:null,
    _enterNewLayer:null,
    _firstInGame:true,
    _canShowFeature:true,
    _timeAdMob:0,
    _pauseMenuLayer:null,
    _retainedResArray:null,
    _touchLayer:null,
    _sessionsEnded:null,
    _batchNodes:null,
    _aliveActor:null,
    _allGameObjects:null,
    _itemMusicPlayer:null,
    _itemHide:null,
    _itemCamera:null,
    _itemPause:null,
    _tutorialSessionController:null,
    _shakeTime:0,
    _swingRadio:5,

    ctor:function (def, le) {
        cc.Scene.prototype.ctor.call(this);

        this._layer = new cc.Layer();
        this._layer.setTag(2233);
        this.addChild(this._layer);

        //FishNetCollideHandler.shareFishNetCollideHandler().checkLocallyData(le);

        // 重置是否可以显示 redeem 窗口的参数，防止兑换金币时异常退出导致无法打开redeem 窗口
        wrapper.setBooleanForKey(kCanShowRedeem, true);

        this._prizeSprite = new cc.Node();
        this._prizeSprite.setAnchorPoint(cc.p(0.5, 0.5));
        this._prizeSprite.setPosition(VisibleRect.center());

        this._gameover = false;
        this._isPause = false;
        this._isPLayGameMainSessionController = false;

        this._musicIdx = this._curStage = le;

        this.initBgLayer();

        cc.director.getScheduler().schedule(this.update, this, 0, false);
        /*        var pSceneSettingDataModel = SceneSettingDataModel.sharedSceneSettingDataModel();
         if (pSceneSettingDataModel.getCanUseNewPath()) {
         FishFactoryManager.shareFishFactoryManager().setScene(this);
         }
         else {*/
        sino.fishGroup.setScene(this);
        //sino.fishGroup.initAllTrack(le);
        //}

        GameSetting.getInstance().loadData(this._curStage);

        //this._oddsNumber = SceneSettingDataModel.sharedSceneSettingDataModel().getOddNumber();

        // 双倍区 设置倍数  五倍区设置
        if (le == 2) {
            this.setOddsNumber(2);
        }
        else if (le == 3) {
            this.setOddsNumber(5);
        }
        else {
            this.setOddsNumber(1);
        }

        var stage;
        switch (this._curStage){
            case 1:
                stage = "Maldives";
                break;
            case 2:
                stage = "Hawaii";
                break;
            default:
                stage = "Err";
        }

        wrapper.logEvent("Stage", "Select", stage, this._curStage);

        this._adMobBannerProcessType = kNoAdBanner;
        this._retainedResArray = [];

        // 加勒比海场景 武器初始化为10级
        if (le == 3) {
            PlayerActor.sharedActor().setCurWeaponLevel(FishWeaponType.eWeaponLevel10);
        }


        wrapper.getBooleanForKey("AskEnterLecel3", false);
        this._movePoint = new cc.Point(0, 0);
        this._sessionsNeedLoad = [];
        this._sessionControllers = [];
        this._sessionsEnded = [];
        this._allGameObjects = {};
        this._aliveActor = [];
        this._retainedResArray = [];
        this._shootPosList = []

        GameManager.initialise(this);

    },

    getLayer:function () {
        return this._layer;
    },
    getTouchLayer:function () {
        return this._touchLayer;
    },
    setTouchLayer:function (v) {
        this._touchLayer = v;
    },
    getOddsNumber:function () {
        return this._oddsNumber;
    },
    setOddsNumber:function (v) {
        this._oddsNumber = v;
    },
    getControlChesh:function () {
        return this._controlChesh;
    },
    setControlChesh:function (v) {
        this._controlChesh = v;
    },
    getChest_FishID:function () {
        return this._chest_FishID;
    },
    setChest_FishID:function (v) {
        this._chest_FishID = v;
    },
    getAchievementShowNum:function () {
        return this._achievementShowNum;
    },
    setAchievementShowNum:function (v) {
        this._achievementShowNum = v;
    },
    getIsPause:function () {
        return this._isPause;
    },
    setIsPause:function (v) {
        this._isPause = v;
    },
    getGameover:function () {
        return this._gameover;
    },
    setGameover:function (v) {
        this._gameover = v;
    },
    getCurStage:function () {
        return this._curStage;
    },
    setCurStage:function (v) {
        this._curStage = v;
    },
    getCannonActor:function () {
        return this._cannonActor;
    },
    setCannonActor:function (v) {
        this._cannonActor = v;
    },
    getAddPrizeGroup:function () {
        return this._addPrizeGroup;
    },
    setAddPrizeGroup:function (v) {
        this._addPrizeGroup = v;
    },
    getPlayTutorial:function () {
        return this._playTutorial;
    },
    setPlayTutorial:function (v) {
        this._playTutorial = v;
    },
    getPastTime:function () {
        return this._pastTime;
    },
    setPastTime:function (v) {
        this._pastTime = v;
    },
    getCanSendBullet:function () {
        return this._canSendBullet;
    },
    setCanSendBullet:function (v) {
        this._canSendBullet = v;
    },
    getTimeScale:function () {
        return this._timeScale;
    },
    setTimeScale:function (v) {
        this._timeScale = v;
    },
    getChestGameLayer:function () {
        return this._chestGameLayer;
    },
    setChestGameLayer:function (v) {
        this._chestGameLayer = v;
    },
    getCompactUserInfo:function () {
        return this._compactUserInfo;
    },
    setCompactUserInfo:function (v) {
        this._compactUserInfo = v;
    },
    getMessageCenter:function () {
        return this._messageCenter;
    },
    setMessageCenter:function (v) {
        this._messageCenter = v;
    },
    getPrizeSprite:function () {
        return this._prizeSprite;
    },
    setPrizeSprite:function (v) {
        this._prizeSprite = v;
    },
    getTestPlistName:function () {
        return this._testPlistName;
    },
    setTestPlistName:function (name) {
        this._testPlistName = name;
    },
    getShootPosList:function () {
        return this._shootPosList;
    },
    removeActora:function (actor) {
        actor.removeSelfFromScene();
        ActorFactory.returnActor(actor);
    },
    startAction:function () {
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(ImageName("jinbi.plist"));
        var rotateBy1 = new cc.RotateBy(1.4 * 25, 360);
        var repeat1 = new cc.Repeat(rotateBy1, 20);
        this._prizeSprite.getChildByTag(kTagPrizeLight1).runAction(cc.Sequence.create(repeat1));

        var rotateBy2 = new cc.RotateBy(12.5, 360);
        var repeat2 = new cc.Repeat(rotateBy2, 20);
        this._prizeSprite.getChildByTag(kTagPrizeLight2).runAction(cc.Sequence.create(repeat2));

        for (var j = 0; j < 2; ++j) {
            for (var i = 0; i < 5; ++i) {
                var guang3 = new cc.Sprite("#shark_prize_guang_11.png");
                guang3.setOpacity(0);
                var size = VisibleRect.rect();
                guang3.setPosition(cc.p(size.width / 2 - 39 + i * 19, size.height / 2 + 27 - j * 48));
                this._prizeSprite.addChild(guang3, kTagPrizeLight3, kTagPrizeLight3 + (j + 1) * (i + 1));
                var rotateBy3 = new cc.RotateBy(3, 360);
                var repeat3 = new cc.Repeat(rotateBy3, 60);
                var fadeIn = new cc.FadeIn(0.7);
                var fadeOut = new cc.FadeOut(0.5);
                var delayTime = new cc.DelayTime(0.5);
                var twinkle = new cc.Sequence(fadeIn, delayTime, fadeOut);
                var twinkle1 = new cc.Repeat(twinkle, 20);
                var spawn = new cc.Spawn(repeat3, twinkle1);
                guang3.runAction(new cc.Sequence(spawn));

            } // for
        } // for

        var pos = [
            cc.p(screenWidth / 2, screenHeight / 2 + 140),
            cc.p(screenWidth / 2 - 135, screenHeight / 2 + 210),
            cc.p(screenWidth / 2 + 90, screenHeight / 2 + 210),
            cc.p(screenWidth / 2 - 200, screenHeight / 2 + 100),
            cc.p(screenWidth / 2 + 180, screenHeight / 2 + 100)
        ];

        for (var i = 0; i < 5; ++i) {
            var guang4 = new cc.Sprite("#shark_prize_guang_12.png");
            guang4.setAnchorPoint(cc.p(0.5, 0.5));
            guang4.setOpacity(0);
            guang4.setPosition(pos[i]);
            this._prizeSprite.addChild(guang4, kTagPrizeLight4, kTagPrizeLight4 + i);

            var time = (Math.random() % 20 + 2) * 0.1;
            var delayTime1 = new cc.DelayTime(time);
            var fadeTo = new cc.FadeTo(0.5, 255);
            var fadeOut = new cc.FadeOut(0.3);
            var delayTime2 = new cc.DelayTime(0.5);
            var twinkle = new cc.Sequence(delayTime1, fadeTo, delayTime2, fadeOut);
            var twinkle1 = new cc.Repeat(twinkle, 20);
            guang4.runAction(new cc.Sequence(twinkle1));
        } // for


        var framesArray = [];
        var frame = frameCache.getSpriteFrame("#shark_prize_bg_1.png");
        framesArray.push(frame);
        frame = frameCache.getSpriteFrame("#shark_prize_bg_2.png");
        framesArray.push(frame);
        frame = frameCache.getSpriteFrame("#shark_prize_bg_3.png");
        framesArray.push(frame);
        var animation2 = new cc.Animation(framesArray, 0.15);
        var ac2 = cc.animate(animation2).repeat(11);
        this._prizeSprite.getChildByTag(kTagPrizeBG).runAction(cc.sequence(ac2, new cc.CallFunc(this.removeNihongDeng, this)));
    },
    removeNihongDeng:function (sender) {
        this._bigPrizeExist = false;
        this.removeChildByTag(999, true);
        this._prizeSprite.removeAllChildrenWithCleanup(true);
        this.removeChildByTag(kTagPrizeSprite, true);
    },
    removeSprite:function (sender) {
        sender.removeFromParentAndCleanup(true);
    },
    addChangeWeaponMenu:function (menuPos, bltPos) {
        this.addChangeWeaponMenu(cc.p(301, 10), cc.p(17, 17));

        var menuItem = new cc.MenuItem(this, this.changeWeapon);
        menuItem.setContentSize(new cc.Size(80, 50));
        var menu = new cc.Menu(menuItem, null);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 109);
        menuItem.setPosition(menuPos);
    },
    initCannon:function (cannonPos) {

    },
    coinsAnimation:function (val) {
        if (this._bigPrizeExist) {
            return;
        }
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(ImageName("jinbi.plist"));
        playEffect(COIN_EFFECT3);

        this._bigPrizeExist = true;

        var guang1 = new cc.Sprite("#shark_prize_guang_21.png");
        this._prizeSprite.addChild(guang1, kTagPrizeLight1, kTagPrizeLight1);
        guang1.setPosition(cc.p(0, 0));

        var guang2 = new cc.Sprite("#shark_prize_guang_22.png");
        this._prizeSprite.addChild(guang2, kTagPrizeLight2, kTagPrizeLight2);
        guang2.setPosition(cc.p(0, 0));

        var sharkePrize = new cc.Sprite("#shark_prize_bg_1.png");
        this._prizeSprite.addChild(sharkePrize, kTagPrizeBG, kTagPrizeBG);
        sharkePrize.setPosition(cc.p(0, 0));

        var notice = new cc.Sprite("#" + ImageNameLang("shark_prize_notice.png", true));
        notice.setPosition(cc.p(0, (sharkePrize.getContentSize().height + notice.getContentSize().height) / 2));
        this._prizeSprite.addChild(notice, kTagPrizeNOTICE, kTagPrizeNOTICE);

        var labelNum = new cc.LabelAtlas(100, ImageName("shark_prize_num.png"), 56, 84, '0');
        labelNum.setAnchorPoint(cc.p(0.5, 0.5));
        labelNum.setPosition(cc.p(0, 0));
        this._prizeSprite.addChild(labelNum, kTagPrizeLABEL, kTagPrizeLABEL);

        this.addChild(this._prizeSprite, kTagPrizeSprite, kTagPrizeSprite);
        this._prizeSprite.setScale(0);

        this._prizeSprite.runAction(new cc.Sequence(new cc.ScaleTo(0.2, 1.1, 1.1), new cc.ScaleTo(0.1, 1, 1),
            new cc.CallFunc(this.startAction, this)));
    },
    loadFishGroup:function () {
        this._dictionaryFish = cc.loader.getRes(ImageName("TrackPlist/Track.plist"));
    },
    addFishGroupForPlayTutorial:function (fishIdx, startPos) {

    },
    removeActoraCaller:function () {
        this._bigPrizeExist = false;
        if (this._removeActoraParam != null) {
            //KingFisher cc.log("-------removeActoraCaller, param = " + this._removeActoraParam);
            this.removeActora(this._removeActoraParam);
        }
        cc.director.getScheduler().unschedule(this.removeActoraCaller, this);
    },
    BigPrize:function () {
        if (this._bigPrizeExist) {
            return;
        }

        var big = ActorFactory.create("BigPrizeActor");
        big.setLocalZOrder(BulletActorZValue + 10);
        big.setPosition(VisibleRect.center());
        big.replayAction();
        this.addActor(big);
        this.removeActoraCaller(0);
        this._removeActoraParam = big;
        //KingFisher cc.log("BigPrize, param = "+ this._removeActoraParam);
        this._bigPrizeExist = true;
        cc.director.getScheduler().schedule(this.removeActoraCaller, this, 5.0, false);
    },
    initMusicPlay:function () {
        // this._itemMusicPlayer = cc.MenuItemSprite.create(
        //     new cc.Sprite(("#ui_button_music_1.png")),
        //     new cc.Sprite(("#ui_button_music_2.png")),
        //     this, this.changeMusic);

        //Pause button
        this._itemPause = new cc.MenuItemSprite(
            new cc.Sprite("#ui_button_01.png"),
            new cc.Sprite("#ui_button_02.png"),
            this.pauseGame, this );

        // this._itemMusicPlayer.setPosition(cc.p(VisibleRect.topLeft().x + 125, VisibleRect.topLeft().y - this._itemPause.getContentSize().height / 2));
        this._itemPause.setPosition(cc.p(VisibleRect.topLeft().x + 45, VisibleRect.topLeft().y - this._itemPause.getContentSize().height / 2));


        this._userBtn = new cc.Menu(this._itemPause/*, this._itemMusicPlayer*/);
        this.addChild(this._userBtn, 101);

        var pos = cc.p(VisibleRect.topLeft().x + 135, VisibleRect.topLeft().y - this._itemPause.getContentSize().height / 2);
        this._userBtn.setPosition(0, 0);
    },

    planMoveIn:function () {

    },
    planMoveOut:function () {

    },
    moveInComplete:function (sender) {

    },
    moveOutComplete:function (sender) {

    },
    backToMenu:function (object) {
        this.clearGameResource();
        GameCtrl.sharedGame().home();
    },
    backToSelect:function () {
        this.clearGameResource();
        GameCtrl.sharedGame().homeWithStage();
    },
    clearGameResource:function () {
        // 停掉所有的定时器
        cc.director.getScheduler().unscheduleAllForTarget(this);
        this.stopAllActions();
        if (this._cannonActor) {
            cc.director.getScheduler().unscheduleAllForTarget(this._cannonActor);
        }

        // 隐藏广告条
        AdsController.forceHideBannerAd();

        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JindunPlist);
        this._gameover = true;

        if (this._backgroundLayer != null) {
            this._backgroundLayer.removeAllChildrenWithCleanup(true);
            this._backgroundLayer.removeFromParentAndCleanup(true);
        }

        if (this._blurBackgroundLayer != null) {
            this._blurBackgroundLayer.removeAllChildrenWithCleanup(true);
            this._blurBackgroundLayer.removeFromParentAndCleanup(true);
        }

        if (this._scoreBar != null) {
            this._scoreBar.removeAllChildrenWithCleanup(true);
            this._scoreBar.removeFromParentAndCleanup(true);
        }

        if (this._userInfoLayer != null) {
            this._userInfoLayer.removeAllChildrenWithCleanup(true);
            this._userInfoLayer.removeFromParentAndCleanup(true);
        }

        if (this._processsprite != null) {
            this._processsprite.setUpdatebySelf(false);
        }

        this.removeAllActor();

        ActorFactory.cleanAllRes();

        if (this.getSPSceneType() == this.eGameScene && wrapper.getBooleanForKey(kTutorialPlayed)) {
            PlayerActor.sharedActor().saveStateToCoredate();
        }

        PlayerActor.sharedActor().setScene(null);
        this.removeAllChildrenWithCleanup(true);

        PlayerActor.sharedActor().cleanStageGain();
        PlayerActor.sharedActor().submitAchievement(0.0);
        PlayerActor.sharedActor().reportHighScore();

        // disable the SPSwipe
        //SPControl.sharedControl().setEnable(false);
        //FishFactoryManager.purgeFactoryManager();
    },
    isStarted:function () {
        return this._isPause;
    },
    setupHtpMap:function () {

    },
    addGameOverLayer:function () {

    },
    continuegame:function () {

    },
    resumeGame:function () {
        this.removeBlurBG();
        this.removeChildByTag(kTagMenuPause, true);

        if (this._cannonActor) {
            cc.director.getScheduler().resumeTarget(this._cannonActor.getCurrentWeapon());
        }
    },
    removeBlurBG:function () {
        this._isPause = false;

        if (null != this._cannonActor) {
            this._cannonActor.setWeaponButtonEnable(true);
        }

        this._blurBackgroundLayer.runAction(cc.sequence(cc.fadeOut(0.8), cc.callFunc(this.removeSprite, this)));
        this._blurBackgroundLayer = null;
    },
    pauseGameBG:function (bgPos) {
        if (this._isPause || this._gameover) {
            return;
        }

        this._isPause = true;

        if (this._cannonActor) {
            this._cannonActor.setWeaponButtonEnable(false);
        }
        playEffect(BUTTON_EFFECT);
        var blurImageName = "bgblur0" + this._backgroundLayer.getBgIdx() + "_01.jpg";
        this._blurBackgroundLayer = new cc.Sprite(ImageName(blurImageName));
        this._blurBackgroundLayer.runAction(new cc.FadeIn(0.6));
        this._blurBackgroundLayer.setPosition(bgPos);
        this._blurBackgroundLayer.setScale(Multiple);
        this.getLayer().addChild(this._blurBackgroundLayer, 150);
    },
    pauseGameForShop:function () {
        if (this._isPause || this._gameover || this._playTutorial) {
            return;
        }

        this._isPause = true;
        this.cleanBannerAd();

        if (this._cannonActor) {
            this._cannonActor.setWeaponButtonEnable(false);
        }
        playEffect(BUTTON_EFFECT);
        var blurImageName = "bgblur0" + this._backgroundLayer.getBgIdx() + "_01.jpg";
        this._blurBackgroundLayer = new cc.Sprite(ImageName(blurImageName));
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._blurBackgroundLayer.runAction(new cc.FadeIn(0.6));
        this._blurBackgroundLayer.setPosition(VisibleRect.center());
        this._blurBackgroundLayer.setScale(Multiple);
        this.getLayer().addChild(this._blurBackgroundLayer);

        if (this._cannonActor) {
            cc.director.getScheduler().pauseTarget(this._cannonActor.getCurrentWeapon());
        }
    },
    getActors:function (groupTag) {
        var tArray = [];
        var iter = this._allGameObjects[groupTag];
        if (!iter) {
            this._allGameObjects[groupTag] = tArray;
        }
        return iter || tArray;
    },
    load:function (string, info) {

    },
    save:function (string, info) {

    },
    addScore:function (score) {

    },
    changeWeapon:function (sender) {
        playEffect(BUTTON_EFFECT);
        var playerActor = PlayerActor.sharedActor();
        playerActor.changeWeapon();
    },
    changeBackground:function () {

    },
    shootBulletTo:function (pos) {
        if (this._playTutorial && this._showHint) {
            return;
        }

        if (PlayerActor.sharedActor().canSendWeapon()) {
            if (!this._isPause) {
                if (this._cannonActor) {
                    // this._cannonActor.shootTo(pos);
                }

                this._shootCount++;
                // this._scoreBar.setBullet(PlayerActor.sharedActor().getPlayerMoney());

                if (0 == PlayerActor.sharedActor().getPlayerMoney() &&
                    this.getCannonActor().getCurrentWeapon().getCannonLevel() < 8) {
                    //Nacson 金币数量为0时的时间点
                    //ApparkDataManagerWrapper.logEvent(USERLOG_MONEY_NOT_ENOUGH, 0);
                }
            }
        }
        else {
            var nMoney = PlayerActor.sharedActor().getPlayerMoney();
            if (0 == nMoney) {
                //添加关于金币不够的提示
                playEffect(kBGM_RUNOUTBULLET);
            }
            else {
                playEffect(BUTTON_EFFECT);
                // 将大炮换为与玩家金钱相等的等级
                if (this._cannonActor) {
                    var changeToLevel = parseInt(nMoney / GameCtrl.sharedGame().getCurScene().getOddsNumber());
                    if (changeToLevel == 8 || changeToLevel == 9)
                        changeToLevel = 7;
                    this._cannonActor.performCannonSwitch(changeToLevel);
                }
            }
        }
    },
    saveState:function () {
        GamePreference.getInstance().loadSoftPref();
        GamePreference.getInstance().setHaveSaveData(true);
        GamePreference.getInstance().updateSoftPref();
    },
    removeAllBullet:function () {

    },
    removeTitle:function () {
        this.getChildByTag(kLogeWaveTag).runAction(
            cc.sequence(cc.moveBy(1, cc.p(0, 1000)), cc.callFunc(this.removeLogoWave, this)));
    },
    removeLogoWave:function (node) {
        this.removeChildByTag(kLogeWaveTag, true);
    },
    removeTipLayer:function (sender) {
        PlayerActor.sharedActor().setPlayerMoney(600);
        this.removeChildByTag(kTagMenuStart, true);
        this.removeChildByTag(kTagMenuTip, true);
    },
    addPurchaseTip:function () {
        var leveupSprite = cc.Sprite.create(ImageNameLang("quanpingtishi.png"));
        leveupSprite.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y - 50));
        this.addChild(leveupSprite, 100);

        var spawn = cc.spawn(
            cc.sequence(cc.fadeIn(0.6), cc.delayTime(0.6), cc.fadeOut(0.6)),
            cc.moveBy(1.8, cc.p(0, 180)));

        leveupSprite.runAction(cc.sequence(spawn,
            cc.callFunc(this.addPrizeNets, this), cc.callFunc(this.removeSprite, this)));
    },
    addActor:function (actor) {
        this.addActorIntoAllObjects(actor);
        this._aliveActor.push(actor);
        actor.setScene(this);
        if (actor && !actor.getParent()) {
            this.getLayer().addChild(actor, actor.getZOrder());
        }
    },
    removeActor:function (actor) {
        if (actor) {
            this.getLayer().removeChild(actor, true);
        }

        //this._aliveActor = cc.ArrayRemoveObject(this._aliveActor, actor);
        cc.arrayRemoveObject(this._aliveActor, actor);

        this.removeActorFromAllObjects(actor);
    },

    addActorIntoAllObjects:function (actor) {
        var ret = false;
        var AGroup = actor._group;
        if (!this._allGameObjects[AGroup]) {
            this._allGameObjects[AGroup] = [];
        }
        else {
            for (var i = 0; i < this._allGameObjects[AGroup].length; i++) {
                if (actor == this._allGameObjects[AGroup][i]) {
                    ret = true;
                }
            }
        }
        if (!ret) {
            this._allGameObjects[AGroup].push(actor);
        }
    },

    removeActorFromAllObjects:function (actor) {
        var AGroup = actor._group;
        for (var i = 0; i < this._allGameObjects[AGroup].length; i++) {
            if (actor == this._allGameObjects[AGroup][i]) {
                this._allGameObjects[AGroup].splice(i, 1);
                return;
            }
        }
        cc.assert(0, "can not find actor array!");
    },
    removeAllActor:function () {
        var i;
        var chest;
        var groupFishActor = this.getActors(GroupFishActor);
        for (i = groupFishActor.length - 1; i >= 0; i--) {
            var fish = groupFishActor[i];
            fish.setUpdatebySelf(false);
            fish.removeSelfFromScene();
        }

        var groupGoldPrizeActor = this.getActors(GroupGoldPrizeActor);
        for (i = groupGoldPrizeActor.length - 1; i >= 0; i--) {
            var goldPrizeActor = groupGoldPrizeActor[i];
            goldPrizeActor.setUpdatebySelf(false);
            goldPrizeActor.removeSelfFromScene();
        }

        var groupBigGoldPrizeActor = this.getActors(GroupBigGoldPrizeActor);
        for (i = groupBigGoldPrizeActor.length - 1; i >= 0; i--) {
            var bigPrizeActor = groupBigGoldPrizeActor[i];
            bigPrizeActor.setUpdatebySelf(false);
            bigPrizeActor.removeSelfFromScene();
        }

        var groupFishNetActor = this.getActors(GroupFishNetActor);
        for (i = groupFishNetActor.length - 1; i >= 0; i--) {
            var fishNetActor = groupFishNetActor[i];
            fishNetActor.setUpdatebySelf(false);
            fishNetActor.removeSelfFromScene();
        }

        var groupHeroBullet = this.getActors(GroupHeroBullet);
        for (i = groupHeroBullet.length - 1; i >= 0; i--) {
            var bulletActor = groupHeroBullet[i];
            bulletActor.setUpdatebySelf(false);
            bulletActor.removeSelfFromScene();
        }

        var groupChestActor = this.getActors(GroupChestActor);
        for (i = groupChestActor.length - 1; i >= 0; i--) {
            chest = groupChestActor[i];
            chest.setUpdatebySelf(false);
            chest.removeSelfFromScene();
        }

        var groupMaxChestActor = this.getActors(GroupMaxChestActor);
        for (i = groupMaxChestActor.length - 1; i >= 0; i--) {
            chest = groupMaxChestActor[i];
            chest.setUpdatebySelf(false);
            chest.removeSelfFromScene();
        }

        var groupStarFishActor = this.getActors(GroupStarfishActor);
        for (i = groupStarFishActor.length - 1; i >= 0; i--) {
            var star = groupStarFishActor[i];
            star.setUpdatebySelf(false);
            star.removeSelfFromScene();
        }
        // 将移除霓虹灯的定时器停止掉
        cc.director.getScheduler().unschedule(this.removeActoraCaller, this);
    },
    hideAllMenu:function () {
        if (this._cannonActor.getCurrentWeaponLevel() < FishWeaponType.eWeaponLevel8) {
            this._cannonActor.setWeaponButtonEnable(false);
        }
        this._isShowAllMenu = false;
        this._scoreBar.setVisible(false);
        this._userInfoLayer.setVisible(false);
        this._camera.setVisible(false);
        this._cannonActor.setWeaponVisible(false);
        if (this._userBtn) {
            this._userBtn.setVisible(false);
        }
        this.getChildByTag(kUIAdvertisement).setVisible(false);
    },
    showAllMenu:function () {
        if (this._cannonActor.getCurrentWeaponLevel() < FishWeaponType.eWeaponLevel8) {
            this._cannonActor.setWeaponButtonEnable(true);
        }
        this._isShowAllMenu = true;
        this._scoreBar.setVisible(true);
        this._userInfoLayer.setVisible(true);
        this._camera.setVisible(true);
        this._cannonActor.setWeaponVisible(true);
        if (this._userBtn) {
            this._userBtn.setVisible(true);
        }
        this.getChildByTag(kUIAdvertisement).setVisible(true);
    },
    cleanBannerAd:function () {

    },
    loadCannon:function () {
        // this._testCannonManager = CannonManager;
        // GameManager.initialise(this);
        // this._testCannon = new CannonView(this,{x:300, y:300} );
        // this.addChild(CannonManager);
        // this._cannonActor = new WeaponManager(cc.pAdd(VisibleRect.bottom(), cc.p(0, 50)), 0.0, this);
    },
    updateTutorial:function (dt) {
        var showBuyItem = GameSetting.getInstance().getShowBuyItem() && this.getChildByTag(999);
        if (!showBuyItem) {
            if (this.getChildByTag(999)) {
                this.removeChildByTag(999, true);
            }
        }

        if (this._shootPosList.length != 0) {
            var pos = this._shootPosList[0];
            this.shootBulletTo(pos);
            this._shootPosList.shift();
        }
        if (!this._canSendBullet) {
            this._pastTime += dt;
        }
        if (this._pastTime >= GameSetting.getInstance().getShootInterval() && !this._canSendBullet) {
            this._pastTime = 0.0;
            this._canSendBullet = true;
        }

        var groupGoldPrizeActor = this.getActors(GroupGoldPrizeActor);
        for (var i = 0; i < groupGoldPrizeActor.length; i++) {
            groupGoldPrizeActor[i].update(dt);
        }

        this.updateAllSessions(dt);
    },
    controlNewPosition:function (control, pos, yPos) {
        if (this._chestGameLayer && this._chestGameLayer.chestControl(control, pos)) {
            return;
        }

        if (this._tutorialSessionController) {
            this._tutorialSessionController.controlNewPosition(control, pos);
        }

        /* for (var i = 0; i < this._sessionControllers.length; i++) {
         var sessionController = this._sessionControllers[i];
         if (sessionController) {
         sessionController.controlNewPosition(control, pos);
         }
         }*/

        if (this._isPause) {
            return;
        }

        if (!this._isShowAllMenu) {
            this.showAllMenu();
            return;
        }

        if (pos.y <= yPos) {
            return;
        }

        this._movePoint = pos;

        if (this._canSendBullet) {
            this._shootPosList.push(pos);
            this._canSendBullet = false;
        }

        if (this._cannonActor) {
            this._cannonActor.updateWeaponDirection(pos);
        }
    },
    controlDPad:function (control, pos) {
        if (this.getIsPause()) {
            return;
        }

        if (this._cannonActor)
            this._cannonActor.updateWeaponDirection(pos);
    },
    updateLogic:function () {

    },
    controlEndPosition:function (control, pos) {
    },
    isPlayingGameMainSessionController:function () {
        return this._isPLayGameMainSessionController;
    },
    isGameMainSessionControllerEndInThirtySceond:function () {
        return true;
    },
    changeCtrl:function (type) {
        if (type == SPControlTypeUnknow) {
            type = SPControlTypeSwip;
        }

        SPSceneWithSessionController.changeCtrl(type);
        SPControl.sharedControl().setDelegate(this);
    },
    DelChestScoreNumber:function (okPos, okZOrder) {
    },
    GoRandomOval:function (GoImage, movePos) {
    },
    playGetAchievement:function (index) {
        cc.assert(index < AchievementIndex.kAchieveMentCount, "Achievement index out of range");
        playEffect(ACH_EFFECT);

        var achieveLayer = new AchievementShareLayer();
        achieveLayer.initWithIndex(index, true);
        achieveLayer.setScale(0.4);
        this.addChild(achieveLayer, 200, kAchieveLayerTag);

        achieveLayer.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y + 50));

        var spawn = cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.2));
        var spawn1 = cc.spawn(cc.scaleTo(0.3, 0.1), cc.fadeOut(0.6), cc.moveTo(0.6, cc.p(VisibleRect.center().x, VisibleRect.top().y - 28)));

        var sequ = cc.sequence(spawn, cc.callFunc(this.addParticleAchieve, this), cc.delayTime(5.0), spawn1,
            cc.callFunc(this.removeParticelAchieve, this),
            cc.callFunc(this.removeSpriteChangeWeapon, this));
        achieveLayer.runAction(sequ);
        this._achievementShowNum++;
    },
    removeSpriteChangeWeapon:function (sender) {
        this._achievementShowNum--;
        sender.removeFromParentAndCleanup(true);
    },
    removeParticelAchieve:function (sender) {
        this.removeChildByTag(kAchieveParticleTag, true);
    },
    pauseGame:function () {
        if (this._isPause || this._gameover || this._playTutorial) {
            return;
        }

        this._isPause = true;
        this.cleanBannerAd();

        if (this._cannonActor) {
            this._cannonActor.setWeaponButtonEnable(false);
        }
        playEffect(BUTTON_EFFECT);
        var blurImageName = "bgblur0" + this._backgroundLayer.getBgIdx() + "_01.jpg";
        this._blurBackgroundLayer = new cc.Sprite(ImageName(blurImageName));
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._blurBackgroundLayer.runAction(new cc.FadeIn(0.6));
        this._blurBackgroundLayer.setPosition(VisibleRect.center());
        this._blurBackgroundLayer.setScale(Multiple);
        this.addChild(this._blurBackgroundLayer);

        this._pauseMenuLayer = PauseMenuLayer.create(this);
        this._pauseMenuLayer.setPosition(VisibleRect.bottom());
        this.addChild(this._pauseMenuLayer, 120, kTagMenuPause);

        if (this._cannonActor) {
            cc.director.getScheduler().pauseTarget(this._cannonActor.getCurrentWeapon());
        }
    },
    showGetMoneyLayer:function (spbPos) {
        this.showGetMoneyLayer(cc.p(19, 48));

        if (this._isPause) {
            return;
        }

        if (GameSetting.getInstance().getShowBuyItem()) {
            return;
        }

        var sprite = new cc.Sprite("guanghuan");
        var s = new cc.SpriteBatchNode(ImageName("guanghuan.png"));
        s.setPosition(spbPos);
        sprite.setAction(0);
        sprite.setUpdatebySelf(true);
        this._processsprite = sprite;

        this.addChild(s, 110, 999);
    },
    addPlayerMoney:function (p) {
        var point = p;
        PlayerActor.sharedActor().setLaserMoney(PlayerActor.sharedActor().getLaserMoney() * this.getOddsNumber());
        point = point * this.getOddsNumber();
        PlayerActor.sharedActor().setPlayerMoney(PlayerActor.sharedActor().getPlayerMoney() + point);
    },
    addPrizeNet:function (dt) {
        this._prizeNetCount += dt;
        if (this._prizeNetCount > 5) {
            this.unschedule(this.addPrizeNet);
            return;
        }
        var loops = (0 | (Math.random() * 4)) + 1;
        for (var i = 0; i < loops; i++) {
            var pos = cc.p((Math.random() * screenWidth), (Math.random() * screenHeight));
            var weapl = (0 | (Math.random() * 7)) + 1;

            var tmp = "FishNetActor" + weapl;
            var net = ActorFactory.create(tmp);

            var tempPar = null;
            if (weapl == FishWeaponType.eWeaponLevel5) {
                tempPar = particleSystemFactory.createParticle(res.lizibianhua1Plist);
                tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
                tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
            } else if (weapl == FishWeaponType.eWeaponLevel6) {
                tempPar = particleSystemFactory.createParticle(res.lizibianhua2Plist);
                tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
                tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
            } else if (weapl == FishWeaponType.eWeaponLevel7) {
                tempPar = particleSystemFactory.createParticle(res.lizibianhua3Plist);
                tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
                tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
            } else if (weapl == FishWeaponType.eWeaponLevel10) {
                tempPar = particleSystemFactory.createParticle(res.lizibianhua3Plist);
                tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
                tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
            } else {
                tempPar = particleSystemFactory.createParticle(res.yuwangliziPlist);
            }

            net.setParticle(tempPar);
            net.setGroup(GroupFishNetActor);
            net.resetState();
            net.updateInfo();
            net.setPosition(pos);
            net.setZOrder(BulletActorZValue);
            net.playCatchAction();
            tempPar.setPosition(pos);

            this.addActor(net);
            this.addChild(tempPar, BulletActorZValue + 1, PrizeNetPar_Tag + i);
        }
        var that = this;
        this.schedule(function () {
            that.addPrizeNet(dt)
        }, 0.2, false);
        //this._prizeNetCount = 0.0;
    },
    getGameCenterGCHelper:function () {
        return false;
    },
    levelUp:function (spritePos, duration, delayDuration) {
        //this.levelUp(cc.p(VisibleRect.center().x, VisibleRect.center().y - 25), 1.2, 1.2);

        spritePos = cc.p(VisibleRect.center().x, VisibleRect.center().y - 25);
        duration = 1.2;
        delayDuration = 1.2;
        this.addPrizeNets(null);
        var levelupSprite = new cc.Sprite(ImageNameLang("ui_main_LV.png"));
        levelupSprite.setPosition(spritePos);
        this.addChild(levelupSprite, 100);

        var sequ = new cc.Sequence(new cc.FadeIn(0.6), new cc.DelayTime(delayDuration), new cc.FadeOut(0.6));
        var spawn = new cc.Spawn(sequ, new cc.MoveBy(duration, cc.p(0, 50)));

        levelupSprite.runAction(cc.sequence(spawn, new cc.CallFunc(this.removeSprite, this)));

        // 升级为10级的时候 提示进入新地图
        /*if (10 == PlayerActor.sharedActor().getPlayerLevel()) {
         this._enterNewLayer = new TutorialConfirmLayer();
         this._enterNewLayer.initWithTitle(null, cc.LocalizedString.localizedString("newscene"),
         ImageName("ui_teach_002.png"), ImageName("btn_teach_001.png"), ImageName("btn_teach_002.png"),
         cc.LocalizedString.localizedString("newscene enter"),
         cc.LocalizedString.localizedString("Tutorial Text Cancel"), this,
         this.EnterSceneSelect,
         this.cancelEnterSceneSelect);
         this.addChild(this._enterNewLayer, 120);
         this._enterNewLayer.show();
         wrapper.setBooleanForKey("AskByTurnHere", true);
         }*/
    },
    updateUI:function (dt, parPos, addPos) {
        if (!parPos) {
            parPos = cc.pAdd(VisibleRect.bottom(), cc.p(-145, 5));
        }
        if (!addPos) {
            addPos = cc.pAdd(VisibleRect.bottom(), cc.p(-145, 5));
        }

        /* if (this._messageCenter == false) {
         if (kAdBannerMoveIn == this._adMobBannerProcessType) {
         this.prepaireAdMobPostionMove();
         }
         else if (kAdBannerMoveInDelay == this._adMobBannerProcessType) {
         this._delayTimeCount += dt;
         if (this._delayTimeCount >= BANNER_UI_MOVEDELAY) {
         this.moveAdMobBanner(true);
         }
         }
         else if (kAdBannerMoveOut == this._adMobBannerProcessType) {
         this.moveAdMobBanner(false);
         }
         else if (kAdBannerMoveOutDelay == this._adMobBannerProcessType) {
         this._delayTimeCount += dt;
         if (this._delayTimeCount >= BANNER_UI_MOVEDELAY) {
         this._adMobBannerProcessType = kAdBannerRestoreUI;
         this._delayTimeCount = 0;
         }
         }
         else if (kAdBannerRestoreUI == this._adMobBannerProcessType) {
         this.finishedAdMobMove();
         }
         }
         else {
         this.finishedAdMobMove();
         }*/

        // 显示广告条的逻辑
        this._timeAdMob += dt;
        if (!this._playTutorial && ((this._firstInGame && this._timeAdMob >= 30) || (this._timeAdMob >= AD_INTERVEL))) {
            this._firstInGame = false;
            this._timeAdMob = 0;
        }

        if ((this._curStage == 1 && PlayerActor.sharedActor().getPlayerMoney() == 0) ||
            (this._curStage == 2 && PlayerActor.sharedActor().getPlayerMoney() < 2) ||
            (this._curStage == 3 && PlayerActor.sharedActor().getPlayerMoney() < 50)) {
            if (this._playTutorial && PlayerActor.sharedActor().GetBOnTutorial()) {// 教程中，玩家金币为0了，恢复为200金币
                wrapper.setIntegerForKey(kOldLaserNum, 0);
                PlayerActor.sharedActor().setPlayerMoney(GameSetting.getInstance().getPlayerMoney());
            }
        }

        // this._scoreBar.backToNormal();

        // if (PlayerActor.sharedActor().getPlayerMoney() <= 50 * this.getOddsNumber()) {
        //     this._scoreBar.moneyNotEnough();
        // }
        // else if (PlayerActor.sharedActor().getPlayerMoney() <= 100 * this.getOddsNumber()) {
        //     this._scoreBar.moneyIsEnough();
        //     this._scoreBar.setIsLessThan150(false);
        //     this._scoreBar.showNotEnough();
        //     this._scoreBar.setIsLessThan100(true);
        // }
        // else if (PlayerActor.sharedActor().getPlayerMoney() <= 150 * this.getOddsNumber()) {
        //     this._scoreBar.showNotEnough();
        //     this._scoreBar.setIsLessThan150(true);
        //     this._scoreBar.setIsLessThan100(false);
        // }
        // else {
        //     // this._scoreBar.moneyIsEnough();
        //     // this._scoreBar.setIsLessThan150(false);
        //     // this._scoreBar.setIsLessThan100(false);
        // }

        PlayerActor.sharedActor().update(dt);
        // if (/*this._playTutorial || */PlayerActor.sharedActor().getPlayerMoney() >= GameSetting.getInstance().getPlayerMoney()) {
        //     this._scoreBar.setDownTime(PlayerActor.sharedActor().getAddCoinNeedTime());
        //     PlayerActor.sharedActor().setAddCoinTime(0);
        // }
        // else {
        //     var time = parseInt(PlayerActor.sharedActor().getAddCoinNeedTime() - PlayerActor.sharedActor().getAddCoinTime());
        //     this._scoreBar.setDownTime(time);
        // }

        if (PlayerActor.sharedActor().getNeedAddCoin()) {
            this.removeChildByTag(kAddCoidParticleTag, true);
            var par = particleSystemFactory.createParticle(ImageName("addCoin.plist"));
            this.addChild(par, 111, kAddCoidParticleTag);
            par.setPosition(parPos);

            var add = new cc.Sprite("#add5.png");
            add.setPosition(addPos);

            var sequ = cc.sequence(cc.fadeIn(0.35), cc.delayTime(0.35), cc.fadeOut(0.35));
            var spawn = cc.spawn(sequ, cc.moveBy(1.05, cc.p(0, 48)));

            add.runAction(cc.sequence(spawn, cc.callFunc(this.removeSprite, this)));
            this.addChild(add, 111);
            PlayerActor.sharedActor().setNeedAddCoin(false);
        }

        // this._userInfoLayer.updateUserInfo();
        this._compactUserInfo.updateUserInfo();
        // this._scoreBar.setLightValue(-60.0 + 115.0 * PlayerActor.sharedActor().getNormalGain() / (GameSetting.getInstance().getNormalCoinCount() * this.getOddsNumber()));
        // if (this._scoreBar.getLightValue() >= 55)
        //     this._scoreBar.setLightValue(-60);
        // this._scoreBar.getLightBlood().setRotation(this._scoreBar.getLightValue());
        //
        // this._scoreBar.setBullet(PlayerActor.sharedActor().getPlayerMoney());

        var useLaser = wrapper.getIntegerForKey(kUseLaser);
        // var isUseSpecialWeapon = this.getCannonActor().getIsChangeToSpecialWeapon();

        // if ((useLaser == 1 || PlayerActor.sharedActor().getNormalGain() >= GameSetting.getInstance().getNormalCoinCount() * this.getOddsNumber()) && !isUseSpecialWeapon) {
        //     var curSpecialWeapon = wrapper.getIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY);
        //     this._scoreBar.superWeaponChanged();
        //     this.getCannonActor().changeToSpecialWeapon(curSpecialWeapon);
        //
        //     if (useLaser == 1) {
        //         wrapper.setIntegerForKey(kUseLaser, 2);
        //     }
        // }


    },
    finishedAdMobMove:function () {

    },
    addPrizeFishGroup:function (bLeft) {
        this._time = 0;
        sino.fishGroup.setInitPoint(startPos);
        sino.fishGroup.createPrizeFishGroup(bLeft);
    },
    addFishGroup:function (startPos, delay) {
    },
    nextTutorial:function () {
    },
    _playTutorialHint:function (p, move) {
    },
    stopAddPrizeGroup:function () {
        this._addPrizeGroup = false;
        this._prepareNextWave = false;
        this._addPrizeFlag = 0;
        this.cleanFishRes();
        this.startNextWave();
    },
    nextWave:function () {
        this._preparingNextWave = true;
        this._accTimer = 0;
        this._timeScale = 1;
        this._time = this._maxTime;
        this._curWaveTime = 0;

        this._backgroundLayer.transition();
        this._addPrizeGroup = true;
    },
    initBgLayer:function () {
        this._backgroundLayer = new GameBackgroundLayer(this._curStage);
        this.addChild(this._backgroundLayer, -1, kBackGoundLayerTag);
    },
    loadScoreLayer:function () {
        this._shootCount = 0;
        this._controlChesh = false;
        this._achievementShowNum = 0;

        // this._scoreBar = new ScoreBarLayer();

        // this._scoreBar.setDelegate(this);
        // this.addChild(this._scoreBar, 109);
        var useLaser = wrapper.getIntegerForKey(kUseLaser);
        if (useLaser == 2 || useLaser == 3) {
            wrapper.setIntegerForKey(kUseLaser, 0);
        }

        // this._scoreBar.setBullet(PlayerActor.sharedActor().getPlayerMoney());
        // this._scoreBar.setAnchorPoint(AnchorPointBottom);
        // this._scoreBar.setPosition(VisibleRect.bottom());
    },
    loadUserInfoLayer:function () {
        // this._userInfoLayer = UserInfoLayer.create(this);
        // this._userInfoLayer.setDelegate(this);
        // this.addChild(this._userInfoLayer, 10);
        // this._userInfoLayer.setPosition(0, 0);
    },
    initChestGameLayer:function () {
        this._chestGameLayer = ChestGameLayer.create();
        this._chestGameLayer.initLayer(this);
        this.addChild(this._chestGameLayer, 400);
    },
    startNextWave:function () {
        this._preparingNextWave = false;
        this._prepareNextWave = false;
    },
    loadCompactUserInfoLayer:function () {
        var tempLayer = new CompactUserInfo();
        tempLayer.init();
        tempLayer.loadUI();
        this.addChild(tempLayer, 900, kUIAdvertisement);
        this.setCompactUserInfo(tempLayer);

        tempLayer.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(-360.0, -150.0)));
    },
    initCashOutLayer:function () {

    },
    initUI:function (dsPos) {
        // AutoAdapterScreen.getInstance().adjustSize();
        // AutoAdapterScreen.getInstance().setVisibleRect();
        EScreenRect = cc.rect(1.0, 1.0, document.documentElement.clientWidth + 10, document.documentElement.clientHeight + 10);
        this._timeScale = 1;
        this._playTutorial = !wrapper.getBooleanForKey(kTutorialPlayed);

        this.loadCannon();

        this._canSendBullet = true;
        this._pastTime = 0.7;
        this._shootPosList = [];
        this._gamepassTime = 0;

        this.loadScoreLayer();
        this.loadUserInfoLayer();
        this.loadCameraButton();
        this.initFishGroup();

        this.initMusicPlay();

        this.initChestGameLayer();
        //this.initPunchBoxAd();//

        this.loadCompactUserInfoLayer();

        this._addPrizeFishGroupFinish = false;
        this._addPrizeGroup = false;
        this._addPrizeFlag = 0;
        this._testPlistName = "Track1.plist";

        PlayerActor.sharedActor().reset();
        // 使玩家武器等级与武器管理中设置的当前武器等级相同
        // PlayerActor.sharedActor().setCurWeaponLevel(this.getCannonActor().getCurrentWeaponLevel());
        PlayerActor.sharedActor().loadStates();
        PlayerActor.sharedActor().setScene(this);
        PlayerActor.sharedActor().setPreMoney(PlayerActor.sharedActor().getPlayerMoney());

        if (this._curStage == 1) {
            PlayerActor.sharedActor().setExperienceCount(1);
        }

        this._isShowAllMenu = true;
        // this._scoreBar.setBullet(PlayerActor.sharedActor().getPlayerMoney());

        if (this.getOddsNumber() == 2) {
            var DoubleSprite = new cc.Sprite(ImageNameLang("fonts_other_40.png"));
            var addCall = new cc.CallFunc(this.delDouble, this);
            var ac = new cc.ScaleBy(0.5, 1.2);
            var cc1 = new cc.ScaleBy(0.5, 0.8);
            var ccc = new cc.ScaleBy(0.5, 1);

            var fadeOut = new cc.FadeOut(1);
            DoubleSprite.runAction(new cc.Sequence(ac, cc1, ac, cc1, ccc, fadeOut, addCall));
            DoubleSprite.setPosition(VisibleRect.center());
            this.addChild(DoubleSprite, 120, DoubleSpriteNum);
        }

        if (!this._playTutorial) {
            if (!wrapper.getBooleanForKey(kNewFishPrompt)) {
                wrapper.setBooleanForKey(kNewFishPrompt, true);
            }
        }

        var texList =
            [
                "ghaixing.png",
                "GoldItem.png",
                "sea.png",
                "AchieveIconTP.png",
                "ui_ach_002.png",
                "ui_ach_003.png",
                "prizenum.png",
                "add5.png",
                "huanpao02.png",
                "lizibianhua1.png",
                "lizibianhua3.png",
                "particle.png",
                "particleTexture.png",
                "prizesign1.png",
                "ui_ach_010.png",
                "ui_box_go_1.png",
                "ui_box_go_2.png",
                "ui_box_go_bg.png",
                "button_prop_Laser.png",
                "EXP.png",
                "Levin_explosion.png"
            ];

        /*        for (var i = 0; i < texList.length; i++) {
         this._retainedResArray.push(cc.textureCache.addImage(ImageName(texList[i])));
         }*/

        switch (this.getOddsNumber()) {
            case 1:
                this._retainedResArray.push(cc.textureCache.addImage(res.SharkPng));
                this._retainedResArray.push(cc.textureCache.addImage(res.GSharkPng));
                this._retainedResArray.push(cc.textureCache.addImage(res.ButterflyPng));
                break;
            case 2:
                this._retainedResArray.push(cc.textureCache.addImage(res.GrouperPng));
                this._retainedResArray.push(cc.textureCache.addImage(res.GMarlinPng));
                this._retainedResArray.push(cc.textureCache.addImage(res.MarlinPng));
                this._retainedResArray.push(cc.textureCache.addImage(res.ButterflyPng));//Eugene : was originally also butterfly
                break;
            case 3:
                this._retainedResArray.push(cc.textureCache.addImage(res.SharkPng));//was orignally also shark
                this._retainedResArray.push(cc.textureCache.addImage(res.GoldenTroutPng));
                this._retainedResArray.push(cc.textureCache.addImage(res.GSharkPng));//was orignally also gshark
                break;
        }

        var that = this;
        window.addEventListener("resize", function (event) {
            that.resetAllSpritePos();
        });


    },
    loadCameraButton:function () {
        this._savingImage = false;
        var spriteHide = new cc.Sprite("#ui_button_25.png");
        var spriteHided = new cc.Sprite("#ui_button_26.png");
        this._itemHide = new cc.MenuItemSprite(spriteHide, spriteHided, this.hideAllUI, this);
        this._itemHide.setPosition(cc.p(VisibleRect.topRight().x - 45, VisibleRect.topRight().y - this._itemHide.getContentSize().height / 2));

        // var spriteCamra = new cc.Sprite("#button_other_001.png");
        // var spriteCamrad = new cc.Sprite("#button_other_002.png");
        // this._itemCamera = cc.MenuItemSprite.create(spriteCamra, spriteCamrad, this, this.saveImage);
        // this._itemCamera.setPosition(cc.p(VisibleRect.topRight().x - 125, VisibleRect.topRight().y - this._itemCamera.getContentSize().height / 2));

        this._camera = new cc.Menu(this._itemHide/*, this._itemCamera*/);
        this._camera.setPosition(0, 0);
        this.addChild(this._camera, 101);
    },
    addPrizeNets:function (sender) {
        this.schedule(this.addPrizeNet, 0.2, false);
        this._prizeNetCount = 0;
    },
    hideAllUI:function (sender) {
        if (this._isPause) {
            return;
        }

        playEffect(BUTTON_EFFECT);

        this.hideAllMenu();

        AdsController.forceHideBannerAd(BannerAdTyp.BannerAdGame);

        //debug
        var debug = false;
        if (debug) {
            if (this._curStage < 3) {
                // 新场景没有金鲨
                sino.fishGroup.setGSharkActor();
                this._chestGameLayer.addMinChest(this._oddsNumber - 1, cc.pAdd(VisibleRect.left(),
                    cc.p(Math.random() % parseInt(VisibleRect.rect().width), Math.random() % parseInt(VisibleRect.rect().height))));//添加宝箱
            }

            var playerActor = PlayerActor.sharedActor();
            playerActor.addLaserNum(1);
            playerActor.setPlayerMoney(playerActor.getPlayerMoney() + 1000);
        }
    },
    delDouble:function () {
        this.removeChildByTag(DoubleSpriteNum, true);
    },
    cancelChange:function () {
        PlayerActor.sharedActor().updateNormalGain(0);
    },
    addStarfish:function () {
        var yOffset = 50;
        var roundR = 200;

        for (var i = 1; i < 6; i++) {
            var StarfishNode = ActorFactory.create("Starfish");
            StarfishNode.setMultiple(this.getOddsNumber());
            StarfishNode.setLocalZOrder(BulletActorZValue);

            StarfishNode.initFirstPt(cc.pAdd(cc.p(VisibleRect.bottom().x, VisibleRect.bottom().y + yOffset), cc.p(Math.sin((30 * i - 90) * Math.PI / 180) * roundR, Math.cos((30 * i - 90) * Math.PI / 180) * roundR)));
            StarfishNode.resetState();
            this.addActor(StarfishNode);
            StarfishNode.setPosition(VisibleRect.topRight());
        }
        cc.director.getScheduler().schedule(this.delStarfish, this, 15, false);
    },
    addParticleAchieve:function () {
        var pos = cc.p(VisibleRect.center().x, VisibleRect.center().y + 100);

        var parAchieve = particleSystemFactory.createParticle(res.ChestOpeningParticlePlist);
        this.addChild(parAchieve, 201, kAchieveParticleTag);
        parAchieve.setPosition(pos);
    },
    _fingerAction:function (move) {

    },
    _focusAction:function (move) {

    },
    delStarfish:function () {
        cc.director.getScheduler().unschedule(this.delStarfish, this);

        var groupStarfishActor = this.getActors(GroupStarfishActor);
        for (var i = groupStarfishActor.length - 1; i >= 0; i--) {
            var starfish = groupStarfishActor[i];
            if (starfish.getDelIng()) {
                continue;
            }
            starfish.removeSelfFromScene();
        }
    },
    addChestScoreNumber:function () {

    },
    SetChestMove:function () {

    },
    showShareRankingLayer:function () {
        this.removeChildByTag(kShareToWeiBoTag, true);
        var shareLayer = new ShareImageLayer();
        this.addChild(shareLayer, 2001, kShareToWeiBoTag);
        this.removeChildByTag(kMarkTag, true);
    },
    getGameSceneFromBuffer:function (pImage, x, y, nWidth, nHeight) {
        //todo implement
    },
    getSPSceneType:function () {
        return this.eGameScene;
    },
    RandomOvalinit:function () {
    },
    showUIInfo:function () {
    },
    showTutorialHint:function (file, offset) {
    },
    showFishInfo:function (node) {
    },
    initFishGroup:function () {
        this._items = {};

        this._prepareNextWave = false;
        this._preparingNextWave = false;
        this._maxTime = GameSetting.getInstance().getAddGroupInterval();
        this._maxTime = 6;
        this._time = this._maxTime;
        this._curWaveTime = 0;
        this._accTimer = 0;
        this._perWaveTime = GameSetting.getInstance().getChangeBgTimeInterval();
        this._perWaveTime = 10;
        this._pathIndex = [];
        this._pathIndex[0] = this._pathIndex[1] = this._pathIndex[2] = this._pathIndex[3] = 0;
    },
    loadCannonAtPosition:function (cannonPos) {

    },
    changeMusic:function () { //not using the res.music correctly (currently unused)
        cc.audioEngine.stopMusic(false);
        this._musicIdx = (++this._musicIdx) > 6 ? 1 : this._musicIdx;
        var szMusicFile = "music_" + this._musicIdx;
        playMusic(szMusicFile, true);
    },
    superWeaponChanged:function () {
        this._scoreBar.superWeaponChanged();
    },
    addChest:function (blurPos, achPos) {

    },
    openShop:function () {

    },
    openOtherChest:function () {

    },
    SetChestbInvincible:function () {

    },
    playBackMusic:function () {

    },
    addMinChest:function () {

    },
    initTouchEvent:function () {
        this._touchLayer = TouchLayer.create();
        this._touchLayer.setDelegate(this);
        this.addChild(this._touchLayer, 1000);
    },
    onEnter:function () {
        this._super();
        this.initUI();

        //init touch event
        this.initTouchEvent();

        var DISABLE_TUTORIAL = true;
        if (DISABLE_TUTORIAL) {
            console.warn('Not loading tutorial because it breaks!  Please remove this warning when it is fixed.');
            this.loadGameMainSessionController();
        } else {
            // 新场景 加勒比海 不进行游戏教学
            if (this._playTutorial == true && this.getCurStage() == 3) {
                wrapper.setBooleanForKey(kTutorialPlayed, false);
                this._playTutorial = false;
            }

            this.initTutorial();
            if (!this._playTutorial) {
                this.loadGameMainSessionController();
            }

        }
        //PaymentPopUp.checkPaypal();
    },
    onExit:function () {
        this._super();
        var cache = cc.spriteFrameCache;
        cache.removeSpriteFrameByName(ImageName(res.CannonPlist));
        cache.removeSpriteFrameByName(ImageName("cannon10.plist"));
        cache.removeSpriteFrameByName(ImageName("weaponLevinStorm.plist"));
        cache.removeSpriteFrameByName(ImageName("LevinStorm_xuli1.plist"));
        cache.removeSpriteFrameByName(ImageName("LevinStorm_xuli2.plist"));
    },
    sessionDidLoad:function (sessionController) {

    },
    sessionWillStart:function (sessionController) {

    },
    sessionDidStart:function (sessionController) {

    },
    sessionWillEnd:function (sessionController) {

    },
    sessionDidEnd:function (sessionController) {
        if (sessionController.getSessionType() == eSessionType.GameMain) {
            this.loadFishSeasonSessionController();
        }
        else {
            this.loadGameMainSessionController();
        }
    },
    skipTutorial:function () {
        this._cancelTutorialLayer = new TutorialConfirmLayer();
        this._cancelTutorialLayer.init();
        this._cancelTutorialLayer.initWithTitle(null, cc.LocalizedString.localizedString("Tutorial Text Confirm Skip"),
            ("ui_teach_002.png"), ("btn_teach_001.png"), ("btn_teach_002.png"),
            cc.LocalizedString.localizedString("Tutorial Text OK"),
            cc.LocalizedString.localizedString("Tutorial Text Cancel"), this,
            this.doSkipTutorial,
            this.giveUpToSkipTutorial);
        this.addChild(this._cancelTutorialLayer, 120);
        this._cancelTutorialLayer.show();
    },
    startTutorial:function () {
        if (this._tutorialConfirmLayer) {
            this._tutorialConfirmLayer.hide();
        }

        this._tutorialSessionController = new TutorialSessionController();
        this._tutorialSessionController.initWithDelegate(this, this);
        var thBackLayer = new TutorialHintBackLayer();
        thBackLayer.init("test");
        thBackLayer.setAnchorPoint(cc.p(0.5, 0.5));
        thBackLayer.setOpacity(0);

        var hintPos = cc.pAdd(VisibleRect.bottomLeft(), cc.p(246, 244));
        thBackLayer.setPosition(hintPos);
        this.addChild(thBackLayer, 200);
        this._tutorialSessionController.setHintBack(thBackLayer);

        this.loadSessionController(this._tutorialSessionController);

        var tempPosition = cc.pAdd(VisibleRect.bottomRight(), cc.p(-73, 110));
        this._tutorialSessionController.initPlayTutorial(201, 200, tempPosition, tempPosition);
    },
    giveUpToSkipTutorial:function () {
        if (this._cancelTutorialLayer) {
            this._cancelTutorialLayer.hide();
        }
    },
    doSkipTutorial:function () {
        wrapper.setBooleanForKey(kTutorialPlayed, true);
        this.loadGameMainSessionController();
        PlayerActor.sharedActor().setIsGetSpringFestival(true);
        this._playTutorial = false;
        PlayerActor.sharedActor().setAutoSave(true);
        if (this._cancelTutorialLayer) {
            this._cancelTutorialLayer.hide();
        }

        if (this._tutorialConfirmLayer) {
            this._tutorialConfirmLayer.hide();
        }
    },
    loadGameMainSessionController:function () {
        //var mainSessionController = new FishSeasonSessionController();
        var mainSessionController = new GameMainSessionController();
        mainSessionController.initWithDelegate(this, this);
        this.loadSessionController(mainSessionController);
        this._mainSessionController = mainSessionController;
    },
    loadFishSeasonSessionController:function () {
        var fishSeasonSessionController = new FishSeasonSessionController();
        fishSeasonSessionController.initWithDelegate(this, this);
        this.loadSessionController(fishSeasonSessionController);
    },
    initTutorial:function () {
        cc.spriteFrameCache.addSpriteFrames(ImageName("tutorial.plist"));
        if (this._playTutorial) {
            this._tutorialConfirmLayer = new TutorialConfirmLayer();
            this._tutorialConfirmLayer.init();
            this._tutorialConfirmLayer.initWithTitle(null, cc.LocalizedString.localizedString("Tutorial Text Begin"),
                ("ui_teach_002.png"), ("btn_teach_001.png"), ("btn_teach_002.png"),
                cc.LocalizedString.localizedString("Tutorial Text Start"), cc.LocalizedString.localizedString("Tutorial Text Skip"),
                this, this.startTutorial, this.skipTutorial);
            this.addChild(this._tutorialConfirmLayer, 120);
            var delay = new cc.DelayTime(0.5);
            var call = new cc.CallFunc(this._tutorialConfirmLayer.show, this._tutorialConfirmLayer);
            this._tutorialConfirmLayer.runAction(new cc.Sequence(delay, call));
        }
        else {
            PlayerActor.sharedActor().setIsGetSpringFestival(true);
        }
    },
    _sessionsNeedLoad:null, //array
    loadSessionController:function (sessionController) {
        if (sessionController) {
            if (sessionController.getSessionType() == eSessionType.GameMain) {
                this._isPLayGameMainSessionController = true;
            }
            else {
                this._isPLayGameMainSessionController = false;
            }
            this._sessionsNeedLoad.push(sessionController);
            sessionController.didLoad();
            this.sessionDidLoad(sessionController);
            sessionController.startSession();
        }
    },
    actionForAdShow:function () {
        if (this._userInfoLayer) {
            var userInfoMove = new cc.MoveTo(1, cc.p(this._userInfoLayer.getPosition().x, VisibleRect.top().y + 50));
            this._userInfoLayer.runAction(userInfoMove);
        }

        if (this._camera) {
            var delay1 = new cc.DelayTime(1);
            var targetPosX = VisibleRect.rect().width - 340; // btnWidth 为四个按钮的宽度
            var camraMove = new cc.MoveTo(1, cc.p(-targetPosX, this._camera.getPosition().y));
            this._camera.runAction(new cc.Sequence(delay1, camraMove));
        }

        if (this._compactUserInfo) {
            var delay2 = new cc.DelayTime(1);
            var compactMove = new cc.MoveBy(1, cc.p(360, 0));
            var call = new cc.CallFunc(this.showAdActionEnd, this);
            this._compactUserInfo.runAction(new cc.Sequence(delay2, compactMove, call));
        }
    },
    actionAfterAdHide:function () {
        if (this._camera) {
            var camraMove = new cc.MoveTo(1, cc.p());
            this._camera.runAction(camraMove);
        }

        if (this._compactUserInfo) {
            var compactMove = new cc.MoveBy(1, cc.p(-360, 0));
            this._compactUserInfo.runAction(compactMove);
        }

        if (this._userInfoLayer) {
            var delay = new cc.DelayTime(1);
            var userInfoMove = new cc.MoveTo(1, cc.p(0,0));
            var call = new cc.CallFunc(this.hideAdActionStart, this);
            this._userInfoLayer.runAction(new cc.Sequence(call, delay, userInfoMove));
        }
    },
    showAdActionEnd:function () {
        AdsController.actionEnd(1);

        // 设置定时器，隐藏广告条
        cc.director.getScheduler().schedule(this.hideAdView, this, AD_SHOWN_TIME, false);
    },
    hideAdActionStart:function () {
        AdsController.actionEnd(0);
    },
    hideAdView:function (dt) {
        cc.director.getScheduler().unschedule(this.hideAdView, this);
        AdsController.hideBannerAd(BannerAdTyp.BannerAdGame);
    },
    terminateAdMobShown:function () {
        // 停止隐藏广告的定时器
        cc.director.getScheduler().unschedule(this.hideAdView, this);

        // 停止广告相关 UI 的动画
        if (this._camera) {
            this._camera.stopAllActions();
        }

        if (this._compactUserInfo) {
            this._compactUserInfo.stopAllActions();
        }

        if (this._userInfoLayer) {
            this._userInfoLayer.stopAllActions();
        }

        // 将 UI 复位
        this.actionAfterAdHide();

        // 强制隐藏游戏界面的广告条
        AdsController.forceHideBannerAd(BannerAdTyp.BannerAdGame);
    },

    startCameraAnimation:function () {
        cc.director.getScheduler().schedule(this.shakeScreen, this, 0.02, false);
    },
    shakeScreen:function (dt) {
        var body = cc.$("canvas");
        if (body) {
            var i = this._shakeTime / 180 * Math.PI,
                x = 0 | (Math.sin(i) * this._swingRadio),
                y = 0 | (Math.cos(i) * this._swingRadio);

            body.translates(x, y);
        }
        this._shakeTime += 20;
        if (this._shakeTime > 1300) {
            //KingFisher cc.log("Stop shaking!");
            if (body) {
                body.translates(0, 0);
            }
            this._shakeTime = 0;
            cc.director.getScheduler().unschedule(this.shakeScreen, this);
        }
    },
    EnterSceneSelect:function () {
        // 同意进入新场景，游戏开始时候不提示新场景登入提示
        wrapper.getBooleanForKey("AskByTurnHere", true);
        this.clearGameResource();
        GameCtrl.sharedGame().homeWithStage();
        var stageSelectLayer = new StageSelectLayer();
        stageSelectLayer.setDefaultPage(3);
    },
    cancelEnterSceneSelect:function () {
        if (this._enterNewLayer) {
            this._enterNewLayer.hide();
        }
    },
    changeTrack:function (sender) {
        var tmp = "Track" + sender.getTag() + ".plist";
        this._testPlistName = tmp;
    },
    PlaneMoveByControl1:function () {

    },
    PlaneMoveByControl2:function () {

    },
    cleanFishRes:function () {
        var groupFishActor = this.getActors(GroupFishActor);
        for (var i = 0; i < groupFishActor.length; i++) {
            var pFish = groupFishActor[i];
            pFish.removeSelfFromScene();
        }
        ActorFactory.cleanRes();
    },
    saveImageWithDelay:function (delay) {
        this.runAction(new cc.Sequence
            (new cc.DelayTime(delay)
                , new cc.CallFunc(this.saveImage, this,  this)
            ));
    },
    _stopTutorialHint:function (sender) {

    },
    saveImage:function (sender) {
        var hl = (cc.sys.language == cc.sys.LANGUAGE_CHINESE) ? "zh-CN" : "en-US";
        var gplusHref = "https://plus.google.com/share?url=http://chrome.KingFisher.com/recommend.html&hl=" + hl;
        var heightValue = window.screen.height / 2 - 300;
        var widthValue = window.screen.width / 2 - 300;

        var positionStr = "screenX=" + widthValue + ",left=" + widthValue + " ,screenY=" + heightValue + ",top=" + heightValue;
        window.open(gplusHref, 'Share FishJoy to Friends', 'menubar=no,toolbar=no,resizable=no,scrollbars=yes,height=600,width=600,' + positionStr);

        wrapper.logEvent("GameScene","Tap","Google+",1);

        //return;

        /*if (this._isPause) {
         return;
         }

         if (this.getChildByTag(kShareToWeiBoTag)) {
         return;
         }

         if (this._savingImage) {
         return;
         }
         this._savingImage = true;

         var winSize = cc.director.getWinSize();
         var sprite = cc.Sprite.create(ImageName("mark.png"));
         sprite.setScaleX(winSize.width / sprite.getContentSize().width);
         sprite.setScaleY(winSize.height / sprite.getContentSize().height);
         sprite.setPosition(VisibleRect.center());
         this.addChild(sprite, 9999, kMarkTag);

         var fadeOut = cc.FadeOut.create(0.5);

         var callback = cc.CallFunc.create(this, this.showShareImageLayer);
         var sequ = cc.Sequence.create(fadeOut, callback);
         sprite.runAction(sequ);
         playEffect(CAMERA_EFFECT);*/
    },
    showShareImageLayer:function () {
        this._savingImage = false;

        this.removeChildByTag(kShareToWeiBoTag, true);
        var shareLayer = ShareImageLayer.create();

        this.addChild(shareLayer, 200, kShareToWeiBoTag);
        this.removeChildByTag(kMarkTag, true);
    },
    _sessionControllers:null,
    cleanSessions:function () {
        if (this._sessionsEnded.length) {
            for (var i = 0; i < this._sessionsEnded.length; i++) {
                var idx = this._sessionControllers.indexOf(this._sessionsEnded[i]);
                if (idx != -1) this._sessionControllers.splice(idx, 1);
            }
            this._sessionsEnded = [];
        }
    },
    addSessionControllerIfNeeded:function () {
        if (this._sessionsNeedLoad.length) {
            for (var i = 0; i < this._sessionsNeedLoad.length; i++) {
                this._sessionControllers.push(this._sessionsNeedLoad[i]);
            }
            this._sessionsNeedLoad = [];

        }
    },
    updateAllSessions:function (dt) {
        for (var i = 0; i < this._sessionControllers.length; i++) {
            this._sessionControllers[i].update(dt);
        }
        this.cleanSessions();
        this.addSessionControllerIfNeeded();
    },
    update:function (dt) {
        if (this._gameover || this._isPause) {
            return;
        }

        this.updateUI(dt);

        if (this._playTutorial) {
            this.updateTutorial(dt);
            return;
        }


        this.updateAllSessions(dt);

        //CameraAnimation.sharedCameraAnimation().update(dt);
    },
    resetAllSpritePos:function () {

        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._backgroundLayer._bg.setScale(Multiple);
        this._backgroundLayer._bg.setPosition(VisibleRect.center());
        if (this._blurBackgroundLayer) {
            this._blurBackgroundLayer.setScale(Multiple);
            this._blurBackgroundLayer.setPosition(VisibleRect.center());
        }

        //pause menu
        if (this._pauseMenuLayer) {
            this._pauseMenuLayer.setPosition(VisibleRect.bottom());
        }
        //compact user info
        var act = this._compactUserInfo.getNumberOfRunningActions();
        if (!(act > 0)) {
            this._compactUserInfo.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(this._compactUserInfo.getPosition().x, -150)));
        }
        //weapon
        // this._cannonActor.getCurrentWeapon().setPosition(cc.pAdd(VisibleRect.bottom(), cc.p(0, 50)));
        // this._cannonActor._defaultWeaponPosition = cc.pAdd(VisibleRect.bottom(), cc.p(0, 50));

        //scoreBar
        // this._scoreBar.setPosition(VisibleRect.bottom());
        //
        // this._scoreBar._weaponBaseRudder.setPosition(cc.p(-VisibleRect.right().x / 2, 0));
        // if (this._scoreBar.getChildByTag(kTagScoreBar)) {
        //     this._scoreBar.getChildByTag(kTagScoreBar).setPosition(cc.p(-VisibleRect.right().x / 2, 0));
        // }

        var rainbow = this.getChildByTag(461);
        if (rainbow) {
            rainbow.setPosition(cc.pAdd(VisibleRect.bottom(), cc.p(0, -7)));
        }

        //btn
        // this._itemMusicPlayer.setPosition(cc.p(VisibleRect.topLeft().x + 125, VisibleRect.topLeft().y - this._itemPause.getContentSize().height / 2));
        this._itemPause.setPosition(cc.p(VisibleRect.topLeft().x + 45, VisibleRect.topLeft().y - this._itemPause.getContentSize().height / 2));
        this._itemHide.setPosition(cc.p(VisibleRect.topRight().x - 45, VisibleRect.topRight().y - this._itemHide.getContentSize().height / 2));
        // this._itemCamera.setPosition(cc.p(VisibleRect.topRight().x - 125, VisibleRect.topRight().y - this._itemCamera.getContentSize().height / 2));

        //userinfo layer
        // this._userInfoLayer._bgSprite.setPosition(VisibleRect.top());
        // this._userInfoLayer._menuAchieve.setPosition(cc.pAdd(VisibleRect.top(), cc.p(0, -28)));
        // this._userInfoLayer._userTitleLabel.setPosition(cc.p(VisibleRect.top().x - 130, VisibleRect.top().y - 26));
        // this._userInfoLayer._levellabel.setPosition(cc.pAdd(VisibleRect.top(), cc.p(0, -28)));
        // this._userInfoLayer._processsprite.setPosition(cc.p(VisibleRect.top().x + 156, VisibleRect.top().y - 24));

        //prize sprite
        this._prizeSprite.setPosition(VisibleRect.center());
    }
});