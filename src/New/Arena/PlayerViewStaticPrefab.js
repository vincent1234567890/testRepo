/**
 * Created by eugeneseah on 27/10/16.
 */


const PlayerViewStaticPrefab = (function () {
    "use strict";
    //@param {node} parent
    //@param {Vector2} pos
    //@param {function} callback for cannon down
    //@param {function} callback for cannon up
    const PlayerViewStaticPrefab = function(gameConfig, slot){
        this._parent = new cc.Node();
        GameView.addView(this._parent,1);

        const themeData = ThemeDataManager.getThemeDataList("CannonPlatformPositions");

        const base = this._base = new cc.Sprite(ReferenceName.Base);
        this._parent.addChild(base);

        //coin icon
        const coinIcon = new cc.Sprite(ReferenceName.CoinIcon);
        base.addChild(coinIcon);

        const fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = 20;
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;

        this._playerName = new cc.LabelTTF('', fontDef);
        this._playerName.setDimensions(cc.size(210,35));
        this._playerName.setAnchorPoint(0,0.5);
        base.addChild(this._playerName,1);

        this._gold = new cc.LabelTTF('', fontDef);
        this._gold.setDimensions(cc.size(170,35));
        this._gold.setAnchorPoint(0,0.5);
        base.addChild(this._gold,1);

        //
        let pos;
        let markerPos;
        if (gameConfig.isUsingOldCannonPositions) {
            pos = gameConfig.oldCannonPositions[slot];
            markerPos = gameConfig.oldCannonPositions[0];
        }else{
            pos = gameConfig.cannonPositions[slot];
            markerPos = gameConfig.cannonPositions[0]
        }

        this._parent.x = pos[0]+ themeData["Base"][0];
        this._parent.y = pos[1]+ themeData["Base"][1];
        this._gold.x = themeData["Gold"][0];
        this._gold.y = themeData["Gold"][1];
        this._playerName.x = themeData["PlayerName"][0];
        this._playerName.y = themeData["PlayerName"][1];

        if (pos[1] > markerPos[1]) {
            this._parent.y = pos[1]+ themeData["Base"][0];
            if (pos[0] > markerPos[0]){
                this._parent.x = pos[0]- themeData["Base"][1];
                this._parent.setRotation(-90);
            }else {
                this._parent.setRotation(90);
                this._parent.x = pos[0]+ themeData["Base"][1];

            }
        }
    };

    const proto = PlayerViewStaticPrefab.prototype;

    proto.updatePlayerData = function (playerData) {
        let nameToShow = playerData.name;
        if (nameToShow.length > 12) {
            nameToShow = nameToShow.substring(0,10) + "..";
        }
        this._playerName.setString(nameToShow);
        const goldAmount = parseFloat(this._gold.getString());
        if ( playerData.score > goldAmount){
            this.AnimateCoinStack(playerData.score - goldAmount);
        }
        this._gold.setString(Math.floor(playerData.score));
        // this._gem.setString(0);
    };

    proto.clearPlayerData = function () {
        this._playerName.setString('');
        this._gold.setString('');
        // this._gem.setString('');
    };

    proto.destroyView = function () {
        GameView.destroyView(this._parent);
    };
    
    proto.AnimateCoinStack = function ( increase ) {
        // const coinStack = [];
        // const deckStacks = [];

        const coinStack = new CoinStackEffect(this._parent, 15,increase);
    };


    return PlayerViewStaticPrefab;
}());