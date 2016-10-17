var totalTollGateNumber = 100;
var kUseAcceler = "useAcceler";
var kPlayMusic = "playMusic";
var kPlayEffect = "playEffect";
var kHaveSaveData = "haveSaveData";
var kCurTollState = "currentTollGate";
var kBombCount = "bombCount";
var kPowerupCount = "powerupCount";
var kRayPower = "rayPower";
var kBulletEmitter = "curBulletEmitter";
var kBulletType = "curBulletType";
var kScore = "score";
var kStartupCount = "startupCount";
var kRate = "rate";
var kColseLocalPush = "colseLocalPush";
var kNewFishPrompt = "NewFishPrompt1";
var kTutorialPlayed = "TutorialPlayed";
var kWeiBoAdd = "WeiBoAdd";
var kUseLaser = "UseLaser";
var kFirstOpenTime = "firstOpenTime";
var kIsPaying = "isPaying";
var kAddStarfish = "addStarfish";
var kLaserNum = "LaserNum";
var kLaserSign = "LaserSign";
var kTutorialAwardReceived = "TutorialAwardReceived";
var kOldLaserNum = "OldLaserNum";
var KCurrentMusicPlayType = "currentMusicPlayType";
var kNewFishPath = "newFishPath";
var kCanShowRedeem = "canShowRedeem";
var defCapacity = 9;
var IsFirst = "IsFirst";
var KGameInitData = "GameInitData";

var GamePreference = cc.Class.extend({
    _useAcceler:false,
    _playMusic:true,
    _playEffect:true,
    _closeLocalPush:true,
    _haveSaveData:false,
    _startupCount:0,
    _rate:true,
    _playingBackgroundMusic:false,
    _currentMusicType:null,
    init:function () {
        this.loadSoftPref();
        return true;
    },
    updateSoftPref:function () {
        wrapper.setBooleanForKey(kUseAcceler, this._useAcceler);

        wrapper.setBooleanForKey(kPlayMusic, this._playMusic);

        wrapper.setBooleanForKey(kPlayEffect, this._playEffect);

        wrapper.setIntegerForKey(kStartupCount, this._startupCount);

        wrapper.setBooleanForKey(kRate, this._rate);

        wrapper.setBooleanForKey(kColseLocalPush, this._closeLocalPush);

        wrapper.setBooleanForKey(kHaveSaveData, this._haveSaveData);

        wrapper.setIntegerForKey(KCurrentMusicPlayType, this._currentMusicType);

    },
    loadSoftPref:function () {
        // get bUseAcceler value
        this._useAcceler = wrapper.getBooleanForKey(kUseAcceler, false);

        // get bPlayMusic value
        this._playMusic = wrapper.getBooleanForKey(kPlayMusic, true);

        // get bPlayEffect value
        this._playEffect = wrapper.getBooleanForKey(kPlayEffect, true);

        // get haveSaveData value
        this._haveSaveData = wrapper.getBooleanForKey(kHaveSaveData, false);

        // get haveSaveData value
        this._startupCount = wrapper.getIntegerForKey(kStartupCount, 0);

        // get haveSaveData value
        this._rate = wrapper.getBooleanForKey(kRate, true);

        // get haveSaveData value
        this._closeLocalPush = wrapper.getBooleanForKey(kColseLocalPush, false);

        // get current music type.
        this._currentMusicType = wrapper.getIntegerForKey(KCurrentMusicPlayType, 0);
    },
    isPlayingBackgroundMusic:function () {
        return this._playingBackgroundMusic;
    },
    setPlayMusic:function (v) {
        this._playMusic = v;
    },
    getPlayMusic:function () {
        return this._playMusic;
    },
    setPlayEffect:function (v) {
        this._playEffect = v;
    },
    getPlayEffect:function () {
        return this._playEffect;
    },
    setHaveSaveData:function (v) {
        this._haveSaveData = v;
    },
    getHaveSaveData:function () {
        return this._haveSaveData;
    },
    setCloseLocalPush:function (v) {
        this._closeLocalPush = v;
    },
    getCloseLocalPush:function () {
        return this._closeLocalPush;
    },
    resetSoftPref:function () {
    },
    playOST:function () {
    },
    playPB33:function () {
    },
    refreshCurrentMusicState:function () {
    },
    setMusicEnable:function (bEnable, bNeedSave) {
    },
    playNextMusic:function () {
    },
    resumePlayMusic:function () {
    },
    startPlayMusic:function () {
    },
    changeToPlayUseriPodMusicPlayer:function () {
    }
});

GamePreference._pSharedPreference = null;

GamePreference.getInstance = function () {
    if (!this._pSharedPreference) {
        this._pSharedPreference = new GamePreference();
        this._pSharedPreference.init();
    }
    return this._pSharedPreference;
};

 GamePreference.end = function () {
    this._pSharedPreference = null;
};
