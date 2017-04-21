cc.LoadingScreen = cc.LoaderScene.extend({
    _spShark: null,

    init : function() {
        let self = this;

        // bg
        let bgLayer = self._bgLayer = new cc.LayerColor(cc.color(7, 10, 64, 255));
        self.addChild(bgLayer, 0);

        //background
        let imgLoadingBg = document.getElementById("imgLoadingBG");
        if (!imgLoadingBg) {
            if (res.LoadingBackgroundPng) {
                cc.loader.loadImg(res.LoadingIconPng, {isCrossOrigin: false}, function (err, img) {
                    let spBackground = new cc.Sprite(res.LoadingBackgroundPng);
                    bgLayer.addChild(spBackground);
                    spBackground.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
                });
            }
        } else {
            let spBackground = new cc.Sprite(imgLoadingBg);
            bgLayer.addChild(spBackground);
            spBackground.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
        }

        //add a logo
        if (res.LoadingLogo) {
            cc.loader.loadImg(res.LoadingLogo, {isCrossOrigin: false}, function (err, img) {
                let spLogo = new cc.Sprite(res.LoadingLogo);
                spLogo.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 200);
                bgLayer.addChild(spLogo, 10);
            });
        }

        if (res.LoadingIconPng) {
            //loading logo
            cc.loader.loadImg(res.LoadingIconPng, {isCrossOrigin: false}, function (err, img) {
                cc.loader.load(res.LoadingIconPlist, function (err, img) {
                    cc.spriteFrameCache.addSpriteFrames(res.LoadingIconPlist);
                    //logoWidth = img.width;
                    //logoHeight = img.height;
                    //self._initStage(img, cc.visibleRect.center);
                    let spShark = self._spShark = new cc.Sprite(ReferenceName.LoadingIcon_00000);
                    spShark.setPosition(0, 195);
                    bgLayer.addChild(spShark, 10);

                    let boxAnimation = GUIFunctions.getAnimation(ReferenceName.LoadingIconAnim, 0.03);
                    spShark.runAction(boxAnimation.repeatForever());
                });
            });
        }
        //loading percent
        let label = self._label = new cc.LabelTTF("加载资源中... 0%", "Arial", 24);
        label.setPosition(cc.visibleRect.center.x, 120);
        label.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(this._label, 10);
        return true;
    },

    loadingCallback: function(result, count, loadedCount){
        //cc.LoaderScene.prototype.loadingCallback.call(this, result, count, loadedCount);
        let percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        this._label.setString("资源加载中... " + percent + "% (已加载" + loadedCount + "/" + count + ")");
        if(this._spShark){
            this._spShark.setPositionX((cc.winSize.width - 190) * (loadedCount / count));
        }
    },

    cleanup: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.LoadingIconPlist);
        cc.Scene.prototype.cleanup.call(this);
    }
});

cc.LoadingScreen._instance = null;

cc.LoadingScreen.preload = function(resources, cb, target){
    if(!cc.loadingScreen) {
        cc.loadingScreen = new cc.LoadingScreen();
        cc.loadingScreen.init();
    }
    cc.loadingScreen.initWithResources(resources, cb, target);

    cc.director.runScene(cc.loadingScreen);
    return cc.loadingScreen;
};