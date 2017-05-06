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
    CausticPng: "Lobby/Caustic.png",
    CausticPlist: "Lobby/Caustic.plist",

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
    GameBackground4: "Game BG/Game BG 5.png",

    //FreeRound
    FreeRoundTitle : "Game/FreeRoundTitle.png",

    GunCockSound : "Sound/Sound/換炮音效-修1.mp3",
    GunShotSound : "Sound/Sound/發炮音效-修2.mp3",

    MenuButtonHoverSound : "Sound/Sound/cursor7.mp3",
    MenuButtonPressSound : "Sound/Sound/se_maoudamashii_se_pc01.mp3",
    JackpotViewPressedSound : "Sound/Sound/powerup10.mp3",
    JackpotInfoPanelDismissSound : "Sound/Sound/decision15.mp3",
    ChangeSeatButtonPressedSound : "Sound/Sound/bubble-burst1.mp3",

    FishCaptureEffectExplosionSound : "Sound/Sound/爆炸音效1.mp3",
    BigFishCaptureEffectExplosionSound : "Sound/Sound/爆炸音效2.mp3",
    FishCaptureEffectCoinSound : "Sound/Sound/金幣音效-修1.mp3",

    JackpotTriggeredSound : "Sound/Sound/Jackpot Opening-修1.mp3",
    JackpotBoxOpeningSound : "Sound/Sound/打開寶箱-修1.mp3",
    JackpotMedalBlingSound : "Sound/Sound/Jackpot Bling.mp3",
    JackpotEndSound : "Sound/Sound/Jackpot ending.mp3",

    FreeGameSound : "Sound/Sound/Bonus game opening.mp3",

    //debug
    DebugCircle: "Testing/circle.png",
};

const ResourceLoader = (function () {
    "use strict";
    let plists = {};
    let g_resources = [];

    function getResourceList() {
        return g_resources;
    }

    //resource by company.
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
