/**
 * Created by eugeneseah on 3/11/16.
 */

const FishView = (function () {
    "use strict";
    const deathScaleSmall = new cc.ScaleTo(0.3, 0.3);
    const deathScaleLarge = new cc.ScaleTo(0.3, 0.5);

    // const alphaFadeOut = new cc.FadeTo(0.2, 77);
    // const alphaFadeIn = new cc.FadeTo(0.2, 230);

    // const deathTint = new cc.TintTo (0.3, 196,196,196)

    const FishView = function (parent, fishType) {
        this._parent = new cc.Node();

        this._sprite = new cc.Sprite();
        this._parent.addChild(this._sprite, -1);
        this._currentAnimationAction = null;
        this.type = fishType;

        this.doAnimation(FishAnimationEnum.default);
        this._sprite.setScale(0.5);
        parent.addChild(this._parent, -1);

        // const testLayer = new cc.LayerColor();
        // testLayer.setBlendFunc()
    };

    const proto = FishView.prototype;
    
    proto.doAnimation = function(fishAnimationEnum) {
        if (this._currentAnimationAction) {
            this._sprite.stopAction(this._currentAnimationAction);
        }
        const data = FishAnimationData[this.type][fishAnimationEnum];
        if (data.pivot){
            this._sprite.setAnchorPoint(data.pivot);
        }

        const sequence = new cc.Sequence(data.animation.clone(), new cc.DelayTime(data.animationInterval));
        this._currentAnimationAction = new cc.RepeatForever(sequence);
        this._sprite.runAction(this._currentAnimationAction);
    };

    proto.killFish = function (target, callback, id) {
        console.log("killFish", id)
        this._sprite.setColor(new cc.Color(32,32,128,128));
        // this._sprite.runAction(deathTint);

        const deathAnimation = new cc.RepeatForever( new cc.Sequence ( deathScaleSmall, deathScaleLarge ));
        // const deathAnimationAlpha = new cc.RepeatForever( new cc.Sequence ( alphaFadeOut, alphaFadeIn ));
        const notify = new cc.Sequence(new cc.DelayTime(5), new cc.CallFunc(callback, target, id));
        this._sprite.runAction(deathAnimation);
        // this._sprite.runAction(deathAnimationAlpha);
        // this._sprite.setBlendFunc()

        this._sprite.runAction(notify);
    };

    proto.destroyView = function (parent) {
        parent.removeChild(this._parent);
    };


    proto.updateView = function(pos,rot){
        this._sprite.setPosition(pos);
        this._sprite.setRotation(rot);
    };

    return FishView;



    // return cc.Sprite.extend({
    //     _className: "FishView",
    //     _currentAnimationAction: null,
    //     // type : -1,
    //
    //     ctor: function (parent, fishType) {
    //         this.type = fishType;
    //
    //
    //         // seems only useful to set and initialise rect/sprite box for sprite (otherwise it would be 0)
    //         // can be removed for production
    //         let number = '0';
    //         while (number.length < 5){
    //             number = '0' + number;
    //         }
    //         const frameName = '#' + fishType + '_' + number + '.png';
    //         this._super(frameName);
    //
    //         this.doAnimation(FishAnimationEnum.default);
    //
    //
    //         this.setScale(0.5);
    //         parent.addChild(this, -1);
    //
    //     },
    //
    //     doAnimation : function(fishAnimationEnum) {
    //         if (this._currentAnimationAction) {
    //             this.stopAction(this._currentAnimationAction);
    //         }
    //         const data = FishAnimationData[this.type][fishAnimationEnum];
    //         if (data.pivot){
    //             this.setAnchorPoint(data.pivot);
    //         }
    //
    //         const sequence = new cc.Sequence(data.animation.clone(), new cc.DelayTime(data.animationInterval));
    //         this._currentAnimationAction = new cc.RepeatForever(sequence);
    //         this.runAction(this._currentAnimationAction);
    //
    //     },
    //
    //     killFish : function (id, callback) {
    //
    //
    //         this.setColor(new cc.Color(0,0,255,196));
    //         const sequence = new cc.Sequence(new cc.DelayTime(5), new cc.CallFunc(undefined, callback, id));
    //         this.runAction(sequence);
    //     }
    // });
})();
