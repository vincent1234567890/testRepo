// 此枚举类型用于替换 isKindOfClass 函数的判断
var BaseActorType = {
    eBaseActor:0,
    eFishActor:1,
    eBulletActor:2,
    eFishNetActor:3,
    eGoldPrizeActor:4,
    eXuliActor:5,
    eBigPrizeActor:6,
    eChestActor:7
};

var defaultScale = 1;

var BaseActor = BaseSprite.extend({
    _def:null,
    _isAlive:false,
    _isPause:false,
    _collideSize:null,
    _isShouldShooting:false,
    _curAction:0,
    _infoDict:null,
    _collideRadius:0,
    _sd:null,
    _scene:null,
    _group:null,
    getScene:function () {
        return this._scene
    },
    setScene:function (scene) {
        this._scene = scene
    },
    getGroup:function () {
        return this._group
    },
    setGroup:function (scene) {
        this._group = scene
    },
    getDef:function () {
        return this._def;
    },
    setDef:function (val) {
        this._def = val;
    },
    getBaseActorType:function () {
        return BaseActorType.eBaseActor
    },
    initWithSpriteName:function (defName, imgName, pos) {
        if (!pos) {
            pos = cc.p(240, 160);
        }

        var currentGameScene = this.getCurrentGameScene();
        //this.initWithTexture(currentGameScene.getBatchNodeForKey(imgName, true, 1));
        this.initWithFile(ImageName(defName), ImageName(imgName));

        //this.initWithFile(ImageName(imgName));
        //this._curAction = 0;

        /*this._actionIndex = 0;
         this._sequenceIndex = 0;
         this._disableUpdate = true;
         this._stopByNotLoop = false;
         this._spriteBN = ImageName(imgName);
         this._sd = cc.FileUtils.getInstance().dictionaryWithContentsOfFileThreadSafe(ImageName(defName + ".plist"));*/
        //this.setAction(this._curAction);
        //this.schedule(this.update);

        this.setIsAlive(true);
        this.setIsPause(false);
        //this.setPosition(pos);

        return true;
    },
    playAction:function (actionIndex) {
        if (this._curAction != actionIndex) {
            this._curAction = actionIndex;
            this.setAction(actionIndex);
        }
    },
    setFrame:function (frameId) {
        this._sequenceIndex = frameId;
    },
    getAction:function () {
        return this._actionIndex;
    },
    getCurrentGameScene:function () {
        var gameController = GameCtrl.sharedGame();
        var currentScene = gameController.getCurScene();
        return currentScene;
    },
    handleCollide:function (plane) {
        return true;
    },
    //this function do nothing
    /*update:function (dt) {
        this._super();

        if (!this._isAlive) {
            return;
        }

        *//*        if (this._isAlive) {
         var rcEScreenRect = VisibleRect.rect();
         var fishSize = this.getContentSize();
         rcEScreenRect.x -= fishSize.width / 2;
         rcEScreenRect.y -= fishSize.height / 2;
         rcEScreenRect.width += fishSize.width;
         rcEScreenRect.height += fishSize.height;
         if (!cc.Rect.CCRectContainsPoint(rcEScreenRect, this.getPosition())) {
         this.removeSelfFromScene();
         return;
         }
         }*//*
    },*/
    resetState:function () {
        this._isPause = false;
        this._isAlive = true;
        this._isShouldShooting = true;
        this.setUpdatebySelf(true);
    },
    updateInfo:function () {
    },
    beginMove:function () {
        this._isAlive = true;
    },
    removeSelfFromScene:function () {
        this._isAlive = false;
        this._isShouldShooting = false;

        //this.setPosition(cc.p(-100, -100));
        this.stopAllActions();
        this.setUpdatebySelf(false);
        this.getScene().removeActor(this);
        //this.removeFromParentAndCleanup();
    },
    setInfoDict:function (v) {
        if (v != this._infoDict) {
            this._infoDict = v;
        }
    },
    getInfoDict:function () {
        return this._infoDict;
    },
    getIsPause:function () {
        return this._isPause
    },
    setIsPause:function (p) {
        this._isPause = p
    },
    getIsAlive:function () {
        return this._isAlive
    },
    setIsAlive:function (a) {
        this._isAlive = a
    },
    setCollideSize:function (s) {
        this._collideSize.width = s.width;
        this._collideSize.height = s.height;
    },
    getCollideSize:function () {
        return this._collideSize;
    },
    setIsShouldShooting:function (s) {
        this._isShouldShooting = s
    },
    geIsShouldShooting:function () {
        return this._isShouldShooting
    },
    collideWith:function (plane) {
        if (!this._isAlive || !plane.getIsAlive()) {
            return false;
        }
        return this.collidesWith(plane);
    }
});