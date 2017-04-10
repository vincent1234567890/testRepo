/**
 * Created by eugeneseah on 10/4/17.
 */

const ProfileView = (function () {
    "use strict";
    const STARTOFFSET = 0.03;
    const ENDOFFSET = 0.05;
    const ZORDER = 10;
    const STARTING_ALIGNMENT = 175;
    const ProfileView = function () {
        /*
         SettingsBackground : "#PopupBase1.png",
         SettingsTitleChinese : "#SettingChineseTitle.png",
         SettingsTitleBackground : "#TitleBase1.png",
         SettingsButtonBackground : "#Button1Idle.png",
         SettingsButtonBackgroundOnPress : "#Button1OnPress.png",
         SettingsSliderBackground : "#BarBase1.png",
         SettingsSliderFiller : "#BarMid1.png",
         SettingsSliderIndicator : "#Puller.png",
         SettingsMusicTitleChinese : "#BGMChinese.png",
         SettingsSoundTitleChinese : "#MusicFXChinese.png",
         SettingsGameLanguageSelectionTitleChinese : "#GameLangChinese.png",
         SettingsGameLanguageSelectionBar : "#BarBase2.png",
         SettingsDropDownButton : "DropDWIdle.png",
         SettingsDropDownButtonOnPress : "DropDWOnPress.png",
         */
        const parent = new cc.Node();
        const _background = new cc.Sprite(ReferenceName.SettingsBackground);
        const _closeButton = new CloseButtonPrefab(dismiss);

        parent.addChild(_closeButton.getButton(),10);
        _closeButton.getButton().setPosition(new cc.p(350, 220));

        parent.setPosition(683, 384);

        // const _musicSlider = createSlider(musicValueChangedEvent, PlayerPreferences.getMusicVolume());
        // const _soundSlider = createSlider(soundValueChangedEvent, PlayerPreferences.getSoundVolume());
        //
        // _background.addChild(_musicSlider);
        // _background.addChild(_soundSlider);
        //
        // const musicSliderHeight = 350;
        // const soundSliderHeight = 270;
        // const gameLanguageSelectionHeight = 190;
        //
        // _musicSlider.setPosition(475, musicSliderHeight);
        // _soundSlider.setPosition(475, soundSliderHeight);

        const timeIcon = new cc.Sprite(ReferenceName.ProfileTimeIcon);
        const coinIcon = new cc.Sprite(ReferenceName.CoinIcon);
        const rankingIcon = new cc.Sprite(ReferenceName.FAQFishInfoButtonText);
        const coinStack = new cc.Sprite(ReferenceName.FAQCannonInfoButtonText);
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


        var textName = new cc.EditBox(cc.size(300,70), ReferenceName.Profile);
        textName.setPlaceHolder(ReferenceName.LoginNamePlaceHolder);
        textName.setPosition(midX, midY + 100);
        textName.setFontSize(40);
        textName.setPlaceholderFontSize(40);
        //textName.setAnchorPoint(cc.p());
        textName.needsLayout();
        this._parent.addChild(textName);
        this.textName = textName;

        const title = new cc.Sprite(ReferenceName.SettingsTitleChinese);
        const titleBackground = new cc.Sprite(ReferenceName.SettingsTitleBackground);
        const musicTitle = new cc.Sprite(ReferenceName.SettingsMusicTitleChinese);
        const soundTitle = new cc.Sprite(ReferenceName.SettingsSoundTitleChinese);
        const gameLanguageSelectionTitle = new cc.Sprite(ReferenceName.SettingsGameLanguageSelectionTitleChinese);
        const gameLanguageSelectionBar = new cc.Sprite(ReferenceName.SettingsGameLanguageSelectionBar);

        const titlePosition = new cc.p(400, 450);
        title.setPosition(titlePosition);
        titleBackground.setPosition(titlePosition);

        musicTitle.setPosition(STARTING_ALIGNMENT, musicSliderHeight);
        soundTitle.setPosition(STARTING_ALIGNMENT, soundSliderHeight);

        gameLanguageSelectionTitle.setPosition(STARTING_ALIGNMENT, gameLanguageSelectionHeight);
        gameLanguageSelectionBar.setPosition(400, gameLanguageSelectionHeight);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Microsoft YaHei";
        // fontDef.fontName = "Arial Unicode MS";
        fontDef.fontSize = "20";
        fontDef.fontStyle = "bold";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(255, 255, 255, 255);
        let label = new cc.LabelTTF("中文", fontDef);
        label.setPosition(300, gameLanguageSelectionHeight);

        const acceptButton = GUIFunctions.createButton(ReferenceName.SettingsButtonBackground, ReferenceName.SettingsButtonBackgroundOnPress, dismiss);
        const cancelButton = GUIFunctions.createButton(ReferenceName.SettingsButtonBackground, ReferenceName.SettingsButtonBackgroundOnPress, cancel);

        const buttonLevel = 80;

        acceptButton.setPosition(250, buttonLevel);
        cancelButton.setPosition(550, buttonLevel);

        const acceptText = new cc.Sprite(ReferenceName.SettingsConfirmButtonTextChinese);
        const cancelText = new cc.Sprite(ReferenceName.SettingsCancelButtonTextChinese);

        acceptText.setPosition(acceptButton.getPosition());
        cancelText.setPosition(cancelButton.getPosition());

        // const touchEvent = (sender, type) => {
        //     switch (type) {
        //         case ccui.Widget.TOUCH_ENDED:
        //             break;
        //     }
        // };
        //
        // const dropDownButton = new ccui.Button(ReferenceName.SettingsDropDownButton, ReferenceName.SettingsDropDownButtonOnPress, undefined, ccui.Widget.PLIST_TEXTURE);
        // dropDownButton.setTouchEnabled(true);
        // dropDownButton.setPosition(gameLanguageSelectionBar.getContentSize().width, gameLanguageSelectionBar.getContentSize().height / 2);
        // dropDownButton.addTouchEventListener(touchEvent);
        //
        // gameLanguageSelectionBar.addChild(dropDownButton);

        _background.addChild(titleBackground);
        _background.addChild(title);
        _background.addChild(musicTitle);
        _background.addChild(soundTitle);
        _background.addChild(gameLanguageSelectionTitle);
        _background.addChild(gameLanguageSelectionBar);Ø
        _background.addChild(label);
        _background.addChild(acceptButton);
        _background.addChild(cancelButton);
        _background.addChild(acceptText);
        _background.addChild(cancelText);

        parent.addChild(_background);

        GameView.addView(parent, 10);
        BlockingManager.registerBlock(dismissCallback);

        let previousMusic = _musicSlider.getValue();
        let previousSound = _soundSlider.getValue();

        function dismissCallback(touch) {
            if (GUIFunctions.isSpriteTouched(_background, touch)) {
                return;
            }
            dismiss();
        }

        this.show = function () {
            previousMusic = _musicSlider.getValue();
            previousSound = _soundSlider.getValue();
            parent.setLocalZOrder(ZORDER);
            _background.setVisible(true);
            _musicSlider.setEnabled(true);
            _soundSlider.setEnabled(true);
            _closeButton.setVisible(true);

            BlockingManager.registerBlock(dismissCallback);
        };

        this.hide = function(){
            dismiss();
        };

        function cancel() {
            _musicSlider.setValue(previousMusic);
            _soundSlider.setValue(previousSound);
            dismissCallback();
        }

        function dismiss() {
            parent.setLocalZOrder(-1000);
            _background.setVisible(false);
            _musicSlider.setEnabled(false);
            _soundSlider.setEnabled(false);
            _closeButton.setVisible(false);

            previousMusic = -1;
            previousSound = -1;
            BlockingManager.deregisterBlock(dismissCallback);
        }

        function createDisplay(spriteIcon, titleText, infoText){
            const iconBackground = new cc.Sprite(ReferenceName.ProfileIconBackground);
            const background = new cc.Sprite(ReferenceName.ProfileBackground);
            const icon = new cc.Sprite(spriteIcon);
            // const soundTitle = new cc.Sprite(ReferenceName.SettingsSoundTitleChinese);
            let fontDef = new cc.FontDefinition();
            fontDef.fontName = "Microsoft YaHei";
            // fontDef.fontName = "Arial Unicode MS";
            fontDef.fontSize = "20";
            fontDef.fontStyle = "bold";
            fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            fontDef.fillStyle = new cc.Color(255, 255, 255, 255);
            let label = new cc.LabelTTF(titleText, fontDef);
        }

    };
}());