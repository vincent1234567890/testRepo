// var LogoScene = cc.LayerColor.extend({
//     init:function () {
//         debugger
//         if (this._super()) {
//             // var a = new cc.Color4B(243, 243, 243, 256);
//             var a = new cc.color(243, 243, 243, 256);
//             this.initWithColor(a);
//             var logo = cc.Sprite.create("Resource/MainBg.jpg");
//             logo.setPosition(VisibleRect.center());
//             this.addChild(logo);
//
//             var seq = cc.sequence(
//                 cc.delayTime(1.0),
//                 cc.fadeOut(1.0),
//                 cc.callFunc(this, this.goMainMenuScene, logo));
//             logo.runAction(seq);
//         }
//         return true;
//     },
//     goMainMenuScene:function (sender, data) {
//         GameCtrl.sharedGame().home();
//     }
// });
//
// LogoScene.create = function () {
//     var ret = new LogoScene();
//     if (ret && ret.init()) {
//         return ret;
//     }
//     return null;
// };
//
// LogoScene.scene = function () {
//     debugger
//     var scene = cc.Scene();
//     var layer = LogoScene.create();
//     scene.addChild(layer);
//     return scene;
// };
var LogoSceneLayer = cc.LayerGradient.extend({
    logo : null,
    ctor:function () {

        // if (this._super()) {
        this._super();
            // var a = new cc.Color4B(243, 243, 243, 256);
            var a = new cc.color(243, 243, 243, 256);
            this.setStartColor(a);
            // var logo = cc.Sprite.create("Resource/MainBg.jpg");
            this.logo = new cc.Sprite (res.LoadingCompanyLogoScreen);
            this.logo.setPosition(VisibleRect.center());
            // this.logo.x = VisibleRect.center().x;
            // this.logo.y = VisibleRect.center().y;
            this.addChild(this.logo);
            var seq = cc.sequence(
                cc.delayTime(1.0),
                cc.fadeOut(1.0),
                cc.callFunc(this.goMainMenuScene, this , this.logo));
            this.logo.runAction(seq);
        // }
        return true;
    },

    goMainMenuScene:function (sender, data) {
        ClientServerConnect.connectToMasterServer();
        GameCtrl.sharedGame().home();
    }
});


var LogoScene = cc.Scene.extend({
    // ctor:function () {
    //     debugger
    // },
    onEnter:function () {
        this._super();
        var layer = new LogoSceneLayer();
        this.addChild(layer);
    }
});

