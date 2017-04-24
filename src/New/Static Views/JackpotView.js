/**
 * Created by eugeneseah on 10/3/17.
 */
const JackpotView = (function () {
    "use strict";
    let _parent;
    let _label;
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

        GameView.addView(_parent);

        //------------------- testing
        // const color = new cc.LayerColor(new cc.Color(20,145,224,255));
        const target = new cc.Sprite();
        target.setScale(0.2);
        target.setBlendFunc(cc.ONE, cc.ONE);
        // const target = new cc.Sprite(ReferenceName.JackpotBackground);
        // target.runAction(new cc.repeatForever(new cc.rotateBy(25,360)));
        const mask = new cc.Sprite(ReferenceName.JackpotBar);

        const maskedFill = new cc.ClippingNode(mask);
        maskedFill.setAlphaThreshold(0.9);

        // maskedFill.addChild(color,1);
        maskedFill.addChild(target);
        maskedFill.setPosition(0,-22);
        _parent.addChild(maskedFill);

        cc.spriteFrameCache.addSpriteFrames(res.WaterCausticAnimation);
        let animationArray = [];
        let count = 0;
        while (true) {
            let frameCount = String(count);
            while (frameCount.length < 5) {
                frameCount = '0' + frameCount;
            }
            const frame = cc.spriteFrameCache.getSpriteFrame("Caustic_" + frameCount + ".png");
            if (!frame) {
                break;
            }
            animationArray.push(frame);
            count++;
        }
        const animation = new cc.Animate(new cc.Animation(animationArray,0.05));
        target.runAction(new cc.repeatForever(animation));
        // animationArray.push(new cc.SpriteFrame(" "));

        //------------------------end test

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

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Impact";
        fontDef.fontWeight = "bold";
        fontDef.fontSize = 30;
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(255, 255, 255, 255);

        _label = new cc.LabelTTF("", fontDef);
        // this._label = new cc.LabelBMFont("",res.TestFont);
        _label.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        _label.setContentSize(bar.getContentSize());
        _label.setPosition(0,-22);
        _parent.addChild(_label);
    }

    const proto = JackpotView.prototype;

    proto.unattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
    };

    proto.updateJackpot = function(value){
        // let prize = (value).toLocaleString('en-US', {maximumFractionDigits: 2});
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
        GameView.addView(_parent);
    };

    return JackpotView;
}());