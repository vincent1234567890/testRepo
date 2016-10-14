var kNotifyPlayerTitleChanged = "PlayerTitleHaveBeenChanged";

var NSNotificationLevelUp = "NSNotificationLevelUp";
var NSNotificationWeaponChaged = "NSNotificationWeaponChaged";
var NSNotificationNewTitle = "NSNotificationNewTitle";
var NSNotificationPurchaseStage = "NSNotificationPurchaseStage";

var NSNotificationPurchaseStageFail = "NSNotificationPurchaseStageFail";

var NumberOfPlayerTitles = 11;
var MAX_JACKPOT_EXPERIENCE = 490000;

var CommodityNUM = 5;

var recoverMoneyPerSecones = 900;

// 玩家等级每上升4级，在线时，金币增加间隔减少3秒
var kCoinIncreaseOnLineDtInterval = 3;
var kCoinIncreaseOnLineDtLevel = 4;

// 玩家等级每上升4级，离线时，金币增加间隔减少30秒
var kCoinIncreaseOffLineDtInterval = 30;
var kCoinIncreaseOffLineDtLevel = 4;

var AchievementIndex = {
    eAchievement01:0,
    eAchievement02:1,
    eAchievement03:2,
    eAchievement04:3,
    eAchievement05:4,
    eAchievement06:5,
    eAchievement07:6,
    eAchievement08:7,
    eAchievement09:8,
    eAchievement10:9,
    eAchievement11:10,
    eAchievement12:11,
    eAchievement13:12,
    eAchievement14:13,
    eAchievement15:14,
    eAchievement16:15,
    eAchievement17:16,
    eAchievement18:17,
    eAchievement19:18,
    eAchievement20:19,
    eAchievement21:20,
    eAchievement22:21,
    eAchievement23:22,
    eAchievement24:23,
    eAchievement25:24,
    eAchievement26:25,
    eAchievement27:26,
    eAchievement28:27,
    eAchievement29:28,
    eAchievement30:29,
    eAchievement31:30,
    eAchievement32:31,
    eAchievement33:32,
    eAchievement34:33,
    eAchievement35:34,
    eAchievement36:35,
    eAchievement37:36,
    eAchievement38:37,
    eAchievement39:38,
    eAchievement40:39,
    eAchievement41:40,
    eAchievement42:41,
    eAchievement43:42,
    eAchievement44:43,
    eAchievement45:44,
    eAchievement46:45,
    eAchievement47:46,
    kAchieveMentCount:47
};

var PlayerActorComparisonAscending = -1;
var PlayerActorComparisonSame = -2;
var PlayerActorComparisonDescending = -3;

var money = [
    0,
    400,
    1400,
    3200,
    6000,
    10000,
    15400,
    22400,
    31200,
    42000,
    55000,
    70400,
    88400,
    109200,
    133000,
    180800,
    254100,
    354400,
    483200,
    642000,
    832300,
    1055600,
    1313400,
    1607200,
    1938500,
    2308800,
    2719600,
    3172400,
    3668700,
    4210000,
    4844300,
    5574600,
    6403900,
    7335200,
    8371500,
    9515800,
    10771100,
    12140400,
    13626700,
    15233000,
    16962300,
    18817600,
    20801900,
    22918200,
    25169500,
    27880800,
    31062100,
    34723400,
    38874700,
    43526000
];

var mapOfTitlesForTimePlayed =
{ "ui_text_30.png":0,
    "ui_text_31.png":6000,
    "ui_text_32.png":19500,
    "ui_text_33.png":40500,
    "ui_text_34.png":69000,
    "ui_text_35.png":105000,
    "ui_text_36.png":148500,
    "ui_text_37.png":199500,
    "ui_text_38.png":285000,
    "ui_text_39.png":324000,
    "ui_text_40.png":382320};

var getIntFromArray = function (arr, index) {
    var temp = arr[index];

    if (!temp) {
        return 0;
    }

    return parseInt(temp);
};

var replaceObjectAtIndex = function (arr, index, value) {
    var tmp = value.toString();
    arr.splice(index, 1);
    arr.splice(index, 0, tmp);
};

var PlayerActor = cc.Class.extend({
    _curPlayTime:0,
    _saveInfoTime:0,
    _winCount:0,
    _loseCount:0,
    _addCoinCount:0,
    _addCoinNeedTime:0,
    _catchedFishes:{},
    _curCatchedFishes:[],
    _shotBullets:[],
    _purchasedItemDict:[],
    _playerLevel:0,
    _dtNeed:0,
    _playerMoney:99999,
    _normalGain:0,
    _m_bOnTutorial:false,
    playerId:"",
    playerAsia:"",
    previousExp:0,
    nextExp:0,
    curWeaponLevel:FishWeaponType.eWeaponLevel5,
    playerFightScore:0,
    jackPotPrice:0,
    LaserMoney:0,
    AllCount:0,
    totalConsume:0,
    totalGain:0,
    curTotalConsume:0,
    curConsume:0,
    curReturn:0,
    curStageGain:0,
    experienceCount:0,
    curExperienceConsume:0,
    totalPlayTime:0,
    lastLogin:0,
    lastLogout:0,
    startTime:0,
    endTime:0,
    achievementArray:0,
    localAchievementArray:0,
    gameCount:0,
    titleCount:0,
    _addCoinTime:0,
    scene:0,
    needAddCoin:false,
    autosave:false,
    _actorType:ActorType.eActorTypeNormal,
    comboCount:0,
    catchSharkWithRay:false,
    stageArray:0,
    preMoney:0,
    isGetSpringFestival:false,
    currentTitle:"",
    init:function () {
        this.autosave = true;

        this._catchedFishes = {};
        this._purchasedItemDict = [];
        this._shotBullets = [];
        for (var i = 1; i <= 10; ++i) {
            while (i == 8) {
                i = 10;
            }
            this._shotBullets[i] = "0";
        }

        this._curCatchedFishes = [];
        this.achievementArray = [];
        this.localAchievementArray = [];
        this.stageArray = [];

        this.reset();
        this.setCurrentTitle("");
        return true;
    },
    subAch:function () {
        cc.Director.getInstance().getScheduler().scheduleSelector(this.submitLocalAchievement, this, 1.0, false);
    },
    loadStates:function () {
        this.loadStateFromCoredata();
        this.loadPlayLevel();
    },
    loadStateFromCoredata:function () {
        var entity = PlayerEntity_Wrapper.getInstance();
        this.setPlayerAsia(entity.getName());
        this.setCatchedFishes(entity.getCatchInfo());

        var tempArr = entity.getStageArrayData();
        if (tempArr) {
            this.setStageArray(tempArr);
        }

        var array = entity.getAchievementData();
        if (!array) {
            array = [];
        }
        if (array.length < AchievementIndex.kAchieveMentCount) {
            var muarray = [];
            muarray.concat(array);
            for (var i = 0; i < 23; i++) {
                var pStr = new String("0");
                muarray.push(pStr);
            }
            this.setAchievementArray(muarray);
            this.setLocalAchievementArray(muarray);
        }
        else {
            this.setAchievementArray(array);
            this.setLocalAchievementArray(array);
        }

        this.setTotalConsume(entity.getTotalConsume());
        this.setTotalGain(entity.getTotalGain());

        this.setNormalGain(entity.getNormalGain());

        this.setTotalPlayTime(entity.getTotalGameTime());

        /* var sign = "" + entity.getPlayerMoney();

         var signnum = PlayerActor.sign(sign);
         var signnum1 = entity.getSignnum();

         if (signnum == signnum1) {
         this.setPlayerMoney(entity.getPlayerMoney());
         }
         else {
         this.setPlayerMoney(GameSetting.getInstance().getPlayerMoney());
         }  */


        var tempUnit = new signUnit(entity.getPlayerMoney(), entity.getSignnum(), signIndex);
        signPool.push(tempUnit);
        (signIndex > 100) ? (signIndex = 0) : signIndex++;
        // init player money
        initPlayerMoney(tempUnit.index, entity.getPlayerMoney());
        //cc.log(signnum);

        this.setLastLogin(entity.getLastLogin());
        this.setLastLogout(entity.getLastLogout());
        this.setGameCount(entity.getGameCount());
    },
    saveStateToCoredate:function () {
        if (!this.autosave) {
            return;
        }

        this.savePlayerEntiy();
        this.savePlayRecord();
    },
    savePlayRecord:function () {
        return true;
    },
    savePlayerEntiy:function () {
        var entity = PlayerEntity_Wrapper.getInstance();

        entity.setTotalConsume(this.totalConsume);
        entity.setTotalGameTime(this.totalPlayTime);
        entity.setTotalGain(this.totalGain);
        entity.setNormalGain(this.getNormalGain());

        /*var cSign = "" + this._playerMoney;
         var signnum = PlayerActor.sign(cSign);

         entity.setSignnum(signnum);
         entity.setPlayerMoney(this.getPlayerMoney()); */

        // var tempUnit = new signUnit(this._playerMoney, entity.getSignnum(), signIndex);
        var tempUnit = new signUnit(99999, entity.getSignnum(), signIndex);
        signPool.push(tempUnit);
        (signIndex > 100) ? (signIndex = 0) : signIndex++;
        // update player money
        //updatePlayerMoney(tempUnit.index, this._playerMoney);
        updatePlayerMoney(tempUnit.index, 99999);
        //cc.log(signnum);

        entity.setLastLogin(this.lastLogin);
        entity.setLastLogout((new Date).getTime());

        entity.setCatchInfo(this._catchedFishes);
        entity.setAchievementData(this.localAchievementArray);
        entity.setStageArrayData(this.stageArray);
        entity.setGameCount(this.gameCount);

        entity.saveToLocalStorage();

        return true;
    },
    canSendWeapon:function (oddsNumber) {
        if (this.getCurWeaponLevel() >= FishWeaponType.eWeaponLevel8 && this.getCurWeaponLevel() != FishWeaponType.eWeaponLevel10) {
            return true;
        }

        if (this.getPlayerMoney() >= this.getCurWeaponLevel() * GameCtrl.sharedGame().getCurScene().getOddsNumber()) {
            return true;
        }
        return false;
    },
    changeWeapon:function () {
        // 获取当前地图等级
        var _curstage = GameCtrl.sharedGame().getCurScene();

        var curWeaon = this._curWeaponLevel;
        if (++curWeaon > FishWeaponType.eWeaponLevel7) {
            // 加勒比地图 1-7 + 10武器切换
            if (_curstage >= 3 && curWeaon < 11) {
                curWeaon = FishWeaponType.eWeaponLevel10;
            }
            else
                curWeaon = FishWeaponType.eWeaponLevel1;
        }

        this._curWeaponLevel = curWeaon;

    },
    shootFinished:function (money) {
        this.totalConsume += money;
        this.curTotalConsume += money;

        var number = this._shotBullets[money];

        var value = parseInt(number);
        value++;
        this._shotBullets[money] = value.toString();

        var scene = GameCtrl.sharedGame().getCurScene();
        var moneytemp = money * scene.getOddsNumber();

        this._playerMoney = this._playerMoney - moneytemp;
        //todo
        /*if (ActorType.eActorTypeNormal == this.getActorType()) {
         ApparkDataManagerWrapper.addCoinsEarned(moneytemp);
         }*/

        this._addCurExperienceConsume(money);

        if (this._playerMoney <= 0) {   //发送提示消息
            this._playerMoney = 0;
        }
    },
    parameterB:function () {
        var money = this._playerMoney;
        return (100 * (money + this.curStageGain) / (money + this._curPlayTime));
    },
    loadPlayLevel:function () {
        var max = money.length;

        for (var idx = 0; idx < max; idx++) {
            if (this.totalGain >= money[idx]) {
                this._playerLevel = idx + 1;
            }
            else {
                break;
            }
        }

        this._addCoinNeedTime = GameSetting.getInstance().getAddCoinNeedTime();
    },
    reset:function () {
        this.totalConsume = 0;
        this.totalGain = 0;
        this.setNormalGain(0);
        this.curConsume = 0;
        this._curPlayTime = 0;
        this.curStageGain = 0;
        this._saveInfoTime = 0.0;
        this.curReturn = 0;
        this.experienceCount = Math.random() * 30 + 1;
        this.needAddCoin = false;
        this.gameCount = 0;
        this._curWeaponLevel = FishWeaponType.eWeaponLevel1;
        this.playerFightScore = 0;
        //this._shotBullets = [];
        this._curCatchedFishes = [];
        this._addCoinCount = 0;
        this._actorType = ActorType.eActorTypeNormal;

        var now = (new Date()).getTime();
        this.setStartTime(now);
        this.setEndTime(now);
        this.totalPlayTime = 0.0;
        this._dtNeed = 0.0;

        this.setLocalAchievementArray([]);
        this.setAchievementArray([]);
        for (var i = 0; i < AchievementIndex.kAchieveMentCount; i++) {
            var pStr1 = new String(0);
            this.localAchievementArray.push(pStr1);

            var pStr2 = new String(0);
            this.achievementArray.push(pStr2);
        }

        this.setStageArray([]);
        for (var i = 0; i < 3; i++) {
            var pStr = null;
            if (0 == i) {
                pStr = new String("1");
            }
            else {
                pStr = new String("0");
            }
            this.stageArray.push(pStr);
        }
    },
    canLevelUp:function () {
        if (this.totalGain >= money[this._playerLevel]) {
            return true;
        }
        return false;
    },
    addPlayTime:function (time) {
    },
    addConsume:function (consume) {
    },
    shoot:function () {
    },
    changeWeaponReverse:function () {
        // 获取当前地图等级
        var _curstage = GameCtrl.sharedGame().getCurScene();

        var curWeaon = this._curWeaponLevel;
        if (--curWeaon < FishWeaponType.eWeaponLevel1) {
            // 加勒比地图 1-7 + 10武器切换
            if (_curstage >= 3) {
                curWeaon = FishWeaponType.eWeaponLevel10;
            }
            else
                curWeaon = FishWeaponType.eWeaponLevel7;
        }

        if (curWeaon == 9) {
            curWeaon = FishWeaponType.eWeaponLevel7;
        }
        this._curWeaponLevel = curWeaon;
    },
    catchFish:function (fish, Flag) {
        if (this.autosave) {
            var strKey = fish;

            // update total catch fish number
            var num = this._catchedFishes[strKey];
            if (num) {
                this._catchedFishes[strKey] = num + 1;
            }
            else {
                this._catchedFishes[strKey] = 1;
            }

            num = this._curCatchedFishes[strKey];
            if (num) {
                this._curCatchedFishes[strKey] = num + 1;
            }
            else {
                this._curCatchedFishes[strKey] = 1;
            }
            /*if (Flag) {
             ApparkDataManagerWrapper.fishCatched(fish, Flag);
             }*/
        }
    },
    fishByLevel:function (lv) {
        switch (lv) {
            case FishLevel.eFishLevel1:
                return "";
            default:
                return null;
        }
    },
    totalCatchedFish:function () {
        var count = 0;
        for (var i = 0; i <= this._catchedFishes.length; i++) {
            var num = this._catchedFishes[i];
            count += parseInt(num);
        }
        return count;
    },
    totalcurCatchedFish:function () {
        var count = 0;
        for (var i = 0; i <= this._curCatchedFishes.length; i++) {
            var num = this._curCatchedFishes[i];
            count += parseInt(num);
        }

        return count;
    },
    update:function (dt) {
        if (!this.autosave) {
            return;
        }

        this._curPlayTime += dt;
        this.totalPlayTime += dt;

        this._saveInfoTime += dt;
        if (this._saveInfoTime >= 6.0) {
            if (this.autosave) {
                this.savePlayerEntiy();
            }
            this._saveInfoTime = 0;
        }
        if (!(this.getScene()).getIsPause()) {
            this._addCoinTime += dt;
        }
        if (this._addCoinTime >= this._addCoinNeedTime) {
            this._addCoinTime = 0.0;

            if (this._playerMoney < GameSetting.getInstance().getPlayerMoney()) {
                this._playerMoney = this._playerMoney + GameSetting.getInstance().getAddCoinCount();
                this.needAddCoin = true;
            }
        }

        if (this.getScene().getOddsNumber() == 1) {
            return;
        }
        if ((this.preMoney - this.getPlayerMoney() ) >= 200) {
            //应该添加小宝箱
            // ((GameScene*) (getScene())).addMinChest();
            this.preMoney = this.getPlayerMoney();
        }
    },
    submitAchievement:function (dt) {

    },
    submitLocalAchievement:function (dt) {

    },
    //获得当前游戏进行的小时数
    getCurrentHour:function () {
        return this.totalPlayTime / 3600;
    },
    //获得当前游戏进行的天数
    getCurrentDay:function () {
        return this.getCurrentHour() / 24;
    },
    _updateTime:function (dt) {
        this._curPlayTime += dt;
        this.totalPlayTime += dt;
        if (!(this.getScene()).getIsPause()) {
            this._addCoinTime += dt;
        }
    },
    //玩家头衔
    title:function () {
        var title = null;

        this.titleCount = 0;
        for (var key in mapOfTitlesForTimePlayed) {
            if (this.totalPlayTime >= mapOfTitlesForTimePlayed[key]) {
                title = key;
                this.titleCount++;
            }
            else {
                break;
            }
        }

        if (!this.autosave) {
            return title;
        }

        for (var i = this.titleCount; i >= 0; i--) {
            var strValue = this.getLocalAchievementArray()[34 + i];
            if (strValue && parseInt(strValue) == 0) {
                if (i == this.titleCount && null != this.getScene()) {
                    var startIndex = AchievementIndex.eAchievement01;
                    this.getScene().playGetAchievement(startIndex + 33 + i);
                }
                replaceObjectAtIndex(this.localAchievementArray, 34 + i, 1);
            }
        }

        return title;
    },
    titleIdx:function () {
        var titleIdx = 0;

        for (var idx = 0; idx < NumberOfPlayerTitles; idx++) {
            if (this.totalPlayTime >= mapOfTitlesForTimePlayed[idx]._time) {
                titleIdx = (idx + 1);
            }
            else {
                break;
            }
        }

        return titleIdx;
    },
    playerLogin:function () {
        var now = (new Date()).getTime();
        var interval = (now - this.lastLogout)/1000;

        if (interval < 0)
            return;

        var addCoinInterval = GameSetting.getInstance().getAddCoinNeedTimeOffline();
        addCoinInterval = addCoinInterval - kCoinIncreaseOffLineDtInterval * ((this._playerLevel - 1) / kCoinIncreaseOffLineDtLevel);

        var n = 0 | (interval / addCoinInterval);
        if (this._playerMoney < GameSetting.getInstance().getPlayerMoney()) {
            this._playerMoney = this._playerMoney + GameSetting.getInstance().getAddCoinCount() /* * n*/;
            if (this._playerMoney > GameSetting.getInstance().getPlayerMoney()) {
                this._playerMoney = GameSetting.getInstance().getPlayerMoney();
            }
        }

        this.preMoney = this.getPlayerMoney();
        this.setLastLogin(now);
        this.submitAchievement(0);
        this.saveStateToCoredate();
    },
    playerLogout:function () {
        /*var time = (new Date()).getTime();
        if (time> this.lastLogout) {
            this.setLastLogout(time);

            //var strPlayerMoney = this.getPlayerMoney();

            *//*FlurryAPI.LogEventParametersType parameters;
             parameters.insert(FlurryAPI.LogEventParametersPair("this.playerMoney", strPlayerMoney));
             FlurryAPI.logEvent("this.playerMoney", parameters);*//*
        }*/

        /*if (GameCenterManager.isGameCenterAvailable()) {
         this.reportHighScore();
         this.submitAchievement(0.0);
         }*/

        //this.saveStateToCoredate();
        //KingFisher cc.log("in logout the date is "+ this.getLastLogout().toString());

        wrapper.logEvent("Player","Logout", "Money", this._playerMoney);
    },

    GetBOnTutorial:function () {
        return this._m_bOnTutorial;
    },
    SetBOnTutorial:function (bOnTutorial) {
        this._m_bOnTutorial = bOnTutorial;
    },

    getCatchCount:function () {
        var count = 0;
        for (var i = 0; i < this._catchedFishes.length; i++) {
            var strCount = this._catchedFishes[i];
            count += parseInt(strCount);
        }
        return count;
    },
    getCatchCountByFish:function (fishName) {
        var strCount = this._catchedFishes[fishName];

        if (null == strCount) {
            return 0;
        }

        return parseInt(strCount);
    },

    getCurStageCatchCount:function () {
        var count = 0;
        for (var i = 0; i < this._curCatchedFishes.length; i++) {
            var strCount = this._curCatchedFishes[i];
            count += parseInt(strCount);
        }

        return count;
    },
    getCurStageCatchCountByFish:function (fishName) {
        var strCount = this._catchedFishes[fishName];
        if (null == strCount) {
            return 0;
        }

        return parseInt(strCount);
    },

    reportHighScore:function () {
        //game center
    },

    compare:function (other) {
        if (this.totalGain > other.getTotalGain()) {
            return PlayerActorComparisonDescending;
        }
        else if (this.totalGain < other.getTotalGain()) {
            return PlayerActorComparisonAscending;
        }
        else {
            //若两名玩家分数相同则剩余原始金币（500金币为原始金币）多者胜
            if (this._playerMoney > other.getPlayerMoney()) {
                return PlayerActorComparisonDescending;
            }
            else if (this._playerMoney < other.getPlayerMoney()) {
                return PlayerActorComparisonAscending;
            }
            else {
                //若两名玩家分数相同剩余原始金币相同，则捕捉个数多者胜
                if (this.totalcurCatchedFish() > other.totalcurCatchedFish()) {
                    return PlayerActorComparisonDescending;
                }
                else if (this.totalcurCatchedFish() < other.totalcurCatchedFish()) {
                    return PlayerActorComparisonAscending;
                }
                else {
                    //若两名玩家分数、剩余金币、捕鱼个数均相同，则捕大鱼多者胜
                    var result = this.compareBigFishs(other);
                    if (result != PlayerActorComparisonSame)
                        return result;
                }
            }
        }

        if (this._playerMoney == 500 && other.getPlayerMoney() == 500) {
            return PlayerActorComparisonSame;
        }

        if (this.totalGain == 0 && other.getTotalGain() == 0) {
            return PlayerActorComparisonSame;
        }

        return PlayerActorComparisonSame;
    },
    compareFish:function (fishKey, other) {
        var num0 = this._curCatchedFishes[fishKey];
        var num1 = other.getCurCatchedFishes()[fishKey];
        var count0 = 0;
        var count1 = 0;

        if (num0 != null) {
            count0 = parseInt(num0);
        }

        if (num1 != null) {
            count1 = parseInt(num1);
        }

        if (count0 > count1) {
            return PlayerActorComparisonDescending;
        }
        else if (count0 < count1) {
            return PlayerActorComparisonAscending;
        }
        else {
            return PlayerActorComparisonSame;
        }
    },
    compareBigFishs:function (other) {
        var result = this.compareFish("SharkActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("LanternActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("PorgyActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("AmphiprionActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("PufferActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("CroakerActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("RayActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("ChelonianActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("BreamActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("AngleFishActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("SmallFishActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("ButterflyActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("PomfretActor", other);
        if (result != PlayerActorComparisonSame) return result;

        result = this.compareFish("GoldenTroutActor", other);
        return result;
    },

    addMoney:function (money) {
        this.setPlayerMoney(this._playerMoney + money);
    },
    updateCatchMoney:function (moneyCount, isFightMode, isUpdateRayPower, isUpdatePotExp) {
        if (!isFightMode) {
            this.curStageGain += moneyCount;
        }
        this.curReturn += moneyCount;
        if (isUpdateRayPower) {
            this._normalGain = this._normalGain + moneyCount; // 激光蓄力槽增长
            this.totalGain += moneyCount;
        }
        if (isUpdatePotExp) {
            var expCount = PlayerEntity_Wrapper.getInstance().getJackPotExp();
            var oldExpCount = expCount;

            expCount += moneyCount;

            if (expCount > MAX_JACKPOT_EXPERIENCE) {
                expCount = MAX_JACKPOT_EXPERIENCE;
            }

            PlayerEntity_Wrapper.getInstance().setJackPotExp(expCount);
        }
    },
    cleanStageGain:function () {
        this.curStageGain = 0;
    },
    updateTutorialCatchMoney:function (moneyCount) {
        this.totalGain += moneyCount;
    },
    updateNormalGain:function (newNormalGainValue) {
        this.setNormalGain(newNormalGainValue);
    },
    cleanCurReturn:function () {
        this.curReturn = 0;
    },
    getAddCoinNeedTime:function () {
        return this._addCoinNeedTime;
    },
    _addCurExperienceConsume:function (money) {
        this.curExperienceConsume += money;
        if (this.curExperienceConsume > GameSetting.getInstance().getExperienceMoney()) {
            if (this.curExperienceConsume > 200) {
                var nExpCount = this.experienceCount + 1;
                this.setExperienceCount(nExpCount);
                this.curExperienceConsume = 0;

                var stage = this.getScene().getOddsNumber();
                GameSetting.getInstance().computeExperienceRatio(this.experienceCount, stage);
            }
        }
    },

    // getter / setter
    setCatchedFishes:function (v) {
        if (this._catchedFishes != v && v != null) {
            this._catchedFishes = v;
        }
    },
    getCatchedFishes:function () {
        return this._catchedFishes;
    },


    setCurCatchedFishes:function (v) {
        if (v != this._curCatchedFishes) {
            this._curCatchedFishes = v;
        }
    },
    getCurCatchedFishes:function () {
        return this._curCatchedFishes;
    },

    setShotBullets:function (v) {
        if (v != this._shotBullets) {
            this._shotBullets = v;
        }
    },
    getShotBullets:function () {
        return this._shotBullets;
    },

    setPurchasedItemDict:function (v) {
        if (v != this._purchasedItemDict) {
            this._purchasedItemDict = v;
        }
    },
    getPurchasedItemDict:function () {
        return this._purchasedItemDict;
    },

    setPlayerLevel:function (v) {
        if (v != this._playerLevel) {
            // 更新玩家等级
            this._playerLevel = v;

            // 更新 this.addCoinNeedTime 的值
            this._addCoinNeedTime = 0 | (GameSetting.getInstance().getAddCoinNeedTime() - kCoinIncreaseOnLineDtInterval * ((this._playerLevel + 1) / kCoinIncreaseOnLineDtLevel));
        }
    },
    getPlayerLevel:function () {
        return this._playerLevel;
    },
    getPlayerID:function () {
        return this.playerId;
    },
    setPlayerID:function (v) {
        this.playerId = v;
    },
    getPlayerAsia:function () {
        return this.playerAsia;
    },
    setPlayerAsia:function (v) {
        this.playerAsia = v;
    },
    getPreviousExp:function () {
        return money[this._playerLevel - 1];
    },
    getNextExp:function () {
        return money[this._playerLevel];
    },
    getCurWeaponLevel:function () {
        return this._curWeaponLevel;
    },
    setCurWeaponLevel:function (v) {
        this._curWeaponLevel = v;
    },
    getPlayerFightScore:function () {
        return this.playerFightScore;
    },
    setPlayerFightScore:function (v) {
        this.playerFightScore = v;
    },
    getJackPotPrice:function () {
        return this.jackPotPrice;
    },
    setJackPotPrice:function (v) {
        this.jackPotPrice = v;
    },
    getLaserMoney:function () {
        return this.LaserMoney;
    },
    setLaserMoney:function (v) {
        this.LaserMoney = v;
    },
    getAllCount:function () {
        return this.AllCount;
    },
    setAllCount:function (v) {
        this.AllCount = v;
    },
    getTotalConsume:function () {
        return this.totalConsume;
    },
    setTotalConsume:function (v) {
        this.totalConsume = v;
    },
    getTotalGain:function () {
        return this.totalGain;
    },
    setTotalGain:function (v) {
        this.totalGain = v;
    },
    getCurTotalConsume:function () {
        return this.curTotalConsume;
    },
    setCurTotalConsume:function (v) {
        this.curTotalConsume = v;
    },
    getCurConsume:function () {
        return this.curConsume;
    },
    setCurConsume:function (v) {
        this.curConsume = v;
    },
    getCurReturn:function () {
        return this.curReturn;
    },
    setCurReturn:function (v) {
        this.curReturn = v;
    },
    getCurStageGain:function () {
        return this.curStageGain;
    },
    setCurStageGain:function (v) {
        this.curStageGain = v;
    },
    getExperienceCount:function () {
        return this.experienceCount;
    },
    setExperienceCount:function (value) {
        this.experienceCount = value;
        if (value > 30) {
            this.experienceCount = 1;
        }
    },
    getCurExperienceConsume:function () {
        return this.curExperienceConsume;
    },
    setCurExperienceConsume:function (v) {
        this.curExperienceConsume = v;
    },
    getTotalPlayTime:function () {
        return this.totalPlayTime;
    },
    setTotalPlayTime:function (v) {
        this.totalPlayTime = v;
    },
    getLastLogin:function () {
        return this.lastLogin;
    },
    setLastLogin:function (v) {
        if (v != this.lastLogin) {
            this.lastLogin = v;
        }
    },
    getLastLogout:function () {
        return this.lastLogout;
    },
    setLastLogout:function (v) {
        if (v != this.lastLogout) {
            this.lastLogout = v;
        }
    },
    getStartTime:function () {
        return this.startTime;
    },
    setStartTime:function (v) {
        if (v != this.startTime) {
            this.startTime = v;
        }
    },
    getEndTime:function () {
        return this.endTime;
    },
    setEndTime:function (v) {
        if (v != this.endTime) {
            this.endTime = v;
        }
    },
    getAchievementArray:function () {
        return this.localAchievementArray;
    },
    setAchievementArray:function (v) {
        if (v != this.achievementArray) {
            this.achievementArray = v;
        }
    },
    getLocalAchievementArray:function () {
        return this.localAchievementArray;
    },
    setLocalAchievementArray:function (v) {
        this.localAchievementArray = v;
    },
    getGameCount:function () {
        return this.gameCount;
    },
    setGameCount:function (v) {
        this.gameCount = v;
    },
    getTitleCount:function () {
        return this.titleCount;
    },
    setTitleCount:function (v) {
        this.titleCount = v;
    },
    getAddCoinTime:function () {
        return this._addCoinTime;
    },
    setAddCoinTime:function (v) {
        this._addCoinTime = v;
    },
    getScene:function () {
        return cc.Director.getInstance().getRunningScene();
    },
    setScene:function (scene) {
        this.scene = scene
    },
    getNeedAddCoin:function () {
        return this.needAddCoin;
    },
    setNeedAddCoin:function (v) {
        this.needAddCoin = v;
    },
    getAutoSave:function () {
        return this.autosave;
    },
    setAutoSave:function (v) {
        this.autosave = v;
    },
    getActorType:function () {
        return this._actorType;
    },
    setActorType:function (v) {
        this._actorType = v;
    },
    getComboCount:function () {
        return this.comboCount;
    },
    setComboCount:function (v) {
        this.comboCount = v;
    },
    getCatchSharkWithRay:function () {
        return this.catchSharkWithRay;
    },
    setCatchSharkWithRay:function (v) {
        this.catchSharkWithRay = v;
    },
    getStageArray:function () {
        return this.stageArray;
    },
    setStageArray:function (v) {
        if (v != this.stageArray) {
            this.stageArray = v;
        }
    },
    getPreMoney:function () {
        return this.preMoney;
    },
    setPreMoney:function (v) {
        this.preMoney = v;
    },
    getIsGetSpringFestival:function () {
        return this.isGetSpringFestival;
    },
    setIsGetSpringFestival:function (v) {
        this.isGetSpringFestival = v;
    },
    getCurrentTitle:function () {
        return this.currentTitle;
    },
    setCurrentTitle:function (title) {
        this.currentTitle = title;
    },
    getPlayerMoney:function () {
        return this._playerMoney;
    },
    setPlayerMoney:function (money) {
        this._playerMoney = money;
    },
    getNormalGain:function () {
        return this._normalGain;
    },
    setNormalGain:function (gain) {
        this._normalGain = gain;
    },
    addLaserNum:function (num) {
        var LaserNum = wrapper.getIntegerForKey(kLaserNum);
        wrapper.setIntegerForKey(kLaserNum, LaserNum + num);
        wrapper.setIntegerForKey(kLaserSign, PlayerActor.laserSign(""+(LaserNum + num)));
    }
});

PlayerActor.purgeSharedActor = function () {
    cc.Director.getInstance().getScheduler().unscheduleAllSelectorsForTarget(this._playerActor);
    cc.Director.getInstance().getScheduler().unscheduleAllSelectorsForTarget(this._playerActorTL);
    cc.Director.getInstance().getScheduler().unscheduleAllSelectorsForTarget(this._playerActorTR);
};

PlayerActor._playerActor = null;
PlayerActor._playerActorTL = null;
PlayerActor._playerActorTR = null;

PlayerActor.sharedActor = function () {
    if (!this._playerActor) {
        this._playerActor = new PlayerActor();
        this._playerActor.init();
        this._playerActor.subAch();
        this._playerActor.setActorType(ActorType.eActorTypeNormal);
    }

    return this._playerActor;
};

PlayerActor.sharedActorTL = function () {
    if (!this._playerActorTL) {
        this._playerActorTL = new PlayerActor();
        this._playerActorTL.init();
        this._playerActorTL.setActorType(ActorType.eActorTypeTL);
    }

    return this._playerActorTL;
};

PlayerActor.sharedActorTR = function () {
    if (!this._playerActorTR) {
        this._playerActorTR = new PlayerActor();
        this._playerActorTR.init();
        this._playerActorTR.setActorType(ActorType.eActorTypeTR);
    }

    return this._playerActorTR;
};

/*PlayerActor.sign = function (s) {
 if (s.length == 0) {
 return 1;
 }

 var code = 0;
 for (var idx = s.length - 1; idx >= 0; idx--) {
 var ch = s[idx];
 var v = ch.charCodeAt(0);
 code = (code << 6 & 268435455) + v + (v << 14);

 var k = code & 266338304;
 code = code ^ k >> 21;
 }
 return code;
 };  */

PlayerActor.laserSign = function (s) {
    if (s.length == 0) {
        return 1;
    }

    var code = 0;
    for (var idx = s.length - 1; idx >= 0; idx--) {
        var ch = s[idx];
        var v = ch.charCodeAt(0);
        code = (code << 6 & 224435445) + v + (v << 14);

        var k = code & 264334304;
        code = code ^ k >> 21;
    }
    return code;
};