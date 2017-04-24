var JackpotFloatPanel = cc.Layer.extend({

    ctor: function(){
        cc.Layer.prototype.ctor.call(this);
        this._className = "JackpotFloatPanel";

        //show

    }
});

var JackpotDetailPanel = cc.LayerColor.extend({
    _spJackpotPopBase: null,
    _lbPrize1Value: null,
    _lbPrize2Value: null,
    _lbPrize3Value: null,

    ctor: function(){
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 196));

        cc.spriteFrameCache.addSpriteFrames(res.LobbyJackpotPlist);
        cc.spriteFrameCache.addSpriteFrames(res.JackpotMiniGamePlist);

        this._layerEventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                let target = event.getCurrentTarget();
                return cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                    target.convertToNodeSpace(touch.getLocation()));
            },
            onTouchEnded: function (touch, event) {
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    target.runAction(cc.sequence(cc.scaleTo(0.6, 0).easing(cc.easeExponentialOut()),
                        cc.callFunc(function(){
                            this.removeFromParent(true);
                        }, target)));
                }
            }
        });

        let spJackpotPopBase = this._spJackpotPopBase =
            new ccui.Scale9Sprite(ReferenceName.JackpotPopBase, new cc.Rect(20, 20, 108, 93));
        spJackpotPopBase.setPreferredSize(new cc.Size(517, 452));
        this.addChild(spJackpotPopBase);
        spJackpotPopBase.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);

        let spJackpotPopFrame1 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame1.setPreferredSize(new cc.Size(371, 125));
        spJackpotPopBase.addChild(spJackpotPopFrame1);
        spJackpotPopFrame1.setPosition(258, 332);
        let lbPrize1Value = this._lbPrize1Value = new cc.LabelBMFont("16,000,000", res.JackpotGoldTextFont);
        spJackpotPopFrame1.addChild(lbPrize1Value);
        lbPrize1Value.setPosition(186, 64);
        lbPrize1Value.setScale(0.75);
        let spJackpotPopGold = new cc.Sprite(ReferenceName.JackpotPopGold);
        spJackpotPopGold.setPosition(258, 411);
        spJackpotPopBase.addChild(spJackpotPopGold);
        let spMermaidMedal = new cc.Sprite(ReferenceName.JackpotMermaidIcon);
        spMermaidMedal.setPosition(33, 24);
        spMermaidMedal.setScale(0.65);
        spJackpotPopGold.addChild(spMermaidMedal);

        let spJackpotPopFrame2 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame2.setPreferredSize(new cc.Size(260, 92));
        spJackpotPopBase.addChild(spJackpotPopFrame2);
        spJackpotPopFrame2.setPosition(258, 180);
        let lbPrize2Value = this._lbPrize2Value = new cc.LabelBMFont("80,000", res.JackpotGoldTextFont);
        spJackpotPopFrame2.addChild(lbPrize2Value);
        lbPrize2Value.setPosition(130, 46);
        lbPrize2Value.setScale(0.6);
        let spJackpotPopSilver = new cc.Sprite(ReferenceName.JackpotPopSilver);
        spJackpotPopSilver.setPosition(258, 241);
        spJackpotPopBase.addChild(spJackpotPopSilver);
        let spSharkMedal = new cc.Sprite(ReferenceName.JackpotSharkIcon);
        spSharkMedal.setPosition(25, 23);
        spSharkMedal.setScale(0.65);
        spJackpotPopSilver.addChild(spSharkMedal);

        let spJackpotPopFrame3 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame3.setPreferredSize(new cc.Size(166, 72));
        spJackpotPopBase.addChild(spJackpotPopFrame3);
        spJackpotPopFrame3.setPosition(163, 48);
        let lbPrize3Value = this._lbPrize3Value = new cc.LabelBMFont("2,000", res.JackpotGoldTextFont);
        spJackpotPopFrame3.addChild(lbPrize3Value);
        lbPrize3Value.setPosition(83, 36);
        lbPrize3Value.setScale(0.4);
        let spJackpotPopGreen = new cc.Sprite(ReferenceName.JackpotPopGreen);
        spJackpotPopGreen.setPosition(163, 96);
        spJackpotPopBase.addChild(spJackpotPopGreen);
        let spTurtleMedal = new cc.Sprite(ReferenceName.JackpotTurtleIcon);
        spTurtleMedal.setPosition(19, 22);
        spTurtleMedal.setScale(0.55);
        spJackpotPopGreen.addChild(spTurtleMedal);

        let spJackpotPopFrame4 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame4.setPreferredSize(new cc.Size(166, 72));
        spJackpotPopBase.addChild(spJackpotPopFrame4);
        spJackpotPopFrame4.setPosition(358, 48);
        let lbPrize4Value = this._lbPrize4Value = new cc.LabelBMFont("500", res.JackpotGoldTextFont);
        spJackpotPopFrame4.addChild(lbPrize4Value);
        lbPrize4Value.setPosition(83, 36);
        lbPrize4Value.setScale(0.4);
        let spJackpotPopBlue = new cc.Sprite(ReferenceName.JackpotPopBlue);
        spJackpotPopBlue.setPosition(358, 96);
        spJackpotPopBase.addChild(spJackpotPopBlue);
        let spButterflyFishMedal = new cc.Sprite(ReferenceName.JackpotButterflyFishIcon);
        spButterflyFishMedal.setPosition(22, 18);
        spButterflyFishMedal.setScale(0.53);
        spJackpotPopBlue.addChild(spButterflyFishMedal);

        let selfPoint = this;
        ClientServerConnect.getCurrentJackpotValues().then(jackpotValues => {
            //show the jackpot list
            if (jackpotValues["status"] === 200)
                selfPoint._showJackpotPrizeValues(jackpotValues["data"]);
        }).catch(console.error)
    },

    showDetail: function(){
        let spJackpotPopBase = this._spJackpotPopBase;
        _spJackpotPopBase.runAction(cc.moveTo(0.2, 0, 0).easing(cc.easeBounceIn()));
    },

    _showJackpotPrizeValues: function(prizeValues){
        if(!prizeValues)
            return;
        let prizeValue = prizeValues["Level_1"];
        if(prizeValue)
            this._lbPrize1Value.setString(Math.round(prizeValue["value"]));
        prizeValue = prizeValues["Level_2"];
        if(prizeValue)
            this._lbPrize2Value.setString(Math.round(prizeValue["value"]));
        prizeValue = prizeValues["Level_3"];
        if(prizeValue)
            this._lbPrize3Value.setString(Math.round(prizeValue["value"]));
        prizeValue = prizeValues["Level_4"];
        if(prizeValue)
            this._lbPrize4Value.setString(Math.round(prizeValue["value"]));
    },

    onEnter: function(){
        cc.LayerColor.prototype.onEnter.call(this);
        if (this._layerEventListener && !this._layerEventListener._isRegistered())
            cc.eventManager.addListener(this._layerEventListener, this);
    },

    cleanup: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.LobbyJackpotPlist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotMiniGamePlist);
        cc.LayerColor.prototype.cleanup.call(this);
    }
});
