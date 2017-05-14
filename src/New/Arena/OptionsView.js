const OptionsView = (function () {
    "use strict";
    const ENDOFFSET = 0.05;
    let thisParent;
    let _musicSlider;
    let _soundSlider;
    const ZORDER = 10;
    let _background;

    function OptionsView (){
        thisParent = this._parent = new cc.Node();

        _background = new cc.Sprite(ReferenceName.OptionsBG);
        _background.setPosition(cc.view.getDesignResolutionSize().width/2, cc.view.getDesignResolutionSize().height / 2);

        _musicSlider = createSlider("Music", musicValueChangedEvent, PlayerPreferences.getMusicVolume());
        _soundSlider = createSlider("Sound", soundValueChangedEvent, PlayerPreferences.getSoundVolume());

        _musicSlider.setPosition(_background.getContentSize().width/2 + 47.5,_background.getContentSize().height/2 + 69.2);
        _soundSlider.setPosition(_background.getContentSize().width/2 + 47.5,_background.getContentSize().height/2 + 4.1);

        _background.addChild(_musicSlider);
        _background.addChild(_soundSlider);

        this._parent.addChild(_background);

        GameView.addView(this._parent,10);
        BlockingManager.registerBlock(dismissCallback);
    }

    function createSlider(labelText, callback, value){
        let slider = new cc.ControlSlider(ReferenceName.OptionBarBG, ReferenceName.OptionsBarNegative, ReferenceName.FishSliderButton);
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

        let label = new cc.LabelTTF(labelText, "Arial", 30);
        label._setFontWeight("bold");
        label.setFontFillColor(new cc.Color(0,0,0,255));
        label.setPosition(slider.getContentSize().width +130, slider.getContentSize().height/2);
        label.setAnchorPoint(0,0.5);
        label.setRotation(180);

        slider.addChild(label);
        slider.addTargetWithActionForControlEvents(OptionsView, callback, cc.CONTROL_EVENT_VALUECHANGED);
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

    function dismissCallback(touch){
        if (GUIFunctions.isSpriteTouched(_background,touch)) {
            return;
        }
        this.hide();
    }

    let proto = OptionsView.prototype;

    proto.show = function(){
        BlockingManager.registerBlock(dismissCallback);
        thisParent.setLocalZOrder(ZORDER);
        _musicSlider.setEnabled(true);
        _soundSlider.setEnabled(true);
        _background.setVisible(true);
    };

    proto.hide = function () {
        thisParent.setLocalZOrder(-1000);
        _background.setVisible(false);
        _musicSlider.setEnabled(false);
        _soundSlider.setEnabled(false);
        BlockingManager.deregisterBlock(dismissCallback);
    };

    proto.destroyView = function () {
        GameView.destroyView(this._parent);
    };

    return OptionsView;
}());