/**
 * Created by eugeneseah on 22/3/17.
 */

const DolphinClippy = (function () {
    "use strict";
    
    const DolphinClippy = function () {
        const parent = new cc.Node();
        GameView.addView(parent);

        let dolphinSprite = new cc.Sprite(ReferenceName.DolphinIcon);
        parent.addChild(dolphinSprite);

        dolphinSprite.setPosition(100, 650);

        let dolphinBubble = new cc.Sprite(ReferenceName.DolphinBubble);
        parent.addChild(dolphinBubble);
        dolphinBubble.setPosition(200, 650);

        let dolphinText = new cc.Sprite(ReferenceName.DolphinTextName + "1" + ReferenceName.DolphinTextExtension);
        parent.addChild(dolphinText);
        dolphinText.setPosition(200, 650);
    };

    return DolphinClippy;
}());