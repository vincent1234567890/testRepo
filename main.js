var cocos2dApp = cc.game.onStart = function() {
    "use strict";

    // if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
    //     document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    if(cc.sys.isMobile){
        //normal resources
        cc.loader.resPath = "res/CompanyA/";
    } else {
        //HD resources
        cc.loader.resPath = "res/CompanyAHD/";
    }

    // Uncomment the following line to set a fixed orientation for your game
    cc.view.setOrientation(cc.ORIENTATION_LANDSCAPE);

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(1366, 768, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    //load resources
    ClientServerConnect.doInitialConnect().then(
        data => {
            const themeConfig = data["themeConfig"];
            //should we load resources by server config?
            console.log(themeConfig);
            const resourceList = themeConfig["resourceList"];
            for (let i = 0; i < resourceList.length; i++) {
                for (let j = 0; j < themeConfig[resourceList[i]].length; j++) {
                    ResourceLoader.addResource(themeConfig["folderName"], resourceList[i], themeConfig[resourceList[i]][j]);
                }
            }

            for (let i = 0; i < themeConfig.resourceList.length; i++) {   //?
                for (let j in themeConfig[themeConfig.themeList[i]] ){
                    ThemeDataManager.setThemeData(themeConfig.themeList[i],themeConfig[themeConfig.themeList[i]]);
                }
            }

            ResourceLoader.finaliseResources();
            cc.LoadingScreen.preload(ResourceLoader.getResourceList(), function () {
                // cc.director.runScene(new LogoScene());
                //cc.director.runScene(new TestScene());

                AppManager.goToLobby(data.player);
                FishAnimationData.setData(themeConfig.FishRawData);
            }, this);
        }
     //).catch(console.error.bind(console));   //should show a friendly UI to tell user, can't connect to game server.
    ).catch(msg => {
        //show messages on error panel.
    });
};

cc.game.run();
console.log("version: 1.3.505b");

