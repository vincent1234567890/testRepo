/**
 * Created by eugeneseah on 9/3/17.
 */
const GameListButtonPrefab = (function () {
    "use strict";

    const GameListButtonPrefab = function (itemData, widthOfButton, selectedCallback) {
        const touchEvent = (sender, type) => {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    // gameSelected(sender);
                    console.log(sender.gameData);
                    this._selectedCallBack(sender);
                    break;
            }
        };

        let button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(itemData.gameName +"Base.png",undefined, undefined, ccui.Widget.PLIST_TEXTURE);
        button.gameData = itemData;
        button.setPosition(button.getContentSize().width/2-120, button.getContentSize().height/2 + 120);
        button.addTouchEventListener(touchEvent);
        // button.setAnchorPoint(0.5,0.5);
        // button.setContentSize(cc.size(300,500));

        this._button = button;

        let content = new ccui.Widget();
        content.setContentSize(widthOfButton,button.getContentSize().height);
        content.addChild(button);
        // content.setAnchorPoint(0.5,0.5);

        this._content = content;
        this._selectedCallBack = selectedCallback;

    };



    const proto = GameListButtonPrefab.prototype;

    proto.getContent = function () {
        return this._content;
    };

    return GameListButtonPrefab;

}());