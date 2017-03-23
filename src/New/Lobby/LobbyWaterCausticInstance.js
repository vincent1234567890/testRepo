/**
 * Created by eugeneseah on 8/3/17.
 */
const LobbyWaterCausticInstance = (function () {
    "use strict";
    const LobbyWaterCausticInstance = function (parent, type, pos, rot, timingIn, timingPause, timingOut, movementVector, scale, animationEndCallback) {
        this.type = type;

        // console.log(type,pos,timingIn,timingOut,movementVector, scale);
        if (!this._parent) {
            this._parent = new cc.Node();
            this._sprite = new cc.Sprite(res["WaterCaustic" + type]);
            this._sprite.setOpacity(0);
            this._parent.addChild(this._sprite);
        }
        parent.addChild(this._parent);
        this._startTime = Date.now();
        // this._parent.update = () => {
        //     if (Date.now() > this._startTime){
        //
        //     }
        // };
        const onAnimationEnd = () => {
            // console.log("onAnimationEnd");
            reclaimView(this);
            animationEndCallback (this, type);
        };

        this._sprite.setPosition(pos);
        this._sprite.setRotation(rot);

        const moveByStart = new cc.MoveBy(timingIn + timingOut,movementVector);
        moveByStart.easing(cc.easeQuadraticActionInOut());
        const moveByEnd = new cc.MoveBy(timingOut, cc.pMult( movementVector,-1));
        moveByEnd.easing(cc.easeQuadraticActionInOut());

        this._sprite.runAction(new cc.Sequence(new cc.FadeIn(timingIn), new cc.DelayTime(timingPause), new cc.FadeOut(timingOut), new cc.CallFunc(onAnimationEnd)));
        // this._sprite.runAction(new cc.Sequence(moveByStart, new cc.DelayTime(timingPause), moveByEnd));
        this._sprite.runAction(new cc.Sequence(moveByStart, new cc.DelayTime(timingPause/2), moveByEnd));
        // this._sprite.runAction(moveByStart);
        this._sprite.runAction(new cc.ScaleTo(scale));

        this._parent.scheduleUpdate();
    };


    function reclaimView(instance) {
        instance._parent.getParent().removeChild(instance._parent, false);
        instance._sprite.stopAllActions();
    }

    return LobbyWaterCausticInstance;
}());