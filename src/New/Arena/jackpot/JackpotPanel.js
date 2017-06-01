let JackpotPanel = cc.LayerColor.extend({ //gradient
    _isPlaying: null,
    _jackpotResult: null,

    _pnContent: null,
    _unselectedBoxes: null,
    _selectedIndex: 0,
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
    _eventListener: null,

    _onFinishCallback: null,

    ctor: function (isPlaying, jackpotRewardObject, onFinishCallback) {
        this._isPlaying = isPlaying;
        this._jackpotResult = jackpotRewardObject;

        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 0));
        this.setCascadeOpacityEnabled(false);

        let pnContent = this._pnContent = new cc.Layer();
        this.addChild(pnContent);
        pnContent.setVisible(false);

        this._unselectedBoxes = [];
        this._selectedMedals = [];
        const boxes = this._unselectedBoxes;

        cc.spriteFrameCache.addSpriteFrames(res.JackpotMiniGamePlist);
        cc.spriteFrameCache.addSpriteFrames(res.JackpotMiniGame2Plist);
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUI2Plist);
        //buzz effect

        cc.audioEngine.playEffect(res.JackpotTriggeredSound);

        const spBackground = new cc.Sprite(ReferenceName.JackpotBase);
        this._spBackground = spBackground;
        spBackground.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
        pnContent.addChild(spBackground);
        const panelSize = spBackground.getContentSize();
        this._spBackground = spBackground;

        const spTimerBackground = new cc.Sprite(ReferenceName.JackpotTimerBg);
        spBackground.addChild(spTimerBackground);
        spTimerBackground.setAnchorPoint(0, 0.5);
        spTimerBackground.setPosition(25, panelSize.height * 0.90);

        const lbPlayer = this._lbPlayer = new cc.LabelTTF("中奖玩家: ", "Arial", 20);
        lbPlayer.setAnchorPoint(0, 0.5);
        lbPlayer.setPosition(18, 24);
        spTimerBackground.addChild(lbPlayer);
        const spTimerIcon = this._spTimer = new cc.Sprite(ReferenceName.JackpotTimerIcon);
        spTimerBackground.addChild(spTimerIcon);
        spTimerIcon.setPosition(240, 24);
        spTimerIcon.setAnchorPoint(0.5, 0.4);
        spTimerIcon.setRotation(-20);
        spTimerIcon.runAction(cc.sequence(cc.rotateBy(0.07, 40), cc.rotateBy(0.07, -40)).repeatForever());
        const lbTimeCounter = this._lbTimeCounter = new cc.LabelTTF("10", "Arial", 24);
        lbTimeCounter.setColor(new cc.Color(200, 200, 10, 255));
        spTimerBackground.addChild(lbTimeCounter);
        lbTimeCounter.setPosition(278, 24);
        lbTimeCounter.setUserData(10);

        if (isPlaying) {
            lbTimeCounter.schedule(function () {
                let remainTime = this.getUserData();
                remainTime--;
                this.setString(remainTime);
                this.setUserData(remainTime);
                if (remainTime === 5)
                    this.setColor(new cc.Color(255, 0, 0, 255));
                if (remainTime <= 0) {
                    //auto open a box
                    selfPoint._autoOpenBox();
                }
            }, 1, cc.REPEAT_FOREVER);
        }

        //title
        const spTitle = new cc.Sprite(ReferenceName.JackpotTitle);
        spBackground.addChild(spTitle);
        spTitle.setPosition(panelSize.width * 0.5, panelSize.height * 0.90);

        //notification bg
        const spNotificationBg = new cc.Sprite(ReferenceName.JackpotNotificationBackground);
        spBackground.addChild(spNotificationBg);
        spNotificationBg.setPosition(panelSize.width * 0.47, panelSize.height * 0.72);
        const notificationSize = spNotificationBg.getContentSize();

        const lbNotification = new cc.LabelTTF("点击任何宝箱收集图案，收集3个相同的图案赢得大奖！", "Arial", 18);
        spNotificationBg.addChild(lbNotification);
        lbNotification.setPosition(notificationSize.width * 0.5, notificationSize.height * 0.5);

        this._createPrizeListFrame();

        const selfPoint = this;

        //load the jackpot prize pool value
        ClientServerConnect.getCurrentJackpotValues().then(jackpotValues => {
            //show the jackpot list
            if (jackpotValues.status === 200) {
                // We have already collected the player's reward and reset the jackpot, but that looks strange.
                // So we display the current jackpot value at the value that the player is about to win.
                const poolToWin = jackpotValues.data[jackpotRewardObject.level];
                if (poolToWin) {
                    poolToWin.value = jackpotRewardObject.rewardValue;
                }
                //show player display name
                if (jackpotRewardObject["playerDisplayName"])
                    selfPoint._lbPlayer.setString("中奖玩家: " + limitStringLength(jackpotRewardObject["playerDisplayName"], 14));

                selfPoint._showJackpotPrizeValues(jackpotValues.data);
            }
        }).catch(console.error);

        //Treasure Box
        const boxStartPoint = cc.p(215, 100), boxPadding = new cc.Size(180, 120);
        let spTreasureBox;
        for (let row = 2; row >= 0; row--) {
            for (let col = 0; col < 4; col++) {
                spTreasureBox = new cc.Sprite(ReferenceName.JackpotTreasureBoxOpen_00000);
                spTreasureBox.setPosition(boxStartPoint.x + boxPadding.width * col, boxStartPoint.y + boxPadding.height * row);
                spBackground.addChild(spTreasureBox);
                boxes.push(spTreasureBox);

                if (!isPlaying) {
                    continue;
                }

                //add touch listener
                const touchEventListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        const target = event.getCurrentTarget();
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
                        const target = event.getCurrentTarget();
                        const spEffect = target.getChildByTag(1);
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
                        const target = event.getCurrentTarget();
                        if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                                target.convertToNodeSpace(touch.getLocation()))) {
                            const medalCount = selfPoint._manualOpenBox(target);

                            if (medalCount < 3) {
                                selfPoint._resetTimeCounter();
                            }

                            //remove the event listener
                            cc.eventManager.removeListeners(target);
                        }
                        const spEffect = target.getChildByTag(1);
                        if (spEffect)
                            spEffect.setVisible(false);
                    }
                });
                cc.eventManager.addListener(touchEventListener, spTreasureBox);
            }
        }

        this._eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                const target = event.getCurrentTarget();
                return (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                    target.convertToNodeSpace(touch.getLocation())));
            },
            onTouchEnded: function (touch, event) {
                const target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    //do nothing.
                }
            }
        });

        this._addLight();
    },

    _addLight: function () {
        let sfLight = cc.spriteFrameCache.getSpriteFrame("JPLobbylight.png");
        if (!sfLight) {
            cc.spriteFrameCache.addSpriteFrames(res.LobbyJackpotPlist);
            sfLight = cc.spriteFrameCache.getSpriteFrame("JPLobbylight.png");
        }
        let spLight = new cc.Sprite(sfLight);
        spLight.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 105);
        this.addChild(spLight);
        spLight.setScale(0.1);
        spLight.runAction(cc.sequence(cc.scaleTo(0.3, 0.5), cc.scaleTo(0.2, 1.8, 0.3), cc.scaleTo(0.1, 0), cc.callFunc(function () {
            this.removeFromParent(true);
        }, spLight)));
        this.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeTo(0.3, 192)));
        const pnContent = this._pnContent;
        pnContent.setScale(0);
        pnContent.setVisible(true);
        pnContent.setAnchorPoint(0.5, spLight.y / cc.visibleRect.height);
        pnContent.runAction(cc.sequence(cc.delayTime(0.6), cc.scaleTo(0.6, 1).easing(cc.easeBounceOut())));
    },

    _resetTimeCounter: function () {
        this._lbTimeCounter.setUserData(10);
        this._lbTimeCounter.setString("10");
        this._lbTimeCounter.setColor(new cc.Color(255, 255, 255, 255));
    },

    _manualOpenBox: function (box) {
        return this._openBox(box);
    },

    _autoOpenBox: function () {
        if (this._unselectedBoxes.length <= 0) {
            this._lbTimeCounter.unscheduleAllCallbacks();
            this._spTimer.stopAllActions();
            return;
        }

        this._resetTimeCounter();
        const selBox = this._unselectedBoxes[0];
        this._openBox(selBox);

        //remove the event listener
        cc.eventManager.removeListeners(selBox);
    },

    // This gets called on clients who are viewing another player opening boxes
    showBoxOpening: function (boxNumber) {
        const boxes = this._unselectedBoxes;
        const boxToOpen = boxes[boxNumber];
        this._openBox(boxToOpen);
    },

    _openBox: function (box) {
        if (this._isPlaying) {
            const boxNumber = this._getBoxNumber(box);
            ClientServerConnect.getServerInformer().shareJackpotBoxOpened(boxNumber);
        }

        this._removeBoxFromArray(box);
        const medalCount = this._animateOpenBox(box);
        if (medalCount >= 3) {
            this.showRemainBoxes();
        }

        return medalCount;
    },

    _animateOpenBox: function (box) {
        const boxAnimation = GUIFunctions.getAnimation(ReferenceName.JackpotTreasureBoxOpenAnm, 0.03);
        box.runAction(cc.sequence(boxAnimation, cc.callFunc(function () {
            this.removeFromParent(true);
        }, box)));

        const spMedalGlow = this._createMedalGlowSprite(); //glow first.
        const spMedal = this._createMedalSprite();

        spMedalGlow.setOpacity(0);
        spMedalGlow.setVisible(false);
        this._spBackground.addChild(spMedal);
        spMedal.setPosition(box.getPosition());
        spMedal.setScale(0.05);
        spMedal.addChild(spMedalGlow, -1, 1);  //tag = 1
        spMedal.runAction(cc.sequence(cc.delayTime(0.4), cc.scaleTo(0.5, 1).easing(cc.easeBounceOut())));

        spMedalGlow.setPosition(spMedal.width * 0.55, spMedal.height * 0.45);

        box.runAction(cc.sequence(
            cc.callFunc(function () {
                cc.audioEngine.playEffect(res.JackpotBoxOpeningSound);
            }),
            cc.delayTime(1),
            cc.callFunc(function () {
                cc.audioEngine.playEffect(res.JackpotMedalBlingSound);
            })
        ))

        return this._glowSameMedals(spMedal);
    },

    _createPrizeListFrame: function () {
        const spBackground = this._spBackground;
        const panelSize = spBackground.getContentSize();
        //prize list
        const spPrizeListFrame1 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame1);
        spPrizeListFrame1.setPosition(panelSize.width * 0.83, panelSize.height * 0.76);
        const lbPrizeTitle1 = new cc.LabelTTF("1", "Arial", 18);
        spPrizeListFrame1.addChild(lbPrizeTitle1);
        lbPrizeTitle1.setPosition(165, 82);
        const spMermaidIcon = new cc.Sprite(ReferenceName.JackpotMermaidIcon);
        spPrizeListFrame1.addChild(spMermaidIcon);
        spMermaidIcon.setPosition(55, 50);
        const lbPrize1Value = this._lbPrize1Value = new cc.LabelBMFont("0", res.JackpotGoldTextFont);
        spPrizeListFrame1.addChild(lbPrize1Value);
        lbPrize1Value.setPosition(185, 40);
        lbPrize1Value.setScale(0.3);


        const spPrizeListFrame2 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame2);
        spPrizeListFrame2.setPosition(panelSize.width * 0.83, panelSize.height * 0.59);
        const lbPrizeTitle2 = new cc.LabelTTF("2", "Arial", 18);
        spPrizeListFrame2.addChild(lbPrizeTitle2);
        lbPrizeTitle2.setPosition(165, 82);
        const spSharkIcon = new cc.Sprite(ReferenceName.JackpotSharkIcon);
        spPrizeListFrame2.addChild(spSharkIcon);
        spSharkIcon.setPosition(55, 50);
        const lbPrize2Value = this._lbPrize2Value = new cc.LabelBMFont("0", res.JackpotGoldTextFont);
        spPrizeListFrame2.addChild(lbPrize2Value);
        lbPrize2Value.setPosition(185, 40);
        lbPrize2Value.setScale(0.3);

        const spPrizeListFrame3 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame3);
        spPrizeListFrame3.setPosition(panelSize.width * 0.83, panelSize.height * 0.42);
        const lbPrizeTitle3 = new cc.LabelTTF("3", "Arial", 18);
        spPrizeListFrame3.addChild(lbPrizeTitle3);
        lbPrizeTitle3.setPosition(165, 82);
        const spTurtleIcon = new cc.Sprite(ReferenceName.JackpotTurtleIcon);
        spPrizeListFrame3.addChild(spTurtleIcon);
        spTurtleIcon.setPosition(55, 50);
        const lbPrize3Value = this._lbPrize3Value = new cc.LabelBMFont("0", res.JackpotGoldTextFont);
        spPrizeListFrame3.addChild(lbPrize3Value);
        lbPrize3Value.setPosition(185, 40);
        lbPrize3Value.setScale(0.3);

        const spPrizeListFrame4 = new cc.Sprite(ReferenceName.JackpotPrizeListFrame);
        spBackground.addChild(spPrizeListFrame4);
        spPrizeListFrame4.setPosition(panelSize.width * 0.83, panelSize.height * 0.25);
        const lbPrizeTitle4 = new cc.LabelTTF("4", "Arial", 18);
        spPrizeListFrame4.addChild(lbPrizeTitle4);
        lbPrizeTitle4.setPosition(165, 82);
        const spButterflyFishIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishIcon);
        spPrizeListFrame4.addChild(spButterflyFishIcon);
        spButterflyFishIcon.setPosition(55, 50);
        const lbPrize4Value = this._lbPrize4Value = new cc.LabelBMFont("0", res.JackpotGoldTextFont);
        spPrizeListFrame4.addChild(lbPrize4Value);
        lbPrize4Value.setPosition(185, 40);
        lbPrize4Value.setScale(0.3);
    },

    _showJackpotPrizeValues: function (prizeValues) {
        if (!prizeValues)
            return;
        let prizeValue = prizeValues.Level_1;
        if (prizeValue)
            this._lbPrize1Value.setString(Math.round(prizeValue.value));
        prizeValue = prizeValues.Level_2;
        if (prizeValue)
            this._lbPrize2Value.setString(Math.round(prizeValue.value));
        prizeValue = prizeValues.Level_3;
        if (prizeValue)
            this._lbPrize3Value.setString(Math.round(prizeValue.value));
        prizeValue = prizeValues.Level_4;
        if (prizeValue)
            this._lbPrize4Value.setString(Math.round(prizeValue.value));
    },

    _getBoxNumber: function (treasureBox) {
        const boxes = this._unselectedBoxes;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i] === treasureBox) {
                return i;
            }
        }
        return -1;
    },

    _removeBoxFromArray: function (treasureBox) {
        const boxes = this._unselectedBoxes;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i] === treasureBox) {
                boxes.splice(i, 1);
                return;
            }
        }
    },

    _glowSameMedals: function (medal) {
        const medals = this._selectedMedals, arr = [];
        medals.push(medal);

        for (let i = 0; i < medals.length; i++) {
            if (medal.getUserData() === medals[i].getUserData())
                arr.push(medals[i]);
        }
        if (arr.length >= 2) {
            for (let i = 0; i < arr.length; i++) {
                const selGlow = arr[i].getChildByTag(1);
                selGlow.setVisible(true);
                selGlow.runAction(cc.sequence(cc.delayTime(0.9), cc.fadeIn(0.1), cc.delayTime(0.2), cc.fadeOut(0.5), cc.hide()));
            }
        }
        return arr.length;
    },

    _createMedalSprite: function () {
        const type = this._getTypeFromPattern();
        let spIcon;
        if (type === 1)
            spIcon = new cc.Sprite(ReferenceName.JackpotMermaidMedal_00000);
        else if (type === 2)
            spIcon = new cc.Sprite(ReferenceName.JackpotSharkMedal_00000);
        else if (type === 3)
            spIcon = new cc.Sprite(ReferenceName.JackpotTurtleMedal_00000);
        else
            spIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishMedal_00000);
        spIcon.setUserData(type);
        this._selectedIndex++;
        return spIcon;
    },

    _createMedalGlowSprite: function () {
        const type = this._getTypeFromPattern();
        let spIcon;
        if (type === 1)
            spIcon = new cc.Sprite(ReferenceName.JackpotMermaidMedalGlow);
        else if (type === 2)
            spIcon = new cc.Sprite(ReferenceName.JackpotSharkMedalGlow);
        else if (type === 3)
            spIcon = new cc.Sprite(ReferenceName.JackpotTurtleMedalGlow);
        else
            spIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishMedalGlow);
        return spIcon;
    },

    _createGrayMedalSprite: function () {
        const type = this._getTypeFromPattern();
        let spIcon;
        if (type === 1)
            spIcon = new cc.Sprite(ReferenceName.JackpotMermaidIconGray);
        else if (type === 2)
            spIcon = new cc.Sprite(ReferenceName.JackpotSharkIconGray);
        else if (type === 3)
            spIcon = new cc.Sprite(ReferenceName.JackpotTurtleIconGray);
        else
            spIcon = new cc.Sprite(ReferenceName.JackpotButterflyFishIconGray);
        spIcon.setUserData(type);
        this._selectedIndex++;
        return spIcon;
    },

    _getTypeFromPattern: function () {
        const pattern = this._jackpotResult.lotteryPattern;
        return pattern[this._selectedIndex];
    },

    showRemainBoxes: function () {
        //set the timer stop
        this._lbTimeCounter.setUserData(0);
        this._lbTimeCounter.setString("0");
        this._lbTimeCounter.setColor(new cc.Color(255, 255, 255, 255));
        this._lbTimeCounter.unscheduleAllCallbacks();
        this._spTimer.stopAllActions();

        //show the remain boxes.
        const boxes = this._unselectedBoxes;
        let delay = 1.5;
        const ins = 0.8, selfPoint = this;
        for (let i = 0; i < boxes.length; i++) {
            delay += ins;
            const selBox = boxes[i];
            cc.eventManager.removeListeners(selBox);
            const spGrayMedal = this._createGrayMedalSprite();
            this._spBackground.addChild(spGrayMedal);
            spGrayMedal.setPosition(selBox.getPosition());
            spGrayMedal.setScale(0.05);
            spGrayMedal.runAction(
                cc.sequence(
                    cc.delayTime(delay),
                    cc.callFunc(function () {
                        cc.audioEngine.playEffect(res.JackpotBoxOpeningSound);
                    }),
                    cc.scaleTo(0.4, 1)));

            const boxAnimation = GUIFunctions.getAnimation(ReferenceName.JackpotTreasureBoxOpenAnm, 0.02);
            selBox.runAction(cc.sequence(cc.callFunc(function () {
                cc.audioEngine.playEffect(res.JackpotBoxOpeningSound);
            }, selBox),cc.delayTime(delay), boxAnimation, cc.callFunc(function () {
                this.removeFromParent(true);
                selfPoint._removeBoxFromArray(this);
            }, selBox)));
        }

        delay += ins;
        //show the award panel.
        this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
                const result = this._jackpotResult;
                if (this._isPlaying) {
                    ClientServerConnect.collectJackpot(result._id);
                }
                const pnAward = new JackpotAwardPanel(result.level, result.rewardValue);
                pnAward.setPosition(101, 74);
                this.addChild(pnAward);
                this._stopTimer();
            }, this),
            cc.callFunc(function () {
                cc.audioEngine.playEffect(res.JackpotEndSound);
            }), cc.delayTime(5),
            cc.callFunc(function () {
                cc.audioEngine.playEffect(res.JackpotEndSound);
            }), cc.delayTime(5),
            cc.callFunc(function () {
                cc.audioEngine.playEffect(res.JackpotEndSound);
            }), cc.delayTime(5)));
    },

    _stopTimer: function () {
        this._spTimer.stopAllActions();
        this._spTimer.setRotation(0);
        this._lbTimeCounter.unscheduleAllCallbacks();
        this._lbTimeCounter.setString("0");
        this._lbTimeCounter.setColor(new cc.Color(255, 255, 255, 255));
    },

    // This will be called if the player who was playing this jackpot game leaves the game before it is completed
    playerHasLeft: function () {
        // @todo Instead of hiding the panel we should auto-play the rest of the game
        // If the game has ended and the celebration animation is playing, then we should do nothing.
        this.hidePanel();
    },

    onEnter: function () {
        cc.LayerColor.prototype.onEnter.call(this);
        if (this._eventListener && !this._eventListener._isRegistered())
            cc.eventManager.addListener(this._eventListener, this);
        cc.audioEngine.playMusic(res.JackpotBGM, true);
    },

    onExit: function () {
        cc.LayerColor.prototype.onExit.call(this);
        cc.audioEngine.playMusic(res.ArenaGameBGM, true);
    },

    cleanup: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotMiniGamePlist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotMiniGame2Plist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.LobbyUI2Plist);
        cc.Layer.prototype.cleanup.call(this);
    },

    hidePanel: function (callback) {
        this.runAction(cc.sequence(cc.scaleTo(1, 0).easing(cc.easeOut(3)), cc.callFunc(function () {
            this.removeFromParent();
            if (callback) {
                callback();
            }
            if (this._onFinishCallback) {
                this._onFinishCallback();
            }
        }, this)));
    },
});

const JackpotAwardPanel = cc.LayerColor.extend({
    ctor: function (awardLv, awardMoney) {
        const panelSize = new cc.Size(1162, 628);
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 168), panelSize.width, panelSize.height);

        cc.spriteFrameCache.addSpriteFrames(res.JackpotCoinAnimationPlist);

        //panel
        const spAwardPanel = new cc.Sprite(ReferenceName.JackpotWinBase);
        this.addChild(spAwardPanel);
        spAwardPanel.setPosition(panelSize.width * 0.5, panelSize.height * 0.5);
        spAwardPanel.setScale(0.3);
        const spAwardLevel = this._createAwardLevelSprite(awardLv);
        spAwardPanel.addChild(spAwardLevel);
        spAwardLevel.setPosition(200, 200);
        const lbAwardMoney = new cc.LabelBMFont(Math.round(awardMoney), res.JackpotGoldTextFont);
        lbAwardMoney.setPosition(270, 90);
        spAwardPanel.addChild(lbAwardMoney);

        const pnDist1 = new cc.Point(panelSize.width * 0.5, panelSize.height * 0.88),
            pnDist2 = new cc.Point(panelSize.width * 0.5, panelSize.height * 0.71);
        spAwardPanel.runAction(cc.sequence(cc.spawn(cc.moveTo(0.4, pnDist1), cc.scaleTo(0.4, 0.42)),
            cc.spawn(cc.moveTo(0.4, pnDist2), cc.scaleTo(0.4, 1).easing(cc.easeBackOut()))));

        //light
        const spLight = new cc.Sprite(ReferenceName.JackpotCoinLight);
        this.addChild(spLight);
        spLight.setPosition(panelSize.width * 0.5, 225);
        spLight.setScaleY(0.8);
        spLight.setOpacity(0);
        spLight.runAction(cc.sequence(cc.delayTime(1.6), cc.fadeIn(0.6)));

        //coins animation
        const spCoins1 = new cc.Sprite(ReferenceName.JackpotCoinAnimation_00001);
        spCoins1.setPosition(panelSize.width * 0.5, 225);
        spCoins1.setScaleX(1.15);
        this.addChild(spCoins1);
        //spCoins1.setVisible(false);
        const coinsAnimation = GUIFunctions.getAnimation(ReferenceName.JackpotCoinAnimation, 0.03);
        spCoins1.runAction(cc.sequence(cc.show(), coinsAnimation, cc.hide(), cc.delayTime(0.5)).repeatForever());

        const spCoins2 = new cc.Sprite(ReferenceName.JackpotCoinAnimation_00001);
        spCoins2.setPosition(panelSize.width * 0.5, 225);
        spCoins2.setScaleX(1.15);
        this.addChild(spCoins2);
        spCoins2.setVisible(false);
        const coinsAnimation2 = GUIFunctions.getAnimation(ReferenceName.JackpotCoinAnimation, 0.03);
        spCoins2.runAction(cc.sequence(cc.delayTime(0.5), cc.show(), coinsAnimation2, cc.hide()).repeatForever());

        this.runAction(cc.sequence(cc.delayTime(10), cc.callFunc(this.closePanel, this)));
    },

    closePanel: function () {
        const parent = this.getParent();
        if (parent) {
            parent.hidePanel(() => {
                if (parent._isPlaying) {
                    ClientServerConnect.getServerInformer().jackpotGameOver();
                }
            });
        }
    },

    cleanup: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotCoinAnimationPlist);
    },

    _createAwardLevelSprite: function (level) {
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
