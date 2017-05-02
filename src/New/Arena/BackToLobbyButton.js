/**
 * Created by eugeneseah on 13/4/17.
 */

//只是一个界面的分片，没有太大用处,  写成界面中的一个私有函数就好了
const BackToLobbyButton = (function () {
    "use strict"
    const BackToLobbyButton = function (onLeaveArenaCallback) {
        const backButton = GUIFunctions.createButton(ReferenceName.BackButton,ReferenceName.BackButtonOnPress, onLeaveArenaCallback);
        backButton.setPosition(60,670);
        const backButtonTitle = new cc.Sprite(ReferenceName.BackButtonText);
        backButton.addChild(backButtonTitle);
        backButtonTitle.setPosition(backButton.getContentSize().width/2,backButton.getContentSize().height/2);
        GameView.addView(backButton,5);
    };
    return BackToLobbyButton;
}());