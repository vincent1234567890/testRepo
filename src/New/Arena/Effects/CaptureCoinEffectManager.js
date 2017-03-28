/**
 * Created by eugeneseah on 21/2/17.
 */
const CaptureCoinEffectManager = (function () {
    "use strict";
    const padding = 7;
    const animationPerFrameSpeed = 0.05;
    // const numberOfCoins = 8;

    const explodeLifetime = 0.2; // seconds
    const collectDelay = 0.1;
    const collectLifetime = 1;
    const velocity = 1.5;
    const gravity = 0.9;
    const offsetPerCoin = 0.2;

    let animationFrames;

    let _coinViewPool;
    let _prizeLabelPool;


    const CaptureCoinEffectManager = function () {
        this._parent = new cc.Node();
        GameView.addView(this._parent);
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
        // animationArray.push(cc.spriteFrameCache.getSpriteFrame("Coin" + frameCount + ".png"));
        this.animation = new cc.Animate(new cc.Animation(animationArray, animationPerFrameSpeed));
    };

    const proto = CaptureCoinEffectManager.prototype;

    proto.triggerCoins = function (pos, target, fish) {
        // console.log(pos);
        const label = _prizeLabelPool.alloc(this._parent, fish.value);
        setupView(label, label.getTargetNode(), pos, Math.PI / 2, target, undefined, collectLabel, velocity, explodeLifetime * 10, collectDelay*10, collectLifetime * 10, collectLifetime * 10 , gravity);
        for (let i = 0; i < fish.coinsShown; i++) {
            const coin = _coinViewPool.alloc(this._parent, this.animation.clone());
            // coin.startCoinAnimation(pos,(180/(numberOfCoins+2))*(i+1), target, collectCoins);
            setupView(coin, coin.getTargetNode(),
                pos, 2 * Math.PI / (fish.coinsShown) * (i + 1), target, this.animation.clone(), collectCoins,
                velocity * 10, explodeLifetime * 10, collectDelay *10 * (fish.coinsShown -i), collectLifetime * 10, collectLifetime * 10 * (i+1)/fish.coinsShown, gravity);
        }
    };

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

                let fontDef = new cc.FontDefinition();
                fontDef.fontName = "Impact";
                fontDef.fontWeight = "bold";
                fontDef.fontSize = "32";
                fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                fontDef.fillStyle = new cc.Color(255, 192, 0, 255);

                this._label = new cc.LabelTTF("", fontDef);
                // this._label = new cc.LabelBMFont("", res.GoldenNumbersPlist);
                // this._label = new cc.LabelBMFont("",res.TestFont);
                this._label.enableStroke(new cc.Color(96, 64, 0, 255), 2);


                // this._label._explodeLifeTime = explodeLifetime * 10;
                // this._label._collectionLifetime = collectLifetime * 10;
                // this._label._gravity = 0.9; // to be injected
                // this._label._velocity = 10; // to be injected
            }
            // this._label._pos = pos;

            // this._label._labelStartTime = Date.now();
            // this._label._target = target;
            // this._label.setPosition(pos);
            this._parent = parent;
            this._parent.addChild(this._label, 1);

            this._label.setString(value);
            // this._label.setString("HELLO");
            this._label.setVisible(true);
            // this._label.scheduleUpdate();
            // this._label.update = labelMovement;

        }

        const proto = PrizeLabelObject.prototype;

        proto.getTargetNode = function () {
            return this._label;
        };

        // function labelMovement(){
        //     const elapsed = (Date.now() - this._labelStartTime)/100;
        //     // console.log(elapsed);
        //     if (elapsed < this._explodeLifeTime) {
        //         //this works:
        //         // this.y = this._pos.y /*+ this._velocity * elapsed*/ - this._gravity / 2 * Math.pow(elapsed, 2);
        //         // console.log(this.y, elapsed, this._explodeLifeTime);
        //
        //         this.x = pos.x + _velocity * elapsed * Math.cos(angle);
        //         this.y = pos.y + _velocity * elapsed * Math.sin(angle) - gravity / 2 * Math.pow(elapsed, 2);
        //     }else{
        //         if (this.endingStartTime === undefined){
        //             this.endingStartTime = Date.now();
        //             this.endingStartX = this.x;
        //             this.endingStartY = this.y;
        //             this.xLength = this._target[0] - this.x;
        //             this.yLength = this._target[1] - this.y;
        //             // console.log(thisCoinSprite.x, thisCoinSprite.y, target.x, target.y);
        //             // debugger;
        //         }
        //
        //         const endingElapsed = (Date.now() - this.endingStartTime)/100;
        //         if (endingElapsed > this._collectionLifetime){
        //             //handle callback
        //             // callback(that);
        //             return;
        //         }
        //         const endingPercentage = endingElapsed/this._collectionLifetime;
        //         // console.log(xLength, yLength, endingPercentage, endingElapsed);
        //         this.x = this.endingStartX + endingPercentage * (this.xLength) ;
        //         this.y = this.endingStartY + endingPercentage * (this.yLength) ;
        //     }
        // }

        proto.reclaimView = function () {
            this._label.unscheduleAllCallbacks();//experimental
            this._label.setVisible(false);
            this._parent.removeChild(this._label, false);
        };

        return PrizeLabelObject;
    }());

    function setupView(viewObject, viewTarget, pos, angle, target, animation, callback, velocity, explodeLifetime, collectDelay, collectLifetime, delay, gravity) {
        let startTime = Date.now();

        viewTarget.setPosition(pos);

        let endingStartTime = undefined;
        let endingStartX = undefined;
        let endingStartY = undefined;
        let xLength = undefined;
        let yLength = undefined;

        viewTarget.update = function (dt) {

            const elapsed = (Date.now() - startTime ) / 100 - delay;
            if (elapsed < 0){
                return;
            }
            if (elapsed <= explodeLifetime) {
                this.x = pos.x + velocity * elapsed * Math.cos(angle);
                this.y = pos.y + velocity * elapsed * Math.sin(angle) - gravity / 2 * Math.pow(elapsed, 2);
            } else if (elapsed <= explodeLifetime + collectDelay) {
                return;
            }else{// animate move to player
                if (endingStartTime === undefined) {
                    endingStartTime = Date.now();
                    endingStartX = this.x;
                    endingStartY = this.y;
                    xLength = target[0] - this.x;
                    yLength = target[1] - this.y;
                }

                const endingElapsed = (Date.now() - endingStartTime) / 100;
                if (endingElapsed > collectLifetime) {
                    //handle callback
                    callback(viewObject);
                    return;
                }
                const endingPercentage = endingElapsed / collectLifetime;
                // console.log(xLength, yLength, endingPercentage, endingElapsed);
                this.x = endingStartX + endingPercentage * (xLength) * elapsed/5;
                this.y = endingStartY + endingPercentage * (yLength) * elapsed/5;
                // console.log(thisCoinSprite.x, thisCoinSprite.y, Date.now(), endingStartTime, endingElapsed,
                //     endingPercentage, endingPercentage * (xLength), endingPercentage * (yLength));
            }
        };

        viewTarget.scheduleUpdate();
        if (animation) {
            viewTarget.runAction(cc.repeatForever(animation));
        }
    }

    return CaptureCoinEffectManager;
}());