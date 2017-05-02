/**
 * Created by eugeneseah on 22/2/17.
 */

const SpinningCoinView = (function () {

    //@params lifetime in 0.1 seconds
    //@params collectionLifetime in 0.1 seconds
    const SpinningCoinView = function (parent, animation, velocity, lifetime, collectionLifetime) {
        // this._lifetime = lifetime; //  per .1 sec, 10 = 1 sec
        // this._gravity = 0.9;
        // this._velocity = velocity;
        // this._collectionLifetime = collectionLifetime;

        if (!this.coinSprite) {
            this.coinSprite = new cc.Sprite();
            this._sequence = new cc.Sequence(animation);
        }
        this._parent = parent;
        this._parent.addChild(this.coinSprite);
        this.coinSprite.setVisible(true);
    };

    const proto = SpinningCoinView.prototype;

    // proto.startCoinAnimation = function (pos, angle , target, callback) {
    //
    //     this.startTime = Date.now();
    //
    //     const startTime = this.startTime;
    //
    //     this.coinSprite.setPositionX(pos.x);
    //     this.coinSprite.setPositionY(pos.y);
    //
    //     // let thisCoinSprite = this.coinSprite;
    //
    //     let endingStartTime = undefined;
    //     let endingStartX = undefined;
    //     let endingStartY = undefined;
    //     let xLength = undefined;
    //     let yLength = undefined;
    //
    //     const that = this;
    //     // console.log("start", pos, angle);
    //
    //     this.coinSprite.update = function (dt) {
    //         // console.log("the");
    //         const elapsed = (Date.now() - startTime)/100;
    //
    //         if (elapsed<=this._lifetime) {
    //
    //             this.x = pos.x + this._velocity * elapsed * Math.cos(angle);
    //             this.y = pos.y + this._velocity * elapsed * Math.sin(angle) - this._gravity / 2 * Math.pow(elapsed, 2);
    //         }else{ // animate move to player
    //             if (endingStartTime === undefined){
    //                 endingStartTime = Date.now();
    //                 endingStartX = this.x;
    //                 endingStartY = this.y;
    //                 xLength = target[0] - this.x;
    //                 yLength = target[1] - this.y;
    //                 // console.log(thisCoinSprite.x, thisCoinSprite.y, target.x, target.y);
    //                 // debugger;
    //             }
    //
    //             const endingElapsed = (Date.now() - endingStartTime)/100;
    //             if (endingElapsed > _collectionLifetime){
    //                 //handle callback
    //                 callback(that);
    //                 return;
    //             }
    //             const endingPercentage = endingElapsed/_collectionLifetime;
    //             // console.log(xLength, yLength, endingPercentage, endingElapsed);
    //             this.x = endingStartX + endingPercentage * (xLength) ;
    //             this.y = endingStartY + endingPercentage * (yLength) ;
    //             // console.log(thisCoinSprite.x, thisCoinSprite.y, Date.now(), endingStartTime, endingElapsed,
    //             //     endingPercentage, endingPercentage * (xLength), endingPercentage * (yLength));
    //         }
    //
    //     };
    //     this.coinSprite.scheduleUpdate();
    //     this.coinSprite.runAction( cc.repeatForever(this._sequence));
    //
    // };
    proto.getTargetNode = function () {
        return this.coinSprite;
    };

    proto.animate = function () {
        this.coinSprite.runAction( cc.repeatForever(this._sequence));
    };

    proto.reclaimView = function () {
    //     console.log("cleanup!",this.coinSprite);

        this.coinSprite.unscheduleAllCallbacks(); //testing
        // console.log("cleanup2!",this.coinSprite);
        this.coinSprite.setVisible(false);
        // console.log("cleanup2!",this.coinSprite);
        this._parent.removeChild(this.coinSprite,false);
    };

    proto.destroyView = function () {
        if (!this.coinSprite.getParent()){
            this._parent.addChild(this.coinSprite);
        }
        this._parent.removeChild(this.coinSprite);
    };

    return SpinningCoinView;

}());

