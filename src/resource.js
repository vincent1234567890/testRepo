var sino = sino || {};

cc.loader.register(["sprite"], cc._binaryLoader); //register sprite file loader.

var res = {
    LoadingLogo : "res/loadingLogo.jpg",
    LoadingAdBg : "res/LoadingAdBg.jpg",
    LoadingCompanyLogoScreen : "res/MainBg.jpg",

    AchievementPlist :"res/Achievement.plist",
    ChestFishPlist: "res/ChestFish.plist",

    music_1 : "res/music/music_1.ogg",
    music_2 : "res/music/music_2.ogg",
    music_3 : "res/music/music_3.ogg",
    music_4 : "res/music/music_4.ogg",
    music_5 : "res/music/music_5.ogg",
    music_6 : "res/music/music_6.ogg",

    LASER_EFFECT : "res/sound/bgm_laser.ogg",
    CHANGECANNON_EFFECT : "res/sound/bgm_change_cannon.ogg",
    CAMERA_EFFECT : "res/sound/bgm_camera.ogg",
    BOX_EFFECT : "res/sound/bgm_box.ogg",

    LEVINSTORM_EFFECT : "res/sound/LevinStorm_explode_sound.ogg",
    ACH_EFFECT : "res/sound/bgm_ach.ogg",
    COUNTDOWN_EFFECT : "res/sound/3secondscountdown.ogg",
    GO_EFFECT : "res/sound/bgm_go.ogg",
    SO_EFFECT : "res/sound/bgm_so.ogg",
    UI_EFFECT_03 : "res/sound/effect_ui_03.ogg",
    SURF_EFFECT : "res/sound/bgm_surf.ogg",

    kBGM_RUNOUTBULLET : "res/sound/bgm_rayover.ogg",
    COIN_EFFECT1 : "res/sound/bgm_coin_01.ogg",
    COIN_EFFECT2 : "res/sound/bgm_coin_02.ogg",
    COIN_EFFECT3 : "res/sound/bgm_coin_03.ogg",
    FIRE_EFFECT : "res/sound/bgm_fire.ogg",
    NET_EFFECT : "res/sound/bgm_net.ogg",
    BUTTON_EFFECT : "res/sound/bgm_button.ogg",

    startMenuLayerPng: "res/StartMenuLayer.png",
    StartMenuPlist : "res/StartMenuLayer.plist",
    LogoScenePng : "res/logoscene.png",
    LogoScenePlist : "res/logoscene.plist",
    ButtonsPng : "res/buttons.png",
    ButtonsPlist : "res/buttons.plist",
    IconsPng : "res/icons.png",
    IconsPlist : "res/icons.plist",
    ChestRewardsPng : "res/chestreward.png",
    ChestRewardsPlist : "res/chestreward.plist",
    MainPng : "res/main.png",
    MainPlist : "res/main.plist",
    TutorialPng : "res/tutorial.png",
    TutorialPlist : "res/tutorial.plist",

    ProbabilityPlist : "res/probability.plist",

    Track1_1 : "res/Track1_1.plist",
    Track1_2 : "res/Track1_2.plist",
    Track1_3 : "res/Track1_3.plist",
    Track1_4 : "res/Track1_4.plist",
    Track1_5 : "res/Track1_5.plist",
    Track1_6 : "res/Track1_6.plist",
    Track1_7 : "res/Track1_7.plist",
    Track1_8 : "res/Track1_8.plist",
    Track1_9 : "res/Track1_9.plist",
    Track1_10 : "res/Track1_10.plist",
    Track1_11 : "res/Track1_11.plist",
    Track1_12 : "res/Track1_12.plist",
    Track1_13 : "res/Track1_13.plist",
    Track1_14 : "res/Track1_14.plist",
    Track1_15 : "res/Track1_15.plist",

    Track1_21 : "res/Track1_21.plist",
    Track1_22 : "res/Track1_22.plist",
    Track1_23 : "res/Track1_23.plist",
    Track1_24 : "res/Track1_24.plist",
    Track1_25 : "res/Track1_25.plist",

    Track2_1 : "res/Track2_1.plist",
    Track2_2 : "res/Track2_2.plist",
    Track2_3 : "res/Track2_3.plist",
    Track2_4 : "res/Track2_4.plist",
    Track2_5 : "res/Track2_5.plist",
    Track2_6 : "res/Track2_6.plist",
    Track2_7 : "res/Track2_7.plist",
    Track2_8 : "res/Track2_8.plist",
    Track2_9 : "res/Track2_9.plist",
    Track2_10 : "res/Track2_10.plist",
    Track2_11 : "res/Track2_11.plist",
    Track2_12 : "res/Track2_12.plist",
    Track2_13 : "res/Track2_13.plist",
    Track2_14 : "res/Track2_14.plist",
    Track2_15 : "res/Track2_15.plist",

    Track2_21 : "res/Track2_21.plist",
    Track2_22 : "res/Track2_22.plist",
    Track2_23 : "res/Track2_23.plist",
    Track2_24 : "res/Track2_24.plist",
    Track2_25 : "res/Track2_25.plist",

    FishPng : "res/fish.png",
    CroakerSprite : "res/croaker.sprite",
    ChelonianSprite : "res/chelonian.sprite",
    LanternSprite : "res/lantern.sprite",
    AngelfishSprite : "res/angelfish.sprite",

    ProgySprite : "res/progy.sprite",
    AmphiprionSprite : "res/amphiprion.sprite",
    PufferSprite : "res/puffer.sprite",
    RaySprite : "res/ray.sprite",
    BreamSprite : "res/bream.sprite",
    SmallFishActorSprite : "res/smallfishactor.sprite",

    SharkPng: "res/shayu.png",
    SharkSprite : "res/shark.sprite",

    MarlinPng : "res/marlins.png",
    MarlinSprite : "res/marlins.sprite",

    GrouperPng : "res/grouper.png",
    GrouperSprite : "res/grouper.sprite",

    GSharkPng : "res/gshayu.png",
    GSharkSprite : "res/gshayu.sprite",

    GMarlinPng : "res/gmarlins.png",
    GMarlinSprite : "res/gmarlins.sprite",

    ButterflyPng : "res/butterfly.png",
    ButterflySprite : "res/butterfly.sprite",
    PomfretSprite : "res/pomfret.sprite",

    GoldenTroutPng : "res/goldentrout.png",
    GoldenTroutSprite: "res/goldentrout.sprite",

    StarfishPNG : "res/ghaixing.png",
    StarfishSprite : "res/ghaixing.sprite",

    CannonPlist : "res/cannon.plist",
    CannonPng : "res/cannon.png",

    BulletSprite : "res/bullet.sprite",
    SmallItemPng : "res/SmallItem.png",

    JindunPlist : "res/jindun.plist",
    JindunPng : "res/jindun.png",

    SuperWeaponButtonPList : "res/SuperWeaponButton.plist",
    SuperWeaponButtonPNG : "res/SuperWeaponButton.png",

    HelpUIPlist : "res/help_ui.plist",
    HelpUIPng : "res/help_ui.png",

    LaserFonts : "res/fonts_laser_num.png",

    ParticlePlist : "res/particle.plist",

    lizibianhua1Plist : "res/lizibianhua1.plist",
    lizibianhua1Png : "res/lizibianhua1.png",
    lizibianhua2Plist : "res/lizibianhua2.plist",
    lizibianhua3Plist : "res/lizibianhua3.plist",
    lizibianhua3Png : "res/lizibianhua3.png",

    yuwangliziPlist : "res/yuwanglizi.plist",
    ChestOpeningParticlePlist : "res/kaibaoxiang01.plist",


    // MainUITitle : "res/main_ui_title.png",

    //New
    GameUIPng : "res/New/Game UI.png",
    GameUIPlist : "res/New/Game UI.plist",
    LobbyUIPlist : "res/New/Lobby/Lobby.plist",
    LobbyUIPng : "res/New/Lobby/Lobby.png",
    SettingsUIPlist : "res/New/Options/settings.plist",
    SettingsUIPng : "res/New/Options/settings.png",
    ScoreboardPlist : "res/New/Scoreboard/summary.plist",
    ScoreboardPng : "res/New/Scoreboard/summary.png",
    SideMenuPlist : "res/New/Options/Options Menu.plist",
    SideMenuPng : "res/New/Options/Options Menu.png",
    LoginUIPlist : "res/New/Lobby/Login.plist",
    LoginUIPng : "res/New/Lobby/Login.png",

    //GameBackgrounds
    GameBackground1 : "res/New/Game BG/Game BG 1.png",

    //Fish
    StingrayPNG : "res/New/Fish/Ray.png",
    StingrayPlist : "res/New/Fish/Ray.plist",
    PorgyPlist : "res/New/Fish/NFish.plist",
    PorgyPNG : "res/New/Fish/NFish.png",
    PufferfishPlist : "res/New/Fish/Puffer.plist",
    PufferfishPNG : "res/New/Fish/Puffer.png",

    //testing
    SquidPNG : "res/New/testing/Squid.png",
    SquidPlist : "res/New/testing/Squid.plist",
    TurtlePlist : "res/New/testing/Chelonian.plist",
    TurtlePNG : "res/New/testing/Chelonian.png",
    BulletPNG: "res/New/testing/bullet.png",
    LanternPlist : "res/New/testing/Lantern.plist",
    LanternPng : "res/New/testing/Lantern.png",


    //debug
    DebugCircle : "res/New/testing/circle.png",

};

var g_resources = [
    "res/lang-en/main_ui_title_en.png",
    "res/lang-cn/main_ui_title_cn.png",
    "res/qipao3.png",
    "res/qipao3.plist",
    "res/qipao4.plist",

];

for (var i in res) {
    g_resources.push(res[i]);
}
