
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
                //cc.director.runScene(new TestScene());
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
console.log("version: 1.3.417b");

