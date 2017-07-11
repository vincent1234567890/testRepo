let JackpotFloatPanel = cc.Node.extend({
    _lbJackpotValue: null,
    _barFrameEventListener: null,
    _spBarFrame: null,

    ctor: function(){
        cc.Node.prototype.ctor.call(this);
        this._className = "JackpotFloatPanel";

        cc.spriteFrameCache.addSpriteFrames(res.LobbyJackpotPlist);
        cc.spriteFrameCache.addSpriteFrames(res.WaterCausticAnimation);

        //shadow
        let spShadow = new cc.Sprite(ReferenceName.JackpotShadow);
        this.addChild(spShadow);
        spShadow.setPosition(0, -5);

        //background
        let spBackground = new cc.Sprite(ReferenceName.JackpotBackground);
        this.addChild(spBackground);
        spBackground.setPosition(0, 0);

        //light
        let spLight = new cc.Sprite(ReferenceName.JackpotLight);
        this.addChild(spLight);
        spLight.setPosition(0, 0);
        spLight.runAction(cc.rotateBy(25,360).repeatForever());

        //bar
        let spBar = new cc.Sprite(ReferenceName.JackpotBar);
        this.addChild(spBar);
        spBar.setPosition(0, -22);

        //title
        let spTitle = new cc.Sprite(ReferenceName.JackpotTitleChinese);
        this.addChild(spTitle);
        spTitle.setPosition(0, 22);

        //spWaterCaustic
        let spWaterCaustic = new cc.Sprite(ReferenceName.JackpotWaterCaustic00000);
        spWaterCaustic.setScale(0.2);
        spWaterCaustic.setBlendFunc(cc.ONE, cc.ONE);
        spWaterCaustic.setPosition(0, 0);
        let animWater = GUIFunctions.getAnimation(ReferenceName.JackpotWaterCausticAnim, 0.05);
        spWaterCaustic.runAction(animWater.repeatForever());

        let spMask = new cc.Sprite(ReferenceName.JackpotBar);
        let maskedFill = new cc.ClippingNode(spMask);
        maskedFill.setAlphaThreshold(0.9);
        // maskedFill.addChild(color,1);
        maskedFill.addChild(spWaterCaustic);
        maskedFill.setPosition(0,-22);
        this.addChild(maskedFill);

        //barFrame
        let spBarFrame = this._spBarFrame = new cc.Sprite(ReferenceName.JackpotBarFrame);
        spBarFrame.setPosition(0, -22);
        this.addChild(spBarFrame);


        //jackpot value label
        let barSize = spBarFrame.getContentSize();
        let lbJackpotValue = this._lbJackpotValue = new cc.LabelBMFont(" ", res.WhiteFontFile);
        spBarFrame.addChild(lbJackpotValue, -1);
        lbJackpotValue.setPosition(barSize.width * 0.5, 33);
        lbJackpotValue.setScale(0.6);

        //add the event listener
        this._barFrameEventListener = cc.EventListener.create({
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
                    cc.audioEngine.playEffect(res.JackpotViewPressedSound);
                    let jackpotPanel = new JackpotDetailPanel(), scene = cc.director.getRunningScene();
                    scene.addChild(jackpotPanel, 999);
                    jackpotPanel.showDetail();
                }
            }
        });

        const lensFlareSmall = new cc.Sprite(ReferenceName.JackpotLensFlareSmall);
        this.addChild(lensFlareSmall);
        lensFlareSmall.setPosition(-180,0);
        lensFlareSmall.runAction(cc.sequence(cc.moveTo(3, 180, 0), cc.moveTo(3, -180, 0)).repeatForever());

        const lensFlareMedium = new cc.Sprite(ReferenceName.JackpotLensFlareMedium);
        this.addChild(lensFlareMedium);
        lensFlareMedium.setPosition(-90,0);
        lensFlareMedium.runAction(cc.sequence(cc.moveTo(3, 90, 0), cc.moveTo(3, -90, 0)).repeatForever());

        const lensFlareLarge = new cc.Sprite(ReferenceName.JackpotLensFlareLarge);
        this.addChild(lensFlareLarge);
        lensFlareLarge.setPosition(90,0);
        lensFlareLarge.runAction(cc.sequence(cc.moveTo(3, -90, 0), cc.moveTo(3, 90, 0)).repeatForever());
    },

    onEnter: function(){
       cc.Node.prototype.onEnter.call(this);
        if (this._barFrameEventListener && !this._barFrameEventListener._isRegistered())
            cc.eventManager.addListener(this._barFrameEventListener, this._spBarFrame);
        //reload the value.  should update the data by event.
        ClientServerConnect.getCurrentJackpotValues().then(values => {
            const total = Object.keys(values["data"]).map(key => values["data"][key]).map(level => level.value).reduce((a, b) => a + b, 0);
            this.updateJackpot(total);
        });
        // @todo load user info
        // ...

    },

    updateJackpot: function(value) {
        this._lbJackpotValue.setString(Math.round(value).toLocaleString('en-US', {maximumFractionDigits: 2}));
    },

    cleanup: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.LobbyJackpotPlist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.WaterCausticAnimation);
        cc.Node.prototype.cleanup.call(this);
    }
});

let JackpotDetailPanel = cc.LayerColor.extend({
    _spJackpotPopBase: null,
    _lbPrize1Value: null,
    _lbPrize2Value: null,
    _lbPrize3Value: null,
    _lbPrize4Value: null,

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
                    cc.audioEngine.playEffect(res.JackpotInfoPanelDismissSound);
                    let spJackpotPopBase = target._spJackpotPopBase, size = target._contentSize;
                    spJackpotPopBase.runAction(cc.sequence(
                        cc.moveTo(0.5, size.width * 0.5, size.height * 1.5).easing(cc.easeBackIn()),
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
        let lbPrize1Value = this._lbPrize1Value = new cc.LabelBMFont("", res.JackpotGoldTextFont);
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
        let lbPrize2Value = this._lbPrize2Value = new cc.LabelBMFont("", res.JackpotGoldTextFont);
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
        let lbPrize3Value = this._lbPrize3Value = new cc.LabelBMFont("", res.JackpotGoldTextFont);
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
        let lbPrize4Value = this._lbPrize4Value = new cc.LabelBMFont("", res.JackpotGoldTextFont);
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
        let spJackpotPopBase = this._spJackpotPopBase, size = this._contentSize;
        spJackpotPopBase.setPositionY(size.height * 1.5);
        spJackpotPopBase.runAction(cc.moveTo(0.5, size.width * 0.5, size.height * 0.5).easing(cc.easeBackIn()));
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
