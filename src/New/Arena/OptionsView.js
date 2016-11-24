/**
 * Created by eugeneseah on 23/11/16.
 */

var OptionsView = (function () {
    const ENDOFFSET = 0.05;
    function OptionsView (parent){
        "use strict";
        this._parent = parent;
        this._background = new cc.Sprite(ReferenceName.OptionsBG);
        this._background.setPosition(cc.view.getDesignResolutionSize().width/2, cc.view.getDesignResolutionSize().height / 2);

        this._music = createSlider("Music", musicValueChangedEvent);
        this._sound = createSlider("Sound");

        this._music.setPosition(this._background.getContentSize().width/2 + 60,this._background.getContentSize().height/2 + 80);
        this._sound.setPosition(this._background.getContentSize().width/2 + 60,this._background.getContentSize().height/2 + 10);

        this._background.addChild(this._music);
        this._background.addChild(this._sound);
        this._parent.addChild(this._background);
    }

    function createSlider(labelText, callback){
        "use strict";
        var slider = new cc.ControlSlider(ReferenceName.OptionBarBG, ReferenceName.OptionsBarNegative, ReferenceName.FishSliderButton);
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

        var fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = "30";
        fontDef.fontStyle = "bold";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0,0,0,255);
        var label = new cc.LabelTTF(labelText, fontDef);
        label.setPosition(slider.getContentSize().width +130, slider.getContentSize().height/2);
        label.setAnchorPoint(0,0.5);
        label.setRotation(180);

        slider.addChild(label);
        slider.addTargetWithActionForControlEvents(OptionsView, callback, cc.CONTROL_EVENT_VALUECHANGED);


        return slider;
    }

    function musicValueChangedEvent(sender, controlEvent){
        "use strict";
        cc.audioEngine.setEffectsVolume(sender.getValue().toFixed(2)-ENDOFFSET);
    }

    return OptionsView;
}());