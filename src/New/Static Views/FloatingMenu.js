/**
 * Created by eugeneseah on 9/3/17.
 */
const FloatingMenu = (function () {
    "use strict";
    let _parent;
    let _theme;

    const hoverSize = 1.2;
    const originalSize = 1;

    //playerData
    let _playerData;
    let _consumptionData;
    let _gameSummaryData;

    //views
    let _settingsView;
    let _gameLogView;
    let _profileView;
    let _leaderboardView;
    let _faqView;

    //callbacks
    let _requestConsumptionLogCallback;

    const FloatingMenu = function (playerData, requestConsumptionLogCallback) {
        _parent = new cc.Node();
        GameView.addView(_parent);

        _playerData = playerData;
        _requestConsumptionLogCallback = requestConsumptionLogCallback;

        _theme = ThemeDataManager.getThemeDataList("FloatingMenu");

        const settings = doButton(ReferenceName.FloatingMenuButtonSettingsIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonSettingsText,
            onSettingsSelected
        );

        _parent.addChild(settings);
        settings.setPosition(_theme["SettingsButton"][0], _theme["SettingsButton"][1]);

        const assets = doButton(ReferenceName.FloatingMenuButtonGameLogIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonGameLogText,
            onGameLogSelected
        );

        _parent.addChild(assets);
        assets.setPosition(_theme["AssetsButton"][0], _theme["AssetsButton"][1]);

        const info = doButton(ReferenceName.FloatingMenuButtonInfoIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonInfoText,
            onProfileSelected
        );

        _parent.addChild(info);
        info.setPosition(_theme["ProfileButton"][0], _theme["ProfileButton"][1]);

        const leaderboard = doButton(ReferenceName.FloatingMenuButtonLeaderboardIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonLeaderboardText,
            onLeaderboardSelected
        );

        _parent.addChild(leaderboard);
        leaderboard.setPosition(_theme["LeaderboardButton"][0], _theme["LeaderboardButton"][1]);

        const FAQ = doButton(ReferenceName.FloatingMenuButtonFAQIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonFAQText,
            onFAQSelected
        );

        _parent.addChild(FAQ);
        FAQ.setPosition(_theme["FAQButton"][0], _theme["FAQButton"][1]);

    };

    function doButton(iconSprite, buttonImage, buttonSelected, labelImage, selectedCallBack) {
        let button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(buttonImage, buttonSelected, undefined, ccui.Widget.PLIST_TEXTURE);
        button.setPosition(button.getContentSize().width / 2 - 120, button.getContentSize().height / 2 + 120);
        const size = button.getContentSize();
        let icon;
        if (iconSprite) {
            icon = new cc.Sprite(iconSprite);
            button.addChild(icon);
            icon.setPosition(size.width / 2, size.height / 2 - 10);
        }

        let label;
        if (labelImage) {
            label = new cc.Sprite(labelImage);
            button.addChild(label);
            // label.setAnchorPoint(0.5,0.5);
            label.setPosition(size.width / 2, 0);
        }

        const item = new RolloverEffectItem(button, onSelected, onUnselected, onHover, onUnhover);

        function onSelected() {
            selectedCallBack();
        }

        function onUnselected() {
            label.setScale(originalSize);
        }

        function onHover() {
            label.setScale(hoverSize);
        }

        function onUnhover() {
            label.setScale(originalSize);
        }

        return button;
    }

    function onSettingsSelected() {
        console.log("onSettingsSelected");
        if (_setttingsView){
            _setttingsView.show();
        }else{
            _setttingsView = new SettingsView();
        }
    }

    function onGameLogSelected() {
        console.log("onGameLogSelected");
        if (_gameLogView){
            _gameLogView.showGameSummary(_gameSummaryData);
        }else{
            _gameLogView = new GameLogView(_gameSummaryData, _requestConsumptionLogCallback);
        }
    }

    function onProfileSelected() {
        console.log("onProfileSelected");
        if (_profileView) {
            _profileView.show();
        } else {
            _profileView = new ProfileView(_playerData);
        }
    }

    function onLeaderboardSelected() {
        console.log("onLeaderboardSelected");
        if (_leaderboardView) {
            _leaderboardView.show();
        } else {
            _leaderboardView = new LeaderboardView();
        }
    }

    function onFAQSelected() {
        console.log("onFAQSelected");
        if (_faqView) {
            _faqView.show();
        } else {
            _faqView = new FAQView();
        }
    }

    const proto = FloatingMenu.prototype;

    proto.unattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
        if (_settingsView){
            _settingsView.unattach();
        }
        if (_gameLogView){
            _gameLogView.unattach();
        }
        if (_profileView){
            _profileView.unattach();
        }
        if (_leaderboardView){
            _leaderboardView.unattach();
        }
        if (_faqView){
            _faqView.unattach();
        }


    };

    proto.reattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
        if (_settingsView){
            _settingsView.reattach();
        }
        if (_gameLogView){
            _gameLogView.reattach();
        }
        if (_profileView){
            _profileView.reattach();
        }
        if (_leaderboardView){
            _leaderboardView.reattach();
        }
        if (_faqView){
            _faqView.reattach();
        }
        GameView.addView(_parent);
    };

    proto.hideAll = function () {
        if (_settingsView){
            _settingsView.hide();
        }
        if (_gameLogView){
            _gameLogView.hide();
        }
        if (_profileView){
            _profileView.hide();
        }
        if (_leaderboardView){
            _leaderboardView.hide();
        }
        if (_faqView){
            _faqView.hide();
        }
    };
    // proto.Move

    proto.setGameSummaryData = function (gameSummaryData) {
        _gameSummaryData = gameSummaryData;
        console.log(_gameSummaryData);
    };

    proto.setConsumptionLogData = function (consumptionData) {
        _consumptionData = consumptionData;
        console.log(_consumptionData);
        _gameLogView.showConsumptionLog(consumptionData);
    };

    return FloatingMenu;
}());