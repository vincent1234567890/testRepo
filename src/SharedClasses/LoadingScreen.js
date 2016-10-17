// cc.LoadingScreen = cc.Class.extend(/**  @lends cc.LoaderScene# */{
//     _delegate:null,
//     _con:null,
//     ctor:function () {
//         var loadingAd = cc.$("#loadingAd");
//         this._delegate  = cc.$("#Percent");
//
//
//         var s = AutoAdapterScreen.getInstance().getWinSize();
//
//         loadingAd.style.display = "block";
//         loadingAd.style.left = s.width/2 + "px";
//
//         var KingFisher = document.querySelector("#KingFisher");
//
//         if (KingFisher) {
//             KingFisher.style.width = s.width + "px";
//             KingFisher.style.height = s.height + "px";
//         }
//
//
//     },
//
//     /**
//      * Draw loading screen
//      */
//     draw:function () {
//         this._delegate.innerHTML = "Loading... " + cc.LoaderLayer.getProgressBar() + "%";
//     },
//     removeSelft:function(){
//         cc.$("#loadingAd").style.display = "none";
//     }
// });
//
// /**
//  * Shared loader scene
//  * @return {cc.LoaderScene}
//  */
// cc.LoadingScreen.getInstance = function () {
//     if (!this._instance) {
//         this._instance = new cc.LoadingScreen();
//     }
//     return this._instance;
// };
//
// cc.LoadingScreen._instance = null;

cc.LoadingScreen = cc.LoaderScene.extend({
    init : function(){
        var self = this;

        var logoWidth = 460;
        var logoHeight = 170;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        self.addChild(bgLayer, 0);

        //image move to CCSceneFile.js
        var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;
        if(res.LoadingLogo){
            //loading logo
            cc.loader.loadImg(res.LoadingLogo, {isCrossOrigin : false }, function(err, img){
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
            fontSize = 14;
            lblHeight = -logoHeight / 2 - 10;
        }
        //loading percent
        var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
        label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
        label.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(this._label, 10);
        return true;
    },
})

cc.LoadingScreen._instance = null;

cc.LoadingScreen.preload = function(resources, cb, target){
    if(!cc.loadingScreen) {
        cc.loadingScreen = new cc.LoadingScreen();
        cc.loadingScreen.init();
        cc.eventManager.addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function(){
            cc.loadingScreen._updateTransform();
        });
    }
    cc.loadingScreen.initWithResources(resources, cb, target);

    cc.director.runScene(cc.loadingScreen);
    return cc.loadingScreen;
};