/**
 * Created by eugeneseah on 10/3/17.
 */
const JackpotView = (function () {
    "use strict";
    let _parent;
    function JackpotView() {
        const bg = new cc.Sprite(ReferenceName.JackpotBackground);
        const shadow = new cc.Sprite(ReferenceName.JackpotShadow);
        const bar = new cc.Sprite(ReferenceName.JackpotBar);
        const barFrame = new cc.Sprite(ReferenceName.JackpotBarFrame);
        const text = new cc.Sprite(ReferenceName.JackpotTitleChinese);

        _parent = new cc.Node();

        _parent.addChild(bg);
        bg.setAnchorPoint(0.5,0.5);
        _parent.addChild(shadow,-1);
        shadow.setAnchorPoint(0.5,0.5);
        _parent.addChild(bar);
        bar.setAnchorPoint(0.5,0.5);
        _parent.addChild(barFrame);
        bar.setPosition(0,-22);
        barFrame.setAnchorPoint(0.5,0.5);
        _parent.addChild(text);
        barFrame.setPosition(0,-22);
        text.setAnchorPoint(0.5,0.5);

        GameView.addView(_parent);

        _parent.setPosition(400,400)


    }
    return JackpotView;
}());