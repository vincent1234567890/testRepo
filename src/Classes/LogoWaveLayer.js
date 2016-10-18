var LOGOSTATEUP = 0;
var LOGOSTATEDOWN = 1;
var LOGOSTATEMOVE = 2;

var LogoWaveLayer = cc.Layer.extend({
    ctor:function () {
        var spTexture = new cc.Sprite(ImageNameLang("#main_ui_title.png"));
        this.addChild(spTexture, 1);

        spTexture.setSkewY(-2);
        var moveup = new cc.MoveBy(1.5, cc.p(0, 3));
        moveup = moveup.easing(cc.easeInOut(2.0));
        // moveup = cc.EaseInOut.create(moveup, 2);
        var moveupdown = new cc.Sequence(moveup, moveup.reverse());
        var repeat = new cc.RepeatForever(moveupdown);

        var skewup = new cc.SkewBy(1.3, 1, 2);
        skewup = skewup.easing(cc.easeInOut());
        // skewup = cc.EaseSineInOut.create(skewup);
        var skewupdown = new cc.Sequence(skewup, skewup.reverse());
        var repeat2 = new cc.RepeatForever(skewupdown);

        var scaleup = new cc.ScaleBy(1.1, .99, 1);
        scaleup = scaleup.easing(cc.easeInOut());
        // scaleup = cc.EaseSineInOut.create(scaleup);
        var scaleupdown = new cc.Sequence(scaleup, scaleup.reverse());
        var repeat3 = new cc.RepeatForever(scaleupdown);

        spTexture.runAction(repeat);
        spTexture.runAction(repeat2);
        spTexture.runAction(repeat3);
    }
});

LogoWaveLayer.create = function () {
    var ret = new LogoWaveLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};