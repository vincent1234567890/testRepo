/**
 * Created by eugeneseah on 28/2/17.
 */

const CoinStackEffect = (function () {
    "use strict";
    let Offset;
    const _coinPool = new ObjectPool(CoinStackCoinView);

    // in milliseconds
    const PerCoinTiming = 100;
    const StackLifeTime = 3000;
    const FadeTime = 3;//seconds

    const CoinStackEffect = function (parent, noOfCoins, valueToDisplay) {
        if (!Offset){
            Offset = ThemeDataManager.getThemeDataList("CannonPlatformPositions").CoinStackOffset;
        }
        const coinStack = this._coinStack = [];
        this.__parent = parent;
        let _startTime = Date.now();
        let _coinStartTime = Date.now();
        let _noOfCoins = noOfCoins;
        let currentCoinCount = 0;
        let isFadingOut = false;
        const callbackTarget = this;
        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        //fontDef.fontWeight = "bold";
        fontDef.fontSize = "26";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0,0,0,255);


        if (!this._parent){
            const parentNode = this._parent = new cc.Node();
            const coinValueLabel = this._coinValueLabel = new cc.LabelTTF(valueToDisplay , fontDef);
            this._parent.addChild(coinValueLabel);
            coinValueLabel.setAnchorPoint(0.5,0)
            // parentNode.setCascadeOpacityEnabled(true);
            parentNode.update = function (dt) {
                // console.log("the");
                const elapsed = (Date.now() - _startTime);
                if(elapsed > StackLifeTime ){
                    if (!isFadingOut) {
                        for ( let coin in coinStack){
                            coinStack[coin].RunAction(new cc.Sequence(new cc.FadeOut(FadeTime)));
                        }
                        parent.runAction(new cc.Sequence(new cc.DelayTime(FadeTime), new cc.CallFunc(OnStackAnimationEnded, callbackTarget)));
                    }
                    isFadingOut = true;
                    return;
                }
                if(currentCoinCount < noOfCoins && elapsed - PerCoinTiming * currentCoinCount > 0 ){
                    const coin = _coinPool.alloc(parentNode, currentCoinCount++);
                    console.log("coin added"  , currentCoinCount, noOfCoins, elapsed, elapsed - PerCoinTiming * currentCoinCount);
                    coinStack.push(coin);
                }else if (currentCoinCount >= noOfCoins){
                    coinValueLabel.setPosition(coinStack[coinStack.length-1].GetSpritePosition());
                    coinValueLabel.setVisible(true);
                    //Label number here

                    // coinStack[currentCoinCount].getPosition().y
                }

                //spinning coin effect here
            };
        }
        this._parent.setPosition(Offset[0],Offset[1]);
        this._parent.scheduleUpdate();
        // this._parent.setOpacity(255);

        // const coin = _coinPool.alloc(this._parent,);
        parent.addChild(this._parent);
    };

    function OnStackAnimationEnded(){
        for ( let coin in this._coinStack){
            this._coinStack[coin].ReclaimView();
            _coinPool.free(this._coinStack[coin]);
        }
        this._coinValueLabel.setVisible(false);
        this._coinStack = [];
        this._parent.unscheduleUpdate();
    }



    const proto = CoinStackEffect.prototype;



    return CoinStackEffect;
})();