/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";

const PlayerViewStaticPrefab = (function () {
    //@param {node} parent
    //@param {Vector2} pos
    //@param {function} callback for cannon down
    //@param {function} callback for cannon up
    const PlayerViewStaticPrefab = function(gameConfig, slot){
        this._parent = new cc.Node();
        GameView.addView(this._parent,1);

        const themeData = ThemeDataManager.getThemeDataList("CannonPlatformPositions");

        const base = new cc.Sprite(ReferenceName.Base);
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

        // this._gem = new cc.LabelTTF('', fontDef);
        // this._gem.setDimensions(cc.size(60,35));
        // this.addChild(this._gem,1);

        const midX = cc.view.getDesignResolutionSize().width / 2;
        const midY = cc.view.getDesignResolutionSize().height /2;
        const thisSizeX = base.getContentSize().width;
        const thisSizeY = base.getContentSize().height;

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

        // if (pos[0] > markerPos[0]) {
        //     // this.flippedX = true;
        //     base.x = midX + thisSizeX - 65;
        //     coinIcon.x = 300;
        //     this._gold.x = thisSizeX - 165;
        //     this._playerName.x = thisSizeX - 245;
        //     // this._gem.x = midX - thisSizeX + 80;
        //
        //     // base.x =  pos[0] - themeData["Base"][0];
        //     // this._playerName.x = pos[0] -themeData["PlayerName"][0] + pos[0];
        // } else {
        //     base.flippedX = true;
        //     base.x = midX - thisSizeX + 65;
        //
        //     coinIcon.x = thisSizeX - 300;
        //     this._gold.x = midX - thisSizeX - 145;
        //     this._playerName.x = this._gold.x;
        //
        //
        //     // base.x =  pos[0]+ themeData["Base"][0];
        //     // this._playerName.x = pos[0] themeData["PlayerName"][0] + pos[0];
        //     // this._gem.x = thisSizeX - 180;
        // }
        //
        //
        //
        // if (pos[1] > markerPos[1]) {
        //     if (gameConfig.isUsingOldCannonPositions) {
        //         base.flippedY = true;
        //         base.y = midY * 2 - thisSizeY + 57;
        //         coinIcon.y = thisSizeY - 25;
        //         this._playerName.y = thisSizeY - 80;
        //     }else{
        //         if (pos[0] > midX){
        //             base.setRotation(-90);
        //             base.x = midX * 2 - thisSizeY/2;
        //         }else {
        //             base.setRotation(90);
        //             base.x = thisSizeY/2;
        //         }
        //         base.y = midY - thisSizeY + 180;
        //         coinIcon.y = 25;
        //         this._playerName.y = 80;
        //     }
        // } else {
        //     base.y = thisSizeY - 57;
        //     coinIcon.y = 25;
        //     this._playerName.y = 80;
        // }

        base.x = pos[0]+ themeData["Base"][0];
        base.y = pos[1]+ themeData["Base"][1];
        this._gold.x = themeData["Gold"][0];
        this._gold.y = themeData["Gold"][1];
        this._playerName.x = themeData["PlayerName"][0];
        this._playerName.y = themeData["PlayerName"][1];

        if (pos[0] > markerPos[0]) {

        }else{

        }

        if (pos[1] > markerPos[1]) {
            base.y = pos[1]+ themeData["Base"][0];
            if (pos[0] > markerPos[0]){
                base.x = pos[0]- themeData["Base"][1];
                base.setRotation(-90);
            }else {
                base.setRotation(90);
                base.x = pos[0]+ themeData["Base"][1];

            }
        }else{

            // base.flippedY = true;
        }



        // console.log(themeData["Base"]);
        // base.setPosition(themeData["Base"][0],themeData["Base"][1]);
        // this._gold.y = coinIcon.y;

        // console.log("base:", base.getPosition(), "this._playerName:", this._playerName.getPosition(), "this._gold:", this._gold.getPosition());

        // this._gem.y = this._playerName.y;

        // coinIcon.setPosition( this.getContentSize() + cc.p(-));
    };

    const proto = PlayerViewStaticPrefab.prototype;

    proto.updatePlayerData = function (playerData) {
        let nameToShow = playerData.name;
        if (nameToShow.length > 12) {
            nameToShow = nameToShow.substring(0,10) + "..";
        }
        this._playerName.setString(nameToShow);
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


    return PlayerViewStaticPrefab;
}());
