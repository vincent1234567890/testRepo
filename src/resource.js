var res = {
    LoadingLogo: "loadingLogo.png",
    ParticlePlist: "particle.plist",

    LoadingCircle: "Loading/LoadingCircle.png",

    LobbyJackpotPng: "Lobby/Jackpot.png",
    LobbyJackpotPlist: "Lobby/Jackpot.plist",
    MenuPng: "Lobby/Menu.png",
    MenuPlist: "Lobby/Menu.plist",

    GameUIPng: "Game/GameUI.png",
    GameUIPlist: "Game/GameUI.plist",

    //jackpot
    JackpotMiniGamePng: "Jackpot/JPminigame.png",
    JackpotMiniGamePlist: "Jackpot/JPminigame.plist",
    JackpotMiniGame2Png: "Jackpot/JPminigame2.png",
    JackpotMiniGame2Plist: "Jackpot/JPminigame2.plist",
    JackpotCoinAnimationPng: "Jackpot/JPCoinAnimation.png",
    JackpotCoinAnimationPlist: "Jackpot/JPCoinAnimation.plist",
    JackpotGoldTextPng: "Jackpot/GoldCoinText-export.png",
    JackpotGoldTextFont: "Jackpot/GoldCoinText-export.fnt",

    //Lobby
    LobbyUI2Png: "Lobby/LobbyUI2.png",
    LobbyUI2Plist: "Lobby/LobbyUI2.plist",
    LobbyUIPng: "Lobby/LobbyUI.png",
    LobbyUIPlist: "Lobby/LobbyUI.plist",

    SeatSelectionPng: "Lobby/SitSelection.png",
    SeatSelectionPlist: "Lobby/SitSelection.plist",

    //Fonts
    WhiteFontFile : "Fonts/BWtext.fnt",
    WhiteFontPng : "Fonts/BWtext.png",
    GoldCoinFontFile : "Fonts/GoldCoinText-export.fnt",
    GoldCoinFontPng : "Fonts/GoldCoinText-export.png",
    InGameLightGoldFontFile : "Fonts/LightGoldText.fnt",
    InGameLightGoldFontPng : "Fonts/LightGoldText.png",

    WaterCausticAnimation : "Lobby/Caustic.plist",

    //GameBackgrounds
    GameBackground0: "Game BG/Game BG 1.png",
    GameBackground1: "Game BG/Game BG 2.png",
    GameBackground2: "Game BG/Game BG 3.png",
    GameBackground3: "Game BG/Game BG 4.png",

    //FreeRound
    FreeRoundTitle : "Game/FreeRoundTitle.png",

    GunCockSound : "Sound/gun-cocking-01.mp3",
    GunShotSound : "Sound/gun-gunshot-01.mp3",

    //debug
    DebugCircle: "Testing/circle.png",
};

const ResourceLoader = (function () {
    "use strict";
    var plists = {};
    var g_resources = [];

    function getResourceList() {
        return g_resources;
    }

    function addResource(company, type, name) {
        //const constructedName = "res/" + company + "/" + type + "/" + name;
        const constructedName = type + "/" + name;
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
