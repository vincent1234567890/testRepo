/**
 * Created by eugeneseah on 14/11/16.
 */

var LoginManager = (function (){

    function LoginManager(parent) {
        this._parent = parent;
        cc.spriteFrameCache.addSpriteFrames(res.LoginUIPlist);

    };

    var proto = LoginManager.prototype;

    proto.goToLogin = function(){
        if (!this._view){
            this._view = new LoginView(this._parent);
        }
    };
    
    proto.getLogin = function () {
        return this._view.GetLoginInfo();
    };


    proto.register = function(){

    };

    return LoginManager;
}());

