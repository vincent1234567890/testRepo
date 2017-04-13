/**
 * Created by eugeneseah on 6/4/17.
 */
const SettingsView = (function () {
    "use strict";
    const STARTOFFSET = 0.03;
    const ENDOFFSET = 0.05;
    const ZORDER = 10;
    const STARTING_ALIGNMENT = 175;
    const SettingsView = function () {
        const parent = new cc.Node();
        const _background = new cc.Sprite(ReferenceName.SettingsBackground);
        const _closeButton = new CloseButtonPrefab(dismiss);

        parent.addChild(_closeButton.getButton(),10);
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
        _background.addChild(gameLanguageSelectionBar);
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
    };

    function createSlider(parent, callback, value) {
        let slider = new cc.ControlSlider(ReferenceName.SettingsSliderBackground, ReferenceName.SettingsSliderFiller, ReferenceName.SettingsSliderIndicator);
        slider.setMinimumAllowedValue(STARTOFFSET);

        slider.setMaximumValue(1 + STARTOFFSET + ENDOFFSET);
        slider.setMaximumAllowedValue(1 + STARTOFFSET);

        slider.setValue(value);
        slider.getProgressSprite().setPosition(cc.pAdd(slider.getProgressSprite().getPosition(), new cc.p(5, 0)));
        slider.addTargetWithActionForControlEvents(SettingsView, callback, cc.CONTROL_EVENT_VALUECHANGED);

        //animation effects
        // const target = new cc.Sprite();
        // target.setBlendFunc(cc.ONE, cc.ONE);
        //
        // // const sliderFiller = new cc.Sprite('#' + ReferenceName.SettingsSliderFiller);
        // // const mask = new cc.Sprite('#' + ReferenceName.SettingsSliderFiller);
        // const mask = slider.getProgressSprite();
        //
        // const maskedFill = new cc.ClippingNode(mask);
        // maskedFill.setAlphaThreshold(0.9);
        //
        // // slider.getProgressSprite().addChild(sliderFiller,1);
        //
        // maskedFill.addChild(target);
        // // maskedFill.setPosition(0,0);
        // slider.addChild(maskedFill,1);
        //
        // cc.spriteFrameCache.addSpriteFrames(res.WaterCausticAnimation);
        // let animationArray = [];
        // let count = 0;
        // while (true) {
        //     let frameCount = String(count);
        //     while (frameCount.length < 5) {
        //         frameCount = '0' + frameCount;
        //     }
        //     const frame = cc.spriteFrameCache.getSpriteFrame("Caustic_" + frameCount + ".png");
        //     if (!frame) {
        //         break;
        //     }
        //     animationArray.push(frame);
        //     count++;
        // }
        // const animation = new cc.Animate(new cc.Animation(animationArray,0.05));
        // target.runAction(new cc.repeatForever(animation));

        //end animation effects

        return slider;
    }

    function musicValueChangedEvent(sender, controlEvent) {
        // console.log(sender.getValue());
        PlayerPreferences.setMusicVolume(sender.getValue());
        cc.audioEngine.setMusicVolume(sender.getValue().toFixed(2) - STARTOFFSET);
    }

    function soundValueChangedEvent(sender, controlEvent) {
        // console.log(sender.getValue());
        PlayerPreferences.setSoundVolume(sender.getValue());
        cc.audioEngine.setEffectsVolume(sender.getValue().toFixed(2) - STARTOFFSET);
    }

    return SettingsView;
}());