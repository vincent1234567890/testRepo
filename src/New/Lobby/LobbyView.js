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

    const LobbyView = function (playerData, theme, onGameSelectedCallback) {
        const _parent = new cc.Node();
        GameView.addView(_parent);

        _theme = theme;
        _onGameSelectedCallback = onGameSelectedCallback;

        const length = cc.view.getDesignResolutionSize().width;
        const height = cc.view.getDesignResolutionSize().height;

        const clippy = new DolphinClippy();

        const bg = new cc.Sprite(ReferenceName.LobbyBackground);
        bg.setPosition(length / 2, height / 2 + 70);
        _parent.addChild(bg, -5);

        const NameBG = new cc.Sprite(ReferenceName.NameBG);
        NameBG.setPosition(100,550);
        bg.addChild(NameBG,1);

        let displayName = playerData.playerState.displayName;
        if (displayName.length > 14) {
            displayName = displayName.substring(0,12) + "..";
        }

        const label = new cc.LabelTTF(displayName , "Arial", 22);
        label._setFontWeight("bold");
        label.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        label.setAnchorPoint(0.5, 0.5);

        NameBG.addChild(label);
        label.setPosition(NameBG.width/2,NameBG.height/2);

        const LobbyCoinsBG = new cc.Sprite(ReferenceName.LobbyCoinsBG);
        LobbyCoinsBG.setPosition(320,550);
        bg.addChild(LobbyCoinsBG,2);

        _goldLabel = new cc.LabelTTF(" ", "Arial", 30);
        _goldLabel.setFontFillColor(new cc.Color(255,205,60,255));
        LobbyCoinsBG.addChild(_goldLabel);
        _goldLabel._setFontWeight("bold");
        _goldLabel.enableStroke(new cc.Color(90, 24, 8, 255), 3);
        _goldLabel.setPosition(120,27);

        const gameList = setupGameList();
        _parent.addChild(gameList, 2);

        const target = new cc.Sprite();
        target.setBlendFunc(cc.ONE, cc.ONE);
        const causticAnimation = GUIFunctions.getAnimation(ReferenceName.LobbyCaustics,0.05);
        target.runAction(new cc.repeatForever(causticAnimation));
        target.setPosition(length/2,height/2);
        _parent.addChild(target,-10);

        this.updatePlayerData(playerData);

        cc.audioEngine.playMusic(res.LobbyBGM, true);
    };

    function setupGameList() {
        const width = cc.winSize.width;  //cc.view.getDesignResolutionSize().width;
        const height = cc.winSize.height; //cc.view.getDesignResolutionSize().height;
        
        gameControlList = [];

        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        listView.setContentSize(cc.size(width, height));
        listView.setAnchorPoint(cc.p(0.5, 0.5));
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
        for (let button in gameControlList){
            gameControlList[button].disableContent();
        }
    }

    proto.resetView = function () {
        for (let button in gameControlList){
            gameControlList[button].resetView();
        }
        cc.audioEngine.playMusic(res.LobbyBGM, true);
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
