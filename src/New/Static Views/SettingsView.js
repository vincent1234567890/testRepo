/**
 * Created by eugeneseah on 6/4/17.
 */
const SettingsView = (function () {
    const ENDOFFSET = 0.05;
    const ZORDER = 10;
    const SettingsView = function () {
        const parent = new cc.Node();
        const _background = new cc.Sprite(ReferenceName.SettingsBackground);

        parent.setPosition(683,384);

        const _musicSlider = createSlider(musicValueChangedEvent, PlayerPreferences.getMusicVolume());
        const _soundSlider = createSlider(soundValueChangedEvent, PlayerPreferences.getSoundVolume());

        _background.addChild(_musicSlider);
        _background.addChild(_soundSlider);

        parent.addChild(_background);

        GameView.addView(parent,10);
        BlockingManager.registerBlock(dismissCallback);

        function dismissCallback(touch){
            if (GUIFunctions.isSpriteTouched(_background,touch)) {
                return;
            }
            parent.setLocalZOrder(-1000);
            _background.setVisible(false);
            _musicSlider.setEnabled(false);
            _soundSlider.setEnabled(false);
            BlockingManager.deregisterBlock(dismissCallback);
        }

        this.show = function () {
            console.log("show");
            parent.setLocalZOrder(ZORDER);
            _background.setVisible(true);
            _musicSlider.setEnabled(true);
            _soundSlider.setEnabled(true);
            BlockingManager.registerBlock(dismissCallback);
        };
    };

    function createSlider(callback, value){
        let slider = new cc.ControlSlider(ReferenceName.SettingsSliderBackground, ReferenceName.SettingsSliderFiller, ReferenceName.SettingsSliderIndicator);
        slider._thumbSprite.setFlippedX(true);
        slider._thumbSprite.setFlippedY(true);
        slider._progressSprite.setFlippedX(true);
        slider._progressSprite.setFlippedY(true);
        slider._backgroundSprite.setFlippedX(true);
        slider._backgroundSprite.setFlippedY(true);
        slider.setMinimumValue(0.0); // Sets the min value of range
        slider.setMinimumAllowedValue(ENDOFFSET);
        slider.setValue(value || ENDOFFSET);
        slider.setMaximumValue(1+ENDOFFSET); // Sets the max value of range
        slider.setRotation(180);

        slider.addTargetWithActionForControlEvents(SettingsView, callback, cc.CONTROL_EVENT_VALUECHANGED);

        slider.setScaleX(1.01);

        return slider;
    }

    function musicValueChangedEvent(sender, controlEvent){
        PlayerPreferences.setMusicVolume(sender.getValue()); // because it saves convert on load
        cc.audioEngine.setMusicVolume(sender.getValue().toFixed(2)-ENDOFFSET);// because it is flipped
    }

    function soundValueChangedEvent(sender, controlEvent){
        PlayerPreferences.setSoundVolume(sender.getValue());
        cc.audioEngine.setEffectsVolume(1 - (sender.getValue().toFixed(2)-ENDOFFSET)); // because it is flipped\
    }


    return SettingsView;
}());