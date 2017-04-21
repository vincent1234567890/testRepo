/**
 * Created by eugeneseah on 15/11/16.
 */
const LobbyView = (function () {
    "use strict";

    const numberOfLobbyButtonsShown = 3;

    let _theme;

    let _onGameSelectedCallback;

    let _goldLabel;

    let gameControlList;

    const LobbyView = function (playerData, loginData, theme, onGameSelectedCallback) {
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

        let label = new cc.LabelTTF(loginData.displayName , fontDef);
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

        const gameList = setupGameList();
        this._parent.addChild(gameList, 2);

        /* testing
         */
        cc.spriteFrameCache.addSpriteFrames(res.testingEffect);
        const animation = GUIFunctions.getAnimation("FREffect_",0.03);
        const animationSequence = new cc.RepeatForever(animation,new cc.callFunc(onAnimationEnd));
        const test = new cc.Sprite();
        test.setPosition(400,400);
        this._parent.addChild(test,100);
        test.runAction(animationSequence);

        function onAnimationEnd() {

        }


        this.updatePlayerData(playerData);
    };

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

    let proto = LobbyView.prototype;


    function gameSelected(sender) {
        _onGameSelectedCallback(sender.getGameData());
        // sender.disableContent();
        // _gameButtonsForReset.push(sender);
        for (let button in gameControlList){
            gameControlList[button].disableContent();
        }
    }

    proto.resetView = function () {
        for (let button in gameControlList){
            gameControlList[button].resetView();
        }
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
