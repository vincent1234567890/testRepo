var UserInfoLayer = cc.Layer.extend({
    _userTitleLabelL:null,
    _processsprite:null,
    _delegate:null,
    _btnShowAchievements:null,
    _namelabel:null,
    _levellabel:null,
    _bgSprite:null,
    _curTitle:null,
    _curLevel:null,
    _loadFromCCBCompleted:false,
    _menuAchieve:null,
    init:function () {
        if (this._super()) {
            var frameCache = cc.spriteFrameCache;
            frameCache.addSpriteFrames(ImageNameLang("ui_textbox_30.plist"));

            this._curTitle = ImageNameLang(PlayerActor.sharedActor().title(), true);
            this._bgSprite = new cc.Sprite("#ui_box_01.png");
            this._bgSprite.setAnchorPoint(AnchorPointTop);
            this._bgSprite.setPosition(VisibleRect.top());
            this.addChild(this._bgSprite);

            var menuAchieve = new cc.MenuItemSprite(new cc.Sprite("#ui_box_01-0.png"),
                new cc.Sprite("#ui_box_01-1.png"), this.showAchievements, this);
            this._menuAchieve = new cc.Menu(menuAchieve);
            this._menuAchieve.setPosition(cc.pAdd(VisibleRect.top(), cc.p(0, -28)));
            this.addChild(this._menuAchieve);

            this.setUserTitleLabel(new cc.Sprite("#" + this._curTitle));
            this._userTitleLabel.setPosition(cc.p(VisibleRect.top().x - 130, VisibleRect.top().y - 26));

            this._curLevel = 1;

            this._levellabel = new cc.LabelAtlas("1", ImageName("ui_text_03.png"), 14, 20, '0');
            this.addChild(this._levellabel, 200);
            this._levellabel.setAnchorPoint(cc.p(0.5, 0.5));
            this._levellabel.setPosition(cc.pAdd(VisibleRect.top(), cc.p(0, -28)));


            var processDef = ProcessDef.defaultDef();
            processDef.setOffset(cc.Size(0.5, 0.5));
            var tempPS = new ProcessSprite();
            this.setProcesssprite(tempPS);
            this._processsprite.initWithDef(processDef);
            this._processsprite.setPosition(cc.p(VisibleRect.top().x + 156, VisibleRect.top().y - 24));
            this.addChild(this._processsprite);

            this._loadFromCCBCompleted = true;
        }
        return true;
    },
    showAchievements:function (sender) {

    },
    updateUserInfo:function () {
        if (!this._loadFromCCBCompleted) return;

        var sharedActor = PlayerActor.sharedActor();
        var title = sharedActor.title();
        this.newTitle();

        if (this._curTitle != title) {
            var tempSprite = new cc.Sprite("#" + ImageNameLang(title, true));
            tempSprite.setPosition(cc.pSub(VisibleRect.top(), cc.p(130, 26)));
            this.setUserTitleLabel(tempSprite);
            this._curTitle = title;
        }
        var level = sharedActor.getPlayerLevel();
        if (level != this._curLevel) {
            this._levellabel.setString(level+"");
            this._curLevel = level;
        }

        var processdef = this._processsprite.getProcessDef();
        processdef.setTotalValue(sharedActor.getNextExp() - sharedActor.getPreviousExp());
        processdef.setCurrentValue(sharedActor.getTotalGain() - sharedActor.getPreviousExp());
        this._processsprite.updatePosition();
    },

    newTitle:function () {
    },
    levelUp:function () {
    },
    getUserTitleLabel:function () {
        return this._userTitleLabel;
    },
    setUserTitleLabel:function (titleLabel) {
        if (titleLabel != this._userTitleLabel) {
            if (this._userTitleLabel) {
                this._userTitleLabel.removeFromParentAndCleanup(true);
            }
            this._userTitleLabel = titleLabel;
            if (this._userTitleLabel) {
                this.addChild(this._userTitleLabel);
            }
        }
    },
    getProcesssprite:function () {
        return this._processsprite;
    },
    setProcesssprite:function (v) {
        this._processsprite = v;
    },
    didLoadFromCCB:function () {
        this.init();
        this._loadFromCCBCompleted = true;
    },
    setDelegate:function (delegate) {
        this._delegate = delegate;
    }
});

UserInfoLayer.create = function () {
    var pLayer = new UserInfoLayer();
    pLayer.init();

    return pLayer;
};


UserInfoLayer.createInstance = function () {
    return new UserInfoLayer();
};