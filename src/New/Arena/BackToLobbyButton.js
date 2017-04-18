/**
 * Created by eugeneseah on 13/4/17.
 */

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