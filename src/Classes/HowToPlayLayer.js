var HELP_PAGE_NUM = 6;
var PAGE_SCALE_FACTOR = 0.7;

var HowToPlayLayer = cc.Layer.extend({
    _currentPage:0,
    _helpImages:0,
    _touchBegan:null,
    _helpLayer:null,
    _curPageIndicator:null,
    _dragSpeed:0,
    scissor:null,
    _returnButton:null,
    _bg:null,
    ctor:function () {
        this._curPageIndicator = [];
    },

    init:function (){
        this._super();
        this._helpImages = [];
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, cc.MENU_HANDLER_PRIORITY - 50, false);
        return true;
    },
    onEnter:function(){
        this._super();
        this.setKeyboardEnabled(true);
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(ImageNameLang("StageSelectLayer.plist"));
        cache.addSpriteFrames(ImageNameLang("tutorial_uibox.plist"));

        this.drawBackGround();
        this.drawHelpImages();
        this.drawReturnButton();


        var that = this;
        window.addEventListener("resize", function(event){
            that.resetAllSpritePos();
        });
    },
    onExit:function(){
        this._super();
        var cache = cc.spriteFrameCache;
        cache.removeSpriteFrameByName(ImageNameLang("StageSelectLayer.plist"));
        cache.removeSpriteFrameByName(ImageNameLang("tutorial_uibox.plist"));
    },
    back:function (object) {
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParentAndCleanup(true);
        var main = GameCtrl.sharedGame().getCurScene();
        if (main) {
            main.setIsSubLayer(false);
        }
    },
    onTouchBegan:function (touch, event) {
        this._touchBegan = touch.getLocation();
        return true;
    },
    onTouchMoved:function (touch, event) {
        var touchPoint = touch.getLocation();
        var touchEnd = touch.getPreviousLocation();

        var offsetX = touchPoint.x - touchEnd.x;
        var layerX = this._helpLayer.getPosition().x + offsetX;

        this._helpLayer.setPosition(cc.p(layerX, this._helpLayer.getPosition().y));
    },
    onTouchEnded:function (touch, event) {
        var touchPoint = touch.getLocation();
        var distance = this._touchBegan.x - touchPoint.x;
        var wp = this.getChildByTag(999);
        if (Math.abs(distance) > 40 && this._helpLayer.getPosition().x <= 0 && this._helpLayer.getPosition().x >= -wp.getContentSize().width * PAGE_SCALE_FACTOR * (HELP_PAGE_NUM - 1)) {
            if (distance < 0) {
                this.movePageLeft();
            }
            else {
                this.movePageRight();
            }
        }
        else {
            var x = -(this._currentPage * wp.getContentSize().width * PAGE_SCALE_FACTOR);
            var Move = cc.MoveTo.create(0.2, cc.p(x, this._helpLayer.getPosition().y));
            var call = cc.CallFunc.create(this, this.updateIndicators);
            this._helpLayer.runAction(cc.Sequence.create(Move, call));
        }
    },
    getCurrentPage:function () {
        return this._currentPage;
    },
    setCurrentPage:function (curIndex) {
        this._currentPage = curIndex;
    },
    drawBackGround:function () {
        this._bg = cc.Sprite.create(ImageName("ui_background_normal.jpg"));
        this.addChild(this._bg, 7);
        this._bg.setScale(Multiple);
        this._bg.setPosition(VisibleRect.center());
    },
    drawHelpImages:function () {
        var clipLayer = HelpImagesLayer.create();
        this.addChild(clipLayer, 10,998);
        this._helpLayer = cc.Layer.create();
        clipLayer.setAnchorPoint(AnchorPointCenter);
        clipLayer.setPosition(VisibleRect.center());
        clipLayer.addChild(this._helpLayer, 9, 30);
        clipLayer.ignoreAnchorPointForPosition(false);

        var Box = cc.Sprite.create(ImageName("htp_ui_box_17.png"));
        Box.setPosition(VisibleRect.center());
        Box.setScale(PAGE_SCALE_FACTOR);
        this.addChild(Box, 10, 999);

        var scaleXNum = PAGE_SCALE_FACTOR * Box.getContentSize().width / 1280;
        var scaleYNum = PAGE_SCALE_FACTOR * Box.getContentSize().height / 800;
        for (var i = 1; i <= HELP_PAGE_NUM; i++) {
            var page = cc.Sprite.create(ImageName("bj01_01.jpg"));
            page.setScaleX(scaleXNum);
            page.setScaleY(scaleYNum);
            StaticGameUI.dowsStaticGameUI(page, PAGE_SCALE_FACTOR);

            var tutorial = cc.Sprite.createWithSpriteFrameName(ImageNameLang("tutorial_ui_text_3" + i + ".png", true));
            this._helpLayer.addChild(page);
            this._helpLayer.addChild(tutorial);
            var tmpSize = Box.getContentSize();
            tutorial.setPosition(cc.p((i - 0.5) * tmpSize.width * PAGE_SCALE_FACTOR, tmpSize.height * PAGE_SCALE_FACTOR / 2));
            page.setPosition(cc.p((i - 0.5) * tmpSize.width * PAGE_SCALE_FACTOR, tmpSize.height * PAGE_SCALE_FACTOR / 2));

            var btnPageIndicator = cc.MenuItemToggle.create(
                cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("UI_select_slider_2.png"),
                    cc.Sprite.createWithSpriteFrameName("UI_select_slider_1.png")),
                this, this.indicatorClick);
            var btnPageIndicatorStartPosX = VisibleRect.center().x - (PAGE_INDICATOR_INTERVAL * (HELP_PAGE_NUM - 1) / 2.0);
            btnPageIndicator.setPosition(cc.p(btnPageIndicatorStartPosX + (i - 1) * PAGE_INDICATOR_INTERVAL, VisibleRect.bottom().y + 30));

            this.addChild(btnPageIndicator, 8, i * 30 + i);
            this._curPageIndicator[i - 1] = btnPageIndicator;
            if (1 == i) {
                btnPageIndicator.selected();
            }
            else {
                btnPageIndicator.unselected();
            }
        }
        var size = new cc.Size(Box.getContentSize().width * PAGE_SCALE_FACTOR - 10, Box.getContentSize().height * PAGE_SCALE_FACTOR);

        clipLayer.setContentSize(size);
    },
    drawReturnButton:function () {
        this._returnButton = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_17.png")
            , cc.Sprite.createWithSpriteFrameName("ui_button_18.png"), this, this.back);
        var mBack = cc.Menu.create(this._returnButton);
        this.addChild(mBack, 30);
        mBack.setPosition(cc.p(0, 0));
        this._returnButton.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(73, -38)));
    },
    updateIndicators:function () {
        for (var i = 0; i < 6; i++) {
            if ((i == this._currentPage) && this._curPageIndicator[i]) {
                this._curPageIndicator[i].selected();
            }
            else {
                this._curPageIndicator[i].unselected();
            }
        }
    },
    movePageLeft:function () {
        if (this._currentPage != 0) {
            this._currentPage--;
            var wp = this.getChildByTag(999);
            var Move = cc.MoveTo.create(0.2, cc.p(-wp.getContentSize().width * PAGE_SCALE_FACTOR * this._currentPage, this._helpLayer.getPosition().y));
            var call = cc.CallFunc.create(this, this.updateIndicators);
            this._helpLayer.runAction(cc.Sequence.create(Move, call));
        }
    },
    movePageRight:function () {
        if (this._currentPage != HELP_PAGE_NUM - 1) {
            this._currentPage++;
            var wp = this.getChildByTag(999);
            var Move = cc.MoveTo.create(0.2, cc.p(-wp.getContentSize().width * PAGE_SCALE_FACTOR * this._currentPage, this._helpLayer.getPosition().y));
            var call = cc.CallFunc.create(this, this.updateIndicators);
            this._helpLayer.runAction(cc.Sequence.create(Move, call));
        }
    },
    resetAllSpritePos:function () {
        this._returnButton.setPosition(cc.pAdd(VisibleRect.topLeft(), cc.p(73, -38)));
        Multiple = AutoAdapterScreen.getInstance().getScaleMultiple();
        this._bg.setScale(Multiple);
        this._bg.setPosition(VisibleRect.center());
        for (var i = 0; i < this._curPageIndicator.length; i++) {
            var btnPageIndicatorStartPosX = VisibleRect.center().x - (PAGE_INDICATOR_INTERVAL * (HELP_PAGE_NUM - 1) / 2.0);
            var btnPageIndicator = this._curPageIndicator[i];
            btnPageIndicator.setPosition(cc.p(btnPageIndicatorStartPosX + (i - 1) * PAGE_INDICATOR_INTERVAL, VisibleRect.bottom().y + 30));
        }

        // HelpImage
        var helpImage = this.getChildByTag(998);
        if(helpImage){
            helpImage.setPosition(VisibleRect.center());
        }

        var box = this.getChildByTag(999);
        if(box){
            box.setPosition(VisibleRect.center());
        }

    }
});

HowToPlayLayer.create = function () {
    var ret = new HowToPlayLayer();
    if (ret && ret.init()) {
        return ret;
    }
};


var HelpImagesLayer = cc.Layer.extend({
    shadeArray:null,
    ctor:function () {
        this.shadeArray = [];
    },
    draw:function (ctx) {
        if (cc.renderContextType == cc.CANVAS) {
            var context = ctx || cc.renderContext;

            var size = this.getContentSize();
            context.beginPath();
            context.moveTo(-size.width / 2, -size.height / 2);
            context.lineTo(size.width / 2, -size.height / 2);
            context.lineTo(size.width / 2, size.height / 2);
            context.lineTo(-size.width / 2, size.height / 2);
            context.clip();
            context.closePath();
        }
    }
});

HelpImagesLayer.create = function () {
    var h = new HelpImagesLayer();
    if (h.init()) {
        return h;
    }
    return null;
};