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
    // let _touchLayer;

    let _isShowing;
    // let background;
    let _menu;


    let _showSequence;
    let _hideSequence;

    let _isAnimating;

    function OptionsView(settingsCallback, fishListCallback, exitCallback) {
        this._parent = new cc.Node();
        GameView.addView(this._parent);

        _settingsCallback = settingsCallback;
        _fishCallBack = fishListCallback;
        _exitCallBack = exitCallback;

        _isShowing = false;

        // background = new cc.Sprite(ReferenceName.SideMenuBG);
        // _touchLayer = new TouchLayerRefactored(dragMenu);

        _menu = setupSideMenu();
        _menu.setPosition(cc.view.getDesignResolutionSize().width + 15, cc.view.getDesignResolutionSize().height / 2);

        // this._sideMenu.setPosition(100, 140);
        // background.setPosition(cc.view.getDesignResolutionSize().width + 15, cc.view.getDesignResolutionSize().height / 2);
        // _menuPos = background.getPosition();
        _menuPos = _menu.getPosition();

        let showAction = new cc.MoveTo(0.5, cc.p(_menuPos.x - MOVELIMIT, _menuPos.y));
        showAction.easing(cc.easeExponentialIn());
        _showSequence = new cc.Sequence(showAction,cc.callFunc(animationCallback));

        let hideAction = new cc.MoveTo(0.5, cc.p(_menuPos.x, _menuPos.y));
        hideAction.easing(cc.easeExponentialIn());
        _hideSequence = new cc.Sequence(hideAction,cc.callFunc(animationCallback));

        this._parent.addChild(_menu,1);
        // background.addChild(_touchLayer,1);
        // background.addChild(this._sideMenu, 2);
        // this._parent.addChild(background,1);
    }

    function setupSideMenu() {
        let settings = new cc.Sprite(ReferenceName.SideMenuSettingsButton);
        let settingsButton = new cc.MenuItemSprite(settings, undefined, undefined, onSettingsEvent);

        let fishList = new cc.Sprite(ReferenceName.SideMenuFishListButton);
        let fishListButton = new cc.MenuItemSprite(fishList, undefined, undefined, onFishListEvent);

        let exit = new cc.Sprite(ReferenceName.SideMenuExitButton);
        let exitButton = new cc.MenuItemSprite(exit, undefined, undefined, onExitEvent);

        let backGround = new cc.Sprite(ReferenceName.SideMenuBG);
        let backGroundButton = new cc.MenuItemSprite(backGround, undefined, undefined, onMenuClicked);

        let menu = new cc.Menu(backGroundButton, settingsButton, fishListButton, exitButton);
        backGroundButton.setPosition(0, 0);
        settingsButton.setPosition(31, 80);
        fishListButton.setPosition(31, 0);
        exitButton.setPosition(31, -80);

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
        // console.log("onExitEvent:" + _exitCallBack);
        if (_exitCallBack) {
            BlockingManager.deregisterBlock(onMenuClicked);
            _exitCallBack();
        }
    }

    function onMenuClicked(){
        if (_isAnimating){
            return;
        }
        if (!_isShowing){
            _menu.runAction(_showSequence);
        }else{
            _menu.runAction(_hideSequence);
        }
    }

    // function dragMenu(touch, hasEnded) {
    //     _touchLayer.setSwallowTouches(false);
    //     if (hasEnded) {
    //         // _touchLayer.setSwallowTouches(false);
    //         if (_isShowing){
    //             background.runAction(_showSequence);
    //         }else{
    //             background.runAction(_hideSequence);
    //         }
    //         return;
    //     }
    //
    //     if (!GUIFunctions.isSpriteTouched(background,touch)) {
    //         return;
    //     }
    //
    //     _touchLayer.setSwallowTouches(true);
    //
    //     if (_isAnimating){
    //         return;
    //     }
    //
    //     let showDistance = _menuPos.x - background.getPosition().x;
    //     let hideDistance = _menuPos.x + MOVELIMIT - background.getPosition().x;
    //
    //     let newPoint = background.convertToWorldSpace(background.convertToNodeSpace(touch));
    //     // if ((background.getPosition().x - newPoint.x > 0 && _isShowing) || (background.getPosition().x - newPoint.x < 0 && !_isShowing)) {
    //     //     return;
    //     // }
    //
    //     if (showDistance > SHOWTHRESHOLD && !_isShowing) {
    //         //auto show
    //         _isShowing = true;
    //         _isAnimating = true;
    //         background.runAction(_showSequence);
    //         return;
    //     } else if (_isShowing && hideDistance > HIDETHRESHOLD) {
    //         _isShowing = false;
    //         _isAnimating = true;
    //         background.runAction(_hideSequence);
    //         return;
    //     }
    //
    //     background.setPosition(newPoint.x, _menuPos.y);
    // }

    function animationCallback(){
        _isAnimating = false;
        _isShowing = !_isShowing;
    }

    OptionsView.prototype.destroy = function () {
        _settingsCallback  = null;
        _fishCallBack = null;
        _exitCallBack = null;
        GameView.destroyView(this._parent);
        this._parent = null;
        // this._parent.removeChild(_menu);
    };


    return OptionsView;
})();
