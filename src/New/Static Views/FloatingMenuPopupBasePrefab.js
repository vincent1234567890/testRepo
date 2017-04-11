/**
 * Created by eugeneseah on 31/3/17.
 */

const FloatingMenuPopupBasePrefab = (function () {
    "use strict";
    const ZORDER = 10;

    const FloatingMenuPopupBasePrefab = function (parentDismissCallback) {
        this._parent = new cc.Node();
        BlockingManager.registerBlock(dismissCallback);

        this._background = new cc.Sprite(ReferenceName.FloatingPopupBackground);
        const titleBG = new cc.Sprite(ReferenceName.FloatingTitleBackground);
        const deco = new cc.Sprite(ReferenceName.FloatingBottomLeftDeco);

        const closeButton = new CloseButtonPrefab(dismiss);

        this._parent.addChild(closeButton.getButton(),10);
        closeButton.getButton().setPosition(new cc.p(545, 325));

        titleBG.setPosition(new cc.p(560, 689));
        deco.setPosition(new cc.p(70, 100));

        this._background.addChild(titleBG);
        this._background.addChild(deco, 10);

        this._parent.addChild(this._background);
        this._parent.setPosition(new cc.p(683, 390));

        const parent = this._parent;
        const background = this._background;
        function dismiss() {
            parent.setLocalZOrder(-1000);
            background.setVisible(false);
            closeButton.setVisible(false);

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
            closeButton.setVisible(true);
        };

        this.hide = function () {
            dismiss();
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