/**
 * Created by eugeneseah on 25/11/16.
 */
//modified from CCScrollView
const GUIFunctions = function () {
    "use strict";

    let padding = 5;
    function getHitBox(sprite) {
        let screenPos = sprite.convertToWorldSpace(cc.p());
        // var locViewSize = this._viewSize;

        let scaleX = sprite.getScaleX();
        let scaleY = sprite.getScaleY();

        for (let p = sprite.getParent(); p != null; p = p.getParent()) {
            scaleX *= p.getScaleX();
            scaleY *= p.getScaleY();
        }

        if (scaleX < 0) {
            screenPos.x += sprite.width * scaleX;
            scaleX = -scaleX;
        }
        if (scaleY < 0) {
            screenPos.y += sprite.height * scaleY;
            scaleY = -scaleY;
        }

        return new cc.rect(screenPos.x, screenPos.y, sprite.width * scaleX, sprite.height * scaleY);
    }

    function isSpriteTouched(sprite, touch) {
        let newPoint = sprite.convertToWorldSpace(sprite.convertToNodeSpace(touch));
        return cc.rectContainsPoint(getHitBox(sprite), newPoint)
    }

    function getAnimation(name, animationSpeed) {
        let animationArray = [];
        let count = 0;
        while (true) {
            let frameCount = String(count);
            while (frameCount.length < padding) {
                frameCount = '0' + frameCount;
            }
            const frame = cc.spriteFrameCache.getSpriteFrame(name + frameCount + ".png");
            if (!frame) {
                break;
            }
            animationArray.push(frame);
            count++;
        }
        return new cc.Animate(new cc.Animation(animationArray, animationSpeed));
    }

    // function getReverseAnimation(name, animationSpeed) {
    //     let animationArray = [];
    //     let count = 0;
    //     while (true) {
    //         let frameCount = String(count);
    //         while (frameCount.length < padding) {
    //             frameCount = '0' + frameCount;
    //         }
    //         const frame = cc.spriteFrameCache.getSpriteFrame(name + frameCount + ".png");
    //         if (!frame) {
    //             break;
    //         }
    //         count++;
    //     }
    //     while (count >= 0) {
    //         let frameCount = String(count);
    //         while (frameCount.length < padding) {
    //             frameCount = '0' + frameCount;
    //         }
    //         const frame = cc.spriteFrameCache.getSpriteFrame(name + frameCount + ".png");
    //         animationArray.push(frame);
    //         count--;
    //     }
    //
    //     return new cc.Animate(new cc.Animation(animationArray, animationSpeed));
    // }

    function setPadding(value){
        padding = value;
    }


    return {
        getHitBox: getHitBox,
        isSpriteTouched: isSpriteTouched,
        getAnimation: getAnimation,
        // getReverseAnimation: getReverseAnimation,
        setPadding : setPadding,
    }
}();