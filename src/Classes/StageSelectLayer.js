var STAGE_PAGE_NUM = 3;
var STAGE_2_PRICE_GOLD = 1000;
var StageUITag = {
    kStageUnLockTag:111,
    kStageActiveViewTag:112
};

var StageSelectLayer = cc.Layer.extend({
    _helpImages:0,
    _touchBegan:null,
    _helpLayer:0,
    _dragSpeed:0,
    _curIndex:null,
    _otherLeftButton:0,
    _otherRightButton:0,
    _curPageIndicator:[],
    _parentDeleaget:0,
    _showBuyLayer:false,
    _purchaseConfirmation:false,
    _exiting:false,
    _unLockLayer:0,
    _textBox:null,
    _returnButton:null,
    _currentPage:0,
    _actorCoinLabel:0,
    init:function(){
        this._super();
        this._helpImages = [];
        this._curIndex = 1;
        //todo use event Manager
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, false);

        return true;
    },
    onEnter:function () {
        this._super();

        //todo use event manager
        //this.setKeyboardEnabled(true);

        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(ImageNameLang("StageSelectLayer.plist"));
        cache.addSpriteFrames(ImageNameLang("StageSelectLayer3.plist"));

        this.drawHelpImages();
        this.drawBackGround();
        this.drawReturnButton();
        this.drawPageControl();

        var that = this;
        window.addEventListener("resize", function (event) {
            that.resetAllSpritePos();
        });
    },
    onExit:function(){
        this._super();
        var cache = cc.spriteFrameCache;
        cache.removeSpriteFrameByName(ImageNameLang("StageSelectLayer.plist"));
        cache.removeSpriteFrameByName(ImageNameLang("StageSelectLayer3.plist"));

        this._helpImages = [];
        this._curPageIndicator = [];
    },
    keyBackClicked:function () {
        if (this._showBuyLayer) {
            return;
        }
        this.schedule(this.scheduleBack);
    },
    MoneyNum:function (Money) {
        var Num = 0;
        while (Money) {
            Money /= 10;
            Num++;
        }
        return Num;
    },
    updateCurrentPage:function () {
        switch (this._currentPage) {
            case 0:
                this._otherLeftButton.setVisible(false);
                this._otherRightButton.setVisible(true);
                break;
            case STAGE_PAGE_NUM - 1:
                this._otherLeftButton.setVisible(true);
                this._otherRightButton.setVisible(false);
                break;
            default:
                this._otherLeftButton.setVisible(true);
                this._otherRightButton.setVisible(true);
                break;
        }
        this.updateIndicators();
    },
    useCoin:function () {
        if (PlayerActor.sharedActor().getPlayerMoney() > STAGE_2_PRICE_GOLD) {
            this._purchaseConfirmation = true;
            if (confirm(cc.LocalizedString.localizedString("buy"))) {
                this.clickedButtonAtIndex(1);
            } else {
                this.clickedButtonAtIndex(0);
            }
        }
        else {
            var titleStr = cc.LocalizedString.localizedString("Sorry");
            var likeStr = cc.LocalizedString.localizedString("Money is not enough");
            alert(titleStr + " " + likeStr);
            this._unLockLayer.getMenu().setTouchEnabled(true);
        }
    },
    judgeLevel:function () {
        // 等级大于10级开启
        if (PlayerActor.sharedActor().getPlayerLevel() >= 10) {
            var titleStr = cc.LocalizedString.localizedString("buy");
            alert(titleStr);
        }
        else {
            var titleStr = cc.LocalizedString.localizedString("Sorry");
            var likeStr = cc.LocalizedString.localizedString("Money is not enough");
            alert(titleStr + likeStr);
        }
    },
    useMoney:function () {
        /*if (false == IAP.networkReachable()) {
            IAP.networkUnReachableNotify();
            return;
        }
        this._unLockLayer.removeFromParentAndCleanup(true);


        this._showBuyLayer = false;
        AppDelegate.sharedApplication().requestNewStage(currentPage);
        this.removeChildByTag(StageUITag.kStageUnLockTag, true);*/
    },
    regestTouch:function () {
        this._showBuyLayer = false;
        this.setUnLockLayer(0);
    },
    tipforUnlockStage:function () {
        // 解锁成功
        alert(cc.LocalizedString.localizedString("The State have been unlocked"));

        var _currentPage = this._currentPage + 1;
        this.unLockStageOK(_currentPage);
    },
    showPurchaseUI:function (stage) {
        if (this._showBuyLayer)
            return;

        this._showBuyLayer = true;
        var lockLayer = new UnLockStageLayer();
        lockLayer.initWithDelegate(this, stage);
        this.setUnLockLayer(lockLayer);
        this.addChild(this.getUnLockLayer(), 10, StageUITag.kStageUnLockTag);
    },

    otherLeft:function (sender) {
        if (this._currentPage != 0 && !this._showBuyLayer) {
            this._currentPage--;
            var Move = cc.MoveTo.create(0.2, cc.p(-screenWidth * this._currentPage, this._helpLayer.getPosition().y));
            var call = cc.CallFunc.create(this, this.updateCurrentPage);
            this._helpLayer.runAction(cc.Sequence.create(Move, call, 0));
        }
    },

    otherRight:function (sender) {
        if (this._currentPage != STAGE_PAGE_NUM - 1 && !this._showBuyLayer) {
            this._currentPage++;
            var Move = cc.MoveTo.create(0.2, cc.p(-screenWidth * this._currentPage, this._helpLayer.getPosition().y));
            var call = cc.CallFunc.create(this, this.updateCurrentPage);
            this._helpLayer.runAction(cc.Sequence.create(Move, call, 0));
        }
    },
    back:function (sender) {
        if (this._showBuyLayer) {
            return;
        }

        if (this._parentDeleaget) {
            this._parentDeleaget.resetMenu();
        }
        else {
            var scene = GameCtrl.sharedGame().getCurScene();
            if (scene) {
                scene.setIsSubLayer(false);
            }
        }

        //use event manager
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParentAndCleanup(true);
    },
    showAchievements:function (sender) {
    },
    showHiScore:function (sender) {
    },
    updateUI:function (dt) {
    },

    SetDefaultPage:function (pageNum) {
        this._currentPage = pageNum - 1;
        this._helpLayer.setPosition(cc.p(-screenWidth * this._currentPage, this._helpLayer.getPosition().y));
        this.updateCurrentPage();
    },

    onTouchBegan:function (touch, event) {
        if (this._showBuyLayer) {
            return false;
        }

        this._touchBegan = touch.getLocation();
        return true;
    },
    onTouchMoved:function (touch, event) {
        if (this._showBuyLayer) {
            return;
        }
        var touchPoint = touch.getLocation();
        var touchEnd = touch.getPreviousLocation();
        var offsetX = touchPoint.x - touchEnd.x;
        var layerX = this._helpLayer.getPosition().x + offsetX;

        this._helpLayer.setPosition(cc.p(layerX, this._helpLayer.getPosition().y));
    },
    onTouchEnded:function (touch, event) {
        if (this._showBuyLayer || this._exiting) {
            return;
        }
        var touchPoint = touch.getLocation();
        var distance = this._touchBegan.x - touchPoint.x;

        if (Math.abs(distance) > 60 && this._helpLayer.getPosition().x <= 0 && this._helpLayer.getPosition().x >= -(VisibleRect.rect().width) * (STAGE_PAGE_NUM - 1)) {
            if (distance < 0) {
                this.otherLeft(null);
            }
            else {
                this.otherRight(null);
            }
        }
        else {
            var x = -(this._currentPage * VisibleRect.rect().width);
            var Move = cc.MoveTo.create(0.2, cc.p(x, this._helpLayer.getPosition().y));
            var call = cc.CallFunc.create(this, this.updateCurrentPage);
            this._helpLayer.runAction(cc.Sequence.create(Move, call, 0));
        }
    },

    delegateAsObject:function () {
        return this;
    },
    clickedButtonAtIndex:function (buttonIndex) {
        // 取消
        if (buttonIndex == 0) {
            if (1) {
                this._unLockLayer.closeself(0);
            }
            else if (this._unLockLayer) {
                this._unLockLayer.getMenu().setTouchEnabled(true);
            }
        }
        //购买
        else if (buttonIndex = 1) {
            var sharedActor = PlayerActor.sharedActor();
            PlayerActor.sharedActor().getStageArray()[this._currentPage] = "1";
            sharedActor.setPlayerMoney(sharedActor.getPlayerMoney() - STAGE_2_PRICE_GOLD);
            sharedActor.savePlayerEntiy();
            this.tipforUnlockStage();
            this._unLockLayer.closeself(0);
            this._showBuyLayer = false;
            this._purchaseConfirmation = false;
        }
        else if (buttonIndex == 2) {

        }
    },

    getParentDeleaget:function () {
        return this._parentDeleaget;
    },
    setParentDeleaget:function (v) {
        this._parentDeleaget = v;
    },

    getShowBuyLayer:function () {
        return this._showBuyLayer;
    },
    setShowBuyLayer:function (v) {
        this._showBuyLayer = v;
    },

    getPurchaseConfirmation:function () {
        return this._purchaseConfirmation;
    },
    setPurchaseConfirmation:function (v) {
        this._purchaseConfirmation = v;
    },

    getIsExiting:function () {
        return this._exiting;
    },
    setIsExiting:function (v) {
        this._exiting = v;
    },
    getUnLockLayer:function () {
        return this._unLockLayer;
    },
    setUnLockLayer:function (v) {
        if (this._unLockLayer != v) {
            this._unLockLayer = v;
        }
    },
    getCurrentPage:function () {
        return this._currentPage;
    },
    setCurrentPage:function (curIndex) {
        this._currentPage = curIndex;
        var Move = cc.MoveTo.create(0.2, cc.p(-screenWidth * this._currentPage, this._helpLayer.getPosition().y));
        var call = cc.CallFunc.create(this, this.updateCurrentPage);
        this._helpLayer.runAction(cc.Sequence.create(Move, call, 0));
    },
    drawBackGround:function () {
        this._bg = cc.Sprite.create(ImageName("ui_background_normal.jpg"));
        this.addChild(this._bg, 3);
        this._bg.setScale(Multiple);
        this._bg.setPosition(VisibleRect.center());
    },
    drawHelpImages:function () {
        cc.spriteFrameCache.addSpriteFrames(ImageName("buttons.plist"));
        cc.spriteFrameCache.addSpriteFrames(ImageName("stage.plist"));
        this._helpLayer = cc.Layer.create();
        this.addChild(this._helpLayer, 8, 30);

        var file, title, topDes, bottomDes;

        var itemOffset = 2;

        for (var i = 1; i <= STAGE_PAGE_NUM; i++) {
            file = "UI_selectStage_" + i + ".png";
            title = ImageNameLang("UI_select_title_" + i + ".png", true);
            topDes = ImageNameLang("UI_select_topdes_" + i + ".png", true);
            bottomDes = "UI_select_bottomdes_" + i + ".png";

            var page = new HelpStageSelLayer();
            page.initWithBg(file, title, topDes, ImageNameLang(bottomDes));
            page.setPosition(cc.p(VisibleRect.center().x + (i - 1) * screenWidth - 2.0, VisibleRect.center().y - 30));
            this._helpLayer.addChild(page, 8, i + 2);

            var btnPageIndicator = new cc.MenuItemToggle(
                new cc.MenuItemSprite(
                    new cc.Sprite("#UI_select_slider_2.png"), new cc.Sprite("#UI_select_slider_1.png")),
                    this.indicatorClick, this);
            this.addChild(btnPageIndicator, 8, i * 30 + i);
            this._curPageIndicator[i - 1] = btnPageIndicator;
            if (1 == i) {
                btnPageIndicator.selected();
            }
            else {
                btnPageIndicator.unselected();
            }

            if (i == STAGE_PAGE_NUM) {
                break;
            }

            var str = PlayerActor.sharedActor().getStageArray()[i - 1];
            var value = (parseInt(str) == 1);

            // 判断玩家等级是否大于10级 转换开始游戏按钮
            if (PlayerActor.sharedActor().getPlayerLevel() >= 10) {
                value = true;
            }

            var PlayerItem, markBackground, markLock;
            if (!value) {
                PlayerItem = new cc.MenuItemSprite(
                    CSpriteLayer.getButtonBoxOffsetY(("ui_button_box04_01.png"), ImageNameLang("UI_select_button_3.png"), PlistAndPlist, itemOffset),
                    CSpriteLayer.getButtonBoxOffsetY(("ui_button_box04_02.png"), ImageNameLang("UI_select_button_4.png"), PlistAndPlist, itemOffset),
                    this.buyLayer, this);

                markBackground = new cc.Sprite("#map_btn_1.png");
                markLock = new cc.Sprite("#map_mark_2.png");
            }
            else {
                PlayerItem = cc.MenuItemSprite.create(
                    CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_01.png"), ImageNameLang("UI_select_button_1.png"), PlistAndPlist, itemOffset),
                    CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_02.png"), ImageNameLang("UI_select_button_2.png"), PlistAndPlist, itemOffset),
                    this.playGame, this);

                markBackground = new cc.Sprite("#map_btn_1.png");
                markLock = new cc.Sprite("#map_mark_1.png");
            }


            var menu = new cc.Menu(PlayerItem);
            menu.setContentSize(page.getContentSize());
            menu.setPosition(cc.p(page.getContentSize().width/2,page.getContentSize().height/2));
            page.addChild(menu, 9, i * 20 + 2);


            PlayerItem.setAnchorPoint(cc.p(0.5, 0.5));
            PlayerItem.setPosition(cc.p(20,-page.getContentSize().height/2 + 70));
            PlayerItem.setTag(999 + i);

            markBackground.setAnchorPoint(cc.PointZero());
            page.addChild(markBackground, 10, 160 + i);

            markLock.setAnchorPoint(cc.PointZero());
            page.addChild(markLock, 11, 230 + i);

            var lockPos = cc.p(0, 0);
            switch (i) {
                case 1:
                    lockPos = cc.p(260, 290);
                    break;
                case 2:
                    lockPos = cc.p(202, 203);
                    break;
                case 3:
                    lockPos = cc.p(112, 63);
                    break;
                default:
                    break;
            }

            markBackground.setPosition(lockPos);
            markLock.setPosition(lockPos);
        }
    },
    drawReturnButton:function () {
        cc.spriteFrameCache.addSpriteFrames(ImageName("stage.plist"));
        this._returnButton = new cc.MenuItemSprite(new cc.Sprite("#ui_button_17.png"),
            new cc.Sprite("#ui_button_18.png"), this.back, this);

        this._otherLeftButton = new cc.MenuItemSprite(new cc.Sprite("#button_other_033.png"),
            new cc.Sprite("#button_other_032.png"), this.otherLeft, this);

        this._otherRightButton = new cc.MenuItemSprite(new cc.Sprite("#button_other_033.png"),
            new cc.Sprite("#button_other_032.png"), this.otherRight, this);

        var mBack = new cc.Menu(this._returnButton, this._otherLeftButton, this._otherRightButton);
        this.addChild(mBack, 30);
        mBack.setPosition(cc.p(0, 0));
        this._returnButton.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(73, -38)));

        this._otherLeftButton.setPosition(cc.pAdd(VisibleRect.left(), cc.p(100, -34)));
        this._otherRightButton.setPosition(cc.pAdd(VisibleRect.right(), cc.p(-80, -34)));
        this._otherLeftButton.setRotation(180);

        this._otherLeftButton.setVisible(false);

        //todo
        var ActorStr = PlayerActor.sharedActor().getPlayerMoney() + "";

        var fontW = 14;
        var fontH = 22;

        this._actorCoinLabel = new cc.LabelAtlas(ActorStr, ImageName("ui_select_txt_01.png"), fontW, fontH, '0');

        this._textBox = new cc.Sprite("#btn_gold_1.png");
        this._textBox.setAnchorPoint(cc.p(0.5, 0.5));
        this._textBox.setPosition(cc.p(VisibleRect.right().x - this._textBox.getContentSize().width / 2, VisibleRect.top().y - this._textBox.getContentSize().height / 2 - 5));
        this.addChild(this._textBox, 19);

        this._actorCoinLabel.setPosition(cc.pAdd(this._textBox.getPosition(), cc.p(15, 0.0)));
        this._actorCoinLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(this._actorCoinLabel, 20, 99);
    },
    drawPageControl:function () {
    },

    updateIndicators:function () {
        for (var i = 0; i < STAGE_PAGE_NUM; i++) {
            if ((i == this._currentPage) && this._curPageIndicator[i]) {
                this._curPageIndicator[i].selected();
            }
            else {
                this._curPageIndicator[i].unselected();
            }
        }
    },
    indicatorClick:function (sender) {
    },
    closeHelpLayer:function () {
    },
    playGame:function (sender) {
        playEffect(BUTTON_EFFECT);
        GameCtrl.sharedGame().newGame(this._currentPage + 1);
        //todo use event manager
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParent(true);
    },
    buyLayer:function (sender) {
        //this.showPurchaseUI(2);
        var _currentPage = this._currentPage + 1;
        this.showPurchaseUI(_currentPage);
    },
    unLockStageOK:function (i) {
        var page = this._helpLayer.getChildByTag(i + 2);
        page.removeChildByTag(i * 20 + 2, true);

        var PlayerItem = new cc.MenuItemSprite(
            CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_02.png"), ImageNameLang("UI_select_button_2.png"), PlistAndPlist, 2),
            CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_01.png"), ImageNameLang("UI_select_button_1.png"), PlistAndPlist, 2),
            this.playGame, this);

        page.removeChildByTag(230 + i, true);
        var markLock = new cc.Sprite("#map_mark_1.png");

        var strMoney = PlayerActor.sharedActor().getPlayerMoney();
        this.getChildByTag(99).setString(strMoney + "");

        var menu = new cc.Menu(PlayerItem);
        menu.setContentSize(page.getContentSize());
        menu.setPosition(cc.p(page.getContentSize().width/2,page.getContentSize().height/2));
        page.addChild(menu, 9, i * 20 + 2);


        PlayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        PlayerItem.setPosition(cc.p(20,-page.getContentSize().height/2 + 70));
        PlayerItem.setTag(999 + i);

        markLock.setAnchorPoint(cc.PointZero());
        page.addChild(markLock, 11, 230 + i);

        var lockPos = cc.p(0, 0);
        switch (i) {
            case 1:
                lockPos = cc.p(260, 290);
                break;
            case 2:
                lockPos = cc.p(202, 203);
                break;
            case 3:
                lockPos = cc.p(112, 63);
                break;
            default:
                break;
        }
        markLock.setPosition(lockPos);
    },
    scheduleBack:function () {
        this.unschedule(this.scheduleBack);
        this.back(0);
    },
    resetAllSpritePos:function () {
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._bg.setScale(Multiple);
        this._bg.setPosition(VisibleRect.center());

        for (var i = 0; i < this._curPageIndicator.length; i++) {
            var btnPageIndicatorStartPosX = VisibleRect.center().x - (PAGE_INDICATOR_INTERVAL * (STAGE_PAGE_NUM - 1) / 2);
            var btnPageIndicator = this._curPageIndicator[i];
            btnPageIndicator.setPosition(cc.p(btnPageIndicatorStartPosX + (i - 1) * PAGE_INDICATOR_INTERVAL, VisibleRect.bottom().y + 30));
        }


        this._returnButton.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(73, -38)));
        this._textBox.setPosition(cc.p(VisibleRect.right().x - this._textBox.getContentSize().width / 2, VisibleRect.top().y - this._textBox.getContentSize().height / 2 - 5));
        this._actorCoinLabel.setPosition(cc.pAdd(this._textBox.getPosition(), cc.p(15, 0.0)));
        this._otherLeftButton.setPosition(cc.pAdd(VisibleRect.left(), cc.p(100, -34)));
        this._otherRightButton.setPosition(cc.pAdd(VisibleRect.right(), cc.p(-80, -34)));


        var page;
        for (var i = 1; i <= STAGE_PAGE_NUM; i++) {
            page = this._helpLayer.getChildByTag(i+2);
            if(page){
                page.setPosition(cc.p(VisibleRect.center().x + (i - 1) * screenWidth - 2.0, VisibleRect.center().y - 30));
            }
        }
    }
});

StageSelectLayer.getInstance = function () {
    var ret = new StageSelectLayer();
    if (ret.init()) {
        return ret;
    }
    return null;
};

var EnterStage = StageSelectLayer.extend({
    clickedButtonAtIndex:function (buttonIndex) {
        if (buttonIndex == getAlertView().getCancelButtonIndex()) {
        }
        else if (1 == buttonIndex) {
            // 返回场景选择界面
            PlayerActor.sharedActor().getScene().backToSelect();
        }
        else if (2 == buttonIndex) {

        }
    }
});