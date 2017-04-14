/**
 * Created by eugeneseah on 11/4/17.
 */
const GameLogView = (function () {
    "use strict";
    const ZORDER = 10;
    let _parent;
    let _popup;
    let tabHeight = 600;
    let sideButtonX = 910;
    let sideSpacing = 100;
    let sideStart = 550;

    const GameLogView = function () {
        _parent = new cc.Node();
        _popup= new FloatingMenuPopupBasePrefab(dismissCallback);
        /*
         GameLogTitleChinese : "#GamelogChineseTitle.png",
         GameLogRecordTabChinese : "#GameRecordChinese.png",
         GameLogConsumptionTabChinese : "#ConsumptionRecordChinese.png",
         GameLogRadioButton : "#SelectionBase.png",
         GameLogRadioButtonSelected : "#Selection.png",
         GameLogLogTitleBackground : "#TextHeaderBase.png",
         GameLogDateChinese : "#DateChinese.png",
         GameLogTypeChinese : "#TypeChinese.png",
         GameLogConsumptionIdChinese : "#SerialNumberChinese.png",
         GameLogConsumptionAmountChinese : "#ConsumptionChinese.png",
         GameLogScore : "#PointChinese.png",
         GameLogRadioTextPeriodShortChinese : "#TodayChinese.png",
         GameLogRadioTextPeriodMediumChinese :"#3DaysChinese.png",
         GameLogRadioTextPeriodLongChinese :"#2WeeksChinese.png",
         GameLogListSeparator : "#LineLong.png",
         GameLogListSeparatorShort : "#LineShort.png",
         */

        const title = new cc.Sprite(ReferenceName.GameLogTitleChinese);

        const gameLogTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onUserAgreementTabClicked);
        const consumptionLogTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onFAQTabClicked);

        const gameLogTabTitleText = new cc.Sprite(ReferenceName.GameLogRecordTabChinese);
        const consumptionLogTabTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTabChinese);

        gameLogTabTitleText.setAnchorPoint(0,0);
        consumptionLogTabTitleText.setAnchorPoint(0,0);

        gameLogTab.addChild(gameLogTabTitleText);
        consumptionLogTab.addChild(consumptionLogTabTitleText);

        const scrollTitleBackground = new cc.Sprite(ReferenceName.GameLogLogTitleBackground);
        const scrollBackground = new cc.Sprite(ReferenceName.GameLogLogBackground);

        gameLogTabTitleText.setRotation(-10);
        consumptionLogTabTitleText.setRotation(-10);

        gameLogTabTitleText.setPosition(23,10);
        consumptionLogTabTitleText.setPosition(17,5);

        scrollTitleBackground.setPosition(565,520);
        scrollBackground.setPosition(565,265);

        // const gameRules = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onGameRulesClicked);
        // const uiFAQ = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onGameRulesClicked);
        // const fishInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onFishInfoClicked);
        // const cannonInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onCannonInfoClicked);
        // const jackpotInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onJackpotInfoClicked);
        //
        // const gameRulesButtonText = new cc.Sprite(ReferenceName.FAQGameRulesButtonText);
        // const uiFAQButtonText = new cc.Sprite(ReferenceName.FAQUIFaqButtonText);
        // const fishInfoButtonText = new cc.Sprite(ReferenceName.FAQFishInfoButtonText);
        // const cannonInfoButtonText = new cc.Sprite(ReferenceName.FAQCannonInfoButtonText);
        // const jackpotInfoButtonText = new cc.Sprite(ReferenceName.FAQJackpotInfoButtonText);

        // const pos = new cc.p(gameRules.getContentSize().width/2, gameRules.getContentSize().height/2);
        //
        // console.log(gameRules,gameRules.getContentSize(),pos);
        //
        // gameRulesButtonText.setPosition(pos);
        // uiFAQButtonText.setPosition(pos);
        // fishInfoButtonText.setPosition(pos);
        // cannonInfoButtonText.setPosition(pos);
        // jackpotInfoButtonText.setPosition(pos);
        //
        // gameRules.addChild(gameRulesButtonText);
        // uiFAQ.addChild(uiFAQButtonText);
        // fishInfo.addChild(fishInfoButtonText);
        // cannonInfo.addChild(cannonInfoButtonText);
        // jackpotInfo.addChild(jackpotInfoButtonText);

        title.setPosition(new cc.p(560,705));

        _popup.getBackground().addChild(title);

        _popup.getBackground().addChild(gameLogTab);
        _popup.getBackground().addChild(consumptionLogTab);

        _popup.getBackground().addChild(scrollTitleBackground);
        _popup.getBackground().addChild(scrollBackground);



        // _popup.getBackground().addChild(gameRules);
        // _popup.getBackground().addChild(uiFAQ);
        // _popup.getBackground().addChild(fishInfo);
        // _popup.getBackground().addChild(cannonInfo);
        // _popup.getBackground().addChild(jackpotInfo);

        gameLogTab.setPosition(200,tabHeight);
        consumptionLogTab.setPosition(390,tabHeight);



        // gameRules.setPosition(sideButtonX, sideStart);
        // uiFAQ.setPosition(sideButtonX, sideStart - sideSpacing);
        // fishInfo.setPosition(sideButtonX, sideStart - sideSpacing * 2);
        // cannonInfo.setPosition(sideButtonX, sideStart - sideSpacing * 3);
        // jackpotInfo.setPosition(sideButtonX, sideStart - sideSpacing * 4);

        _parent.addChild(_popup.getParent());

        GameView.addView(_parent,ZORDER);
    };

    function onUserAgreementTabClicked (){

    }

    function onFAQTabClicked(){

    }

    function onGameRulesClicked() {

    }

    function onFishInfoClicked() {

    }

    function onCannonInfoClicked() {

    }

    function onJackpotInfoClicked(){

    }

    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    const proto = GameLogView.prototype;

    proto.show = function () {
        _parent.setLocalZOrder(ZORDER);
        _parent.setVisible(true);
        _popup.show();
    };

    proto.hide = function () {
        dismissCallback();
        _popup.hide();
    };

    function setupGameList() {
        const width = cc.view.getDesignResolutionSize().width;
        const height = cc.view.getDesignResolutionSize().height;


        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        // listView.setBackGroundImage(res.HelloWorld_png);
        listView.setContentSize(cc.size(width, height));
        // listView.setInnerContainerSize(200,200)
        listView.setAnchorPoint(cc.p(0.5, 0.5));
        // listView.setPosition(width / 2, height / 2);
        listView.setPosition(width / 2 , height / 2 - 70);

        const gameList = _theme.GameList;
        for (let i = 0; i < gameList.length; i++) {
            const gameListButtonPrefab = new GameListButtonPrefab({
                gameId: i,
                gameName: gameList[i]
            }, width / numberOfLobbyButtonsShown, gameSelected);
            const content = gameListButtonPrefab.getContent();

            gameControlList.push(gameListButtonPrefab);

            listView.pushBackCustomItem(content);
        }

        return listView;
    }

    return GameLogView;
}());