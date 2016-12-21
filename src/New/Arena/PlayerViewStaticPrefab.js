/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";

const PlayerViewStaticPrefab = (function () {

    const PlayerViewStaticPrefab = cc.Sprite.extend({
        _className: "PlayerViewStaticPrefab",
        _playerName : cc.LabelTTF,

        //@param {node} parent
        //@param {Vector2} pos
        //@param {function} callback for cannon down
        //@param {function} callback for cannon up
        ctor: function (parent, gameConfig, slot) {


            //Base
            cc.Sprite.prototype.ctor.call(this, ReferenceName.Base);
            parent.addChild(this,1);

            //coin icon
            const coinIcon = new cc.Sprite(ReferenceName.CoinIcon);
            this.addChild(coinIcon);


            const fontDef = new cc.FontDefinition();
            fontDef.fontName = "Arial";
            fontDef.fontSize = 32;
            fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;

            this._playerName = new cc.LabelTTF('', fontDef);
            this._playerName.setDimensions(cc.size(210,35));
            this._playerName.setAnchorPoint(0,0.5);
            this.addChild(this._playerName,1);

            this._gold = new cc.LabelTTF('', fontDef);
            this._gold.setDimensions(cc.size(170,35));
            this._gold.setAnchorPoint(0,0.5);
            this.addChild(this._gold,1);

            // this._gem = new cc.LabelTTF('', fontDef);
            // this._gem.setDimensions(cc.size(60,35));
            // this.addChild(this._gem,1);

            const midX = cc.view.getDesignResolutionSize().width / 2;
            const midY = cc.view.getDesignResolutionSize().height /2;
            const thisSizeX = this.getContentSize().width;
            const thisSizeY = this.getContentSize().height;

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

            if (pos[0] > markerPos[0]) {
                // this.flippedX = true;
                this.x = midX + thisSizeX - 65;
                coinIcon.x = 300;
                this._gold.x = thisSizeX - 165;
                this._playerName.x = thisSizeX - 245;
                // this._gem.x = midX - thisSizeX + 80;
            } else {
                this.flippedX = true;
                this.x = midX - thisSizeX + 65;

                coinIcon.x = thisSizeX - 300;
                this._gold.x = midX - thisSizeX - 145;
                this._playerName.x = this._gold.x;

                // this._gem.x = thisSizeX - 180;
            }

            if (pos[1] > markerPos[1]) {
                if (gameConfig.isUsingOldCannonPositions) {
                    this.flippedY = true;
                    this.y = midY * 2 - thisSizeY + 57;
                    coinIcon.y = thisSizeY - 25;
                    this._playerName.y = thisSizeY - 80;
                }else{
                    if (pos[0] > midX){
                        this.setRotation(-90);
                        this.x = midX * 2 - thisSizeY/2;
                    }else {
                        this.setRotation(90);
                        this.x = thisSizeY/2;
                    }
                    this.y = midY - thisSizeY + 180;
                    coinIcon.y = 25;
                    this._playerName.y = 80;
                }
            } else {
                this.y = thisSizeY - 57;
                coinIcon.y = 25;
                this._playerName.y = 80;
            }
            this._gold.y = coinIcon.y;


            // this._gem.y = this._playerName.y;

            // coinIcon.setPosition( this.getContentSize() + cc.p(-));
        },

        updatePlayerData: function (playerData) {
            let nameToShow = playerData.name;
            if (nameToShow.length > 12) {
                nameToShow = nameToShow.substring(0,10) + "..";
            }
            this._playerName.setString(nameToShow);
            this._gold.setString(Math.floor(playerData.score));
            // this._gem.setString(0);
        },

        clearPlayerData: function () {
            this._playerName.setString('');
            this._gold.setString('');
            // this._gem.setString('');
        },

    });

    return PlayerViewStaticPrefab;
}());