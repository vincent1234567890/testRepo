/**
 * Created by eugeneseah on 17/11/16.
 */

var OptionsView = (function(){



    function OptionsView(parent, settingsCallback, fishListCallback, exitCallback){
        this._parent = parent;

        this._settingsCallback = settingsCallback;
        this._fishCallBack = fishListCallback;
        this._exitCallBack = exitCallback;

        this._sideMenu = setupSideMenu();
        this._parent.addChild(this._sideMenu);
    }

    function setupSideMenu(){
        var midX = cc.view.getDesignResolutionSize().width / 2;
        var midY = cc.view.getDesignResolutionSize().height / 2;

        var bg = new cc.Sprite(ReferenceName.SideMenuBG);
        bg.setPosition(midX,midY);
        // this._parent.addChild(bg);

        var settings = new cc.Sprite(ReferenceName.SideMenuSettingsButton);
        var settingsButton = new cc.MenuItemSprite(settings, undefined, undefined, onSettingsEvent);
        bg.setPosition(midX,midY);

        var fishList = new cc.Sprite(ReferenceName.FishListButton);
        var fishListButton = new cc.MenuItemSprite(fishList, undefined, undefined, onFishListEvent);

        var exit = new cc.Sprite(ReferenceName.FishListButton);
        var exitButton = new cc.MenuItemSprite(exit, undefined, undefined, onExitEvent);

        var menu = new cc.Menu(settingsButton, fishListButton, exitButton);
        settingsButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, settingsButton.getContentSize().height / 2), cc.p(0, 0)));
        fishListButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, fishListButton.getContentSize().height / 2), cc.p(0, 0)));
        exitButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, exitButton.getContentSize().height / 2), cc.p(0, 0)));
        menu.setPosition(0,0);
        bg.addChild(menu);

        return bg;
    }

    function onSettingsEvent(){
        this._settingsCallback();
    }

    function onFishListEvent(){
        this._fishCallBack();
    }

    function onExitEvent(){
        this._exitCallBack();
    }

    return OptionsView;
})();