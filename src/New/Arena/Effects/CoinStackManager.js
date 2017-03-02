/**
 * Created by eugeneseah on 2/3/17.
 */
const CoinStackManager = (function () {
    "use strict";
    const _coinEffectPool = new ObjectPool(CoinStackEffect);

    const CoinStackManager = function (parent) {
        this._parent = new cc.Node();
        this._coinStackList = [];
        parent.addChild(this._parent);
    };

    const proto = CoinStackManager.prototype;

    proto.AddStack = function (numberOfCoins, valueToDisplay) {


    };


    return CoinStackManager;
}());