var LOGOSTATEUP = 0;
var LOGOSTATEDOWN = 1;
var LOGOSTATEMOVE = 2;

var LogoWaveLayer = cc.Layer.extend({
    ctor:function () {
        cc.Layer.prototype.ctor.call(this);

        var spTexture = new cc.Sprite(ImageNameLang("main_ui_title.png"));
        this.addChild(spTexture, 1);

         spTexture.setSkewY(-2);
        var moveUp = new cc.MoveBy(1.5, cc.p(0, 3));
        moveUp.easing(cc.easeInOut(2.0));
        var moveUpDown = new cc.Sequence(moveUp, moveUp.reverse()).repeatForever();

        var skewUp = new cc.SkewBy(1.3, 1, 2);
        skewUp.easing(cc.easeSineInOut());
        var skewUpDown = new cc.Sequence(skewUp, skewUp.reverse()).repeatForever();

        var scaleUp = new cc.ScaleBy(1.1, 0.99, 1);
        scaleUp.easing(cc.easeSineInOut());
        var scaleUpDown = new cc.Sequence(scaleUp, scaleUp.reverse()).repeatForever();

        spTexture.runAction(moveUpDown);
        spTexture.runAction(skewUpDown);
        spTexture.runAction(scaleUpDown);

    }
});

LogoWaveLayer.create = function () {
    var ret = new LogoWaveLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};