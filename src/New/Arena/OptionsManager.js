/**
 * Created by eugeneseah on 17/11/16.
 */

var OptionsManager = (function (){

    var _settingsCallback;
    var _fishListCallBack;
    var _exitCallBack;

    function OptionsManager(parent, settingsCallback, fishListCallback, exitCallback) {
        _settingsCallback = settingsCallback;
        _fishListCallBack = fishListCallback;
        _exitCallBack = exitCallback;
        console.log("OptionsManager");
        cc.spriteFrameCache.addSpriteFrames(res.SideMenuPlist);
        this.view = new OptionsView(parent, onSettings, onFishList, onExitButton);
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
    
    OptionsManager.prototype.destroyView = function () {
        this.view.destroy();
    };

    return OptionsManager;
})();