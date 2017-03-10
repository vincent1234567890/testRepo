/**
 * Created by eugeneseah on 9/3/17.
 */
const FloatingMenu = (function () {

    let _parent;
    const FloatingMenu = function () {
        _parent = new cc.Node();
        GameView.addView(_parent);

        const settings = doButton();
    };

    function doButton(iconSprite, buttonImage, buttonSelected, labelImage, selectedCallBack) {
        const touchEvent = (sender, type) => {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    // gameSelected(sender);
                    console.log(sender.gameData);
                    selectedCallBack(sender);
                    break;
            }
        };

        let button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(buttonImage, buttonSelected, undefined, ccui.Widget.PLIST_TEXTURE);
        button.setPosition(button.getContentSize().width/2-120, button.getContentSize().height/2 + 120);
        button.addTouchEventListener(touchEvent);

        if (iconSprite){
            let label = cc.Sprite(labelImage);
            button.addChild(label);
        }

        if(labelImage) {
            let label = cc.Sprite(labelImage);
            button.addChild(label);
        }

        return button;
    }
}());