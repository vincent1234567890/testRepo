var fishActorNameArray = [
    "SharkActor", "MarlinsFishActor", "LanternActor", "PorgyActor", "RayActor", "ChelonianActor",
    "BreamActor", "GrouperFishActor", "CroakerActor", "AngleFishActor", "SmallFishActor", "PufferActor",
    "AmphiprionActor", "ButterflyActor", "PomfretActor", "GoldenTroutActor"
];

var FishGroup = cc.Class.extend({
    _chestArray:null, //array
    controlPoints:null, //array
    controlValus:null, //array
    eMoveType:null, //EMOVEtype
    groupId:'',
    lastPlistIndex:0,
    loopCount:0,
    nameDict:null, //CCDictionary
    outSpeedScale:0,
    _passTime:0,
    pathId:null,
    sharkCount:0,
    speed:0,
    trackDict:{},
    fishActorMortality:null,
    curStage:0,
    ctor:function () {
        //loading code
        this.curStage = 1;
        this.loadResource();
    },
    getFishActorMortality:function () {
        return this.fishActorMortality
    },
    setFishActorMortality:function (fishActorMortality) {
        this.fishActorMortality = fishActorMortality
    },
    scene:null,
    getScene:function () {
        return this.scene
    },
    setScene:function (scene) {
        this.scene = scene
    },
    initPoint:null,
    getInitPoint:function () {
        return this.initPoint
    },
    setInitPoint:function (initPoint) {
        this.initPoint = initPoint
    },
    _fishType:null,
    getFishType:function () {
        return this._fishType
    },
    setFishType:function (fishType) {
        this._fishType = fishType
    },
    createCircleTutorialFishGroup:function (tutorialIdx) {
        var prizeList = "Track" + tutorialIdx;
        var dict = this.trackDict[prizeList];
        var Pathdict = dict["Path1"];
        var tmpArray = Pathdict["Offset"];

        for (var i = 0; i < tmpArray.length; i++) {
            var dictionaryFish = tmpArray[i];
            var offset = dictionaryFish["offset"];
            var fishRadiusOffset = parseFloat(dictionaryFish["radiusOffset"]);
            var fishActorName = dictionaryFish["actorname"];
            var fishAcor = ActorFactory.create(fishActorName);
            this._fishType = fishAcor.getFishType();
            fishAcor.setRadiusOffset(fishRadiusOffset);
            fishAcor.setOffset(offset);

            fishAcor.setCreatePosition(cc.p(VisibleRect.center().x, VisibleRect.center().y));
            fishAcor.setPosition(cc.pAdd(VisibleRect.center(), offset));
            fishAcor.updatePath(Pathdict);
            fishAcor.updateInfo();
            fishAcor.resetState();
            this.getScene().addActor(fishAcor);
        }
    },
    createTutorialFishGroup:function (tutorialIdx) {
        var dict = this.trackDict["Track" + tutorialIdx];

        var Pathdict = dict["Path1"];
        var tmpArray = Pathdict["Offset"];

        for (var i = 0; i < tmpArray.length; i++) {
            var dictionaryFish = tmpArray[i];
            var offset = dictionaryFish["offset"];
            var fishActorName = dictionaryFish["actorname"];
            var fishAcor = ActorFactory.create(fishActorName);
            this._fishType = fishAcor.getFishType();
            this.getScene().addActor(fishAcor);
            var initX = this.initPoint.x;
            if (initX >= VisibleRect.right().x) {//warning 大于或相等， 浮点数比较不能直接用==
                initX += 0.5;
                fishAcor.setBeRightDir(false);
                offset.x = -offset.x;
                fishAcor.setOffset(offset);
            }
            else if (initX <= VisibleRect.left().x) {//warning 小于或相等， 浮点数比较不能直接用==
                initX -= 0.5;
                fishAcor.setBeRightDir(true);
            }

            fishAcor.setPosition(cc.pAdd(cc.p(initX, this.getInitPoint().y), offset));
            fishAcor.updatePath(Pathdict);
            fishAcor.updateInfo();
            fishAcor.resetState();
            fishAcor.setZOrder(BulletActorZValue - 1);
        }
    },
    createFishGroup:function (stage) {
        if (stage != null) {
            this.loopCount++;
            var fishActorName = this.getRandFishNameWithList("probability.plist", stage);
            this.createFishGroupPath(fishActorName);
        }
        else {
            this.loopCount++;
            var fishActorName = this.getRandFishNameWithList("probability.plist", stage);
            if (fishActorName === "SharkActor" || fishActorName === "RayActor" && this.sharkCount > 0) {
                return;
            }
            if (this.loopCount % 18 == 0 && this.sharkCount) {
                this.sharkCount = 0;
                this.loopCount = 1;
            }
            if (fishActorName === "SharkActor" || fishActorName === "RayActor") {
                this.sharkCount = 1;
            }
            var fishNeedType = this.getFishTypeby(fishActorName);
            var dict = this.trackDict["Track" + fishNeedType];

            var randNum = dict.length;
            randNum = (0 | (Math.random() * randNum)) + 1;

            var Pathdict = dict["Path" + randNum];
            var tmpArray = Pathdict["Offset"];

            for (var i = 0; i < tmpArray.length; i++) {
                var dictionaryFish = tmpArray[i];
                var offset = dictionaryFish["offset"];

                var fishAcor = ActorFactory.create(fishActorName);
                this._fishType = fishAcor.getFishType();
                fishAcor.setOffset(offset);
                var contentSize = 0 | (fishAcor.getContentSize().width);
                if (contentSize < 96) {
                    contentSize = 96;
                }

                var fishActorHalfWidth = contentSize;

                var initX = (this.initPoint.x);
                if (initX >= VisibleRect.right().x) {
                    initX += fishActorHalfWidth;
                    fishAcor.setBeRightDir(false);
                    offset.x = -offset.x;
                    fishAcor.setOffset(offset);
                }
                else if (initX <= VisibleRect.left().x) {
                    initX -= fishActorHalfWidth;
                    fishAcor.setBeRightDir(true);
                }

                fishAcor.setPosition(cc.pAdd(cc.p(initX, this.initPoint.y), offset));
                fishAcor.updatePath(Pathdict);
                fishAcor.updateInfo();
                fishAcor.resetState();
                fishAcor.playAction(0);
                this.getScene().addActor(fishAcor);
            }
        }
    },
    getTrackDict:function () {
        return this.trackDict;
    },
    setGSharkActor:function () {
        for (var i = 0; i < 2; i++) {
            var fishActorName = this.getFishActorNameStr(0);
            var fishNeedType = this.getFishTypeby(fishActorName);
            var fishAcor;
            if (i == 0) {
                fishAcor = ActorFactory.create("GSharkActor");
            } else if (i == 1) {
                //fishAcor= ActorFactory.create("GMarlinsFishActor");
            }

            var dict = this.trackDict["Track" + fishNeedType];
            var Pathdict = dict["Path1"];

            fishAcor.setPosition(VisibleRect.center());
            fishAcor.updatePath(Pathdict);
            fishAcor.updateInfo();
            fishAcor.resetState();
            fishAcor.setIsChangeColor(true);

            var AchieveArray = GameSetting.getInstance().getChestFishArray();
            var pDict = AchieveArray[0];
            var hp = parseInt(pDict["Maximum"]);
            fishAcor.setHP(hp);
            var CaptureRandom = parseFloat(pDict["CaptureRandom"]);
            fishAcor.setCaptureRandom(CaptureRandom);
            fishAcor.setChestFishID(0);
            fishAcor.playAction(0);

            this.getScene().addActor(fishAcor);
        }
    },
    createPrizeFishGroup:function (type) {
        var temp = (0 | (Math.random() * 5)) + 5;
        var prizeList;
        if (type) {
            prizeList = "Track" + this.lastPlistIndex;
            this.lastPlistIndex = 0;
        }
        else {
            prizeList = "Track" + temp;
            this.lastPlistIndex = temp;
        }

        var dict = this.trackDict[prizeList];
        var Pathdict = dict["Path1"];
        var tempArray = Pathdict["Offset"];

        for (var i = 0; i < tempArray.length; i++) {
            var dictionaryFish = tempArray[i];
            var offset = dictionaryFish["offset"];
            var fishActorName = dictionaryFish["actorname"];
            var fishAcor = ActorFactory.create(fishActorName);
            this._fishType = fishAcor.getFishType();
            fishAcor.setOffset(offset);
            var initX = this.initPoint.x;
            if (initX >= VisibleRect.right().x) {
                initX += 0.5;
                if (offset.x <= 0) {
                    offset.x = -offset.x;
                }
                fishAcor.setBeRightDir(false);
            }
            else if (initX <= VisibleRect.left().x) {
                initX -= 0.5;
                if (offset.x >= 0) {
                    offset.x = -offset.x;
                }
                fishAcor.setBeRightDir(true);
            }

            this.initPoint = cc.p(initX, this.initPoint.y);
            fishAcor.setPosition(cc.pAdd(this.initPoint, offset));

            fishAcor.updatePath(Pathdict);
            fishAcor.updateInfo();
            fishAcor.resetState();
            this.scene.addActor(fishAcor);
        }
    },
    createCirclePrize:function () {
        var temp = (0 | (Math.random() * 5)) + 11;
        var cListName = "Track" + temp;
        var dict = this.trackDict[cListName];

        var Pathdict = dict["Path1"];
        var array = Pathdict["Offset"];

        for (var q = 0; q < array.length; q++) {
            var dictionaryFish = array[q];
            var offset = dictionaryFish["offset"];
            var fishRadiusOffset = parseFloat(dictionaryFish["radiusOffset"]);

            var fishActorName = dictionaryFish["actorname"];
            var fishAcor = ActorFactory.create(fishActorName);
            this._fishType = fishAcor.getFishType();
            fishAcor.setRadiusOffset(fishRadiusOffset);
            fishAcor.setOffset(offset);
            fishAcor.setCreatePosition(VisibleRect.center());
            fishAcor.setPosition(cc.pAdd(VisibleRect.center(), offset));
            fishAcor.updatePath(Pathdict);
            fishAcor.updateInfo();
            fishAcor.resetState();
            this.getScene().addActor(fishAcor);
        }
    },
    initializeAllTrack:function (plistFile) {
        this.trackDict = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(ImageName(plistFile));
    },
    init:function () {
        this.sharkCount = 0;
        this.loopCount = 0;
        this.nameDict = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(ImageName("probability.plist"));
        this._chestArray = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(ImageName("ChestFish.plist"));
        return true;
    },
    loadResource:function (stage) {
        stage = stage || this.curStage;
        var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25], trackstr;
        if (stage === 1) {
            trackstr = 'Track1_';
        } else if (stage === 2) {
            trackstr = 'Track2_';
        }
        var ScaleFactor = 2.5;
        for (var i = 0; i < nums.length; i++) {
            var oneTrackDict = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(ImageName(trackstr + nums[i] + ".plist"));
            //var pathKey = oneTrackDict.allkeys();
            //get all keys from onetrackdict
            for (var pathkey in oneTrackDict) {
                var pathDict = oneTrackDict[pathkey];
                var tmpArray = pathDict["Offset"];
                for (var k = 0; k < tmpArray.length; k++) {
                    var dictionaryFish = tmpArray[k];
                    var offset = cc.PointFromString(dictionaryFish["offset"]);
                    dictionaryFish["offset"] = cc.p(offset.x * ScaleFactor, offset.y * ScaleFactor);
                }
                tmpArray = pathDict["Radius"];
                for (var l = 0; l < tmpArray.length; l++) {
                    var stringRadius = tmpArray[l];
                    var controlradius = cc.PointFromString(stringRadius);
                    tmpArray[l] = cc.p(controlradius.x * ScaleFactor, controlradius.y * ScaleFactor);
                }
            }
            this.trackDict['Track' + nums[i]] = oneTrackDict;
        }

    },
    initFishGroupRequired:function () {
        this.sharkCount = 0;
        this.loopCount = 0;
        this.initializeAllTrack("ObjectGameModal_path.plist");
    },
    fishMortality:function (fishActor) {
        if (this.fishActorMortality) {
            fishActor.setMortality(true);
        }
    },
    getNameDict:function () {
        return this.nameDict;
    },
    getRandFishNameWithList:function (filename, st) {
        var arrayName = 'stage' + st;
        var stageArray = this.getNameDict()[arrayName];
        var randNum = Math.random() * 100;
        for (var i = 0; i < stageArray.length; i++) {
            var tmpArray = stageArray[i];
            var pStrNumber = tmpArray[1];
            var num = 0;
            if (pStrNumber) {
                num = parseInt(pStrNumber);
            }
            if (randNum <= num) {
                return tmpArray[0];
            }
        }
        return null;
    },
    getFishTypeby:function (fishName) {
        var tempType;
        switch (fishName) {
            case 'SharkActor':
            case 'MarlinsFishActor':
                tempType = FishType.bigFish;
                break;
            case 'LanternActor':
            case 'PorgyActor':
            case 'RayActor':
            case 'ChelonianActor':
            case 'BreamActor':
            case 'GrouperFishActor':
                tempType = FishType.mediumFish;
                break;
            case 'CroakerActor':
            case 'AngleFishActor':
            case 'SmallFishActor':
            case 'ButterflyActor':
            case 'PomfretActor':
            case 'GoldenTroutActor':
                tempType = FishType.smallFish;
                break;
            case 'PufferActor':
                tempType = FishType.balloonfish;
                break;
            case 'AmphiprionActor':
                var stage = 1;
                var pScene = this.getScene();
                if (pScene) {
                    stage = pScene.getOddsNumber();
                }
                if (stage == 2) {
                    tempType = FishType.mediumFish;
                }
                else {
                    tempType = FishType.smallFish;
                }
        }
        return tempType;
    },
    changeNumber:function (fishActorName) {
        var changeNum = -1;
        var count = this._chestArray.length;
        for (var i = 0; i < count; i++) {
            var pOneDict = this._chestArray[i];

            var fileName = pOneDict["FishName"];
            if (fishActorName == fileName) {
                var isColor = pOneDict["isColor"];
                if (isColor) {
                    var pScene = this.getScene();
                    if (pScene.getSPSceneType() != SPSceneType.eFightScene) {
                        var ColorRandom = pOneDict["ColorRandom"];

                        var colorRandNum = Math.random() * 100;
                        if (colorRandNum < ColorRandom) {
                            changeNum = i;
                        }

                    } else {
                        //KingFisher cc.log("不是GameScene跳过金色鲨鱼");
                    }
                }
            }
        }
        return changeNum;
    },
    createFishActorWithName:function (fishActorName, initPosition, pathDict, offset, fishID) {
        var fishActor = null;
        var changeNum = this.changeNumber(fishActorName);
        if (changeNum != -1) {
            var szName = 'G' + fishActorName;
            fishActor = ActorFactory.create(szName);
        }
        else {
            fishActor = ActorFactory.create(fishActorName);
        }
        var szAssert = 'the actor name ' + fishActorName + ' is not exist';
        cc.Assert(fishActor, fishActorName);
        fishActor.setFishID(fishID);
        fishActor.setOffset(offset);
        fishActor.resetContentSize();
        var si = fishActor.getSize();
        var fishActorHalfWidth = Math.max(si.width, si.height);
        var initX = initPosition.x;
        if (initX >= VisibleRect.right().x) {
            initX += fishActorHalfWidth;
            fishActor.setBeRightDir(false);
            if (offset.x <= 0) {
                offset.x = -offset.x;
            }
            fishActor.setOffset(offset);
        }
        else if (initX <= VisibleRect.left().x) {
            initX -= fishActorHalfWidth;
            fishActor.setBeRightDir(true);
            if (offset.x >= 0) {
                offset.x = -offset.x;
            }
            fishActor.setOffset(offset);
        }

        fishActor.setCreatePosition(initPosition);
        fishActor.setPosition(cc.pAdd(cc.p(initX, initPosition.y), offset));

        var p = fishActor.getPosition();

        fishActor.updatePath(pathDict);
        fishActor.updateInfo();
        fishActor.resetState();
        fishActor.playAction(0);

        if (changeNum != -1) {
            fishActor.setIsChangeColor(true);
            var pOneDict = this._chestArray[changeNum];

            var hp = parseInt(pOneDict["Maximum"]);
            fishActor.setHP(hp);
            var CaptureRandom = pOneDict.CaptureRandom;
            fishActor.setCaptureRandom(CaptureRandom);
            fishActor.setChestFishID(changeNum);
        }
        return  fishActor;
    },
    createFishGroupPath:function (fishActorName) {
        var sharkNRay = ['SharkActor', 'RayActor'];
        if ((sharkNRay.indexOf(fishActorName) !== -1) && this.sharkCount > 0) {
            return;
        }
        if (this.loopCount % 18 == 0 && this.sharkCount) {
            this.sharkCount = 0;
            this.loopCount = 1;
        }
        if (sharkNRay.indexOf(fishActorName) !== -1) {
            this.sharkCount = 1;
        }
        var fishNeedType = this.getFishTypeby(fishActorName);
        var trackKey = 'Track' + fishNeedType;
        var dict = this.trackDict[trackKey];
        var randNum = 0;
        if (dict) {
            var count = 0;
            for (var key in dict) {
                count++;
            }
            randNum = count;
        }

        randNum = 1 + ( 0 | (Math.random() * randNum));
        //var FishActorNum = this.getFishActorNameInt(fishActorName);
        this.createFishGroupWithPathNum(randNum, fishActorName, this.initPoint);
    },
    getFishActorNameInt:function (fishActor) {
        for (var i = 0; i < fishActorNameArray.length; i++) {
            if (fishActor === fishActorNameArray[i]) {
                return i;
            }
        }
        return 0;
    },
    getFishActorNameStr:function (fishActorNum) {
        if (fishActorNum >= fishActorNameArray.length) {
            return '';
        }
        return fishActorNameArray[fishActorNum];
    },
    createFishGroupWithPathNum:function (randNum, fishActorNameNum, initPos) {
        if (!isNaN(fishActorNameNum)) {
            var fishActorName = this.getFishActorNameStr(fishActorNameNum);
        }
        else {
            var fishActorName = fishActorNameNum;
        }
        var fishNeedType = this.getFishTypeby(fishActorName);
        var listName = 'Track' + fishNeedType;
        var dict = this.trackDict[listName];
        var strPath = 'Path' + randNum;
        if (!dict.hasOwnProperty(strPath)) {
            throw "hasOwnProperty   " + strPath;
        }
        var pathDict = dict[strPath];
        var tmpArray = pathDict["Offset"];
        var fishID = 0;
        for (var i = 0; i < tmpArray.length; i++) {
            var dictionaryFish = tmpArray[i];
            var offset = dictionaryFish["offset"];
            var fishActor = this.createFishActorWithName(fishActorName, initPos, pathDict, offset, fishID);
            fishID++;
            this.getScene().addActor(fishActor);
        }
    }
});
FishGroup.shareFishGroup = function () {
    if (!this.s_pSharedFishgroup) {
        this.s_pSharedFishgroup = new FishGroup();
        this.s_pSharedFishgroup.init();
    }
    return this.s_pSharedFishgroup;
};
FishGroup.purgeShareFishGroup = function () {
    this.s_pSharedFishgroup = null;
};