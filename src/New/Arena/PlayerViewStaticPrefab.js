/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";

var PlayerViewStaticPrefab = (function () {

    var PlayerViewStaticPrefab = cc.Sprite.extend({
        _className: "PlayerViewStaticPrefab",
        _playerName : cc.LabelTTF,

        //@param {node} parent
        //@param {Vector2} pos
        //@param {function} callback for cannon down
        //@param {function} callback for cannon up
        ctor: function (parent, pos) {

            //Base
            cc.Sprite.prototype.ctor.call(this, ReferenceName.Base);
            parent.addChild(this,10);

            //coin icon
            var coinIcon = new cc.Sprite(ReferenceName.CoinIcon);
            this.addChild(coinIcon);


            var fontDef = new cc.FontDefinition();
            fontDef.fontName = "Arial";
            fontDef.fontSize = 32;
            fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;

            this._playerName = new cc.LabelTTF('', fontDef);
            this._playerName.setDimensions(cc.size(170,35));
            this.addChild(this._playerName,1);

            this._gold = new cc.LabelTTF('', fontDef);
            this._gold.setDimensions(cc.size(170,35));
            this.addChild(this._gold,1);

            this._gem = new cc.LabelTTF('', fontDef);
            this._gem.setDimensions(cc.size(60,35));
            this.addChild(this._gem,1);

            var midX = cc.view.getDesignResolutionSize().width / 2;
            var midY = cc.view.getDesignResolutionSize().height /2;
            var thisSizeX = this.getContentSize().width;
            var thisSizeY = this.getContentSize().height;
            if (pos[0] > midX) {
                this.flippedX = true;
                this.x = midX + thisSizeX - 65;
                coinIcon.x = thisSizeX -300;
                this._playerName.x = midX - thisSizeX - 75;
                this._gold.x = midX - thisSizeX - 60;
                this._gem.x = midX - thisSizeX + 80;
            } else {
                this.x = midX  - thisSizeX + 65;
                coinIcon.x = 300;
                this._playerName.x = thisSizeX - 75;
                this._gold.x = thisSizeX - 80;
                this._gem.x = thisSizeX - 180;
            }

            if (pos[1] > midY){
                this.flippedY = true;
                this.y = midY *2 - thisSizeY + 57;
                coinIcon.y = thisSizeY - 25;
                this._playerName.y = thisSizeY - 80;
            }else {
                this.y = thisSizeY - 57;
                coinIcon.y = 25;
                this._playerName.y = 80;
            }
            this._gold.y = coinIcon.y;
            this._gem.y = this._playerName.y;

            // coinIcon.setPosition( this.getContentSize() + cc.p(-));




        },

        updatePlayerData: function (playerData) {
            let nameToShow = playerData.name;
            if (nameToShow.length > 9) {
                nameToShow = nameToShow.substring(0,7) + "..";
            }
            this._playerName.setString(nameToShow);
            this._gold.setString(Math.floor(playerData.score));
            this._gem.setString(0);
        }


    });

    return PlayerViewStaticPrefab;
}());