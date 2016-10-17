var FishWeaponType = {
    eWeaponLevel1:1,
    eWeaponLevel2:2,
    eWeaponLevel3:3,
    eWeaponLevel4:4,
    eWeaponLevel5:5,
    eWeaponLevel6:6,
    eWeaponLevel7:7,
    eWeaponLevel8:8, //Ray
    eWeaponLevel9:9,
    eWeaponLevel10:10,
    eWeaponLevel11:11, //LevinStorm
    eWeaponLevel12:12,

    // new weapons ID must be add before eWeaponLevelUnknown
    eWeaponLevelUnknown:13
};

var ShellActorType = {
    eShellActorTypeWhite:1,
    eShellActorTypeGreen:2,
    eShellActorTypeBlueness:3,
    eShellActorTypeBlue:4,
    eShellActorTypeYellow:5,
    eShellAcotrTypeOrange:6,
    eShellActorTypePurple:7
};

var ItemState = {
    eItemStateNoPurchased:0,
    eItemStatePurchased:1,
    eItemStateUsed:2
};

var FishLevel = {
    eFishLevel1:0,
    eFishLevel2:1,
    eFishLevel3:2,
    eFishLevel4:3,
    eFishLevel5:4,
    eFishLevel6:5,
    eFishLevel7:6,
    eFishLevel8:7,
    eFishLevel9:8,
    eFishLevel10:9,
    eFishLevel11:10,
    eFishLevel12:11,
    eFishLevel13:12,
    eFishLevel14:13,
    eFishLevel15:14
};

var FishType = {
    smallFish:1,
    mediumFish:2,
    bigFish:3,
    balloonfish:4
};

//!对应方宁给出来 的队形图 
var MoveType = {
    eMoveByBeeline:0,
    eMoveByEllipse:1,
    eMoveByWheel:2,
    eMoveByCircles:3,
    eMoveByCircleWithCount:4
};

var AttackState = {
    eAttackStateNone:0,
    eAttackStateHited:1
};


var WeaponType = {
    eWeaponNormal:0,
    eWeaponRay:1
};


var RayLevel = {
    eRayLevel0:0,
    eRayLevel1:1,
    eRayLevel2:2,
    eRayLevel3:3
};

var FightType = {
    eFightTypeLocalTwo:0,
    eFightTypeLocalFour:1,
    eFightTypeNone:2
};

//loading界面类别 
var LoadingType = {
    LoadingTypeForLobby:0,
    LoadingTypeForGame:1
};

// 角色的群组关系 
var ActorType = {
    eActorTypeTL:1, //!左上方的用户, 双人对战时属于左边的用户
    eActorTypeTR:2, //!右上方的用户, 双人对战时属于右边的用户
    eActorTypeBL:3, //!左下方的用户,
    eActorTypeBR:4, //!右下方的用户,
    eActorTypeNormal:5 //!无对战模式时的用户
};

//!渔网产生的来源 

var FishNetSource = {
    eFishNetSourceBullet:0, //由子弹产生
    eFishNetSourcePrize:1 //由奖励的満天撒网产生
};


//!参与秒杀的鱼被攻击的状态     
var FishAttackedType = {
    eFishAttackedNormal:0, //鱼正常游戏状态
    eFishAttackedFirst:1, //鱼第一次被七级网击中
    eFishAttackedSecond:2, //鱼第二次被七级网击中
    eFishAttackedNone:3//鱼不再参与秒杀机制
};

//defined UseOldTmx
var IsLitVersion = 1;

var angleTo = function(value){
    return value * Math.PI / 180.0
};

var HeroActorZValue = 100;
var TankActorZValue = 40;
var BulletActorZValue = 100;
var AwardActorZValue = 80;
var ExploreActorZValue = 90;
var EnemyActorZValue = 90;
var CannonActorZValue = 80;

var GroupEnemyBullet = "GroupEnemyBullet";
var GroupHeroBullet = "GroupHeroBullet";
var GroupEnemyActor = "GroupEnemyActor";
var GroupExploreActor = "GroupExploreActor";
var GroupAwardActor = "GroupAwardActor";
var GroupEffectActor = "GroupEffectActor";
var GroupFishActor = "GroupFishActor";
var GroupFishNetActor = "GroupFishNetActor";
var GroupGoldPrizeActor = "GroupGoldPrizeActor";
var GroupBigGoldPrizeActor = "GroupBigGoldPrizeActor";
var GroupLotteryPrizeActor = "GroupLotteryPrizeActor";
var GroupJackPrizeActor = "GroupJackPrizeActor";
var GroupChestActor = "GroupChestActor";
var GroupMaxChestActor = "GroupMAXChestActor";
var kGroupLightActor = "GroupLightActor";
var GroupStarfishActor = "GroupStarfishActor";

var kNotificationLightOff = "NotificationLightOff";


var BoatItem = "BoatItem";
var SailItem = "SailItem";
var PaintItem = "PaintItem";
var EmblemItem = "EmblemItem";
var BoatItemPrice = "BoatItemPrice";
var SailItemPrice = "SailItemPrice";
var PaintItemPrice = "PaintItemPrice";
var EmblemItemPrice = "EmblemItemPrice";
var Boat1 = "Boat1";
var Boat2 = "Boat2";
var Boat3 = "Boat3";
var BoatArray = "BoatArray";

var BoatSprite = "BoatItemSprite";
var SailSprite = "SailItemSprite";
var PaintSprite = "PaintItemSprite";
var EmblemSprite = "EmblemItemSprite";

var VerticallyPadding = 5.0;
var HorizontallyPadding = 5.0;

var PrizeNet_Tag = 555;
var PrizeNetPar_Tag = 666;
var kLogeWaveTag = 222;

// IAP product ID
var kProductid100Coins = "com.punchbox.KingFisher.iap.100coins";
var kProductid135Coins = "com.punchbox.KingFisher.iap.135coins";
var kProductid200Coins = "com.punchbox.KingFisher.iap.200coins";
var kProductid500Coins = "com.punchbox.KingFisher.iap.500coins";
var kProductid800Coins = "com.punchbox.KingFisher.iap.800coins";
var kProductid2000Coins = "com.punchbox.KingFisher.iap.2000coins";
var kProductid5000Coins = "com.punchbox.KingFisher.iap.5000coins";
var kProductid10000Coins = "com.punchbox.KingFisher.iap.10000coins";
var kProductid20000Coins = "com.punchbox.KingFisher.iap.20000coins";
var kProductid30000Coins = "com.punchbox.KingFisher.iap.30000coins";
var kProductidHawaii = "com.punchbox.KingFisher.iap.hawaiinew";

var UserDefaultsKeyPreviousPlayedStage = "UserPreviousPlayedStage";

var eIAPTypeNone = 0;
var eIAPTypeCMGC = 1;
var eIAPTypeCMMM = 2;
var eIAPTypeKTouch = 3;
var eIAPTypeND91 = 4;
var eIAPTypeSonyEricsson = 5;
var eIAPTypeTencent = 6;
var eIAPTypeZhiYun = 7;
var eIAPTypeHuaWei = 8;
var eIAPTypeCT = 9;
var eIAPTypeAliPay = 10;