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

    const FAQView = function () {
        _parent = new cc.Node();
        _popup= new FloatingMenuPopupBasePrefab(dismissCallback);

        const textBG = new cc.Sprite(ReferenceName.FAQTextBackground);
        const title = new cc.Sprite(ReferenceName.FAQTitleChinese);

        const userAgreementTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onUserAgreementTabClicked);
        const faqTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onFAQTabClicked);

        const userAgreementTabTitleText = new cc.Sprite(ReferenceName.FAQUserAgreementTitleChinese);
        const faqTabTitleText = new cc.Sprite(ReferenceName.FAQTabTitleChinese);

        userAgreementTabTitleText.setAnchorPoint(0,0);
        faqTabTitleText.setAnchorPoint(0,0);

        userAgreementTab.addChild(userAgreementTabTitleText);
        faqTab.addChild(faqTabTitleText);

        userAgreementTab.setAnchorPoint(0.2,0.5);
        faqTab.setAnchorPoint(0.2,0.5);

        const userAgreementRollover = new RolloverEffectItem(userAgreementTab,undefined,undefined,onTabHover,onTabUnhover);
        const faqRollover = new RolloverEffectItem(faqTab,undefined,undefined,onTabHover,onTabUnhover);

        const gameRules = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onGameRulesClicked);
        const uiFAQ = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onUiFaqClicked);
        const fishInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onFishInfoClicked);
        const cannonInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onCannonInfoClicked);
        const jackpotInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onJackpotInfoClicked);

        const gameRulesButtonText = new cc.Sprite(ReferenceName.FAQGameRulesButtonText);
        const uiFAQButtonText = new cc.Sprite(ReferenceName.FAQUIFaqButtonText);
        const fishInfoButtonText = new cc.Sprite(ReferenceName.FAQFishInfoButtonText);
        const cannonInfoButtonText = new cc.Sprite(ReferenceName.FAQCannonInfoButtonText);
        const jackpotInfoButtonText = new cc.Sprite(ReferenceName.FAQJackpotInfoButtonText);

        const pos = new cc.p(gameRules.getContentSize().width/2, gameRules.getContentSize().height/2);

        console.log(gameRules,gameRules.getContentSize(),pos);

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

        textBG.setPosition(new cc.p(420,350));
        textBG.setScaleY(1.05);
        title.setPosition(new cc.p(560,705));

        _popup.getBackground().addChild(textBG);
        _popup.getBackground().addChild(title);

        // _popup.getBackground().addChild(userAgreementTab);
        // _popup.getBackground().addChild(faqTab);

        _popup.getBackground().addChild(gameRules);
        _popup.getBackground().addChild(uiFAQ);
        _popup.getBackground().addChild(fishInfo);
        _popup.getBackground().addChild(cannonInfo);
        _popup.getBackground().addChild(jackpotInfo);

        userAgreementTab.setPosition(130,tabHeight);
        faqTab.setPosition(310,tabHeight);

        gameRules.setPosition(sideButtonX, sideStart);
        uiFAQ.setPosition(sideButtonX, sideStart - sideSpacing);
        fishInfo.setPosition(sideButtonX, sideStart - sideSpacing * 2);
        cannonInfo.setPosition(sideButtonX, sideStart - sideSpacing * 3);
        jackpotInfo.setPosition(sideButtonX, sideStart - sideSpacing * 4);

        _parent.addChild(_popup.getParent());

        GameView.addView(_parent,ZORDER);

        const wiggle = new cc.Sequence(cc.rotateBy(0.08, 3), cc.rotateBy(0.08, -3));

        function onTabHover(widget){
            if (widget.getNumberOfRunningActions()==0) {
                widget.runAction(new cc.RepeatForever(wiggle.clone()));
            }
        }

        function onTabUnhover(widget) {
            widget.stopAllActions();
            widget.setRotation(0);
        }
    };

    function onUserAgreementTabClicked (){

    }

    function onFAQTabClicked(){

    }

    function onGameRulesClicked() {
        console.log("onGameRulesClicked");
        console.log(_gameRules, _gameRules ? _gameRules.getParent() : 0);

        if (!_gameRules) {
            _gameRules = new cc.Node();

            const bkg = new cc.Sprite(ReferenceName.FAQGreenBackground);
            bkg.setScale(685/414, 440/186);
            bkg.setPosition(410, 325);
            _gameRules.addChild(bkg);

            const title = new cc.Sprite(ReferenceName.FAQGameRulesButtonText);
            title.setPosition(titleX, titleY);
            _gameRules.addChild(title);
            const text = new cc.LabelTTF('“eFISH易博捕鱼”是一款结合街机与老虎机元素的娱乐休闲游戏。\n\n' +
                '游戏大厅设有1倍场、10倍场与100倍场；五款射击炮提供威力倍数1、2、3、5、10的炮弹；四十余种鱼类任捕赢取相对倍数奖金。' +
                '炮弹价值、鱼的倍数及鱼的生命值是依玩家所选择的倍数场而异。玩家可选择单人包桌或是四人一桌（依状况可自由选座）。\n' +
                '玩家进入游戏大厅后，选择倍数场与座位，再选择炮弹游戏开始。游戏过程中，玩家可随意更换射击炮。' +
                '玩家所选择的炮弹威力越强，一炮捕获鱼的机会越高，数量也越多。在同一倍数中，多个炮弹击中同一条鱼，将增加其捕获机会；' +
                '玩家也可选择锁定目标鱼，射击炮会自动射出炮弹。各类鱼奖金是依玩家选择的倍数场而增减。\n\n' +
                '一发炮弹即会扣除玩家额度，而击中鱼时奖金也会马上加入玩家额度；炮弹若无击中鱼，将会依游戏边框不断反射直至击中鱼。' +
                '本款游戏还设有累积奖池与免费炮弹，随时可触发。由于网路延迟等原因造成游戏服务器检测无效，该炮弹金额则不扣除，' +
                '金额会退回至玩家额度。', "Microsoft YaHei", 16, cc.size(575, 350));
            text.setPosition(410, 330);
            _gameRules.addChild(text);
        }

        if (!_gameRules.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_gameRules);
        }
    }

    function onFishInfoClicked() {
        if(!_fishInfo) {
            _fishInfo = new cc.Node();

            const bkg = new cc.Sprite(ReferenceName.FAQLightGreenBackground);
            bkg.setScaleY(3.75);
            bkg.setPosition(410, 320);
            _fishInfo.addChild(bkg);

            const title = new cc.Sprite(ReferenceName.FAQFishInfoButtonText);
            title.setPosition(titleX, titleY);
            _fishInfo.addChild(title);

            const display = new cc.Sprite(ReferenceName.FAQFishDisplay);
            _fishInfo.addChild(display);
            display.setPosition(410, 310);

            const info = new cc.LabelTTF('此为1倍场的赔率，10和100倍场的赔率为该倍场的乘数。', 'Microsoft YaHei', 15);
            info.setFontFillColor(new cc.Color(0,0,0,255));

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
        if(!_uiFaq) {
            _uiFaq = new cc.Node();

            const title = new cc.Sprite(ReferenceName.FAQUIFaqButtonText);
            title.setPosition(titleX, titleY);
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
        if(!_cannonInfo) {
            _cannonInfo = new cc.Node();

            const title = new cc.Sprite(ReferenceName.FAQCannonInfoButtonText);
            title.setPosition(titleX, titleY);
            _cannonInfo.addChild(title);

            const display = new cc.Sprite(ReferenceName.FAQCannonInfoDisplay);
            _cannonInfo.addChild(display);
            display.setPosition(410, 320);
        }
        if (_cannonInfo && !_cannonInfo.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_cannonInfo);
        }
    }

    function onJackpotInfoClicked(){
        if(!_jackpotInfo) {
            _jackpotInfo = new cc.Node();

            const jackpotBackground = new cc.Sprite(ReferenceName.FAQJackpotBackground);
            _jackpotInfo.addChild(jackpotBackground);
            jackpotBackground.setPosition(545,450);

            const freeGameBackground = new cc.Sprite(ReferenceName.FAQJackpotBackground);
            _jackpotInfo.addChild(freeGameBackground);
            freeGameBackground.setPosition(545,250);

            const title = new cc.Sprite(ReferenceName.FAQJackpotInfoButtonText);
            title.setPosition(titleX, titleY);
            _jackpotInfo.addChild(title);

            const jackpotDisplay = new cc.Sprite(ReferenceName.FAQJackpotDisplay);
            _jackpotInfo.addChild(jackpotDisplay);
            jackpotDisplay.setPosition(275, 460);

            const freeRoundDisplay = new cc.Sprite(ReferenceName.FAQFreeRoundDisplay);
            _jackpotInfo.addChild(freeRoundDisplay);
            freeRoundDisplay.setPosition(275, 260);

            const jackpotInfo = new cc.LabelTTF('eFISH累积奖池是将所有玩家所发出的每一发炮弹进行相应金额累积。' +
                '任何玩家随时有机会触发宝箱游戏，赢取累积奖金。' +
                '宝箱游戏中设有12个小宝箱，各自隐藏了图案，玩家可任意开启宝箱，首先集满三个同款图案宝箱即可获得相对应奖金，完成游戏。' +
                '奖金项目共分为一等奖、二等奖、三等奖及四等奖。无论在哪个倍场，使用哪种类型的炮弹，玩家都有机会捕获各个等级的累积奖金。',
                'Microsoft YaHei', 15, cc.size(275,200));
            jackpotInfo.setPosition(250,50);
            jackpotBackground.addChild(jackpotInfo);

            const freeGameInfo = new cc.LabelTTF('易博捕鱼游戏在进行中，随时有机会触发免费游戏。' +
                '玩家在有效时间内任发炮弹不计费，免费游戏中使用的炮弹类型将会是触发游戏前所使用的炮弹类型，不得更换。' +
                '所有捕获的鱼彩金都会自动存入到玩家的账号。把握时间为自己赢取更多彩金，祝您好运！',
                'Microsoft YaHei', 15, cc.size(250,200));
            freeGameInfo.setPosition(250,75);
            freeGameBackground.addChild(freeGameInfo);

        }
        if (_jackpotInfo && !_jackpotInfo.getParent()) {
            clearAllViews();
            _popup.getBackground().addChild(_jackpotInfo);
        }
    }

    function clearAllViews(){
        _popup.getBackground().removeChild(_gameRules,false);
        _popup.getBackground().removeChild(_uiFaq,false);
        _popup.getBackground().removeChild(_fishInfo,false);
        _popup.getBackground().removeChild(_cannonInfo,false);
        _popup.getBackground().removeChild(_jackpotInfo,false);
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