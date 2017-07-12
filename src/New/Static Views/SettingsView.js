const SettingsView = (function () {
    "use strict";
    const STARTOFFSET = 0.03;
    const ENDOFFSET = 0.05;
    const ZORDER = 10;
    const STARTING_ALIGNMENT = 175;
    let langDropdownPanelShow = false;
    const SettingsView = function () {
        const parent = new cc.Node();
        const _background = new cc.Sprite(ReferenceName.SettingsBackground);
        const _closeButton = new CloseButtonPrefab(dismiss);

        parent.addChild(_closeButton.getButton(), 10);
        _closeButton.getButton().setPosition(new cc.p(350, 220));

        parent.setPosition(683, 384);

        const _musicSlider = createSlider(parent, musicValueChangedEvent, PlayerPreferences.getMusicVolume());
        const _soundSlider = createSlider(parent, soundValueChangedEvent, PlayerPreferences.getSoundVolume());

        _background.addChild(_musicSlider);
        _background.addChild(_soundSlider);

        const musicSliderHeight = 350;
        const soundSliderHeight = 270;
        const gameLanguageSelectionHeight = 190;

        _musicSlider.setPosition(475, musicSliderHeight);
        _soundSlider.setPosition(475, soundSliderHeight);

        const title = new cc.Sprite(ReferenceName.SettingsTitleChinese);
        const titleBackground = new cc.Sprite(ReferenceName.SettingsTitleBackground);
        const musicTitle = new cc.Sprite(ReferenceName.SettingsMusicTitleChinese);
        const soundTitle = new cc.Sprite(ReferenceName.SettingsSoundTitleChinese);
        const gameLanguageSelectionTitle = new cc.Sprite(ReferenceName.SettingsGameLanguageSelectionTitleChinese);
        const gameLanguageSelectionBar = new cc.Sprite(ReferenceName.SettingsGameLanguageSelectionBar);
        const gameLanguageSelectionDropdownPanel = new cc.Sprite(ReferenceName.SettingsDropDownPanel);

        const titlePosition = new cc.p(400, 450);
        title.setPosition(titlePosition);
        titleBackground.setPosition(titlePosition);
        titleBackground.setScale(2);

        musicTitle.setPosition(STARTING_ALIGNMENT, musicSliderHeight);
        soundTitle.setPosition(STARTING_ALIGNMENT, soundSliderHeight);

        gameLanguageSelectionTitle.setPosition(STARTING_ALIGNMENT, gameLanguageSelectionHeight);

        const languageDropdownButton = GUIFunctions.createButton(ReferenceName.SettingsDropDownButton,
            ReferenceName.SettingsDropDownButtonOnPress, toggleLanguageDropdown);
        const barContent = gameLanguageSelectionBar.getContentSize();
        const languageDropdownContent = languageDropdownButton.getContentSize();

        languageDropdownButton.setPosition(400 + barContent.width / 2 - languageDropdownContent.width / 2, gameLanguageSelectionHeight);
        gameLanguageSelectionDropdownPanel.setPosition(400, gameLanguageSelectionHeight - barContent.height * 3);
        gameLanguageSelectionDropdownPanel.setVisible(false);
        gameLanguageSelectionBar.setPosition(400, gameLanguageSelectionHeight);
        ef.initClickListener(gameLanguageSelectionBar, toggleLanguageDropdown);

        let label = new cc.LabelTTF("中文", "Microsoft YaHei", 20);
        label._setFontWeight("bold");
        label.setAnchorPoint(0, 0.5);
        label.setPosition(280, gameLanguageSelectionHeight);

        //add language panel content
        const langArr = ['中文', 'English'];
        const panelContent = gameLanguageSelectionDropdownPanel.getContentSize();
        let langLabel = [];
        langArr.forEach((lang, index) => {
            let newLabel = new cc.LabelTTF(lang, "Microsoft YaHei", 20);
            newLabel.setPosition(10, panelContent.height - (index + 0.5) * 30);
            newLabel.setAnchorPoint(0, 1);
            newLabel.setLang = lang;
            ef.initClickListener(newLabel, chooseLang);
            gameLanguageSelectionDropdownPanel.addChild(newLabel, 2);
        });

        function chooseLang(event, point) {
            const node = point.getCurrentTarget();
            console.log(node.setLang);
            label.setString(node.setLang);
            toggleLanguageDropdown();
        }

        const acceptButton = GUIFunctions.createButton(ReferenceName.SettingsButtonBackground,
            ReferenceName.SettingsButtonBackgroundOnPress, dismiss);
        const cancelButton = GUIFunctions.createButton(ReferenceName.SettingsButtonBackground,
            ReferenceName.SettingsButtonBackgroundOnPress, cancel);

        const buttonLevel = 80;

        acceptButton.setPosition(250, buttonLevel);
        cancelButton.setPosition(550, buttonLevel);

        const acceptText = new cc.Sprite(ReferenceName.SettingsConfirmButtonTextChinese);
        const cancelText = new cc.Sprite(ReferenceName.SettingsCancelButtonTextChinese);

        acceptText.setPosition(acceptButton.getPosition());
        cancelText.setPosition(cancelButton.getPosition());

        _background.addChild(titleBackground);
        _background.addChild(title);
        _background.addChild(musicTitle);
        _background.addChild(soundTitle);
        _background.addChild(gameLanguageSelectionTitle);
        _background.addChild(gameLanguageSelectionBar);
        _background.addChild(languageDropdownButton);
        _background.addChild(gameLanguageSelectionDropdownPanel, 4);
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

        this.hide = function () {
            dismiss();
        };
        function toggleLanguageDropdown() {
            langDropdownPanelShow = !langDropdownPanelShow;
            gameLanguageSelectionDropdownPanel.setVisible(langDropdownPanelShow);
        }

        function cancel() {
            _musicSlider.setValue(previousMusic);
            _soundSlider.setValue(previousSound);
            dismiss();
        }

        function dismiss() {
            parent.setLocalZOrder(-1000);
            _background.setVisible(false);
            _musicSlider.setEnabled(false);
            _soundSlider.setEnabled(false);
            _closeButton.setVisible(false);

            //save to localstorage.
            ef.gameController.setMusicVolume(_musicSlider.getValue() - STARTOFFSET);
            ef.gameController.setSoundVolume(_soundSlider.getValue() - STARTOFFSET);

            previousMusic = -1;
            previousSound = -1;
            BlockingManager.deregisterBlock(dismissCallback);
        }

        this.unattach = function () {
            if (parent.getParent()) {
                parent.getParent().removeChild(parent, false);
            }
        };

        this.reattach = function () {
            this.unattach();
            GameView.addView(parent);
        };
    };

    function createSlider(parent, callback, value) {
        let slider = new cc.ControlSlider(ReferenceName.SettingsSliderBackground,
            ReferenceName.SettingsSliderFiller, ReferenceName.SettingsSliderIndicator);
        slider.setMinimumAllowedValue(STARTOFFSET);

        slider.setMaximumValue(1 + STARTOFFSET + ENDOFFSET);
        slider.setMaximumAllowedValue(1 + STARTOFFSET);

        slider.setValue(value);
        slider.getProgressSprite().setPosition(cc.pAdd(slider.getProgressSprite().getPosition(), new cc.p(5, 0)));
        slider.addTargetWithActionForControlEvents(SettingsView, callback, cc.CONTROL_EVENT_VALUECHANGED);

        return slider;
    }

    function musicValueChangedEvent(sender, controlEvent) {
        cc.audioEngine.setMusicVolume(sender.getValue() - STARTOFFSET);
    }

    function soundValueChangedEvent(sender, controlEvent) {
        cc.audioEngine.setEffectsVolume(sender.getValue() - STARTOFFSET);
    }


    return SettingsView;
}());