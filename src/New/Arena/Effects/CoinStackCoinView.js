/**
 * Created by eugeneseah on 28/2/17.
 */
const CoinStackCoinView = (function () {
    "use strict";

    const CoinStackCoinView = function (parent, positionInArray) {
        if (!this._coinSprite) {
            this._coinSprite = new cc.Sprite(ReferenceName.CoinStackCoin);
            this._coinSprite.setAnchorPoint(0.5,0.5);
        }

        this._coinSprite.setPosition(0, positionInArray * this._coinSprite.getContentSize().height);
        console.log(this._coinSprite.getPosition(), positionInArray, this._coinSprite.getContentSize(), positionInArray * this._coinSprite.getContentSize().height);
        this._parent = parent;
        this._coinSprite.stopAllActions();
        this._coinSprite.setOpacity(255);
        parent.addChild(this._coinSprite);
    };

    const proto = CoinStackCoinView.prototype;

    proto.GetSpriteSize = function () {
        return this._coinSprite.getContentSize();
    };

    proto.GetSpritePosition = function () {
        return this._coinSprite.getPosition();
    };

    proto.ReclaimView = function () {
        this._parent.removeChild(this._coinSprite,false);
    };

    proto.RunAction = function(sequence){
        this._coinSprite.runAction(sequence);
    };

    return CoinStackCoinView;
})();