var TutorialHintLayer = cc.Layer.extend({
    hint:null,
    hintFile:null,
    aDelegate:null,
    callBackSel:null,
    canClose:false,
    getCanClose:function () {
        return this.canClose;
    },
    setCanClose:function (v) {
        this.canClose = v;
    },

    initWithHintFile:function (fileName, delegate, sel) {
        if (this.init()) {
            this.aDelegate = delegate;
            this.hintFile = fileName;
            this.callBackSel = sel;
            this.initViews();
            this.canClose = false;
            return true;
        }

        return false;
    },
    onEnter:function () {
        this._super();
        this.runAction(cc.Sequence.create(cc.DelayTime.create(3),
            cc.CallFunc.create(this, this.permitClose)));
    },
    setVisible:function (v) {
        this._super();
        this.canClose = false;
        this.runAction(cc.Sequence.create(cc.DelayTime.create(3),
            cc.CallFunc.create(this, this.permitClose)));
    },
    permitClose:function () {
        this.canClose = true;
    },
    initViews:function () {
        var winSize = cc.Director.getInstance().getWinSize();
        var bg = cc.Sprite.createWithSpriteFrameName(("ui_other_021.png"));
        var bgSizeHalf = bg.getContentSize();
        bgSizeHalf.width /= 2;
        bgSizeHalf.height /= 2;

        this.addChild(bg);
        bg.setPosition(VisibleRect.center());

        this.hint = cc.LabelTTF.create(this.hintFile, "Arial", 32, new cc.Size(320, 150), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER); //todo(cjh) need to modify position

        bg.addChild(this.hint);
        this.hint.setPosition(cc.p(bgSizeHalf.width, bgSizeHalf.height));

        var close = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("button_other_012.png"),
            cc.Sprite.createWithSpriteFrameName("button_other_013.png"),
            this,
            this.clickClose);

        var fish = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("button_help_02.png"),
            cc.Sprite.createWithSpriteFrameName("button_help_02.png"),
            this,
            this.clickFish);

        var menu = cc.Menu.create(close, fish);
        menu.setPosition(cc.PointZero());
        close.setPosition(cc.p(bgSizeHalf.width * 2, bgSizeHalf.height * 2));
        var fishSize = fish.getContentSize();
        fish.setPosition(cc.p(bgSizeHalf.width * 2 - fishSize.width, fishSize.height / 2));
        bg.addChild(menu);
    },
    clickClose:function (sender) {
        if (this.aDelegate != null) {
            this.callBackSel.call(this.aDelegate);
        }

        this.removeAllChildrenWithCleanup(true);
        this.removeFromParentAndCleanup(true);
    },
    clickFish:function (sender) {
    }
});



