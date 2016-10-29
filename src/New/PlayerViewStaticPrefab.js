/**
 * Created by eugeneseah on 27/10/16.
 */
"use strict";

var PlayerViewStaticPrefab = (function () {

    var PlayerViewStaticPrefab = cc.Sprite.extend({
        _className: "PlayerViewStaticPrefab",
        _cannonPowerLabel : null,

        //@param {node} parent
        //@param {Vector2} pos
        //@param {function} callback for cannon down
        //@param {function} callback for cannon up
        ctor: function (parent, cannonPositions, slot) {

            //Base
            cc.Sprite.prototype.ctor.call(this, ReferenceName.Base);

            var CannonPower = new cc.Sprite(ReferenceName.CannonPower);

            CannonPower.y = CannonPower.getContentSize().height/2;
            parent.addChild(CannonPower,25);


            parent.addChild(this,10);


            if (cannonPositions[slot][0] > cannonPositions[0][0]) {
                this.flippedX = true;
                this.x = cc.view.getDesignResolutionSize().width / 2 + this.getContentSize().width - 65;
                CannonPower.x = CannonPower.getContentSize().width/2 + 1;
            } else {
                this.x = cc.view.getDesignResolutionSize().width / 2 - this.getContentSize().width + 65;
                CannonPower.x = cc.view.getDesignResolutionSize().width - CannonPower.getContentSize().width/2 + 1;
            }

            if (cannonPositions[slot][1] > cannonPositions[0][1]){
                this.flippedY = true;
                this.y = cc.view.getDesignResolutionSize().height - this.getContentSize().height + 57;
                CannonPower.flippedY = true;
                CannonPower.y = cc.view.getDesignResolutionSize().height - CannonPower.getContentSize().height/2 + 1;
            }else {
                this.y = this.getContentSize().height - 57;
                CannonPower.y = CannonPower.getContentSize().height/2 - 1;
            }

            this._cannonPowerLabel = new cc.LabelAtlas("1", ImageName("ui_text_03.png"), 14, 20, '0');
            this.addChild(this._cannonPowerLabel);
            this._cannonPowerLabel.setPosition(0,0);
        },

        updateCannonPowerLabel : function (cannonPower) {
            this._cannonPowerLabel.setString(cannonPower);
        }

    });

    return PlayerViewStaticPrefab;
}());