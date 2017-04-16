
var JackpotPanel = cc.Layer.extend({ //gradient
    _selectedBoxes: 0,
    _prizeList: null,
    _iconPatterns: null,

    ctor: function(iconPattern, prizeList, winAward){
        cc.Layer.prototype.ctor.call(this);

        cc.spriteFrameCache.addSpriteFrames(res.JackpotMiniGamePlist);

        //buzz effect
        //

        let spBackground = new cc.Sprite(ReferenceName.JackpotBase);
        spBackground.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
        this.addChild(spBackground);
        //spBackground.setScale(0.8);
        const panelSize = spBackground.getContentSize();

        let spTimerBackground = new cc.Sprite(ReferenceName.JackpotTimerBg);
        spBackground.addChild(spTimerBackground);
        spTimerBackground.setAnchorPoint(0, 0.5);
        spTimerBackground.setPosition(25, panelSize.height * 0.90);
        let lbPlayer = new cc.LabelTTF("中奖玩家: 张三打鱼", "Arial", 20);
        lbPlayer.setAnchorPoint(0, 0.5);
        lbPlayer.setPosition(18, 24);
        spTimerBackground.addChild(lbPlayer);
        let spTimerIcon = new cc.Sprite(ReferenceName.JackpotTimerIcon);
        spTimerBackground.addChild(spTimerIcon);
        spTimerIcon.setPosition(240, 24);
        let lbTimeCounter = new cc.LabelTTF("30", "Arial", 24);
        lbTimeCounter.setColor(new cc.Color(200, 200, 10, 255));
        spTimerBackground.addChild(lbTimeCounter);
        lbTimeCounter.setPosition(278, 24);

        //title
        let spTitle = new cc.Sprite(ReferenceName.JackpotTitle);
        spBackground.addChild(spTitle);
        spTitle.setPosition(panelSize.width * 0.5, panelSize.height * 0.90);

        //notification bg
        let spNotificationBg = new cc.Sprite(ReferenceName.JackpotNotificationBackground);
        spBackground.addChild(spNotificationBg);
        spNotificationBg.setPosition(panelSize.width * 0.47, panelSize.height * 0.72);
        let notificationSize = spNotificationBg.getContentSize();

        let lbNotification = new cc.LabelTTF("点击任何宝箱收集图案，收集3个相同的图案赢得大奖！", "Arial", 18);
        spNotificationBg.addChild(lbNotification);
        lbNotification.setPosition(notificationSize.width * 0.5, notificationSize.height * 0.5);

        //prize list
        let spPrizeListFrame1 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame1);
        spPrizeListFrame1.setPosition(panelSize.width * 0.83, panelSize.height * 0.76);
        let lbPrizeTitle1 = new cc.LabelTTF("1", "Arial", 18);
        spPrizeListFrame1.addChild(lbPrizeTitle1);
        lbPrizeTitle1.setPosition(165, 82);
        let spMermaidIcon = new cc.Sprite(ReferenceName.JackpotMermaidIcon);
        spPrizeListFrame1.addChild(spMermaidIcon);
        spMermaidIcon.setPosition(55, 50);
        let lbPrize1Value = new cc.LabelBMFont("16,013,245", res.JackpotGoldTextFont);
        spPrizeListFrame1.addChild(lbPrize1Value);
        lbPrize1Value.setPosition(185, 40);
        lbPrize1Value.setScale(0.3);


        let spPrizeListFrame2 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame2);
        spPrizeListFrame2.setPosition(panelSize.width * 0.83, panelSize.height * 0.59);
        let lbPrizeTitle2 = new cc.LabelTTF("2", "Arial", 18);
        spPrizeListFrame2.addChild(lbPrizeTitle2);
        lbPrizeTitle2.setPosition(165, 82);
        let spSharkIcon = new cc.Sprite(ReferenceName.JackpotSharkIcon);
        spPrizeListFrame2.addChild(spSharkIcon);
        spSharkIcon.setPosition(55, 50);
        let lbPrize2Value = new cc.LabelBMFont("513,221", res.JackpotGoldTextFont);
        spPrizeListFrame2.addChild(lbPrize2Value);
        lbPrize2Value.setPosition(185, 40);
        lbPrize2Value.setScale(0.3);

        let spPrizeListFrame3 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame3);
        spPrizeListFrame3.setPosition(panelSize.width * 0.83, panelSize.height * 0.42);
        let lbPrizeTitle3 = new cc.LabelTTF("3", "Arial", 18);
        spPrizeListFrame3.addChild(lbPrizeTitle3);
        lbPrizeTitle3.setPosition(165, 82);
        let spTurtleIcon = new cc.Sprite(ReferenceName.JackpotTurtleIcon);
        spPrizeListFrame3.addChild(spTurtleIcon);
        spTurtleIcon.setPosition(55, 50);
        let lbPrize3Value = new cc.LabelBMFont("13,228", res.JackpotGoldTextFont);
        spPrizeListFrame3.addChild(lbPrize3Value);
        lbPrize3Value.setPosition(185, 40);
        lbPrize3Value.setScale(0.3);

        let spPrizeListFrame4 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame4);
        spPrizeListFrame4.setPosition(panelSize.width * 0.83, panelSize.height * 0.25);
        let lbPrizeTitle4 = new cc.LabelTTF("4", "Arial", 18);
        spPrizeListFrame4.addChild(lbPrizeTitle4);
        lbPrizeTitle4.setPosition(165, 82);
        let spButterflyFishIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishIcon);
        spPrizeListFrame4.addChild(spButterflyFishIcon);
        spButterflyFishIcon.setPosition(55, 50);
        let lbPrize4Value = new cc.LabelBMFont("628", res.JackpotGoldTextFont);
        spPrizeListFrame4.addChild(lbPrize4Value);
        lbPrize4Value.setPosition(185, 40);
        lbPrize4Value.setScale(0.3);

        //Treasure Box
        let boxStartPoint = cc.p(215, 100), boxPadding = new cc.Size(180, 120), spTreasureBox, selfPoint = this;
        for(let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                spTreasureBox = new cc.Sprite(ReferenceName.JackpotTreasureBoxOpen_00000);
                spTreasureBox.setPosition(boxStartPoint.x + boxPadding.width * col, boxStartPoint.y + boxPadding.height * row);
                spBackground.addChild(spTreasureBox);

                //add touch listener
                let touchEventListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function(touch, event){
                        let target = event.getCurrentTarget();
                        if(cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                            target.convertToNodeSpace(touch.getLocation()))){
                            //show the effect
                            let spEffect = target.getChildByTag(1);
                            if(!spEffect)
                                spEffect = new cc.Sprite(ReferenceName.JackpotChestGlow_00014);
                            spEffect.setPosition(85, 44);
                            target.addChild(spEffect, 1, 1);
                            return true;
                        } else {
                            return false;
                        }
                    },

                    onTouchMoved: function(touch, event) {
                        let target = event.getCurrentTarget();
                        let spEffect = target.getChildByTag(1);
                        if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                                target.convertToNodeSpace(touch.getLocation()))) {
                            if (!spEffect.isVisible())
                                spEffect.setVisible(true);
                        } else {
                            if (spEffect.isVisible())
                                spEffect.setVisible(false);
                        }
                    },

                    onTouchEnded: function(touch, event){
                        let target = event.getCurrentTarget();
                        if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                                target.convertToNodeSpace(touch.getLocation()))) {
                            //
                            let boxAnimation = GUIFunctions.getAnimation(ReferenceName.JackpotTreasureBoxOpenAnm, 0.05);
                            target.runAction(cc.sequence(boxAnimation, cc.callFunc(function(){
                                this.removeFromParent(true);
                            }, target)));

                            let spMedal = selfPoint._createIconSprite();
                            spBackground.addChild(spMedal);
                            spMedal.setPosition(target.getPosition());
                            spMedal.setScale(0.05);
                            spMedal.runAction(cc.sequence(cc.scaleTo(0.8, 1), cc.callFunc(function(){
                                //
                            }, spMedal)));
                            //remove the event listener
                            cc.eventManager.removeListeners(target);
                        }
                        let spEffect = target.getChildByTag(1);
                        if(spEffect)
                            spEffect.setVisible(false);
                    }
                });
                cc.eventManager.addListener(touchEventListener, spTreasureBox);
            }
        }
    },

    cleanup: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotMiniGamePlist);
        cc.Layer.prototype.cleanup.call(this);
    },

    _createIconSprite: function(){
        let type = this._selectedBoxes % 4, spIcon;
        if(type === 0){
            spIcon = new cc.Sprite(ReferenceName.JackpotMermaidIcon);
        } else if(type === 1){
            spIcon = new cc.Sprite(ReferenceName.JackpotSharkIcon);
        } else if(type === 2){
            spIcon = new cc.Sprite(ReferenceName.JackpotTurtleIcon);
        } else {
            spIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishIcon);
        }
        this._selectedBoxes++;
        return spIcon;
    },

    showRemainBoxes: function(){
        //show the remain boxes.

    }
});

var JackpotAwardPanel = cc.LayerColor.extend({
    ctor: function(){
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 192), 1163, 631);


    }
});
