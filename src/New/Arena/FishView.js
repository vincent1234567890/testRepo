/**
 * Created by eugeneseah on 3/11/16.
 */

const FishView = (function () {
    "use strict";
    const deathScaleSmall = new cc.ScaleTo(0.3, 0.3);
    const deathScaleLarge = new cc.ScaleTo(0.3, 0.5);

    const alphaFadeOut = new cc.FadeTo(0.2, 77);
    const alphaFadeIn = new cc.FadeTo(0.2, 230);

    // const deathTint = new cc.TintTo (0.3, 196,196,196)
    let debugReported = false;

    const FishView = function (parent, fishClass, fishType, onFishClickedCallback) {
        if(!parent){
            console.warn("parent = null", fishClass, fishType);
            return;
        }
        this._parent = new cc.Node();
        const touchEvent = (sender, type) => {
            // console.log("touch",sender,type);
            switch (type) {
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_BEGAN:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    onFishClickedCallback(this);
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
            }
        };

        this._sprite = new cc.Sprite();
        this._parent.addChild(this._sprite, -1);
        this._currentAnimationAction = null;
        this.type = fishType;

        this.doAnimation(FishAnimationEnum.default);
        // GameView.addView(this._parent);
        parent.addChild(this._parent, -1);

        const _wrapper = new ccui.Widget();
        _wrapper.setContentSize(fishClass.length * 2, fishClass.breadth * 2);
        _wrapper.setTouchEnabled(true);
        _wrapper.setSwallowTouches(false);
        _wrapper.addTouchEventListener(touchEvent);

        this._parent.addChild(_wrapper);

        // const testLayer = new cc.LayerColor();
        // testLayer.setBlendFunc()
        if (GameManager.debug) {

            const debugCircle = new cc.Sprite(res.DebugCircle);

            debugCircle.setScaleX(fishClass.length * 2 / 100); // radius
            debugCircle.setScaleY(fishClass.breadth * 2/ 100);

            this._parent.addChild(debugCircle, 1);
            // console.log("debug:", debugCircle, fishClass, fishType);
        }

        this._willFlip = fishClass.willFlip;
    };

    const proto = FishView.prototype;
    
    proto.doAnimation = function(fishAnimationEnum) {
        // if (FishAnimationData[this.type][fishAnimationEnum] && FishAnimationData[this.type][fishAnimationEnum].length>0) {
            if (this._currentAnimationAction) {
                this._sprite.stopAction(this._currentAnimationAction);
            }
            const animationData = FishAnimationData[this.type];
            if (!animationData) {
                console.warn("FishAnimationData['" + this.type + "'] is undefined!");
                return;
            }
            const data = animationData[fishAnimationEnum];
            if (data.pivot) {
                this._sprite.setAnchorPoint(data.pivot);
            }
            const sequence = new cc.Sequence(data.animation.clone(), new cc.DelayTime(data.animationInterval));
            this._currentAnimationAction = new cc.RepeatForever(sequence);
            this._sprite.runAction(this._currentAnimationAction);
        // }
    };

    proto.killFish = function (target, callback, id, playerSlot) {
        //console.log("killFish:", this.type, FishAnimationData[this.type], FishAnimationData[this.type][FishAnimationEnum.death],
        // FishAnimationData[this.type][FishAnimationEnum.death]&&FishAnimationData[this.type][FishAnimationEnum.death].length);
        let deathAnimation = FishAnimationData[this.type][FishAnimationEnum.death];
        if (deathAnimation && deathAnimation.animation && deathAnimation.animation._animation
            && deathAnimation.animation._animation._frames && deathAnimation.animation._animation._frames.length > 0) {//lulwut? maybe need to find a better way
            this.doAnimation(FishAnimationEnum.death);
        } else {
            // console.log("killFish", id)
            this._sprite.setColor(new cc.Color(32, 32, 128, 128));
            // this._sprite.runAction(deathTint);

            const deathAnimation = new cc.RepeatForever(new cc.Sequence(deathScaleSmall.clone(), deathScaleLarge.clone()));
            const deathAnimationAlpha = new cc.RepeatForever(new cc.Sequence(alphaFadeOut.clone(), alphaFadeIn.clone()));

            this._sprite.runAction(deathAnimation);
            this._sprite.runAction(deathAnimationAlpha);
            // this._sprite.setBlendFunc()
        }

        const notify = new cc.Sequence(new cc.DelayTime(1), new cc.CallFunc(callback, target, {
            position: this._parent.getPosition(),
            type: this.type,
            playerSlot: playerSlot,
            id: id
        }));
        this._sprite.runAction(notify);
        // return {position : this._parent.getPosition(), type : this.type};
    };

    proto.destroyView = function (parent) {
        parent.removeChild(this._parent);
    };

    proto.updateView = function(pos,rot){

        this._parent.setPosition(pos);
        this._parent.setRotation(rot);

        if (this._willFlip) {
            this._sprite.flippedY = (rot % 360 > 90 && rot % 360 <= 270);
        }

        if (!debugReported && this._sprite.getContentSize().width === 0){
            debugReported = true;
            console.warn("Fish missing atlas :", this.type);
        }
    };

    proto.addTarget = function(target){
        this._parent.addChild(target);
    };

    return FishView;
})();
