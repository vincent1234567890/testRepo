/**
 * Created by eugeneseah on 14/11/16.
 */

var LoginView = function() {

    var LoginView = function ( parent) {

        this._parent = parent;


        var midX = cc.view.getDesignResolutionSize().width / 2;
        var midY = cc.view.getDesignResolutionSize().height / 2;

        var frame = cc.spriteFrameCache.getSpriteFrame(ReferenceName.Login9Slice);
        var sprite = new cc.Scale9Sprite(frame );
        sprite.setAnchorPoint(0.0,0.0);

        var textName = new cc.EditBox(cc.size(300,70), sprite);
        textName.setPosition(midX,midY+100);
        textName.setFontSize(50);
        textName.setPlaceholderFontSize(50);
        textName.setPlaceHolder(ReferenceName.LoginNamePlaceHolder);
        textName.setAnchorPoint(cc.p());
        textName.needsLayout();
        this._parent.addChild(textName);
        this.textName = textName;

        var textPass = new cc.EditBox(cc.size(300,70), new cc.Scale9Sprite(ReferenceName.Login9Slice));
        textPass.setPlaceHolder(ReferenceName.LoginPassPlaceHolder);
        textPass.setPosition(midX,midY);
        textPass.setFontSize(50);
        textPass.setPlaceholderFontSize(50);
        textPass.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._parent.addChild(textPass);
        this.textPass = textPass;

        if (cc.sys.localStorage) {
            var old_username = cc.sys.localStorage.getItem('persistent_username');
            if (old_username) {
                textName.setString(old_username);
            }
            var old_password = cc.sys.localStorage.getItem('persistent_password');
            if (old_password) {
                textPass.setString(old_password);
            }
        }
    };

    var proto = LoginView.prototype;

    proto.GetLoginInfo = function () {
        var username = this.textName.getString();
        var password = this.textPass.getString();

        if (cc.sys.localStorage) {
            cc.sys.localStorage.setItem('persistent_username', username);
            cc.sys.localStorage.setItem('persistent_password', password);
        }

        return {
            name: username,
            pass: password
        };
    };

    return LoginView;
}();

