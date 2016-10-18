var g_Path = "Resource/";
var g_Version = "V1.0.5";

var ImageName = function (fileName) {
    return sino.resource.getName(fileName)
};

var ImageNameLang = function (fileName, isFrame) {
    return sino.resource.getNameWithLang(fileName, isFrame);
};
//把传人图片_1，返回图片_2

var UD_GET_PRIZE_FROM_DELETE_STAGE = "GetPirzeFromDeleteStage";
var USSPSprite;
var USE_BULLET_PARTICLE = 1;       // 是否使用子弹和鱼网的粒子效果，为了帧率
var PAGE_INDICATOR_INTERVAL = 28;	// 页面指示控件的点的间隔

var kGameAutorotationNone = 0;
var kGameAutorotationCCDirector = 1;
var kGameAutorotationUIViewController = 2;

var kADDSTARTIME = 260;

var CHANGETONOMALCOMPLETE_NOTIFY = "changeToNormalComplete";
var SENDRAYCOMPLETE_NOTIFY = "s endraycomplete";

var CHINA_FILENAME_SUFFIX = "_cn";
var ENGLISH_FILENAME_SUFFIX = "";

var DEFAULT_PIXEL_FORMAT = cc.TEXTURE_2D_PIXEL_FORMAT_RGBA8888;

var GroupBoss;
var GroupEvent;
var BluePlane;
var RedPlane;
var YellowPlane;

var Level_TMX_Part = 2;
var MaxLevel = 8;

var TextWidth = 20;
var TextHeight = 36;

var PrizeNum_TextWidth = 48;
var PrizeNum_TextHeight = 48;

var TextHeight1 = 21;
var TextWidth1 = 14;

var TextWidth2 = 20;
var TextHeight2 = 30;

var VisibleRect;
var screenHeight;
var screenWidth;
var Multiple = 1;

var kUiItemScale = 1;
var EScreenRect;
var LEVINBULLETALIVERECT;

//music&effect
var TURNPLATE_RUN = "turnRun";
var TURNPLATE_WIN = "turnSucceed";
var TURNPLATE_LOSE = "turnFailed";

var LASER_EFFECT = "bgm_laser";
var CHANGECANNON_EFFECT = "bgm_change_cannon";
var CAMERA_EFFECT = "bgm_camera";
var BOX_EFFECT = "bgm_box";

var LEVINSTORM_EFFECT = "LevinStorm_explode_sound";
var ACH_EFFECT = "bgm_ach";
var COUNTDOWN_EFFECT = "3secondscountdown";
var GO_EFFECT = "bgm_go";
var SO_EFFECT = "bgm_so";
var UI_EFFECT_03 = "effect_ui_03";
var SURF_EFFECT = "bgm_surf";

var kBGM_RUNOUTBULLET = "bgm_rayover";
var COIN_EFFECT1 = "bgm_coin_01";
var COIN_EFFECT2 = "bgm_coin_02";
var COIN_EFFECT3 = "bgm_coin_03";
var FIRE_EFFECT = "bgm_fire";
var NET_EFFECT = "bgm_net";
var BUTTON_EFFECT = "bgm_button";

//ussdfasdfasdfa
var BACK_MUSIC1 = res.music_1;
var BACK_MUSIC2 = res.music_6;
var BACK_MUSIC3 = res.music_3;
var BACK_MUSIC4 = res.music_4;
var BACK_MUSIC5 = res.music_1;// originally music 1 too

////// #pragma mark GameUI
var ui_box_MenuBox = ImageNameLang("ui_box_05.png");
var ui_button_BGM_001 = "ui_button_09.png";
var ui_button_BGM_002 = "ui_button_10.png";
var ui_button_music_001 = "ui_button_11.png";
var ui_button_music_002 = "ui_button_12.png";
//
var COLLECT_UI = false; //是否显示收集页面
var COLLECT_SHOW = false; //是否显示购买道具界面
var COLLECT_GIFT = false; //是否给用户奖励
// Define here the type of autorotation that you want for your game
//
var GAME_AUTOROTATION = 2;

var ENEMYGROUP = "GroupEnemyBullet";
var HEROGROUP = "GroupHeroBullet";

var USEExplore;

var PlationURL = "http://www.punchbox.org/show/plateform";

TAG_BATCH_NODE_FISH = 30000;
TAG_BATCH_NODE_GOLDITEM = 30001;
TAG_BATCH_NODE_SHAYU = 30002;
TAG_BATCH_NODE_SMALLITEM = 30003;
TAG_BATCH_NODE_GSHAYU = 30004;
TAG_BATCH_NODE_GMARLINS = 30005;
TAG_BATCH_NODE_MARLINS = 30006;
TAG_BATCH_NODE_GGROUP = 30007;
TAG_BATCH_NODE_GROUP = 30008;
TAG_BATCH_NODE_CHEST = 30009;
TAG_BATCH_NODE_HAIXING = 30010;