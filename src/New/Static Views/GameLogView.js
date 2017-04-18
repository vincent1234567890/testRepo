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

    let _scrollTitleBackground;

    let _gameSummaryData;
    let _consumptionData;

    //callback
    let _requestConsumptionLogCallback;

    const GameLogView = function (gameSummaryData , requestConsumptionLogCallback) {
        _requestConsumptionLogCallback = requestConsumptionLogCallback;
        _gameSummaryData = gameSummaryData;

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

        _scrollTitleBackground= new cc.Sprite(ReferenceName.GameLogLogTitleBackground);
        const scrollBackground = new cc.Sprite(ReferenceName.GameLogLogBackground);

        gameLogTabTitleText.setRotation(-10);
        consumptionLogTabTitleText.setRotation(-10);

        gameLogTabTitleText.setPosition(23,10);
        consumptionLogTabTitleText.setPosition(17,5);

        _scrollTitleBackground.setPosition(565,520);
        scrollBackground.setPosition(565,265);

        gameLogTab.setAnchorPoint(0.2,0.5);
        consumptionLogTab.setAnchorPoint(0.2,0.5);

        const userAgreementRollover = new RolloverEffectItem(gameLogTab,onGameLogTabPressed,undefined,onTabHover,onTabUnhover);
        const faqRollover = new RolloverEffectItem(consumptionLogTab,onConsumptionTabPressed,undefined,onTabHover,onTabUnhover);
        gameLogTab.setPosition(130,tabHeight);
        consumptionLogTab.setPosition(310,tabHeight);




        title.setPosition(new cc.p(560,705));

        _popup.getBackground().addChild(title);

        _popup.getBackground().addChild(gameLogTab);
        _popup.getBackground().addChild(consumptionLogTab);

        _popup.getBackground().addChild(_scrollTitleBackground);
        _popup.getBackground().addChild(scrollBackground);

        _parent.addChild(_popup.getParent());

        let list;

        function onGameLogTabPressed(){
            // const list = setupGameLogList(consumptionData);
            // scrollBackground.addChild(list);
            if(list){
                scrollBackground.removeChild(list);
            }
            const items = setupGameLogList(scrollBackground,gameSummaryData);
            _scrollTitleBackground.addChild(items.scrollTitle);
            scrollBackground.addChild(items.listView);
        }

        function onConsumptionTabPressed(){


        }

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

        // this.show(consumptionData);

        this.showGameSummary = function (gameSummaryData) {
            _gameSummaryData = gameSummaryData;
            onGameLogTabPressed();
            _parent.setLocalZOrder(ZORDER);
            _parent.setVisible(true);
            _popup.show();
        };

        this.showConsumptionLog = function (consumptionData){
            _consumptionData = consumptionData;
            if(list){
                scrollBackground.removeChild(list);
            }
            list = setupConsumptionLogList(scrollBackground,consumptionData);
            _popup.show();
        };

        GameView.addView(_parent,ZORDER);
    };

    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    function setupConsumptionLogList(scrollBackground, consumptionData) {
        console.log("setupConsumptionLogList", consumptionData);

        const listSize = scrollBackground.getContentSize();

        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        listView.setContentSize(listSize);
    }

    function setupConsumptionTitle(){
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

    function setupGameLogTitle(){
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

    function setupGameLogList(scrollBackground, gameSummaryData) {

        let scrollTitle = setupGameLogTitle();
        scrollTitle.setPosition(0,_scrollTitleBackground.getContentSize().height/2);

        console.log("setupGameLogList",gameSummaryData);

        const listSize = scrollBackground.getContentSize();


        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        listView.setContentSize(listSize);

        const _listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseScroll: onMouseScroll,
        });

        function onMouseScroll(mouseData) {
            const touch = new cc.Touch(0,mouseData.getScrollY()/100);
            touch._setPrevPoint(0,0);
            listView.onTouchMoved(touch);
            const end = new cc.Touch(0,0);
            end._setPrevPoint(0,0);
            listView.onTouchEnded(end);
        }

        cc.eventManager.addListener(_listener, listView);

        const ListItemPrefab = (function () {
            function ListItemPrefab(itemData, onSelectedCallback){
                const wrapper = new ccui.Widget();
                const highlight = new cc.Sprite(ReferenceName.GameLogItemHighLight);
                const separator = new cc.Sprite(ReferenceName.GameLogListSeparator);

                wrapper.addChild(highlight);
                wrapper.addChild(separator);
                wrapper.itemData = itemData;

                wrapper.setContentSize(highlight.getContentSize());
                wrapper.setTouchEnabled(true);

                highlight.setVisible(false);

                const listEntryPos = new cc.p(highlight.getContentSize().width/2,highlight.getContentSize().height/2);

                highlight.setPosition(listSize.width/2,listEntryPos.y);
                separator.setPosition(listSize.width/2,0);

                // console.log("ListItemPrefab",wrapper,highlight.getContentSize());

                let fontDef = new cc.FontDefinition();
                fontDef.fontName = "Microsoft YaHei";
                // fontDef.fontName = "Arial Unicode MS";
                fontDef.fontSize = "20";
                fontDef.fontStyle = "bold";
                fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                fontDef.fillStyle = new cc.Color(0, 0, 0, 255);

                const date = new Date(itemData.startTime);
                const roundIdText = itemData.id + "-" + date.getYear() + date.getMonth() + date.getDay();

                let roundId = new cc.LabelTTF(roundIdText, fontDef);

                fontDef.textAlign = cc.TEXT_ALIGNMENT_CENTER;
                let totalSpend = new cc.LabelTTF(itemData.totalSpent, fontDef);
                let totalRevenue = new cc.LabelTTF(itemData.totalRevenue, fontDef);
                let totalProfit = new cc.LabelTTF(parseFloat(itemData.totalRevenue) - parseFloat(itemData.totalSpent), fontDef);

                const endDate = new Date(itemData.endTime);
                fontDef.fontSize = "16";
                let startTime = new cc.LabelTTF(date.toLocaleDateString("en-GB") + "\n" + date.toLocaleTimeString("en-GB"), fontDef);
                let endTime = new cc.LabelTTF(endDate.toLocaleDateString("en-GB") + "\n" + endDate.toLocaleTimeString("en-GB"), fontDef);

                roundId.setAnchorPoint(0, 0.5);

                roundId.setPosition(50, listEntryPos.y);
                totalSpend.setPosition(300, listEntryPos.y);
                totalRevenue.setPosition(450, listEntryPos.y);
                totalProfit.setPosition(600, listEntryPos.y);
                startTime.setPosition(750, listEntryPos.y);
                endTime.setPosition(950, listEntryPos.y);

                wrapper.addChild(roundId);
                wrapper.addChild(totalSpend);
                wrapper.addChild(totalRevenue);
                wrapper.addChild(totalProfit);
                wrapper.addChild(startTime);
                wrapper.addChild(endTime);

                const item = new RolloverEffectItem(wrapper, onSelected, onUnselected, onHover, onUnhover);

                function onSelected(item) {
                    onSelectedCallback(itemData);
                }

                function onUnselected() {
                }

                function onHover() {
                    highlight.setVisible(true);
                }

                function onUnhover() {
                    highlight.setVisible(false);
                }

                this.getContent = function () {
                    return wrapper;
                };

                console.log(wrapper,itemData);
            }



            return ListItemPrefab;
        }());

        const onItemSelected = function (data) {
            if (_requestConsumptionLogCallback){
                _requestConsumptionLogCallback(data.playerGameNumber,data.roundNumber)
            }
            // ClientServerConnect.getConsumptionLog(data.playerGameNumber,data.roundNumber);
        };

        const data = gameSummaryData.data;
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            const listItemPrefab = new ListItemPrefab({
                id : data[i]._id.sceneName,
                totalRevenue : data[i].totalBonus,
                totalSpent : data[i].totalConsumption,
                startTime : data[i].startTime,
                endTime : data[i].endTime,
                playerGameNumber : data[i]._id.playerGameNumber,
                roundNumber : data[i]._id.roundNumber,
            }, onItemSelected);
            const content = listItemPrefab.getContent();
            // console.log(content);

            listView.pushBackCustomItem(content);
        }

        return {scrollTitle : scrollTitle, listView:listView}
    }

    const proto = GameLogView.prototype;

    proto.hide = function () {
        dismissCallback();
        _popup.hide();
    };

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

    return GameLogView;
}());