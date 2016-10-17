var NUM_VALUE = 10000;
var FishNetCollideHandler = cc.Class.extend({
    checkLocallyData:function (sceneid) {

    },
    checkLocallyDataAgine:function () {

    },
    readLocallyData:function () {

    },
    writeToLocallyData:function () {

    },
    loadLocallyData:function () {

    },
    loadDefaultData:function () {
        this._huibaobi = 0.92;
        this._kengdie = 0.05;
        this._parA = 0.3;
        this._parOmiga = Math.PI * 2 / 1400.0;
        this._fishExpection.push(3.75);//100
        this._fishExpection.push(3.75);//60
        this._fishExpection.push(3.33);//50
        this._fishExpection.push(3.33);//40
        this._fishExpection.push(3.33);//30
        this._fishExpection.push(2.734);//20
        this._fishExpection.push(2.343);//10
        this._fishExpection.push(2.4605);//7
        this._fishExpection.push(2.12);//4
        this._fishExpection.push(2.0);//2
        this._fishExpection.push(1.0);//1

        this._fishExpection.push(1.0);
        this._fishExpection.push(1.0);
//    GameSetting.sharedGameSetting().setExpectationArray(this._m_fishExpection);

        this._huibaobi2 = 0.92;
        this._kengdie2 = 0.05;
        this._parA2 = 0.3;
        this._parOmiga2 = Math.PI * 2 / 1400.0;
        this._fishExpection2.push(3.75);//100
        this._fishExpection2.push(3.75);//60
        this._fishExpection2.push(3.33);//50
        this._fishExpection2.push(3.33);//40
        this._fishExpection2.push(3.33);//30
        this._fishExpection2.push(2.734);//20
        this._fishExpection2.push(2.343);//10
        this._fishExpection2.push(2.4605);//7
        this._fishExpection2.push(2.12);//4
        this._fishExpection2.push(2.0);//2
        this._fishExpection2.push(1.0);//1

        this._fishExpection2.push(1.0);
        this._fishExpection2.push(1.0);

        this._huibaobi3 = 0.87;
        this._kengdie3 = 0.05;
        this._parA3 = 0.3;
        this._parOmiga3 = Math.PI * 2 / 1400.0;
        this._fishExpection3.push(3.75);//100
        this._fishExpection3.push(3.75);//60
        this._fishExpection3.push(3.33);//50
        this._fishExpection3.push(3.33);//40
        this._fishExpection3.push(3.33);//30
        this._fishExpection3.push(2.734);//20
        this._fishExpection3.push(2.343);//10
        this._fishExpection3.push(2.4605);//7
        this._fishExpection3.push(2.12);//4
        this._fishExpection3.push(2.0);//2
        this._fishExpection3.push(1.0);//1

        this._fishExpection3.push(1.0);
        this._fishExpection3.push(1.0);

        switch (this.getSceneIdx()) {
            case 1:
                GameSetting.getInstance().expectationArray = this._fishExpection;
                break;
            case 2:
                GameSetting.getInstance().expectationArray = this._fishExpection2;
                break;
            case 3:
                GameSetting.getInstance().expectationArray = this._fishExpection3;
                break;
            default:
                break;
        }

    },
    createDefaultData:function () {

    },
    createServiceData:function () {

    },
    createAndLoadServiceData:function () {

    },
    handleCollide:function (netActor, CollideFish) {
        var curM_parA = 0.3;
        var curM_parOmiga = Math.PI * 2 / 1400;
        var curM_huibaobi = 0.8;
        var curM_kengdie = 0.05;
        var rateLevel = 1;
        switch (this.getSceneIdx()) {
            case 1:
                curM_parA = this._parA;
                curM_parOmiga = this._parOmiga;
                curM_huibaobi = this._huibaobi;
                curM_kengdie = this._kengdie;
                rateLevel = 1;
                break;
            case 2:
                curM_parA = this._parA2;
                curM_parOmiga = this._parOmiga2;
                curM_huibaobi = this._huibaobi2;
                curM_kengdie = this._kengdie2;
                rateLevel = 2;
                break;
            case 3:
                curM_parA = this._parA3;
                curM_parOmiga = this._parOmiga3;
                curM_huibaobi = this._huibaobi3;
                curM_kengdie = this._kengdie3;
                rateLevel = 5;
                break;
            default:
                break;
        }

        var pDeadFish = [];
        //srand(time(null));
        var ran = Math.random() * NUM_VALUE;
        if (ran <= curM_kengdie * NUM_VALUE) {
            return pDeadFish;
        } // if
        var consume = PlayerActor.sharedActor().getTotalConsume();
        var temporarilyRedound = curM_parA * Math.sin(curM_parOmiga * consume / rateLevel) + curM_huibaobi;
        var parQr = temporarilyRedound / (1.0 - curM_kengdie);
        var netExpectation = parQr * netActor.getCurWeaponLevel();
        var fishExpectationSum = 0;
        for (var i = 0; i < CollideFish.length; ++i) {
            fishExpectationSum += CollideFish[i].getExpectation();
        } // for
        if (netExpectation >= fishExpectationSum) {
            for (var o = 0; o < CollideFish.length; ++o) {
                var pFish = CollideFish[o];
                var winPercent = pFish.getExpectation() / pFish.getPrizeScore();
                var nPercent = winPercent * NUM_VALUE;
                var ran = Math.random() % NUM_VALUE;
                if (ran <= nPercent) {
                    pDeadFish.push(pFish);
                } // if

            } // for
        }
        else {
            for (var u = 0; u < CollideFish.length; ++u) {
                var pFish = CollideFish[u];
                var winPercent = pFish.getExpectation() * (netExpectation / fishExpectationSum) / pFish.getPrizeScore();
                var nPercent = winPercent * NUM_VALUE;
                var ran = Math.random() % NUM_VALUE;
                if (ran <= nPercent) {
                    pDeadFish.push(pFish);
                } // if
            }
        } // if
        return pDeadFish;
    },
    URLencode:function (strOriginal, StringEncoding) {

    },
    JSONLoaderDidLoad:function (result) {

    },
    JSONLoaderDidFailedLoad:function (error) {

    },
    requestGetVersionAndFileUrl:function (sgrURL) {

    },
    setCurFishExpection:function (idx) {

    },
    _kengdie:0,
    getKengDie:function () {
        return this._kengdie
    },
    setKengDie:function (_kengdie) {
        this._kengdie = _kengdie
    },
    _huibaobi:0,
    getHuiBaoBi:function () {
        return this._huibaobi
    },
    setHuiBaoBi:function (_huibaobi) {
        this._huibaobi = _huibaobi
    },
    _parA:0,
    getParA:function () {
        return this._parA
    },
    setParA:function (_parA) {
        this._parA = _parA
    },
    _parOmiga:0,
    getParOmiga:function () {
        return this._parOmiga
    },
    setParOmiga:function (_parOmiga) {
        this._parOmiga = _parOmiga
    },
    _kengdie2:0,
    getKengDie2:function () {
        return this._kengdie2
    },
    setKengDie2:function (_kengdie2) {
        this._kengdie2 = _kengdie2
    },
    _kengdie3:0,
    getKengDie3:function () {
        return this._kengdie3
    },
    setKengDie3:function (_kengdie3) {
        this._kengdie3 = _kengdie3
    },
    _huibaobi2:0,
    getHuiBaoBi2:function () {
        return this._huibaobi2
    },
    setHuiBaoBi2:function (_huibaobi2) {
        this._huibaobi2 = _huibaobi2
    },
    _huibaobi3:0,
    getHuiBaoBi3:function () {
        return this._huibaobi3
    },
    setHuiBaoBi3:function (_huibaobi3) {
        this._huibaobi3 = _huibaobi3
    },
    _parA2:0,
    getParA2:function () {
        return this._parA2
    },
    setParA2:function (_parA2) {
        this._parA2 = _parA2
    },
    _parA3:0,
    getParA3:function () {
        return this._parA3
    },
    setParA3:function (_parA3) {
        this._parA3 = _parA3
    },
    _parOmiga2:0,
    getParOmiga2:function () {
        return this._parOmiga2
    },
    setParOmiga2:function (_parOmiga2) {
        this._parOmiga2 = _parOmiga2
    },
    _parOmiga3:0,
    getParOmiga3:function () {
        return this._parOmiga3
    },
    setParOmiga3:function (_parOmiga3) {
        this._parOmiga3 = _parOmiga3
    },

    _fishExpection:null,
    getFishExpection:function () {
        return this._fishExpection
    },
    setFishExpection:function (_fishExpection) {
        this._fishExpection = _fishExpection
    },

    _fishExpection2:null,
    getFishExpection2:function () {
        return this._fishExpection2
    },
    setFishExpection2:function (_fishExpection2) {
        this._fishExpection2 = _fishExpection2
    },

    _fishExpection3:null,
    getFishExpection3:function () {
        return this._fishExpection3
    },
    setFishExpection3:function (_fishExpection3) {
        this._fishExpection3 = _fishExpection3
    },

    _pLocalData:null,
    getLocalData:function () {
        return this._pLocalData
    },
    setLocalData:function (_pLocalData) {
        this._pLocalData = _pLocalData
    },

    _strNewVersion:"",
    getNewVersion:function () {
        return this._strNewVersion
    },
    setNewVersion:function (_strNewVersion) {
        this._strNewVersion = _strNewVersion
    },

    _numVersion:0,
    getNumVersion:function () {
        return this._numVersion
    },
    setNumVersion:function (_numVersion) {
        this._numVersion = _numVersion
    },

    _strFileUrl:"",
    getFileUrl:function () {
        return this._strFileUrl
    },
    setFileUrl:function (_strFileUrl) {
        this._strFileUrl = _strFileUrl
    },

    _bCannotWriteToLocal:false,
    getCannotWriteToLocal:function () {
        return this._bCannotWriteToLocal
    },
    setCannotWriteToLocal:function (_bCannotWriteToLocal) {
        this._bCannotWriteToLocal = _bCannotWriteToLocal
    },

    _bTested:false,
    getTested:function () {
        return this._bTested
    },
    setTested:function (_bTested) {
        this._bTested = _bTested
    },

    sceneIdx:0,
    getSceneIdx:function () {
        return this.sceneIdx
    },
    setSceneIdx:function (sceneIdx) {
        this.sceneIdx = sceneIdx
    },
    _pJSONLoader:null,
    _deviceInfo:null
});
FishNetCollideHandler._pFishNetHandler = null;
FishNetCollideHandler.shareFishNetCollideHandler = function () {
    if (!this._pFishNetHandler) {
        this._pFishNetHandler = new FishNetCollideHandler();
        this._pFishNetHandler.setKengDie(0.05);
        this._pFishNetHandler.setHuiBaoBi(0.8);
        this._pFishNetHandler.setParA(0.3);
        this._pFishNetHandler.setParOmiga(Math.PI * 2 / 1400.0);
        this._pFishNetHandler.setCannotWriteToLocal(false);
    } // if
    return this._pFishNetHandler;
};