/**
 * Created by eugeneseah on 14/11/16.
 */

let LoginManager = (function (){

    let _view;

    function LoginManager() {
        this._parent = new cc.Node();
        cc.spriteFrameCache.addSpriteFrames(res.LoginUIPlist);
    }

    let proto = LoginManager.prototype;

    proto.goToLogin = function(){
        if (!_view){
            // console.log("goToLogin");
            _view = new LoginView();
            restoreLoginInfo();
        }
        return _view.getView();
    };

    proto.getLoginInfo = function () {
        return _view.getLoginInfo();
    };

    proto.register = function(){

    };

    const restoreLoginInfo = function () {
        let data = PlayerPreferences.getLoginDetails();
        if (data){
            _view.setLoginInfo(data.username, data.password);
        }
    };

    proto.saveLoginInfo = function () {
        let loginDetails = _view.getLoginInfo();
        PlayerPreferences.setLoginDetails(loginDetails);
    };

    // proto.getView = function () {
    //     return _view.getView();
    // };

    proto.destroyView = function () {
        // console.log("destroyView");
        this._parent.removeChild(_view);
        _view = null;
    };

    return LoginManager;
}());

