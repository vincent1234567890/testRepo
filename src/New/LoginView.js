/**
 * Created by eugeneseah on 14/11/16.
 */

var LoginView = (function() {

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
        //textName.setAnchorPoint(cc.p());
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

    };

    var proto = LoginView.prototype;

    proto.getLoginInfo = function () {
        var username = this.textName.getString();
        var password = this.textPass.getString();

        return {
            name: username,
            pass: password
        };
    };

    proto.setLoginInfo = function (name, pass) {
        this.textName.setString(name);
        this.textPass.setString(pass);
    };

    return LoginView;
}());

