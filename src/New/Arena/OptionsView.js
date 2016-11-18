/**
 * Created by eugeneseah on 17/11/16.
 */
"use strict"
var OptionsView = (function(){

    var _settingsCallback;
    var _fishCallBack;
    var _exitCallBack;


    function OptionsView(parent, settingsCallback, fishListCallback, exitCallback){
        this._parent = parent;

        _settingsCallback = settingsCallback;
        _fishCallBack = fishListCallback;
        _exitCallBack = exitCallback;

        this._sideMenu = setupSideMenu();
        this._parent.addChild(this._sideMenu);
    }

    function setupSideMenu(){
        var midX = cc.view.getDesignResolutionSize().width / 2;
        var midY = cc.view.getDesignResolutionSize().height / 2;

        var bg = new cc.Sprite(ReferenceName.SideMenuBG);
        var bgButton =  new cc.MenuItemSprite(bg, undefined, undefined, onMenuClicked);

        var settings = new cc.Sprite(ReferenceName.SideMenuSettingsButton);
        var settingsButton = new cc.MenuItemSprite(settings, undefined, undefined, onSettingsEvent);

        var fishList = new cc.Sprite(ReferenceName.FishListButton);
        var fishListButton = new cc.MenuItemSprite(fishList, undefined, undefined, onFishListEvent);

        var exit = new cc.Sprite(ReferenceName.ExitButton);
        var exitButton = new cc.MenuItemSprite(exit, undefined, undefined, onExitEvent);


        var menu = new cc.Menu(bgButton, settingsButton, fishListButton, exitButton );
        settingsButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, settingsButton.getContentSize().height / 2), cc.p(14, 80)));
        fishListButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, fishListButton.getContentSize().height / 2), cc.p(14, 0)));
        exitButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, exitButton.getContentSize().height / 2), cc.p(14, -80)));
        bgButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, exitButton.getContentSize().height / 2), cc.p(-22, 0)));
        menu.setPosition(midX-50,midY);


        return menu;
    }

    function onSettingsEvent(){
        if(_settingsCallback) {
            _settingsCallback();
        }
    }

    function onFishListEvent(){
        if(_fishCallBack) {
            _fishCallBack();
        }
    }

    function onExitEvent(){
        if(_exitCallBack) {
            _exitCallBack();
        }
    }

    function onMenuClicked(){

    }

    OptionsView.prototype.destroy = function () {
        this._parent.removeChild(this._sideMenu);
    };


    return OptionsView;
})();
