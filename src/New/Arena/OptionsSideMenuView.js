/**
 * Created by eugeneseah on 17/11/16.
 */
"use strict";
var OptionsSideMenuView = (function () {

    const SHOWTHRESHOLD = 40;
    const HIDETHRESHOLD = 20;
    const MOVELIMIT = 80;

    var _menuPos;

    var _settingsCallback;
    var _fishCallBack;
    var _exitCallBack;
    var _touchLayer;

    var _isShowing;
    var background;

    var _showSequence;
    var _hideSequence;

    var _isAnimating;



    function OptionsView(parent, settingsCallback, fishListCallback, exitCallback) {
        this._parent = parent;

        _settingsCallback = settingsCallback;
        _fishCallBack = fishListCallback;
        _exitCallBack = exitCallback;

        _isShowing = false;


        // var midX = cc.view.getDesignResolutionSize().width / 2;
        // var midY = cc.view.getDesignResolutionSize().height / 2;

        background = new cc.Sprite(ReferenceName.SideMenuBG);

        _touchLayer = new TouchLayerRefactored(dragMenu);

        this._sideMenu = setupSideMenu();

        this._sideMenu.setPosition(100, 140);
        // this._sideMenu._touchListener._setFixedPriority(_touchLayer.getTouchPriority()-100);
        // console.log(_touchLayer.getTouchPriority());
        // console.log(this._sideMenu._touchListener._getFixedPriority());

        // this._sideMenu.setPosition(midX-50,midY);

        background.setPosition(cc.view.getDesignResolutionSize().width + 15, cc.view.getDesignResolutionSize().height / 2);
        _menuPos = background.getPosition();
        // console.log(background.getPosition());

        var showAction = new cc.MoveTo(0.5, cc.p(_menuPos.x - MOVELIMIT, _menuPos.y));
        showAction.easing(cc.easeExponentialIn());
        _showSequence = new cc.Sequence(showAction,cc.callFunc(animationCallback));

        var hideAction = new cc.MoveTo(0.5, cc.p(_menuPos.x, _menuPos.y));
        hideAction.easing(cc.easeExponentialIn());
        _hideSequence = new cc.Sequence(hideAction,cc.callFunc(animationCallback));

        background.addChild(_touchLayer,1);
        background.addChild(this._sideMenu, 2);
        this._parent.addChild(background,1);

        // background.runAction(_showSequence);
    }

    function setupSideMenu() {


        // var bg = new cc.Sprite(ReferenceName.SideMenuBG);
        // var bgButton =  new cc.MenuItemSprite(bg, undefined, undefined, onMenuClicked);

        var settings = new cc.Sprite(ReferenceName.SideMenuSettingsButton);
        var settingsButton = new cc.MenuItemSprite(settings, undefined, undefined, onSettingsEvent);

        var fishList = new cc.Sprite(ReferenceName.FishListButton);
        var fishListButton = new cc.MenuItemSprite(fishList, undefined, undefined, onFishListEvent);

        var exit = new cc.Sprite(ReferenceName.ExitButton);
        var exitButton = new cc.MenuItemSprite(exit, undefined, undefined, onExitEvent);


        var menu = new cc.Menu(settingsButton, fishListButton, exitButton);
        settingsButton.setPosition(0, 80);
        fishListButton.setPosition(0, 0);
        exitButton.setPosition(0, -80);

        return menu;
    }

    function onSettingsEvent() {
        if (_settingsCallback) {
            _settingsCallback();
        }
    }

    function onFishListEvent() {
        if (_fishCallBack) {
            _fishCallBack();
        }
    }

    function onExitEvent() {
        if (_exitCallBack) {
            _exitCallBack();
        }
    }

    function dragMenu(touch, hasEnded) {
        if (hasEnded) {
            _touchLayer.setSwallowTouches(false);
            if (_isShowing){
                background.runAction(_showSequence);
            }else{
                background.runAction(_hideSequence);
            }
            return;
        }

        if (_isAnimating){
            return;
        }

        var newPoint = background.convertToWorldSpace(background.convertToNodeSpace(touch));
        if (!cc.rectContainsPoint(getViewRect(), newPoint)) {
            return;
        }

        var showDistance = _menuPos.x - background.getPosition().x;
        var hideDistance = _menuPos.x + MOVELIMIT - background.getPosition().x;
        // console.log("absoluteDistance.x: " + showDistance);
        // console.log("relativeDistance.x: " + hideDistance);
        // console.log(_isShowing);

        if ((background.getPosition().x - newPoint.x > 0 && _isShowing) || (background.getPosition().x - newPoint.x < 0 && !_isShowing)) {
            return;
        }
        _touchLayer.setSwallowTouches(true);

        // console.log(background.getContentSize());

        if (showDistance > SHOWTHRESHOLD && !_isShowing) {
            //auto show
            _isShowing = true;
            _isAnimating = true;
            background.runAction(_showSequence);
            return;
        } else if (_isShowing && hideDistance > HIDETHRESHOLD) {
            _isShowing = false;
            _isAnimating = true;
            background.runAction(_hideSequence);
            return;
        }


        background.setPosition(newPoint.x, _menuPos.y);
    }

    //modified from CCScrollView
    function getViewRect() {
        var screenPos = background.convertToWorldSpace(cc.p());
        // var locViewSize = this._viewSize;

        var scaleX = background.getScaleX();
        var scaleY = background.getScaleY();

        for (var p = background._parent; p != null; p = p.getParent()) {
            scaleX *= p.getScaleX();
            scaleY *= p.getScaleY();
        }

        if (scaleX < 0) {
            screenPos.x += background.width * scaleX;
            scaleX = -scaleX;
        }
        if (scaleY < 0) {
            screenPos.y += background.height * scaleY;
            scaleY = -scaleY;
        }

        return new cc.rect(screenPos.x, screenPos.y, background.width * scaleX, background.height * scaleY);
    }

    function animationCallback(){
        _isAnimating = false;
    }

    OptionsView.prototype.destroy = function () {
        this._parent.removeChild(this._sideMenu);
    };


    return OptionsView;
})();
