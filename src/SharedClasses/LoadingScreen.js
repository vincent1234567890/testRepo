cc.LoadingScreen = cc.LoaderScene.extend({
    _pgLoadingIcon: null,

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
            cc.loader.loadImg(cc.loader.resPath + res.LoadingLogo, {isCrossOrigin: false}, function (err, img) {
                let spLogo = new cc.Sprite(res.LoadingLogo);
                spLogo.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 200);
                bgLayer.addChild(spLogo, 10);
            });
        }

        //loading icon
        /*const imgLoadingFrame = document.getElementById("imgLoadingIconFrame"),
            imgLoadingIcon = document.getElementById("imgLoadingIcon");
        if(imgLoadingFrame && imgLoadingIcon){
            let spLoadingFrame = new cc.Sprite(imgLoadingFrame);
            bgLayer.addChild(spLoadingFrame);
            spLoadingFrame.setPosition(cc.visibleRect.center.x, cc.visibleRect.center.y - 98);
            
            const spLoadingIcon = this._spLoadingIcon = new cc.Sprite(imgLoadingIcon);
            const pgLoadingIcon = this._pgLoadingIcon = new cc.ProgressTimer(spLoadingIcon);
            bgLayer.addChild(pgLoadingIcon);
            pgLoadingIcon.setPosition(cc.visibleRect.center.x, cc.visibleRect.center.y - 98);
            pgLoadingIcon.setType(cc.ProgressTimer.TYPE_BAR);
            pgLoadingIcon.setMidpoint(cc.p(0, 0));
            pgLoadingIcon.setBarChangeRate(cc.p(1, 0));
        }*/

        cc.loader.loadImg(cc.loader.resPath + "Loading/LoadingBarBase.png", {isCrossOrigin: false}, function (err, img) {
            const spLoadingFrame = new ccui.Scale9Sprite("Loading/LoadingBarBase.png");
            spLoadingFrame.setCapInsets(new cc.Rect(25, 16, 76, 7));
            spLoadingFrame.setPreferredSize(new cc.Size(500, 50));
            bgLayer.addChild(spLoadingFrame);
            spLoadingFrame.setPosition(cc.visibleRect.center.x, 180);
        });
        cc.loader.loadImg(cc.loader.resPath + "Loading/LoadingBar.png", {isCrossOrigin: false}, function (err, img) {
            const spLoadingBar = self._spLoadingIcon = new ccui.Scale9Sprite("Loading/LoadingBar.png");
            spLoadingBar.setCapInsets(new cc.Rect(25, 12, 69, 5));
            spLoadingBar.setContentSize(new cc.Size(62, 38));
            spLoadingBar.setAnchorPoint(0, 0.5);
            bgLayer.addChild(spLoadingBar, 9);
            spLoadingBar.setPosition(cc.visibleRect.center.x - 245, 180);
        });

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
        if(this._spLoadingIcon){
            const width = 0|(62 +  (490 - 62) * (loadedCount / count));
            this._spLoadingIcon.setPreferredSize(new cc.Size(width, 38));
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