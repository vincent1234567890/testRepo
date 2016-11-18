/**
 * Created by eugeneseah on 15/11/16.
 */
var LobbyView = function() {

    var LobbyView = function ( parent) {

        this._parent = parent;

        //var width = cc.view.getDesignResolutionSize().width;

        var midX = cc.view.getDesignResolutionSize().width / 2;
        var midY = cc.view.getDesignResolutionSize().height / 2;

        var bg = new cc.Sprite(ReferenceName.LobbyBackground);
        bg.setPosition(midX , midY);
        this._parent.addChild(bg,-3);

        var star = new cc.Sprite(ReferenceName.Star);
      //  star.setPosition(midX,midY);
        star.setPosition(166 , cc.view.getDesignResolutionSize().height - 66);
        this._parent.addChild(star,1);

        var coin = new cc.Sprite(ReferenceName.LobbyCoinIcon);
        coin.setPosition(971,cc.view.getDesignResolutionSize().height - 46);
        this._parent.addChild(coin,1);

        var coinBG = new cc.Sprite(ReferenceName.LobbyCoinsBG);
        coinBG.setPosition(1136,cc.view.getDesignResolutionSize().height - 47);
        this._parent.addChild(coinBG,-1);

        var BonusPlaceHolder = new cc.Sprite(ReferenceName.BonusPlaceHolder);
        BonusPlaceHolder.setPosition(685,cc.view.getDesignResolutionSize().height - 49);
        this._parent.addChild(BonusPlaceHolder,1);

        var LevelBG = new cc.Sprite(ReferenceName.LevelBG);
        LevelBG.setPosition(233,cc.view.getDesignResolutionSize().height - 79);
        this._parent.addChild(LevelBG,-1);

        var NameBG = new cc.Sprite(ReferenceName.NameBG);
        NameBG.setPosition(279,cc.view.getDesignResolutionSize().height - 24);
        this._parent.addChild(NameBG,-1);

        var ProfileFrame = new cc.Sprite(ReferenceName.ProfileFrame);
        ProfileFrame.setPosition(59,cc.view.getDesignResolutionSize().height - 46);
        this._parent.addChild(ProfileFrame,-1);

        var ProfileImage = new cc.Sprite(ReferenceName.ProfileImage);
        ProfileImage.setPosition(59,cc.view.getDesignResolutionSize().height - 47);
        this._parent.addChild(ProfileImage,1);

        var TopBg = new cc.Sprite(ReferenceName.TopBg);
        TopBg.setPosition(683,cc.view.getDesignResolutionSize().height - 52);
        this._parent.addChild(TopBg,-2);

        setupGameScroll(this._parent);

        setupGameList (this._parent);

        setupProfileMenu (this._parent);

        setupLobbyButtons (coinBG);

    };


    function setupGameScroll(parent) {
        var arrow = new cc.Sprite(ReferenceName.ScrollArrow);
        var arrowDown = new cc.Sprite(ReferenceName.ScrollArrow);
        var rightArrow = new cc.Sprite(ReferenceName.ScrollArrow);
        rightArrow.flippedX = true;
        var rightArrowDown = new cc.Sprite(ReferenceName.ScrollArrow);
        rightArrowDown.flippedX = true;

        var menuLeft = new cc.MenuItemSprite(arrow, arrowDown, undefined, scrollLeft);
        var menuRight = new cc.MenuItemSprite(rightArrow,rightArrowDown, undefined, scrollRight);


        var menu = new cc.Menu(menuLeft, menuRight);
        menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-630, 0)));
        menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(630, 0)));
        parent.addChild(menu,2);
        menu.setPosition(0,300);

    };

    function setupGameList(parent){
        var game = new cc.Sprite(ReferenceName.GameSelectBox);
        var gameButton = new cc.MenuItemSprite(game, undefined, undefined, gameSelected);
        var menu = new cc.Menu(gameButton);
        gameButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, gameButton.getContentSize().height / 2), cc.p(0, 0)));
        parent.addChild(menu,1);
        menu.setPosition(-450,110);

    }


    function setupProfileMenu(parent) {
        var Message = new cc.Sprite(ReferenceName.MessageButton);
        var MessageDown = new cc.Sprite(ReferenceName.MessageButton);
        var Settings = new cc.Sprite(ReferenceName.LobbySettingsButton);
        var SettingsDown = new cc.Sprite(ReferenceName.LobbySettingsButton);

        var messageButton = new cc.MenuItemSprite(Message, MessageDown, undefined, messageButtonPressed);
        var settingsButton = new cc.MenuItemSprite(Settings,SettingsDown, undefined, settingsButtonPressed);


        var menu = new cc.Menu(messageButton, settingsButton);
        messageButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, messageButton.getContentSize().height / 2), cc.p(-31, -20)));
        settingsButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, settingsButton.getContentSize().height / 2), cc.p(32, -20)));
        menu.setPosition(-295,691);
        parent.addChild(menu,1);

    };

    function setupLobbyButtons (parent){
        var Buy = new cc.Sprite(ReferenceName.BuyButton);
        var BuyDown = new cc.Sprite(ReferenceName.BuyButton);

        var buyButton = new cc.MenuItemSprite(Buy, BuyDown, undefined, buyButtonPressed);
        var menu = new cc.Menu(buyButton);
        buyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, buyButton.getContentSize().height / 2), cc.p(0, 0)));
        menu.setPosition(0,300);
        //buyButton.setPosition(cc.view.getDesignResolutionSize().width / 2,cc.view.getDesignResolutionSize().height / 2)
        //buyButton.setPosition(0,0);

      //  var buyTest = new cc.Sprite(ReferenceName.BuyButton);
      //  parent.addChild(buyTest,9999999);
      //  buyTest.setPosition(cc.view.getDesignResolutionSize().width / 2,cc.view.getDesignResolutionSize().height / 2);
        parent.addChild(menu,5);
    }

    var proto = LobbyView.prototype;

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




    return LobbyView;
}();
