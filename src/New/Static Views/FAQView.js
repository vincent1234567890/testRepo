/**
 * Created by eugeneseah on 5/4/17.
 */

const FAQView = (function () {
    "use strict";
    const ZORDER = 10;
    let _parent;
    let _popup;
    let tabHeight = 600;
    let sideButtonX = 910;
    let sideSpacing = 100;
    let sideStart = 550;

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

        const userAgreementTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onUserAgreementTabClicked);
        const faqTab = GUIFunctions.createButton(ReferenceName.FAQTabBackground,ReferenceName.FAQTabBackgroundOnPress,onFAQTabClicked);

        const userAgreementTabTitleText = new cc.Sprite(ReferenceName.FAQUserAgreementTitleChinese);
        const faqTabTitleText = new cc.Sprite(ReferenceName.FAQTabTitleChinese);

        userAgreementTabTitleText.setAnchorPoint(0,0);
        faqTabTitleText.setAnchorPoint(0,0);

        userAgreementTab.addChild(userAgreementTabTitleText);
        faqTab.addChild(faqTabTitleText);

        const gameRules = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onGameRulesClicked);
        const uiFAQ = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onGameRulesClicked);
        const fishInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onFishInfoClicked);
        const cannonInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onCannonInfoClicked);
        const jackpotInfo = GUIFunctions.createButton(ReferenceName.FAQButtonBackground,ReferenceName.FAQButtonBackgroundOnPress,onJackpotInfoClicked);

        const gameRulesButtonText = new cc.Sprite(ReferenceName.FAQGameRulesButtonText);
        const uiFAQButtonText = new cc.Sprite(ReferenceName.FAQUIFaqButtonText);
        const fishInfoButtonText = new cc.Sprite(ReferenceName.FAQFishInfoButtonText);
        const cannonInfoButtonText = new cc.Sprite(ReferenceName.FAQCannonInfoButtonText);
        const jackpotInfoButtonText = new cc.Sprite(ReferenceName.FAQJackpotInfoButtonText);

        const pos = new cc.p(gameRules.getContentSize().width/2, gameRules.getContentSize().height/2);

        console.log(gameRules,gameRules.getContentSize(),pos);

        gameRulesButtonText.setPosition(pos);
        uiFAQButtonText.setPosition(pos);
        fishInfoButtonText.setPosition(pos);
        cannonInfoButtonText.setPosition(pos);
        jackpotInfoButtonText.setPosition(pos);

        gameRules.addChild(gameRulesButtonText);
        uiFAQ.addChild(uiFAQButtonText);
        fishInfo.addChild(fishInfoButtonText);
        cannonInfo.addChild(cannonInfoButtonText);
        jackpotInfo.addChild(jackpotInfoButtonText);

        textBG.setPosition(new cc.p(420,310));
        title.setPosition(new cc.p(560,705));

        _popup.getBackground().addChild(textBG);
        _popup.getBackground().addChild(title);

        _popup.getBackground().addChild(userAgreementTab);
        _popup.getBackground().addChild(faqTab);

        _popup.getBackground().addChild(gameRules);
        _popup.getBackground().addChild(uiFAQ);
        _popup.getBackground().addChild(fishInfo);
        _popup.getBackground().addChild(cannonInfo);
        _popup.getBackground().addChild(jackpotInfo);

        userAgreementTab.setPosition(200,tabHeight);
        faqTab.setPosition(390,tabHeight);



        gameRules.setPosition(sideButtonX, sideStart);
        uiFAQ.setPosition(sideButtonX, sideStart - sideSpacing);
        fishInfo.setPosition(sideButtonX, sideStart - sideSpacing * 2);
        cannonInfo.setPosition(sideButtonX, sideStart - sideSpacing * 3);
        jackpotInfo.setPosition(sideButtonX, sideStart - sideSpacing * 4);

        _parent.addChild(_popup.getParent());

        GameView.addView(_parent,ZORDER);

        const wiggle = new cc.Sequence(cc.rotateBy(0.1, 30), cc.rotateBy(0.1, -30));

        function onHover(widget){
            widget.runAction(cc.RepeatForever(wiggle.clone()));
        }
    };

    function onUserAgreementTabClicked (){

    }

    function onFAQTabClicked(){

    }

    function onGameRulesClicked() {

    }

    function onFishInfoClicked() {

    }

    function onCannonInfoClicked() {

    }

    function onJackpotInfoClicked(){

    }



    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    const proto = FAQView.prototype;

    proto.unattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
    };

    proto.reattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
        GameView.addView(_parent);
    };

    proto.show = function () {
        console.log("show");
        _parent.setVisible(true);
        _parent.setLocalZOrder(ZORDER);

        _popup.show();
    };

    proto.hide = function () {
        dismissCallback();
        _popup.hide();
    };

    return FAQView;
}());