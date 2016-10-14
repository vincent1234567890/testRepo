var eSessionType = {
    eCCSession:0,
    BasicGame:1,
    GameMain:2,
    FishSeason:3
};

var CCSessionController = cc.Class.extend({
    _sessionRunning:false,
    _currentScene:null, //scene
    _delegate:null, //sessioncontroller delegate
    init:function () {
        this._sessionRunning = false;
        return true;
    },
    initWithDelegate:function (delegate, scene) {
        if (this.init()) {
            this._delegate = delegate;
            this._currentScene = scene;
            return true;
        }
        return false;
    },
    update:function (time) {
        if (this._sessionRunning) {
        }
    },
    getSessionType:function () {
        return eSessionType.eCCSession;
    },
    getCurrentScene:function () {
        return this._currentScene;
    },
    isSessionRunning:function () {
        return this._sessionRunning;
    },
    didLoad:function () {
    },
    startSession:function () {
        if (!this._sessionRunning) {
            this.willStart();
            this._sessionRunning = true;
            this.didStart();
        }
    },
    willStart:function () {
        this._delegate.sessionWillStart(this);
    },
    didStart:function () {
        this._delegate.sessionDidStart(this);
    },
    willEnd:function () {
        this._delegate.sessionWillEnd(this);
    },
    didEnd:function () {
        this._delegate.sessionDidEnd(this);
    },
    endSession:function () {
        if (this._sessionRunning) {
            this.willEnd();
            this._sessionRunning = false;
            this.didEnd();
        }
    }
});