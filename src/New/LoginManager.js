/**
 * Created by eugeneseah on 14/11/16.
 */

var LoginManager = (function (){

    function LoginManager(parent) {
        this._parent = parent;
        cc.spriteFrameCache.addSpriteFrames(res.LoginUIPlist);
    }

    var proto = LoginManager.prototype;

    proto.goToLogin = function(){
        if (!this._view){
            console.log("goToLogin");
            this._view = new LoginView(this._parent);
            this.restoreLoginInfo();
        }
    };

    proto.getLogin = function () {
        return this._view.getLoginInfo();
    };

    proto.register = function(){

    };

    proto.restoreLoginInfo = function () {
        if (cc.sys.localStorage) {
            var old_username = cc.sys.localStorage.getItem('persistent_username');
            var old_password = cc.sys.localStorage.getItem('persistent_password');
            this._view.setLoginInfo(old_username, old_password);
        }
    };

    proto.saveLoginInfo = function () {
        if (cc.sys.localStorage) {
            var loginDetails = this._view.getLoginInfo();
            cc.sys.localStorage.setItem('persistent_username', loginDetails.name);
            cc.sys.localStorage.setItem('persistent_password', loginDetails.pass);
        }
    };

    proto.destroyView = function () {
        console.log("destroyView");
        this._parent.removeChild(this._view);
        this.view = null;
    };

    return LoginManager;
}());

