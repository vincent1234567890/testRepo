var TutorialConfirmLayer = cc.LayerColor.extend({
    _cancelSelector:null,
    _active:null,
    _delegate:null,
    _selector:null,
    _textLabel:null,
    _titleLabel:null,
    _backgroundSprite:null,
    getBackgroundSprite:function () {
        return this._backgroundSprite;
    },
    setBackgroundSprite:function (v) {
        this._backgroundSprite = v;
    },
    getTextLabel:function () {
        return this._textLabel;
    },
    setTextLabel:function (v) {
        this._textLabel = v;
    },
    initWithTitle:function (title, text, imageName, confirmImage, selectedImage, confirmAction, cancelAction, deleagte, selector, cancelSelector) {
        var a = new cc.Color4B(10, 10, 10, 100);
        this.initWithColor(a);

        //this.setTouchEnabled(true);
        this._active = false;
        this._delegate = deleagte;
        this._selector = selector;
        this._cancelSelector = cancelSelector;

        this.setBackgroundSprite(cc.Sprite.createWithSpriteFrameName(imageName));
        this.addChild(this.getBackgroundSprite());
        var backSize = this.getBackgroundSprite().getContentSize();

        var textPos = cc.pAdd(cc.p(backSize.width / 2, backSize.height / 2), cc.p(-20, -40));
        this.setTextLabel(cc.LabelTTF.create(text, "Microsoft YaHei", 20, new cc.Size(backSize.width / 2, backSize.height / 2), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER));
        this.getTextLabel().setPosition(textPos);
        this.getBackgroundSprite().addChild(this.getTextLabel());

        this.getBackgroundSprite().setAnchorPoint(cc.p(0.5, 0.5));

        this.getBackgroundSprite().setPosition(cc.p(VisibleRect.center().x, screenHeight / 2 + backSize.height / 10));

        var btnFontSize = 16;
        var confirmPosOffset = cc.p(164, 22);
        var cancelPosOffset = cc.p(88, -22);

        var confirm = cc.Sprite.createWithSpriteFrameName(confirmImage);
        var confirmLabel = cc.LabelTTF.create(confirmAction, "Microsoft YaHei", btnFontSize);
        confirmLabel.setAnchorPoint(cc.p(0.5, 0.5));
        confirmLabel.setPosition(cc.p(confirm.getContentSize().width / 2, confirm.getContentSize().height / 2));
        confirm.addChild(confirmLabel);

        var selectedSprite = cc.Sprite.createWithSpriteFrameName(selectedImage);
        var selectedLabel = cc.LabelTTF.create(confirmAction, "Microsoft YaHei", btnFontSize);
        selectedLabel.setPosition(cc.p(selectedSprite.getContentSize().width / 2, selectedSprite.getContentSize().height / 2));
        selectedSprite.addChild(selectedLabel);

        var menuItem = cc.MenuItemSprite.create(confirm, selectedSprite, this, this.dismiss);
        var confirmPos = cc.pSub(cc.p(backSize.width / 2, confirm.getContentSize().height), confirmPosOffset);
        menuItem.setPosition(confirmPos);

        var cancel = cc.Sprite.createWithSpriteFrameName(confirmImage);
        var cancelLabel = cc.LabelTTF.create(cancelAction, "Microsoft YaHei", btnFontSize);
        cancelLabel.setAnchorPoint(cc.p(0.5, 0.5));
        cancelLabel.setPosition(cc.p(confirm.getContentSize().width / 2, confirm.getContentSize().height / 2));
        cancel.addChild(cancelLabel);

        var selectedSprite0 = cc.Sprite.createWithSpriteFrameName(selectedImage);
        var selectedLabel0 = cc.LabelTTF.create(cancelAction, "Microsoft YaHei", btnFontSize);
        selectedLabel0.setPosition(cc.p(selectedSprite0.getContentSize().width / 2, selectedSprite0.getContentSize().height / 2));
        selectedSprite0.addChild(selectedLabel0);

        var cancelItem = cc.MenuItemSprite.create(cancel, selectedSprite0, this, this.cancel);
        var cancelPos = cc.pAdd(cc.p(backSize.width / 2, confirm.getContentSize().height), cancelPosOffset);
        cancelItem.setPosition(cancelPos);
        var menu = cc.Menu.create(menuItem, cancelItem);
        menu.setPosition(0, 0);
        this.getBackgroundSprite().addChild(menu);

        this.setVisible(false);
        this.setPosition(0, 0);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        return true;
    },
    dismiss:function (pSender) {
        if (!this._active) {
            return;
        }

        if (this._delegate) {
            this._selector.call(this._delegate);
        }
    },
    /*registerWithTouchDispatcher:function () {
     cc.Director.getInstance().getTouchDispatcher().addStandardDelegate(this, cc.MENU_HANDLER_PRIORITY);
     },*/
    hide:function () {
        this._active = false;
        var moveAction = cc.MoveTo.create(0.3, cc.p(this.getContentSize().width / 2, this.getContentSize().height + this.getBackgroundSprite().getContentSize().height));
        var easeIn = cc.EaseExponentialIn.create(moveAction);
        var call = cc.CallFunc.create(this, this.removeSelf);
        var sequnce = cc.Sequence.create(easeIn, call);

        this.getBackgroundSprite().runAction(sequnce);
    },
    endWithCancel:function () {
        this.removeFromParentAndCleanup(true);
        if (this._delegate) {
            this._cancelSelector.call(this._delegate);
        }
    },
    cancel:function (pSender) {
        if (!this._active) {
            return;
        }

        if (this._delegate) {
            this._cancelSelector.call(this._delegate);
        }
    },
    activate:function () {
        this._active = true;
    },
    show:function () {
        this.setVisible(true);
        var moveAction = cc.MoveTo.create(0.3, VisibleRect.center());
        var easeOut = cc.EaseExponentialOut.create(moveAction);
        var call = cc.CallFunc.create(this, this.activate);

        this.getBackgroundSprite().runAction(cc.Sequence.create(easeOut, call));
    },
    removeSelf:function () {
        this.removeFromParentAndCleanup(true);
    },
    onTouchBegan:function (touch, event) {
        return true;
    },
    onTouchMoved:function (touch, event) {
    },
    onTouchEnded:function (touch, event) {
    }
});