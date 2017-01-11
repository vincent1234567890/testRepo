/**
 * Created by eugeneseah on 23/12/16.
 */
const OptionsMenuViewBottom = (function (){
    "use strict";

    let _settingsCallback;
    let _fishCallBack;
    let _exitCallBack;

    let _menu;

    let _showSequence;
    let _hideSequence;

    let _isAnimating;
    let _isShowing;

    let _touchlayer;

    let _colourBG;
    const hideColour = cc.color(0,0,0,0);
    const showColour = cc.color(0,0,0,196);

    let thisParent;

    function OptionsMenuViewBottom(settingsCallback, fishListCallback, exitCallback) {
        thisParent = this._parent = new cc.Node();
        GameView.addView(this._parent, 9);

        _settingsCallback = settingsCallback;
        _fishCallBack = fishListCallback;
        _exitCallBack = exitCallback;

        let showAction = new cc.FadeTo(0.5, 255);
        showAction.easing(cc.easeExponentialIn());
        _showSequence = new cc.Sequence(showAction,cc.callFunc(animationCallback));

        let hideAction = new cc.FadeTo(0.5, 0);
        hideAction.easing(cc.easeExponentialIn());
        _hideSequence = new cc.Sequence(hideAction,cc.callFunc(animationCallback));


        _touchlayer = new TouchLayerRefactored(onMenuClicked);
        _touchlayer.setSwallowTouches(true);
        _touchlayer.setEnable(false);
        this._parent.addChild(_touchlayer,-1);

        // let option = new cc.Sprite(ReferenceName.BottomMenuButton);
        // let optionButton = new cc.MenuItemSprite(option, undefined, undefined, onMenuClicked);
        // optionButton.setPosition(cc.view.getDesignResolutionSize().width/2, 35);
        const optionButton = setupBottomButton();
        optionButton.setPosition(cc.view.getDesignResolutionSize().width/2, 35);
        this._parent.addChild(optionButton,1);

        _colourBG = new cc.LayerColor(hideColour);
        this._parent.addChild(_colourBG,-1);

        _isAnimating = _isShowing = false;

        // const initial = new cc.FadeTo(0, 0);
        // _menu.runAction(new cc.Sequence(initial));

        // parent.addChild(this._parent,10);

    }

    function setupSideMenu() {
        const settings = new cc.Sprite(ReferenceName.BottomMenuSettingsButton);
        const settingsButton = new cc.MenuItemSprite(settings, undefined, undefined, onSettingsEvent);

        const fishList = new cc.Sprite(ReferenceName.BottomMenuFishListButton);
        const fishListButton = new cc.MenuItemSprite(fishList, undefined, undefined, onFishListEvent);

        const exit = new cc.Sprite(ReferenceName.BottomMenuExitButton);
        const exitButton = new cc.MenuItemSprite(exit, undefined, undefined, onExitEvent);

        const menu = new cc.Menu( settingsButton, fishListButton, exitButton);

        settingsButton.setPosition(-150, cc.view.getDesignResolutionSize().height / 2);
        fishListButton.setPosition(0, cc.view.getDesignResolutionSize().height / 2);
        exitButton.setPosition(150, cc.view.getDesignResolutionSize().height / 2);

        return menu;
    }

    function setupBottomButton(){
        const option = new cc.Sprite(ReferenceName.BottomMenuButton);
        const optionButton = new cc.MenuItemSprite(option, undefined, undefined, onMenuClicked);

        return new cc.Menu( optionButton);
    }

    function onSettingsEvent() {
        if (_settingsCallback) {
            onMenuClicked();
            console.log("onSettingsEvent");
            _settingsCallback();
        }
    }

    function onFishListEvent() {
        if (_fishCallBack) {
            onMenuClicked();
            console.log("onFishListEvent");
            _fishCallBack();
        }
    }

    function onExitEvent() {
        if (_exitCallBack) {
            onMenuClicked();
            console.log("onExitEvent");
            _exitCallBack();
        }
    }

    function onMenuClicked(point){

        if (!_menu) {
            _menu = setupSideMenu();
            _menu.setPosition(cc.view.getDesignResolutionSize().width / 2, 0);
            thisParent.addChild(_menu, 1);
        }
        if (_isAnimating){
            return;
        }
        _isAnimating = true;
        if (!_isShowing){
            _touchlayer.setEnable(true);
            _colourBG.init(showColour);
            _menu.runAction(_showSequence);
        }else{
            // _menu.runAction(_hideSequence);
            dismissCallback();
        }
    }

    function dismissCallback(touch){
        _touchlayer.setEnable(false);
        _colourBG.init(hideColour);
        _menu.runAction(_hideSequence);
    }

    function animationCallback(){
        _isAnimating = false;
        _isShowing = !_isShowing;
        _menu.setEnabled(_isShowing);
        console.log(_menu.isEnabled());
    }

    const proto = OptionsMenuViewBottom.prototype;

    proto.destroy = function () {
        _settingsCallback  = null;
        _fishCallBack = null;
        _exitCallBack = null;
        _menu=null;
       // this._parent.parent.removeChild(this._parent);
        GameView.destroyView(thisParent);
        thisParent = this._parent = null;
    };



    return OptionsMenuViewBottom;
})();