/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyView = (function() {

    const LobbyView = function ( parent, playerData) {

        this._parent = parent;

        //var width = cc.view.getDesignResolutionSize().width;

        // var midX = cc.view.getDesignResolutionSize().width / 2;
        // var midY = cc.view.getDesignResolutionSize().height / 2;
        const length = cc.view.getDesignResolutionSize().width;
        const height = cc.view.getDesignResolutionSize().height;

        const bg = new cc.Sprite(ReferenceName.LobbyBackground);
        bg.setPosition(length/2 , height/2);
        this._parent.addChild(bg,-3);

        const TopBg = new cc.Sprite(ReferenceName.TopBg);
        // TopBg.setPosition(683,cc.view.getDesignResolutionSize().height - 52);
        let size = TopBg.getContentSize();
        TopBg.setPosition(length - size.width/2,height - size.height/2);
        bg.addChild(TopBg);

        const ProfileFrame = new cc.Sprite(ReferenceName.ProfileFrame);
        // ProfileFrame.setPosition(59,cc.view.getDesignResolutionSize().height - 46);
        size = ProfileFrame.getContentSize();
        ProfileFrame.setPosition(size.width/2 + 15,height - size.height/2);
        // TopBg.addChild(ProfileFrame,1);
        bg.addChild(ProfileFrame,1);

        const ProfileImage = new cc.Sprite(ReferenceName.ProfileImage);
        // ProfileImage.setPosition(59,cc.view.getDesignResolutionSize().height - 47);
        size = ProfileImage.getContentSize();
        // ProfileImage.setPosition(size.width/2 - 15,95-size.height/2);
        ProfileImage.setPosition(size.width/2 ,height - size.height/2);
        bg.addChild(ProfileImage,0);

      //   const star = new cc.Sprite(ReferenceName.Star);
      // //  star.setPosition(midX,midY);
      //   star.setPosition(166 , cc.view.getDesignResolutionSize().height - 66);
      //   bg.addChild(star,2);

        // var coin = new cc.Sprite(ReferenceName.LobbyCoinIcon);
        // coin.setPosition(971,cc.view.getDesignResolutionSize().height - 46);
        // bg.addChild(coin,2);



        // const BonusPlaceHolder = new cc.Sprite(ReferenceName.BonusPlaceHolder);
        // // BonusPlaceHolder.setPosition(685,cc.view.getDesignResolutionSize().height - 49);
        // size = BonusPlaceHolder.getContentSize();
        // BonusPlaceHolder.setPosition(length/2 - size.width/2,height - size.height/2);
        // bg.addChild(BonusPlaceHolder,2);

        const LevelBG = new cc.Sprite(ReferenceName.LevelBG);
        // LevelBG.setPosition(233,cc.view.getDesignResolutionSize().height - 79);
        size = LevelBG.getContentSize();
        LevelBG.setPosition(length - size.width/2,height - size.height/2);
        bg.addChild(LevelBG,1);

        const NameBG = new cc.Sprite(ReferenceName.NameBG);
        // NameBG.setPosition(279,cc.view.getDesignResolutionSize().height - 24);
        size = NameBG.getContentSize();
        NameBG.setPosition(length - size.width/2,height - size.height/2);
        bg.addChild(NameBG,1);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        //fontDef.fontWeight = "bold";
        fontDef.fontSize = "26";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0,0,0,255);

        let label = new cc.LabelTTF(playerData.name , fontDef);
        label.setAnchorPoint(0, 0.5);

        NameBG.addChild(label);
        label.setPosition(130,NameBG.getContentSize().height- 25);
        label.setDimensions(cc.size(300,35));

        const LobbyCoinsBG = new cc.Sprite(ReferenceName.LobbyCoinsBG);
        // coinBG.setPosition(1136,cc.view.getDesignResolutionSize().height - 47);
        size = LobbyCoinsBG.getContentSize();
        LobbyCoinsBG.setPosition(length - size.width/2,height - size.height/2);
        bg.addChild(LobbyCoinsBG,2);
        fontDef.fontSize = "40";
        fontDef.fillStyle = new cc.Color(255,255,0,255);
        fontDef.textAlign = cc.TEXT_ALIGNMENT_RIGHT;

        label = new cc.LabelTTF(formatWithCommas(playerData.score), fontDef);
        // label = new cc.LabelTTF("99999999999999999999999", fontDef);
        LobbyCoinsBG.addChild(label);
        console.log(LobbyCoinsBG.getContentSize())
        label.setPosition(LobbyCoinsBG.getContentSize().width - 250,LobbyCoinsBG.getContentSize().height - 50);
        // label.setPosition(0,0);
        label.setDimensions(cc.size(240,45));

        // setupGameScroll(this._parent);

        const gameListMenu = setupGameList ();
        size = gameListMenu.getContentSize();
        gameListMenu.setPosition(- length/2 +size.height/2 - 200 , -height/2 + size.height/2 + 100);
        bg.addChild(gameListMenu,2);

        const profileMenu = setupProfileMenu ();
        size = profileMenu.getContentSize();
        // profileMenu.setPosition(length - size.width/2,height - size.height/2);
        profileMenu.setPosition(size.width - length - 300, size.height/2 + height/2 - 80);
        bg.addChild(profileMenu,2);

        const lobbyMenu = setupLobbyButtons ();
        size = lobbyMenu.getContentSize();
        lobbyMenu.setPosition(size.width/2 - 70,height - 80);
        LobbyCoinsBG.addChild(lobbyMenu,2);

        // this._touchlayer = new TouchLayerRefactored();
        // this._touchlayer.setSwallowTouches(true);
        //
        // bg.addChild(this._touchlayer,-2);

    };


    // function setupGameScroll(parent) {
    //     const arrow = new cc.Sprite(ReferenceName.ScrollArrow);
    //     const arrowDown = new cc.Sprite(ReferenceName.ScrollArrow);
    //     const rightArrow = new cc.Sprite(ReferenceName.ScrollArrow);
    //     rightArrow.flippedX = true;
    //     const rightArrowDown = new cc.Sprite(ReferenceName.ScrollArrow);
    //     rightArrowDown.flippedX = true;
    //
    //     const menuLeft = new cc.MenuItemSprite(arrow, arrowDown, undefined, scrollLeft);
    //     const menuRight = new cc.MenuItemSprite(rightArrow,rightArrowDown, undefined, scrollRight);
    //
    //
    //     const menu = new cc.Menu(menuLeft, menuRight);
    //     menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-630, 0)));
    //     menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(630, 0)));
    //     parent.addChild(menu,2);
    //     menu.setPosition(0,300);
    //
    // };

    function setupGameList(){
        // const length = cc.view.getDesignResolutionSize().width;
        // const height = cc.view.getDesignResolutionSize().height;

        const game = new cc.Sprite(ReferenceName.GameSelectBox);
        const gameButton = new cc.MenuItemSprite(game, undefined, undefined, gameSelected);
        const menu = new cc.Menu(gameButton);
        gameButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, gameButton.getContentSize().height / 2), cc.p(0, 0)));
        // parent.addChild(menu,1);
        return menu;
        // menu.setPosition(-450,110);
    }


    function setupProfileMenu() {
        const Message = new cc.Sprite(ReferenceName.MessageButton);
        const MessageDown = new cc.Sprite(ReferenceName.MessageButton);
        const Settings = new cc.Sprite(ReferenceName.LobbySettingsButton);
        const SettingsDown = new cc.Sprite(ReferenceName.LobbySettingsButton);

        const messageButton = new cc.MenuItemSprite(Message, MessageDown, undefined, messageButtonPressed);
        const settingsButton = new cc.MenuItemSprite(Settings,SettingsDown, undefined, settingsButtonPressed);


        const menu = new cc.Menu(messageButton, settingsButton);
        messageButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, messageButton.getContentSize().height / 2), cc.p(-31, -20)));
        settingsButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, settingsButton.getContentSize().height / 2), cc.p(32, -20)));
        // menu.setPosition(-295,691);
        // parent.addChild(menu,1);
        return menu;
    }

    function setupLobbyButtons (){
        const Buy = new cc.Sprite(ReferenceName.BuyButton);
        const BuyDown = new cc.Sprite(ReferenceName.BuyButton);

        const buyButton = new cc.MenuItemSprite(Buy, BuyDown, undefined, buyButtonPressed);
        const menu = new cc.Menu(buyButton);
        buyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, buyButton.getContentSize().height / 2), cc.p(0, 0)));

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Impact";
        //fontDef.fontWeight = "bold";
        fontDef.fontSize = "40";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0,0,0,255);

        let label = new cc.LabelTTF(ReferenceName.LobbyBuyButton , fontDef);
        label.setAnchorPoint(0.5, 0.5);
        label.setPosition(buyButton.getContentSize().width/2,buyButton.getContentSize().height/2);

        buyButton.addChild(label);
        // menu.setPosition(0,300);
        //buyButton.setPosition(cc.view.getDesignResolutionSize().width / 2,cc.view.getDesignResolutionSize().height / 2)
        //buyButton.setPosition(0,0);

      //  var buyTest = new cc.Sprite(ReferenceName.BuyButton);
      //  parent.addChild(buyTest,9999999);
      //  buyTest.setPosition(cc.view.getDesignResolutionSize().width / 2,cc.view.getDesignResolutionSize().height / 2);
      //   parent.addChild(menu,5);
        return menu;
    }

    let proto = LobbyView.prototype;

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
        ClientServerConnect.joinGame(0).catch(console.error);
    }

    function formatWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }




    return LobbyView;
}());
