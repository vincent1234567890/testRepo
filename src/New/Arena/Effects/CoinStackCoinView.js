/**
 * Created by eugeneseah on 28/2/17.
 */
const CoinStackCoinView = (function () {
    "use strict";

    //no need. what does this use?
    const CoinStackCoinView = function (parent, positionInArray) {
        if (!this._coinSprite) {
            this._coinSprite = new cc.Sprite(ReferenceName.CoinStackCoin);
            this._coinSprite.setAnchorPoint(0.5,0.5);
        }

        // this._coinSprite.setPosition(0, positionInArray * this._coinSprite.getContentSize().height);
        this._coinSprite.setPosition(0, positionInArray * 5);
        // console.log(this._coinSprite.getContentSize(), positionInArray, this._coinSprite.getContentSize(), positionInArray * this._coinSprite.getContentSize().height);
        this._parent = parent;
        this._coinSprite.stopAllActions();
        this._coinSprite.setOpacity(255);
        parent.addChild(this._coinSprite);
    };

    const proto = CoinStackCoinView.prototype;

    proto.getSpriteSize = function () {
        return this._coinSprite.getContentSize();
    };

    proto.getSpritePosition = function () {
        return this._coinSprite.getPosition();
    };

    proto.reclaimView = function () {
        this._parent.removeChild(this._coinSprite,false);
    };

    proto.runAction = function(sequence){
        this._coinSprite.runAction(sequence);
    };

    return CoinStackCoinView;
})();