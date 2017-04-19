
var JackpotPanel = cc.Layer.extend({ //gradient
    _selectedIndex: 0,
    _jackpotResult: null,
    _unselectedBoxes: null,
    _selectedMedals: null,
    _pnAward: null,
    _spBackground: null,
    _spTimer: null,
    _lbTimeCounter: null,

    _lbPlayer: null,

    _lbPrize1Value: null,
    _lbPrize2Value: null,
    _lbPrize3Value: null,
    _lbPrize4Value: null,

    ctor: function() {
        cc.Layer.prototype.ctor.call(this);

        this._unselectedBoxes = [];
        this._selectedMedals = [];
        let boxes = this._unselectedBoxes;

        cc.spriteFrameCache.addSpriteFrames(res.JackpotMiniGamePlist);
        cc.spriteFrameCache.addSpriteFrames(res.JackpotMiniGame2Plist);
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUI2Plist);
        //buzz effect

        let spBackground = new cc.Sprite(ReferenceName.JackpotBase);
        spBackground.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
        this.addChild(spBackground);
        const panelSize = spBackground.getContentSize();
        this._spBackground = spBackground;

        let spTimerBackground = new cc.Sprite(ReferenceName.JackpotTimerBg);
        spBackground.addChild(spTimerBackground);
        spTimerBackground.setAnchorPoint(0, 0.5);
        spTimerBackground.setPosition(25, panelSize.height * 0.90);

        let lbPlayer = this._lbPlayer = new cc.LabelTTF("中奖玩家: ", "Arial", 20);
        lbPlayer.setAnchorPoint(0, 0.5);
        lbPlayer.setPosition(18, 24);
        spTimerBackground.addChild(lbPlayer);
        let spTimerIcon = this._spTimer = new cc.Sprite(ReferenceName.JackpotTimerIcon);
        spTimerBackground.addChild(spTimerIcon);
        spTimerIcon.setPosition(240, 24);
        spTimerIcon.setAnchorPoint(0.5, 0.4);
        spTimerIcon.setRotation(-20);
        spTimerIcon.runAction(cc.sequence(cc.rotateBy(0.07, 40), cc.rotateBy(0.07, -40)).repeatForever());
        let lbTimeCounter = this._lbTimeCounter = new cc.LabelTTF("30", "Arial", 24);
        lbTimeCounter.setColor(new cc.Color(200, 200, 10, 255));
        spTimerBackground.addChild(lbTimeCounter);
        lbTimeCounter.setPosition(278, 24);
        lbTimeCounter.setUserData(30);

        lbTimeCounter.schedule(function () {
            let remainTime = this.getUserData();
            remainTime--;
            this.setString(remainTime);
            this.setUserData(remainTime);
            if(remainTime === 10)
                this.setColor(new cc.Color(255, 0, 0, 255));
            if (remainTime <= 0) {
                this.unscheduleAllCallbacks();
            }
        }, 1, cc.REPEAT_FOREVER);

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
        let lbPrize1Value = this._lbPrize1Value = new cc.LabelBMFont("16,013,245", res.JackpotGoldTextFont);
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
        let lbPrize2Value = this._lbPrize2Value = new cc.LabelBMFont("513,221", res.JackpotGoldTextFont);
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
        let lbPrize3Value = this._lbPrize3Value = new cc.LabelBMFont("13,228", res.JackpotGoldTextFont);
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
        let lbPrize4Value = this._lbPrize4Value = new cc.LabelBMFont("628", res.JackpotGoldTextFont);
        spPrizeListFrame4.addChild(lbPrize4Value);
        lbPrize4Value.setPosition(185, 40);
        lbPrize4Value.setScale(0.3);

        ClientServerConnect.requestMyData().then(stats => {
            console.log(stats.data);
            return ClientServerConnect.getCurrentJackpotValues()
        }).then(jackpotValues => {
            //show the jackpot list
            if(jackpotValues["status"] === 200)
                selfPoint._showJackpotPrizeValues(jackpotValues["data"]);
            return ClientServerConnect.listUncollectedJackpots();
        }).then(jackpotObject => {
            console.log(jackpotObject);
            if(jackpotObject["status"] === 200)
                selfPoint._jackpotResult = jackpotObject["data"][0];
        }).catch(console.error);

        //Treasure Box
        let boxStartPoint = cc.p(215, 100), boxPadding = new cc.Size(180, 120), spTreasureBox, selfPoint = this;
        for (let row = 2; row >= 0; row--) {
            for (let col = 0; col < 4; col++) {

                spTreasureBox = new cc.Sprite(ReferenceName.JackpotTreasureBoxOpen_00000);
                spTreasureBox.setPosition(boxStartPoint.x + boxPadding.width * col, boxStartPoint.y + boxPadding.height * row);
                spBackground.addChild(spTreasureBox);
                boxes.push(spTreasureBox);

                //add touch listener
                let touchEventListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        let target = event.getCurrentTarget();
                        if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                                target.convertToNodeSpace(touch.getLocation()))) {
                            //show the effect
                            let spEffect = target.getChildByTag(1);
                            if (!spEffect) {
                                spEffect = new cc.Sprite(ReferenceName.JackpotChestGlow);
                                spEffect.setPosition(85, 44);
                                target.addChild(spEffect, 1, 1);
                            } else {
                                spEffect.setVisible(true);
                            }
                            return true;
                        } else {
                            return false;
                        }
                    },

                    onTouchMoved: function (touch, event) {
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

                    onTouchEnded: function (touch, event) {
                        let target = event.getCurrentTarget();
                        if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                                target.convertToNodeSpace(touch.getLocation()))) {
                            //
                            let boxAnimation = GUIFunctions.getAnimation(ReferenceName.JackpotTreasureBoxOpenAnm, 0.03);
                            target.runAction(cc.sequence(boxAnimation, cc.callFunc(function () {
                                this.removeFromParent(true);
                            }, target)));
                            selfPoint._removeBoxFromArray(target);

                            let spMedalGlow = selfPoint._createMedalGlowSprite(); //glow first.
                            let spMedal = selfPoint._createMedalSprite();

                            spMedalGlow.setOpacity(0);
                            spMedalGlow.setVisible(false);
                            spBackground.addChild(spMedal);
                            spMedal.setPosition(target.getPosition());
                            spMedal.setScale(0.05);
                            spMedal.addChild(spMedalGlow, -1, 1);  //tag = 1
                            spMedal.runAction(cc.sequence(cc.delayTime(0.4), cc.scaleTo(0.5, 1).easing(cc.easeBounceOut())));

                            spMedalGlow.setPosition(spMedal.width * 0.55, spMedal.height * 0.45);
                            let medalCount = selfPoint._glowSameMedals(spMedal);

                            if (medalCount >= 3) {
                                //show all the
                                selfPoint.showRemainBoxes();
                            }

                            //remove the event listener
                            cc.eventManager.removeListeners(target);
                        }
                        let spEffect = target.getChildByTag(1);
                        if (spEffect)
                            spEffect.setVisible(false);
                    }
                });
                cc.eventManager.addListener(touchEventListener, spTreasureBox);
            }
        }
    },


    cleanup: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotMiniGamePlist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotMiniGame2Plist);
        cc.spriteFrameCache.removeSpriteFramesFromFIle(res.LobbyUI2Plist);
        cc.Layer.prototype.cleanup.call(this);
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

    _removeBoxFromArray: function(treasureBox) {
        let boxes = this._unselectedBoxes;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i] === treasureBox) {
                boxes.splice(i, 1);
                return;
            }
        }
    },

    _glowSameMedals: function(medal){
        let medals = this._selectedMedals, arr = [];
        medals.push(medal);

        for(let i = 0; i < medals.length; i++){
            if(medal.getUserData()  === medals[i].getUserData())
                arr.push(medals[i]);
        }
        if(arr.length >= 2){
            for(let i = 0; i < arr.length; i++){
                let selGlow = arr[i].getChildByTag(1);
                selGlow.setVisible(true);
                selGlow.runAction(cc.sequence(cc.delayTime(0.9), cc.fadeIn(0.1), cc.delayTime(0.2), cc.fadeOut(0.5), cc.hide()));
            }
        }
        return arr.length;
    },

    _createMedalSprite: function(){
        let type = this._getTypeFromPattern(), spIcon;
        if(type === 1)
            spIcon = new cc.Sprite(ReferenceName.JackpotMermaidMedal_00000);
        else if(type === 2)
            spIcon = new cc.Sprite(ReferenceName.JackpotSharkMedal_00000);
        else if(type === 3)
            spIcon = new cc.Sprite(ReferenceName.JackpotTurtleMedal_00000);
        else
            spIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishMedal_00000);
        spIcon.setUserData(type);
        this._selectedIndex++;
        return spIcon;
    },

    _createMedalGlowSprite: function(){
        let type = this._getTypeFromPattern(), spIcon;
        if(type === 1)
            spIcon = new cc.Sprite(ReferenceName.JackpotMermaidMedalGlow);
         else if(type === 2)
            spIcon = new cc.Sprite(ReferenceName.JackpotSharkMedalGlow);
        else if(type === 3)
            spIcon = new cc.Sprite(ReferenceName.JackpotTurtleMedalGlow);
        else
            spIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishMedalGlow);
        return spIcon;
    },

    _createGrayMedalSprite: function(){
        let type = this._getTypeFromPattern(), spIcon;
        if(type === 1)
            spIcon = new cc.Sprite(ReferenceName.JackpotMermaidIconGray);
        else if(type === 2)
            spIcon = new cc.Sprite(ReferenceName.JackpotSharkIconGray);
        else if(type === 3)
            spIcon = new cc.Sprite(ReferenceName.JackpotTurtleIconGray);
        else
            spIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishIconGray);
        spIcon.setUserData(type);
        this._selectedIndex++;
        return spIcon;
    },

    _getTypeFromPattern: function(){
        let pattern = this._jackpotResult["lotteryPattern"];
        return pattern[this._selectedIndex];
    },

    showRemainBoxes: function() {
        //show the remain boxes.
        let boxes = this._unselectedBoxes, delay = 1.5, ins = 0.8, selfPoint = this;
        for (let i = 0; i < boxes.length; i++) {
            delay += ins;
            let selBox = boxes[i];
            cc.eventManager.removeListeners(selBox);
            let spGrayMedal = this._createGrayMedalSprite();
            this._spBackground.addChild(spGrayMedal);
            spGrayMedal.setPosition(selBox.getPosition());
            spGrayMedal.setScale(0.05);
            spGrayMedal.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0.4, 1)));

            let boxAnimation = GUIFunctions.getAnimation(ReferenceName.JackpotTreasureBoxOpenAnm, 0.02);
            selBox.runAction(cc.sequence(cc.delayTime(delay), boxAnimation, cc.callFunc(function () {
                this.removeFromParent(true);
                selfPoint._removeBoxFromArray(this);
            }, selBox)));
        }

        delay += ins;
        //show the award panel.
        this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
            let result = this._jackpotResult;
            let pnAward = new JackpotAwardPanel(result["level"], result["rewardValue"]);
            pnAward.setPosition(101, 74);
            this.addChild(pnAward);
            this._stopTimer();
        }, this)));
    },

    _stopTimer: function(){
        this._spTimer.stopAllActions();
        this._lbTimeCounter.unscheduleAllCallbacks();
        this._lbTimeCounter.setString("0");
        this._lbTimeCounter.setColor(new cc.Color(255, 255, 255, 255));
    }
});

var JackpotAwardPanel = cc.LayerColor.extend({
    ctor: function(awardLv, awardMoney){
        let panelSize = new cc.Size(1162, 628);
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 168), panelSize.width, panelSize.height);

        cc.spriteFrameCache.addSpriteFrames(res.JackpotCoinAnimationPlist);

        //panel
        let spAwardPanel = new cc.Sprite(ReferenceName.JackpotWinBase);
        this.addChild(spAwardPanel);
        spAwardPanel.setPosition(panelSize.width * 0.5, panelSize.height * 0.5);
        spAwardPanel.setScale(0.3);
        let spAwardLevel = this._createAwardLevelSprite(awardLv);
        spAwardPanel.addChild(spAwardLevel);
        spAwardLevel.setPosition(200, 200);
        let lbAwardMoney = new cc.LabelBMFont(Math.round(awardMoney), res.JackpotGoldTextFont);
        lbAwardMoney.setPosition(270, 90);
        spAwardPanel.addChild(lbAwardMoney);

        let pnDist1 = new cc.Point(panelSize.width * 0.5, panelSize.height * 0.88),
            pnDist2 = new cc.Point(panelSize.width * 0.5, panelSize.height * 0.71);
        spAwardPanel.runAction(cc.sequence(cc.spawn(cc.moveTo(0.4, pnDist1), cc.scaleTo(0.4, 0.42)),
            cc.spawn(cc.moveTo(0.4, pnDist2), cc.scaleTo(0.4, 1).easing(cc.easeBackOut()))));

        //light
        let spLight = new cc.Sprite(ReferenceName.JackpotCoinLight);
        this.addChild(spLight);
        spLight.setPosition(panelSize.width * 0.5, 225);
        spLight.setScaleY(0.8);
        spLight.setOpacity(0);
        spLight.runAction(cc.sequence(cc.delayTime(1.6), cc.fadeIn(0.6)));

        //coins animation
        let spCoins1 = new cc.Sprite(ReferenceName.JackpotCoinAnimation_00001);
        spCoins1.setPosition(panelSize.width * 0.5, 225);
        spCoins1.setScaleX(1.15);
        this.addChild(spCoins1);
        //spCoins1.setVisible(false);
        let coinsAnimation = GUIFunctions.getAnimation(ReferenceName.JackpotCoinAnimation, 0.03);
        spCoins1.runAction(cc.sequence(cc.show(), coinsAnimation, cc.hide(), cc.delayTime(0.5)).repeatForever());

        let spCoins2 = new cc.Sprite(ReferenceName.JackpotCoinAnimation_00001);
        spCoins2.setPosition(panelSize.width * 0.5, 225);
        spCoins2.setScaleX(1.15);
        this.addChild(spCoins2);
        spCoins2.setVisible(false);
        let coinsAnimation2 = GUIFunctions.getAnimation(ReferenceName.JackpotCoinAnimation, 0.03);
        spCoins2.runAction(cc.sequence(cc.delayTime(0.5), cc.show(), coinsAnimation2, cc.hide()).repeatForever());


    },
    cleanup: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotCoinAnimationPlist);
    },

    _createAwardLevelSprite: function(level) {
        if (!level)
            throw "invalid level.";

        let spAward;
        if (level === "Level_1") {
            spAward = new cc.Sprite(ReferenceName.JackpotWin1);
        } else if (level === "Level_2") {
            spAward = new cc.Sprite(ReferenceName.JackpotWin2);
        } else if (level === "Level_3") {
            spAward = new cc.Sprite(ReferenceName.JackpotWin3);
        } else {
            spAward = new cc.Sprite(ReferenceName.JackpotWin4);
        }
        return spAward;
    }
});
