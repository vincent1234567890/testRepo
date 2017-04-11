/**
 * Created by eugeneseah on 10/4/17.
 */

const ProfileView = (function () {
    "use strict";
    const ZORDER = 10;
    const startHeight = 300;
    const LeftColumn = 250;
    const RightColumn = 550;
    const Spacing = 100;
    const ProfileView = function () {

        const parent = new cc.Node();
        const _background = new cc.Sprite(ReferenceName.SettingsBackground);
        const _closeButton = new CloseButtonPrefab(dismiss);

        parent.addChild(_closeButton.getButton(),10);
        _closeButton.getButton().setPosition(new cc.p(350, 220));

        parent.setPosition(683, 384);

        const timeDisplay = createDisplay(ReferenceName.ProfileTimeIcon,"timeTitle", "timeText");
        const coinDisplay = createDisplay(ReferenceName.ProfileCoinIcon,"coinTitle", "coinText");
        const rankingDisplay = createDisplay(ReferenceName.ProfileRankingIcon,"rankingTitle", "rankingText");
        const coinStackDisplay = createDisplay(ReferenceName.ProfileCoinStackIcon,"coinStackTitle", "coinStackText");

        _background.addChild(coinDisplay);
        _background.addChild(timeDisplay);
        _background.addChild(rankingDisplay);
        _background.addChild(coinStackDisplay);

        timeDisplay.setPosition(LeftColumn,startHeight - Spacing);
        coinDisplay.setPosition(LeftColumn,startHeight - Spacing*2);
        rankingDisplay.setPosition(RightColumn,startHeight - Spacing);
        coinStackDisplay.setPosition(RightColumn,startHeight - Spacing*2);

        //------
        var textName = new cc.EditBox(cc.size(300,70), ReferenceName.ProfileUserTextBackground);
        textName.setPlaceHolder(ReferenceName.LoginNamePlaceHolder);
        textName.setPosition(midX, midY + 100);
        textName.setFontSize(40);
        textName.setPlaceholderFontSize(40);
        //textName.setAnchorPoint(cc.p());
        textName.needsLayout();
        this._parent.addChild(textName);
        this.textName = textName;
//-------





        const title = new cc.Sprite(ReferenceName.ProfileTitleChinese);
        const titleBackground = new cc.Sprite(ReferenceName.SettingsTitleBackground);

        const titlePosition = new cc.p(400, 450);
        title.setPosition(titlePosition);
        titleBackground.setPosition(titlePosition);
        //
        // musicTitle.setPosition(STARTING_ALIGNMENT, musicSliderHeight);
        // soundTitle.setPosition(STARTING_ALIGNMENT, soundSliderHeight);
        //
        // gameLanguageSelectionTitle.setPosition(STARTING_ALIGNMENT, gameLanguageSelectionHeight);
        // gameLanguageSelectionBar.setPosition(400, gameLanguageSelectionHeight);
        //
        // let fontDef = new cc.FontDefinition();
        // fontDef.fontName = "Microsoft YaHei";
        // // fontDef.fontName = "Arial Unicode MS";
        // fontDef.fontSize = "20";
        // fontDef.fontStyle = "bold";
        // fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        // fontDef.fillStyle = new cc.Color(255, 255, 255, 255);
        // let label = new cc.LabelTTF("中文", fontDef);
        // label.setPosition(300, gameLanguageSelectionHeight);
        //
        // const acceptButton = GUIFunctions.createButton(ReferenceName.SettingsButtonBackground, ReferenceName.SettingsButtonBackgroundOnPress, dismiss);
        // const cancelButton = GUIFunctions.createButton(ReferenceName.SettingsButtonBackground, ReferenceName.SettingsButtonBackgroundOnPress, cancel);
        //
        // const buttonLevel = 80;
        //
        // acceptButton.setPosition(250, buttonLevel);
        // cancelButton.setPosition(550, buttonLevel);
        //
        // const acceptText = new cc.Sprite(ReferenceName.SettingsConfirmButtonTextChinese);
        // const cancelText = new cc.Sprite(ReferenceName.SettingsCancelButtonTextChinese);
        //
        // acceptText.setPosition(acceptButton.getPosition());
        // cancelText.setPosition(cancelButton.getPosition());
        //
        // _background.addChild(titleBackground);
        // _background.addChild(title);
        // _background.addChild(musicTitle);
        // _background.addChild(soundTitle);
        // _background.addChild(gameLanguageSelectionTitle);
        // _background.addChild(gameLanguageSelectionBar);
        // _background.addChild(label);
        // _background.addChild(acceptButton);
        // _background.addChild(cancelButton);
        // _background.addChild(acceptText);
        // _background.addChild(cancelText);

        parent.addChild(_background);

        GameView.addView(parent, 10);
        BlockingManager.registerBlock(dismissCallback);


        function dismissCallback(touch) {
            if (GUIFunctions.isSpriteTouched(_background, touch)) {
                return;
            }
            dismiss();
        }

        this.show = function () {
            parent.setLocalZOrder(ZORDER);
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
            parent.setLocalZOrder(-1000);
            _background.setVisible(false);
            _closeButton.setVisible(false);
            BlockingManager.deregisterBlock(dismissCallback);
        }

        function createDisplay(spriteIcon, titleText, infoText){
            const iconBackground = new cc.Sprite(ReferenceName.ProfileIconBackground);
            const background = new cc.Sprite(ReferenceName.ProfileIconTextBackground);
            const icon = new cc.Sprite(spriteIcon);

            const iconPos = new cc.p(iconBackground.getContentSize().width/2, iconBackground.getContentSize().height/2);
            const bgPos = new cc.p(background.getContentSize().width/2, background.getContentSize().height/2);
            iconBackground.setPosition(iconPos.x,bgPos.y);
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

            titleLabel.setPosition(bgPos.x, bgPos.y + 20);
            titleLabel.setAnchorPoint(0,0.5);

            fontDef.fillStyle = new cc.Color(255, 255, 255, 255);
            let infoLabel = new cc.LabelTTF(titleText, fontDef);
            infoLabel.setPosition(bgPos.x, bgPos.y - 20);
            infoLabel.setAnchorPoint(0,0.5);

            background.addChild(iconBackground);
            iconBackground.addChild(icon);
            background.addChild(titleLabel);
            background.addChild(infoLabel);

            return background;
        }

    };

    return ProfileView;
}());