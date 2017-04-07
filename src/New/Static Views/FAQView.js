/**
 * Created by eugeneseah on 5/4/17.
 */

const FAQView = (function () {
    "use strict";
    const ZORDER = 10;
    let _parent;
    let _popup;
    let tabHeight = 550;
    let sideButtonX = 1200;

    const FAQView = function () {
        _parent = new cc.Node();
        _popup= new FloatingMenuPopupBasePrefab(dismissCallback);
        /*FAQTextBackground : "#TextBG3.png",
         FAQTitleChinese : "#GameFAQChineseTitle.png",
         FAQUserAgreementTitleChinese : "#UserAgreementChinese.png",
         FAQTabTitleChinese : "#GameFAQChinese (2).png",
         FAQTabBackground : "#Button2Idle.png",
         FAQTabBackground2 : "#Button2OnPress.png",
         FAQButtonBackground : "#Button3Idle.png",
         FAQButtonBackgroundOnPress : "#Button3OnPress.png",
         */

        const textBG = new cc.Sprite(ReferenceName.FAQTextBackground);
        const title = new cc.Sprite(ReferenceName.FAQTitleChinese);




        textBG.setPosition(new cc.p(567.5,345));
        title.setPosition(new cc.p(560,705));

        _popup.getBackground().addChild(textBG,1);
        _popup.getBackground().addChild(title,1);

        _popup.getParent().setPosition(new cc.p(683,384));

        _parent.addChild(_popup.getParent());

        GameView.addView(_parent,ZORDER);

    };

    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    const proto = FAQView.prototype;

    proto.show = function () {
        _parent.setLocalZOrder(ZORDER);
        _parent.setVisible(true);
        _popup.show();
    };

    const doButtons = function(buttonImage,buttonSelected,selectedCallBack){
        const touchEvent = (sender, type) => {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    selectedCallBack(sender);
                    break;
            }
        };

        const button = new ccui.Button(buttonImage, buttonSelected, undefined, ccui.Widget.PLIST_TEXTURE);
        button.setTouchEnabled(true);
        button.setPosition(button.getContentSize().width / 2 - 120, button.getContentSize().height / 2 + 120);
        button.addTouchEventListener(touchEvent);

        return button;
    }
}());