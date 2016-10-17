var FRICTION = 10.0;
var MAXSPEED = 300;

var AboutLayer = cc.LayerColor.extend({
    lastPos:null,
    speed:null,
    maxY:null,
    minY:null,
    isTouching:null,
    timestamp:null,
    credits:null,
    parentMenu:null,
    _bg:null,
    _title:null,
    _back:null,
    _header:null,
    _footer:null,
    onEnter:function () {
        this._super();
        this.schedule(this.updateList);
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, false);
    },
    onExit:function () {
        this._super();
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(true);
    },
    onTouchBegan:function (touch, event) {
        this.speed = 0;
        this.isTouching = true;
        this.timestamp = cc.Time.gettimeofdayCocos2d();
        var location = touch.getLocation();
        this.lastPos = location.y;
        return true;
    },
    onTouchMoved:function (touch, event) {
        var previousLocation = touch.getPreviousLocation();
        var location = touch.getLocation();

        var deltaY = location.y - previousLocation.y;
        var p = this.credits.getPosition();
        var x = p.x;
        var y = p.y + deltaY;

        if (y > this.maxY) y = this.maxY;
        if (y < this.minY) y = this.minY;

        this.credits.setPosition(cc.p(x, y));

        var interval = this.getTimeInterval(this.timestamp);
        if (interval > 0.2) {
            this.timestamp = cc.Time.gettimeofdayCocos2d();
            this.lastPos = location.y;
        }
    },
    onTouchEnded:function (touch, event) {
        var location = touch.getLocation();
        this.speed = (location.y - this.lastPos) / this.getTimeInterval(this.timestamp) / 4.0;

        this.isTouching = false;
    },
    initWithParentMenu:function (_parentMenu) {
        if (this.initWithColor(cc.c4(0, 0, 0, 200))) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(ImageName("about.plist"));
            this.parentMenu = _parentMenu;
            //background
            this._bg = cc.Sprite.create(ImageName("ui_background_normal.jpg"));
            this.addChild(this._bg, 0);

            //title
            this._title = cc.Sprite.create(ImageNameLang("ab_ui_text_21.png"));
            this.addChild(this._title, 10);

            //back
            this._back = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_17.png"), cc.Sprite.createWithSpriteFrameName("ui_button_18.png"), this, this.goBackAnimation);

            var mBack = cc.Menu.create(this._back);
            this.addChild(mBack, 30);
            mBack.setPosition(cc.p(0, 0));

            this.credits = cc.Layer.create();
            this.addChild(this.credits);
            this.minY = VisibleRect.rect().size.height * 0.4;
            this.maxY = this.minY;
            this.speed = 40.0;
            this.isTouching = false;
            var x = VisibleRect.rect().size.width * 0.5;

            var pos = cc.p(x, 0);
            var creadit = cc.Sprite.create(ImageNameLang("ui_text_41.png"));
            creadit.setAnchorPoint(cc.p(0.5, 1));
            creadit.setPosition(pos);
            this.maxY += creadit.getContentSize().height;
            this.credits.addChild(creadit);

            pos = cc.pAdd(pos, cc.p(0, -creadit.getContentSize().height));
            creadit = cc.Sprite.create(ImageNameLang("ui_text_42.png"));
            creadit.setAnchorPoint(cc.p(0.5, 1));
            creadit.setPosition(pos);
            this.maxY += creadit.getContentSize().height;
            this.credits.addChild(creadit);

            pos = cc.pAdd(pos, cc.p(0, -creadit.getContentSize().height));
            creadit = cc.Sprite.create(ImageNameLang("ui_text_43.png"));
            creadit.setAnchorPoint(cc.p(0.5, 1));
            creadit.setPosition(pos);
            this.maxY += creadit.getContentSize().height;
            this.credits.addChild(creadit);

            this._header = cc.Sprite.createWithSpriteFrameName(("ui_box_08.png"));
            this._header.setAnchorPoint(cc.p(0.5, 1));
            this.addChild(this._header);

            this._footer = cc.Sprite.createWithSpriteFrameName(("ui_box_09.png"));
            this._footer.setAnchorPoint(cc.p(0.5, 0));
            this.addChild(this._footer);

            this.parentMenu.setTouchEnabled(false);
            this.setKeyboardEnabled(true);
            this.setTouchEnabled(true);

            this.resetAllSpritePos();

            var that = this;
            window.addEventListener("resize", function (event) {
                that.resetAllSpritePos();
            });

            return true;
        }
        return false;
    },

    updateList:function (dt) {
        if (this.isTouching)
            return;

        var p = this.credits.getPosition();
        var x = p.x;
        var y = p.y + dt * this.speed;

        if (y > this.maxY) y = this.maxY;
        if (y < this.minY) y = this.minY;

        this.credits.setPosition(cc.p(x, y));
    },
    goBack:function (sender) {
        cc.SpriteFrameCache.getInstance().removeSpriteFrameByName(ImageName("about.plist"));
        this.parentMenu.setTouchEnabled(true);
        this.parentMenu._isSubLayer = false;
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParentAndCleanup(true);
    },
    goBackAnimation:function () {
        this.parentMenu.setTouchEnabled(true);
        var children = this.credits.getChildren();
        for (var i = 0; i < children.length; i++) {
            children[i].runAction(cc.FadeOut.create(0.3));
        }

        this.runAction(
            cc.Sequence.create(cc.FadeOut.create(0.4), cc.CallFunc.create(this, this.goBack)
            ));
    },
    getTimeInterval:function (beforeTime) {
        var now = cc.Time.gettimeofdayCocos2d();
        var dt = (now.tv_sec - beforeTime.tv_sec) + (now.tv_usec - beforeTime.tv_usec) / 1000000.0;
        return dt;
    },
    resetAllSpritePos:function () {
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._bg.setScale(Multiple);
        this._bg.setPosition(VisibleRect.center());

        this._header.setScale(Multiple);
        this._header.setPosition(VisibleRect.top());

        this._footer.setScale(Multiple);
        this._footer.setPosition(VisibleRect.bottom());

        this._title.setPosition(cc.p(VisibleRect.top().x, VisibleRect.top().y - 15 - this._title.getContentSize().height / 2));
        this._back.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(73, -38)));
    }
});

AboutLayer.create = function (parentMenu) {
    var ret = new AboutLayer();
    if (ret.initWithParentMenu(parentMenu)) {
        return ret;
    }
};