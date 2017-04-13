
//////////////////////////////////////////////////////////////////////////
// implement VisableRect
//////////////////////////////////////////////////////////////////////////



var cocos2dApp = cc.game.onStart = function() {
    // if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
    //     document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(1366, 768, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    //load resources

    // var scene = LogoScene.scene();
    //move global into app
    // AnchorPointCenter = new cc.p(0.5, 0.5);
    // AnchorPointTop = new cc.p(0.5, 1);
    // AnchorPointTopRight = new cc.p(1, 1);
    // AnchorPointRight = new cc.p(1, 0.5);
    // AnchorPointBottomRight = new cc.p(1, 0);
    // AnchorPointBottom = new cc.p(0.5, 0);
    // AnchorPointBottomLeft = new cc.p(0, 0);
    // AnchorPointLeft = new cc.p(0, 0.5);
    // AnchorPointTopLeft = new cc.p(0, 1);
    //
    // s_rcVisible = cc.rect();
    // s_ptCenter = cc.p();
    // s_ptTop = cc.p();
    // s_ptTopRight = cc.p();
    // s_ptRight = cc.p();
    // s_ptBottomRight = cc.p();
    // s_ptBottom = cc.p();
    // s_ptLeft = cc.p();
    // s_ptTopLeft = cc.p();
    //
    //
    // LoadingDuration = Date.now();
    // var self = this;
    ClientServerConnect.connectToMasterServer().then(
        data => {
            const themeConfig = data.themeConfig;
            console.log(themeConfig);
            for (let i = 0; i < themeConfig.resourceList.length; i++) {
                for (let j = 0; j < themeConfig[themeConfig.resourceList[i]].length; j++) {
                    // console.log("themeConfig.resourceList.length:", themeConfig.resourceList.length, "themeConfig[themeConfig.resourceList[i]].length", themeConfig[themeConfig.resourceList[i]].length,i,j,themeConfig[themeConfig.resourceList[i]], themeConfig[themeConfig.resourceList[i]][j]);
                    ResourceLoader.addResource(themeConfig.folderName, themeConfig.resourceList[i], themeConfig[themeConfig.resourceList[i]][j]);
                    // ThemeDataManager.setThemeData()
                }
            }

            for (let i = 0; i < themeConfig.resourceList.length; i++) {
                // for (let j = 0; j < themeConfig[themeConfig.resourceList[i]].length; j++) {
                for (let j in themeConfig[themeConfig.themeList[i]] ){
                    // console.log("themeConfig.resourceList.length:", themeConfig.resourceList.length, "themeConfig[themeConfig.resourceList[i]].length", themeConfig[themeConfig.resourceList[i]].length,i,j,themeConfig[themeConfig.resourceList[i]], themeConfig[themeConfig.resourceList[i]][j]);
                    // ResourceLoader.addResource(themeConfig.folderName, themeConfig.resourceList[i], themeConfig[themeConfig.resourceList[i]][j]);
                    // console.log(i,j,themeConfig.themeList[i],themeConfig[themeConfig.themeList[i]],themeConfig[themeConfig.themeList[i]][j]);
                    ThemeDataManager.setThemeData(themeConfig.themeList[i],themeConfig[themeConfig.themeList[i]]);
                }
            }

            ResourceLoader.finaliseResources();

            cc.LoadingScreen.preload(ResourceLoader.getResourceList(), function () {
                // cc.director.runScene(new LogoScene());
                // cc.director.runScene(new TestScene());
                // cc.director.runScene(new StartMenuLayer());

                AppManager.goToLobby();
                FishAnimationData.setData(themeConfig.FishRawData);
                // GameCtrl.sharedGame().home();
                // AppManager.goToLobby();
            }, this);
        }
    ).catch(console.error.bind(console));
};

cc.game.run();

// var VisibleRect = {
//     rect : function () {
//         if (s_rcVisible.width == 0) {
//             var s = cc.winSize;
//             s_rcVisible = cc.rect(0, 0, s.width, s.height);
//         }
//         return s_rcVisible;
//     },
//     center:function () {
//         if (s_ptCenter.x == 0) {
//             var rc = this.rect();
//             s_ptCenter.x = rc.x + rc.width / 2;
//             s_ptCenter.y = rc.y + rc.height / 2;
//         }
//         return s_ptCenter;
//     },
//     top:function () {
//         if (s_ptTop.x == 0) {
//             var rc = this.rect();
//             s_ptTop.x = rc.x + rc.width / 2;
//             s_ptTop.y = rc.y + rc.height;
//         }
//         return s_ptTop;
//     },
//     topRight:function () {
//         if (s_ptTopRight.x == 0) {
//             var rc = this.rect();
//             s_ptTopRight.x = rc.x + rc.width;
//             s_ptTopRight.y = rc.y + rc.height;
//         }
//         return s_ptTopRight;
//     },
//     right:function () {
//         if (s_ptRight.x == 0) {
//             var rc = this.rect();
//             s_ptRight.x = rc.x + rc.width;
//             s_ptRight.y = rc.y + rc.height / 2;
//         }
//         return s_ptRight;
//     },
//     bottomRight:function () {
//         if (s_ptBottomRight.x == 0) {
//             var rc = this.rect();
//             s_ptBottomRight.x = rc.x + rc.width;
//             s_ptBottomRight.y = rc.y;
//         }
//         return s_ptBottomRight;
//     },
//     bottom:function () {
//         if (s_ptBottom.x == 0) {
//             var rc = this.rect();
//             s_ptBottom.x = rc.x + rc.width / 2;
//             s_ptBottom.y = rc.y;
//         }
//         return s_ptBottom;
//     },
//     bottomLeft:function () {
//         return this.rect();
//     },
//     left:function () {
//         if (s_ptLeft.x == 0) {
//             var rc = this.rect();
//             s_ptLeft.x = rc.x;
//             s_ptLeft.y = rc.y + rc.height / 2;
//         }
//         return s_ptLeft;
//     },
//     topLeft:function () {
//         if (s_ptTopLeft.x == 0) {
//             var rc = this.rect();
//             s_ptTopLeft.x = rc.x;
//             s_ptTopLeft.y = rc.y + rc.height;
//         }
//         return s_ptTopLeft;
//     }
// };
