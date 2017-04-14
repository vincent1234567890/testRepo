/**
 * Created by eugeneseah on 10/4/17.
 */

const ProfileView = (function () {
    "use strict";
    const ZORDER = 10;
    const startHeight = 325;
    const LeftColumn = 275;
    const RightColumn = 625;
    const Spacing = 100;
    const _parent = new cc.Node();

    let _playerData;
    const ProfileView = function (playerData) {

        /*
         ProfileTitleChinese : "#InfoChineseTitle.png",
         ProfileUserTextBackground : "TextBG6.png",
         ProfileNicknameTitleChinese : "#NicknameChinese.png",
         ProfileInputBackground : "#InputBox.png",
         ProfileEditButton : "#EditButton.png",
         ProfileUsernameTitleChinese : "#UsernameChinese.png",
         ProfileIconBackground : "#SymbolBG.png",
         ProfileIconTextBackground : "#TextBG5.png",
         ProfileTimeIcon : "#TimeSymbol.png",
         ProfileCoinIcon : "#CoinsSymbol.png",
         ProfileRankingIcon : "#RankingSymbol.png",
         ProfileCoinStackIcon : "#Coin2WeekSymbol.png",
         */

        _playerData = playerData;

        const _background = new cc.Sprite(ReferenceName.SettingsBackground);
        const _closeButton = new CloseButtonPrefab(dismiss);

        _parent.addChild(_closeButton.getButton(),10);
        _closeButton.getButton().setPosition(new cc.p(350, 220));

        _parent.setPosition(683, 384);

        const timeDisplay = createDisplay(ReferenceName.ProfileTimeIcon,"今日在线时长", "timeText");
        const coinDisplay = createDisplay(ReferenceName.ProfileCoinIcon,"今日获得得分数", "coinText");
        const rankingDisplay = createDisplay(ReferenceName.ProfileRankingIcon,"排行榜最高名次", "rankingText");
        const coinStackDisplay = createDisplay(ReferenceName.ProfileCoinStackIcon,"近两周获得得分数", "coinStackText");

        _background.addChild(coinDisplay);
        _background.addChild(timeDisplay);
        _background.addChild(rankingDisplay);
        _background.addChild(coinStackDisplay);

        timeDisplay.setPosition(LeftColumn,startHeight - Spacing);
        coinDisplay.setPosition(LeftColumn,startHeight - Spacing*2);
        rankingDisplay.setPosition(RightColumn,startHeight - Spacing);
        coinStackDisplay.setPosition(RightColumn,startHeight - Spacing*2);

        //------ user name text boxes

        const bg = new cc.Sprite (ReferenceName.ProfileUserTextBackground);
        const bgPos = new cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2);
        const nickTitle = new cc.Sprite (ReferenceName.ProfileNicknameTitleChinese);
        const profilebg = new cc.Scale9Sprite(ReferenceName.ProfileInputBackground);
        profilebg.setContentSize(190,30);
        const profilebgdummy = new cc.Scale9Sprite();
        const editButton = GUIFunctions.createButton(ReferenceName.ProfileEditButton,undefined,onEditNicknameCallback);

        profilebg.setAnchorPoint(0.0,0.0);

        const nickTextBox = new cc.EditBox(cc.size(160,30), profilebgdummy);
        nickTextBox.setPlaceHolder("Nickname");
        nickTextBox.setFontName("Microsoft YaHei");
        nickTextBox.setFontColor(new cc.Color(72, 21, 0, 255));
        bg.addChild(nickTitle);
        bg.addChild(nickTextBox);
        bg.addChild(profilebg);
        bg.addChild(editButton,10);
        // nickName.setFontSize(40);
        // nickName.setPlaceholderFontSize(40);

        nickTextBox.setPosition( 95, bgPos.y);
        // editButton.setPosition( 250, bgPos.y);
        profilebg.setPosition(90,bgPos.y/2);
        editButton.setPosition( 265 , bgPos.y);
        nickTitle.setPosition(50, bgPos.y);
        bg.setPosition(LeftColumn - 35, startHeight);
        _background.addChild(bg);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Microsoft YaHei";
        // fontDef.fontName = "Arial Unicode MS";
        fontDef.fontSize = "20";
        fontDef.fontStyle = "bold";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(72, 21, 0, 255);
        let userNameLabel = new cc.LabelTTF(_playerData.playerState.name, fontDef);

        const userbg = new cc.Sprite(ReferenceName.ProfileUserTextBackground);
        const userTitle = new cc.Sprite(ReferenceName.ProfileUsernameTitleChinese);
        userbg.addChild(userTitle);
        userbg.addChild(userNameLabel);
        userTitle.setPosition(75, bgPos.y);
        userNameLabel.setPosition(userTitle.x + userTitle.getContentSize().width + 10, bgPos.y);
        userbg.setPosition(RightColumn - 35, startHeight);
        _background.addChild(userbg);
        //-------
        const title = new cc.Sprite(ReferenceName.ProfileTitleChinese);
        const titleBackground = new cc.Sprite(ReferenceName.SettingsTitleBackground);
        titleBackground.setScale(2,2);

        const titlePosition = new cc.p(400, 425);
        title.setPosition(titlePosition);
        titleBackground.setPosition(titlePosition);


        _background.addChild(titleBackground);
        _background.addChild(title);

        // _background.addChild(musicTitle);
        // _background.addChild(soundTitle);
        // _background.addChild(gameLanguageSelectionTitle);
        // _background.addChild(gameLanguageSelectionBar);
        // _background.addChild(label);
        // _background.addChild(acceptButton);
        // _background.addChild(cancelButton);
        // _background.addChild(acceptText);
        // _background.addChild(cancelText);

        _parent.addChild(_background);

        GameView.addView(_parent, 10);
        BlockingManager.registerBlock(dismissCallback);


        function dismissCallback(touch) {
            if (GUIFunctions.isSpriteTouched(_background, touch)) {
                return;
            }
            dismiss();
        }

        this.show = function () {
            _parent.setLocalZOrder(ZORDER);
            _background.setVisible(true);
            _closeButton.setVisible(true);

            BlockingManager.registerBlock(dismissCallback);
        };

        this.hide = function(){
            dismiss();
        };

        function cancel() {
            dismissCallback();
        }

        function dismiss() {
            _parent.setLocalZOrder(-1000);
            _background.setVisible(false);
            _closeButton.setVisible(false);
            BlockingManager.deregisterBlock(dismissCallback);
        }

        function onEditNicknameCallback(){

        }

    };

    function createDisplay(spriteIcon, titleText, infoText){
        const iconBackground = new cc.Sprite(ReferenceName.ProfileIconBackground);
        const background = new cc.Sprite(ReferenceName.ProfileIconTextBackground);
        const icon = new cc.Sprite(spriteIcon);

        const iconPos = new cc.p(iconBackground.getContentSize().width/2, iconBackground.getContentSize().height/2);
        const bgPos = new cc.p(background.getContentSize().width/2, background.getContentSize().height/2);
        iconBackground.setPosition(-iconPos.x,bgPos.y);
        icon.setPosition(iconPos);

        // const soundTitle = new cc.Sprite(ReferenceName.SettingsSoundTitleChinese);
        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Microsoft YaHei";
        // fontDef.fontName = "Arial Unicode MS";
        fontDef.fontSize = "20";
        fontDef.fontStyle = "bold";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0, 0, 0, 255);
        let titleLabel = new cc.LabelTTF(titleText, fontDef);

        titleLabel.setPosition(15, bgPos.y + 20);
        titleLabel.setAnchorPoint(0,0.5);

        fontDef.fillStyle = new cc.Color(255, 255, 255, 255);
        let infoLabel = new cc.LabelTTF(infoText, fontDef);
        infoLabel.setPosition(15, bgPos.y - 20);
        infoLabel.setAnchorPoint(0,0.5);

        background.addChild(iconBackground);
        iconBackground.addChild(icon);
        background.addChild(titleLabel);
        background.addChild(infoLabel);

        return background;
    }



    const proto = ProfileView.prototype;

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

    return ProfileView;
}());