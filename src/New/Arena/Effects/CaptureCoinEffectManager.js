/**
 * Created by eugeneseah on 21/2/17.
 */
const CaptureCoinEffectManager = (function () {
    "use strict";
    const padding = 7;
    const animationPerFrameSpeed = 0.05;

    const explodeLifetime = 0.5; // seconds
    const explodeRadius = 100;
    const collectDelay = 0.1;
    const collectLifetime = 1;
    const gravity = 0.9;
    const offsetPerCoin = 0.2;

    let _coinViewPool;
    let _prizeLabelPool;

    const randomMax = 1.5;
    const randomMin = 0.5;
    const CaptureCoinEffectManager = function () {
        this._parent = new cc.Node();
        GameView.addView(this._parent, 3);
        _coinViewPool = new ObjectPool(SpinningCoinView);
        _prizeLabelPool = new ObjectPool(PrizeLabelObject);

        //coin animation frames
        let animationArray = [];
        let animationFrames = 0;
        while (true) {
            let frameCount = String(animationFrames);
            while (frameCount.length < padding) {
                frameCount = '0' + frameCount;
            }
            const frame = cc.spriteFrameCache.getSpriteFrame("Coin" + frameCount + ".png");
            if (!frame) {
                break;
            }
            animationArray.push(frame);
            animationFrames++;
        }
        this.animation = new cc.Animate(new cc.Animation(animationArray, animationPerFrameSpeed));
    };

    const proto = CaptureCoinEffectManager.prototype;

    proto.triggerCoins = function (pos, target, fish) {
        // console.log(pos);
        const label = _prizeLabelPool.alloc(this._parent, fish.value);
        setupView(label, label.getTargetNode(), pos, Math.PI / 2, target, undefined, collectLifetime/10,
            collectDelay * 10 * fish.coinsShown * offsetPerCoin * randomMax, collectLabel);
        for (let i = 0; i < fish.coinsShown; i++) {
            const coin = _coinViewPool.alloc(this._parent, this.animation.clone());
            setupView(coin, coin.getTargetNode(), pos, 2 * Math.PI / (fish.coinsShown) * (i + 1),
                target, this.animation.clone(), collectLifetime * (i + 1) / fish.coinsShown * parseFloat(getRandom()),
                collectDelay * 10 * (fish.coinsShown - i) * offsetPerCoin * parseFloat(getRandom()), collectCoins);
        }
    };

    function getRandom() {
        return (Math.random() * (randomMax - randomMin) + randomMin).toFixed(4);
    }

    function collectCoins(coin) {
        // this._label.setVisible(false);
        coin.reclaimView();
        _coinViewPool.free(coin);
    }

    function collectLabel(label) {
        label.reclaimView();
        _prizeLabelPool.free(label);
    }

    const PrizeLabelObject = (function () {
        // const _gravity = 9;
        function PrizeLabelObject(parent, value) {
            //prize amount font def
            if (!this._label) {
                this._label = new cc.LabelBMFont(value, res.InGameLightGoldFontFile);
                this._label.setScale(0.5);
            }

            this._parent = parent;
            this._parent.addChild(this._label, 1);

            this._label.setString(value);
            this._label.setVisible(true);
        }

        const proto = PrizeLabelObject.prototype;

        proto.getTargetNode = function () {
            return this._label;
        };

        proto.reclaimView = function () {
            this._label.unscheduleAllCallbacks();//experimental
            this._label.setVisible(false);
            this._parent.removeChild(this._label, false);
        };

        return PrizeLabelObject;
    }());

    function setupView(viewObject, viewTarget, pos, angle, target, animation, delay, collectDelay, callback) {
        viewTarget.setPosition(pos);

        const movement = new cc.Sequence(
            new cc.DelayTime(delay),
            new cc.JumpTo(explodeLifetime,
                cc.p(pos.x + explodeLifetime * Math.cos(angle) * explodeRadius,
                    pos.y + explodeLifetime * Math.sin(angle) * explodeRadius
                    - gravity / 2 * Math.pow(explodeLifetime, 2)), 50, 1),
            new cc.DelayTime(collectDelay),
            new cc.MoveTo(collectLifetime, cc.p(target[0], target[1])),
            new cc.CallFunc(onMovementEnd)
        );

        function onMovementEnd() {
            callback(viewObject);
        }

        viewTarget.runAction(movement);

        if (animation) {
            viewTarget.runAction(cc.repeatForever(animation));
        }
    }

    return CaptureCoinEffectManager;
}());