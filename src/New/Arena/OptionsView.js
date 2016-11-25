/**
 * Created by eugeneseah on 23/11/16.
 */

const OptionsView = (function () {
    "use strict";
    const ENDOFFSET = 0.05;
    let _background;
    let _touchlayer;

    function OptionsView (parent){
        this._parent = parent;
        _background = new cc.Sprite(ReferenceName.OptionsBG);
        _background.setPosition(cc.view.getDesignResolutionSize().width/2, cc.view.getDesignResolutionSize().height / 2);

        this._music = createSlider("Music", musicValueChangedEvent);
        this._sound = createSlider("Sound", soundValueChangedEvent);

        this._music.setPosition(_background.getContentSize().width/2 + 60,_background.getContentSize().height/2 + 80);
        this._sound.setPosition(_background.getContentSize().width/2 + 60,_background.getContentSize().height/2 + 10);

        _touchlayer = new TouchLayerRefactored(dismissCallback);
        _touchlayer.setSwallowTouches(true);

        _background.addChild(_touchlayer,1);
        _background.addChild(this._music);
        _background.addChild(this._sound);
        this._parent.addChild(_background,1);
    }

    function createSlider(labelText, callback){
        let slider = new cc.ControlSlider(ReferenceName.OptionBarBG, ReferenceName.OptionsBarNegative, ReferenceName.FishSliderButton);
        slider._thumbSprite.setFlippedX(true);
        slider._thumbSprite.setFlippedY(true);
        slider._progressSprite.setFlippedX(true);
        slider._progressSprite.setFlippedY(true);
        slider._backgroundSprite.setFlippedX(true);
        slider._backgroundSprite.setFlippedY(true);
        slider.setMinimumValue(0.0); // Sets the min value of range
        slider.setMinimumAllowedValue(ENDOFFSET);
        slider.setValue(ENDOFFSET);
        slider.setMaximumValue(1+ENDOFFSET); // Sets the max value of range
        slider.setRotation(180);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = "30";
        fontDef.fontStyle = "bold";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0,0,0,255);
        let label = new cc.LabelTTF(labelText, fontDef);
        label.setPosition(slider.getContentSize().width +130, slider.getContentSize().height/2);
        label.setAnchorPoint(0,0.5);
        label.setRotation(180);

        slider.addChild(label);
        slider.addTargetWithActionForControlEvents(OptionsView, callback, cc.CONTROL_EVENT_VALUECHANGED);


        return slider;
    }

    function musicValueChangedEvent(sender, controlEvent){
        cc.audioEngine.setMusicVolume(1 - (sender.getValue().toFixed(2)-ENDOFFSET)); // because it is flipped
    }

    function soundValueChangedEvent(sender, controlEvent){
        cc.audioEngine.setEffectsVolume(1 - (sender.getValue().toFixed(2)-ENDOFFSET)); // because it is flipped
    }

    function dismissCallback(touch){
        if (GUIFunctions.isSpriteTouched(_background,touch)) {
            return;
        }
        _touchlayer.setSwallowTouches(false);
        _touchlayer.setEnable(false);
        _background.setVisible(false);

    }

    let proto = OptionsView.prototype;

    proto.show = function(){
        _touchlayer.setSwallowTouches(true);
        _touchlayer.setEnable(true);
        _background.setVisible(true);
    };
    return OptionsView;
}());