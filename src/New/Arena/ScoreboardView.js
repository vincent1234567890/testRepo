/**
 * Created by eugeneseah on 16/11/16.
 */

var ScoreboardView = function() {

    var ScoreboardView = function ( parent) {

        this._parent = parent;

        var midX = cc.view.getDesignResolutionSize().width / 2;
        var midY = cc.view.getDesignResolutionSize().height / 2;

        var bg = new cc.Sprite(ReferenceName.ScoreboardBG);
        bg.setPosition(midX,midY);
        this._parent.addChild(bg);

        var sessionTime = createGridObject(ReferenceName.SessionTime, ReferenceName.TimeSpentIcon);
        var goldSpent = createGridObject(ReferenceName.GoldSpent, ReferenceName.CoinSpentIcon );
        var goldSpent =

    };

    function createGridObject(labelText, spriteName){
        var fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = "32";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        var label = new cc.LabelTTF(labelText, fontDef);

        fontDef.fontSize = "20";

        var info = new cc.LabelTTF(labelText,fontDef);

        var icon = new cc.Sprite(spriteName);


        var bg = new cc.Sprite(ReferenceName.InfoSlotBG);

        bg.addChild(label);
        bg.addChild(icon);
        bg.addChild(info);

        label.setPosition(0,10);
        icon.setPosition(-10,0);
        info.setPosition(10,0);




    }


    function setupGameScroll(parent) {
        var arrow = new cc.Sprite(ReferenceName.ScrollArrow);
        var arrowDown = new cc.Sprite(ReferenceName.ScrollArrow);
        var rightArrow = new cc.Sprite(ReferenceName.ScrollArrow);
        rightArrow.flippedX = true;
        var rightArrowDown = new cc.Sprite(ReferenceName.ScrollArrow);
        rightArrowDown.flippedX = true;

        var menuLeft = new cc.MenuItemSprite(arrow, arrowDown, undefined, scrollLeft, LobbyView);
        var menuRight = new cc.MenuItemSprite(rightArrow,rightArrowDown, undefined, scrollRight, LobbyView);


        var menu = new cc.Menu(menuLeft, menuRight);
        menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-92, -20)));
        menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(92, -20)));
        parent.addChild(menu);

    };

    function setupGameList(parent){
        var game = new cc.Sprite(ReferenceName.GameSelectBox);
        var gameButton = new cc.MenuItemSprite(game, undefined, undefined, gameSelected, LobbyView);
        var menu = new cc.Menu(gameButton);
        gameButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, gameButton.getContentSize().height / 2), cc.p(-92, -20)));
        parent.addChild(menu);
    }


    function setupProfileMenu(parent) {
        var Message = new cc.Sprite(ReferenceName.MessageButton);
        var MessageDown = new cc.Sprite(ReferenceName.MessageButton);
        var Settings = new cc.Sprite(ReferenceName.SettingsButton);
        var SettingsDown = new cc.Sprite(ReferenceName.SettingsButton);

        var messageButton = new cc.MenuItemSprite(Message, MessageDown, undefined, messageButtonPressed, LobbyView);
        var settingsButton = new cc.MenuItemSprite(Settings,SettingsDown, undefined, settingsButtonPressed, LobbyView);


        var menu = new cc.Menu(messageButton, settingsButton);
        messageButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, messageButton.getContentSize().height / 2), cc.p(-92, -20)));
        settingsButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, settingsButton.getContentSize().height / 2), cc.p(92, -20)));
        parent.addChild(menu);

    };

    function setupLobbyButtons (parent){
        var Buy = new cc.Sprite(ReferenceName.BuyButton);
        var BuyDown = new cc.Sprite(ReferenceName.BuyButton);

        var buyButton = new cc.MenuItemSprite(Buy, BuyDown, buyButtonPressed, LobbyView);
        var menu = new cc.Menu(buyButton);
        buyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, buyButton.getContentSize().height / 2), cc.p(-92, -20)));
        parent.addChild(menu);
    }

    var proto = ScoreboardView.prototype;

    function scrollLeft() {
        console.log("scroll left");
    }

    function scrollRight() {
        console.log("scrollRight");
    }

    function buyButtonPressed () {
        console.log("buyButtonPressed");
    }

    function messageButtonPressed () {
        console.log("messageButtonPressed");
    }

    function settingsButtonPressed () {
        console.log("settingsButtonPressed");
    }

    function gameSelected(){
        console.log("gameSelected");
        ClientServerConnect.joinGame(0);
    }




    return ScoreboardView;
}();