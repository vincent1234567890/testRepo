/**
 * Created by eugeneseah on 10/3/17.
 */
const JackpotView = (function () {
    "use strict";
    let _parent;
    let _label;
    function JackpotView() {
        const bg = new cc.Sprite(ReferenceName.JackpotBackground);
        const shadow = new cc.Sprite(ReferenceName.JackpotShadow);
        const bar = new cc.Sprite(ReferenceName.JackpotBar);
        const barFrame = new cc.Sprite(ReferenceName.JackpotBarFrame);
        const title = new cc.Sprite(ReferenceName.JackpotTitleChinese);
        const light = new cc.Sprite(ReferenceName.JackpotLight);

        _parent = new cc.Node();

        _parent.addChild(shadow);
        shadow.setPosition(0,-5);

        _parent.addChild(bg);

        _parent.addChild(light);
        light.runAction(new cc.repeatForever(new cc.rotateBy(25,360)));

        _parent.addChild(bar);
        bar.setPosition(0,-22);

        _parent.addChild(barFrame);
        barFrame.setPosition(0,-22);

        _parent.addChild(title);
        title.setPosition(0,22);


        GameView.addView(_parent);

        _parent.setPosition(645,666);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Impact";
        fontDef.fontWeight = "bold";
        fontDef.fontSize = 42;
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(255, 255, 255, 255);

        _label = new cc.LabelTTF("", fontDef);
        // this._label = new cc.LabelBMFont("", res.GoldenNumbersPlist);
        // this._label = new cc.LabelBMFont("",res.TestFont);
        _label.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        _label.setContentSize(bar.getContentSize());
        _label.setPosition(0,-22);
        _parent.addChild(_label);
    }

    const proto = JackpotView.prototype;

    proto.updateJackpot = function(value){
        let prize = (value).toLocaleString('en-US');
        if (prize.length > 11) {
            prize = prize.substring(0,10) + "..";
        }
        _label.setString(prize);
    };

    return JackpotView;
}());