var kMainMenuTag = 1;

var kShowFlowAdNotification = "kShowFlowAdNotification";
var kLightTagInit = 5432;

var StartMenuLayer = cc.Layer.extend({
    _title:null,
    _enterNewLayer:null,
    _bubbleId:0,
    _newGameItem:null,
    _sceneItem:null,
    _helpItem:null,
    _settingItem:null,
    _startMenu:null,
    _bg:null,
    _particle2:null,
    _particle3:null,

    ctor: function(){
        // cc.Layer.prototype.ctor.call(this);

        this._super();
        PlayerActor.sharedActor().playerLogin();

        //todo it should be load once enough.
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(res.StartMenuPlist);
        cache.addSpriteFrames(res.LogoScenePlist);
        cache.addSpriteFrames(res.ButtonsPlist);
        cache.addSpriteFrames(res.IconsPlist);
        cache.addSpriteFrames(res.ChestRewardsPlist);
        cache.addSpriteFrames(res.MainPlist);
        cache.addSpriteFrames(res.TutorialPlist);

        this._bg = new cc.Sprite(ImageName("ui_background_normal.jpg"));
        this.addChild(this._bg, 0);
        this._bg.setPosition(VisibleRect.center());
        this._bg.setScale(Multiple);

        //title
        this._title = LogoWaveLayer.create();
        this.addChild(this._title, 1);
        this._title.setPosition(cc.p(VisibleRect.rect().width / 2, VisibleRect.top().y - 140));

        this._initLight1(0);

        this._initWaterAnimation();

        this.initStartLayer();

        for (var i = 0; i < 8; i++) {
            var spriteLight = new cc.Sprite("#main_ui_other_01.png");
            this.addChild(spriteLight, 10, kLightTagInit + i);
        }

        this._initWaterLight(0);

        this.schedule(this._initWaterLight, 5.5);

        this._showVersionBuild();
    },

    _resizeHandler: function(){
        this.resetAllSpritePos();
    },
    _refResizeHandler: null,

    onEnter: function(){
        cc.Layer.prototype.onEnter.call(this);

        //add event listener
        this._refResizeHandler = this._resizeHandler.bind(this);
        window.addEventListener("resize", this._refResizeHandler);
    },

    onExit: function(){
        cc.Layer.prototype.onExit.call(this);
        window.removeEventListener("resize", this._refResizeHandler);
    },

    initStartLayer:function () {
        this._newGameItem = new cc.MenuItemSprite(
            CSpriteLayer.getButtonBoxOffsetY("btn_start_1.png", ImageNameLang("txt_start.png"), PlistAndPlist, 1),
            CSpriteLayer.getButtonBoxOffsetY("btn_start_2.png", ImageNameLang("txt_start.png"), PlistAndPlist, 1),
            this._menuNewGame, this);

        // item2 = Scenes select button
        this._sceneItem = new cc.MenuItemSprite(
            CSpriteLayer.getButtonBoxOffsetY("btn_scenes_1.png", ImageNameLang("button_other_014.png"), PlistAndPlist, 0),
            CSpriteLayer.getButtonBoxOffsetY("btn_scenes_2.png", ImageNameLang("button_other_014.png"), PlistAndPlist, 0),
            this._menuSelectStage, this );

        // item3 = Option button
        this._settingItem = new cc.MenuItemSprite(
            CSpriteLayer.getButtonBoxOffsetY("btn_bg_1.png", "main_ui_button_05.png", PlistAndPlist, 3),
            CSpriteLayer.getButtonBoxOffsetY("btn_bg_2.png", "main_ui_button_05.png", PlistAndPlist, 3),
            this._menuOption, this);

        // leftItem4 = Help button
        this._helpItem = new cc.MenuItemSprite(
            CSpriteLayer.getButtonBoxOffsetY("btn_bg_1.png", "main_ui_button_03.png", PlistAndPlist, 3),
            CSpriteLayer.getButtonBoxOffsetY("btn_bg_2.png", "main_ui_button_03.png", PlistAndPlist, 3),
            this._menuShowHowToPlay, this );

        this.resetAllSpritePos();

        var that = this;
        window.addEventListener("resize", function (event) {
            that.resetAllSpritePos();
        });

        var menu = new cc.Menu(this._newGameItem, this._sceneItem, this._settingItem, this._helpItem);
        menu.setPosition(0, 0);
        this.addChild(menu, eZOrder_MainMenu_StartMenu_menu, eTag_MainMenu_StartMenu_menu);
    },

    EnterSceneSelect:function () {
        GameCtrl.sharedGame().homeWithStage();
        var stageSelect = new StageSelectLayer();
        stageSelect.setDefaultPage(3);
    },
    cancelEnterSceneSelect:function () {
        if (this._enterNewLayer) {
            this._enterNewLayer.hide();
        }
    },
    _initWaterAnimation:function () {
        var rightPos = cc.p(VisibleRect.bottomRight().x - 260, VisibleRect.bottomRight().y + 100);
        var leftPos = cc.p(VisibleRect.bottomLeft().x + 157, VisibleRect.bottomLeft().y + 105);
        this._particle2 = new cc.ParticleSystem(ImageName("qipao3.plist"));
        this._particle2.ignoreColor(true);
        this._particle2.setTotalParticles(100);
        this._particle2.setDrawMode(cc.ParticleSystem.TEXTURE_MODE);
        this.addChild(this._particle2);
        this._particle2.setPosition(rightPos);

        this._particle3 = new cc.ParticleSystem(ImageName("qipao4.plist"));
        this.addChild(this._particle3);
        this._particle3.setTotalParticles(30);
        this._particle3.ignoreColor(true);
        this._particle3.setDrawMode(cc.ParticleSystem.TEXTURE_MODE);
        this._particle3.setPosition(leftPos);
    },
    _moveAction:function () {
        var moveto = new cc.MoveBy(5, cc.p(625, 0));
        var fadeOut = new cc.FadeOut(5);
        return new cc.Spawn(moveto, fadeOut);
    },
    _initWaterLight:function (dt) {
        for (var i = 0; i < 8; i++) {
            var spriteLight = this.getChildByTag(kLightTagInit + i);
            spriteLight.setPosition(cc.p(VisibleRect.left().x + 170 + Math.random() * 250,
                VisibleRect.topLeft().y - 50 + Math.random() * 40));
            var moveto = this._moveAction();
            spriteLight.runAction(moveto);
        }
    },
    _initLight1:function (sender) {
        if (sender) {
            sender.removeFromParentAndCleanup(true);
        }

        this._spriteLight1 = new cc.Sprite("#main_ui_other_02.png");

        this.addChild(this._spriteLight1, 10);
        this._spriteLight1.setPosition(cc.p(125 + Math.random() * 63, VisibleRect.top().y - this._spriteLight1.getContentSize().height / 2));
    },
    _menuNewGame:function (sender) {
        AutoAdapterScreen.getInstance().enterFullScreen();
        var mainMenu = GameCtrl.sharedGame().getCurScene();
        if (mainMenu == null || mainMenu.getIsSubLayer()) {
            return;
        }

        var startMenu = this.getChildByTag(eTag_MainMenu_StartMenu_menu);
        // startMenu.setTouchEnabled(false);
        startMenu.setEnabled(false);

        playEffect(BUTTON_EFFECT);

        var stage = wrapper.getIntegerForKey(UserDefaultsKeyPreviousPlayedStage);
        if (stage == 0) {
            stage = 1;
        }
        GameCtrl.sharedGame().newGame(stage);
        wrapper.logEvent("StartMenu", "Tap","Start button",1);
    },
    _menuSelectStage:function (sender) {
        var mainMenu = GameCtrl.sharedGame().getCurScene();
        if (mainMenu != null) {
            if (mainMenu.getIsSubLayer()) {
                return;
            }
            mainMenu.setIsSubLayer(true);
        }
        playEffect(BUTTON_EFFECT);

        var how = new StageSelectLayer();
        how.init();
        this.addChild(how, 100, 1313);
        wrapper.logEvent("StartMenu","Tap","Select Stage",1);
    },
    _menuShowHowToPlay:function (sender) {
        wrapper.setBooleanForKey("name", true);
        if (GameCtrl.sharedGame().getCurScene().getIsSubLayer()) {
            return;
        }
        //KingFisher cc.log("Tap How to play button");
        var main = GameCtrl.sharedGame().getCurScene();
        if (main) {
            main.setIsSubLayer(true);
        }

        var how = HowToPlayLayer.create();
        this.addChild(how, 100);
        wrapper.logEvent("StartMenu","Tap","How to play button",1);
    },
    _menuOption:function (sender) {
        if (GameCtrl.sharedGame().getCurScene().getIsSubLayer()) {
            return;
        }
        var pMain = GameCtrl.sharedGame().getCurScene();
        if (pMain) {
            pMain.setIsSubLayer(true);
        }
        //playEffect(BUTTON_EFFECT);

        var Options = OptionsLayer.create();
        this.addChild(Options, 100);
        wrapper.logEvent("StartMenu","Tap","Option",1);
    },
    _showVersionBuild:function () {
        var layer = new cc.Node();
        var versionInfo = g_Version;
        var versionTTFSize = new cc.Size(VisibleRect.rect().width, 24);
        var versionTTF = new cc.LabelTTF(versionInfo, "Arial Bold", 20, versionTTFSize, cc.TEXT_ALIGNMENT_RIGHT);
        versionTTF.setAnchorPoint(AnchorPointBottomRight);
        versionTTF.setPosition(cc.p(0, 30));
        layer.addChild(versionTTF, 0);

        //versionTTF.setPosition(cc.pAdd(VisibleRect.bottomRight(),cc.p(0, 30)));
        var buildInfo = "Powered by Cocos2d-html5";
        var buildTTFSize = new cc.Size(VisibleRect.rect().width, 24);
        var buildTTF = new cc.LabelTTF(buildInfo, "Arial Bold", 20, buildTTFSize, cc.TEXT_ALIGNMENT_RIGHT);
        buildTTF.setAnchorPoint(AnchorPointBottomRight);
        buildTTF.setPosition(cc.p(0, 5));
        layer.addChild(buildTTF, 0);
        layer.setAnchorPoint(AnchorPointBottomLeft);
        layer.setPosition(VisibleRect.bottomRight());
        this.addChild(layer, 100, 999);
    },
    resetAllSpritePos:function () {
        //version build
        var versionInfo = this.getChildByTag(999);
        if (versionInfo) {
            versionInfo.setPosition(VisibleRect.bottomRight());
        }

        this._title.setPosition(cc.p(VisibleRect.rect().width / 2, VisibleRect.top().y - 140));
        this._bg.setPosition(VisibleRect.center());
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._bg.setScale(Multiple);

        this._spriteLight1.setPosition(cc.p(125 + Math.random() * 63, VisibleRect.top().y - this._spriteLight1.getContentSize().height / 2));

        var winSize = VisibleRect.rect();
        var center = VisibleRect.center();
        var goldenSectionY = VisibleRect.bottom().y + winSize.height * (1 - 0.618);
        var selectItemY = Math.min(goldenSectionY / 2, goldenSectionY - (this._newGameItem.getContentSize().height + this._sceneItem.getContentSize().height) / 2);
        this._newGameItem.setPosition(cc.p(center.x, goldenSectionY));
        this._sceneItem.setPosition(cc.p(center.x, selectItemY));

        // Button on the left side
        var leftPosX = VisibleRect.bottomLeft().x;
        var leftPosY = VisibleRect.bottomLeft().y;

        leftPosX += this._settingItem.getContentSize().width;
        leftPosY += this._settingItem.getContentSize().height;
        this._settingItem.setPosition(new cc.Point(leftPosX, leftPosY));

        leftPosY += this._helpItem.getContentSize().height;
        this._helpItem.setPosition(new cc.Point(leftPosX, leftPosY));

        var rightPos = cc.p(VisibleRect.bottomRight().x - 260, VisibleRect.bottomRight().y + 100);
        var leftPos = cc.p(VisibleRect.bottomLeft().x + 157, VisibleRect.bottomLeft().y + 105);
        this._particle2.setPosition(rightPos);
        this._particle3.setPosition(leftPos);
    }
});