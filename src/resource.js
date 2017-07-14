var res = {
    LoadingLogo: "loadingLogo.png",
    ParticlePlist: "particle.plist",

    LoadingCircle: "Loading/LoadingCircle.png",

    LobbyJackpotPng: "Lobby/Jackpot.png",
    LobbyJackpotPlist: "Lobby/Jackpot.plist",
    MenuPng: "Lobby/Menu.png",
    MenuPlist: "Lobby/Menu.plist",
    MenuFAQPng: "Lobby/MenuFAQ.png",
    MenuFAQPlist: "Lobby/MenuFAQ.plist",

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
    WhiteFontFile: "Fonts/BWtext.fnt",
    WhiteFontPng: "Fonts/BWtext.png",
    GoldCoinFontFile: "Fonts/GoldCoinText-export.fnt",
    GoldCoinFontPng: "Fonts/GoldCoinText-export.png",
    InGameLightGoldFontFile: "Fonts/LightGoldText.fnt",
    InGameLightGoldFontPng: "Fonts/LightGoldText.png",

    WaterCausticAnimation: "Lobby/Caustic.plist",

    //language
    ChinesePng: "Language/Chinese.png",
    ChinesePlist: "Language/Chinese.plist",
    EnglishPng: "Language/English.png",
    EnglishPlist: "Language/English.plist",

    //GameBackgrounds
    GameBackground0: "Game BG/Game BG 1.jpg",
    GameBackground1: "Game BG/Game BG 2.jpg",
    GameBackground2: "Game BG/Game BG 3.jpg",
    GameBackground3: "Game BG/Game BG 4.jpg",
    GameBackground4: "Game BG/Game BG 5.jpg",

    //FreeRound
    FreeRoundTitle: "Game/FreeRoundTitle.png",

    GunCockSound: "Sound/Sound/ChangeCannonFX.mp3",
    GunShotSound: "Sound/Sound/FirringFX.mp3",

    MenuButtonHoverSound: "Sound/Sound/cursor7.mp3",
    MenuButtonPressSound: "Sound/Sound/UIButton.mp3",
    JackpotViewPressedSound: "Sound/Sound/JP.mp3",
    JackpotInfoPanelDismissSound: "Sound/Sound/JPPopUP.mp3",
    ChangeSeatButtonPressedSound: "Sound/Sound/ChangeSit.mp3",

    FishCaptureEffectExplosionSound: "Sound/Sound/CoinExplosionFX1.mp3",
    BigFishCaptureEffectExplosionSound: "Sound/Sound/CoinExplosionFX2.mp3",
    FishCaptureEffectCoinSound: "Sound/Sound/CoinFX.mp3",

    JackpotTriggeredSound: "Sound/Sound/JPOperning.mp3",
    JackpotBoxOpeningSound: "Sound/Sound/JPOpenChest.mp3",
    JackpotMedalBlingSound: "Sound/Sound/JPBlink.mp3",
    JackpotEndSound: "Sound/Sound/JPwinning.mp3",

    FreeGameSound: "Sound/Sound/BonusGameFX.mp3",

    //BGM
    FreeGameBGM: "Sound/Music/FreeGameBGM.mp3",
    ArenaGameBGM: "Sound/Music/InGameBGM.mp3",
    JackpotBGM: "Sound/Music/JPBGM.mp3",
    LobbyBGM: "Sound/Music/LobbyBGM.mp3",
    MermaidFX: "Sound/Music/MermaidFX.mp3",

    //debug
    DebugCircle: "Testing/circle.png",
};

const ResourceLoader = (function () {
    "use strict";
    let plists = {};
    let g_resources = [];
    let _curLang = 'EN';

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
        for (let type in plists) {
            for (let list in plists[type]) {
                g_resources.push(plists[type][list]);
            }
        }
    }

    function setLang(opt) {
        _curLang = opt;
    }

    function getCurLangPlist() {
        switch (_curLang) {
            case 'CN':
            case '中文':
                return res.ChinesePlist;
            case 'EN':
                return res.EnglishPlist;
            default:
                return res.EnglishPlist;
        }
    }

    return {
        getResourceList: getResourceList,
        addResource: addResource,
        getPlists: getPlists,
        finaliseResources: finaliseResources,
        setLang: setLang,
        getCurLangPlist: getCurLangPlist,
    };
})(); 
