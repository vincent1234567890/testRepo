/**
 * Created by eugeneseah on 2/3/17.
 */
const CoinStackManager = (function () {
    "use strict";
    const _coinEffectPool = new ObjectPool(CoinStackEffect);
    const animationLength = 1000;

    const CoinStackManager = function (parent) {
        this._parent = new cc.Node();
        this._coinStackList = new Queue();
        parent.addChild(this._parent);
        this._parent.setPosition(0,0);

        this._animationEnded = (stack, spriteSize) => {
            const coin = this._coinStackList.dequeue();
            _coinEffectPool.free(coin);

            const stacks = this._coinStackList.getQueue();
            for (let i in stacks) {
                stacks[i].Move(spriteSize.width);
            }
        };
    };

    const proto = CoinStackManager.prototype;

    proto.addStack = function (numberOfCoins, valueToDisplay) {
        const coin = _coinEffectPool.alloc(this._parent, this._coinStackList.getLength() , numberOfCoins, valueToDisplay, this._animationEnded);
        this._coinStackList.enqueue(coin);
    };

    return CoinStackManager;
}());