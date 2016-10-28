/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";

var PlayerViewStaticPrefab = (function () {

    var PlayerViewStaticPrefab = cc.Sprite.extend({
        _className: "PlayerViewStaticPrefab",

        //@param {node} parent
        //@param {Vector2} pos
        //@param {function} callback for cannon down
        //@param {function} callback for cannon up
        ctor: function (parent, pos, callbackCannonDown, callbackCannonUp, cannonPositions, slot , isPlayer) {

            //Base
            cc.Sprite.prototype.ctor.call(this, ReferenceName.Base);



            parent.addChild(this,99999);

            //+/- for cannon
            //?
            // this.setAnchorPoint(cc.p(0.5, 0.5));

            var menu;
            if (isPlayer) {
                var menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, this);
                var menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, this);


                var menu = new cc.Menu(menuLeft, menuRight);
                menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-70, -20)));
                menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(70, -20)));
                this.addChild(menu, 10);

                menu.y = this.getContentSize().height / 2 - 30;
            }

            // if(!cannonPositions[slot][1] > cannonPositions[0][1]) {
                if (cannonPositions[slot][0] > cannonPositions[0][0]) {
                    this.flippedX = true;
                    this.x = cc.view.getDesignResolutionSize().width / 2 + this.getContentSize().width - 50;
                    if (menu) {
                        menu.x = -this.getContentSize().width / 2;
                    }
                    // menu.setPosition(, this.getContentSize().height / 2 - 30);

                } else {
                    this.x = pos.x;
                    if(menu) {
                        menu.x = -this.getContentSize().width - 70;
                    }

                }

                if (cannonPositions[slot][1] > cannonPositions[0][1]){
                    this.flippedY = true;
                    this.y = cc.view.getDesignResolutionSize().height - this.getContentSize().height + 57;
                }else {
                    this.y = pos.y;

                }
            // }else{
            //
            //
            // }
        },

    });

    return PlayerViewStaticPrefab;
}());