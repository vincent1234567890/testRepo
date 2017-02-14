/**
 * Created by eugeneseah on 13/2/17.
 */
CompanyA.CannonView = (function () {


    const CompanyACannonView = function(gameconfig, slot){
        "use strict";
        const _view = new CannonView(gameconfig,slot);
        // Object.assign(this, _view);
        Object.setPrototypeOf(this, _view);

        // GameView.addView(this._cannonNode,2);
    };

    const proto = CompanyACannonView.prototype;


    proto.createView = function(slot){
        this._sprite = new cc.Sprite();
        console.log("CompanyACannonView");
    };

    proto.animateShootTo = function () {
        if (this._currentAnimationAction) {
            this._sprite.stopAction(this._currentAnimationAction);
        }
        const data = proto.getCannonAnimation();
        if (data.pivot) {
            this._sprite.setAnchorPoint(data.pivot);
        }
        const sequence = new cc.Sequence(data.animation.clone(), new cc.DelayTime(data.animationInterval));
        this._currentAnimationAction = new cc.RepeatForever(sequence);
        this._sprite.runAction(this._currentAnimationAction);
    };

    return CompanyACannonView;
}());