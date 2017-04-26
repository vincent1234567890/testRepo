

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
        dolphinBubble.setPosition(250, 600);

        let dolphinText = new cc.Sprite(ReferenceName.DolphinTextName + "1" + ReferenceName.DolphinTextExtension);
        parent.addChild(dolphinText);
        dolphinText.setPosition(250, 590);

        const startWidth = dolphinBubble.getContentSize().width;
        const contentWidth = dolphinText.getContentSize().width;

        let timer = 0;
        let counter = 1;
        parent.update = function (dt) {
            if (timer+dt > 5){
                dolphinText.getParent().removeChild(dolphinText);
                dolphinText = new cc.Sprite(ReferenceName.DolphinTextName + (++counter) + ReferenceName.DolphinTextExtension);
                parent.addChild(dolphinText);
                const currentWidth = dolphinText.getContentSize().width;
                dolphinBubble.setScale(currentWidth/contentWidth);
                const newWidth = dolphinBubble.getContentSize().width;
                dolphinBubble.setPosition(250 + (newWidth - startWidth), 600);
                dolphinText.setPosition(dolphinBubble.getPosition().x,590);
                if(counter>3){
                    counter = 0;
                }
                timer = 0;
            }else{
                timer+=dt;
            }
        };

        parent.scheduleUpdate();
    };

    return DolphinClippy;
}());