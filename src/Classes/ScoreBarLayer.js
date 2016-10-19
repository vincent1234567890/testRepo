var moneyItem = null;
var laseItem = null;
var lightningItem = null;
var ComboSpriteNum = 125;
var labelSpriteNum = 126;

var ScoreBarLayer = cc.Layer.extend({
    moneyTipL:null,
    superWeaponSelectMenu:0,
    superWeaponSelector:null,
    ccbLoadCompleted:false,
    _musicManagerLayerBred:null,
    _ptItemTapjoy:null,
    _delegate:null,
    _isPlayTip:false,
    _isLaserTipShow:false,
    _hiScore:0,
    _score:0,
    _players:0,
    _isPlayNeedMoney:false,
    _isLessThan150:false,
    _isLessThan100:false,
    _bulletsLabel:0,
    _scoresLabel:0,
    _lightValue:null,
    _lightBlood:0,
    _downTimeLabel:null,
    _finger:0,
    _focus:0,
    _moneyTip:0,
    _powerProgressTo:0,
    _powerProgressTimer:0,
    init:function () {
        if (this._super()) {
            //this.setKeyboardEnabled(true);
            // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
            var frameCache = cc.spriteFrameCache;
            frameCache.addSpriteFrames(ImageName("SuperWeaponButton.plist"));
            frameCache.addSpriteFrames(ImageName("help_ui.plist"));

            this.setTag(kTagLayerStatusBar);

            // Get Coin button
            var menuItemGetCoin = new cc.MenuItemSprite(
                new cc.Sprite("#ui_button_05.png"), new cc.Sprite("#ui_button_06.png"), this.getMoreMoney, this);

            menuItemGetCoin.setPosition(cc.p(/*-VisibleRect.bottomRight().x + */85, 42));
            menuItemGetCoin.setTag(kTagMenuItemGetMoney);
            this._ptItemTapjoy = menuItemGetCoin.getPosition();

            //Redeem
            /*var menuItemRedeem = cc.MenuItemSprite.create(
             cc.Sprite.create(ImageNameLang("ui_btn_redeem_normal.png")),
             cc.Sprite.create(ImageNameLang("ui_btn_redeem_select.png")),
             this, this.showRedeemView);
             menuItemRedeem.setScale(kUiItemScale);
             menuItemRedeem.setPosition(cc.p(*/
            /*-VisibleRect.bottomRight().x + */
            /*29, 91));*/

            this._moneyTip = new cc.Sprite("#tishiguang01.png");
            var tipOffset = cc.pAdd(cc.p(0, this._moneyTip.getContentSize().height / 2), cc.p(-266, -18));
            this._moneyTip.setPosition(tipOffset);

            this.addChild(this._moneyTip, 60);


            //rudder
            this._weaponBaseRudder = new cc.Sprite("#ui_box_02_rudder.png");
            this.addChild(this._weaponBaseRudder, 61);
            this._weaponBaseRudder.setAnchorPoint(AnchorPointBottomLeft);
            this._weaponBaseRudder.setPosition(cc.p(-VisibleRect.right().x / 2, 0));

            // pause Menu
            var rudderMenu = cc.Menu.create(menuItemGetCoin/*,menuItemRedeem*/);
            rudderMenu.setPosition(cc.p(-VisibleRect.right().x / 2, 0));
            this.addChild(rudderMenu, 91, kTagScoreBar);

            //weapon base
            var weaponBase = new cc.Sprite("#ui_box_02.png");
            this.addChild(weaponBase, 20);
            weaponBase.setPosition(cc.p(0, weaponBase.getContentSize().height / 2));

            //help
            this.setFinger(new cc.Sprite("#finger_0001.png"));
            this._finger.setVisible(false);
            this.addChild(this._finger, 201);
            this._finger.flippedX = true;

            this.setFocus(new cc.Sprite("#circle_0001.png"));
            this._focus.setVisible(false);
            this.addChild(this._focus, 200);

            this._initLightBlood();
            this.superWeaponChanged();

            // 生成按钮菜单
            this.setBulletsLabel(NumberScrollLabel.create());
            this._bulletsLabel.setComponentSize(new cc.Size(25, 28));
            this._bulletsLabel.setComponentNumber(6);
            this.addChild(this._bulletsLabel, 60);
            this._bulletsLabel.setPosition(cc.p(-342, 10));
            this.setBullet(PlayerActor.sharedActor().getPlayerMoney());
            this.setDownTimeLabel(cc.LabelAtlas.create("60", ImageName("ui_number_time.png"), 18, 26, '0'));
            this.addChild(this._downTimeLabel, 21);
            this._downTimeLabel.setPosition(cc.p(-168, 13));

            this.initTools();
            this.ccbLoadCompleted = true;

            return true;
        }
        return false;
    },
    onExit:function(){
        this._super();
        var frameCache = cc.spriteFrameCache;
        frameCache.removeSpriteFrameByName(ImageName("SuperWeaponButton.plist"));
        frameCache.removeSpriteFrameByName(ImageName("help_ui.plist"));
    },
    getHiScore:function () {
        return this._hiScore;
    },
    setHiScore:function (v) {
        this._hiScore = v;
    },
    getPlayers:function () {
        return this._players;
    },
    setPlayers:function (s) {
        if (this._players == s) return;
        this._players = s;
        var scoreLabel = this.getChildByTag(kTagPlayer);
        scoreLabel.setString(s);
    },
    getIsPlayNeedMoney:function () {
        return this._isPlayNeedMoney;
    },
    setIsPlayNeedMoney:function (v) {
        this._isPlayNeedMoney = v;
    },
    getIsLessThan150:function () {
        return this._isLessThan150;
    },
    setIsLessThan150:function (v) {
        this._isLessThan150 = v;
    },
    getIsLessThan100:function () {
        return this._isLessThan100;
    },
    setIsLessThan100:function (v) {
        this._isLessThan100 = v;
    },
    getBulletsLabel:function () {
        return this._bulletsLabel;
    },
    setBulletsLabel:function (v) {
        this._bulletsLabel = v;
    },
    getScoresLabel:function () {
        return this._scoresLabel;
    },
    setScoresLabel:function (s, bUpdate) {
        if (bUpdate == null) {
            bUpdate = true;
        }
        if (this._score == s) return;
        this._score = s;
        if (bUpdate)
            this.updateScore();
    },
    setDownTime:function (t) {
        if (t < 0) {
            t = 0;
        }
        if (t == this._score) {
            return;
        }
        this._score = t;
        this._downTimeLabel.setString(String(t));
    },
    getLightValue:function () {
        return this._lightValue;
    },
    setLightValue:function (v) {
        this._lightValue = v;
    },
    getLightBlood:function () {
        return this._lightBlood;
    },
    setLightBlood:function (v) {
        this._lightBlood = v;
    },
    getDownTimeLabel:function () {
        return this._downTimeLabel;
    },
    setDownTimeLabel:function (v) {
        this._downTimeLabel = v;
    },
    getFinger:function () {
        return this._finger;
    },
    setFinger:function (v) {
        this._finger = v;
    },
    getFocus:function () {
        return this._focus;
    },
    setFocus:function (v) {
        this._focus = v;
    },
    getMoneyTip:function () {
        return this._moneyTip;
    },
    setMoneyTip:function (v) {
        this._moneyTip = v;
    },
    getPowerProgressTo:function () {
        return this._powerProgressTo;
    },
    setPowerProgressTo:function (v) {
        this._powerProgressTo = v;
    },
    getPowerProgressTimer:function () {
        return this._powerProgressTimer;
    },
    setPowerProgressTimer:function (v) {
        this._powerProgressTimer = v;
    },
    //key pad
    keyBackClicked:function () {
        if (0 == this._delegate) {
            return;
        }

        if (false == this._delegate.getIsPause()) {
            this._delegate.backToMenu(0);
        }
    },
    keyMenuClicked:function () {
        if (this._delegate) {
            this._delegate.pauseGame();
        }
    },
    setBullet:function (b) {
        if (b >= 999999) {
            b = 999999;
        }
        this._bulletsLabel.setNumber(b);
    },
    playNeedMoneyTip:function (tipPos, moneyItem) {
        if (moneyItem == null) {
            moneyItem = this.getChildByTag(kTagScoreBar).getChildByTag(kTagMenuItemGetMoney);
        }


        if (this._isPlayTip) {
            return;
        }
        this._isPlayTip = true;
        var dua = 0.2;
        var fadein = cc.FadeIn.create(dua);
        var fadeRev = fadein.reverse();
        var sequ1 = cc.Sequence.create(fadein, fadeRev);

        var scaleby = cc.ScaleBy.create(dua, 1.2);
        var scaleRev = scaleby.reverse();
        var sequ2 = cc.Sequence.create(scaleby, scaleRev);

        var spawn = cc.Spawn.create(sequ1, sequ2);

        var repeat = cc.RepeatForever.create(spawn);

        moneyItem.setScale(1.0);
        moneyItem.runAction(repeat);

        this._playTutorialHint(tipPos);
    },
    moneyNotEnough:function () {
        if (this._isPlayNeedMoney) {
            return;
        }
        this._isPlayNeedMoney = true;
        this._moneyTip.setVisible(true);

        var cache = cc.spriteFrameCache;
        // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
        cache.addSpriteFrames(ImageName("jindun.plist"));

        var frames = [];
        var frameName;

        for (var i = 1; i < 3; ++i) {
            frameName = "tishiguang0" + i + ".png";
            var frame = cache.getSpriteFrame(frameName);
            frames.push(frame);
        }

        var animation2 = cc.Animation.create(frames, 0.2);
        var ac2 = cc.Animate.create(animation2, false);

        var repeat = cc.RepeatForever.create(ac2);
        this._moneyTip.runAction(repeat);
    },
    showNotEnouth:function () {

    },
    moneyIsEnough:function () {
        this._isPlayNeedMoney = false;
        this._moneyTip.setVisible(false);
        this._moneyTip.stopAllActions();
    },
    backToNormal:function (getMoneyItem) {
        this._isPlayTip = false;

        if (getMoneyItem == null) {
            this._stopTutorialHint();
            if (this.ccbLoadCompleted) {
                var pMenu = this.getChildByTag(kTagScoreBar);
                if (pMenu) {
                    getMoneyItem = pMenu.getChildByTag(kTagMenuItemGetMoney);
                }
            }
        }
        if (getMoneyItem) {
            getMoneyItem.stopAllActions();
            getMoneyItem.setScale(kUiItemScale);
            getMoneyItem.setOpacity(255);
        }
    },
    NormalGain:function (sender) {
        if (this._delegate.getIsPause()) {
            return;
        }

        var LaserNum = wrapper.getIntegerForKey(kLaserNum);
        var LaserSign = wrapper.getIntegerForKey(kLaserSign);
        if (LaserNum < 0 || LaserSign != PlayerActor.laserSign("" + LaserNum)) {
            // 纠正一下负数的错误
            wrapper.setIntegerForKey(kLaserNum, 0);
            wrapper.setIntegerForKey(kLaserSign, PlayerActor.laserSign("0"));
            LaserNum = 0;
        }
        if (LaserNum == 0) {
            playEffect(kBGM_RUNOUTBULLET);
            if (!this._isLaserTipShow) {
                this._isLaserTipShow = true;
                var position;
                if (sender instanceof  cc.Node) {
                    position = this.convertPointFromSubNode(sender, sender.getPosition());
                }
                this._showLaserReminderAtPosition(position);
            }
            return;
        }
        var c = PlayerActor.sharedActor().getCurWeaponLevel();
        var useLaser = wrapper.getIntegerForKey(kUseLaser);
        var weaponManager = this._delegate.getCannonActor();
        var isSwitching = weaponManager.getCurrentWeapon().getIsSwitching();

        // 添加武器10级时候也可以切换超级武器
        if ((useLaser == 0 && c < FishWeaponType.eWeaponLevel8 && !isSwitching) || (useLaser == 0 && c == FishWeaponType.eWeaponLevel10 && !isSwitching)) {
            wrapper.setIntegerForKey(kUseLaser, 1);
            wrapper.setIntegerForKey(kOldLaserNum, PlayerActor.sharedActor().getNormalGain());
            PlayerActor.sharedActor().updateNormalGain(0);
        }
    },
    convertPointFromSubNode:function (pNode, point) {
        var selfContainNode = false;
        var temp = pNode;
        var result = new cc.Point(0, 0);
        while (temp.getParent() != null) {
            if (temp.getParent() == this) {
                selfContainNode = true;
                break;
            }
            temp = temp.getParent();
            result = cc.pAdd(point, temp.getPosition());
        }

        if (selfContainNode) {
            return result;
        } else {
            return new cc.Point(0, 0);
        }
    },
    initTools:function () {
        var laserItem = new cc.MenuItemSprite(
            new cc.Sprite("#button_prop_001_1.png"), new cc.Sprite("#button_prop_001_2.png"), this.useLaser, this);

        var menuTool = new cc.Menu(laserItem);
        this.addChild(menuTool, 60);
        menuTool.setPosition(cc.p(250, 30));

        this.schedule(this._drawLaser, 0.5);
    },
    updateScore:function () {

    },
    superWeaponChanged:function () {
        this.unschedule(this.removeSuperWeaponChoose);

        var menuChooseSuperWeapon;
        var menuItemSuperWeapon;

        var curSuperWeapon = wrapper.getIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY);
        if (FishWeaponType.eWeaponLevel9 == curSuperWeapon) {
            menuItemSuperWeapon = new cc.MenuItemSprite(
                new cc.Sprite("#button_lightning_1.png"),
                new cc.Sprite("#button_lightning_2.png"),
                this.chooseSuperWeapon, this);
        }
        else {
            if (FishWeaponType.eWeaponLevel8 != curSuperWeapon) {
                wrapper.setIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY, FishWeaponType.eWeaponLevel8);
            }
            menuItemSuperWeapon = new cc.MenuItemSprite(
                new cc.Sprite("#button_jiguang_1.png"),
                new cc.Sprite("#button_jiguang_2.png"),
                this.chooseSuperWeapon, this);
        }

        menuChooseSuperWeapon = new cc.Menu(menuItemSuperWeapon);
        this.addChild(menuChooseSuperWeapon, 100);

        menuChooseSuperWeapon.setPosition(cc.p(160, 30));
        this.setSuperWeaponSelectMenu(menuChooseSuperWeapon);

        this.schedule(this.removeSuperWeaponChoose, 3.0);
    },
    _playTutorialHint:function (p, endPos) {
        if (endPos == null) {
            endPos = cc.p(34, -34);
        }

        this._finger.setPosition(cc.pAdd(p, endPos));
        this._finger.runAction(this._fingerAction());
        this._finger.setVisible(true);

        this._focus.setPosition(p);
        this._focus.runAction(this._focusAction());
        this._focus.setVisible(true);
    },
    showPunchBoxOffers:function (sender) {
        if (this._delegate.getIsPause()) {
            return;
        }
        cc.Assert(0, "havn't implement yet.");
    },
    showGamecenter:function (sender) {
        if (GameCenterManager.isGameCenterAvailable()) {
            GameCenterManager.showGameCenterEntrance(true);
        }
    },
    showRedeemView:function (sender) {
        /*if (!wrapper.networkAvailable()) {
         wrapper.networkUnAvailableNotify();
         return;
         }
         wrapper.RedeemWrapper.showRedeemView();*/
    },
    setStageStr:function (s) {
        if (this._stageStr == s) return;
        this._stageStr = s;
        var scoreLabel = this.getChildByTag(kTagStage);
        scoreLabel.setString(s);
    },
    getStageStr:function (getStageStr) {
        return this._stageStr;
    },
    setScore:function (s, update) {
        if (update == null) {
            update == true
        }
        if (this._score == s) return;
        this._score = s;
        if (update)
            this.updateScore();
    },
    didLoadFromCCB:function () {
        this.init();
        this.ccbLoadCompleted = true;
    },
    registMethod:function () {

    },
    pauseGame:function (sender) {
        playEffect(UI_EFFECT_03);

        if (this._delegate) {
            this._delegate.pauseGame();
        }
    },
    getMoreMoney:function (sender) {
        var scene = PlayerActor.sharedActor().getScene();
        if (!scene._playTutorial && !scene.getIsPause()) {
            scene.hideAllMenu();

            scene.pauseGameForShop();
            var layer = ShopLayer.getInstance();
            scene.addChild(layer);
            layer.dropdown();
        }
        wrapper.logEvent("GameScene", "Tap","Buy Money button",1);
    },
    chooseSuperWeapon:function (sender) {
        if (this._delegate.getIsPause() || this._delegate.getCannonActor().getIsChangeToSpecialWeapon()) {
            return;
        }
        if (!this.superWeaponSelector) {
            var swsl = new SuperWeaponSelectLayer();
            swsl.initLayerWithSelectedWeapon();
            this.addChild(swsl, 100, 7788);
            swsl.setPosition(cc.p(280, 98));
            this.setSuperWeaponSelector(swsl);
            this.schedule(this.removeSuperWeaponChoose, 3);
        }
        else {
            this.removeSuperWeaponChoose();
        }
    },
    useLaser:function (sender) {
        this.NormalGain(sender);
    },
    registProperty:function () {

    },
    menuCallBack:function (sender) {
        var tag = sender.getTag();
        switch (tag) {
            case 1:
                this.pauseGame(sender);
                break;
            case 2:
                this.getMoreMoney(sender);
                break;
            case 3:
            case 4:
                this.pauseGame(sender);
                this.chooseSuperWeapon(sender);
                break;
            case 5:
                this.useLaser(sender);
                break;

            default:
                break;
        }
    },
    setDelegate:function (delegate) {
        this._delegate = delegate;
    },
    showTapjoyOffers:function (sender) {
        if (this._delegate.getIsPause()) {
            return;
        }
        Tapjoy.showTapjoyOffers();
    },
    showFlurryClips:function (sender) {
        if (this._delegate.getIsPause()) {
            return;
        }
        FlurryAPI.showFlurryClips();
    },
    showFlurryReEngage:function (sender) {
        if (this._delegate.getIsPause()) {
            return;
        }
        FlurryAPI.showFlurryReEngage();
    },
    showFlurryAppCircle:function (sender) {
        if (this._delegate.getIsPause()) {
            return;
        }
        FlurryAPI.showFlurryAppCircle();
    },
    _laserInPont:function (tipSize, fontSize, tipPos) {
        if (!tipSize) {
            tipSize = cc.Size(80, 30)
        }
        if (!fontSize) {
            fontSize = 13
        }
        if (!tipPos) {
            tipPos = cc.p(430, 40)
        }

        var tipLaserZero = cc.LabelTTF.create("not enough laser", tipSize, cc.TEXT_ALIGNMENT_CENTER, "Arial", fontSize);

        if (this.getChildByTag(kTagTipLaserZero)) {
            tipLaserZero.setColor(cc.c3(255, 0, 0));
            this.removeChildByTag(kTagTipLaserZero, true);
        } else {
            tipLaserZero.setColor(cc.c3(255, 100, 100));
        }

        tipLaserZero.setPosition(tipPos);
        var FadeOut = cc.FadeOut.create(2.0);
        var CallFun = cc.CallFunc.create(this, this._removeSelf);
        tipLaserZero.runAction(cc.Sequence.create(FadeOut, CallFun));
        this.addChild(tipLaserZero, 300, kTagTipLaserZero);
    },
    _removeSelf:function (node) {
        node.removeFromParentAndCleanup(true);
    },
    _menu_collect:function (sender, startPos, endPos) {
        if (!startPos) {
            startPos = cc.p(90, 20)
        }
        if (!endPos) {
            endPos = cc.p(390, 260)
        }

        if (this._delegate.getIsPause()) {
            return;
        }
    },
    _drawLaser:function () {
        var skipPos = cc.p(270, 45);

        this.removeChildByTag(50, true);
        var LaserNum = wrapper.getIntegerForKey(kLaserNum);
        var LaserSign = wrapper.getIntegerForKey(kLaserSign);
        if (LaserSign != PlayerActor.laserSign("" + LaserNum)) {
            LaserNum = 0;
        }
        var useLaserNum = wrapper.getIntegerForKey(kUseLaser);

        if (useLaserNum == 2) {
            if (LaserNum > 0)
                LaserNum--;
        }

        var skip3 = cc.LabelAtlas.create(LaserNum, ImageName("fonts_laser_num.png"), 30, 40, '0');
        skip3.setScale(0.8);
        var num = 1;
        while (true) {
            LaserNum = LaserNum / 10;
            if (LaserNum <= 0) {
                break;
            }
            num++;
        }
        skip3.setPosition(cc.p(skipPos.x/* - num * 3*/, skipPos.y));
        this.addChild(skip3, 62, 50);

    },
    _showLaserReminderAtPosition:function (position, locOffset) {
        if (!locOffset) {
            locOffset = cc.p(48, 84);
        }

        var reminder = new cc.MenuItemSprite(new cc.Sprite("#ui_laserwarning_bg.png"), new cc.Sprite("#ui_laserwarning_bg.png"),
            this._removeLazerReminder, this);
        var info = new cc.Sprite(ImageNameLang("ui_laserwarning.png"));
        info.setPosition(cc.p(reminder.getContentSize().width / 2, reminder.getContentSize().height / 2));
        reminder.addChild(info);
        var fadeIn = new cc.FadeIn(0.4);
        var blank = new cc.MoveBy(3, cc.PointZero());
        var reverse = fadeIn.reverse();

        var removeReminder = new cc.CallFunc(this, this._removeLazerReminder);
        var actionSequence = new cc.Sequence(fadeIn, blank, reverse, removeReminder);
        reminder.runAction(actionSequence);
        var OKMenu = new cc.Menu(reminder);

        OKMenu.setPosition(cc.pAdd(position, locOffset));
        this.addChild(OKMenu, 1000, LUIREMINDERTAG);
    },
    _initLightBlood:function (lbPos, lbScale) {
        if (!lbScale) {
            lbScale = 0.8;
        }

        var lightGroove = new cc.Sprite("#ui_2p_004.png");
        this.addChild(lightGroove, 11);
        lightGroove.setPosition(cc.p(-1, 0));
        this._lightValue = -90;
        this.setLightBlood(new cc.Sprite("#ui_2p_005.png"));
        this._lightBlood.setRotation(this._lightValue);
        this._lightBlood.setPosition(cc.p(-1, 0));
        this.addChild(this._lightBlood, 12);
    },
    _changeShootInterval:function (sender) {
        var setting = GameSetting.getInstance();
        setting.setShootInterval(setting.getShootInterval() - 0.1);
        if (setting.getShootInterval() <= 0.01) {
            setting.setShootInterval(0.5);
        }
    },
    _focusAction:function () {
        var ac0 = cc.DelayTime.create(0.2);
        var ac1 = cc.Show.action();

        var frames = [];
        var cache = cc.spriteFrameCache;
        var frameName;
        for (var i = 1; i < 6; ++i) {
            frameName = "circle_000" + i + ".png";
            var frame = cache.getSpriteFrame(frameName);
            frames.push(frame);
        }


        var animation2 = new cc.Animation(frames, 0.2);
        var ac2 = new cc.Animate(animation2, false);

        var ac3 = cc.Hide.action();
        var ac4 = new cc.DelayTime(0.5);

        var se = new cc.Sequence(ac0, ac1, ac2, ac3, ac4);
        return new cc.RepeatForever(se);
    },
    _fingerAction:function () {
        var ac0 = cc.Show.action();

        var frames = [];
        var cache = cc.spriteFrameCache;
        var frameName;

        for (var i = 1; i < 3; ++i) {
            frameName = "finger_000" + i + ".png";
            var frame = cache.getSpriteFrame(frameName);
            frames.push(frame);
        }

        var animation1 = cc.Animation.create(frames, 0.2);
        var ac1 = cc.Animate.create(animation1, true);

        var ac3 = cc.DelayTime.create(0.8);
        var ac4 = cc.Hide.action();
        var ac5 = cc.DelayTime.create(0.5);

        var se = cc.Sequence.create(ac0, ac1, ac3, ac4, ac5);
        return cc.RepeatForever.create(se);
    },
    _stopTutorialHint:function () {
        this._finger.stopAllActions();
        this._finger.setVisible(false);
        this._focus.stopAllActions();
        this._focus.setVisible(false);
    },
    _setVis:function (sender) {
        this._moneyTip.setVisible(false);
        this._moneyTip.stopAllActions();
    },
    showNotEnough:function () {
        if (this._isLessThan100 || this._isLessThan150) {
            return;
        }

        this._moneyTip.setVisible(true);

        var cache = cc.spriteFrameCache;
        // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
        cache.addSpriteFrames(ImageName("jindun.plist"));

        var frames = [];
        var frameName;

        for (var i = 1; i < 3; ++i) {
            frameName = "tishiguang0" + i + ".png";
            var frame = cache.getSpriteFrame(frameName);
            frames.push(frame);
        }

        var animation2 = cc.Animation.create(frames, 0.4);
        var ac2 = cc.Animate.create(animation2, false);

        var callback = cc.CallFunc.create(this, this._setVis);
        var repeat = cc.Repeat.create(ac2, 2);
        this._moneyTip.runAction(cc.Sequence.create(repeat, callback));
    },
    _updatePowerProgressBar:function (percentage) {
        this._powerProgressTimer.setPercentage(percentage);
    },
    _useHelp:function () {

    },
    _removeLazerReminder:function (sender) {
        this._isLaserTipShow = false;
        this.removeChildByTag(LUIREMINDERTAG, true);
    },
    MusicLayer:function () {
        if (this._delegate.getIsPause()) {
            return;
        }
    },
    newWeaponNotifySelectorOpen:function () {
        if (!this.superWeaponSelector) {
            this.unschedule(this.removeSuperWeaponChoose);
            var swsl = new SuperWeaponSelectLayer();
            swsl.initLayerWithSelectedWeapon();
            this.addChild(swsl, 100, 7788);
            swsl.setPosition(cc.p(381, 51));
            this.setSuperWeaponSelector(swsl);
        }
    },
    removeSuperWeaponChoose:function () {
        this.unschedule(this.removeSuperWeaponChoose);
        if (this.superWeaponSelector) {
            this.superWeaponSelector.removeFromParentAndCleanup(true);
            this.superWeaponSelector = null;
        }
    },
    getSuperWeaponSelectMenu:function () {
        return this.superWeaponSelectMenu;
    },
    setSuperWeaponSelectMenu:function (v) {
        this.superWeaponSelectMenu = v;
    },
    getSuperWeaponSelector:function () {
        return this.superWeaponSelector;
    },
    setSuperWeaponSelector:function (v) {
        this.superWeaponSelector = v;
    }
});