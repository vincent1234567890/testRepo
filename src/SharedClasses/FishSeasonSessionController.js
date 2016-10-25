/*var kFishActorName = "ActorName";
var kDelayTime = "DelayTime";
var kInitPosition = "InitPosition";
var kInterValTime = "IntervalTime";
var kTotalNumber = "TotalNumber";

var kPathRadius = "Radius";
var kPathSpeed = "speed";
var kPathMoveDict = "MoveDict";
var kPathOnTheRrc = "onTheRrc";
var kPathDirection = "Angle";
var kPathOffset = "offset";

var FishSeasonPath = FishGroup.extend({
    _intervalTime:0,
    _isEnd:false,
    _isBegin:false,
    _totalCount:0,
    _delayTime:0,
    _pastTime:0,
    _createdCount:0,
    _fishActorName:"",
    _initPostion:new cc.Point(0, 0),
    _pathDict:null,
    _offset:new cc.Point(0, 0),
    _fishSeasonPathDelegate:null,
    init:function (delegate) {
        this._super();
        this._fishSeasonPathDelegate = delegate;
    },

    *//*  代码编号	含义	数值
     MoveDict	定义鱼游动的路径类型，	0=直线，1=横向曲线，2=回游，3转圈
     DealyTime	定义出生点的初始延迟	1=1秒
     IntervalTime	定义鱼的出生间隔时间	1=1秒
     InitPostion	定义鱼的出生位置	右下角为{0, 0}
     Radius	当类型为弧线时，定义鱼行走的圆弧大小	{x轴半径, y轴半径}
     Angle	当类型为直线时，定义鱼出生后的行走方向	以右向的x轴为正方向，逆时针计算角度。
     onTheRrc	当类型为弧线时,定义鱼沿椭圆的上方还是下方行走	0=上弧，1=下弧
     speed	定义鱼出生后的速度	1=1像素/秒
     TotalNumber	定义一次捕鱼季出生鱼的总数	1=1只鱼
     ActorName	定义出生鱼的种类	鱼的名字    *//*

    loadPathDictionary:function (dict) {
        this._fishActorName = dict[kFishActorName];
        this._intervalTime = parseFloat(dict[kInterValTime]);
        this._totalCount = parseInt(dict[kTotalNumber]);
        this._delayTime = parseFloat(dict[kDelayTime]);

        this._pastTime = this._intervalTime;
        if (this._delayTime > 0.01) {
            this._pastTime = 0;
        }

        this._initPostion = cc.PointFromString(dict[kInitPosition]);
        this._pathDict = [];

        this._offset = new cc.Point(0, 0);
        var value = dict[kPathOffset];
        if (value) {
            this._offset = cc.PointFromString(value);
        }

        var arrayValue = dict[kPathRadius];
        if (arrayValue) {
            this._pathDict[kPathRadius] = arrayValue;
        }

        this._pathDict[kPathSpeed] = dict[kPathSpeed];

        this._pathDict[kPathMoveDict] = dict[kPathMoveDict];

        var obj = dict[kPathOnTheRrc];
        if (obj) {
            this._pathDict[kPathOnTheRrc] = obj;
        }

        obj = dict[kPathDirection];
        if (obj) {
            this._pathDict[kPathDirection] = obj;
        }
    },
    update:function (time) {
        if (this._isBegin) {
            if (this._isEnd) {
                this.endPath();
            }
            else {
                this._pastTime += time;
                if (this._pastTime >= this._intervalTime) {
                    this.createFishActor();
                    this._createdCount++;
                    if (this._createdCount >= this._totalCount) {
                        this._isEnd = true;
                    }
                    this._pastTime = 0;
                }
            }
        }
        else {
            if (this._isEnd) {
                return;
            }
            this._pastTime += time;
            if (this._pastTime >= this._delayTime) {
                this._pastTime = this._intervalTime;
                this._isBegin = true;
            }
        }
    },
    endPath:function () {
        this._fishSeasonPathDelegate.pathShouldEnd(this);
        this._isBegin = false;
    },
    initializeAllTrack:function (plistFile) {
        this.trackDict = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(plistFile);
    },
    initAllTrack:function (stage) {
        var trackPlistName = "FishSeasonTrack" + stage + ".plist";
        this.initializeAllTrack(trackPlistName);
    },
    createFishActor:function () {
        var fishActor = this.createFishActorWithName(this._fishActorName, this._initPostion, this._pathDict, this._offset, 0);
        this.getScene().addActor(fishActor);
    }
});*/


var FishSeasonSessionController = GameSessionController.extend({
    _addPrizeFlag:0,
    _time:0,
    _addPrizeFishGroupFinish:false,
    addPrizeFishGroup:function (bLeft, startPos) {//startPos is optional, overloaded
        if (!startPos) {
            var x = (bLeft) ? (VisibleRect.left().x) : (VisibleRect.right().x);
            startPos = cc.p(x, VisibleRect.center().y);
        }
        this._time = 0;
        sino.fishGroup.setInitPoint(startPos);
        sino.fishGroup.createPrizeFishGroup(bLeft);
    },
    loadFishSeasonPaths:function (index) {

    },
    update:function (dt) {
        if (this._sessionRunning) {
            this._time += dt;
            if (this._addPrizeFlag == 0) {
                var nConsume = PlayerActor.sharedActor().getCurConsume();
                var X = 0.0;
                if (nConsume != 0) {
                    X = PlayerActor.sharedActor().getCurReturn() / nConsume;
                }
                if (X < 0.6) {
                    this._addPrizeFishGroupFinish = sino.fishGroup.createCirclePrize();
                    this._addPrizeFlag = 3;
                }
                else {
                    this.addPrizeFishGroup(false);
                    this._addPrizeFlag = 1;
                }
            }
            var groupFishActors = this._currentScene.getActors(GroupFishActor);
            if (this._time >= 10.0 && this._addPrizeFlag == 1 && groupFishActors.length == 0) {
                this.addPrizeFishGroup(true);
                this._addPrizeFlag = 3;
            }
            else if (this._time >= 15.0 && this._addPrizeFlag == 3 && (groupFishActors.length == 0)) {
                this.endSession();
            }
            else if (this._addPrizeFishGroupFinish && (groupFishActors.length == 0)) {
                this._addPrizeFishGroupFinish = false;
                this.endSession();
            }
            this.updateAllActors(dt);
        }
    }
});
