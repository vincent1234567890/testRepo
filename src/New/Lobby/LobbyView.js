/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyView = (function () {
    "use strict";
    // let isGameSelected;
    let _touchLayer;

    // const profileArea = new cc.Rect(0,0,450,120);
    const numberOfLobbyButtonsShown = 3;

    let _theme;

    // let _settingsCallback;
    let _onGameSelectedCallback;
    // let _profileCallback;

    let _goldLabel;

    // let _gameButtonsForReset = [];

    // let gamelist;
    let gameControlList;

    const LobbyView = function (playerData, theme, onGameSelectedCallback) {
        // this.gameSelected = false;

        this._parent = new cc.Node();
        GameView.addView(this._parent);

        _theme = theme;

        let size;

        _onGameSelectedCallback = onGameSelectedCallback;

        const length = cc.view.getDesignResolutionSize().width;
        const height = cc.view.getDesignResolutionSize().height;

        const clippy = new DolphinClippy();

        const bg = new cc.Sprite(ReferenceName.LobbyBackground);
        bg.setPosition(length / 2, height / 2 + 70);
        this._parent.addChild(bg, -5);

        const NameBG = new cc.Sprite(ReferenceName.NameBG);
        NameBG.setPosition(100,550);
        bg.addChild(NameBG,1);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = 22;
        fontDef.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        fontDef.fontWeight = "bold";
        fontDef.fillStyle = new cc.Color(255,255,255,255);

        let label = new cc.LabelTTF(playerData.playerState.name , fontDef);
        label.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        label.setAnchorPoint(0.5, 0.5);

        NameBG.addChild(label);
        label.setPosition(NameBG.getContentSize().width/2,NameBG.getContentSize().height/2);
        label.setDimensions(cc.size(150,25));

        const LobbyCoinsBG = new cc.Sprite(ReferenceName.LobbyCoinsBG);
        size = LobbyCoinsBG.getContentSize();
        LobbyCoinsBG.setPosition(320,550);
        bg.addChild(LobbyCoinsBG,2);

        fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontWeight = "bold";
        fontDef.fontSize = 30;
        fontDef.fillStyle = new cc.Color(255,205,60,255);
        fontDef.textAlign = cc.TEXT_ALIGNMENT_CENTER;


        _goldLabel = new cc.LabelTTF("", fontDef);
        LobbyCoinsBG.addChild(_goldLabel);
        _goldLabel.enableStroke(new cc.Color(90, 24, 8, 255), 3);
        _goldLabel.setPosition(120,27);

        const gamelist = setupGameList();
        // size = gameListMenu.getContentSize();
        // gameListMenu.setPosition(- length/2 +size.height/2 - 200 , -height/2 + size.height/2 + 100);
        this._parent.addChild(gamelist, 2);

        /* testing
         */
        cc.spriteFrameCache.addSpriteFrames(res.testingEffect);
        const animation = GUIFunctions.getAnimation("FREffect_",0.3);
        const animationSequence = new cc.RepeatForever(animation,new cc.callFunc(onAnimationEnd));
        const test = new cc.Sprite();
        this._parent.addChild(test,100);
        test.runAction(animationSequence);

        function onAnimationEnd() {

        }


        this.updatePlayerData(playerData);
    };



    // function onProfileclick(touch) {
    //     // console.log(touch,profileArea);
    //     if(cc.rectContainsPoint(profileArea,touch)){
    //         //profileview
    //         // console.log("profile");
    //         _profileCallback();
    //     }
    // }

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

    function setupGameList() {
        const width = cc.view.getDesignResolutionSize().width;
        const height = cc.view.getDesignResolutionSize().height;
        
        gameControlList = [];

        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        // listView.setBackGroundImage(res.HelloWorld_png);
        listView.setContentSize(cc.size(width, height));
        // listView.setInnerContainerSize(200,200)
        listView.setAnchorPoint(cc.p(0.5, 0.5));
        // listView.setPosition(width / 2, height / 2);
        listView.setPosition(width / 2 , height / 2 - 70);

        const gameList = _theme.GameList;
        for (let i = 0; i < gameList.length; i++) {
            const gameListButtonPrefab = new GameListButtonPrefab({
                gameId: i,
                gameName: gameList[i]
            }, width / numberOfLobbyButtonsShown, gameSelected);
            const content = gameListButtonPrefab.getContent();
            
            gameControlList.push(gameListButtonPrefab);

            listView.pushBackCustomItem(content);
        }

        return listView;
    }

    // function setupProfileMenu() {
    //     const Message = new cc.Sprite(ReferenceName.MessageButton);
    //     const MessageDown = new cc.Sprite(ReferenceName.MessageButton);
    //     const Settings = new cc.Sprite(ReferenceName.LobbySettingsButton);
    //     const SettingsDown = new cc.Sprite(ReferenceName.LobbySettingsButton);
    //
    //     const messageButton = new cc.MenuItemSprite(Message, MessageDown, undefined, messageButtonPressed);
    //     const settingsButton = new cc.MenuItemSprite(Settings, SettingsDown, undefined, settingsButtonPressed);
    //
    //     const menu = new cc.Menu(messageButton, settingsButton);
    //     messageButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, messageButton.getContentSize().height / 2), cc.p(-31, -20)));
    //     settingsButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, settingsButton.getContentSize().height / 2), cc.p(32, -20)));
    //     // menu.setPosition(-295,691);
    //
    //     return menu;
    // }

    // function setupLobbyButtons() {
    //     const Buy = new cc.Sprite(ReferenceName.BuyButton);
    //     const BuyDown = new cc.Sprite(ReferenceName.BuyButton);
    //
    //     const buyButton = new cc.MenuItemSprite(Buy, BuyDown, undefined, buyButtonPressed);
    //     const menu = new cc.Menu(buyButton);
    //     buyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, buyButton.getContentSize().height / 2), cc.p(0, 0)));
    //
    //     let fontDef = new cc.FontDefinition();
    //     fontDef.fontName = "Impact";
    //     //fontDef.fontWeight = "bold";
    //     fontDef.fontSize = "40";
    //     fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
    //     fontDef.fillStyle = new cc.Color(0, 0, 0, 255);
    //
    //     let label = new cc.LabelTTF(ReferenceName.LobbyBuyButton, fontDef);
    //     label.setAnchorPoint(0.5, 0.5);
    //     label.setPosition(buyButton.getContentSize().width / 2, buyButton.getContentSize().height / 2);
    //
    //     buyButton.addChild(label);
    //     // menu.setPosition(0,300);
    //     //buyButton.setPosition(cc.view.getDesignResolutionSize().width / 2,cc.view.getDesignResolutionSize().height / 2)
    //     //buyButton.setPosition(0,0);
    //
    //     //  var buyTest = new cc.Sprite(ReferenceName.BuyButton);
    //     //  parent.addChild(buyTest,9999999);
    //     //  buyTest.setPosition(cc.view.getDesignResolutionSize().width / 2,cc.view.getDesignResolutionSize().height / 2);
    //     //   parent.addChild(menu,5);
    //     return menu;
    // }

    let proto = LobbyView.prototype;

    function scrollLeft() {
        console.log("scroll left");
    }

    function scrollRight() {
        console.log("scrollRight");
    }

    function buyButtonPressed() {
        console.log("buyButtonPressed");
    }

    function messageButtonPressed() {
        console.log("messageButtonPressed");
    }

    function settingsButtonPressed() {
        // _settingsCallback();
        console.log("settingsButtonPressed");
    }

    function gameSelected(sender) {
        _onGameSelectedCallback(sender.getGameData());
        // sender.disableContent();
        // _gameButtonsForReset.push(sender);
        for (let button in gameControlList){
            gameControlList[button].disableContent();
        }
    }

    // function formatWithCommas(x) {
    //     // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //     return x.toLocaleString('en-US', {maximumFractionDigits: 2});
    // }

    proto.resetView = function () {
        // const length = _gameButtonsForReset.length;
        for (let button in gameControlList){
            gameControlList[button].resetView();
        }
        // _gameButtonsForReset = [];
    };

    proto.destroyView = function () {
        GameView.destroyView(this._parent);
    };

    proto.updatePlayerData = function (playerData) {
        let gold = Math.floor(playerData.playerState.score).toLocaleString('en-US', {maximumFractionDigits: 2});
        if (gold.length > 14) {
            gold = gold.substring(0,13) + "..";
        }
        if(gold != _goldLabel.getString()) {
            _goldLabel.setString(gold);
        }
    };

    return LobbyView;
}());
