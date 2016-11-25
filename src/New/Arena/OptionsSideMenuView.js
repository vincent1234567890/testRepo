/**
 * Created by eugeneseah on 17/11/16.
 */
"use strict";
const OptionsSideMenuView = (function () {
    const SHOWTHRESHOLD = 40;
    const HIDETHRESHOLD = 20;
    const MOVELIMIT = 80;

    let _menuPos;

    let _settingsCallback;
    let _fishCallBack;
    let _exitCallBack;
    let _touchLayer;

    let _isShowing;
    let background;

    let _showSequence;
    let _hideSequence;

    let _isAnimating;

    function OptionsView(parent, settingsCallback, fishListCallback, exitCallback) {
        this._parent = parent;

        _settingsCallback = settingsCallback;
        _fishCallBack = fishListCallback;
        _exitCallBack = exitCallback;

        _isShowing = false;

        background = new cc.Sprite(ReferenceName.SideMenuBG);

        _touchLayer = new TouchLayerRefactored(dragMenu);

        this._sideMenu = setupSideMenu();

        this._sideMenu.setPosition(100, 140);

        background.setPosition(cc.view.getDesignResolutionSize().width + 15, cc.view.getDesignResolutionSize().height / 2);

        _menuPos = background.getPosition();

        let showAction = new cc.MoveTo(0.5, cc.p(_menuPos.x - MOVELIMIT, _menuPos.y));
        showAction.easing(cc.easeExponentialIn());
        _showSequence = new cc.Sequence(showAction,cc.callFunc(animationCallback));

        let hideAction = new cc.MoveTo(0.5, cc.p(_menuPos.x, _menuPos.y));
        hideAction.easing(cc.easeExponentialIn());
        _hideSequence = new cc.Sequence(hideAction,cc.callFunc(animationCallback));

        background.addChild(_touchLayer,1);
        background.addChild(this._sideMenu, 2);
        this._parent.addChild(background,1);
    }

    function setupSideMenu() {
        let settings = new cc.Sprite(ReferenceName.SideMenuSettingsButton);
        let settingsButton = new cc.MenuItemSprite(settings, undefined, undefined, onSettingsEvent);

        let fishList = new cc.Sprite(ReferenceName.FishListButton);
        let fishListButton = new cc.MenuItemSprite(fishList, undefined, undefined, onFishListEvent);

        let exit = new cc.Sprite(ReferenceName.ExitButton);
        let exitButton = new cc.MenuItemSprite(exit, undefined, undefined, onExitEvent);

        let menu = new cc.Menu(settingsButton, fishListButton, exitButton);
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
        _touchLayer.setSwallowTouches(false);
        if (hasEnded) {
            // _touchLayer.setSwallowTouches(false);
            if (_isShowing){
                background.runAction(_showSequence);
            }else{
                background.runAction(_hideSequence);
            }
            return;
        }

        if (!GUIFunctions.isSpriteTouched(background,touch)) {
            return;
        }

        _touchLayer.setSwallowTouches(true);

        if (_isAnimating){
            return;
        }

        let showDistance = _menuPos.x - background.getPosition().x;
        let hideDistance = _menuPos.x + MOVELIMIT - background.getPosition().x;

        let newPoint = background.convertToWorldSpace(background.convertToNodeSpace(touch));
        // if ((background.getPosition().x - newPoint.x > 0 && _isShowing) || (background.getPosition().x - newPoint.x < 0 && !_isShowing)) {
        //     return;
        // }

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

    function animationCallback(){
        _isAnimating = false;
    }

    OptionsView.prototype.destroy = function () {
        this._parent.removeChild(this._sideMenu);
    };


    return OptionsView;
})();
