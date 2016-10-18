var wrapper = {
    // UserDefaults
    getBooleanForKey:function (key, defaultValue) {
        return cc.sys.localStorage.getItem(key, defaultValue);
    },
    setBooleanForKey:function (key, value) {
        cc.sys.localStorage.getItem(key, value);
    },

    getFloatForKey:function (key, defaultValue) {
        return cc.sys.localStorage.getItem(key, defaultValue);
    },
    setFloatForKey:function (key, value) {
        cc.sys.localStorage.getItem(key, value);
    },

    getIntegerForKey:function (key, defaultValue) {
        return cc.sys.localStorage.getItem(key, defaultValue);
    },
    setIntegerForKey:function (key, value) {
        cc.sys.localStorage.getItem(key, value);
    },
    getStringForKey:function (key, defaultValue) {
        return cc.sys.localStorage.getItem(key, defaultValue);
    },
    setStringForKey:function (key, value) {
        cc.sys.localStorage.setItem(key, value);
    },
    setStringForKeyAsync:function (key, value) {
        this.setStringForKey(key, value);
    },
    logEvent:function (category, action, label, value) {
        try {
            //TODO:Setup own google analytics
            // _gaq.push(['_trackEvent', category, action, label, value]);
        }
        catch (e) {
            cc.log(e.message)
        }
    }
};



var DISABLE_ADS = false;

var AdsController = {
    interval:75,
    duration:15,
    /*interval:3,
     duration:1.5,*/
    initLocalData:function () {
        if (DISABLE_ADS) {
            return;
        }
    },
    getServerData:function () {
        if (DISABLE_ADS) {
            return;
        }
    },

    setAdsConfig:function (interval, duration) {
        if (DISABLE_ADS) {
            return;
        }

        this.interval = interval;
        this.duration = duration;
    },
    getAdsInterval:function () {
        return 75;//this.interval;
    },
    getAdsDuration:function () {
        return 15;//this.duration;
    },

    /**
     @brief 显示广告条
     @param type 用于游戏强制指定显示的广告条类型
     当 type 为 eADSTypeNone 时由服务器控制
     */
    showBannerAd:function (type) {
        if (DISABLE_ADS) {
            return;
        }

        if (BannerAdTyp.BannerAdGame == type) {
            var cureScene = GameCtrl.sharedGame().getCurScene();
            if (cureScene) {
                cureScene.actionForAdShow();
            }
        }
    },

    /**
     @brief 隐藏广告条
     @param type 用于游戏强制指定隐藏的广告条类型
     当 type 为 eBannerAdAll 时隐藏所有的广告条
     */
    hideBannerAd:function (type) {
        if (DISABLE_ADS) {
            return;
        }

        if (BannerAdTyp.BannerAdGame == type) {
            var cureScene = GameCtrl.sharedGame().getCurScene();
            if (cureScene) {
                cureScene.actionAfterAdHide();
            }
        }
    },


    // 显示游戏中广告时，界面动画播放完成了
    actionEnd:function (type) {
        if (type == 1) {
            cc.$("#ad").style.display = "block";
        }
        else {
            cc.$("#ad").style.display = "none";
        }
    },

    // 强制隐藏广告条（没有动画效果）
    forceHideBannerAd:function (type) {
        if (DISABLE_ADS) {
            return;
        }

        cc.$("#ad").style.display = "none";
    }
};

