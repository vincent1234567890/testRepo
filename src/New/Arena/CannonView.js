/**
 * Created by eugeneseah on 25/10/16.
 */

"use strict";

const CannonView = (function () {

    let CannonView = cc.Sprite.extend({
        _className: "CannonView",
        _cannonPowerBG : null,
        _cannonPowerLabel: cc.LabelTTF,

        //@param {node} parent
        //@param {array[2]} pos
        ctor: function (parent, gameConfig, slot) {
            let pos;
            let markerPos;
            if (gameConfig.isUsingOldCannonPositions) {
                pos = gameConfig.oldCannonPositions[slot];
                markerPos = gameConfig.oldCannonPositions[0];
            }else{
                pos = gameConfig.cannonPositions[slot];
                markerPos = gameConfig.cannonPositions[0]
            }

            this._super(ReferenceName.Cannon1);
            parent.addChild(this, 20);

            this._cannonPowerBG = new cc.Sprite(ReferenceName.CannonPower);
            this._cannonPowerBG.y = this._cannonPowerBG.getContentSize().height / 2;
            parent.addChild(this._cannonPowerBG, 25);

            this.setAnchorPoint(0.5,0.4);
            this.setPosition({x: pos[0], y: pos[1]});
            // console.log(this.getPosition());

            let fontDef = new cc.FontDefinition();
            fontDef.fontName = "Arial";
            fontDef.fontSize = "32";
            fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            this._cannonPowerLabel = new cc.LabelTTF('', fontDef);

            this._cannonPowerBG.addChild(this._cannonPowerLabel, 29);
            this._cannonPowerLabel.setPosition(this._cannonPowerBG.getContentSize().width/2 , this._cannonPowerBG.getContentSize().height/2 - 5)
            // const midX = cc.view.getDesignResolutionSize().width / 2;
            // const midY = cc.view.getDesignResolutionSize().height / 2;

            // if (pos[0] > markerPos[0]) {
            //     CannonPower.x = midX * 2 - CannonPower.getContentSize().width / 2 + 1;
            // } else {
            //     CannonPower.x = CannonPower.getContentSize().width / 2;
            // }
            //
            // if (pos[1] > markerPos[1]) {
            //     CannonPower.flippedY = true;
            //     CannonPower.y = cc.view.getDesignResolutionSize().height - CannonPower.getContentSize().height / 2 + 1;
            // } else {
            //     CannonPower.y = CannonPower.getContentSize().height / 2 - 1;
            // }

            // const labelOffset = 30;

            if (pos[1] > markerPos[1]){
                let multiplier = 1;
                let diff = -30;
                if (pos[0] > markerPos[0]){
                    multiplier = -1;
                }
                this._cannonPowerBG.x = pos[0] + (diff * multiplier);
                this._cannonPowerBG.y = pos[1];
                this._cannonPowerBG.setRotation( multiplier * 90);
            }else{
                this._cannonPowerBG.x = pos[0];
                this._cannonPowerBG.y = pos[1] - 40;
            }


            // this._cannonPowerLabel.setPosition(CannonPower.getPosition());
        },

        updateCannonPowerLabel: function (cannonPower) {
            this._cannonPowerLabel.setString(String(cannonPower));
        },

        clearCannonPowerLabel: function () {
            this._cannonPowerLabel.setString('');
        },

        shootTo: function (angle) {
            this.setRotation( angle);
        },

        setupCannonChangeMenu: function (parent, cannonManager, gameConfig, slot, callbackCannonDown, callbackCannonUp) {
            let menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, cannonManager);
            let menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, cannonManager);


            let menu = new cc.Menu(menuLeft, menuRight);
            menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-92, -20)));
            menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(92, -20)));
            this._cannonPowerBG.addChild(menu, 50);

            // menu.y = this.getContentSize().height / 2 - 30;

            let pos;
            let markerPos;
            if (gameConfig.isUsingOldCannonPositions) {
                pos = gameConfig.oldCannonPositions[slot];
                markerPos = gameConfig.oldCannonPositions[0];
            }else{
                pos = gameConfig.cannonPositions[slot];
                markerPos = gameConfig.cannonPositions[0]
            }
            menu.x = -545;
            menu.y = 23 ;

            // menu.setPosition(this._cannonPowerLabel.getContentSize().width/2 , this._cannonPowerLabel.getContentSize().height/2)

            // const midX = cc.view.getDesignResolutionSize().width / 2;
            // const midY = cc.view.getDesignResolutionSize().height / 2;
            // if (pos[0] > markerPos[0]) {
            //     menu.x = markerPos[0];
            // } else {
            //     menu.x = markerPos[0];
            // }
            //
            // if (pos[1] > markerPos[1]) {
            //     menu.y = midY * 2 - 22;
            // } else {
            //     menu.y = 22;
            // }
        },
    });

    return CannonView;
}());