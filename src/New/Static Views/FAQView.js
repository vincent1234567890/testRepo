/**
 * Created by eugeneseah on 5/4/17.
 */

const FAQView = (function () {
    "use strict";
    const ZORDER = 10;
    let _parent;
    let _popup;
    let tabHeight = 600;
    let sideButtonX = 910;
    let sideSpacing = 100;
    let sideStart = 550;

    const titleX = 175;
    const titleY = 575;

    let _gameRules;
    let _uiFaq;
    let _fishInfo;
    let _cannonInfo;
    let _jackpotInfo;

    let _forceRedraw = false;

    const FAQView = function (forceRedraw) {
        _forceRedraw = forceRedraw;
        if (forceRedraw) {
            GameView.destroyView(_parent);
            _gameRules = null;
            _gameRules = null;
            _uiFaq = null;
            _fishInfo = null;
            _cannonInfo = null;
            _jackpotInfo = null;
        }
        _parent = new cc.Node();
        _popup = new FloatingMenuPopupBasePrefab(dismissCallback);
        if (!cc.spriteFrameCache.getSpriteFrame(ReferenceName.FAQButtonBackground))
            cc.spriteFrameCache.addSpriteFrames(res.MenuFAQPlist);

        const textBG = new cc.Sprite(ReferenceName.FAQTextBackground);
        const title = new cc.Sprite(ReferenceName.FAQTitleChinese);

        const userAgreementTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground, ReferenceName.FAQTabBackgroundOnPress, onUserAgreementTabClicked);
        const faqTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground, ReferenceName.FAQTabBackgroundOnPress, onFAQTabClicked);

        const userAgreementTabTitleText = new cc.Sprite(ReferenceName.FAQUserAgreementTitleChinese);
        const faqTabTitleText = new cc.Sprite(ReferenceName.FAQTabTitleChinese);

        userAgreementTabTitleText.setAnchorPoint(0, 0);
        faqTabTitleText.setAnchorPoint(0, 0);

        userAgreementTab.addChild(userAgreementTabTitleText);
        faqTab.addChild(faqTabTitleText);

        userAgreementTab.setAnchorPoint(0.2, 0.5);
        faqTab.setAnchorPoint(0.2, 0.5);

        const userAgreementRollover = new RolloverEffectItem(userAgreementTab, undefined, undefined, onTabHover, onTabUnhover);
        const faqRollover = new RolloverEffectItem(faqTab, undefined, undefined, onTabHover, onTabUnhover);

        const gameRules = GUIFunctions.createButton(ReferenceName.FAQButtonBackground, ReferenceName.FAQButtonBackgroundOnPress, onGameRulesClicked);
        const uiFAQ = GUIFunctions.createButton(ReferenceName.FAQButtonBackground, ReferenceName.FAQButtonBackgroundOnPress, onUiFaqClicked);
        const fishInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground, ReferenceName.FAQButtonBackgroundOnPress, onFishInfoClicked);
        const cannonInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground, ReferenceName.FAQButtonBackgroundOnPress, onCannonInfoClicked);
        const jackpotInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground, ReferenceName.FAQButtonBackgroundOnPress, onJackpotInfoClicked);

        const gameRulesButtonText = new cc.Sprite(ReferenceName.FAQGameRulesButtonText);
        const uiFAQButtonText = new cc.Sprite(ReferenceName.FAQUIFaqButtonText);
        const fishInfoButtonText = new cc.Sprite(ReferenceName.FAQFishInfoButtonText);
        const cannonInfoButtonText = new cc.Sprite(ReferenceName.FAQCannonInfoButtonText);
        const jackpotInfoButtonText = new cc.Sprite(ReferenceName.FAQJackpotInfoButtonText);

        const pos = new cc.p(gameRules.getContentSize().width / 2, gameRules.getContentSize().height / 2);

        console.log(gameRules, gameRules.getContentSize(), pos);

        gameRulesButtonText.setPosition(pos);
        uiFAQButtonText.setPosition(pos);
        fishInfoButtonText.setPosition(pos);
        cannonInfoButtonText.setPosition(pos);
        jackpotInfoButtonText.setPosition(pos);

        gameRules.addChild(gameRulesButtonText);
        uiFAQ.addChild(uiFAQButtonText);
        fishInfo.addChild(fishInfoButtonText);
        cannonInfo.addChild(cannonInfoButtonText);
        jackpotInfo.addChild(jackpotInfoButtonText);

        textBG.setPosition(new cc.p(420, 350));
        textBG.setScaleY(1.05);
        title.setPosition(new cc.p(560, 705));

        _popup.getBackground().addChild(textBG);
        _popup.getBackground().addChild(title);

        // _popup.getBackground().addChild(userAgreementTab);
        // _popup.getBackground().addChild(faqTab);

        _popup.getBackground().addChild(gameRules);
        _popup.getBackground().addChild(uiFAQ);
        _popup.getBackground().addChild(fishInfo);
        _popup.getBackground().addChild(cannonInfo);
        _popup.getBackground().addChild(jackpotInfo);

        userAgreementTab.setPosition(130, tabHeight);
        faqTab.setPosition(310, tabHeight);

        gameRules.setPosition(sideButtonX, sideStart);
        uiFAQ.setPosition(sideButtonX, sideStart - sideSpacing);
        fishInfo.setPosition(sideButtonX, sideStart - sideSpacing * 2);
        cannonInfo.setPosition(sideButtonX, sideStart - sideSpacing * 3);
        jackpotInfo.setPosition(sideButtonX, sideStart - sideSpacing * 4);

        _parent.addChild(_popup.getParent());

        GameView.addView(_parent, ZORDER);

        const wiggle = new cc.Sequence(cc.rotateBy(0.08, 3), cc.rotateBy(0.08, -3));

        function onTabHover(widget) {
            if (widget.getNumberOfRunningActions() == 0) {
                widget.runAction(new cc.RepeatForever(wiggle.clone()));
            }
        }

        function onTabUnhover(widget) {
            widget.stopAllActions();
            widget.setRotation(0);
        }

        onGameRulesClicked();
    };

    function onUserAgreementTabClicked() {

    }

    function onFAQTabClicked() {

    }

    function onGameRulesClicked() {
        console.log("onGameRulesClicked");
        console.log(_gameRules, _gameRules ? _gameRules.getParent() : 0);

        if (!_gameRules) {
            _gameRules = new cc.Node();

            const bkg = new cc.Sprite(ReferenceName.FAQGreenBackground);
            bkg.setScale(685 / 414, 440 / 186);
            bkg.setPosition(410, 325);
            _gameRules.addChild(bkg);

            const title = new cc.Sprite(ReferenceName.FAQGameRulesButtonTextV2);
            title.setAnchorPoint(0, 0.5);
            title.setPosition(titleX - 50, titleY);
            _gameRules.addChild(title);
            const text = new cc.LabelTTF(ef.gameController.getTranslatedText('gameRuleTxt'), "Microsoft YaHei", 16, cc.size(575, 370));
            text.setPosition(410, 330);
            _gameRules.addChild(text);
        }

        if (!_gameRules.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_gameRules);
        }
    }

    function onFishInfoClicked() {
        if (!_fishInfo) {
            _fishInfo = new cc.Node();

            const bkg = new cc.Sprite(ReferenceName.FAQLightGreenBackground);
            bkg.setScaleY(3.75);
            bkg.setPosition(410, 320);
            _fishInfo.addChild(bkg);

            const title = new cc.Sprite(ReferenceName.FAQFishInfoButtonTextV2);
            title.setAnchorPoint(0, 0.5);
            title.setPosition(titleX - 50, titleY);
            _fishInfo.addChild(title);

            const display = new cc.Sprite(ReferenceName.FAQFishDisplay);
            _fishInfo.addChild(display);
            display.setPosition(410, 310);

            const info = new cc.LabelTTF(ef.gameController.getTranslatedText('fishInfoTxt'), 'Microsoft YaHei', 15, cc.size(380, 50));
            info.setFontFillColor(new cc.Color(0, 0, 0, 255));

            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);

            info.setPosition(460, 525);

            display.addChild(info);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
            // const angelFishLabel = new cc.LabelTTF('1.1', 'Microsoft YaHei', 17);
        }
        if (!_fishInfo.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_fishInfo);
        }
    }

    function onUiFaqClicked() {
        if (!_uiFaq) {
            _uiFaq = new cc.Node();

            const title = new cc.Sprite(ReferenceName.FAQUIFaqButtonTextV2);
            title.setAnchorPoint(0, 0.5);
            title.setPosition(titleX - 50, titleY);
            _uiFaq.addChild(title);

            const display = new cc.Sprite(ReferenceName.FAQUiFaqDisplay);
            display.setScale(0.90);
            _uiFaq.addChild(display);
            display.setPosition(420, 320);
        }
        if (_uiFaq && !_uiFaq.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_uiFaq);
        }
    }

    function onCannonInfoClicked() {
        if (!_cannonInfo) {
            _cannonInfo = new cc.Node();

            const title = new cc.Sprite(ReferenceName.FAQCannonInfoButtonTextV2);
            title.setAnchorPoint(0, 0.5);
            title.setPosition(titleX - 50, titleY);
            _cannonInfo.addChild(title);

            // const display = new cc.Sprite(ReferenceName.FAQCannonInfoDisplay);
            // _cannonInfo.addChild(display);
            // display.setPosition(410, 320);

            const cannonPic = new cc.Sprite("#Cannon-Info-Cannon.png");
            const cannonLevel = new cc.Sprite("#Cannon-Info-Lvl.png");
            const cannonLobby = new cc.Sprite("#Cannon-Info-Multiplier.png");
            const cannonData = new cc.Sprite("#Cannon-Info-DMG.png");

            cannonPic.setPosition(titleX + 300, titleY - 150);
            _cannonInfo.addChild(cannonPic);

            cannonLevel.setPosition(titleX + 250, titleY - 270);
            _cannonInfo.addChild(cannonLevel);

            cannonLobby.setPosition(titleX - 10, titleY - 380);
            _cannonInfo.addChild(cannonLobby);

            cannonData.setPosition(titleX + 300, titleY - 380);
            _cannonInfo.addChild(cannonData);

        }
        if (_cannonInfo && !_cannonInfo.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_cannonInfo);
        }
    }

    function onJackpotInfoClicked() {
        if (!_jackpotInfo) {
            _jackpotInfo = new cc.Node();

            const jackpotBackground = new cc.Sprite(ReferenceName.FAQJackpotBackground);
            _jackpotInfo.addChild(jackpotBackground);
            jackpotBackground.setPosition(535, 435);

            const freeGameBackground = new cc.Sprite(ReferenceName.FAQJackpotBackground);
            _jackpotInfo.addChild(freeGameBackground);
            freeGameBackground.setPosition(535, 235);

            const jackpotTitle = new cc.Sprite(ReferenceName.FAQJackpotSubtitleText);
            jackpotBackground.addChild(jackpotTitle);
            jackpotTitle.setPosition(165, 165);

            const freeGameTitle = new cc.Sprite(ReferenceName.FAQFreeGameSubtitleText);
            freeGameBackground.addChild(freeGameTitle);
            freeGameTitle.setPosition(165, 165);

            const title = new cc.Sprite(ReferenceName.FAQJackpotInfoButtonTextV2);
            title.setAnchorPoint(0, 0.5);
            title.setPosition(titleX - 50, titleY);
            _jackpotInfo.addChild(title);

            const jackpotDisplay = new cc.Sprite(ReferenceName.FAQJackpotDisplay);
            _jackpotInfo.addChild(jackpotDisplay);
            jackpotDisplay.setPosition(265, 445);

            const freeRoundDisplay = new cc.Sprite(ReferenceName.FAQFreeRoundDisplay);
            _jackpotInfo.addChild(freeRoundDisplay);
            freeRoundDisplay.setPosition(265, 245);

            const jackpotInfo = new cc.LabelTTF(ef.gameController.getTranslatedText('jackpotInfoTxt'),
                'Microsoft YaHei', 13, cc.size(290, 275));
            jackpotInfo.setPosition(260, 10);
            jackpotBackground.addChild(jackpotInfo);

            const freeGameInfo = new cc.LabelTTF(ef.gameController.getTranslatedText('freeGameInfoTxt'),
                'Microsoft YaHei', 13, cc.size(290, 275));
            freeGameInfo.setPosition(260, 10);
            freeGameBackground.addChild(freeGameInfo);
        }
        if (_jackpotInfo && !_jackpotInfo.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_jackpotInfo);
        }
    }

    function clearAllViews() {
        _popup.getBackground().removeChild(_gameRules, false);
        _popup.getBackground().removeChild(_uiFaq, false);
        _popup.getBackground().removeChild(_fishInfo, false);
        _popup.getBackground().removeChild(_cannonInfo, false);
        _popup.getBackground().removeChild(_jackpotInfo, false);
    }

    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    const proto = FAQView.prototype;

    proto.unattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
    };

    proto.reattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
        GameView.addView(_parent);
    };

    proto.show = function () {
        console.log("show");
        _parent.setVisible(true);
        _parent.setLocalZOrder(ZORDER);

        _popup.show();
    };

    proto.hide = function () {
        dismissCallback();
        _popup.hide();
    };

    return FAQView;
}());
