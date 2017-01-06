/**
 * Created by eugeneseah on 25/10/16.
 */



const CannonView = (function(){
    "use strict";
    const CannonView = function (parent, gameConfig, slot) {
        let pos;
        let markerPos;
        this._gameConfig = gameConfig;
        this._cannonNode = new cc.Node();

        if (gameConfig.isUsingOldCannonPositions) {
            pos = gameConfig.oldCannonPositions[slot];
            markerPos = gameConfig.oldCannonPositions[0];
        }else{
            pos = gameConfig.cannonPositions[slot];
            markerPos = gameConfig.cannonPositions[0]
        }

        this._sprite = new cc.Sprite(ReferenceName.Cannon1);
        this._spriteDown = new cc.Sprite(ReferenceName.CannonDown1);
        // this._spriteDown.setVisible(false);
        this._cannonNode.addChild(this._sprite, 20);
        this._cannonNode.addChild(this._spriteDown, 20);

        this._cannonPowerBG = new cc.Sprite(ReferenceName.CannonPower);
        this._cannonPowerBG.y = this._cannonPowerBG.getContentSize().height / 2;
        this._cannonNode.addChild(this._cannonPowerBG, 25);

        this._sprite.setAnchorPoint(0.5,0.4);
        this._sprite.setPosition({x: pos[0], y: pos[1]});
        this._spriteDown.setAnchorPoint(this._sprite.getAnchorPoint());
        this._spriteDown.setPosition(this._sprite.getPosition());

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = "32";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this._cannonPowerLabel = new cc.LabelTTF('', fontDef);

        this._cannonPowerBG.addChild(this._cannonPowerLabel, 29);
        this._cannonPowerLabel.setPosition(this._cannonPowerBG.getContentSize().width/2 , this._cannonPowerBG.getContentSize().height/2 - 5);


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

        parent.addChild(this._cannonNode,2);
        // this._cannonPowerLabel.setPosition(CannonPower.getPosition());
    };

    const proto = CannonView.prototype;

    proto.updateCannonPowerLabel = function (cannonPower) {
        this._cannonPowerLabel.setString(String(cannonPower));
        //Update cannon changes....
    };

    proto.clearCannonPowerLabel = function () {
        this._cannonPowerLabel.setString('');
    };


    proto.shootTo = function (angle) {
        const swapData = [ this._sprite, this._spriteDown];
        const sequence = new cc.Sequence(new cc.CallFunc(swapSpriteVisibility, this, swapData)
            , new cc.DelayTime(this._gameConfig.shootInterval / 2000)
            ,new cc.CallFunc(swapSpriteVisibility, this, swapData)
        );
        this._cannonNode.runAction(sequence);

        this._sprite.setRotation(angle);
        this._spriteDown.setRotation(angle);

        function swapSpriteVisibility (sender, data) {
            data[0].setVisible(!data[0].isVisible());
            data[1].setVisible(!data[0].isVisible());
        }
    };



    proto.setupCannonChangeMenu = function (parent, cannonManager, gameConfig, slot, callbackCannonDown, callbackCannonUp) {
        let menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, cannonManager);
        let menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, cannonManager);


        let menu = new cc.Menu(menuLeft, menuRight);
        menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-92, -20)));
        menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(92, -20)));
        this._cannonPowerBG.addChild(menu, 50);

        // menu.y = this.getContentSize().height / 2 - 30;

        // let pos;
        // let markerPos;
        // if (gameConfig.isUsingOldCannonPositions) {
        //     pos = gameConfig.oldCannonPositions[slot];
        //     markerPos = gameConfig.oldCannonPositions[0];
        // }else{
        //     pos = gameConfig.cannonPositions[slot];
        //     markerPos = gameConfig.cannonPositions[0]
        // }
        menu.x = -545;
        menu.y = 23 ;
    };

    return CannonView;
}());