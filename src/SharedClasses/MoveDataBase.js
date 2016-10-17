var SW_MOVETYPE = {
    MOVETYPE_STRAIGHT:0,
    MOVETYPE_ELLIPSE:1,
    MOVETYPE_UTYPE:2,
    MOVETYPE_CUTTLESTYLE:3,
    MOVETYPE_BEZIERAT:4,
    MOVETYPE_COMPAGES:5,
    MOVETYPE_RETURN:6};

var MoveDataBase = cc.Class.extend({
    action:0,
    moveType:0,
    deSerialize:function (data) {
        //TODO? apparently unused
    },
    initWithDictionary:function (dic) {
        this.moveType = dic["type"];
        this.action = dic["action"];
        return this;
    },
    serialize:function (file) {
    }
});

var MoveDataStraight = MoveDataBase.extend({
    speed:0,
    startPosition:null,
    endPosition:null,
    initWithDictionary:function (dic) {
        this._super(dic);
        this.speed = dic["speed"];
        this.startPosition = cc.PointFromString(dic["startPosition"]);
        this.endPosition = cc.PointFromString(dic["endPosition"]);
        return this;
    }
});

var MoveDataEllipse = MoveDataBase.extend({
    speed:0,
    onTheRrc:false,
    radius:null, //point
    beRightDir:false,
    initWithDictionary:function (dic) {
        this._super(dic);
        this.onTheRrc = dic["onTheRrc"];
        var array = dic["Radius"];
        for (var i = 0; i < array.length; i++) {
            var strRadius = array[i];
            this.radius = cc.PointFromString(strRadius);
        }
        this.beRightDir = dic["beRightDir"];

        return this;
    }
});


var MoveDataUtype = MoveDataBase.extend({
    speed:0,
    radius:0,
    straightDistance:0,
    clockwise:false,
    initDir:0,
    initWithDictionary:function (dic) {
        this._super(dic);
        this.speed = dic["speed"];
        this.radius = dic["radius"];
        this.initDir = dic["initDir"];
        this.straightDistance = dic["straightDistance"];
        this.clockwise = dic["clockwise"];
        return this;
    }
});


var MoveDataCuttleStyle = MoveDataBase.extend({
    originalSpeed:0,
    acceleration:0,
    minusAcceleration:0,
    speedUpFrameStart:0,
    speedUpFrameEnd:0,
    speedDownFrameStart:0,
    speedDownFrameEnd:0,
    startPosition:null,
    endPosition:null,
    initWithDictionary:function (dic) {
        this._super(dic);
        this.acceleration = dic["acceleration"];
        this.minusAcceleration = dic["minusAcceleration"];
        this.speedUpFrameStart = dic["speedUpFrameStart"];
        this.speedUpFrameEnd = dic["speedUpFrameEnd"];
        this.speedDownFrameStart = dic["speedDownFrameStart"];
        this.speedDownFrameEnd = dic["speedDownFrameEnd"];
        this.originalSpeed = dic["originalSpeed"];
        this.startPosition = cc.PointFromString(dic["startPosition"]);
        this.endPosition = cc.PointFromString(dic["endPosition"]);
    }
});


var CompagesDataUnit = cc.Class.extend({
    dataType:0,
    moveData:null, //moveDatabase
    endCondition:0,
    initWithDictionary:function (dic) {
        var dataDic = dic["moveData"];
        this.dataType = dic["type"];
        switch (this.dataType) {
            case SW_MOVETYPE.MOVETYPE_BEZIERAT:
                this.moveData = new MoveDataBezier();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_STRAIGHT:
                this.moveData = new MoveDataStraight();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_RETURN:
                //nil
                break;
            default:
                break;
        }
        this.endCondition = dic["endCondition"];
        return this;
    }
});

var MoveDataBezier = MoveDataBase.extend({
    startPosition:null,
    endPosition:null,
    controlPoint:null,
    controlPoint2:null,
    controlPoint3:null,
    controlPoint4:null,
    time:0,
    initWithDictionary:function (dic) {
        this._super(dic);
        this.startPosition = cc.PointFromString(dic["startPosition"]);
        this.endPosition = cc.PointFromString(dic["endPosition"]);
        this.controlPoint = cc.PointFromString(dic["controlPoint"]);
        this.controlPoint2 = cc.PointFromString(dic["controlPoint2"]);
        this.controlPoint3 = cc.PointFromString(dic["controlPoint3"]);
        this.controlPoint4 = cc.PointFromString(dic["controlPoint4"]);
        this.time = dic["time"];
        return this;
    }
});
var MoveDataCompages = MoveDataBase.extend({
    pathCount:0,
    datas:null,
    initWithDictionary:function (dic) {
        this._super(dic);
        this.pathCount = dic["partCount"];
        var paths = dic["paths"];
        this.datas = [];
        for (var i = 0; i < paths.length; i++) {
            var unitDic = paths[i];
            var unit = new CompagesDataUnit();
            unit.initWithDictionary(unitDic);
            this.datas.push(unit);
        }
        return this;
    }
});

var ActorTrackData = cc.Class.extend({
    actorType:0,
    actorName:0,
    initPosition:null,
    dataType:0,
    moveData:null,
    initWithDictionary:function (dic) {
        this.actorType = dic["actorType"];
        this.actorName = dic["actorName"];
        this.dataType = dic["type"];
        this.initPosition = cc.PointFromString(dic["initPos"]);

        var dataDic = dic["moveData"];
        switch (this.dataType) {
            case SW_MOVETYPE.MOVETYPE_STRAIGHT:
                this.moveData = new MoveDataStraight();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_ELLIPSE:
                this.moveData = new MoveDataEllipse();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_UTYPE:
                this.moveData = new MoveDataUtype();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_CUTTLESTYLE:
                this.moveData = new MoveDataCuttleStyle();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_COMPAGES:
                this.moveData = new MoveDataCompages();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_BEZIERAT:
                this.moveData = new MoveDataBezier();
                this.moveData.initWithDictionary(dataDic);
                break;
            case SW_MOVETYPE.MOVETYPE_RETURN:
                //            self.moveData = [[[MoveDataReturn alloc] initWithDictionary:dataDic] autorelease];
                //nil;
                break;
            default:
                break;
        }
        return this;
    }
});


var ShipPerWaveData = cc.Class.extend({
    isSingle:false,
    loppCount:0,
    delay:0,
    initWithDictionary:function (dic) {
        this.shipArray = [];
        var sArray = dic["shipArray"];
        for (var i = 0; i < sArray.length; i++) {
            var dc = sArray[i];
            var data = new ActorTrackData();
            data.initWithDictionary(dc);
            this.shipArray.push(data);
        }
        this.isSingle = dic["isSingle"];
        this.loopCount = dic["loopCount"];
        this.delay = dic["delay"];
        return this;
    }
});

var ScreenWaveUnitData;
var ScreenWaveData;
var FishGroupUnitData;
var FishGroupData;