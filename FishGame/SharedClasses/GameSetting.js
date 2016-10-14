var CURRENT_SPECIAL_WEAPON_KEY = "CurrentSpecialWeaponSelected";
var DEBUG = true;

var GameSetting = cc.Class.extend({
    multipleExchangeRate:null,
    requestParameters:null,
    freeCoinsAdType:null,
    lotterStatus:null,
    updateDelay:null,
    flurryCircleAwardAmount:null,
    flurryClicpsAwardAmount:null,
    sign:null,
    enableMessageCenter:null,
    onLineVersion:null,
    flurrySessionLifetimeInBackground:null,
    electricBusinessEnable:null,
    gameSceneAdBannerImpressInterval:null,
    gameSceneAdBannerImpressDuration:null,
    sPARedeemDisplayedCountries:null,
    bulletDistanceArray:null,
    bulletSpeedArray:null,
    fishRandomArray:null,
    bulletRandomArray:null,
    netRandomArray:null,
    cannonRandomArray:null,
    independRandomArray:null,
    fishDepartRandomArray:null,
    prizeScoreArray:null,
    bulletFishRandomArray:null,
    achieveArray:null,
    chestFishArray:null,
    playerMoney:99999,
    playerMoney1:99999,
    playerMoney2:99999,
    changeBgTimeInterval:0,
    addGroupInterval:0,
    curRandomRadio:0,
    shootInterval:0,
    showBuyItem:false,
    preReturnRatio:0,
    consumeMoney:0,
    experienceMoney:0,
    experienceRatio:0,
    curGroupFlag:0,
    addCoinNeedTime:0,
    addCoinNeedTimeOffline:0,
    addCoinCount:0,
    normalCoinCount:0,
    bulletShootCount:0,
    fightType:FightType.eFightTypeLocalTwo,
    attackIdArray:0,
    fishIdArray:null,
    stimulateIdArray:null,
    scaleFactor:null,
    expectationArray:null,
    ctor:function () {
        this.bulletFishRandomArray = [];
        this.fishDepartRandomArray = [];
        this.expectationArray = [];
    },
    init:function () {

        naclInit();
        var VisableSize = VisibleRect.rect().size;
        // track文件是针对480x320设计的
        var scaleFactor = Math.min(VisableSize.width / 480, VisableSize.height / 320);
        this.setScaleFactor(scaleFactor);

        this.bulletDistanceArray = [];
        this.bulletDistanceArray.push(350);
        this.bulletDistanceArray.push(350);
        this.bulletDistanceArray.push(450);
        this.bulletDistanceArray.push(450);
        this.bulletDistanceArray.push(550);
        this.bulletDistanceArray.push(650);
        this.bulletDistanceArray.push(700);
        this.bulletDistanceArray.push(800);//Ray
        this.bulletDistanceArray.push(800);
        this.bulletDistanceArray.push(800);
        this.bulletDistanceArray.push(800);//Levin
        this.bulletDistanceArray.push(800);

        this.bulletSpeedArray = [];
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);//Ray
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);
        this.bulletSpeedArray.push(300);//Levin 10级子弹速度
        this.bulletSpeedArray.push(200);

        this.fishRandomArray = [];
        this.fishRandomArray.push(300);
        this.fishRandomArray.push(300);
        this.fishRandomArray.push(400);
        this.fishRandomArray.push(500);
        this.fishRandomArray.push(600);
        this.fishRandomArray.push(1000);
        this.fishRandomArray.push(1500);
        this.fishRandomArray.push(2000);
        this.fishRandomArray.push(4000);
        this.fishRandomArray.push(8000);
        this.fishRandomArray.push(16000);
        this.fishRandomArray.push(300);
        this.fishRandomArray.push(600);

        /* this.bulletRandomArray = [];
         this.bulletRandomArray.push(68);
         this.bulletRandomArray.push(82);
         this.bulletRandomArray.push(90);
         this.bulletRandomArray.push(102);
         this.bulletRandomArray.push(109);
         this.bulletRandomArray.push(118);
         this.bulletRandomArray.push(125);

         this.cannonRandomArray = [];
         this.cannonRandomArray.push(68);
         this.cannonRandomArray.push(82);
         this.cannonRandomArray.push(90);
         this.cannonRandomArray.push(102);
         this.cannonRandomArray.push(109);
         this.cannonRandomArray.push(118);
         this.cannonRandomArray.push(125);

         this.independRandomArray = [];
         this.independRandomArray.push(20);
         this.independRandomArray.push(30);
         this.independRandomArray.push(40);
         this.independRandomArray.push(50);
         this.independRandomArray.push(60);
         this.independRandomArray.push(70);
         this.independRandomArray.push(80);
         this.independRandomArray.push(90);
         this.independRandomArray.push(110);
         this.independRandomArray.push(120);
         this.independRandomArray.push(130);
         this.independRandomArray.push(20);
         this.independRandomArray.push(60);

         this.fishDepartRandomArrayVal = []; // fishDepartRandom
         this.fishDepartRandomArrayVal.push(100);
         this.fishDepartRandomArrayVal.push(50);
         this.fishDepartRandomArrayVal.push(20);
         this.fishDepartRandomArrayVal.push(10);
         this.fishDepartRandomArrayVal.push(10);

         for (var i = 0; i < 13; i++) {
         this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);
         }

         this.netRandomArray = [];
         this.netRandomArray.push(68);
         this.netRandomArray.push(82);
         this.netRandomArray.push(90);
         this.netRandomArray.push(102);
         this.netRandomArray.push(109);
         this.netRandomArray.push(118);
         this.netRandomArray.push(125);     */

        this.prizeScoreArray = [];
        this.prizeScoreArray.push(100);
        this.prizeScoreArray.push(60);
        this.prizeScoreArray.push(50);
        this.prizeScoreArray.push(40);
        this.prizeScoreArray.push(30);
        this.prizeScoreArray.push(20);
        this.prizeScoreArray.push(10);
        this.prizeScoreArray.push(7);
        this.prizeScoreArray.push(4);
        this.prizeScoreArray.push(2);
        this.prizeScoreArray.push(1);
        this.prizeScoreArray.push(100);
        this.prizeScoreArray.push(30);

        /* this.bulletFishRandomArrayVal = [];
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

         //1
         this.bulletFishRandomArrayVal = [];
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

         //2
         this.bulletFishRandomArrayVal = [];
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

         //3
         this.bulletFishRandomArrayVal = [];
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

         //4
         this.bulletFishRandomArrayVal = [];
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

         //5
         this.bulletFishRandomArrayVal = [];
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

         //6
         this.bulletFishRandomArrayVal = [];
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(100);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(120);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArrayVal.push(80);
         this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal); */

        this.expectationArray.push(3.75);
        this.expectationArray.push(3.75);
        this.expectationArray.push(3.33);
        this.expectationArray.push(3.33);
        this.expectationArray.push(3.33);
        this.expectationArray.push(2.734);
        this.expectationArray.push(2.343);
        this.expectationArray.push(2.4605);
        this.expectationArray.push(2.12);
        this.expectationArray.push(2);
        this.expectationArray.push(1);
        this.expectationArray.push(1);
        this.expectationArray.push(1);

        this.playerMoney = 99999;
        this.changeBgTimeInterval = 300;
        this.addGroupInterval = 3;  //6
        this.consumeMoney = 200;
        this.experienceMoney = 200;

        this.curRandomRadio = 1;
        this.shootInterval = 0.05;  //0.38 normal
        this.showBuyItem = false;

        this.experienceRatio = 1;
        this.preReturnRatio = 1;

        this.addCoinNeedTime = 60;
        this.addCoinNeedTimeOffline = 900;
        this.addCoinCount = 5;
        this.normalCoinCount = 1500;
        this.bulletShootCount = 0;

        this.achieveArray = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(ImageName("Achievement.plist"));

        this.chestFishArray = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(ImageName("ChestFish.plist"));

        return true;

    },

    loadAttackArray:function () {
        //attackTable
        this.attackIdArray = [];
        var attackTablePath = cc.FileUtils.getInstance().fullPathFromRelativePath(SceneSettingDataModel.sharedSceneSettingDataModel().getAttackTableFileName());
        //KingFisher cc.log("csv path:" + attackTablePath);
        var csvFile = new CSVFile();
        csvFile.Open(attackTablePath);
        var tempStr = null;
        while (csvFile.CSVReadNextRow()) {
            var count = 0;
            var dict = {};
            var string = "";

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("attackId:", string);
            tempStr = new String(string);
            dict["attackId"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("attackType:" + string);
            tempStr = new String(string);
            dict["attackType"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("costMoney:" + string);
            tempStr = new String(string);
            dict["costMoney"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("cofficientA:" + string);
            tempStr = new String(string);
            dict["cofficientA"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("cofficientB:" + string);
            tempStr = new String(string);
            dict["cofficientB"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("energy:" + string);
            tempStr = new String(string);
            dict["energy"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("judgeCountMax:" + string);
            tempStr = new String(string);
            dict["judgeCountMax"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("this.shootIntervalMin:" + string);
            tempStr = new String(string);
            dict["this.shootIntervalMin"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("maxShootDistance:" + string);
            tempStr = new String(string);
            dict["maxShootDistance"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("alfaPathWidth:" + string);
            tempStr = new String(string);
            dict["alfaPathWidth"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("alfaRadius:" + string);
            tempStr = new String(string);
            dict["alfaRadius"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("betaCannonRadius:" + string);
            tempStr = new String(string);
            dict["betaCannonRadius"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("betaCannonAngle:" + string);
            tempStr = new String(string);
            dict["betaCannonAngle"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("betaPathWidth:" + string);
            tempStr = new String(string);
            dict["betaPathWidth"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("betaRadius:" + string);
            tempStr = new String(string);
            dict["betaRadius"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("flySpeed:" + string);
            tempStr = new String(string);
            dict["flySpeed"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("explodeSpeed:" + string);
            tempStr = new String(string);
            dict["explodeSpeed"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit1:" + string);
            tempStr = new String(string);
            dict["StimulateUnit1"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit2:" + string);
            tempStr = new String(string);
            dict["StimulateUnit2"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit3:" + string);
            tempStr = new String(string);
            dict["StimulateUnit3"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit4:" + string);
            tempStr = new String(string);
            dict["StimulateUnit4"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit5:" + string);
            tempStr = new String(string);
            dict["StimulateUnit5"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit6:" + string);
            tempStr = new String(string);
            dict["StimulateUnit6"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit7:" + string);
            tempStr = new String(string);
            dict["StimulateUnit7"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit8:" + string);
            tempStr = new String(string);
            dict["StimulateUnit8"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit9:" + string);
            tempStr = new String(string);
            dict["StimulateUnit9"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit10:" + string);
            tempStr = new String(string);
            dict["StimulateUnit10"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit11:" + string);
            tempStr = new String(string);
            dict["StimulateUnit11"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit12:" + string);
            tempStr = new String(string);
            dict["StimulateUnit12"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit13:" + string);
            tempStr = new String(string);
            dict["StimulateUnit13"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit14:" + string);
            tempStr = new String(string);
            dict["StimulateUnit14"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateUnit15:" + string);
            tempStr = new String(string);
            dict["StimulateUnit15"] = tempStr;
            this.attackIdArray.push(dict);
        }
        delete csvFile;
    },
    loadFishIdArray:function () {
        //fishTable
        this.fishIdArray = [];
        var fishTablePath = cc.FileUtils.getInstance().fullPathFromRelativePath(SceneSettingDataModel.sharedSceneSettingDataModel().getFishTableFileName());
        //KingFisher cc.log("csv path:" + fishTablePath);
        var csvFile = new CSVFile();
        csvFile.Open(fishTablePath);
        var tempStr = null;
        while (csvFile.CSVReadNextRow()) {
            var count = 0;
            var dict = {};
            var string = "";

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("fishId:" + string);
            tempStr = new String(string);
            dict["fishId"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("fishName:" + string);
            tempStr = new String(string);
            dict["fishName"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("fishScore:" + string);
            tempStr = new String(string);
            dict["fishScore"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("intrinsicValue:" + string);
            tempStr = new String(string);
            dict["intrinsicValue"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon1Expect:" + string);
            tempStr = new String(string);
            dict["weapon1Expect"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon2Expect:" + string);
            tempStr = new String(string);
            dict["weapon2Expect"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon3Cluster:" + string);
            tempStr = new String(string);
            dict["weapon3Cluster"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon3Weight:" + string);
            tempStr = new String(string);
            dict["weapon3Weight"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon4Cluster:" + string);
            tempStr = new String(string);
            dict["weapon4Cluster"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon4Weight:" + string);
            tempStr = new String(string);
            dict["weapon4Weight"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon5Expect:" + string);
            tempStr = new String(string);
            dict["weapon5Expect"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon6Cluster:" + string);
            tempStr = new String(string);
            dict["weapon6Cluster"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon6Weight:" + string);
            tempStr = new String(string);
            dict["weapon6Weight"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon7Cluster:" + string);
            tempStr = new String(string);
            dict["weapon7Cluster"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("weapon7Weight:" + string);
            tempStr = new String(string);
            dict["weapon7Weight"] = tempStr;

            this.fishIdArray.push(dict);
        }
        delete csvFile;
    },
    loadStimulateIdArray:function () {
        //stimulateTable
        this.stimulateIdArray = [];
        var incentiveTablePath = cc.FileUtils.getInstance().fullPathFromRelativePath(SceneSettingDataModel.sharedSceneSettingDataModel().getIncentiveTableFileName());
        //KingFisher cc.log("csv path" + incentiveTablePath);
        var csvFile = new CSVFile();
        csvFile.Open(incentiveTablePath);
        var tempStr = null;
        while (csvFile.CSVReadNextRow()) {
            var count = 0;
            var dict = {};
            var string = "";

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("StimulateID:" + string);
            tempStr = new String(string);
            dict["StimulateID"] = tempStr;

            string = csvFile.CSVRead(count++);
            //KingFisher cc.log("NoFeedbackPro:" + string);
            tempStr = new String(string);
            dict["NoFeedbackPro"] = tempStr;

            this.stimulateIdArray.push(dict);
        }
        delete csvFile;

        this.experienceMoney = 200;
        this.consumeMoney = 200;
    },
    fishJoySettingHost:function () {
        if (DEBUG)
            return "http://test.KingFisher.punchbox.org";
        else
            return "http://KingFisher.punchbox.org";
    },
    spaRedeemDisplayedAtCurrentLanguage:function () {
        return true;
    },
    computeReturnRatio:function (stage) {
        var X = PlayerActor.sharedActor().getCurReturn() * 100.0 / PlayerActor.sharedActor().getCurConsume();
        var A = 1;
        var B = 1;
        var C = 1;
        var baseV = 0.5;
        if (X < 80) {
            var Y = A * X * X + B * X + C;
            this.preReturnRatio = baseV + (1 / (1 + (Y / (X + 1)) / 100));
        }
        else if (X < 100) {
            this.preReturnRatio = 1;
        }

        else if (X < 125) {
            A = 2;
            var Y = A * X * X + B * X + C;
            this.preReturnRatio = baseV + (1 / (1 + (Y / (X + 1)) / 100));
        }
        else if (X < 150) {
            A = 3;
            var Y = A * X * X + B * X + C;
            this.preReturnRatio = baseV + (1 / (1 + (Y / (X + 1)) / 100));
        }
        else if (X < 175) {
            A = 5;
            var Y = A * X * X + B * X + C;
            this.preReturnRatio = baseV + (1 / (1 + (Y / (X + 1)) / 100));
        }
        else if (X < 200) {
            A = 100;
            var Y = A * X * X + B * X + C;
            this.preReturnRatio = baseV + (1 / (1 + (Y / (X + 1)) / 100));
        }
        else {
            this.preReturnRatio = 0.5;
        }

        if (stage == 2) {
            this.preReturnRatio = 1 - (Math.sqrt(X) - 9) / 20;

        }

        PlayerActor.sharedActor().setCurConsume(0);
        PlayerActor.sharedActor().setCurReturn(0);
    },
    loadData:function (stage) {
        this.loadOldFishPathData(stage);
    },
    computeExperienceRatio:function (count, stage) {
        var a1;
        if (stage == 1 || stage == null) {
            a1 = 0.3;
        }
        else {
            a1 = 0.2;
        }

        var a = a1 + count * a1;
        var c = -0.5;
        var d = 0.3;
        var b = 0;
        this.experienceRatio = (a * Math.sin(c * count + b) + d + 10) / 10;
    },

    // property
    getBulletDistanceArray:function () {
        return this.bulletDistanceArray;
    },
    getBulletSpeedArray:function () {
        return this.bulletSpeedArray;
    },
    getFishRandomArray:function () {
        return this.fishRandomArray;
    },
    getBulletRandomArray:function () {
        return this.bulletRandomArray;
    },
    getNetRandomArray:function () {
        return this.netRandomArray;
    },
    getCannonRandomArray:function () {
        return this.cannonRandomArray;
    },
    getIndependRandomArray:function () {
        return this.independRandomArray;
    },
    getFishDepartRandomArray:function () {
        return this.fishDepartRandomArray;
    },
    getPrizeScoreArray:function () {
        return this.prizeScoreArray;
    },
    getBulletFishRandomArray:function () {
        return this.bulletFishRandomArray;
    },
    getAchieveArray:function () {
        return this.achieveArray;
    },

    getChestFishArray:function () {
        return this.chestFishArray;
    },
    loadNewFishPathData:function (nStage) {
        if (nStage == 3) {
            this.loadAttackArray();

            this.loadFishIdArray();

            this.loadStimulateIdArray();
        }
        else if (nStage == 2) {

            this.experienceMoney = 100;
            this.consumeMoney = 50;
        }
    },
    loadOldFishPathData:function (nStage) {
        if (nStage == 1) {
            this.independRandomArray = [];
            this.independRandomArray.push(20);
            this.independRandomArray.push(30);
            this.independRandomArray.push(40);
            this.independRandomArray.push(50);
            this.independRandomArray.push(60);
            this.independRandomArray.push(70);
            this.independRandomArray.push(80);
            this.independRandomArray.push(90);
            this.independRandomArray.push(110);
            this.independRandomArray.push(120);
            this.independRandomArray.push(130);
            this.independRandomArray.push(20);
            this.independRandomArray.push(60);

            this.fishRandomArray = [];
            this.fishRandomArray.push(300);
            this.fishRandomArray.push(300);
            this.fishRandomArray.push(400);
            this.fishRandomArray.push(500);
            this.fishRandomArray.push(600);
            this.fishRandomArray.push(1000);
            this.fishRandomArray.push(1500);
            this.fishRandomArray.push(2000);
            this.fishRandomArray.push(4000);
            this.fishRandomArray.push(8000);
            this.fishRandomArray.push(16000);
            this.fishRandomArray.push(300);
            this.fishRandomArray.push(600);

            /* //0
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //1
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //2
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //3
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //4
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //5
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //6
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(30);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(30);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(30);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.bulletFishRandomArrayVal);  */

            this.experienceMoney = 200;
            this.consumeMoney = 200;
        }
        else if (nStage == 2) {
            this.independRandomArray = [];
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);

            this.fishRandomArray = [];
            this.fishRandomArray.push(333);
            this.fishRandomArray.push(200);
            this.fishRandomArray.push(250);
            this.fishRandomArray.push(300);
            this.fishRandomArray.push(333);
            this.fishRandomArray.push(1000);
            this.fishRandomArray.push(2000);
            this.fishRandomArray.push(1429);
            this.fishRandomArray.push(2500);
            this.fishRandomArray.push(5000);
            this.fishRandomArray.push(10000);
            this.fishRandomArray.push(150);
            this.fishRandomArray.push(333);

            /* //0
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.reserve(13);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //1
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //2
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //3
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //4
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //5
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //6
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);  */

            this.experienceMoney = 100;
            this.consumeMoney = 50;
        } else if (nStage == 3) {
            this.independRandomArray = [];
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);
            this.independRandomArray.push(190);

            this.fishRandomArray = [];
            this.fishRandomArray.push(333);
            this.fishRandomArray.push(200);
            this.fishRandomArray.push(250);
            this.fishRandomArray.push(300);
            this.fishRandomArray.push(333);
            this.fishRandomArray.push(1000);
            this.fishRandomArray.push(2000);
            this.fishRandomArray.push(1429);
            this.fishRandomArray.push(2500);
            this.fishRandomArray.push(5000);
            this.fishRandomArray.push(10000);
            this.fishRandomArray.push(150);
            this.fishRandomArray.push(333);

            /*  //0
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //1
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //2
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //3
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //4
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //5
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);

             //6
             this.bulletFishRandomArrayVal = [];
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(100);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(120);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArrayVal.push(80);
             this.bulletFishRandomArray.push(this.bulletFishRandomArrayVal);


             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal = [];
             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);

             this.fishDepartRandomArrayVal.push(100);
             this.fishDepartRandomArrayVal.push(50);
             this.fishDepartRandomArrayVal.push(20);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArrayVal.push(10);
             this.fishDepartRandomArray.push(this.fishDepartRandomArrayVal);  */

            this.experienceMoney = 100;
            this.consumeMoney = 50;
        }
    },
    releaseNewFishPathInfo:function () {
        this.attackIdArray = [];
        this.fishIdArray = [];
        this.stimulateIdArray = [];
    },

    setFreeCoinsAdType:function (v) {
        this.freeCoinsAdType = v;
    },
    getFreeCoinsAdType:function () {
        return this.freeCoinsAdType;
    },

    setLotterStatus:function (v) {
        this.lotterStatus = v;
    },
    getLotterStatus:function () {
        return this.lotterStatus;
    },

    setUpdateDelay:function (v) {
        this.updateDelay = v;
    },
    getUpdateDelay:function () {
        return this.updateDelay;
    },

    setFlurryCircleAwardAmount:function (v) {
        this.flurryCircleAwardAmount = v;
    },
    getFlurryCircleAwardAmount:function () {
        return this.flurryCircleAwardAmount;
    },

    setFlurryClicpsAwardAmount:function (v) {
        this.flurryClicpsAwardAmount = v;
    },
    getFlurryClicpsAwardAmount:function () {
        return this.flurryClicpsAwardAmount;
    },

    setSign:function (v) {
        this.sign = v;
    },
    getSign:function () {
        return this.sign;
    },

    setEnableMessageCenter:function (v) {
        this.enableMessageCenter = v;
    },
    getEnableMessageCenter:function () {
        return this.enableMessageCenter;
    },

    setFlurrySessionLifetimeInBackground:function (v) {
        this.flurrySessionLifetimeInBackground = v;
    },
    getFlurrySessionLifetimeInBackground:function () {
        return this.flurrySessionLifetimeInBackground;
    },

    setOnLineVersion:function (v) {
        this.onLineVersion = v;
    },
    getOnLineVersion:function () {
        return this.onLineVersion;
    },

    setElectricBusinessEnable:function (v) {
        this.electricBusinessEnable = v;
    },
    getElectricBusinessEnable:function () {
        return this.electricBusinessEnable;
    },

    setGameSceneAdBannerImpressInterval:function (v) {
        this.gameSceneAdBannerImpressInterval = v;
    },
    getGameSceneAdBannerImpressInterval:function () {
        return this.gameSceneAdBannerImpressInterval;
    },

    setGameSceneAdBannerImpressDuration:function (v) {
        this.gameSceneAdBannerImpressDuration = v;
    },
    getGameSceneAdBannerImpressDuration:function () {
        return this.gameSceneAdBannerImpressDuration;
    },

    setSPARedeemDisplayedCountries:function (v) {
        this.sPARedeemDisplayedCountries = v;
    },
    getSPARedeemDisplayedCountries:function () {
        return this.sPARedeemDisplayedCountries;
    },
    setShootInterval:function (v) {
        this.shootInterval = v;
    },
    getShowBuyItem:function () {
        return this.showBuyItem;
    },
    setShowBuyItem:function (v) {
        this.showBuyItem = v;
    },

    getPlayerMoney:function () {
        return this.playerMoney;
    },
    getPlayerMoney1:function () {
        return this.playerMoney1;
    },
    getPlayerMoney2:function () {
        return this.playerMoney2;
    },
    getAddGroupInterval:function () {
        return this.addGroupInterval;
    },
    getChangeBgTimeInterval:function () {
        return this.changeBgTimeInterval;
    },
    getCurRandomRadio:function () {
        return this.curRandomRadio;
    },
    getShootInterval:function () {
        return this.shootInterval;
    },

    getPreReturnRatio:function () {
        return this.preReturnRatio;
    },

    getConsumeMoney:function () {
        return this.consumeMoney;
    },

    getExperienceMoney:function () {
        return this.experienceMoney;
    },
    getExperienceRatio:function () {
        return this.experienceRatio;
    },
    getCurGroupFlag:function () {
        return this.curGroupFlag;
    },
    getAddCoinNeedTime:function () {
        return this.addCoinNeedTime;
    },
    getAddCoinNeedTimeOffline:function () {
        return this.addCoinNeedTimeOffline;
    },
    getAddCoinCount:function () {
        return this.addCoinCount;
    },
    getNormalCoinCount:function () {
        return this.normalCoinCount;
    },
    getBulletShootCount:function () {
        return this.bulletShootCount;
    },
    setBulletShootCount:function (x) {
        this.bulletShootCount = x;
    },
    getFightType:function () {
        return this.fightType;
    },
    getAttackIdArray:function () {
        return this.attackIdArray;
    },
    getFishIdArray:function () {
        return this.fishIdArray;
    },
    getStimulateIdArray:function () {
        return this.stimulateIdArray;
    },
    getScaleFactor:function () {
        return this.scaleFactor;
    },
    setScaleFactor:function (v) {
        this.scaleFactor = v;
    },
    getExpectationArray:function () {
        return this.expectationArray;
    }
});

GameSetting.getInstance = function () {
    if (!this._instance) {
        this._instance = new GameSetting();
        this._instance.init();
    }
    return this._instance;
};

GameSetting._instance = null;

GameSetting.adjustForAndroid = function (val) {
    return val * 3 / 3;
};
GameSetting.adjustForAndroidSpeed = function (val) {
    return val * 10 / 8;
};

// {"gameCount":{},"lastLogin":1474516201529,"totalConsume":3143,"totalGain":3554,"lastLogout":1474516202296,"totalGameTime":2536.742000002266,"achievementData":["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0"],"stageArray":["1","0","0"],"normalGain":1408,"signnum":"20094832","playerMoney":99999,"name":"fishman","jackPotExp":3153,"CatchInfo":{}}