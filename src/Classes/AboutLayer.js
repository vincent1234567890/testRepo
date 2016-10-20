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
    _touchListener: null,

    ctor: function(parentMenu) {
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(0, 0, 0, 200));

        cc.spriteFrameCache.addSpriteFrames(ImageName("about.plist"));
        this.parentMenu = parentMenu;
        //background
        this._bg = cc.Sprite.create(ImageName("ui_background_normal.jpg"));
        this.addChild(this._bg, 0);

        //title
        this._title = cc.Sprite.create(ImageNameLang("ab_ui_text_21.png"));
        this.addChild(this._title, 10);

        //back
        this._back = new cc.MenuItemSprite(new cc.Sprite("#ui_button_17.png"), new cc.Sprite("#ui_button_18.png"), this.goBackAnimation, this);

        var mBack = cc.Menu.create(this._back);
        this.addChild(mBack, 30);
        mBack.setPosition(cc.p(0, 0));

        this.credits = cc.Layer.create();
        this.addChild(this.credits);
        this.minY = VisibleRect.rect().height * 0.4;
        this.maxY = this.minY;
        this.speed = 40.0;
        this.isTouching = false;
        var x = VisibleRect.rect().width * 0.5;

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

        this._header = new cc.Sprite(("ui_box_08.png"));
        this._header.setAnchorPoint(cc.p(0.5, 1));
        this.addChild(this._header);

        this._footer = new cc.Sprite("ui_box_09.png");
        this._footer.setAnchorPoint(cc.p(0.5, 0));
        this.addChild(this._footer);

        this.parentMenu.setTouchEnabled(false);
        //todo event manager
        this.setKeyboardEnabled(true);

        this.resetAllSpritePos();

        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function (touch, event) {
                var target = event.getCurrentTarget();
                target.speed = 0;
                target.isTouching = true;
                target.timestamp = Date.now();
                var location = touch.getLocation();
                target.lastPos = location.y;
                return true;
            },
            onTouchMoved:function (touch, event) {
                var target = event.getCurrentTarget();
                var previousLocation = touch.getPreviousLocation();
                var location = touch.getLocation();

                var deltaY = location.y - previousLocation.y;
                var p = target.credits.getPosition();
                var x = p.x;
                var y = p.y + deltaY;

                if (y > target.maxY) y = target.maxY;
                if (y < target.minY) y = target.minY;

                target.credits.setPosition(cc.p(x, y));

                var interval = target.getTimeInterval(target.timestamp);
                if (interval > 0.2) {
                    target.timestamp = Date.now();
                    target.lastPos = location.y;
                }
            },
            onTouchEnded:function (touch, event) {
                var target = event.getCurrentTarget();
                var location = touch.getLocation();
                target.speed = (location.y - target.lastPos) / target.getTimeInterval(target.timestamp) / 4.0;
                target.isTouching = false;
            }
        });

        var that = this;
        window.addEventListener("resize", function (event) {
            that.resetAllSpritePos();
        });
    },

    onEnter:function () {
        this._super();
        this.schedule(this.updateList);

        if (this._touchListener && !this._touchListener._isRegistered())
            cc.eventManager.addListener(this._touchListener, this);
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
        cc.spriteFrameCache.removeSpriteFrameByName(ImageName("about.plist"));
        this.parentMenu.setTouchEnabled(true);
        this.parentMenu._isSubLayer = false;
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParent(true);
    },
    goBackAnimation:function () {
        this.parentMenu.setTouchEnabled(true);
        var children = this.credits.getChildren();
        for (var i = 0; i < children.length; i++) {
            children[i].runAction(cc.fadeOut(0.3));
        }

        this.runAction(cc.sequence(cc.fadeOut(0.4), cc.callFunc(this.goBack, this)));
    },
    getTimeInterval:function (beforeTime) {
        return (Date.now() - beforeTime) / 1000.0;
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