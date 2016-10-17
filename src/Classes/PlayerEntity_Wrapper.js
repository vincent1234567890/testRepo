var KEY_PLAYER_ENTITY = "PlayerEntity";

var GAME_COUNT = "gameCount";
var LAST_LOGIN = "lastLogin";
var TOTAL_CONSUME = "totalConsume";
var CATCH_INFO = "CatchInfo";
var TOTAL_GAIN = "totalGain";
var LAST_LOGOUT = "lastLogout";
var TOTAL_GAME_TIME = "totalGameTime";
var ACHIEVEMENTDATA = "achievementData";
var STAGEARRAYDATA = "stageArray";
var NORMAL_GAIN = "normalGain";
var SIGNNUM = "signnum";
var PLAYER_MONEY = "playerMoney";
var USER_ID = "UserID";
var NAME = "name";
var JACKPOT_EXPERIENCE_KEY = "jackPotExp";

var PlayerEntity_Wrapper = cc.Class.extend({
    m_sFilePath:null,
    "gameCount":0,
    "lastLogin":null,
    "totalConsume":0,
    // 记录用户购买船只的情况 ， 这个现在没有用
    shopItemData:null,
    // 是记录每种鱼的捕获数量，其实就是PlayerActor里的catchedFishes
    // 只不过用NSKeyedArchiver做了处理，变成NSData类型，暂时先不考虑
    // 这些问题
    "CatchInfo":null,
    "totalGain":0,
    "lastLogout":null,
    "totalGameTime":0,
    // 是一个数组，里边类型是 NSNumber， 其实就是PlayerActor里的achievementArray
    // 只不过用NSKeyedArchiver做了处理，变成NSData类型，暂时先不考虑这些问题
    "achievementData":null,
    "stageArrayData":null,
    "normalGain":0,
    // boatItemData是船部位信息， 没有用到
    boatItemData:null,
    "signnum":0,
    "playerMoney":99999,
    "UserID":"",
    "name":"",
    "jackPotExp":0,
    getGameCount:function () {
        return this[GAME_COUNT];
    },
    setGameCount:function (gameCount) {
        this[GAME_COUNT] = gameCount;
    },

    getLastLogin:function () {
        return this[LAST_LOGIN];
    },
    setLastLogin:function (lastLogin) {
        this[LAST_LOGIN] = lastLogin;
    },

    getTotalConsume:function () {
        return this[TOTAL_CONSUME];
    },
    setTotalConsume:function (totalConsume) {
        this[TOTAL_CONSUME] = totalConsume;
    },

    getShopItemData:function () {
        return this.shopItemData;
    },
    setShopItemData:function (shopItemData) {
        this.shopItemData = shopItemData;
    },

    getCatchInfo:function () {
        return this[CATCH_INFO];
    },
    setCatchInfo:function (catchInfo) {
        this[CATCH_INFO] = catchInfo;
    },

    getTotalGain:function () {
        return this[TOTAL_GAIN];
    },
    setTotalGain:function (totalGain) {
        this[TOTAL_GAIN] = totalGain;
    },

    getLastLogout:function () {
        return this[LAST_LOGOUT];
    },
    setLastLogout:function (lastLogout) {
        this[LAST_LOGOUT] = lastLogout;
    },

    getTotalGameTime:function () {
        return this[TOTAL_GAME_TIME];
    },
    setTotalGameTime:function (totalGameTime) {
        this[TOTAL_GAME_TIME] = totalGameTime;
    },

    getAchievementData:function () {
        return this[ACHIEVEMENTDATA];
    },
    setAchievementData:function (data) {
        if (this[ACHIEVEMENTDATA] != data) {
            this[ACHIEVEMENTDATA] = data;
        }
    },

    getStageArrayData:function () {
        return this[STAGEARRAYDATA];
    },
    setStageArrayData:function (data) {
        if (this[STAGEARRAYDATA] != data) {
            this[STAGEARRAYDATA] = data;
        }
    },

    getNormalGain:function () {
        return this[NORMAL_GAIN];
    },
    setNormalGain:function (normalGain) {
        this[NORMAL_GAIN] = normalGain;
    },

    getBoatItemData:function () {
        return this.boatItemData;
    },
    setBoatItemData:function (boatItemData) {
        this.boatItemData = boatItemData;
    },

    getSignnum:function () {
        return this[SIGNNUM];
    },
    setSignnum:function (signnum) {
        this[SIGNNUM] = signnum;
    },

    getPlayerMoney:function () {
        return this[PLAYER_MONEY];
    },
    setPlayerMoney:function (playerMoney) {
        this[PLAYER_MONEY] = playerMoney;
    },

    getUserID:function () {
        return this[USER_ID];
    },
    setUserID:function (userId) {
        this[USER_ID] = userId;
    },

    getName:function () {
        return this[NAME];
    },
    setName:function (name) {
        this[NAME] = name;
    },

    getJackPotExp:function () {
        return this[JACKPOT_EXPERIENCE_KEY];
    },
    setJackPotExp:function (exp) {
        this[JACKPOT_EXPERIENCE_KEY] = exp;
    },

    // 检查数据是否可用 
    isUseable:function () {
        return (0 != this.getName().length);
    },

    saveToLocalStorage:function () {
        var playerEntityStr = JSON.stringify(this);
        wrapper.setStringForKey(KEY_PLAYER_ENTITY, playerEntityStr);
    },

    /*// functions about save property
     saveGameCount:function (rootNode) {
     var tmp = this.gameCount;
     return (this.newNode(rootNode, GAME_COUNT, tmp) != null);
     },
     saveLastLogin:function (rootNode) {
     if (!this.lastLogin) {
     this.setLastLogin((new Date()).getTime());
     }
     var time = this.lastLogin;
     return (this.newNode(rootNode, LAST_LOGIN, this.convertTimeToString(time)) != null);
     },
     saveTotalConsume:function (rootNode) {
     var tmp = this.totalConsume;
     return (this.newNode(rootNode, TOTAL_CONSUME, tmp) != null);
     },
     saveCatchInfo:function (rootNode) {
     if (0 == this.CatchInfo && false == this.initCatchInfo()) {
     return false;
     }
     var catchInfoNode = this.newNode(rootNode, CATCH_INFO, null);
     var keys = this.CatchInfo;
     var iter;

     // key : 鱼的种类
     // vlaue : 鱼的数量
     for (var i in keys) {
     var pValue = this.CatchInfo[i];
     this.newNode(catchInfoNode, i, pValue);
     }

     return (catchInfoNode != null);
     },
     saveTotalGain:function (rootNode) {
     var tmp = this.totalGain;
     return (this.newNode(rootNode, TOTAL_GAIN, tmp) != null);
     },
     saveLastLogout:function (rootNode) {
     if (!this.lastLogin) {
     this.setLastLogin((new Date()).getTime());
     }
     return (this.newNode(rootNode, LAST_LOGOUT, this.convertTimeToString(time)) != null);
     },
     saveTotalGameTime:function (rootNode) {
     var tmp = this.totalGameTime;
     return (this.newNode(rootNode, TOTAL_GAME_TIME, tmp) != null);
     },
     saveAchievement:function (rootNode) {
     var achievementNode = this.newNode(rootNode, ACHIEVEMENTDATA, null);

     var obj;
     for (var i = 0; i < this.achievementData.length; i++) {
     obj = this.achievementData[i];
     var tmp = "element" + i;
     this.newNode(achievementNode, tmp, obj);
     }

     return (achievementNode != null);
     },
     saveStageArray:function (rootNode) {
     var stageNode = this.newNode(rootNode, STAGEARRAYDATA, null);

     var obj;
     for (var i = 0; i < this.stageArrayData.length; i++) {
     obj = this.stageArrayData[i];
     var tmp = "element" + i;
     this.newNode(stageNode, tmp, obj);
     }

     return (stageNode != null);
     },
     saveNormalGain:function (rootNode) {
     var tmp = this.normalGain;
     return (this.newNode(rootNode, NORMAL_GAIN, tmp) != null);
     },
     saveSignnum:function (rootNode) {
     var tmp = this.signnum;
     return (this.newNode(rootNode, SIGNNUM, tmp) != null);
     },
     savePlayerMoney:function (rootNode) {
     return (this.newNode(rootNode, PLAYER_MONEY, this.playerMoney) != null);
     },
     saveUserID:function (rootNode) {
     return (this.newNode(rootNode, USER_ID, this.UserID) != null);
     },
     saveName:function (rootNode) {
     return (this.newNode(rootNode, NAME, this.name) != null);
     },
     saveJackPotExp:function (rootNode) {
     return (this.newNode(rootNode, JACKPOT_EXPERIENCE_KEY, this.jackPotExp) != null);
     },*/
    doSave:function (rootNode) {
        /*var ret = false;
         do
         {
         if (!this.saveGameCount(rootNode)) break;
         if (!this.saveLastLogin(rootNode)) break;
         if (!this.saveTotalConsume(rootNode)) break;
         if (!this.saveCatchInfo(rootNode)) break;
         if (!this.saveTotalGain(rootNode)) break;
         if (!this.saveLastLogout(rootNode)) break;
         if (!this.saveTotalGameTime(rootNode)) break;
         if (!this.saveAchievement(rootNode)) break;
         if (!this.saveStageArray(rootNode)) break;
         if (!this.saveNormalGain(rootNode)) break;
         if (!this.saveSignnum(rootNode)) break;
         if (!this.savePlayerMoney(rootNode)) break;
         if (!this.saveUserID(rootNode)) break;
         if (!this.saveName(rootNode)) break;
         if (!this.saveJackPotExp(rootNode)) break;
         ret = true;
         } while (0);
         return ret;*/
        this.saveToLocalStorage()
    },
    newNode:function (parent, pKey, pValue) {

    },
    initCatchInfo:function () {
        var pCatch = {};
        var key = "Shark";
        pCatch[key] = 0;
        this.setCatchInfo(pCatch);
        return true;
    },
    convertTimeToString:function (t) {

    },
    convertStringToTime:function (pTimeString) {

    },
    devideStringWith_:function (pStr) {
        var pStart = pStr;
        var pTmp = pStart;
        var count = 0;
        var pVecStr = [];

        while (pTmp++) {
            if (pTmp == '_') {
                pVecStr.push(String(pStart));
                count = 0;
                pTmp++;
                pStart = pTmp;
            }
            else {
                count++;
            }
        }

        pVecStr.push(String(pStart));

        return pVecStr;
    }
});

PlayerEntity_Wrapper.m_sFilePath = "";
PlayerEntity_Wrapper.m_sbIsFilePathInitialized = false;
PlayerEntity_Wrapper.m_spEntity = null;

PlayerEntity_Wrapper.getInstance = function () {
    if (!this.m_spEntity) {
        this.m_spEntity = PlayerEntity_Wrapper.loadFromLocalStorage();
    }
    return this.m_spEntity;
};

PlayerEntity_Wrapper.loadFromLocalStorage = function () {
    var playerEntity;
    var strEntityInfo = wrapper.getStringForKey(KEY_PLAYER_ENTITY);
    if (0 != strEntityInfo.length) {
        playerEntity = this.loadFromString(strEntityInfo);
    }

    if (!playerEntity/* || !this.isUseable()*/) {
        // 没有读取到数据或者数据不可用，初始化一份
        playerEntity = this.initData();
    }

    cc.Assert(playerEntity != null, "PlayerEntity_Wrapper must not be null!");
    return playerEntity;
};

PlayerEntity_Wrapper.initData = function () {
    // @warning 此函数与 AppDelegate.insertNewRecord() 实现一致
    var entity = new PlayerEntity_Wrapper();

    PlayerActor.sharedActor().setPlayerAsia("fishman");

    var time = new Date();
    entity.setName("fishman");
    entity.setTotalConsume(0);
    entity.setTotalGameTime(0);
    entity.setLastLogin(time.getTime());
    entity.setLastLogout(time.getTime());

    // init the catch info
    var pCatch = {};
    pCatch["Shark"] = 0;
    entity.setCatchInfo(pCatch);

    /*entity.setPlayerMoney(GameSetting.getInstance().getPlayerMoney());

    var strSign = "" + entity.getPlayerMoney();
    var signnum = PlayerActor.sign(strSign);
    entity.setSignnum(signnum);*/

    // Process playerMoney
    var tempUnit = new signUnit(GameSetting.getInstance().getPlayerMoney(), entity.getSignnum(), signIndex);
    signPool.push(tempUnit);
    (signIndex > 100) ? (signIndex = 0) : signIndex++;
    updatePlayerMoney(tempUnit.index, GameSetting.getInstance().getPlayerMoney());   // 200
    //cc.log(signnum);


    entity.setAchievementData(PlayerActor.sharedActor().getAchievementArray());
    entity.setStageArrayData(PlayerActor.sharedActor().getStageArray());

    // 将数据保存到文件
    entity.saveToLocalStorage();

    return entity;
};

PlayerEntity_Wrapper.loadFromString = function () {
    var playerEntityStr = wrapper.getStringForKey(KEY_PLAYER_ENTITY);
    var tmpObj = JSON.parse(playerEntityStr);

    var playerEntity_Wrapper = new PlayerEntity_Wrapper();
    playerEntity_Wrapper.setGameCount(tmpObj[GAME_COUNT]);
    playerEntity_Wrapper.setLastLogin(tmpObj[LAST_LOGIN]);
    playerEntity_Wrapper.setTotalConsume(tmpObj[TOTAL_CONSUME]);
    playerEntity_Wrapper.setGameCount(tmpObj[CATCH_INFO]);
    playerEntity_Wrapper.setTotalGain(tmpObj[TOTAL_GAIN]);
    playerEntity_Wrapper.setLastLogout(tmpObj[LAST_LOGOUT]);
    playerEntity_Wrapper.setTotalGameTime(tmpObj[TOTAL_GAME_TIME]);
    playerEntity_Wrapper.setAchievementData(tmpObj[ACHIEVEMENTDATA]);
    playerEntity_Wrapper.setStageArrayData(tmpObj[STAGEARRAYDATA]);
    playerEntity_Wrapper.setNormalGain(tmpObj[NORMAL_GAIN]);
    playerEntity_Wrapper.setSignnum(tmpObj[SIGNNUM]);
    playerEntity_Wrapper.setPlayerMoney(tmpObj[PLAYER_MONEY]);
    playerEntity_Wrapper.setUserID(tmpObj[USER_ID]);
    playerEntity_Wrapper.setName(tmpObj[NAME]);
    playerEntity_Wrapper.setJackPotExp(tmpObj[JACKPOT_EXPERIENCE_KEY]);

    return playerEntity_Wrapper;
};