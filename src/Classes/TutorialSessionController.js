var TutorialStep = {
    TutorialStep0:0, // 一群鱼出来
    TutorialStep1:1, // 屏幕定格，提示发炮撒网
    TutorialStep2:2, // 开始打鱼:0, 所有鱼被打完之后，触发下一步，奖励10金币
    TutorialStep3:3, // 4条神仙鱼出来
    TutorialStep4:4, // 屏幕定格，有些鱼很难抓
    TutorialStep5:5, // 炮等级>=4:0, 100%概率:0, <4:0,%0概率
    TutorialStep6:6, // 5秒后，如果炮等级<4:0,提示把炮调到4级，如果>=4跳到下一步
    TutorialStep7:7, // 炮等级>=4:0, 100%概率:0, <4:0,%0概率:0, 所有鱼被打完之后，触发下一步，奖励10金币
    TutorialStep8:8, // 一条鲨鱼，一条一分鱼出来，5秒后进入下一步
    TutorialStep9:9, // 屏幕定格，等鲨鱼走后再开跑，用户关闭提示，进入下一步
    TutorialStep10:10, // 鲨鱼100%:0, 小鱼0％，小鱼被捕获，进入下一步，奖励20金币
    TutorialStep11:11, // 3条神仙鱼和一条30分的红鱼出来，5秒后进入下一步
    TutorialStep12:12, // 屏幕定格，提示用合适的炮，用户关闭提示，进入下一步
    TutorialStep13:13, // 7级炮100%概率，其它炮概率正常，所有鱼被打完之后，触发下一步，奖励20金币
    TutorialStep14:14, // 鲨鱼出现，5秒后进入下一步
    TutorialStep15:15, // 屏幕定格，提示能量条满了后捕捉鲨鱼，用户关闭提示，进入下一步
    TutorialStep16:16, // 能量槽快速充满，进入下一步
    TutorialStep17:17, // 屏幕定格，手指提示用户发射激光，用户如果捕到鲨鱼，进入T20否则进入下一步
    TutorialStep18:18, // 屏幕定格，提示算好提前量，用户关闭提示，进入下一步
    TutorialStep19:19, // 能量条反复充满，直到捕到鲨鱼:0,鲨鱼被捕后进入下一步
    TutorialStep20:20, // 屏幕定格:0, 不愧为捕鱼达人
    TutorialStep21:21, // 跳过
    TutorialStep22:22, // 跳过
    TutorialStep23:23, // 展示所有鱼分值列表，3秒后进入下一步
    TutorialStep24:24, // 允许关闭分值表
    TutorialStep25:25 // 关闭分值表，结束教程
};

var kTutorialTotalStep = 26;
var kAddCoidParticleTag = 112;
var kAchieveParticleTag = 113;
var kAchieveLayerTag = 115;
var kTutorialHintTag = 116;
var kSkipTutorialTag = 117;
var kSkipTutorialSkipTag = 118;
var kSkipTutorialDoneTag = 119;
var kShareToWeiBoTag = 120;

var TutorialSessionController = CCSessionController.extend({
    _currentGameScene:null,
    // 是否需要播放教程
    _pauseFish:false,
    _captiveRate:CaptiveRateStandard,

    _playerMoneyBeforeTutorial:0,
    _pauseSmallFishInT10:false,
    _catchedSharkInT17:false,
    _autoAddRayPower:false,
    _showHint:false,
    // 是否已经领取过教学奖励
    _tutorialAwardReceived:false,
    m_isNextBreak:false,
    // 单前教程
    currentTutorialStep:TutorialStep.TutorialStep0,
    _targetTutorialStep:TutorialStep.TutorialStep0,
    _tutorialQueue:null,
    _fishInfoBoard:null,
    _tutorialHint:null,
    _uiInfo:false,
    _tutorialBlackLayer:null,
    _skipTutorialButton:null,
    _isInDelay:null,
    _userOldSuperWeapon:0,
    _hintBack:null,
    focus:null,
    finger:null,
    ctor:function () {
        this._tutorialQueue = [];
    },
    getFocus:function () {
        return this.focus;
    },
    setFocus:function (v) {
        this.focus = v;
    },
    getFinger:function () {
        return this.finger;
    },
    setFinger:function (v) {
        this.finger = v;
    },
    getHintBack:function () {
        return this._hintBack;
    },
    setHintBack:function (v) {
        this._hintBack = v;
    },
    init:function () {
        if (this._super()) {
            this._isInDelay = false;
            return true;
        }
        return false;
    },
    initWithDelegate:function (delegate, scene) {
        if (this.init()) {
            this._currentGameScene = scene;
            this._delegate = delegate;
            return true;
        }
        return false;
    },
    updateTutorial:function (dt, showBuyItem) {
        var arrayBullet = this._currentGameScene.getActors(GroupHeroBullet);
        for (var i = 0; i < arrayBullet.length; i++) {
            var bullet = arrayBullet[i];
            bullet.update(dt);
            var arrayFish = this._currentGameScene.getActors(GroupFishActor);
            for (var j = 0; j < arrayFish.length; j++) {
                var fish = arrayFish[j];
                if (bullet.collideWith(fish)) {
                    var catched = fish.handleCollideForTutorial(false, bullet);

                    if (fish instanceof  SharkActor && catched && bullet instanceof RayBulletActor || bullet instanceof LevinStormBulletActor) {
                        this._catchedSharkInT17 = true;
                    }

                    playEffect(NET_EFFECT);
                }
            }
        }

        var arrayNet = this._currentGameScene.getActors(GroupFishNetActor);
        for (var i = 0; i < arrayNet.length; i++) {
            var fishNet = arrayNet[i];
            fishNet.update(dt);
            if (!fishNet.getBeginAnimation()) {
                continue;
            }

            var arrayFish = this._currentGameScene.getActors(GroupFishActor);
            for (var j = 0; j < arrayFish.length; j++) {
                var fish = arrayFish[j];

                var collideIndex = fishNet.collideIndexWith(fish);
                if (collideIndex >= 0) {
                    fish.setCurCollideIndex(collideIndex);

                    var curRate = this._captiveRate;
                    if (this.currentTutorialStep == TutorialStep.TutorialStep5 ||
                        this.currentTutorialStep == TutorialStep.TutorialStep7) {
                        if (fishNet.getCurWeaponLevel() >= FishWeaponType.eWeaponLevel4) {
                            curRate = CaptiveRateHundredPercent;
                        }
                        else {
                            curRate = CaptiveRateZero;
                        }
                    }

                    if (this.currentTutorialStep == TutorialStep.TutorialStep10) {
                        if (fish instanceof SharkActor) {
                            curRate = CaptiveRateZero;
                        } else {
                            curRate = CaptiveRateHundredPercent;
                        }
                    }

                    if (this.currentTutorialStep == TutorialStep.TutorialStep13) {
                        if (fishNet.getCurWeaponLevel() >= 7) {
                            curRate = CaptiveRateHundredPercent;
                        } else {
                            curRate = CaptiveRateStandard;
                        }
                    }

                    var catched = false;

                    if (curRate == CaptiveRateStandard) {
                        catched = fish.handleCollide(fishNet);
                    }
                    else if (curRate == CaptiveRateZero) {
                        catched = fish.handleCollideForTutorial(false, fishNet);
                    }
                    else {
                        catched = fish.handleCollideForTutorial(true, fishNet);
                    }

                    if (catched &&
                        this.currentTutorialStep >= TutorialStep.TutorialStep17 &&
                        this.currentTutorialStep <= TutorialStep.TutorialStep19) {
                        this._catchedSharkInT17 = true;
                    }
                }
            }

            fishNet.setBeginAnimation(false);
        }

        var centerCount = 0;
        var aliveCount = 0;
        var arrayFish = this._currentGameScene.getActors(GroupFishActor);
        for (var i = 0; i < arrayFish.length; i++) {
            var fishActor = arrayFish[i];

            if (!this._pauseFish) {
                if (this.currentTutorialStep == TutorialStep.TutorialStep10) {
                    if (fishActor.getPosition().x <= (VisibleRect.center().x - 20)) {
                        this._pauseSmallFishInT10 = true;
                    }

                    if (this._pauseSmallFishInT10 && !fishActor instanceof  SharkActor) {

                    } else {
                        fishActor.update(dt);
                    }

                } else {
                    fishActor.update(dt);
                }
            }

            if (fishActor.getIsAlive()) aliveCount++;

            if (fishActor.getPosition().x <= VisibleRect.center().x) {
                centerCount++;
            }

        }

        if ((this.currentTutorialStep == TutorialStep.TutorialStep6 || this.currentTutorialStep == TutorialStep.TutorialStep7)
            && this._currentGameScene.getCannonActor().getCurrentWeapon().getCannonLevel() >= FishWeaponType.eWeaponLevel4) {
            this.stopTutorialHint();
        }

        if (
            (this.currentTutorialStep == TutorialStep.TutorialStep2 ||
                this.currentTutorialStep == TutorialStep.TutorialStep7 ||
                this.currentTutorialStep == TutorialStep.TutorialStep10 ||
                this.currentTutorialStep == TutorialStep.TutorialStep13) &&
                aliveCount == 0) {
            this.nextTutorial(0);
        }

        if (
            this.currentTutorialStep >= TutorialStep.TutorialStep17 &&
                this.currentTutorialStep <= TutorialStep.TutorialStep19 &&
                !this._catchedSharkInT17 &&
                aliveCount == 0) {
            this.addFishGroupForPlayTutorial(25);
        }

        if (
            this.currentTutorialStep == TutorialStep.TutorialStep19 &&
                this._catchedSharkInT17) {
            this.gotoTutorialStep(TutorialStep.TutorialStep20, false);
        }

        if (
            this.currentTutorialStep == TutorialStep.TutorialStep17 &&
                this._catchedSharkInT17) {
            this.gotoTutorialStep(TutorialStep.TutorialStep20, false);
        }

        if (this.currentTutorialStep == TutorialStep.TutorialStep19) {
            this.addRayPowerInT19();
        }

        if (this.currentTutorialStep == TutorialStep.TutorialStep17) {
            this.countSharkInT17(null);
        }

    },
    update:function (time) {
        if (this._sessionRunning) {
            this.updateTutorial(time, GameSetting.getInstance().getShowBuyItem());
        }
    },
    addCircleFishGroupForPlayTurorial:function (index) {
        sino.fishGroup.setInitPoint(cc.p(VisibleRect.center().x, VisibleRect.center().y));
        sino.fishGroup.createCircleTutorialFishGroup(index);
    },
    addFishGroupForPlayTutorial:function (fishIdx) {
        var startPos = cc.p(VisibleRect.right().x, VisibleRect.right().y);
        sino.fishGroup.setInitPoint(startPos);
        sino.fishGroup.createTutorialFishGroup(fishIdx);
    },
    controlNewPosition:function (control, pos) {
        if (this.currentTutorialStep == TutorialStep.TutorialStep24) {
            this.nextTutorial(0);
            return;
        }

        var hintLayer = this._currentGameScene.getChildByTag(kTutorialHintTag);
        if (hintLayer != null && hintLayer.getCanClose()) {
            hintLayer.clickClose(null);
        }
    },
    nextTutorial4Call:function () {
        this.nextTutorial(0);
    },
    nextTutorial:function (time) {
        if (this._tutorialQueue.length == 0)
            return;

        this.currentTutorialStep = this._tutorialQueue[0];
        //KingFisher cc.log("start tutorial step:" + this.currentTutorialStep);

        if (this.currentTutorialStep == TutorialStep.TutorialStep23)
            this.m_isNextBreak = true;
        else
            this.m_isNextBreak = false;

        switch (this.currentTutorialStep) {
            case TutorialStep.TutorialStep0:
            {
                PlayerActor.sharedActor().SetBOnTutorial(true);
                this.getHintBack().setOpacity(0);
                this.addCircleFishGroupForPlayTurorial(21);
                this._pauseFish = false;
                this._captiveRate = CaptiveRateZero;
                cc.director.getScheduler().schedule(this.nextTutorial, this, 1, false);
                break;
            }

            case TutorialStep.TutorialStep1:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 1"), 0, this.hintClosedForNextTutorial);
                break;
            }

            case TutorialStep.TutorialStep2:
            {
                this._captiveRate = CaptiveRateHundredPercent;
                this._pauseFish = false;
                this.getHintBack().playAppear();
                this.getHintBack().setHint(cc.LocalizedString.localizedString("Tutorial Text Step 1"));
                break;
            }

            case TutorialStep.TutorialStep3:
            {
                this.tutorialAward(10);
                this._targetTutorialStep = TutorialStep.TutorialStep8;
                cc.director.getScheduler().schedule(this.nextTutorial, this, 1, false);
                this._captiveRate = CaptiveRateZero;
                this.addCircleFishGroupForPlayTurorial(22);
                this.getHintBack().playDisappear();
                break;
            }

            case TutorialStep.TutorialStep4:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 2.1"), 0, this.hintClosedForNextTutorial);
                break;
            }
            case TutorialStep.TutorialStep5:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateHundredPercent;
                cc.director.getScheduler().schedule(this.checkWeaponAtT5, this, 5, false);
                this.getHintBack().playAppear();
                this.getHintBack().setHint(cc.LocalizedString.localizedString("Tutorial Text Step 2.1"));
            }
                break;

            case TutorialStep.TutorialStep6:
            {
                this._pauseFish = true;
                this.playTutorialHint(cc.pAdd(VisibleRect.bottom(), cc.p(65, 22)), false);
                this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 2.2"), 0, this.hintClosedForNextTutorial);
                this.getHintBack().playDisappear();
                break;
            }
            case TutorialStep.TutorialStep7:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateZero;
                this.getHintBack().playAppear();
                this.getHintBack().setHint(cc.LocalizedString.localizedString("Tutorial Text Step 2.2"));

                break;
            }
            case TutorialStep.TutorialStep8:
            {
                this.stopTutorialHint();
                this.tutorialAward(10);
                this._targetTutorialStep = TutorialStep.TutorialStep11;
                this._pauseFish = false;
                this.addFishGroupForPlayTutorial(23);
                this._pauseSmallFishInT10 = false;
                cc.director.getScheduler().schedule(this.nextTutorial, this, 6.5, false);
                this._captiveRate = CaptiveRateZero;
                this.getHintBack().playDisappear();
                break;
            }
            case TutorialStep.TutorialStep9:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this._captiveRate = CaptiveRateZero;
                this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 3"), 0, this.hintClosedForNextTutorial);
            }
                break;

            case TutorialStep.TutorialStep10:
            {
                this._pauseFish = false;
                this.getHintBack().playAppear();
                this.getHintBack().setHint(cc.LocalizedString.localizedString("Tutorial Text Step 3"));
            }
                break;

            case TutorialStep.TutorialStep11:
            {
                this.tutorialAward(20);
                // 超级武器下 教程结束不能切换武器的bug
                if (PlayerActor.sharedActor().getCurWeaponLevel() == 8 || PlayerActor.sharedActor().getCurWeaponLevel() == 9) {
                    var orgWeapon = new WeaponCannon7(this._currentGameScene.getCannonActor().getDefaultWeaponPosition(), ActorType.eActorTypeNormal);
                    this._currentGameScene.addChild(orgWeapon, 110);
                    orgWeapon.setRotation(this._currentGameScene.getCannonActor().getWeaponRotation());
                    orgWeapon.setDelegate(this._currentGameScene.getCannonActor());
                    this._currentGameScene.getCannonActor().setOldWeapon(orgWeapon);
                    this._currentGameScene.getCannonActor().weaponSwitchBackNormal(null);
                    var ray = this._currentGameScene.getCannonActor().getChangeToWeapon();
                    if (ray)
                        ray.removeRainbow();
                }
                else {
                    PlayerActor.sharedActor().setCurWeaponLevel(FishWeaponType.eWeaponLevel7);
                    this._currentGameScene.getCannonActor().getCurrentWeapon().setCannonLevel(FishWeaponType.eWeaponLevel7);
                    this._currentGameScene.getCannonActor().performCannonSwitch(FishWeaponType.eWeaponLevel7);
                }

                this._pauseFish = false;
                this._targetTutorialStep = TutorialStep.TutorialStep14;
                this._captiveRate = CaptiveRateZero;
                this.addFishGroupForPlayTutorial(24);
                cc.director.getScheduler().schedule(this.nextTutorial, this, 5.0, false);
                this.getHintBack().playDisappear();
            }
                break;

            case TutorialStep.TutorialStep12:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._targetTutorialStep = TutorialStep.TutorialStep14;
                this._pauseFish = true;
                this._captiveRate = CaptiveRateZero;
                this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 4"), 0, this.hintClosedForNextTutorial);
            }
                break;

            case TutorialStep.TutorialStep13:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateHundredPercent;
                this.getHintBack().playAppear();
                this.getHintBack().setHint(cc.LocalizedString.localizedString("Tutorial Text Step 4"));
            }
                break;

            case TutorialStep.TutorialStep14:
            {
                this.tutorialAward(20);
                this._targetTutorialStep = TutorialStep.TutorialStep23;
                this._pauseFish = false;
                this._captiveRate = CaptiveRateZero;
                this.addFishGroupForPlayTutorial(25);
                cc.director.getScheduler().schedule(this.nextTutorial, this, 5.0, false);
                this.getHintBack().playDisappear();
            }
                break;

            case TutorialStep.TutorialStep15:
            {
                this.m_isNextBreak = false;
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this._captiveRate = CaptiveRateZero;
                this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 5.1"), 0, this.hintClosedForNextTutorial);
                this._autoAddRayPower = true;
                cc.director.getScheduler().schedule(this.increaseNormalGain, this, 0.1, false);
            }
                break;

            case TutorialStep.TutorialStep16:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateStandard;
                this.gotoTutorialStep(TutorialStep.TutorialStep17, false);
                this.getHintBack().playAppear();
                this.getHintBack().setHint(cc.LocalizedString.localizedString("Tutorial Text Step 5.1"));
            }
                break;

            case TutorialStep.TutorialStep17:
            {
                this.playTutorialHint(cc.pSub(VisibleRect.top(), cc.p(100, 100), false));
                this._pauseFish = false;
                this._captiveRate = CaptiveRateStandard;
            }
                break;

            case TutorialStep.TutorialStep18:
            {
                this._pauseFish = true;
            }
                break;

            case TutorialStep.TutorialStep19:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateStandard;
                cc.director.getScheduler().schedule(this.increaseNormalGain, this, 0.1, false);
                cc.director.getScheduler().schedule(this.superWeaponPowerUpAgain, this, 3, false);
                this.getHintBack().playDisappear();
            }
                break;

            case TutorialStep.TutorialStep20:
                this.stopTutorialHint();
                this._currentGameScene.runAction(cc.sequence(cc.delayTime(5.0), cc.callFunc(this.showHintInT20, this)));
                break;

            case TutorialStep.TutorialStep21:
                cc.director.getScheduler().schedule(this.nextTutorial, this, 0.1, false);
                break;

            case TutorialStep.TutorialStep22:
            {
            }

                break;

            case TutorialStep.TutorialStep23:
            {
                this._targetTutorialStep = TutorialStep.TutorialStep25;
                this.tutorialAward(40);
                this.stopTutorialHint();
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._showHint = true;
                this.showFishInfo();
                this.changeSkipButton();
                cc.director.getScheduler().schedule(this.nextTutorial, this, 3, false);
            }
                break;

            case TutorialStep.TutorialStep24:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this.getHintBack().setVisible(false);
            }
                break;

            case TutorialStep.TutorialStep25:
            {
                this._showHint = false;
                this.hideFishInfo();
                // 超级武器下 教程结束不能切换武器的bug
                if (PlayerActor.sharedActor().getCurWeaponLevel() == 8 || PlayerActor.sharedActor().getCurWeaponLevel() == 9) {
                    this._currentGameScene.getCannonActor().setOldWeapon(null);
                    this._currentGameScene.getCannonActor().weaponSwitchBackNormal(null);
                }
            }
                break;

            default:
                break;
        }

        this._tutorialQueue.shift();
        //KingFisher cc.log("tutorialQueue count:" + this._tutorialQueue.length);

        if (this._tutorialQueue.length == 0) {
            cc.director.getScheduler().schedule(this.changeWeaponEndEndSession, this, 0.1, false);
        }
    },
    gotoTutorialStep:function (step, remove) {
        if (this._tutorialQueue.length == 0) {
            return;
        }
        if (remove) {
            if (this._currentGameScene.getChildByTag(kTutorialHintTag)) {
                this._currentGameScene.removeChildByTag(kTutorialHintTag, true);
            }
            this._currentGameScene.removeAllActor();
            this._showHint = false;
        }

        cc.director.getScheduler().unschedule(this.nextTutorial, this);

        var tempStep = this._tutorialQueue[0];
        if (tempStep == step) {
            this.nextTutorial(0);
        } else if (tempStep < step) {
            this._tutorialQueue.shift();
            //KingFisher cc.log("tutorialQueue count: " + this._tutorialQueue.length);
            this.gotoTutorialStep(step, remove);
        }
    },
    hintClosedForNextTutorial:function () {
        this._showHint = false;
        this.nextTutorial(0);
        this.m_isNextBreak = false;
    },
    fingerAction:function (move) {
        var movPos1 = -130, movPos2 = 130;
        var ac0 = cc.Show.create();

        var frams = [];
        var cache = cc.spriteFrameCache;
        frams.push(cache.getSpriteFrame("finger_0001.png"));
        frams.push(cache.getSpriteFrame("finger_0002.png"));

        var animation1 = cc.Animation.create(frams, 0.2);

        var ac1 = cc.Animate.create(animation1, true);

        var ac3 = cc.DelayTime.create(0.8);
        var ac4 = cc.Hide.create();
        var ac5 = cc.DelayTime.create(0.5);

        if (move) {
            var ac6 = cc.MoveBy.create(0.0, movPos1);
            var ac7 = cc.MoveBy.create(0.0, movPos2);

            var se = cc.Sequence.create(ac0, ac1, ac3, ac4, ac5);

            var fa = cc.Sequence.create(se, ac6, se, ac7);

            return cc.RepeatForever.create(fa);
        } else {
            var se = cc.Sequence.create(ac0, ac1, ac3, ac4, ac5);
            return cc.RepeatForever.create(se);
        }
    },
    focusAction:function (move, movPos1, movPos2) {
        var movPos1 = -130, movPos2 = 130;
        var ac0 = cc.DelayTime.create(0.2);
        var ac1 = cc.Show.create();


        var frams = [];
        var cache = cc.spriteFrameCache;
        frams.push(cache.getSpriteFrame("circle_0001.png"));
        frams.push(cache.getSpriteFrame("circle_0002.png"));
        frams.push(cache.getSpriteFrame("circle_0003.png"));
        frams.push(cache.getSpriteFrame("circle_0004.png"));
        frams.push(cache.getSpriteFrame("circle_0005.png"));

        var animation2 = cc.Animation.create(frams, 0.2);

        var ac2 = cc.Animate.create(animation2, false);

        var ac3 = cc.Hide.create();
        var ac4 = cc.DelayTime.create(0.5);

        if (move) {
            var ac5 = cc.MoveBy.create(0.0, movPos1);
            var ac6 = cc.MoveBy.create(0.0, movPos2);

            var se = cc.Sequence.create(ac0, ac1, ac2, ac3, ac4);

            var fa = cc.Sequence.create(se, ac5, se, ac6);

            return cc.RepeatForever.create(fa);
        } else {
            var se = cc.Sequence.create(ac0, ac1, ac2, ac3, ac4);
            return cc.RepeatForever.create(se);
        }
    },
    initPlayTutorial:function (fingerZOrder, focusZOrder, skipPos, donePos) {
        this._tutorialAwardReceived = wrapper.getBooleanForKey(kTutorialAwardReceived);
        //playTutorial = false;
        this._pauseFish = false;
        this._captiveRate = CaptiveRateStandard;
        this._catchedSharkInT17 = false;
        this._showHint = false;

        // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
        cc.spriteFrameCache.addSpriteFrames(ImageName("help_ui.plist"));

        for (var idx = 0; idx < kTutorialTotalStep; idx++) {
            this._tutorialQueue.push(idx);
        }

        this.setFinger(cc.Sprite("#finger_0001.png"));
        this._currentGameScene.addChild(this.finger, fingerZOrder);
        this.getFinger().setVisible(false);

        this.setFocus(cc.Sprite("#circle_0001.png"));
        this._currentGameScene.addChild(this.focus, focusZOrder);
        this.getFocus().setVisible(false);

        this._tutorialBlackLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 0));
        this._currentGameScene.addChild(this._tutorialBlackLayer, 1);
        this._tutorialBlackLayer.setVisible(false);

        var skip = new cc.MenuItemSprite(cc.Sprite("#ui_skip_1.png"), null, this.skipTutorial, this);
        skip.setTag(kSkipTutorialSkipTag);
        skip.setOpacity(0);
        var fadeIn = new cc.FadeIn(1);
        var reverse = fadeIn.reverse();
        var sequ = new cc.Sequence(fadeIn, reverse);
        skip.runAction(new cc.RepeatForever(sequ));
        var done = new cc.MenuItemSprite(cc.Sprite("#ui_skip_2.png"), null, this.skipTutorial, this);
        done.runAction(new cc.RepeatForever(sequ));
        done.setTag(kSkipTutorialDoneTag);
        done.setVisible(false);
        this._skipTutorialButton = new cc.Menu(skip, done, null);
        this._currentGameScene.addChild(this._skipTutorialButton, 116, kSkipTutorialTag);
        this._targetTutorialStep = TutorialStep.TutorialStep3;
        this._skipTutorialButton.setPosition(cc.p(0, 0));
        skip.setPosition(skipPos);
        done.setPosition(donePos);
        PlayerActor.sharedActor().setAutoSave(false);
        PlayerActor.sharedActor().updateNormalGain(0);
        this._playerMoneyBeforeTutorial = PlayerActor.sharedActor().getPlayerMoney();
        this.nextTutorial(0);
    },
    playTutorialHint:function (p, move) {
        var addPos = cc.p(-39, -34);
        this.finger.setVisible(true);
        this.finger.setPosition(cc.pAdd(p, addPos));
        //	finger.position = p;
        this.finger.stopAllActions();
        this.finger.runAction(this.fingerAction(move));

        this.focus.setVisible(true);
        this.focus.setPosition(p);
        this.focus.stopAllActions();
        this.focus.runAction(this.focusAction(move));
    },
    showTutorialHint:function (file, offset, hintPos) {
        if (this._tutorialHint != null) {
            this._tutorialHint.removeFromParentAndCleanup(true);
            this._tutorialHint = null;
        }

        this._tutorialHint = cc.Sprite.create(file);
        this._currentGameScene.addChild(this._tutorialHint, 205);
        this._tutorialHint.setPosition(cc.pAdd(hintPos, offset));
        this._tutorialHint.setOpacity(0);

        this._tutorialHint.runAction(cc.fadeIn(1));
        this._tutorialHint.runAction(cc.sequence(cc.tintTo(0.5, 255, 0, 0), cc.tintTo(0.5, 255, 255, 255)).repeatForever());

        this._tutorialBlackLayer.runAction(cc.sequence(cc.fadeTo(1, 120), cc.callFunc(this.nextTutorial4Call, this)));
        this._tutorialBlackLayer.setVisible(true);
    },
    showFishInfoHint:function (offset) {
        if (this._tutorialHint != null) {
            this._tutorialHint.removeFromParentAndCleanup(true);
            this._tutorialHint = null;
        }

        this._tutorialHint = cc.Sprite.create(ImageNameLang("tutorial_ui_text_33.png"));
        this._currentGameScene.addChild(this._tutorialHint, 205);
        this._tutorialHint.setPosition(cc.pAdd(cc.p(VisibleRect.center().x, VisibleRect.center().y), offset));
        this._tutorialHint.setOpacity(0);

        var ac1 = cc.sequence(cc.tintTo(0.5, 255, 0, 0), cc.tintTo(0.5, 255, 255, 255)).repeat(6);
        var ac2 = cc.spawn(cc.scaleTo(1, 5), cc.fadeOut(1));
        this._tutorialHint.runAction(cc.sequence(cc.fadeIn(1), ac1, ac2, cc.callFunc(this.showFishInfo, this)));
        this._tutorialBlackLayer.runAction(cc.sequence(cc.fadeTo(1, 120), cc.callFunc(this.nextTutorial4Call, this)));
        this._tutorialBlackLayer.setVisible(true);
    },
    stopTutorialHint:function () {
        this.finger.stopAllActions();
        this.finger.setVisible(false);
        this.focus.stopAllActions();
        this.focus.setVisible(false);
    },
    removeHint:function () {
        this._tutorialHint.removeFromParentAndCleanup(true);
        this._tutorialHint = null;
    },
    hideTexts:function () {
        if (this._tutorialHint != null) {
            this._tutorialHint.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(this.removeHint, this)));
        }

        this._tutorialBlackLayer.runAction(new cc.Sequence(new cc.FadeTo(1, 0),
            new cc.CallFunc(this.nextTutorial4Call, this)));
    },
    showFishInfo:function () {
        var zOrder = 204, pos = cc.pSub(VisibleRect.top(), cc.p(0, 265));
        this._fishInfoBoard = new cc.Sprite("#howtoplay0.png");
        this._currentGameScene.addChild(this._fishInfoBoard, zOrder);
        this._fishInfoBoard.setPosition(pos);
        this._fishInfoBoard.setOpacity(0);

        var moneyhard = new cc.Sprite(ImageNameLang("ui_teach_003.png"));
        moneyhard.setAnchorPoint(cc.p(0.5, 0.5));
        var fontSize = 16;
        moneyhard.setPosition(cc.p(620, 160));
        this._fishInfoBoard.addChild(moneyhard, zOrder + 1);

        var close = new cc.MenuItemSprite(new cc.Sprite("#btn_teach_001.png"), new cc.Sprite("#btn_teach_002.png"),
            this.goBack, this);

        var closeLabel = cc.LabelTTF.create(cc.LocalizedString.localizedString("Tutorial Text Close"),
            "Helvetica-Bold", fontSize);
        closeLabel.setAnchorPoint(cc.p(0.5, 0.5));
        closeLabel.setPosition(cc.p(close.getContentSize().width / 2, close.getContentSize().height / 2));
        close.addChild(closeLabel);
        moneyhard.setScale(0.85);
        close.setScale(0.85);

        var menu = new cc.Menu(close);
        var x = this._fishInfoBoard.getContentSize().width / 2;
        var y = close.getContentSize().height + 10;
        menu.setPosition(cc.p(x, y));
        this._fishInfoBoard.addChild(menu, zOrder + 1);

        this._fishInfoBoard.runAction(new cc.FadeIn(1));
    },
    hideFishInfo:function () {
        this._fishInfoBoard.runAction(new cc.Sequence(new cc.FadeOut(1), new cc.CallFunc(this.step8Finshed, this)));
    },
    step8Finshed:function () {
        this._fishInfoBoard.removeFromParentAndCleanup(true);
    },
    addImage:function (file, p) {
        var sprite = cc.Sprite.create(file);
        this._uiInfo.addChild(sprite);
        sprite.setOpacity(0);
        sprite.setPosition(p);
        sprite.runAction(cc.fadeIn(1));
    },
    hideUIInfo:function () {
        var imgs = this._uiInfo.getChildren();

        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            img.runAction(cc.fadeOut(1));
        }
        this._uiInfo.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(this.removeSprite, this._currentGameScene)));
    },
    showHint:function (filename, delay, selector) {
        this._showHint = true;
        var layer = new TutorialHintLayer();
        layer.initWithHintFile(filename, this, selector);
        this._currentGameScene.addChild(layer, 103, kTutorialHintTag);
        /*layer.setVisible(false);
         layer.runAction(cc.Sequence.create(cc.DelayTime.create(delay), cc.Show.create()));*/
        //todo fixed
    },
    showHintInT20:function () {
        cc.director.getScheduler().schedule(this.checkShareImageLayer, this, 0.1, false);
    },
    checkShareImageLayer:function (dt) {
        if (this.currentTutorialStep != TutorialStep.TutorialStep20) {
            cc.director.getScheduler().unschedule(this.checkShareImageLayer, this);
        }

        var share = this._currentGameScene.getChildByTag(kShareToWeiBoTag);
        if (share == null) {
            cc.director.getScheduler().unschedule(this.checkShareImageLayer, this);
            this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 5.3"), 0, this.hintClosedForNextTutorial);
            this.getHintBack().playDisappear();
        }
    },
    tutorialAward:function (count) {
        if (this._tutorialAwardReceived) return;
        if (count <= 0) return;

        TutorialAwardAnimation.addScoreNumber(count, 3, this._currentGameScene);
        TutorialAwardAnimation.addGoldPrize(count, 3, this._currentGameScene);
    },
    addRayPowerInT19:function () {
        var normalCoinCount = GameSetting.getInstance().getNormalCoinCount();
        var normalGain = PlayerActor.sharedActor().getNormalGain();
        var isUseRay = FishWeaponType.eWeaponLevel8 <= this._currentGameScene.getCannonActor().getCurrentWeaponLevel() &&
            FishWeaponType.eWeaponLevelUnknown > this._currentGameScene.getCannonActor().getCurrentWeaponLevel();
        if (isUseRay) {
            isUseRay = this._currentGameScene.getCannonActor().getCurrentWeapon().getIsShooting();
        }
        if (normalGain < normalCoinCount && !this._autoAddRayPower && !isUseRay) {
            if (!this._isInDelay) {
                cc.director.getScheduler().schedule(this.superWeaponPowerUpAgain, this, 3, false);
                this.showHint(cc.LocalizedString.localizedString("Tutorial Text Step 5.2"), 0, this.hintClosed);
                this._isInDelay = true;
                this.getHintBack().setVisible(false);
            }
        }
    },
    countSharkInT17:function (dt) {
        var normalCoinCount = GameSetting.getInstance().getNormalCoinCount();
        var normalGain = PlayerActor.sharedActor().getNormalGain();
        //在T17时，如果鱼被打完了，跳到T18
        var isUseRay = FishWeaponType.eWeaponLevel8 <= this._currentGameScene.getCannonActor().getCurrentWeaponLevel() &&
            FishWeaponType.eWeaponLevelUnknown > this._currentGameScene.getCannonActor().getCurrentWeaponLevel();
        if (isUseRay) {
            // 是在使用特殊武器

            // 武器是否正在射击状态
            var isShooting = this._currentGameScene.getCannonActor().getCurrentWeapon().getIsShooting();

            // 是否还存在特殊武器的子弹 actor
            var bHaveSpecialBullet = false;
            var pBulletArray = this._currentGameScene.getActors(GroupHeroBullet);
            for (var j = 0; j < pBulletArray.length; j++) {
                var pBullet = pBulletArray[j];
                if (pBullet.getCurWeaponLevel() >= FishWeaponType.eWeaponLevel8 &&
                    pBullet.getCurWeaponLevel() < FishWeaponType.eWeaponLevelUnknown) {
                    bHaveSpecialBullet = true;
                    break;
                }
            }

            // 两个条件有一个满足就表示还在用特殊武器
            isUseRay = isShooting || bHaveSpecialBullet;
        }

        if (normalGain < normalCoinCount && !this._autoAddRayPower && !isUseRay && !this._catchedSharkInT17) {
            this.nextTutorial(0);
        } else if (this._catchedSharkInT17) {
            var aliveCount = 0;
            var arrayFish = this._currentGameScene.getActors(GroupFishActor);
            for (var i = 0; i < arrayFish.length; i++) {
                var fishActor = arrayFish[i];
                if (fishActor.getIsAlive()) aliveCount++;
            }

            if (aliveCount < 3) {
                this.gotoTutorialStep(TutorialStep.TutorialStep20, false);

            }
        }
    },
    checkWeaponAtT5:function (dt) {
        cc.director.getScheduler().unschedule(this.checkWeaponAtT5, this);

        var aliveCount = 0;
        var arrayFish = this._currentGameScene.getActors(GroupFishActor);
        for (var i = 0; i < arrayFish.length; i++) {
            var fishActor = arrayFish[i];
            if (fishActor.getIsAlive()) aliveCount++;
        }

        // 在T5时，如果鱼被打完了，跳到T8
        if (aliveCount == 0) {
            this.gotoTutorialStep(TutorialStep.TutorialStep8, false);
        } else {
            if (this._currentGameScene.getCannonActor().getCurrentWeapon().getCannonLevel() >= FishWeaponType.eWeaponLevel4) {
                this.gotoTutorialStep(TutorialStep.TutorialStep7, false);
            } else {
                this.nextTutorial(0);
            }

        }
    },
    increaseNormalGain:function (dt) {
        if (this._currentGameScene.getCannonActor().getCurrentWeaponLevel() >= FishWeaponType.eWeaponLevel8 || this.m_isNextBreak)
            return;

        var normalCoinCount = GameSetting.getInstance().getNormalCoinCount() * this._currentGameScene.getOddsNumber();
        var dtGain = (normalCoinCount * dt) / 2;
        var curGain = PlayerActor.sharedActor().getNormalGain() + dtGain;

        if (curGain >= normalCoinCount) {
            this._autoAddRayPower = false;
            cc.director.getScheduler().unschedule(this.increaseNormalGain, this);
            if (!this.finger.isVisible()) {
                this.playTutorialHint(cc.pSub(VisibleRect.top(), cc.p(100, 100)), false);
            }
        }
        PlayerActor.sharedActor().updateNormalGain(curGain);
    },
    skipTutorial:function (sender) {
        if (this._currentGameScene.getIsPause())
            return;
        this.gotoTutorialStep(this._targetTutorialStep, true);
    },
    changeSkipButton:function () {
        var menu = this._currentGameScene.getChildByTag(kSkipTutorialTag);
        var skip = menu.getChildByTag(kSkipTutorialSkipTag);
        skip.setVisible(false);
        var done = menu.getChildByTag(kSkipTutorialDoneTag);
        done.setVisible(true);
    },
    nextTutorial2:function (hintPos1, hintPos2) {
        if (this._tutorialQueue.length == 0)
            return;
        this.currentTutorialStep = this._tutorialQueue[0];
        //KingFisher cc.log("start tutorial step:" + this.currentTutorialStep);

        switch (this.currentTutorialStep) {
            case TutorialStep.TutorialStep0:
            {
                this.addCircleFishGroupForPlayTurorial(21);
                this._pauseFish = false;
                this._captiveRate = CaptiveRateZero;
                cc.director.getScheduler().schedule(this.nextTutorial, this, 1, false);
            }
                break;

            case TutorialStep.TutorialStep1:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this.showHint(ImageNameLang("fontsthis._otherthis._20.png"), 0.0, this.hintClosedForNextTutorial);
                break;
            }

            case TutorialStep.TutorialStep2:
            {
                this._captiveRate = CaptiveRateHundredPercent;
                this._pauseFish = false;
                break;
            }

            case TutorialStep.TutorialStep3:
            {
                this.tutorialAward(10);
                this._targetTutorialStep = TutorialStep.TutorialStep8;
                cc.director.getScheduler().schedule(this.nextTutorial, this, 1, false);
                this._captiveRate = CaptiveRateZero;
                this.addCircleFishGroupForPlayTurorial(22);
                break;
            }

            case TutorialStep.TutorialStep4:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this.showHint(ImageNameLang("fontsthis._otherthis._21.png"), 0.0, this.hintClosedForNextTutorial);
            }
                break;

            case TutorialStep.TutorialStep5:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateHundredPercent;
                cc.director.getScheduler().schedule(this.checkWeaponAtT5, this, 5.0, false);
            }
                break;

            case TutorialStep.TutorialStep6:
            {
                this._pauseFish = true;
                this.playTutorialHint(hintPos1, false);
                this.showHint(ImageNameLang("fontsthis._otherthis._22.png"), 0.0, this.hintClosedForNextTutorial);
            }
                break;

            case TutorialStep.TutorialStep7:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateZero;
            }
                break;

            case TutorialStep.TutorialStep8:
            {
                this.stopTutorialHint();
                this.tutorialAward(10);
                this._targetTutorialStep = TutorialStep.TutorialStep11;
                this._pauseFish = false;
                this.addFishGroupForPlayTutorial(23);
                this._pauseSmallFishInT10 = false;
                cc.director.getScheduler().schedule(this.nextTutorial, this, 6.5, false);
                this._captiveRate = CaptiveRateZero;
            }
                break;

            case TutorialStep.TutorialStep9:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this._captiveRate = CaptiveRateZero;
                this.showHint(ImageNameLang("fontsthis._otherthis._23.png"), 0.0, this.hintClosedForNextTutorial);
            }
                break;

            case TutorialStep.TutorialStep10:
            {
                this._pauseFish = false;
            }
                break;

            case TutorialStep.TutorialStep11:
            {
                this.tutorialAward(20);
                PlayerActor.sharedActor().setCurWeaponLevel(FishWeaponType.eWeaponLevel7);
                this._currentGameScene.getCannonActor().performCannonSwitch(FishWeaponType.eWeaponLevel7);
                this._pauseFish = false;
                this._targetTutorialStep = TutorialStep.TutorialStep14;
                this._captiveRate = CaptiveRateZero;
                this.addFishGroupForPlayTutorial(24);
                cc.director.getScheduler().schedule(this.nextTutorial, this, 5.0, false);
            }
                break;

            case TutorialStep.TutorialStep12:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._targetTutorialStep = TutorialStep.TutorialStep14;
                this._pauseFish = true;
                this._captiveRate = CaptiveRateZero;
                this.showHint(ImageNameLang("fontsthis._otherthis._24.png"), 0.0, this.hintClosedForNextTutorial);
            }
                break;

            case TutorialStep.TutorialStep13:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateHundredPercent;
            }
                break;

            case TutorialStep.TutorialStep14:
            {
                this.tutorialAward(20);
                this._targetTutorialStep = TutorialStep.TutorialStep23;
                this._pauseFish = false;
                this._captiveRate = CaptiveRateZero;
                this.addFishGroupForPlayTutorial(25);
                cc.director.getScheduler().schedule(this.nextTutorial, this, 5.0, false);
            }
                break;

            case TutorialStep.TutorialStep15:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._pauseFish = true;
                this._captiveRate = CaptiveRateZero;
                this.showHint(ImageNameLang("fontsthis._otherthis._25.png"), 0.0, this.hintClosedForNextTutorial);
                this._autoAddRayPower = true;
                cc.director.getScheduler().schedule(this.increaseNormalGain, this, 0.1, false);
            }
                break;

            case TutorialStep.TutorialStep16:
            {
                this._pauseFish = false;
                this._captiveRate = CaptiveRateStandard;
                this.gotoTutorialStep(TutorialStep.TutorialStep17, false);
            }
                break;

            case TutorialStep.TutorialStep17:
            {
                this.playTutorialHint(hintPos2, false);
                this._pauseFish = false;
                this._captiveRate = CaptiveRateStandard;
            }
                break;

            case TutorialStep.TutorialStep18:
            {
                this._pauseFish = true;
                this.showHint(ImageNameLang("fontsthis._otherthis._26.png"), 0.0, this.hintClosedForNextTutorial);
            }
                break;

            case TutorialStep.TutorialStep19:
                this._pauseFish = false;
                this._captiveRate = CaptiveRateStandard;
                cc.director.getScheduler().schedule(this.increaseNormalGain, this, 0.1, false);
                break;

            case TutorialStep.TutorialStep20:
                this._currentGameScene.runAction(cc.sequence(cc.delayTime(5.0), cc.callFunc(this.showHintInT20, this)));

                break;

            case TutorialStep.TutorialStep21:
            {
                cc.director.getScheduler().schedule(this.nextTutorial
                    , this, 0.1, false);
            }
                break;
            case TutorialStep.TutorialStep22:
            {

            }
                break;

            case TutorialStep.TutorialStep23:
            {
                this._targetTutorialStep = TutorialStep.TutorialStep25;
                this.tutorialAward(40);
                this.stopTutorialHint();
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
                this._showHint = true;
                this.showFishInfo();
                this.changeSkipButton();
                cc.director.getScheduler().schedule(this.nextTutorial, this, 3, false);
            }
                break;

            case TutorialStep.TutorialStep24:
            {
                cc.director.getScheduler().unschedule(this.nextTutorial, this);
            }
                break;

            case TutorialStep.TutorialStep25:
            {
                this._showHint = false;
                this.hideFishInfo();
            }
                break;

            default:
                break;
        }

        this._tutorialQueue.shift();
        //KingFisher cc.log("tutorialQueue count:" + this._tutorialQueue.length);

        if (this._tutorialQueue.length == 0) {
            this._currentGameScene.removeChildByTag(kSkipTutorialTag, true);
        }
    },
    superWeaponPowerUpAgain:function (dt) {
        cc.director.getScheduler().unschedule(this.superWeaponPowerUpAgain, this);
        if (this._sessionRunning) {
            this._isInDelay = false;
            this._autoAddRayPower = true;
            cc.director.getScheduler().schedule(this.increaseNormalGain, this, 0.1, false);
        }
    },
    hintClosed:function () {
        this._showHint = false;
        if (this.currentTutorialStep == TutorialStep.TutorialStep19) {
            this.getHintBack().setHint(cc.LocalizedString.localizedString("Tutorial Text Step 5.2"));
            this.getHintBack().playAppear();
        }
    },
    willEnd:function () {
        cc.director.getScheduler().unschedule(this.increaseNormalGain, this);
        while (GameCtrl.sharedGame().getCurScene().getChildByTag(456 + ActorType.eActorTypeNormal)) {
            var spRainbow = GameCtrl.sharedGame().getCurScene().getChildByTag(456 + ActorType.eActorTypeNormal);
            spRainbow.stopAllActions();
            spRainbow.removeFromParentAndCleanup(true);
        }


        PlayerActor.sharedActor().setCurWeaponLevel(FishWeaponType.eWeaponLevel1);
        this._currentGameScene.getCannonActor().resetWeapon();

        this.stopTutorialHint();
        PlayerActor.sharedActor().setAutoSave(true);
        this._super();

        var oldNormal = wrapper.getIntegerForKey(kOldLaserNum);
        PlayerActor.sharedActor().setNormalGain(oldNormal);
        PlayerActor.sharedActor().SetBOnTutorial(false);

        this._currentGameScene.getCannonActor().setIsChangeToSpecialWeapon(false);
        this._currentGameScene.getCannonActor().setIsSpecialChangeBackNormal(false);
        this._currentGameScene.getCannonActor().setIsWeaponSwitching(false);
        this._currentGameScene.getCannonActor().setIsWeaponVisible(true);
    },
    willStart:function () {
        wrapper.setIntegerForKey(kOldLaserNum, PlayerActor.sharedActor().getNormalGain());
        wrapper.setIntegerForKey(kUseLaser, 0);
        PlayerActor.sharedActor().updateNormalGain(0);
        PlayerActor.sharedActor().setAutoSave(true);
        PlayerActor.sharedActor().saveStateToCoredate();
        PlayerActor.sharedActor().setAutoSave(false);
        this._super();
    },
    goBack:function (pSender) {
        if (this.currentTutorialStep == TutorialStep.TutorialStep23) {
            this.nextTutorial(0);
            this.nextTutorial(0);
        }

        if (this.currentTutorialStep == TutorialStep.TutorialStep24) {
            this.nextTutorial(0);
        }
    },
    changeWeaponEndEndSession:function (dt) {
        if (this._currentGameScene.getCannonActor().getIsWeaponSwitching()) {
            return;
        } else {
            cc.director.getScheduler().unschedule(this.changeWeaponEndEndSession, this);
        }

        if (!wrapper.getBooleanForKey("NewFishPrompt1")) {
            wrapper.setBooleanForKey("NewFishPrompt1", true);

        }
        this._pauseFish = false;
        this._captiveRate = CaptiveRateStandard;

        wrapper.setBooleanForKey(kTutorialPlayed, true);

        PlayerActor.sharedActor().loadStates();

        if (!this._tutorialAwardReceived) {
            PlayerActor.sharedActor().setPlayerMoney(PlayerActor.sharedActor().getPlayerMoney() + 100);
            this._tutorialAwardReceived = true;
            wrapper.setBooleanForKey(kTutorialAwardReceived, true);
        }

        PlayerActor.sharedActor().setCurWeaponLevel(FishWeaponType.eWeaponLevel1);
        this._currentGameScene.getCannonActor().performCannonSwitch(FishWeaponType.eWeaponLevel1);
        this._currentGameScene.getCannonActor().setWeaponButtonEnable(true);

        PlayerActor.sharedActor().setAutoSave(true);

        this._currentGameScene.removeChildByTag(kSkipTutorialTag, true);
        // !应该把该controller 移除掉
        this._currentGameScene.setPlayTutorial(false);
        // 设置春节成就
        PlayerActor.sharedActor().setIsGetSpringFestival(true);
        this.endSession();
    }
});