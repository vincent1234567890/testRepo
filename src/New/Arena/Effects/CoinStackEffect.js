//Candidate for refactor
const CoinStackEffect = (function () {
    "use strict";
    let Offset;
    const _coinPool = new ObjectPool(CoinStackCoinView);

    // in milliseconds
    const PerCoinTiming = 100;
    const StackLifeTime = 3000;
    const FadeTime = 3;//seconds
    const MoveSpeed = 1;

    const CoinStackEffect = function (parent, arrayPosition, noOfCoins, valueToDisplay, animationEndedCallback) {
        const theme = ThemeDataManager.getThemeDataList("CannonPlatformPositions");
        if (!Offset) {
            Offset = theme.CoinStackOffset;
        }
        let moveAmount = this._moveAmount = 0;
        const coinStack = this._coinStack = [];
        let _startTime = Date.now();

        let currentCoinCount = 0;
        let isFadingOut = false;
        const callbackTarget = this;

        if (!this._parent) {
            this._parent = new cc.Node();

            this._coinValueLabel = new cc.LabelTTF("", "Arial", 15);
            this._coinValueLabel.setFontFillColor(new cc.Color(255, 192, 0, 255));

            this._coinValueLabel.enableStroke(new cc.Color(96, 64, 0, 255),2);
            this._parent.addChild(this._coinValueLabel,1);
            this._coinValueLabel.setAnchorPoint(0.5, -0.2);
            this._coinValueLabel.setOpacity(0);
        }
        const coinValueLabel = this._coinValueLabel;
        this._coinValueLabel.setString(valueToDisplay.toLocaleString('en-US', {maximumFractionDigits: 2}));
        const parentNode = this._parent;

        parentNode.update = function (dt) {
            if (callbackTarget._moveAmount > 0){
                parentNode.x += MoveSpeed;
                callbackTarget._moveAmount -= MoveSpeed;
            }
            const elapsed = (Date.now() - _startTime);
            if (elapsed > StackLifeTime) {
                if (!isFadingOut) {
                    for (let coin in coinStack) {
                        coinStack[coin].runAction(new cc.Sequence(new cc.FadeOut(FadeTime)));
                    }
                    parentNode.runAction(new cc.Sequence(new cc.DelayTime(FadeTime), new cc.CallFunc(callbackTarget.onStackAnimationEnded, callbackTarget)));
                    coinValueLabel.runAction(new cc.Sequence(new cc.FadeOut(FadeTime)));
                }
                isFadingOut = true;
                return;
            }
            if (currentCoinCount < noOfCoins && elapsed - PerCoinTiming * currentCoinCount > 0) {
                const coin = _coinPool.alloc(parentNode, currentCoinCount++);
                coinStack.push(coin);
                //spinning coin effect here
            } else if (currentCoinCount >= noOfCoins) { //remove if() for label moving effect
                coinValueLabel.setPosition(coinStack[coinStack.length - 1].getSpritePosition());
                coinValueLabel.setOpacity(255);
            }
        };

        this.onStackAnimationEnded = ()=> {
            let spriteSize = theme.CoinStackWidth;
            if(this._coinStack.length > 0) {
                // spriteSize = this._coinStack[0].getSpriteSize();
                for (let coin in this._coinStack) {
                    this._coinStack[coin].reclaimView();
                    _coinPool.free(this._coinStack[coin]);
                }
            }
            this._coinValueLabel.stopAllActions();
            this._coinValueLabel.setOpacity(0);
            this._coinStack = [];
            this._parent.getParent().removeChild(this._parent,false);
            this._parent.stopAllActions();
            this._parent.unscheduleUpdate();
            this._animationEndedCallback(this, spriteSize);
            this._animationEndedCallback = null;
        };

        this._parent.setPosition(Offset[0] + theme.CoinStackWidth * arrayPosition , Offset[1]);
        // console.log(this._parent.getPosition(), Offset[0], theme.CoinStackWidth, arrayPosition, Offset[1]);
        this._animationEndedCallback = animationEndedCallback;

        parent.addChild(this._parent);
        this._parent.scheduleUpdate();
    };

    const proto = CoinStackEffect.prototype;

    proto.move = function (moveAmount) {
        if (this._moveAmount <= 0) {
            // console.log("Move: moveAmount: ", moveAmount );
            this._moveAmount = moveAmount;
        }else{
            this._moveAmount += moveAmount;
        }
    };

    proto.stop = function (){
        // this._parent.stopAllActions();
        this.onStackAnimationEnded();
    };


    return CoinStackEffect;
})();