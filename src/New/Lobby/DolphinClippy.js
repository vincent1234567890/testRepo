

const DolphinClippy = (function () {
    "use strict";
    
    const DolphinClippy = function () {
        //why?
        const parent = new cc.Node();
        GameView.addView(parent);

        let dolphinSprite = new cc.Sprite(ReferenceName.DolphinIcon);
        parent.addChild(dolphinSprite);

        dolphinSprite.setPosition(100, 600);

        let dolphinBubble = new cc.Sprite(ReferenceName.DolphinBubble);
        parent.addChild(dolphinBubble);
        dolphinBubble.setPosition(200, 600);

        let dolphinText = new cc.Sprite(ReferenceName.DolphinTextName + "1" + ReferenceName.DolphinTextExtension);
        parent.addChild(dolphinText);
        dolphinText.setPosition(200, 600);

        let timer = 0;
        parent.update = function (dt) {
            if (timer+dt){

            }
        }
        
    };

    return DolphinClippy;
}());