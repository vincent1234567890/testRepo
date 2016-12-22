/**
 * Created by eugeneseah on 14/11/16.
 */

var LoginView = (function() {

    var LoginView = function () {

        // this._parent = parent;
        this.parent = new cc.Node();

        var midX = cc.view.getDesignResolutionSize().width / 2;
        var midY = cc.view.getDesignResolutionSize().height / 2;

        //var frame = cc.spriteFrameCache.getSpriteFrame(ReferenceName.Login9Slice);
        var sprite = new cc.Scale9Sprite(ReferenceName.Login9Slice);
        sprite.setAnchorPoint(0.0,0.0);

        var textName = new cc.EditBox(cc.size(300,70), sprite);
        textName.setPlaceHolder(ReferenceName.LoginNamePlaceHolder);
        textName.setPosition(midX, midY + 100);
        textName.setFontSize(40);
        textName.setPlaceholderFontSize(40);
        //textName.setAnchorPoint(cc.p());
        textName.needsLayout();
        this.parent.addChild(textName);
        this.textName = textName;

        var textPass = new cc.EditBox(cc.size(300,70), new cc.Scale9Sprite(ReferenceName.Login9Slice));
        textPass.setPlaceHolder(ReferenceName.LoginPassPlaceHolder);
        textPass.setPosition(midX, midY + 14);
        textPass.setFontSize(40);
        textPass.setPlaceholderFontSize(40);
        textPass.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        textPass.needsLayout();
        this.parent.addChild(textPass);
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

    proto.getView = function () {
        return this.parent;
    }

    return LoginView;
}());

