var kAboutLayerTag = 321;

var OptionsLayer = cc.Layer.extend({
    _noticeOffItem:null,
    _noticeOnItem:null,
    _soundOnItem:null,
    _soundOffItem:null,
    _musicOnItem:null,
    _musicOffItem:null,
    _optionalMenu:null,
    _isSubLayer:null,
    _parentDeleaget:null,
    init:function () {
       this._super();
        this._isSubLayer = false;
        return true;
    },
    onEnter:function(){
        this._super();
        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(ImageNameLang("options_other.plist"));
        cache.addSpriteFrames(ImageName("Button_push.plist"));
        this.setKeyboardEnabled(true);
        this.initView();

        var that = this;
        window.addEventListener("resize", function (event) {
            that.resetAllSpritePos();
        });
    },
    onExit:function(){
        this._super();
        var cache = cc.SpriteFrameCache.getInstance();
        cache.removeSpriteFrameByName(ImageNameLang("options_other.plist"));
        cache.removeSpriteFrameByName(ImageName("Button_push.plist"));
    },
    about:function (sender) {
        // 用于屏蔽按键
        if (this._isSubLayer) {
            return;
        }
        this._isSubLayer = true;

        var about = new AboutLayer();
        about.initWithParentMenu(this);
        this.addChild(about, 200, kAboutLayerTag);
    },
    tutorial:function (sender) {
        if (this._isSubLayer) {
            return;
        }

        alert(cc.LocalizedString.localizedString("ResetHelp"));

        wrapper.setBooleanForKey(kTutorialPlayed, false);
    },
    noticeOn:function (sender) {
        if (this._isSubLayer) {
            return;
        }

        this._noticeOnItem.setVisible(true);
        this._noticeOffItem.setVisible(false);
        this.localPush(sender);
    },
    noticeOff:function (sender) {
        if (this._isSubLayer) {
            return;
        }

        this._noticeOffItem.setVisible(true);
        this._noticeOnItem.setVisible(false);
        this.localPush(sender);
    },
    soundOn:function (sender) {
        if (this._isSubLayer) {
            return;
        }

        this._soundOnItem.setVisible(true);
        this._soundOffItem.setVisible(false);
        GamePreference.getInstance().setPlayEffect(true);
        cc.audioEngine.setEffectsVolume(1);
        GamePreference.getInstance().updateSoftPref();
    },
    soundOff:function (sender) {
        if (this._isSubLayer) {
            return;
        }

        this._soundOffItem.setVisible(true);
        this._soundOnItem.setVisible(false);
        GamePreference.getInstance().setPlayEffect(false);
        cc.audioEngine.setEffectsVolume(0);
        GamePreference.getInstance().updateSoftPref();
    },
    musicOn:function (sender) {
        if (this._isSubLayer) {
            return;
        }

        this._musicOnItem.setVisible(true);
        this._musicOffItem.setVisible(false);
        GamePreference.getInstance().setPlayMusic(true);
        GamePreference.getInstance().setMusicEnable(true, false);
        GamePreference.getInstance().updateSoftPref();
    },
    musicOff:function (sender) {
        if (this._isSubLayer) {
            return;
        }

        this._musicOffItem.setVisible(true);
        this._musicOnItem.setVisible(false);
        GamePreference.getInstance().setPlayMusic(false);
        GamePreference.getInstance().setMusicEnable(false, false);
        GamePreference.getInstance().updateSoftPref();
    },
    back:function (sender) {
        if (this._parentDeleaget != null) {
            this._parentDeleaget.resetPauseMenu();
            this._parentDeleaget._isSubLayer = false;
        }
        else {
            var main = GameCtrl.sharedGame().getCurScene();
            if (main) {
                main.setIsSubLayer(false);
            }
        }
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParentAndCleanup(true);
    },

    localPush:function (sender) {
        var closeLocalPush = (sender.getSelectedIndex() != 0);

        GamePreference.getInstance().setCloseLocalPush(closeLocalPush);
        GamePreference.getInstance().updateSoftPref();
    },
    sound:function (sender) {
        GamePreference.getInstance().setPlayEffect(sender.getSelectedIndex() == 1);
        cc.audioEngine.setEffectsVolume(sender.getSelectedIndex());
        GamePreference.getInstance().updateSoftPref();
    },
    mMusic:function (sender) {
        var selectedItem = sender.getSelectedIndex();
        GamePreference.getInstance().setPlayMusic(selectedItem == 1);
        GamePreference.getInstance().updateSoftPref();
        cc.audioEngine.setBackgroundMusicVolume(selectedItem);
        var isPlaying = cc.audioEngine.isMusicPlaying();
        if(!isPlaying){
            playMusic();
        }
    },
    keyBackClicked:function () {
        if (!this.getChildByTag(kAboutLayerTag)) {
            this.back(0);
        }
    },
    resetting:function () {
        this.removeChildByTag(230, true);
        this.removeChildByTag(231, true);
        this.removeChildByTag(232, true);
        var mOptions = this.getChildByTag(35);


        for (var i = 0; i < mOptions.getChildren().length; i++) {
            var item = mOptions.getChildren()[i];
            item.setEnabled(true);
        }

        PlayerActor.sharedActor().reset();
        PlayerActor.sharedActor().saveStateToCoredate();
    },
    resetCancel:function () {
        this.removeChildByTag(230, true);
        this.removeChildByTag(231, true);
        this.removeChildByTag(232, true);
        var mOptions = this.getChildByTag(35);

        for (var i = 0; i < mOptions.getChildren().length; i++) {
            var item = mOptions.getChildren()[i];
            item.setEnabled(true);
        }
    },
    isShow:function () {
        this.removeChildByTag(802, true);
    },
    initView:function () {
        //background

        this._bg = cc.Sprite.create(ImageName("ui_background_normal.jpg"));
        this.addChild(this._bg, 0, 802);

        //back
        this._temBack = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_17.png"), cc.Sprite.createWithSpriteFrameName("ui_button_18.png"), this, this.back);
        var mBack = cc.Menu.create(this._temBack);
        this.addChild(mBack, 20);
        mBack.setPosition(cc.p(0, 0));

        //options button
        this._menuBg = cc.Sprite.createWithSpriteFrameName(("ui_box_12.png"));
        this.addChild(this._menuBg, 30);

        //title
        this._title = cc.Sprite.createWithSpriteFrameName(ImageNameLang("button_other_aboutTitle.png", true));
        this.addChild(this._title, 31, 803);

        /*this._other_push = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName(ImageNameLang("button_other_039.png", true)));
        this._button_push = cc.MenuItemToggle.create(
            cc.MenuItemSprite.create(CSpriteLayer.getButtonBox("button_other_040.png", "ui_button_41.png", PlistAndPlist),
                CSpriteLayer.getButtonBox("button_other_040.png", "ui_button_41.png", PlistAndPlist)),
            cc.MenuItemSprite.create(CSpriteLayer.getButtonBox("button_other_040.png", "ui_button_42.png", PlistAndPlist),
                CSpriteLayer.getButtonBox("button_other_040.png", "ui_button_42.png", PlistAndPlist)),
         this, this.localPush);
        var closePush = GamePreference.getInstance().getCloseLocalPush();
        this._button_push.setSelectedIndex(closePush ? 1 : 0);*/

        this._button_BGM = cc.MenuItemToggle.create(
            cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_40_01.png"),
                cc.Sprite.createWithSpriteFrameName("ui_button_40_02.png")),
            cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_39_01.png"),
                cc.Sprite.createWithSpriteFrameName("ui_button_39_02.png")),
            this, this.mMusic);
        var closeMusic = GamePreference.getInstance().getPlayMusic();
        this._button_BGM.setSelectedIndex(closeMusic ? 1 : 0);

        this._button_music = cc.MenuItemToggle.create(
            cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_38_1.png"),
                cc.Sprite.createWithSpriteFrameName("ui_button_38_2.png")),
            cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_37_1.png"),
                cc.Sprite.createWithSpriteFrameName("ui_button_37_2.png")),
            this, this.sound);
        var closeSound = GamePreference.getInstance().getPlayEffect();
        this._button_music.setSelectedIndex(closeSound ? 1 : 0);

        // this._itemAbout = cc.MenuItemSprite.create(
        //     CSpriteLayer.getButtonBox(("ui_button_box03_01.png"), ImageNameLang("ui_button_35.png"), PlistAndPlist),
        //     CSpriteLayer.getButtonBox(("ui_button_box03_01.png"), ImageNameLang("ui_button_36.png"), PlistAndPlist),
        //     this, this.about);

        this._tutorial = cc.MenuItemSprite.create(
            CSpriteLayer.getButtonBox(("ui_button_box03_01.png"), ImageNameLang("button_other_034.png"), PlistAndPlist),
            CSpriteLayer.getButtonBox(("ui_button_box03_02.png"), ImageNameLang("button_other_035.png"), PlistAndPlist),
            this, this.tutorial);

        this.resetAllSpritePos();

        var mOptions = cc.Menu.create(/*this._button_push, this._other_push, */this._button_BGM, this._tutorial, this._button_music);
        this.addChild(mOptions, 30, 35);
        mOptions.setPosition(cc.PointZero());
    },
    getParentDeleaget:function () {
        return this._parentDeleaget;
    },
    setParentDeleaget:function (v) {
        this._parentDeleaget = v;
    },
    resetAllSpritePos:function () {
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._bg.setScale(Multiple);
        this._bg.setPosition(VisibleRect.center());
        this._temBack.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(73, -38)));
        this._menuBg.setPosition(VisibleRect.center());
        var menuBgTop = VisibleRect.top().y - (VisibleRect.rect().size.height - this._menuBg.getContentSize().height) / 2;
        this._title.setPosition(cc.p(VisibleRect.center().x, menuBgTop - 8 - this._title.getContentSize().height / 2));

        /*this._tutorial.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y - 125));
        this._other_push.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-64, 70)));
        this._button_push.setPosition(cc.pAdd(VisibleRect.center(), cc.p(64, 70)));
        this._button_BGM.setPosition(cc.pAdd(VisibleRect.center(), cc.p(60, -5)));
        this._button_music.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-60, -5)));
        this._itemAbout.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y - 65));*/

        this._tutorial.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y - 100));
        this._button_BGM.setPosition(cc.pAdd(VisibleRect.center(), cc.p(60, 35)));
        this._button_music.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-60, 35)));
        //this._itemAbout.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y - 30));
    }
});

OptionsLayer.create = function () {
    var ret = new OptionsLayer();
    if (ret && ret.init()) {
        return ret;
    }
};