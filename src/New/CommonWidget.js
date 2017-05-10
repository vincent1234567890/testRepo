//add the common widget for game

let PlayerInfoWidget = cc.Node.extend({
    _lbPlayerName: null,
    _lbPlayerCredit: null,
    ctor: function(playerInfo){
        cc.Node.prototype.ctor.call(this);

        //load spriteFrame
        if(!cc.spriteFrameCache.getSpriteFrame(ReferenceName.NameBG)){
            cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        }

        //register event listener to update player info
        //(bg size = 190 x 48)

        const spPlayerNameBg = new cc.Sprite(ReferenceName.NameBG);
        spPlayerNameBg.setPosition(95, 0);
        this.addChild(spPlayerNameBg);

        const lbPlayerName = this._lbPlayerName = new cc.LabelTTF(limitStringLength(playerInfo.playerState.displayName, 14), "Arial", 22);
        lbPlayerName._setFontWeight("bold");
        lbPlayerName.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        spPlayerNameBg.addChild(lbPlayerName);
        lbPlayerName.setPosition(95, 26);

        //bg size (237 x 48)
        const spPlayerCreditBg = new cc.Sprite(ReferenceName.LobbyCoinsBG);
        spPlayerCreditBg.setPosition(315, 0);
        this.addChild(spPlayerCreditBg);

        const lbPlayerCredit = this._lbPlayerCredit = new cc.LabelTTF("0", "Arial", 30);
        lbPlayerCredit._setFontWeight("bold");
        lbPlayerCredit.setFontFillColor(new cc.Color(255, 205, 60, 255));
        lbPlayerCredit.enableStroke(new cc.Color(90, 24, 8, 255), 3);
        spPlayerCreditBg.addChild(lbPlayerCredit);
        lbPlayerCredit.setPosition(119, 26);

        this.updatePlayerCredit(playerInfo.playerState.score);
    },

    updatePlayerCredit: function(playerCredit){
        if(!playerCredit)
            playerCredit = 0;
        this._lbPlayerCredit.setString(playerCredit.toLocaleString('en-US', {maximumFractionDigits: 2}));
    },

    updatePlayerName: function(playerName){
        if(!playerName)
            return;
        this._lbPlayerName.setString(playerName);
    }
});

let limitStringLength = function(str, limitLen){
    if(!str)
        return "";
    if (str.length > limitLen) {
        return str.substring(0,limitLen - 2) + "..";
    }
    return str;
};

//Floating Menu
let GameFloatingMenu = cc.Node.extend({
    _btnSetting: null,
    _btnAssets: null,
    _btnProfile: null,
    _btnLeaderBoard: null,
    _btnFAQ: null,

    ctor: function(){
        cc.Node.prototype.ctor.call(this);

        //padding = 120
        let paddingWidth = 70;
        //load menu sprite frame
        if(!cc.spriteFrameCache.getSpriteFrame(ReferenceName.FloatingMenuButtonSettingsIcon))
            cc.spriteFrameCache.addSpriteFrames(res.MenuPlist);

        let btnSetting = this._btnSetting = new FloatMenuItem(ReferenceName.FloatingMenuButtonSettingsIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonSettingsText,
            function(){
                //show setting panel
            });
        btnSetting.setPosition(0, 0);
        this.addChild(btnSetting);

        let btnAssets = this._btnAssets = new FloatMenuItem(ReferenceName.FloatingMenuButtonGameLogIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonGameLogText,
            function(){
                //show assets panel
            });
        btnAssets.setPosition(paddingWidth, 0);
        this.addChild(btnAssets);

        let btnProfile = this._btnProfile = new FloatMenuItem(ReferenceName.FloatingMenuButtonInfoIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonInfoText, function(){

            });
        btnProfile.setPosition(paddingWidth * 2, 0);
        this.addChild(btnProfile);

        let btnLeaderBoard = this._btnLeaderBoard = new FloatMenuItem(ReferenceName.FloatingMenuButtonLeaderboardIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonLeaderboardText, function(){
                //show the
            });
        btnLeaderBoard.setPosition(paddingWidth * 3, 0);
        this.addChild(btnLeaderBoard);

        let btnFAQ = this._btnFAQ = new FloatMenuItem(ReferenceName.FloatingMenuButtonFAQIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonFAQText, function(){
                //show the faq
            });
        btnFAQ.setPosition(paddingWidth * 4, 0);
        this.addChild(btnFAQ);
    }
});

let FloatMenuItem = cc.Node.extend({
    _spItemTitle: null,
    _btnItem: null,
    _mouseEventListener: null,
    isMouseDown: false,

    ctor: function(iconSprite, buttonImg, selectedImg, labelImg, clickCallback){
        cc.Node.prototype.ctor.call(this);

        let btnItem = this._btnItem = new ccui.Button(buttonImg, selectedImg, undefined, ccui.Widget.PLIST_TEXTURE);
        btnItem.setTouchEnabled(true);
        this.addChild(btnItem);
        btnItem.addClickEventListener(clickCallback);
        const buttonSize = btnItem.getContentSize();

        let spItemIcon = new cc.Sprite(iconSprite);
        spItemIcon.setPosition(buttonSize.width * 0.5, buttonSize.height * 0.5 - 10);
        btnItem.addChild(spItemIcon);

        let spItemTitle = this._spItemTitle = new cc.Sprite(labelImg);
        spItemTitle.setPosition(buttonSize.width * 0.5, 0);
        btnItem.addChild(spItemTitle);
        spItemTitle.setTag(9);

        //add mouse event
        this._mouseEventListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(mouseData){
                let target = mouseData.getCurrentTarget();
                target.isMouseDown = true;
            },
            onMouseMove: function(mouseData){
                let target = mouseData.getCurrentTarget(), spTitle = target.getChildByTag(9);
                if(!spTitle)
                    return;
                if (!target.isMouseDown){
                    if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                            target.convertToNodeSpace(mouseData.getLocation()))) {
                        //scale to 1.2
                        spTitle.setScale(1.2);
                        return;
                    }
                }
                //scale to 1.0
                spTitle.setScale(1);
            },
            onMouseUp: function(mouseData){
                let target = mouseData.getCurrentTarget();
                target.isMouseDown = false;
            }
        });
    },

    onEnter: function(){
        cc.Node.prototype.onEnter.call(this);
        if (this._mouseEventListener && !this._mouseEventListener._isRegistered())
            cc.eventManager.addListener(this._mouseEventListener, this._btnItem);
    }
});

let WaitingPanel = cc.LayerColor.extend({
    _touchEventListener:null,
    _spCircles: null,

    ctor: function(){
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 190));

        let circleArr = this._spCircles = [];
        const radius = 50;
        for(let i = 0; i < 12; i++) {
            const pAngle = cc.pForAngle(cc.degreesToRadians(i * -30));
            const spCircle = new cc.Sprite(res.LoadingCircle);
            spCircle.setPosition(cc.visibleRect.center.x + pAngle.x * radius,
                cc.visibleRect.center.y + pAngle.y * radius);
            spCircle.setScale(0.5);
            circleArr.push(spCircle);
            this.addChild(spCircle);
            this._setupAction(spCircle, i);
        }

        const lbLoading = new cc.LabelTTF("Loading...", "Arial", 18);
        this.addChild(lbLoading);
        lbLoading.setPosition(cc.visibleRect.center);
            //add event listener
        this._touchEventListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                let target = event.getCurrentTarget();
                return (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                    target.convertToNodeSpace(touch.getLocation())));
            },
            onTouchEnded: function(touch, event){
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    //do nothing. block.
                }
            }
        });
    },

    _setupAction: function(spCircle, i) {
        const duration = 0.6, offset = 0.2, count = 12, delay = offset * count - duration;
        if (i === 0) {
            spCircle.runAction(
                cc.sequence(
                    cc.scaleTo(duration / 2, 1),
                    cc.delayTime(delay),
                    cc.scaleTo(duration / 2, 0.5)).repeatForever());
        } else {

            spCircle.runAction(
                cc.sequence(cc.delayTime(offset * i), cc.callFunc(function () {
                    this.runAction(
                        cc.sequence(
                            cc.scaleTo(duration / 2, 1),
                            cc.delayTime(delay),
                            cc.scaleTo(duration / 2, 0.5)).repeatForever());
                }, spCircle)));
        }
    },

    onEnter: function() {
        cc.LayerColor.prototype.onEnter.call(this);
        if (this._touchEventListener && !this._touchEventListener._isRegistered())
            cc.eventManager.addListener(this._touchEventListener, this);
        const spCircles = this._spCircles;
        for (let i = 0; i < spCircles.length; i++) {
            const selCircle = spCircles[i];
            selCircle.stopAllActions();
            selCircle.setScale(0.5);
            this._setupAction(selCircle, i);
        }
    }
});

WaitingPanel.showPanel = function(){
    const scene = cc.director.getRunningScene();
    if(scene){
        scene.addChild(new WaitingPanel(), 998, 998);  //panel's z-order 998, tag 998
    }
};

WaitingPanel.hidePanel = function(){
    const scene = cc.director.getRunningScene();
    if(scene){
        const panel = scene.getChildByTag(998);
        if(panel)
            panel.removeFromParent(true);
    }
};

//
let WaveTransition = cc.Node.extend({
    _spWave: null,
    _pgOriginBackground: null,
    _pgTargetBackground: null,
    _spCaustic: null,

    ctor: function(originBackground){
        cc.Node.prototype.ctor.call(this);

        let sfWave = cc.spriteFrameCache.getSpriteFrame("wave.png");
        if(!sfWave){
            cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
            sfWave = cc.spriteFrameCache.getSpriteFrame("wave.png");
        }
        let sfCaustic = cc.spriteFrameCache.getSpriteFrame("Caustic_00000.png");
        if(!sfCaustic){
            cc.spriteFrameCache.addSpriteFrames(res.CausticPlist);
            sfCaustic = cc.spriteFrameCache.getSpriteFrame("Caustic_00000.png")
        }

        const spWave = this._spWave = new cc.Sprite(sfWave);
        const waveSize = spWave.getContentSize();
        spWave.setPosition(cc.visibleRect.left.x, cc.visibleRect.center.y);
        spWave.setAnchorPoint(1, 0.5);
        spWave.setVisible(false);
        this.addChild(spWave, 9);
        spWave.setScale(cc.visibleRect.top.y /  waveSize.height);

        const pgOriginBackground = this._pgOriginBackground = new cc.ProgressTimer(new cc.Sprite(originBackground));
        this.addChild(pgOriginBackground);
        pgOriginBackground.setPosition(cc.visibleRect.center);
        pgOriginBackground.setType(cc.ProgressTimer.TYPE_BAR);
        pgOriginBackground.setMidpoint(cc.p(0, 1));
        pgOriginBackground.setBarChangeRate(cc.p(1, 0));
        pgOriginBackground.setPercentage(100);

        const spCaustic = this._spCaustic = new cc.Sprite(sfCaustic);
        spCaustic.setPosition(cc.visibleRect.center.x, cc.visibleRect.center.y);
        spCaustic.setBlendFunc(cc.ONE, cc.ONE);
        spCaustic.setOpacity(51);
        this.addChild(spCaustic, 8);
        const animCaustic = GUIFunctions.getAnimation("Caustic_", 0.08);
        if(animCaustic)
            spCaustic.runAction(animCaustic.repeatForever());
    },

    transition: function(targetBackground) {
        //hide caustic
        const spCaustic = this._spCaustic, duration = 1;
        spCaustic.runAction(cc.fadeTo(duration, 0));

        this.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function(){ this._runTransition(targetBackground); }, this)));

        //show caustic
        spCaustic.runAction(cc.sequence(cc.delayTime(4 + duration), cc.fadeTo(duration, 51)));
    },

    _runTransition: function(targetBackground){
        const spWave = this._spWave, duration = 4;
        spWave.setVisible(true);
        const waveSize = spWave.getContentSize();
        spWave.setPosition(cc.visibleRect.left.x, cc.visibleRect.center.y);
        spWave.runAction(cc.moveTo(duration, cc.visibleRect.right.x + waveSize.width, cc.visibleRect.center.y));
        const delayTime = (waveSize.width / (cc.visibleRect.right.x + waveSize.width)) * duration * 0.5;

        const pgOriginBackground = this._pgOriginBackground;
        pgOriginBackground.setMidpoint(cc.p(1, 0));
        pgOriginBackground.setBarChangeRate(cc.p(1, 0));
        pgOriginBackground.runAction(cc.sequence(cc.delayTime(delayTime), cc.progressFromTo(duration - delayTime * 2, 100, 0)));

        const pgTargetBackground = this._pgTargetBackground = new cc.ProgressTimer(new cc.Sprite(targetBackground));
        this.addChild(pgTargetBackground);
        pgTargetBackground.setPosition(cc.visibleRect.center);
        pgTargetBackground.setType(cc.ProgressTimer.TYPE_BAR);
        pgTargetBackground.setMidpoint(cc.p(0, 1));
        pgTargetBackground.setBarChangeRate(cc.p(1, 0));
        pgTargetBackground.runAction(cc.sequence(cc.delayTime(delayTime), cc.progressFromTo(duration - delayTime * 2, 0, 100)));

        this.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function () {
            this._spWave.setVisible(false);
            this._pgOriginBackground.removeFromParent(true);
            this._pgOriginBackground = this._pgTargetBackground;
            this._pgTargetBackground = null;
        }, this)));
    }
});