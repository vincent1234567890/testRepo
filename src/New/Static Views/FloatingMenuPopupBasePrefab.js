/**
 * Created by eugeneseah on 31/3/17.
 */

const FloatingMenuPopupBasePrefab = (function () {
    "use strict";
    const ZORDER = 10;


    const FloatingMenuPopupBasePrefab = function (parentDismissCallback) {

        const startingRotation = 0;

        this._parent = new cc.Node();
        BlockingManager.registerBlock(dismissCallback);


        this._background = new cc.Sprite(ReferenceName.FloatingPopupBackground);
        const titleBG = new cc.Sprite(ReferenceName.FloatingTitleBackground);
        const deco = new cc.Sprite(ReferenceName.FloatingBottomLeftDeco);

        const close = new cc.Sprite(ReferenceName.FloatingCloseButton);
        // const closeButtonBg = new cc.Sprite(ReferenceName.FloatingCloseButtonBackground);
        // const closeButtonBgOnPress = new cc.Sprite(ReferenceName.FloatingCloseButtonBackgroundOnPress);

        close.setRotation(startingRotation);

        const closeButton = new cc.Node();

        let button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(ReferenceName.FloatingCloseButtonBackground, ReferenceName.FloatingCloseButtonBackgroundOnPress, undefined, ccui.Widget.PLIST_TEXTURE);

        closeButton.setPosition(new cc.p(525, 305));
        closeButton.addChild(button);
        closeButton.addChild(close);

        this._parent.addChild(closeButton,10);

        const temp = new RolloverEffectItem(button, selectedCallback, unSelectedCallback, hoverCallback, unHoverCallback);

        const wiggle = new cc.Sequence(cc.rotateBy(0.1, 30), cc.rotateBy(0.1, -30));

        function selectedCallback() {
            dismiss();
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

        titleBG.setPosition(new cc.p(560, 689));
        deco.setPosition(new cc.p(70, 100));

        this._background.addChild(titleBG);
        this._background.addChild(deco, 10);


        this._parent.addChild(this._background);
        this._parent.setPosition(new cc.p(683, 384));

        const parent = this._parent;
        const background = this._background;
        function dismiss() {
            console.log("dismiss");
            parent.setLocalZOrder(-1000);
            background.setVisible(false);
            button.setEnabled(false);
            button.setVisible(false);

            BlockingManager.deregisterBlock(dismissCallback);
        }

        function dismissCallback(touch) {
            if (GUIFunctions.isSpriteTouched(background, touch)) {
                return;
            }
            parentDismissCallback();
            dismiss();
        }

        this.show = function () {
            BlockingManager.registerBlock(dismissCallback);
            this._parent.setLocalZOrder(ZORDER);
            this._background.setVisible(true);
            button.setEnabled(true);
            button.setVisible(true);
        };
    };

    const proto = FloatingMenuPopupBasePrefab.prototype;

    proto.getParent = function () {
        return this._parent;
    };

    proto.getBackground = function () {
        return this._background;
    };

    return FloatingMenuPopupBasePrefab;
}());