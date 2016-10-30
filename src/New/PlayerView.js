/**
 * Created by eugeneseah on 26/10/16.
 */
"use strict";
var PlayerView = (function () {

    var PlayerView = function (parent, cannonPositions, slot, isPlayer, cannon) {
        this._cannon = cannon;
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
        this._playerViewStaticPrefabInstance = new PlayerViewStaticPrefab(parent, cannonPositions,slot );
        if (isPlayer) {
            setupCannonChangeMenu(parent, this._playerViewStaticPrefabInstance, cannonPositions, slot, this.cannonUp, this.cannonDown);
        }


        this._playerViewStaticPrefabInstance.updateCannonPowerLabel(this._cannon.getCurrentValue());


    };

    var setupCannonChangeMenu = function (parent, playerViewStaticPrefabInstance, cannonPositions, slot , callbackCannonDown, callbackCannonUp){
        var menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, this);
        var menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, this);


        var menu = new cc.Menu(menuLeft, menuRight);
        menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-92, -20)));
        menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(92, -20)));
        parent.addChild(menu, 50);

        // menu.y = this.getContentSize().height / 2 - 30;

        if (cannonPositions[slot][0] > cannonPositions[0][0]) {
            // menu.x = playerViewStaticPrefabInstance.getContentSize().width / 2 ;
            menu.x = cc.view.getDesignResolutionSize().width / 2 - 137;
        } else {
            console.log(playerViewStaticPrefabInstance.getContentSize().width);
            console.log(-cc.view.getDesignResolutionSize().width / 2);
            // menu.x = playerViewStaticPrefabInstance.x + playerViewStaticPrefabInstance.getContentSize().width;

            menu.x = -cc.view.getDesignResolutionSize().width / 2 + 137;
        }

        if (cannonPositions[slot][1] > cannonPositions[0][1]){
                menu.y = cc.view.getDesignResolutionSize().height - 22;
        }else {
                menu.y = 22 ;
        }

    };

    var bootStrapCannonUI = function(){

    }

    PlayerView.prototype.cannonUp = function(){
        console.log("callback");
        this._cannon.increaseCannon();
        this._playerViewStaticPrefabInstance.updateCannonPowerLabel(this._cannon.getCurrentValue());
    }

    PlayerView.prototype.cannonDown = function(){
        this._cannon.increaseCannon();
        this._playerViewStaticPrefabInstance.updateCannonPowerLabel(this._cannon.getCurrentValue());

    }

    // PlayerView.prototype.

    // var PlayerView = function () {
    //     initialise : initialise,
    // }

    return PlayerView;
}());