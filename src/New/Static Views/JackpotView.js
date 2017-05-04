/**
 * Created by eugeneseah on 10/3/17.
 */
const JackpotView = (function () {
    "use strict";
    let _parent;
    let _label;

    const lensFlareHeight = 0;
    const lensFlareStart = -90;
    const lensFlareEnd = 90;
    const smallMultiplier = 2;
    const lensFlareTime = 3;

    function JackpotView() {
        const bg = new cc.Sprite(ReferenceName.JackpotBackground);
        const shadow = new cc.Sprite(ReferenceName.JackpotShadow);
        const bar = new cc.Sprite(ReferenceName.JackpotBar);
        const barFrame = new cc.Sprite(ReferenceName.JackpotBarFrame);
        const title = new cc.Sprite(ReferenceName.JackpotTitleChinese);
        const light = new cc.Sprite(ReferenceName.JackpotLight);

        _parent = new cc.Node();

        _parent.addChild(shadow);
        shadow.setPosition(0,-5);

        _parent.addChild(bg);

        _parent.addChild(light);
        // light.setBlendFunc(cc.ONE, cc.ONE);
        light.runAction(new cc.repeatForever(new cc.rotateBy(25,360)));

        _parent.addChild(bar);
        bar.setPosition(0,-22);

        _parent.addChild(title);
        title.setPosition(0,22);

        GameView.addView(_parent,1,true);

        const target = new cc.Sprite();
        target.setScale(0.2);
        target.setBlendFunc(cc.ONE, cc.ONE);
        const mask = new cc.Sprite(ReferenceName.JackpotBar);

        const maskedFill = new cc.ClippingNode(mask);
        maskedFill.setAlphaThreshold(0.9);

        // maskedFill.addChild(color,1);
        maskedFill.addChild(target);
        maskedFill.setPosition(0,-22);
        _parent.addChild(maskedFill);

        const animation = GUIFunctions.getAnimation(ReferenceName.LobbyCaustics, 0.05);
        target.runAction(new cc.repeatForever(new cc.Sequence(animation)));

        _parent.addChild(barFrame);
        barFrame.setPosition(0,-22);

        //add event listener
        let barFrameTouchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    target.runAction(cc.scaleTo(0.2, 1.05));
                    target.setUserData(true);   //scale;
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    if(target.getUserData() !== true){
                        target.setUserData(true);
                        target.runAction(cc.scaleTo(0.2, 1.06));
                    }
                } else {
                    if(target.getUserData() === true){
                        target.setUserData(false);
                        target.runAction(cc.scaleTo(0.2, 1));
                    }
                }
            },
            onTouchEnded: function(touch, event){
                let target = event.getCurrentTarget();
                target.setUserData(false);
                target.runAction(cc.scaleTo(0.2, 1));

                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    //show the jackpot float panel
                    let jackpotPanel = new JackpotDetailPanel();
                    GameView.addView(jackpotPanel, 199);
                    jackpotPanel.showDetail();
                }
            }
        });
        cc.eventManager.addListener(barFrameTouchListener, barFrame);

        _parent.setPosition(683,666);
        const size = barFrame.getContentSize();
        // _label = new cc.LabelTTF("0", "Impact", 30);
        // _label._setFontWeight("bold");
        // _label.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        _label = new cc.LabelBMFont("0", res.WhiteFontFile);
        _label.setPosition(size.width * 0.5, 33);
        // _label.setAnchorPoint(0.5,0.5);
        _label.setScale(0.6);
        barFrame.addChild(_label);

        const lensFlareSmall = new cc.Sprite(ReferenceName.JackpotLensFlareSmall);
        const lensFlareMedium = new cc.Sprite(ReferenceName.JackpotLensFlareMedium);
        const lensFlareLarge = new cc.Sprite(ReferenceName.JackpotLensFlareLarge);

        _parent.addChild(lensFlareSmall);
        _parent.addChild(lensFlareMedium);
        _parent.addChild(lensFlareLarge);


        lensFlareSmall.setPosition(lensFlareStart * smallMultiplier,lensFlareHeight);
        lensFlareMedium.setPosition(lensFlareStart,lensFlareHeight);
        lensFlareLarge.setPosition(lensFlareEnd,lensFlareHeight);

        const moveLeft = new cc.MoveTo(lensFlareTime,lensFlareEnd,lensFlareHeight);
        const moveRight = new cc.MoveTo(lensFlareTime,lensFlareStart,lensFlareHeight);

        const lensFlareMediumSequence = new cc.RepeatForever( new cc.Sequence(moveLeft.clone(),moveRight.clone()));
        const lensFlareLargeSequence = new cc.RepeatForever(new cc.Sequence(moveRight.clone(),moveLeft.clone()));
        const lensFlareSmallSequence = new cc.RepeatForever( new cc.Sequence (new cc.MoveTo(lensFlareTime,lensFlareEnd * smallMultiplier,lensFlareHeight),
                                                                            new cc.MoveTo(lensFlareTime,lensFlareStart * smallMultiplier,lensFlareHeight)));

        lensFlareMedium.runAction(lensFlareMediumSequence);
        lensFlareLarge.runAction(lensFlareLargeSequence);
        lensFlareSmall.runAction(lensFlareSmallSequence);
    }

    const proto = JackpotView.prototype;

    proto.unattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
    };

    proto.updateJackpot = function(value){
        let prize = Math.round(value).toLocaleString('en-US', {maximumFractionDigits: 2});
        if (prize.length > 13) {
            prize = prize.substring(0,10) + "..";
        }
        _label.setString(prize);
    };

    proto.reattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
        GameView.addView(_parent,1);
    };

    return JackpotView;
}());