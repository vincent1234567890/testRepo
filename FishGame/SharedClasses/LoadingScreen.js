cc.LoadingScreen = cc.Class.extend(/**  @lends cc.LoaderScene# */{
    _delegate:null,
    _con:null,
    ctor:function () {
        var loadingAd = cc.$("#loadingAd");
        this._delegate  = cc.$("#Percent");


        var s = AutoAdapterScreen.getInstance().getWinSize();

        loadingAd.style.display = "block";
        loadingAd.style.left = s.width/2 + "px";

        var KingFisher = document.querySelector("#KingFisher");

        if (KingFisher) {
            KingFisher.style.width = s.width + "px";
            KingFisher.style.height = s.height + "px";
        }


    },

    /**
     * Draw loading screen
     */
    draw:function () {
        this._delegate.innerHTML = "Loading... " + cc.Loader.getInstance().getProgressBar() + "%";
    },
    removeSelft:function(){
        cc.$("#loadingAd").style.display = "none";
    }
});

/**
 * Shared loader scene
 * @return {cc.LoaderScene}
 */
cc.LoadingScreen.getInstance = function () {
    if (!this._instance) {
        this._instance = new cc.LoadingScreen();
    }
    return this._instance;
};

cc.LoadingScreen._instance = null;