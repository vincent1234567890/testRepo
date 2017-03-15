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

        _parent.setPosition(645,666)



    }

    return JackpotView;
}());