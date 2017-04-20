var res = {
    LoadingLogo: "res/loadingLogo.jpg",

    ParticlePlist: "res/particle.plist",

    //jackpot
    JackpotMiniGamePng: "res/CompanyA/Jackpot/JPminigame.png",
    JackpotMiniGamePlist: "res/CompanyA/Jackpot/JPminigame.plist",
    JackpotMiniGame2Png: "res/CompanyA/Jackpot/JPminigame2.png",
    JackpotMiniGame2Plist: "res/CompanyA/Jackpot/JPminigame2.plist",
    JackpotCoinAnimationPng: "res/CompanyA/Jackpot/JPCoinAnimation.png",
    JackpotCoinAnimationPlist: "res/CompanyA/Jackpot/JPCoinAnimation.plist",
    JackpotGoldTextPng: "res/CompanyA/Jackpot/GoldCoinText-export.png",
    JackpotGoldTextFont: "res/CompanyA/Jackpot/GoldCoinText-export.fnt",

    //Lobby
    LobbyUI2Png: "res/CompanyA/Lobby/LobbyUI2.png",
    LobbyUI2Plist: "res/CompanyA/Lobby/LobbyUI2.plist",

    //testing
    testingEffect: "res/CompanyA/Game/FREffect.plist",

    WaterCausticAnimation : "res/CompanyA/Lobby/Caustic.plist",

    // WaterCaustic0 : "res/CompanyA/Lobby/Caustic1.png",
    // WaterCaustic1 : "res/CompanyA/Lobby/Caustic2.png",
    // WaterCaustic2 : "res/CompanyA/Lobby/Caustic3.png",
    // WaterCaustic3 : "res/CompanyA/Lobby/Caustic4.png",
    // WaterCaustic4 : "res/CompanyA/Lobby/Caustic5.png",
    // WaterCaustic5 : "res/CompanyA/Lobby/Caustic masking 1_00000.png",

    //GameFrame
    // GameFrame: "res/New/InGameFrame.png",
    // GameFrame2: "res/New/InGameFrame2.png",

    //GameBackgrounds
    GameBackground0: "res/CompanyA/Game BG/Game BG 1.png",
    GameBackground1: "res/CompanyA/Game BG/Game BG 2.png",
    GameBackground2: "res/CompanyA/Game BG/Game BG 3.png",
    GameBackground3: "res/CompanyA/Game BG/Game BG 4.png",


    // GoldenNumbersPlist : "res/New/Fonts/GoldNumber.plist",
    // GoldNumberPng : "res/New/Fonts/GoldNumber.png",
    //
    // TestFont : "res/New/Fonts/test-export.fnt",
    // TestFontPNG : "res/New/Fonts/test-export.png",

    GunCockSound : "res/CompanyA/Sound/gun-cocking-01.mp3",
    GunShotSound : "res/CompanyA/Sound/gun-gunshot-01.mp3",

    //debug
    DebugCircle: "res/CompanyA/Testing/circle.png",
};

const ResourceLoader = (function () {
    "use strict";
    var plists = {};
    var g_resources = [];

    function getResourceList() {
        return g_resources;
    }

    function addResource(company, type, name) {
        const constructedName = "res/" + company + "/" + type + "/" + name;
        g_resources.push(constructedName + ".png");
        plists[type] = plists[type] || [];
        plists[type].push(constructedName + ".plist");
    }

    function getPlists(type) {
        return plists[type];
    }

    function finaliseResources() {
        for (let i in res) {
            g_resources.push(res[i]);
        }
        for (let type in plists){
            for (let list in plists[type]){
                g_resources.push(plists[type][list]);
            }
        }
    }

    return {
        getResourceList: getResourceList,
        addResource: addResource,
        getPlists: getPlists,
        finaliseResources: finaliseResources,
    };
})(); 
