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
        light.setBlendFunc(cc.ONE, cc.ONE);
        light.runAction(new cc.repeatForever(new cc.rotateBy(25,360)));

        _parent.addChild(bar);
        bar.setPosition(0,-22);

        _parent.addChild(title);
        title.setPosition(0,22);

        GameView.addView(_parent);

        //------------------- testing
        // const color = new cc.LayerColor(new cc.Color(20,145,224,255));
        const target = new cc.Sprite();
        target.setScale(0.2);
        target.setBlendFunc(cc.ONE, cc.ONE);
        // const target = new cc.Sprite(ReferenceName.JackpotBackground);
        // target.runAction(new cc.repeatForever(new cc.rotateBy(25,360)));
        const mask = new cc.Sprite(ReferenceName.JackpotBar);

        const maskedFill = new cc.ClippingNode(mask);
        maskedFill.setAlphaThreshold(0.9);

        // maskedFill.addChild(color,1);
        maskedFill.addChild(target);
        maskedFill.setPosition(0,-22);
        _parent.addChild(maskedFill);

        cc.spriteFrameCache.addSpriteFrames(res.WaterCausticAnimation);
        let animationArray = [];
        let count = 0;
        while (true) {
            let frameCount = String(count);
            while (frameCount.length < 5) {
                frameCount = '0' + frameCount;
            }
            const frame = cc.spriteFrameCache.getSpriteFrame("Caustic_" + frameCount + ".png");
            if (!frame) {
                break;
            }
            animationArray.push(frame);
            count++;
        }
        const animation = new cc.Animate(new cc.Animation(animationArray,0.05));
        target.runAction(new cc.repeatForever(animation));
        // animationArray.push(new cc.SpriteFrame(" "));

        //------------------------end test

        _parent.addChild(barFrame);
        barFrame.setPosition(0,-22);

        _parent.setPosition(683,666);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Impact";
        fontDef.fontWeight = "bold";
        fontDef.fontSize = 32;
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(255, 255, 255, 255);

        _label = new cc.LabelTTF("", fontDef);
        // this._label = new cc.LabelBMFont("",res.TestFont);
        _label.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        _label.setContentSize(bar.getContentSize());
        _label.setPosition(0,-22);
        _parent.addChild(_label);
    }

    const proto = JackpotView.prototype;

    proto.updateJackpot = function(value){
        // let prize = (value).toLocaleString('en-US', {maximumFractionDigits: 2});
        let prize = (value).toFixed(2);
        if (prize.length > 11) {
            prize = prize.substring(0,10) + "..";
        }
        _label.setString(prize);
    };

    proto.reattach = function () {
        _parent.getParent().removeChild(_parent,false);
        GameView.addView(_parent);
    };

    return JackpotView;
}());