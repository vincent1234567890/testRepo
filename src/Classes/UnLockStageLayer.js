var SUPPORT_UNLOCK_BY_MONEY = 0;
var UnLockStageLayer = cc.Layer.extend({
    _stageDelegate:null,
    _menu:null,
    _scene:null,
    initWithDelegate:function (de, le) {
        cc.spriteFrameCache.addSpriteFrames(ImageNameLang("UnlockStageLayer.plist"));

        this._stageDelegate = de;
        var bgSprite = new cc.Sprite("#ui_other_021.png");
        this.addChild(bgSprite);
        bgSprite.setPosition(VisibleRect.center());

        var titleSprite = new cc.Sprite("#" + ImageNameLang("fonts_other_010.png", true));
        this.addChild(titleSprite, 1);
        titleSprite.setPosition(cc.p(VisibleRect.center().x, bgSprite.getPosition().y + 140));

        if (le < 3) {

            if (SUPPORT_UNLOCK_BY_MONEY) {
                var label = cc.LabelTTF.create(cc.LocalizedString.localizedString("StageTip"), "Microsoft YaHei", 30);
                this.addChild(label, 1);
                label.setPosition(cc.p(VisibleRect.center().x, bgSprite.getPosition().y - 30));
            }
            var coinMenuItem = new cc.Sprite("#" + ImageNameLang("button_other_020.png", true));
            var coinMenuItemd = new cc.Sprite("#" + ImageNameLang("button_other_021.png", true));
            var coinItem = cc.MenuItemSprite.create(coinMenuItem, coinMenuItemd, this, this.useCoin);

            if (SUPPORT_UNLOCK_BY_MONEY) {
                var moneyMenuItem = new cc.Sprite("#" + ImageNameLang("button_other_023.png", true));
                var moneyMenuItemd = new cc.Sprite("#" + ImageNameLang("button_other_022.png", true));
                var moneyItem = cc.MenuItemSprite.create(moneyMenuItem, moneyMenuItemd, this, this.useMoney);
            }
            var cancelMenuItem = new cc.Sprite("#button_other_025.png");
            var cancelMenuItemd = new cc.Sprite("#button_other_024.png");
            var cancelItem = cc.MenuItemSprite.create(cancelMenuItem, cancelMenuItemd, this, this.closeself);
            if (SUPPORT_UNLOCK_BY_MONEY) {
                coinItem.setPosition(cc.p(-60, -130));
                moneyItem.setPosition(cc.p(80, -130));
            } else {
                coinItem.setPosition(cc.p(0, -100));
            }
            cancelItem.setPosition(cc.p(bgSprite.getContentSize().width / 2, bgSprite.getContentSize().height / 2));
            if (SUPPORT_UNLOCK_BY_MONEY) {
                this._menu = cc.Menu.create(coinItem, moneyItem, cancelItem);
            } else {
                this._menu = cc.Menu.create(coinItem, cancelItem);
            }
            this.addChild(this._menu);
        }
        else {
//            // 第三个地图 加勒比  不能使用金币购买 需要等级控制
//            var judgeLevelMenuItem  = new cc.Sprite("#" + ImageNameLang("button_other_020.png",true));
//            var judgeLevelMenuItemd = new cc.Sprite("#" + ImageNameLang("button_other_021.png",true));
//            var judgeLevelItem = cc.MenuItemSprite.create(judgeLevelMenuItem, judgeLevelMenuItemd, this, menu_selector(UnLockStageLayerBase.judgeLevel));
//            judgeLevelItem.setPosition(cc.p(0, -50));
//
//            var cancelMenuItem1  = cc.Sprite.create(ImageName("button_other_025.png"));
//            var cancelMenuItemd1 = cc.Sprite.create(ImageName("button_other_024.png"));
//            var cancelItem1 = cc.MenuItemSprite.create(cancelMenuItem1, cancelMenuItemd1, this, menu_selector(UnLockStageLayerBase.closeself));
//            cancelItem1.setPosition(cc.p(bgSprite.getContentSize().width / 2, bgSprite.getContentSize().height / 2));
//            menu = cc.Menu.create(judgeLevelItem,cancelItem1);
            var cancelMenuItem1 = new cc.Sprite("#button_other_025.png");
            var cancelMenuItemd1 = new cc.Sprite("#button_other_024.png");
            var cancelItem1 = cc.MenuItemSprite.create(cancelMenuItem1, cancelMenuItemd1, this, this.closeself);
            cancelItem1.setPosition(cc.p(bgSprite.getContentSize().width / 2, bgSprite.getContentSize().height / 2));
            this._menu = cc.Menu.create(cancelItem1);

            var shijichengjiu = new cc.Sprite("#10jichengjiu.png");
            this.addChild(shijichengjiu, 1);
            shijichengjiu.setScale(0.8);
            shijichengjiu.setPosition(cc.p(VisibleRect.center().x + 70, VisibleRect.center().y - 30));
            this.addChild(this._menu);
        }
        if (le == 2) {
            var acLayer = new AchievementShareLayer();
            acLayer.initWithIndex(AchievementIndex.eAchievement34, false);
            this.addChild(acLayer);
            acLayer.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y + 45));
            acLayer.setScale(0.7);
        }


        // 加勒比海场景解锁界面
        /*if (le == 3) {
         var strSuffix = cc.Application.getCurrentLanguage();
         var strGainPre = "_none";
         cc.spriteFrameCache.addSpriteFrames("AchieveIconTP.plist");
         var pBgSprite = cc.Sprite.create("ui_ach_003.png");
         pBgSprite.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y + 40));
         pBgSprite.setScale(0.7);
         this.addChild(pBgSprite, 0, AchiveUITag.kAchieveBgTag);

         var strScoreBg = "ui_ach_005.png";
         var pScoreBgSprite = cc.Sprite.create(strScoreBg);
         this.addChild(pScoreBgSprite, 2, AchiveUITag.kAchieveScoreBgTag);
         pScoreBgSprite.setPosition(cc.p(VisibleRect.center().x + 60, VisibleRect.center().y + 40));
         pScoreBgSprite.setScale(0.7);

         var pAchieveArray = GameSetting.getInstance().getAchieveArray();
         var pDic = pAchieveArray[AchievementIndex.eAchievement47];
         var strTitle = pDic["ItemTitle" + strSuffix];
         var pTitle = cc.LabelTTF.create(strTitle, "Arial", 15);
         this.addChild(pTitle, 1, AchiveUITag.kAchieveTitleTag);
         pTitle.setPosition(cc.p(VisibleRect.center().x - 25, VisibleRect.center().y + 40));
         pTitle.setColor(cc.black());
         pTitle.setScale(0.6);

         var strDescription = pDic["ItemDescription" + strSuffix + strGainPre];
         var pDescLabel = cc.LabelTTF.create(strDescription, "Arial", 13*/
        /*cc.Size (160, 30), cc.TextAlignmentLeft*/
        /*);
         this.addChild(pDescLabel, 1, AchiveUITag.kAchieveTitleTag);
         pDescLabel.setPosition(cc.p(VisibleRect.center().x - 15, VisibleRect.center().y - 30));
         pDescLabel.setScale(0.8);
         }*/


        this.setScale(kUiItemScale);
        return true;
    },
    initWithLevel:function (scene) {
        //cc.spriteFrameCache.addSpriteFrames(ImageNameLang("UnlockStageLayer.plist"));
        this.m_pScence = scene;
        if (this._super()) {
            var bgSprite = new cc.Sprite("#ui_other_021.png");
            this.addChild(bgSprite);
            bgSprite.setPosition(VisibleRect.center());

            cc.spriteFrameCache.addSpriteFrames(ImageNameLang("StageSelectLayer.plist"));
            var EnterItem = cc.MenuItemSprite.create(
                CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_01.png"), ImageNameLang("UI_select_button_1.png"), PlistAndPlist, 2),
                CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_02.png"), ImageNameLang("UI_select_button_2.png"), PlistAndPlist, 2),
                this, this.enterNewLevelScence);
            EnterItem.setPosition(cc.p(VisibleRect.center().x - 50, VisibleRect.center().y - 80));
            //this.addChild(cc.Menu.create(EnterItem,0), 9, 820+2);
            this.addChild(EnterItem);

            var CloseItem = cc.MenuItemSprite.create(
                CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_01.png"), ImageNameLang("UI_select_button_1.png"), PlistAndPlist, 2),
                CSpriteLayer.getButtonBoxOffsetY(("ui_button_box03_02.png"), ImageNameLang("UI_select_button_2.png"), PlistAndPlist, 2),
                this, this.cancel);
            //CloseItem.setAnchorPoint(cc.p(0.5,0.5));
            CloseItem.setPosition(cc.p(VisibleRect.center().x + 50, VisibleRect.center().y - 80));
            this.addChild(CloseItem);

            return true;
        }

        return false;
    },
    onExit:function(){
        cc.spriteFrameCache.removeSpriteFrameByName(ImageNameLang("UnlockStageLayer.plist"));
    },
    enterNewLevelScence:function (sender) {
        // 返回场景选择
        this.m_pScence.backToSelect();
        //stageDelegate.setCurrentPage(2);
    },
    cancel:function (sender) {
        this.closeself();
    },
    keyBackClicked:function () {
        this.closeself();
    },
    useCoin:function (sender) {
        this.schedule(this.doUseCoin);
    },
    judgeLevel:function (sender) {
        this.schedule(this.dojudgeLevel);
    },
    useMoney:function (sender) {
        this.schedule(this.doUseMoney);
    },
    closeself:function (sender) {
        this._stageDelegate.regestTouch();
        this._stageDelegate.setShowBuyLayer(false);
        cc.spriteFrameCache.removeSpriteFrameByName(ImageNameLang("UnlockStageLayer.plist"));
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParentAndCleanup(true);
    },
    getStageDelegate:function () {
        return this._stageDelegate;
    },
    setStageDelegate:function (v) {
        this._stageDelegate = v;
    },
    getMenu:function () {
        return this._menu;
    },
    setMenu:function (v) {
        this._menu = v;
    },
    doUseCoin:function () {
        this.unschedule(this.doUseCoin);
        this._menu.setTouchEnabled(false);
        this._stageDelegate.useCoin();
    },
    doUseMoney:function () {
        this.unschedule(this.doUseMoney);
        this._menu.setTouchEnabled(false);
        this._stageDelegate.useMoney();
    },
    dojudgeLevel:function () {
        this.unschedule(this.dojudgeLevel);
        this._menu.setTouchEnabled(false);
        this._stageDelegate.judgeLevel();
    }
});