var LogoScene = cc.LayerColor.extend({
    init:function () {
        if (this._super()) {
            var a = new cc.Color4B(243, 243, 243, 256);
            this.initWithColor(a);
            var logo = cc.Sprite.create("Resource/MainBg.jpg");
            logo.setPosition(VisibleRect.center());
            this.addChild(logo);
            var seq = cc.Sequence.create(
                cc.DelayTime.create(1.0),
                cc.FadeOut.create(1.0),
                cc.CallFunc.create(this, this.goMainMenuScene, logo));
            logo.runAction(seq);
        }
        return true;
    },
    goMainMenuScene:function (sender, data) {
        GameCtrl.sharedGame().home();
    }
});

LogoScene.create = function () {
    var ret = new LogoScene();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};

LogoScene.scene = function () {
    var scene = cc.Scene.create();
    var layer = LogoScene.create();
    scene.addChild(layer);
    return scene;
};
