//add the common widget for game

let PlayerInfoWidget = cc.Node.extend({
    _lbPlayerName: null,
    _lbPlayerCredit: null,
    ctor: function (playerInfo) {
        cc.Node.prototype.ctor.call(this);
        this._className = 'PlayerInfoWidget';

        //load spriteFrame
        if (!cc.spriteFrameCache.getSpriteFrame(ReferenceName.NameBG)) {
            cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        }

        const player = playerInfo || ef.gameController.getCurrentPlayer();

        //register event listener to update player info
        //(bg size = 190 x 48)

        const spPlayerNameBg = new cc.Sprite(ReferenceName.NameBG);
        spPlayerNameBg.setPosition(95, 0);
        this.addChild(spPlayerNameBg);

        const lbPlayerName = this._lbPlayerName = new cc.LabelTTF(limitStringLength(player.displayName, 14), "Arial", 22);
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

        this.updatePlayerCredit(player.score);
    },

    updatePlayerCredit: function (playerCredit) {
        if (!playerCredit)
            playerCredit = 0;
        this._lbPlayerCredit.setString(playerCredit.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }));
    },

    updatePlayerName: function (playerName) {
        if (!playerName)
            return;
        this._lbPlayerName.setString(playerName);
    }
});

let limitStringLength = function (str, limitLen) {
    if (!str)
        return "";
    if (str.length > limitLen) {
        return str.substring(0, limitLen - 2) + "..";
    }
    return str;
};

const transferMinutesToString = function (minutes) {
    const hours = 0 | (minutes / 60);
    const mins = 0 | (minutes % 60);
    const secs = (minutes - (0 | minutes)) * 60;
    let strHours = hours.toFixed(0), strMin = mins.toFixed(0), strSecs = secs.toFixed(0);
    return (strHours.length === 1 ? ("0" + strHours) : strHours) + ":" +
        (strMin.length === 1 ? ("0" + strMin) : strMin) + ":" +
        (strSecs.length === 1 ? ("0" + strSecs) : strSecs);
};

const transferSecondsToString = function (seconds) {
    seconds = seconds || 0;

    const hours = 0 | (seconds / 3600);
    const mins = 0 | ((seconds - (hours * 3600)) / 60);
    const secs = 0 | (seconds % 60);
    let strHours = hours.toFixed(0), strMin = mins.toFixed(0), strSecs = secs.toFixed(0);
    return (strHours.length === 1 ? ("0" + strHours) : strHours) + ":" +
        (strMin.length === 1 ? ("0" + strMin) : strMin) + ":" +
        (strSecs.length === 1 ? ("0" + strSecs) : strSecs);
};

const setNodeWithChildrenForProperty = function (rootNode, conditionCallback, callback) {
    function setProp(obj) {
        callback(obj);
        if (obj.childrenCount) {
            obj.children.forEach(setProp);
        }
    }

    function lookforNode(obj) {
        if (conditionCallback(obj)) {
            setProp(obj);
        } else if (obj.childrenCount) {
            obj.children.forEach(lookforNode);
        }
    }

    lookforNode(rootNode);
};

//Floating Menu
let GameFloatingMenu = cc.Node.extend({
    _btnSetting: null,
    _btnAssets: null,
    _btnProfile: null,
    _btnLeaderBoard: null,
    _btnFAQ: null,

    ctor: function () {
        cc.Node.prototype.ctor.call(this);
        this._className = "GameFloatingMenu";

        //padding = 120
        let paddingWidth = 90;
        //load menu sprite frame
        if (!cc.spriteFrameCache.getSpriteFrame(ReferenceName.FloatingMenuButtonSettingsIcon))
            cc.spriteFrameCache.addSpriteFrames(res.MenuPlist);

        let btnSetting = this._btnSetting = new FloatMenuItem(ReferenceName.FloatingMenuButtonSettingsIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonSettingsText,
            function () {
                //show setting panel
            });
        btnSetting.setPosition(0, 0);
        this.addChild(btnSetting);

        let btnAssets = this._btnAssets = new FloatMenuItem(ReferenceName.FloatingMenuButtonGameLogIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonGameLogText,
            function () {
                //show assets panel
            });
        btnAssets.setPosition(paddingWidth, 0);
        this.addChild(btnAssets);

        let btnProfile = this._btnProfile = new FloatMenuItem(ReferenceName.FloatingMenuButtonInfoIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonInfoText, function () {

            });
        btnProfile.setPosition(paddingWidth * 2, 0);
        this.addChild(btnProfile);

        let btnLeaderBoard = this._btnLeaderBoard = new FloatMenuItem(ReferenceName.FloatingMenuButtonLeaderboardIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonLeaderboardText, function () {
                //show the
            });
        btnLeaderBoard.setPosition(paddingWidth * 3, 0);
        this.addChild(btnLeaderBoard);

        let btnFAQ = this._btnFAQ = new FloatMenuItem(ReferenceName.FloatingMenuButtonFAQIcon,
            ReferenceName.FloatingMenuButtonBackground, ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonFAQText, function () {
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

    ctor: function (iconSprite, buttonImg, selectedImg, labelImg, clickCallback) {
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
            onMouseDown: function (mouseData) {
                let target = mouseData.getCurrentTarget();
                target.isMouseDown = true;
            },
            onMouseMove: function (mouseData) {
                let target = mouseData.getCurrentTarget(), spTitle = target.getChildByTag(9);
                if (!spTitle)
                    return;
                if (!target.isMouseDown) {
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
            onMouseUp: function (mouseData) {
                let target = mouseData.getCurrentTarget();
                target.isMouseDown = false;
            }
        });
    },

    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        if (this._mouseEventListener && !this._mouseEventListener._isRegistered())
            cc.eventManager.addListener(this._mouseEventListener, this._btnItem);
    }
});

let WaitingPanel = cc.LayerColor.extend({
    _touchEventListener: null,
    _spCircles: null,

    ctor: function () {
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 190));

        let circleArr = this._spCircles = [];
        const radius = 50;
        for (let i = 0; i < 12; i++) {
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
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                let target = event.getCurrentTarget();
                return (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                    target.convertToNodeSpace(touch.getLocation())));
            },
            onTouchEnded: function (touch, event) {
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    //do nothing. block.
                }
            }
        });
    },

    _setupAction: function (spCircle, i) {
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

    onEnter: function () {
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

WaitingPanel.showPanel = function () {
    const scene = cc.director.getRunningScene();
    if (scene) {
        scene.addChild(new WaitingPanel(), 998, 998);  //panel's z-order 998, tag 998
    }
};

WaitingPanel.hidePanel = function () {
    const scene = cc.director.getRunningScene();
    if (scene) {
        const panel = scene.getChildByTag(998);
        if (panel)
            panel.removeFromParent(true);
    }
};

//
let WaveTransition = cc.Node.extend({
    _spWave: null,
    _pgOriginBackground: null,
    _pgTargetBackground: null,
    _spCaustic: null,

    ctor: function (originBackground) {
        cc.Node.prototype.ctor.call(this);

        let sfWave = cc.spriteFrameCache.getSpriteFrame("wave.png");
        if (!sfWave) {
            cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
            sfWave = cc.spriteFrameCache.getSpriteFrame("wave.png");
        }
        let sfCaustic = cc.spriteFrameCache.getSpriteFrame("Caustic_00000.png");
        if (!sfCaustic) {
            cc.spriteFrameCache.addSpriteFrames(res.CausticPlist);
            sfCaustic = cc.spriteFrameCache.getSpriteFrame("Caustic_00000.png")
        }

        const spWave = this._spWave = new cc.Sprite(sfWave);
        const waveSize = spWave.getContentSize();
        spWave.setPosition(cc.visibleRect.left.x, cc.visibleRect.center.y);
        spWave.setAnchorPoint(1, 0.5);
        spWave.setVisible(false);
        this.addChild(spWave, 9);
        spWave.setScale(cc.visibleRect.top.y / waveSize.height);

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
        if (animCaustic)
            spCaustic.runAction(animCaustic.repeatForever());
    },

    transition: function (targetBackground) {
        //hide caustic
        const spCaustic = this._spCaustic, duration = 1;
        spCaustic.runAction(cc.fadeTo(duration, 0));

        this.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function () {
            this._runTransition(targetBackground);
        }, this)));

        //show caustic
        spCaustic.runAction(cc.sequence(cc.delayTime(4 + duration), cc.fadeTo(duration, 51)));
    },

    _runTransition: function (targetBackground) {
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

(function (ef) {
    const IGNORE_DIST = new cc.Point(8, 8);
    ef.SpriteClickHandler = cc._EventListenerTouchOneByOne.extend({
        _startPoint: null,
        _ignoreTouch: false,

        ctor: function () {
            cc._EventListenerTouchOneByOne.prototype.ctor.call(this);
            this._startPoint = new cc.Point(0, 0);
            this._ignoreTouch = false;
            this.setSwallowTouches(true);
        },

        onTouchBegan: function (touch, event) {
            const target = event.getCurrentTarget();
            const location = touch.getLocation();
            this._startPoint.x = location.x;
            this._startPoint.y = location.y;
            const hit = target.hitTest(location);
            if (hit) {
                target.setStatus(ef.BUTTONSTATE.SELECTED);
            }
            return hit;
        },

        onTouchMoved: function (touch, event) {
            const target = event.getCurrentTarget();
            const hit = target.hitTest(touch.getLocation());
            if (hit)
                target.setStatus(ef.BUTTONSTATE.SELECTED);
            else
                target.setStatus(ef.BUTTONSTATE.NORMAL);
        },

        onTouchEnded: function (touch, event) {
            const target = event.getCurrentTarget();
            const lastLocation = touch.getLocation();
            if (target.hitTest(touch.getLocation())) {
                target.setStatus(ef.BUTTONSTATE.NORMAL);
                if (this._ignoreTouch) {
                    let startPoint = this._startPoint;
                    const xMove = Math.abs(lastLocation.x - startPoint.x);
                    const yMove = Math.abs(lastLocation.y - startPoint.y);
                    if (xMove < IGNORE_DIST.x && yMove < IGNORE_DIST.y) {
                        if (target.executeClickCallback)
                            target.executeClickCallback(touch, event);
                    }
                } else {
                    if (target.executeClickCallback)
                        target.executeClickCallback(touch, event);
                }
            }
        },

        setIgonreTouchWhenMove: function (ignore) {
            if (this._ignoreTouch === ignore)
                return;
            this._ignoreTouch = ignore;
            if (ignore) {
                this.setSwallowTouches(false);
            } else {
                this.setSwallowTouches(true);
            }
        }
    });

    ef.initClickListener = function (node, clickHandler) {
        cc.eventManager.addListener(new ef.SpriteClickHandler(), node);
        node.hitTest = function (point) {
            return cc.rectContainsPoint(cc.rect(0, 0, node._contentSize.width, node._contentSize.height),
                node.convertToNodeSpace(point));
        };
        node.setStatus = function (status) {
            node._btnStatus = status;
        };
        node.executeClickCallback = clickHandler;
        return node;
    };

    ef.MouseOverEventListener = cc._EventListenerMouse.extend({
        _mouseDown: null,
        ctor: function () {
            cc._EventListenerMouse.prototype.ctor.call(this);
            this._mouseDown = false;
        },
        onMouseDown: function (mouseData) {
            this._mouseDown = true;
        },
        onMouseMove: function (mouseData) {
            const target = mouseData.getCurrentTarget();
            if (!target.isMouseDown) {
                // Use the target's collision detection if it has custom detection
                const hit = target.hitTest
                    ? target.hitTest(mouseData.getLocation())
                    : cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height), target.convertToNodeSpace(mouseData.getLocation()));
                if (hit) {
                    if (target.onMouseOverIn)
                        target.onMouseOverIn(mouseData);
                } else {
                    if (target.onMouseOverOut)
                        target.onMouseOverOut(mouseData);
                }
            }
        },
        onMouseUp: function (mouseData) {
            this._mouseDown = false;
        }
    });

    ef.BUTTONSTATE = {NORMAL: 0, SELECTED: 1};

    ef.ButtonSprite = cc.Sprite.extend({
        _normalSprite: null,
        _selectedSprite: null,
        _status: null,
        _lbTitle: null,

        //sprite frame;
        _touchEventListener: null,
        _mouseoverEventListener: null,

        _clickCallback: null,
        _clickTarget: null,

        ctor: function (normalSprite, selectedSprite, title) {
            cc.Sprite.prototype.ctor.call(this, normalSprite);

            this._normalSprite = normalSprite;
            this._selectedSprite = selectedSprite;

            this._status = ef.BUTTONSTATE.NORMAL;

            const contentSize = this._contentSize;
            if (typeof(title) === "string")
                this._lbTitle = new cc.LabelTTF(title, ef.DEFAULT_FONT, 12);
            else
                this._lbTitle = title;

            if (this._lbTitle) {
                this._lbTitle.setPosition(contentSize.width >> 1, contentSize.height >> 1);
                this.addChild(this._lbTitle);
            }

            this._touchEventListener = new ef.SpriteClickHandler();
            this._mouseoverEventListener = new ef.MouseOverEventListener();
        },

        getTitle: function () {
            if (!this._lbTitle) {
                let lbTitle = this._lbTitle = new cc.LabelTTF(" ", ef.DEFAULT_FONT, 12);
                const contentSize = this._contentSize;
                lbTitle.setPosition(contentSize.width >> 1, contentSize.height >> 1);
                this.addChild(lbTitle);
            }
            return this._lbTitle
        },

        hitTest: function (point) {
            return cc.rectContainsPoint(cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        setStatus: function (status) {
            if (this._status === status)
                return;

            this._status = status;
            if (typeof (this._normalSprite) === 'string') {
                if (this._normalSprite[0] === '#') {
                    const spriteFrame = cc.spriteFrameCache.getSpriteFrame(
                        (this._status === ef.BUTTONSTATE.NORMAL) ? this._normalSprite.substr(1) : this._selectedSprite.substr(1));
                    if (spriteFrame)
                        this.setSpriteFrame(spriteFrame);
                } else {
                    const texture = cc.textureCache.addImage(
                        (this._status === ef.BUTTONSTATE.NORMAL) ? this._normalSprite : this._selectedSprite);
                    this.setTexture(texture);
                }
            } else {
                const texture = (this._status === ef.BUTTONSTATE.NORMAL) ? this._normalSprite : this._selectedSprite;
                this.setSpriteFrame(texture);
            }
        },

        setClickHandler: function (callback, target) {
            this._clickCallback = callback;
            this._clickTarget = target;
        },

        executeClickCallback: function (touch, event) {
            if (this._clickCallback)
                this._clickCallback.call(this._clickTarget, touch, event);
        },

        onEnter: function () {
            cc.Sprite.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
            if (this._mouseoverEventListener && !this._mouseoverEventListener._isRegistered())
                cc.eventManager.addListener(this._mouseoverEventListener, this);
        },

        onMouseOverIn: function () {
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._selectedSprite.substr(1));
            if (spriteFrame)
                this.setSpriteFrame(spriteFrame);
        },
        onMouseOverOut: function () {
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._normalSprite.substr(1));
            if (spriteFrame)
                this.setSpriteFrame(spriteFrame);
        },

        setTouchEnabled: function (enable) {
            this._touchEventListener.setEnabled(enable);
        },

        setIgonreTouchWhenMove: function (enable) {
            this._touchEventListener.setIgonreTouchWhenMove(enable);
        }
    });

    ef.ButtonSprite.createSpriteButton = function (normalSpriteName, selectedSpriteName, titleSpriteName) {
        return new ef.ButtonSprite(normalSpriteName, selectedSpriteName, new cc.Sprite(titleSpriteName));
    };

    ef.ButtonSprite.createLabelButton = function (normalSpriteName, selectedSpriteName, labelString) {
        return new ef.ButtonSprite(normalSpriteName, selectedSpriteName, labelString);
    };

    //
    ef.LayerColorButton = cc.LayerColor.extend({
        _spButton: null,

        _touchEventListener: null,

        _clickCallback: null,
        _clickTarget: null,
        _status: null,
        _defaultOpacity: 140,

        ctor: function (buttonSprite, width, height) {
            cc.LayerColor.prototype.ctor.call(this, new cc.Color(0, 0, 0, 0), width, height);

            if (!buttonSprite)
                throw "invalid parameters";

            if (typeof(buttonSprite) === "string") {
                this._spButton = new cc.Sprite(buttonSprite);
            } else {
                this._spButton = buttonSprite;
            }

            this._spButton.setPosition(width * 0.5, height * 0.5);
            this.addChild(this._spButton);
            this._spButton.setScale(0.8);
            this._touchEventListener = new ef.SpriteClickHandler();
            this._status = ef.BUTTONSTATE.NORMAL;
        },

        onEnter: function () {
            cc.Sprite.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
        },

        hitTest: function (point) {
            return cc.rectContainsPoint(cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        setStatus: function (status) {
            if (this._status === status)
                return;

            this._status = status;
            if (this._status === ef.BUTTONSTATE.NORMAL) {
                this.setOpacity(0);
            } else {
                this.setOpacity(this._defaultOpacity);
            }
        },

        getStatus: function () {
            return this._status;
        },

        setClickHandler: function (callback, target) {
            this._clickCallback = callback;
            this._clickTarget = target;
        },

        executeClickCallback: function (touch, event) {
            if (this._clickCallback)
                this._clickCallback.call(this._clickTarget, touch, event);
        },

        setTouchEnabled: function (enable) {
            this._touchEventListener.setEnabled(enable);
        },

        setIgonreTouchWhenMove: function (enable) {
            this._touchEventListener.setIgonreTouchWhenMove(enable);
        }
    });

    ef.NotificationPanel = cc.Node.extend({
        _spNotificationIcon: null,
        _cpClippingNode: null,
        _lbNotification: null,
        _szSize: null,
        _duration: 6,
        ctor: function (width, height) {
            cc.Node.prototype.ctor.call(this);
            this._className = "NotificationPanel";

            const szSize = this._szSize = new cc.Size(width || 100, height || 30);

            const dnStencil = new cc.DrawNode();
            const rectangle = [cc.p(0, 0), cc.p(szSize.width, 0), cc.p(szSize.width, szSize.height),
                cc.p(0, szSize.height)], green = new cc.Color(0, 255, 0, 255);
            dnStencil.drawPoly(rectangle, green, 3, green);

            const cpClippingNode = this._cpClippingNode = new cc.ClippingNode(dnStencil);
            cpClippingNode.setPosition(36, 0);
            this.addChild(cpClippingNode);

            //const testLayer = new cc.LayerColor(new cc.Color(255, 0, 0, 255));
            //cpClippingNode.addChild(testLayer);

            const lbNotification = this._lbNotification = new cc.LabelTTF("test notification", "Arial", 18);
            lbNotification.setPosition(szSize.width * 0.5, szSize.height * 0.5);
            cpClippingNode.addChild(lbNotification);

            const spNotificationIcon = this._spNotificationIcon = new cc.Sprite(ReferenceName.NotificationIcon);
            spNotificationIcon.setPosition(18, 18);
            this.addChild(spNotificationIcon);
        },

        showNotification: function (message, callback, target) {
            const lbNotification = this._lbNotification;
            if (!message) {
                lbNotification.setString("");
                if (callback)
                    callback.call(target);
                return;
            }

            const szSize = this._szSize;
            lbNotification.setString(message);
            const contentSize = this._lbNotification.getContentSize();
            lbNotification.setPosition(szSize.width + contentSize.width * 0.5, szSize.height * 0.5);
            lbNotification.runAction(cc.sequence(cc.moveBy(this._duration, -(szSize.width + contentSize.width), 0),
                cc.callFunc(function () {
                    if (callback)
                        callback.call(target);
                })));
        }
    });

    ef.ErrorMsgDialog = cc.Layer.extend({
        _text: null,
        _confirmBtn: null,
        _baseBG: null,
        _btnListener: null,
        ctor: function (width, height, text) {
            cc.Layer.prototype.ctor.call(this);

            width = width || 1000;
            height = height || 300;
            //bg
            const szSize = this._szSize = new cc.Size(width, height);
            this.setContentSize(width, height);
            // this.addChild(layer);
            const spBase = this._baseBG = new cc.Sprite("#SS_ErrorMsgBase.png");
            spBase.setScaleX(szSize.width / spBase.getContentSize().width);
            spBase.setScaleY(szSize.height / spBase.getContentSize().height);
            spBase.setPosition(0, 0);

            this.addChild(spBase);

            //error text
            if (typeof(text) === "string")
                this._lbTitle = new cc.LabelTTF(text, ef.DEFAULT_FONT, 40);
            else
                this._lbTitle = text;

            if (this._lbTitle) {
                this._lbTitle.setPosition(0, height / 4);
                this.addChild(this._lbTitle, 2);
            }

            //confirmBtn
            const spConfirmBtn = this._confirmBtn = new cc.Sprite("#SS_ComfirmBase.png");
            this._confirmBtn.setPosition(0, -height / 4);
            this.addChild(spConfirmBtn, 2);

            //btn text
            const btnText = new cc.LabelTTF("确定", ef.DEFAULT_FONT, 20);
            btnText.setPosition(spConfirmBtn.getContentSize().width / 2, 25);
            spConfirmBtn.addChild(btnText);

            let self = this;
            this._btnListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    const target = event.getCurrentTarget(), parent = target.getParent();
                    if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                            target.convertToNodeSpace(touch.getLocation()))) {
                        self.removeFromParent();
                        return false;
                    }
                },
            });

            if (this._btnListener && !this._btnListener._isRegistered())
                cc.eventManager.addListener(this._btnListener, this._confirmBtn);
        }
    });

    ef.LockingRoomDialog = cc.Layer.extend({
        _text: null,
        _yesBtn: null,
        _noBtn: null,
        _btnListener: null,
        ctor: function (cost, duration, callback) {
            cc.Layer.prototype.ctor.call(this);

            const spBase = this._baseBG = new cc.Sprite(ReferenceName.Lockingroom_Background);
            spBase.setPosition(0, 0);

            this.addChild(spBase);

            // It seems that room locking will (usually) cost 0 credits.
            const str = cost > 0
                ? 'You can now lock this room! It will cost ' + cost + ' coins for ' + duration + ' minutes. Do you want to lock the room?'
                : 'Room locking now available! Do you want to lock this room for ' + duration + ' minutes?';
            const lockRoomText = new cc.LabelTTF(str, ef.DEFAULT_FONT, 20);
            lockRoomText.setPosition(0, 50);
            this.addChild(lockRoomText);

            //no
            const noLayer = new cc.Layer(400, 100);
            noLayer.setContentSize(cc.size(400, 100));
            noLayer.setPosition(60, -50);

            const noBtn = this._noBtn = new cc.Sprite(ReferenceName.Lockingroom_No);
            noLayer.addChild(noBtn, 2);

            const noBtnText = new cc.LabelTTF("不需要", ef.DEFAULT_FONT, 20);
            noBtnText.setPosition(60, 0);
            noLayer.addChild(noBtnText);

            noBtn.confirmResult = noBtnText.confirmResult = false;

            this.addChild(noLayer);

            //yes
            const yesLayer = new cc.Layer(400, 100);
            yesLayer.setContentSize(cc.size(400, 100));
            yesLayer.setPosition(-100, -50);

            const yesBtn = this._yesBtn = new cc.Sprite(ReferenceName.Lockingroom_Yes);
            yesLayer.addChild(yesBtn, 2);

            const yesBtnText = new cc.LabelTTF("需要", ef.DEFAULT_FONT, 20);
            yesBtnText.setPosition(60, 0);
            yesLayer.addChild(yesBtnText);

            yesBtn.confirmResult = yesBtnText.confirmResult = true;

            this.addChild(yesLayer);

            ef.initClickListener(noBtnText, clickResult);
            ef.initClickListener(noBtn, clickResult);
            ef.initClickListener(yesBtnText, clickResult);
            ef.initClickListener(yesBtn, clickResult);

            const self = this;

            function clickResult(touch, event) {
                self.removeFromParent();
                callback(event.getCurrentTarget().confirmResult);
            }
        }
    });

})(ef);