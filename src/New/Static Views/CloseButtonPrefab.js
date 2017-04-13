/**
 * Created by eugeneseah on 6/4/17.
 */
const CloseButtonPrefab = (function () {
    const ClosebuttonPrefab = function (clickedCallback) {
        const startingRotation = 0;
        const close = new cc.Sprite(ReferenceName.FloatingCloseButton);
        close.setRotation(startingRotation);

        let button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(ReferenceName.FloatingCloseButtonBackground, ReferenceName.FloatingCloseButtonBackgroundOnPress, undefined, ccui.Widget.PLIST_TEXTURE);

        const closeButton = new cc.Node();
        closeButton.addChild(button);
        closeButton.addChild(close);

        const temp = new RolloverEffectItem(button, selectedCallback, unSelectedCallback, hoverCallback, unHoverCallback);

        const wiggle = new cc.Sequence(cc.rotateBy(0.1, 30), cc.rotateBy(0.1, -30));

        function selectedCallback() {
            clickedCallback();
        }

        function unSelectedCallback() {

        }

        function hoverCallback() {
            if (close.getNumberOfRunningActions()==0) {
                close.runAction(new cc.RepeatForever(wiggle.clone()));
            }
        }

        function unHoverCallback() {
            close.stopAllActions();
            close.setRotation(startingRotation);
        }

        this.getButton = function () {
            return closeButton;
        };

        this.setVisible = function (visibility) {
            button.setEnabled(visibility);
            button.setVisible(visibility);
            close.setVisible(visibility);
        };
    };

    const proto = ClosebuttonPrefab.prototype;


    return ClosebuttonPrefab;
}());