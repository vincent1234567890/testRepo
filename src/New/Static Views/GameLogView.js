const GameLogView = (function () {
    "use strict";
    const ZORDER = 10;
    const scrollMultiplier = -2;
    let _parent;
    let _popup;
    const tabHeight = 600;
    const fishPosition = 500;

    const timePeriodShort = 1;
    const timePeriodMedium = 3;
    const timePeriodLong = 14;

    let _scrollTitleBackground;

    let _displayList;
    let _displayTitle;

    let _currentTab;

    let _gameSummaryData;
    let _consumptionData;

    //callback
    let _requestConsumptionLogCallback;

    const GameLogView = function (gameSummaryData, requestConsumptionLogCallback) {
        _requestConsumptionLogCallback = requestConsumptionLogCallback;
        _gameSummaryData = gameSummaryData;

        _parent = new cc.Node();
        _popup = new FloatingMenuPopupBasePrefab(dismissCallback);
        _popup.turnOffDeco();

        const title = new cc.Sprite(ReferenceName.GameLogTitleChinese);

        const gameLogTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,
            ReferenceName.FAQTabBackgroundOnPress, onGameLogTabPressed);
        const consumptionLogTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,
            ReferenceName.FAQTabBackgroundOnPress, onRechargeLogTabPressed);

        const gameLogTabTitleText = new cc.Sprite(ReferenceName.GameLogRecordTabChinese);
        const consumptionLogTabTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTabChinese);

        gameLogTabTitleText.setAnchorPoint(0, 0);
        consumptionLogTabTitleText.setAnchorPoint(0, 0);

        gameLogTab.addChild(gameLogTabTitleText);
        consumptionLogTab.addChild(consumptionLogTabTitleText);

        _scrollTitleBackground = new cc.Sprite(ReferenceName.GameLogLogTitleBackground);
        const scrollBackground = new cc.Sprite(ReferenceName.GameLogLogBackground);

        gameLogTabTitleText.setRotation(-10);
        consumptionLogTabTitleText.setRotation(-10);

        gameLogTabTitleText.setPosition(23, 10);
        consumptionLogTabTitleText.setPosition(17, 5);

        _scrollTitleBackground.setPosition(565, 520);
        scrollBackground.setPosition(565, 265);

        gameLogTab.setAnchorPoint(0.2, 0.5);
        consumptionLogTab.setAnchorPoint(0.2, 0.5);

        const userAgreementRollover = new RolloverEffectItem(gameLogTab, onGameLogTabPressed, undefined, onTabHover, onTabUnhover);
        const faqRollover = new RolloverEffectItem(consumptionLogTab, onRechargeLogTabPressed, undefined, onTabHover, onTabUnhover);
        gameLogTab.setPosition(130, tabHeight);
        consumptionLogTab.setPosition(310, tabHeight);

        const checkBoxShort = new ccui.CheckBox(ReferenceName.GameLogRadioButton, undefined,
            ReferenceName.GameLogRadioButtonSelected, undefined, undefined, ccui.Widget.PLIST_TEXTURE);
        const checkBoxShortText = new cc.Sprite(ReferenceName.GameLogRadioTextPeriodShortChinese);
        checkBoxShort.addChild(checkBoxShortText);
        checkBoxShortText.setAnchorPoint(0, 0.5);
        checkBoxShortText.setPosition(20, 10);
        checkBoxShort.setPosition(700, tabHeight);
        checkBoxShort.itemData = timePeriodShort;

        checkBoxShort.setSelected(true);

        const checkBoxMedium = new ccui.CheckBox(ReferenceName.GameLogRadioButton, undefined,
            ReferenceName.GameLogRadioButtonSelected, undefined, undefined, ccui.Widget.PLIST_TEXTURE);
        const checkBoxMediumText = new cc.Sprite(ReferenceName.GameLogRadioTextPeriodMediumChinese);
        checkBoxMedium.addChild(checkBoxMediumText);
        checkBoxMediumText.setAnchorPoint(0, 0.5);
        checkBoxMediumText.setPosition(20, 10);
        checkBoxMedium.setPosition(825, tabHeight);
        checkBoxMedium.itemData = timePeriodMedium;

        const checkBoxLong = new ccui.CheckBox(ReferenceName.GameLogRadioButton, undefined,
            ReferenceName.GameLogRadioButtonSelected, undefined, undefined, ccui.Widget.PLIST_TEXTURE);
        const checkBoxLongText = new cc.Sprite(ReferenceName.GameLogRadioTextPeriodLongChinese);
        checkBoxLong.addChild(checkBoxLongText);
        checkBoxLongText.setAnchorPoint(0, 0.5);
        checkBoxLongText.setPosition(20, 10);
        checkBoxLong.setPosition(950, tabHeight);
        checkBoxLong.itemData = timePeriodLong;

        const radioButtonPressEvent = (sender, type) => {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED: // fallthrough intended
                    console.log(sender, sender.itemData, sender.isSelected());
                    if (!sender.isSelected()) {
                        sender.setSelected(true);
                        return;
                    }
                    cc.audioEngine.playEffect(res.MenuButtonPressSound);
                    for (let radio in radioArray) {
                        radioArray[radio].setSelected(false);
                    }
                    sender.setSelected(true);
                    _currentTab();
                    break;
            }
        };

        const radioArray = [checkBoxShort, checkBoxMedium, checkBoxLong];
        for (let radio in radioArray) {
            radioArray[radio].addEventListener(radioButtonPressEvent);
        }

        title.setPosition(560, 705);

        const popBackground = _popup.getBackground();
        popBackground.addChild(title);

        popBackground.addChild(gameLogTab);
        popBackground.addChild(consumptionLogTab);

        popBackground.addChild(checkBoxShort);
        popBackground.addChild(checkBoxMedium);
        popBackground.addChild(checkBoxLong);

        popBackground.addChild(_scrollTitleBackground);
        popBackground.addChild(scrollBackground);

        _parent.addChild(_popup.getParent());

        //gameLog click event handler.
        function onGameLogTabPressed() {
            for (let radio in radioArray) {
                radioArray[radio].setEnabled(true);
                radioArray[radio].setVisible(true);
            }

            if (_displayList) {
                scrollBackground.removeChild(_displayList);
                _scrollTitleBackground.removeChild(_displayTitle);
            }

            let length;
            for (let radio in radioArray) {
                if (radioArray[radio].isSelected()) {
                    length = radioArray[radio].itemData;
                    break;
                }
            }

            //event
            WaitingPanel.showPanel();
            ClientServerConnect.getGameSummaries(length).then(
                gameSummaries => {
                    console.log(length, gameSummaries);
                    // setGameLogData(gameSummaries);
                    gameSummaryData = gameSummaries;
                    const items = setupGameLogList(scrollBackground, gameSummaryData);
                    _displayList = items.listView;
                    _displayTitle = items.scrollTitle;
                    _scrollTitleBackground.addChild(_displayTitle);
                    scrollBackground.addChild(_displayList);
                    WaitingPanel.hidePanel();
                }
            ).catch(function(message){
                WaitingPanel.hidePanel();
                //show the error message
            });
            _currentTab = onGameLogTabPressed;
        }

        //Recharge log click event handler.
        function onRechargeLogTabPressed() {
            for (let radio in radioArray) {
                radioArray[radio].setEnabled(true);
                radioArray[radio].setVisible(true);
            }

            if (_displayList) {
                scrollBackground.removeChild(_displayList);
                _scrollTitleBackground.removeChild(_displayTitle);
            }

            let length;
            for (let radio in radioArray) {
                if (radioArray[radio].isSelected()) {
                    length = radioArray[radio].itemData;
                    break;
                }
            }

            WaitingPanel.showPanel();
            ClientServerConnect.getRechargeLog(length).then(
                rechargeLogData => {
                    console.log(length, rechargeLogData);
                    // setGameLogData(gameSummaries);
                    const items = setupRechargeLogList(scrollBackground, rechargeLogData);
                    _displayList = items.listView;
                    _displayTitle = items.scrollTitle;
                    _scrollTitleBackground.addChild(_displayTitle);
                    scrollBackground.addChild(_displayList);
                    WaitingPanel.hidePanel();
                }
            ).catch(function(errorMsg){
                WaitingPanel.hidePanel();
            });
            _currentTab = onRechargeLogTabPressed;
        }

        const wiggle = new cc.Sequence(cc.rotateBy(0.08, 3), cc.rotateBy(0.08, -3));

        function onTabHover(widget) {
            if (widget.getNumberOfRunningActions() === 0) {
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

        this.showConsumptionLog = function (consumptionData) {
            for (let radio in radioArray) {
                radioArray[radio].setEnabled(false);
                radioArray[radio].setVisible(false);
            }
            _consumptionData = consumptionData;
            if (_displayList) {
                scrollBackground.removeChild(_displayList);
                _scrollTitleBackground.removeChild(_displayTitle);
            }
            const items = setupConsumptionLogList(scrollBackground, consumptionData);
            _displayList = items.listView;
            _displayTitle = items.scrollTitle;
            _scrollTitleBackground.addChild(_displayTitle);
            scrollBackground.addChild(_displayList);

            //remove the wait panel.
            WaitingPanel.hidePanel();
        };

        onGameLogTabPressed();

        GameView.addView(_parent, ZORDER);
    };

    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    function setupConsumptionTitle() {
        const parent = new cc.Node();
        const bulletIdTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTitleIdChinese);
        const cannonAmountTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTitleCannonAmountChinese);
        const totalProfitTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTitleProfitChinese);
        const stageTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTitleSceneNameChinese);
        const fishTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTitleFishAffectedChinese);
        const indicatorTitleText = new cc.Sprite(ReferenceName.GameLogConsumptionTitleFishCatchIndicatorChinese);

        bulletIdTitleText.setPosition(50, 0);
        cannonAmountTitleText.setPosition(175, 0);
        totalProfitTitleText.setPosition(300, 0);
        stageTitleText.setPosition(425, 0);
        fishTitleText.setPosition(700, 0);
        indicatorTitleText.setPosition(960, 0);

        parent.addChild(bulletIdTitleText);
        parent.addChild(cannonAmountTitleText);
        parent.addChild(totalProfitTitleText);
        parent.addChild(stageTitleText);
        parent.addChild(fishTitleText);
        parent.addChild(indicatorTitleText);

        return parent;
    }

    function setupGameLogTitle() {
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
        roundIdTitleText.setPosition(100, 0);
        totalSpendTitleText.setPosition(300, 0);
        totalRevenueTitleText.setPosition(450, 0);
        totalProfitTitleText.setPosition(600, 0);
        startTimeTitleText.setPosition(750, 0);
        endTimeTitleText.setPosition(950, 0);

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
        scrollTitle.setPosition(0, _scrollTitleBackground.getContentSize().height / 2);

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
            const touch = new cc.Touch(0, scrollMultiplier * mouseData.getScrollY() / 100);
            touch._setPrevPoint(0, 0);
            listView.onTouchMoved(touch);
            const end = new cc.Touch(0, 0);
            end._setPrevPoint(0, 0);
            listView.onTouchEnded(end);
        }

        cc.eventManager.addListener(_listener, listView);

        const gameLogListItemPrefab = (function () {
            function gameLogListItemPrefab(itemData, onSelectedCallback) {
                const wrapper = new ccui.Widget();
                const highlight = new cc.Sprite(ReferenceName.GameLogItemHighLight);
                const separator = new cc.Sprite(ReferenceName.GameLogListSeparator);

                wrapper.addChild(highlight);
                wrapper.addChild(separator);
                wrapper.itemData = itemData;

                wrapper.setContentSize(highlight.getContentSize());
                wrapper.setTouchEnabled(true);

                highlight.setVisible(false);

                const listEntryPos = new cc.p(highlight.getContentSize().width / 2, highlight.getContentSize().height / 2);

                highlight.setPosition(listSize.width / 2, listEntryPos.y);
                separator.setPosition(listSize.width / 2, 0);

                // console.log("ListItemPrefab",wrapper,highlight.getContentSize());

                const date = new Date(itemData.startTime);
                const roundIdText = itemData.id + "-"
                    + (date.getYear()-100).toLocaleString('en-US', {minimumIntegerDigits: 2})
                    + (date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2})
                    + date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2})
                    + date.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2})
                    + date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});

                const roundId = new cc.LabelTTF(roundIdText, "Microsoft YaHei", 20);
                roundId._setFontWeight("bold");
                roundId.setFontFillColor(new cc.Color(0, 0, 0, 255));

                const totalSpend = new cc.LabelTTF(
                    itemData.totalSpent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), "Microsoft YaHei", 20);
                totalSpend._setFontWeight("bold");
                totalSpend.setFontFillColor(new cc.Color(0, 0, 0, 255));

                const totalRevenue = new cc.LabelTTF(
                    itemData.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), "Microsoft YaHei", 20);
                totalRevenue._setFontWeight("bold");
                totalRevenue.setFontFillColor(new cc.Color(0, 0, 0, 255));

                const totalProfit = new cc.LabelTTF((parseFloat(itemData.totalRevenue) - parseFloat(itemData.totalSpent)).toLocaleString(
                    'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}), "Microsoft YaHei", 20);
                totalProfit._setFontWeight("bold");
                totalProfit.setFontFillColor(new cc.Color(0, 0, 0, 255));

                const endDate = new Date(itemData.endTime);
                const startTime = new cc.LabelTTF(date.toLocaleDateString("en-GB") + "\n" + date.toLocaleTimeString("en-GB"),
                    "Microsoft YaHei", 16);
                startTime._setFontWeight("bold");
                startTime.setFontFillColor(new cc.Color(0, 0, 0, 255));
                startTime.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                const endTime = new cc.LabelTTF(endDate.toLocaleDateString("en-GB") + "\n" + endDate.toLocaleTimeString("en-GB"),
                    "Microsoft YaHei", 16);
                endTime._setFontWeight("bold");
                endTime.setFontFillColor(new cc.Color(0, 0, 0, 255));
                endTime.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

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
            }

            return gameLogListItemPrefab;
        }());

        const onItemSelected = function (data) {
            //show the wait panel.
            WaitingPanel.showPanel();
            if (_requestConsumptionLogCallback) {
                _requestConsumptionLogCallback(data.playerGameNumber, data.roundNumber);
            }
        };

        const data = gameSummaryData.data;
        for (let i = 0; i < data.length; i++) {
            const listItemPrefab = new gameLogListItemPrefab({
                id: data[i]._id.sceneName,
                totalSpent: data[i].totalConsumption,
                totalRevenue: data[i].totalBonus,
                startTime: data[i].startTime,
                endTime: data[i].endTime,
                playerGameNumber: data[i]._id.playerGameNumber,
                roundNumber: data[i]._id.roundNumber,
            }, onItemSelected);
            const content = listItemPrefab.getContent();

            listView.pushBackCustomItem(content);
        }

        return {scrollTitle: scrollTitle, listView: listView};
    }

    function setupConsumptionLogList(scrollBackground, consumptionLogData) {
        let scrollTitle = setupConsumptionTitle();
        scrollTitle.setPosition(0, _scrollTitleBackground.getContentSize().height / 2);

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
            const touch = new cc.Touch(0, scrollMultiplier * mouseData.getScrollY() / 100);
            touch._setPrevPoint(0, 0);
            listView.onTouchMoved(touch);
            const end = new cc.Touch(0, 0);
            end._setPrevPoint(0, 0);
            listView.onTouchEnded(end);
        }

        cc.eventManager.addListener(_listener, listView);

        function createFishList(fishArray) {
            const fishView = new ccui.ListView();
            fishView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);

            const fishList = new ccui.ListView();
            fishList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);

            if (!fishArray || fishArray && fishArray.length < 1) {
                return fishList;
            }

            fishView.setTouchEnabled(true);
            fishView.setBounceEnabled(true);

            const count = fishArray
                .map((fish) => ({type: fish.type, count: 1}))
                .reduce((a, b) => {
                    a[b.type] = (a[b.type] || 0) + b.count;
                    return a;
                }, {});

            let contentSize = new cc.p();

            for (let fish in count) {
                const wrapper = new ccui.Widget();
                const fishSprite = new cc.Sprite("#GL" + fish + ".png");
                const size = fishSprite.getContentSize();

                wrapper.addChild(fishSprite);
                fishSprite.setPosition(size.width / 2, size.height / 2);
                if (count[fish] > 1) {
                    const fishAmount = new cc.LabelTTF("x"+count[fish], "Microsoft YaHei", 20);
                    fishAmount.enableStroke(new cc.Color(255, 255, 255, 255), 2);
                    fishAmount.setFontFillColor(new cc.Color(0, 0, 0, 255));
                    fishAmount._setFontWeight("bold");
                    wrapper.addChild(fishAmount);
                    fishAmount.setPosition(size.width / 2, size.height / 2);
                }

                wrapper.setContentSize(size);
                if (contentSize.y < size.height) {
                    contentSize.y = size.height;
                }

                contentSize.x += size.width;
                fishList.pushBackCustomItem(wrapper);
            }
            const pos = new cc.p(400, 50);

            const fishViewCanvas = new ccui.Widget();
            fishViewCanvas.addChild(fishList);
            fishList.setPosition(pos.x / 2 - contentSize.x / 2, 0);

            fishList.setContentSize(contentSize.x, contentSize.y);
            fishView.pushBackCustomItem(fishViewCanvas);
            fishView.setContentSize(pos.x, contentSize.y);
            fishViewCanvas.setContentSize(pos.x, contentSize.y);

            return fishView;
        }

        const consumptionLogListItemPrefab = (function () {
            function consumptionLogListItemPrefab(itemData) {
                const wrapper = new ccui.Widget();
                const highlight = new cc.Sprite(ReferenceName.GameLogItemHighLight);
                const separator = new cc.Sprite(ReferenceName.GameLogListSeparator);

                const highlightSize = highlight.getContentSize();
                wrapper.addChild(highlight);

                wrapper.itemData = itemData;

                wrapper.setContentSize(highlightSize);
                wrapper.setTouchEnabled(true);

                highlight.setVisible(false);

                let bulletId = new cc.LabelTTF(itemData.id, "Microsoft YaHei", 20);
                bulletId._setFontWeight("bold");
                bulletId.setFontFillColor(new cc.Color(0, 0, 0, 255));

                let totalSpend = new cc.LabelTTF(
                    itemData.totalSpend.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                    "Microsoft YaHei", 20);
                totalSpend._setFontWeight("bold");
                totalSpend.setFontFillColor(new cc.Color(0, 0, 0, 255));

                let totalProfit = new cc.LabelTTF(
                    (parseFloat(itemData.totalRevenue) - parseFloat(itemData.totalSpend)).toLocaleString('en-US',
                        {minimumFractionDigits: 2, maximumFractionDigits: 2}), "Microsoft YaHei", 20);
                totalProfit._setFontWeight("bold");
                totalProfit.setFontFillColor(new cc.Color(0, 0, 0, 255));

                let sceneName = new cc.LabelTTF(itemData.sceneName, "Microsoft YaHei", 20);
                sceneName._setFontWeight("bold");
                sceneName.setFontFillColor(new cc.Color(0, 0, 0, 255));

                let uncaught;
                let uncaughtIndicator;
                if (itemData.fishUncaught.length > 0) {
                    uncaught = createFishList(itemData.fishUncaught);
                    wrapper.addChild(uncaught);
                    uncaughtIndicator = new cc.Sprite(ReferenceName.GameLogConsumptionTitleFishUncaughtIndicator);
                    wrapper.addChild(uncaughtIndicator);

                    uncaught.setPosition(fishPosition, 0);
                    uncaughtIndicator.setPosition(925, uncaught.getContentSize().height / 2);
                }

                let captured;
                if (itemData.fishCaught.length > 0) {
                    captured = createFishList(itemData.fishCaught);

                    wrapper.addChild(captured);
                    const indicator = new cc.Sprite(ReferenceName.GameLogConsumptionTitleFishCaughtIndicator);
                    wrapper.addChild(indicator);

                    captured.setPosition(fishPosition, 0);
                    indicator.setPosition(925, captured.getContentSize().height / 2);
                }

                if (itemData.fishUncaught.length > 0 || itemData.fishCaught.length > 0) { // ugly could improve
                    const height = wrapper.getContentSize().height;

                    let first = itemData.fishUncaught.length > 0 ? height : 0;
                    if (uncaught && uncaught.getContentSize().height > height) {
                        first = uncaught.getContentSize().height;
                    }

                    let second = itemData.fishCaught.length > 0 ? height : 0;
                    if (captured && captured.getContentSize().height > height) {
                        second = captured.getContentSize().height;
                    }

                    if (uncaught && captured) {
                        uncaught.setPosition(uncaught.getPosition().x, second);
                        uncaughtIndicator.setPosition(uncaughtIndicator.getPosition().x, second + first / 2);
                        const separator = new cc.Sprite(ReferenceName.GameLogListSeparatorShort);
                        separator.setPosition(fishPosition, second);
                        separator.setAnchorPoint(0.1,0.5);
                        wrapper.addChild(separator);
                    }
                    wrapper.setContentSize(wrapper.getContentSize().width, first + second);
                }

                wrapper.addChild(bulletId);
                wrapper.addChild(totalSpend);
                wrapper.addChild(totalProfit);
                wrapper.addChild(sceneName);

                wrapper.addChild(separator);
                separator.setPosition(listSize.width / 2, 0);

                const mid = wrapper.getContentSize().height / 2;

                highlight.setScaleY(wrapper.getContentSize().height / highlightSize.height);
                highlight.setPosition(listSize.width / 2, mid);

                bulletId.setPosition(50, mid);
                totalSpend.setPosition(175, mid);
                totalProfit.setPosition(300, mid);
                sceneName.setPosition(425, mid);

                const item = new RolloverEffectItem(wrapper, undefined, undefined, onHover, onUnhover);

                function onHover() {
                    highlight.setVisible(true);
                }

                function onUnhover() {
                    highlight.setVisible(false);
                }

                this.getContent = function () {
                    return wrapper;
                };
            }

            return consumptionLogListItemPrefab;
        }());

        const data = consumptionLogData.data;
        for (let i = 0; i < data.length; i++) {
            const listItemPrefab = new consumptionLogListItemPrefab({
                id: i+1,
                totalSpend: data[i].consumptionCredit,
                totalRevenue: data[i].bonusCredit,
                sceneName: data[i].sceneName,
                fishCaught: data[i].caughtFishes,
                fishUncaught: data[i].uncaughtFishes,
            });
            const content = listItemPrefab.getContent();

            listView.pushBackCustomItem(content);
        }

        return {scrollTitle: scrollTitle, listView: listView}
    }

    function setupRechargeLogTitle(){
        const parent = new cc.Node();
        const dateTitleText = new cc.Sprite(ReferenceName.GameLogRechargeTitleDateChinese);
        const typeTitleText = new cc.Sprite(ReferenceName.GameLogRechargeTitleTypeChinese);
        const idTitleText = new cc.Sprite(ReferenceName.GameLogRechargeTitleIdChinese);
        const amountTitleText = new cc.Sprite(ReferenceName.GameLogRechargeTitleAmountChinese);
        const totalScoreTitleText = new cc.Sprite(ReferenceName.GameLogRechargeTitleTotalScoreChinese);

        dateTitleText.setPosition(125, 0);
        typeTitleText.setPosition(325, 0);
        idTitleText.setPosition(525, 0);
        amountTitleText.setPosition(700, 0);
        totalScoreTitleText.setPosition(900, 0);

        parent.addChild(dateTitleText);
        parent.addChild(typeTitleText);
        parent.addChild(idTitleText);
        parent.addChild(amountTitleText);
        parent.addChild(totalScoreTitleText);

        return parent;
    }

    function setupRechargeLogList(scrollBackground, rechargeData){
        let scrollTitle = setupRechargeLogTitle();
        scrollTitle.setPosition(0, _scrollTitleBackground.getContentSize().height / 2);

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
            const touch = new cc.Touch(0, scrollMultiplier * mouseData.getScrollY() / 100);
            touch._setPrevPoint(0, 0);
            listView.onTouchMoved(touch);
            const end = new cc.Touch(0, 0);
            end._setPrevPoint(0, 0);
            listView.onTouchEnded(end);
        }

        cc.eventManager.addListener(_listener, listView);

        const RechargeLogListItemPrefab = (function () {
            function RechargeLogListItemPrefab(itemData) {
                const wrapper = new ccui.Widget();
                const highlight = new cc.Sprite(ReferenceName.GameLogItemHighLight);
                const separator = new cc.Sprite(ReferenceName.GameLogListSeparator);

                wrapper.addChild(highlight);
                wrapper.addChild(separator);
                separator.setAnchorPoint(0.52,0.5);
                wrapper.itemData = itemData;

                wrapper.setContentSize(highlight.getContentSize());
                wrapper.setTouchEnabled(true);

                highlight.setVisible(false);

                const listEntryPos = new cc.p(highlight.getContentSize().width / 2, highlight.getContentSize().height / 2);

                highlight.setPosition(listSize.width / 2, listEntryPos.y);
                separator.setPosition(listSize.width / 2, 0);

                const date = new Date(itemData.date);
                let dateText = new cc.LabelTTF(date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString("en-GB"),
                    "Microsoft YaHei", 20);
                dateText.setFontFillColor(new cc.Color(0, 0, 0, 255));
                dateText._setFontWeight("bold");

                let typeText;
                switch (itemData.type) {
                    case 'transferIn':
                        typeText = "转入";
                        break;
                    case 'transferOut':
                        typeText = "转出";
                        break;
                    case 'jackpot':
                        typeText = "中奖";
                        break;
                }

                const transferType = new cc.LabelTTF(typeText, "Microsoft YaHei", 20);
                transferType.setFontFillColor(new cc.Color(0, 0, 0, 255));
                transferType._setFontWeight("bold");

                const transferId = new cc.LabelTTF(itemData.id, "Microsoft YaHei", 20);
                transferId.setFontFillColor(new cc.Color(0, 0, 0, 255));
                transferId._setFontWeight("bold");

                const transferAmount = new cc.LabelTTF(
                    (itemData.amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                    "Microsoft YaHei", 20);
                transferAmount.setFontFillColor(new cc.Color(0, 0, 0, 255));
                transferAmount._setFontWeight("bold");
                const totalAmount = new cc.LabelTTF(
                    (itemData.total).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                    "Microsoft YaHei", 20);
                totalAmount.setFontFillColor(new cc.Color(0, 0, 0, 255));
                totalAmount._setFontWeight("bold");

                dateText.setPosition(125, listEntryPos.y);
                transferType.setPosition(325, listEntryPos.y);
                transferId.setPosition(525, listEntryPos.y);
                transferAmount.setPosition(700, listEntryPos.y);
                totalAmount.setPosition(900, listEntryPos.y);

                wrapper.addChild(dateText);
                wrapper.addChild(transferType);
                wrapper.addChild(transferId);
                wrapper.addChild(transferAmount);
                wrapper.addChild(totalAmount);

                const item = new RolloverEffectItem(wrapper, undefined, undefined, onHover, onUnhover);

                function onHover() {
                    highlight.setVisible(true);
                }

                function onUnhover() {
                    highlight.setVisible(false);
                }

                this.getContent = function () {
                    return wrapper;
                };
            }

            return RechargeLogListItemPrefab;
        }());

        const data = rechargeData.data;
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            const listItemPrefab = new RechargeLogListItemPrefab({
                date: data[i].createTime,
                type: data[i].type,
                id: data[i].orderId,
                amount: data[i].changeValue,
                total: data[i].newCredit,
            });
            const content = listItemPrefab.getContent();

            listView.pushBackCustomItem(content);
        }

        return {scrollTitle: scrollTitle, listView: listView}
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