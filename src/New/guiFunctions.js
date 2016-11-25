/**
 * Created by eugeneseah on 25/11/16.
 */
//modified from CCScrollView
const guiFunctions = function () {
    "use strict";
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


    return {
        getHitBox : getHitBox,
    }
};