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

    const GameLogView = function (consumptionData) {
        _parent = new cc.Node();
        _popup= new FloatingMenuPopupBasePrefab(dismissCallback);
        _popup.turnOffDeco();
        /*
         GameLogTitleChinese : "#GamelogChineseTitle.png",
         GameLogRecordTabChinese : "#GameRecordChinese.png",
         GameLogConsumptionTabChinese : "#ConsumptionRecordChinese.png",
         GameLogRadioButton : "#SelectionBase.png",
         GameLogRadioButtonSelected : "#Selection.png",
         GameLogLogTitleBackground : "#TextHeaderBase.png",
         GameLogLogBackground : "#TextBG4.png",
         GameLogHighLight : "#TextBG4HL",
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
         GameLogRoundIdTitleChinese : "#RoundChinese.png",
         GameLogTotalSpendTitleChinese : "#CannonTotalPointChinese.png",
         GameLogTotalRevenueTitleChinese : "#FishPointChinese.png",
         GameLogTotalProfitTitleChinese : "#ProfitPointChinese.png",
         GameLogStartTimeTitleChinese : "#StartTimeChinese.png",
         GameLogEndTimeTitleChinese : "#EndTimeChinese.png",
         */

        const title = new cc.Sprite(ReferenceName.GameLogTitleChinese);

        const gameLogTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onGameLogTabPressed);
        const consumptionLogTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onConsumptionTabPressed);

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

        const scrollTitle = setupConsumptionLogTitle();
        scrollTitle.setPosition(0,scrollTitleBackground.getContentSize().height/2);
        scrollTitleBackground.addChild(scrollTitle);


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


        _parent.addChild(_popup.getParent());

        function onGameLogTabPressed(){
            // const list = setupConsumptionLogList(consumptionData);
            // scrollBackground.addChild(list);
        }

        function onConsumptionTabPressed(){
            const list = setupConsumptionLogList(scrollBackground,consumptionData);
            scrollBackground.addChild(list);

        }

        // this.show(consumptionData);

        GameView.addView(_parent,ZORDER);
    };

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

    function setupGameLog(){
        const parent = new cc.Node();
    }

    function setupConsumptionLogTitle(){
        const parent = new cc.Node();
        const roundIdTitleText = new cc.Sprite(ReferenceName.GameLogRoundIdTitleChinese);
        const totalSpendTitleText = new cc.Sprite(ReferenceName.GameLogTotalSpendTitleChinese);
        const totalRevenueTitleText = new cc.Sprite(ReferenceName.GameLogTotalRevenueTitleChinese);
        const totalProfitTitleText = new cc.Sprite(ReferenceName.GameLogTotalProfitTitleChinese);
        const startTimeTitleText = new cc.Sprite(ReferenceName.GameLogStartTimeTitleChinese);
        const endTimeTitleText = new cc.Sprite(ReferenceName.GameLogEndTimeTitleChinese);

        // const pos = new cc.p(gameRules.getContentSize().width/2, gameRules.getContentSize().height/2);
        //
        // console.log(gameRules,gameRules.getContentSize(),pos);
        //
        roundIdTitleText.setPosition(100,0);
        totalSpendTitleText.setPosition(300,0);
        totalRevenueTitleText.setPosition(450,0);
        totalProfitTitleText.setPosition(600,0);
        startTimeTitleText.setPosition(750,0);
        endTimeTitleText.setPosition(950,0);

        parent.addChild(roundIdTitleText);
        parent.addChild(totalSpendTitleText);
        parent.addChild(totalRevenueTitleText);
        parent.addChild(totalProfitTitleText);
        parent.addChild(startTimeTitleText);
        parent.addChild(endTimeTitleText);

        return parent;
    }

    function setupConsumptionLogList(scrollBackground,consumptionData) {
        console.log("setupConsumptionLogList",consumptionData);

        const size = scrollBackground.getContentSize();


        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        // listView.setBackGroundImage(res.HelloWorld_png);
        // listView.setContentSize(cc.size(width, height));
        // listView.setInnerContainerSize(200,200)
        // listView.setAnchorPoint(cc.p(0.5, 0.5));
        // listView.setPosition(width / 2, height / 2);
        // listView.setPosition(width / 2 , height / 2 - 70);
        listView.setContentSize(size);
        // listView.setPosition(size.width/2, size.height/2);
        // const gameList = _theme.GameList;
        // const consumption = consumptionData.data;
        // for (let i = 0; i < consumption.length; i++) {
        const ListItemPrefab = (function () {
            // const
            function ListItemPrefab(itemData, onSelectedCallback){
                // const base = GUIFunctions.createButton(undefined, ReferenceName.GameLogHighLight, onSelectedCallback);
                const wrapper = new ccui.Widget();
                const highlight = new cc.Sprite(ReferenceName.GameLogHighLight);
                const separator = new cc.Sprite(ReferenceName.GameLogListSeparator);

                // highlight.setContentSize(scrollBackground.getContentSize().width,highlight.getContentSize().height);

                wrapper.addChild(highlight);
                wrapper.addChild(separator);
                wrapper.itemData = itemData;

                wrapper.setContentSize(highlight.getContentSize());
                wrapper.setTouchEnabled(true);

                highlight.setVisible(false);

                highlight.setPosition(size.width/2,highlight.getContentSize().height/2);
                separator.setPosition(size.width/2,0);

                console.log("ListItemPrefab",wrapper,highlight.getContentSize());

                const item = new RolloverEffectItem(wrapper, onSelected, onUnselected, onHover, onUnhover);

                function onSelected(item) {
                    onSelectedCallback(item);
                }

                function onUnselected() {
                    // label.setScale(originalSize);
                }

                function onHover() {
                    highlight.setVisible(true);
                    // label.setScale(hoverSize);
                }

                function onUnhover() {
                    highlight.setVisible(false);
                    // label.setScale(originalSize);
                }

                this.getContent = function () {
                    return wrapper;
                };
            }

            return ListItemPrefab;
        }());

        const onItemSelected = function (sender) {
            console.log(sender);
        };

        const data = consumptionData.data;
        for (let i = 0; i < data.length; i++) {
            const listItemPrefab = new ListItemPrefab({
                consumptionID: i,
            }, onItemSelected);
            const content = listItemPrefab.getContent();
            console.log(content);

            listView.pushBackCustomItem(content);
        }

        return listView;
    }

    return GameLogView;
}());