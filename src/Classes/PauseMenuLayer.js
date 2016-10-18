var kTagMenuMain = 0;
var kTagMenuStart = 0;
var kTagMenuContinue = 0;
var kTagMenuOption = 0;
var kTagMenuPause = 909;
var kTagMenuResume = 0;

var kTagScoreBar = 901;
var kTagScore = 0;
var kTagHiScore = 0;
var kTagMenuRetry = 0;
var kTagMenuGoBack = 0;
var kTagMenuJump = 0;
var kTagMenuHit = 0;
var kTagMenuSkill = 0;
var kTagLayerResume = 0;
var kTagLayerStatusBar = 0;
var kTagStage = 0;
var kTagPlayer = 0;
var kTagMenuGameover = 0;
var kTagMenuTip = 0;
var kTagMenuItemGetMoney = 0;

var kTagTipLaserZero = 0;

var PauseMenuLayer = cc.Layer.extend({
    _menuBg:null,
    _fightMenuBg:null,
    _soundOnItem:null,
    _soundOffItem:null,
    _musicOnItem:null,
    _musicOffItem:null,
    _isSubLayer:null,
    _delegate:null,
    ctor:function () {
        this._delegate = null;
        this._isSubLayer = false;
    },
    init:function () {
        if (this._super()) {
            this.setKeyboardEnabled(true);
        }

        return true;
    },
    didLoadFromCCB:function () {
        this.init();
        this.addPunchBox();
    },
    isGameScene:function () {
        if (this._delegate && this.eGameScene == this._delegate.getSPSceneType()) {
            return true;
        }

        return false;
    },
    resumeGame:function (sender) {
        //this.removeAdView();
        this.removeAllChildrenWithCleanup(true);
        playEffect(BUTTON_EFFECT);
        this._delegate.resumeGame();

        var cache = cc.SpriteFrameCache.getInstance();
        cache.removeSpriteFrameByName(ImageNameLang("options_other.plist"));
        cache.removeSpriteFrameByName(ImageName("Button_push.plist"));
        cache.removeSpriteFrameByName(ImageName("PauseMenuLayer.plist"));
    },
    giveup:function (sender) {
        if (this._isSubLayer)
            return;
        else
            this._isSubLayer = true;

        // 防止意外情况能量槽数值未被保存
        if ((this._delegate.getCannonActor().getCurrentWeaponLevel() == FishWeaponType.eWeaponLevel9) || (this._delegate.getCannonActor().getCurrentWeaponLevel() == FishWeaponType.eWeaponLevel8 )) {
            if (PlayerActor.sharedActor().getNormalGain() > wrapper.getIntegerForKey(kOldLaserNum)) {
                var curNormalGain = PlayerActor.sharedActor().getNormalGain();
                wrapper.setIntegerForKey(kOldLaserNum, curNormalGain);
                PlayerActor.sharedActor().updateNormalGain(curNormalGain);
            }
            else {
                var oldNormalGain = wrapper.getIntegerForKey(kOldLaserNum);
                PlayerActor.sharedActor().updateNormalGain(oldNormalGain);
            }
        }

        this.removeAdView();
        playEffect(BUTTON_EFFECT);
        this._delegate.backToMenu(null);
    },
    SelectOther:function (sender) {
        if (this._isSubLayer)
            return;
        else
            this._isSubLayer = true;

        // 防止意外情况能量槽数值未被保存
        if ((this._delegate.getCannonActor().getCurrentWeaponLevel() == FishWeaponType.eWeaponLevel9) ||
            (this._delegate.getCannonActor().getCurrentWeaponLevel() == FishWeaponType.eWeaponLevel8 )) {
            if (PlayerActor.sharedActor().getNormalGain() > wrapper.getIntegerForKey(kOldLaserNum)) {
                var curNormalGain = PlayerActor.sharedActor().getNormalGain();
                wrapper.setIntegerForKey(kOldLaserNum, curNormalGain);
                PlayerActor.sharedActor().updateNormalGain(curNormalGain);
            }
            else {
                var oldNormalGain = wrapper.getIntegerForKey(kOldLaserNum);
                PlayerActor.sharedActor().updateNormalGain(oldNormalGain);
            }
        }

        this.removeAdView();
        playEffect(BUTTON_EFFECT);
        this._delegate.backToSelect();
    },
    OptionFunction:function (sender) {
        if (this._isSubLayer)
            return;
        else
            this._isSubLayer = true;

        var Options = new OptionsLayer();
        Options.init();
        Options.initView();
        Options.setParentDeleaget(this);
        Options.isShow();
        this._delegate.addChild(Options, 150);

        this.removeChildByTag(kTagMenuPause, true);
        this.removeChildByTag(81, true);
        this.removeChildByTag(123, true);

        playEffect(BUTTON_EFFECT);
    },
    soundOn:function (sender) {
        this._soundOnItem.setVisible(true);
        this._soundOffItem.setVisible(false);
        this.sound(sender);
    },
    musicOn:function (sender) {
        this._musicOnItem.setVisible(true);
        this._musicOffItem.setVisible(false);
        this.mMusic(sender);
    },
    soundOff:function (sender) {
        this._soundOffItem.setVisible(true);
        this._soundOnItem.setVisible(false);
        this.sound(sender);
    },
    musicOff:function (sender) {
        this._musicOffItem.setVisible(true);
        this._musicOnItem.setVisible(false);
        this.mMusic(sender);
    },
    setDelegate:function (delegate) {
        this._delegate = delegate;
    },
    setFightMenuBgRotation:function (angle) {
        this.setRotation(angle);
    },
    sound:function (sender) {
        var pItem = sender;
        GamePreference.getInstance().setPlayEffect(pItem.getSelectedIndex() == 1);
        GamePreference.getInstance().updateSoftPref();
        cc.audioEngine.setEffectsVolume(pItem.getSelectedIndex());
    },
    mMusic:function (sender) {
        var pItem = sender;
        GamePreference.getInstance().setPlayMusic(pItem.getSelectedIndex() == 1);
        GamePreference.getInstance().updateSoftPref();
        cc.audioEngine.setBackgroundMusicVolume(pItem.getSelectedIndex());
    },
    alertView:function (alertView, buttonIndex) {

    },
    showAskMenuItem:function () {

    },
    showAskMenuItemAction:function (sender) {
        var menu = this.getChildByTag(997);
        menu.setTouchEnabled(true);
        var item = sender;
        if (1 == item.getTag()) {
            //TODO		GameCtrl.sharedGame().home();
        } else {
            this.removeChildByTag(998, true);
            this.removeChildByTag(999, true);
        }
        playEffect(UI_EFFECT_03);
    },
    down:function (sender) {

    },
    UpdateState:function () {
        if (GamePreference.getInstance().getPlayMusic()) {
            this._musicOnItem.setVisible(true);
            this._musicOffItem.setVisible(false);
        }
        else {
            this._musicOnItem.setVisible(false);
            this._musicOffItem.setVisible(true);
        }

        if (GamePreference.getInstance().getPlayEffect()) {
            this._soundOnItem.setVisible(true);
            this._soundOffItem.setVisible(false);
        }
        else {
            this._soundOnItem.setVisible(false);
            this._soundOffItem.setVisible(true);
        }
    },
    resetPauseMenu:function () {
        this.ShowMenu();
    },
    keyBackClicked:function () {
        if (this.getChildByTag(kTagMenuPause)) {
            this.resumeGame(0);
        }
    },
    removeAdView:function () {
        if (this.isGameScene()) {
            //AdsController.hideBannerAd(eBannerAdPause);
        }
    },

    onEnter:function () {
        this._super();

        if (this.isGameScene()) {
            this._delegate.terminateAdMobShown();
            //AdsController.showBannerAd(eBannerAdPause);
        }
    },
    onExit:function () {
        this._super();
    },
    didReceiveAd:function () {
        return cc.RectMake(VisibleRect.rect().width / 2 - 160, 0, 320, 50);
    },
    didFailWithMessage:function () {
        //KingFisher cc.log("No Tapjoy Display Ads available");
    },
    adContentSize:function () {
        return "320x50";
    },
    shouldRefreshAd:function () {
        return false;
    },
    addPunchBox:function () {

    },
    initWithDelegate:function (delegate) {
        if (this.init()) {
            this.setKeyboardEnabled(true);

            this._delegate = delegate;
            this.ShowMenu();
        }

        this._isSubLayer = false;
        return this;
    },
    ShowMenu:function (sender) {
        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(ImageNameLang("options_other.plist"));
        cache.addSpriteFrames(ImageName("Button_push.plist"));
        cache.addSpriteFrames(ImageName("PauseMenuLayer.plist"));

        var pauseMenuBackground;
        var button_continue = cc.MenuItemSprite.create(
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("ui_button_13.png",true)),
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("ui_button_14.png",true)),
            this, this.resumeGame);
        var button_Other = cc.MenuItemSprite.create(
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("button_other_026.png",true)),
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("button_other_027.png",true)),
            this, this.SelectOther);
        var button_giveup = cc.MenuItemSprite.create(
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("ui_button_15.png",true)),
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("ui_button_16.png",true)),
            this, this.giveup);

        var menu;
        pauseMenuBackground = cc.Sprite.createWithSpriteFrameName("btn_pause_1.png");
        pauseMenuBackground.setAnchorPoint(cc.p(0.5, 0.5));
        pauseMenuBackground.setPosition(cc.p(0, VisibleRect.top().y / 2));
        this.addChild(pauseMenuBackground, 10, 123);
        button_continue.setPosition(cc.p(0, 140));
        button_giveup.setPosition(cc.p(0, -10));
        button_Other.setPosition(cc.p(0, -97));

        var button_Option = cc.MenuItemSprite.create(
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("button_other_037.png", true)),
            cc.Sprite.createWithSpriteFrameName(ImageNameLang("button_other_038.png", true)),
            this, this.OptionFunction);
        button_Option.setPosition(cc.p(0, -187));
        menu = cc.Menu.create(button_Option, button_continue, button_giveup, button_Other);

        menu.setPosition(cc.p(0, VisibleRect.top().y / 2));
        menu.setAnchorPoint(cc.PointZero());
        this.addChild(menu, 10, kTagMenuPause);
        menu.setTag(kTagMenuPause);

        this.setTag(kTagLayerResume);
        menu.runAction(cc.FadeIn.create(0.3));
    },
    restartGame:function (sender) {
        this.removeAdView();
        this.removeAllChildrenWithCleanup(true);

        playEffect(BUTTON_EFFECT);

        var pFight = this._delegate instanceof  FightScene;
        if (null != pFight) {
            pFight.restartGame();
        }
    }
});

PauseMenuLayer.create = function (delegate) {
    var layer = new PauseMenuLayer();
    layer.initWithDelegate(delegate);
    return layer;
};