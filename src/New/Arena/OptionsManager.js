/**
 * Created by eugeneseah on 17/11/16.
 */

const OptionsManager = (function (){

    let _settingsCallback;
    let _fishListCallBack;
    let _exitCallBack;
    // let _parent;

    function OptionsManager(settingsCallback, fishListCallback, exitCallback) {
        // _parent = new cc.Node();
        _settingsCallback = settingsCallback;
        _fishListCallBack = fishListCallback;
        _exitCallBack = exitCallback;
        // cc.spriteFrameCache.addSpriteFrames(res.SideMenuPlist);
        cc.spriteFrameCache.addSpriteFrames(res.BottomMenuPlist);
        cc.spriteFrameCache.addSpriteFrames(res.SettingUIPlist);

        // this.view = new OptionsSideMenuView(onSettings, onFishList, onExitButton);

        // if (gameConfig && gameConfig.isUsingOldCannonPositions)
        //     this.view = new OptionsSideMenuView(parent, onSettings, onFishList, onExitButton);
        // else{
        //     this.view = new OptionsMenuViewBottom(parent, onSettings, onFishList, onExitButton);
        // }

    }

    function onSettings(){
        if (_settingsCallback) {
            _settingsCallback();
        }
    }

    function onFishList(){
        if (_fishListCallBack) {
            _fishListCallBack();
        }
    }

    function onExitButton(){
        if (_exitCallBack) {
            _exitCallBack ();
        }
    }

    const proto = OptionsManager.prototype;

    proto.destroyView = function () {
        if (this._view)
            this._view.destroy();
            this._view = null;
        if(this._settingsView){
            this._settingsView.destroyView();
            this._settingsView = null;
        }
    };

    proto.showSettings = function(){
        if (!this._settingsView)
            this._settingsView = new OptionsView();
        else{
            this._settingsView.show();
        }
    };

    proto.displayView = function (gameConfig) {
        if (gameConfig && gameConfig.isUsingOldCannonPositions)
            this._view = new OptionsSideMenuView(onSettings, onFishList, onExitButton);
        else{
            this._view = new OptionsMenuViewBottom(onSettings, onFishList, onExitButton);
        }
    };



    return OptionsManager;
})();