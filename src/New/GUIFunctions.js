/**
 * Created by eugeneseah on 25/11/16.
 */
//modified from CCScrollView
const GUIFunctions = function () {
    "use strict";

    let padding = 5;
    const DEFAULT_BUTTON_PRESS_SOUND = res.MenuButtonPressSound;

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

    function setPadding(value) {
        padding = value;
    }

    function createButton(buttonImage, buttonSelected, selectedCallBack, sound) {
        const touchEvent = (sender, type) => {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    selectedCallBack(sender);
                    if (sound) {
                        cc.audioEngine.playEffect(sound);
                    } else {
                        cc.audioEngine.playEffect(res.MenuButtonPressSound);
                    }
                    break;
            }
        };

        const button = new ccui.Button(buttonImage, buttonSelected, undefined, ccui.Widget.PLIST_TEXTURE);
        button.setTouchEnabled(true);
        button.addTouchEventListener(touchEvent);

        return button;
    }

    function getLengthOfNumber(number) {
        return (Math.log(Math.abs(number + 1)) * 0.43429448190325176 | 0) + 1;
    }

    return {
        getHitBox: getHitBox,
        isSpriteTouched: isSpriteTouched,
        getAnimation: getAnimation,
        // getReverseAnimation: getReverseAnimation,
        setPadding: setPadding,
        createButton: createButton,
        getLengthOfNumber: getLengthOfNumber,
    }
}();