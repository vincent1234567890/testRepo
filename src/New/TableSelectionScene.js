const SeatPosition = {
    LEFT: 2,
    BOTTOM_LEFT: 0,
    BOTTOM_RIGHT: 1,
    RIGHT: 3
};

const TableType = {
    MULTIPLE: 0,    //多人
    SINGLE: 1       //包桌
};

(function (ef) {
    ef.TableSelectionScene = cc.Scene.extend({
        _lobbyType: null,
        _pnNotification: null,
        _pnTableListPanel: null,

        _updateIntervalId: null,

        ctor: function (lobbyType, playerData, channelType, selectionMadeCallback) {
            cc.Scene.prototype.ctor.call(this);
            this._className = "TableSelectionScene";

            cc.spriteFrameCache.addSpriteFrames(res.LobbyUI2Plist);
            cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
            cc.spriteFrameCache.addSpriteFrames(res.SeatSelectionPlist);
            cc.spriteFrameCache.addSpriteFrames(res.CausticPlist);
            cc.spriteFrameCache.addSpriteFrames(res.ChinesePlist);

            const spBackground = new cc.Sprite(ReferenceName.LobbyBackground);
            this.addChild(spBackground);
            spBackground.setAnchorPoint(0.5, 1);
            spBackground.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y);
            const spBtmBackground = new cc.Sprite(ReferenceName.SeatBackgroundBottom);
            this.addChild(spBtmBackground);
            spBtmBackground.setAnchorPoint(0.5, 0);
            spBtmBackground.setPosition(cc.visibleRect.center.x, cc.visibleRect.bottom.y);

            //back button
            const btnBack = GUIFunctions.createButton(ReferenceName.SeatBackBtn, ReferenceName.SeatBackBtnSelected, () => {
                //back to Lobby
                // No need to call stopUpdateInterval() here, because exitToLobby() calls popToSceneStackLevel() which calls cleanup().
                GameManager.exitToLobby();
            });
            this.addChild(btnBack);
            btnBack.setPosition(50, cc.visibleRect.top.y - 78);

            //info panel
            const spPlayerInfo = this._spPlayerInfo = new PlayerInfoWidget();
            this.addChild(spPlayerInfo);
            spPlayerInfo.setPosition(120, cc.visibleRect.top.y - 78);
            GameManager.setPlayerInfoWidget(spPlayerInfo);

            //context menu
            //const mmContextMenu = new GameFloatingMenu();
            //mmContextMenu.setPosition(cc.visibleRect.center.x + 237, cc.visibleRect.top.y - 85);
            //this.addChild(mmContextMenu);

            //jackpot panel
            const pnJackpot = new JackpotFloatPanel();
            this.addChild(pnJackpot);
            pnJackpot.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 102);
            GameManager.getJackpotManager().setJackpotFloatPanel(pnJackpot);

            const selectionMadeCallbackForChildren = (joinPrefs) => {
                this.stopUpdateInterval();
                // Or we could do this, but that will briefly display the lobby while we are connecting while we are connecting to the game.
                //cc.director.popToSceneStackLevel(1);

                selectionMadeCallback(joinPrefs);
            };

            //table list layer.
            const tableListPanel = this._pnTableListPanel = new ef.TableListLayer(lobbyType, channelType, selectionMadeCallbackForChildren);
            this.addChild(tableListPanel);

            //notification panel.
            // Create a new one:
            //const pnNotification = new ef.NotificationPanel(400, 32);
            // Or reuse the existing one:
            const pnNotification = GameManager.getGlobalNotificationPanel();
            const oldContainer = pnNotification.getParent();
            if (oldContainer) {
                oldContainer.removeChild(pnNotification);
            }
            pnNotification.setPosition(cc.visibleRect.center.x + 226, cc.visibleRect.top.y - 200);
            this.addChild(pnNotification);
            pnNotification.showNotification("Hello, this is an Elsa's message for testing notification................");

            this.fetchUpdate();
            this.startUpdateInterval();
        },

        fetchUpdate: function () {
            const curPlayer = ef.gameController.getCurrentPlayer();
            // ClientServerConnect.getPlayerInfo({id: curPlayer.id}).then(playerData => {
            //     if (playerData) {
            //         this._spPlayerInfo.updatePlayerCredit(playerData.score);
            //         this._spPlayerInfo.updatePlayerName(playerData.displayName);
            //         ef.gameController.setCurrentPlayer(playerData);
            //     }
            // })
            ClientServerConnect.getListOfRoomsByServer().then(listOfRoomsByServer => {
                //console.log("listOfRoomsByServer:", listOfRoomsByServer);
                // Prepare and flatten the room data before passing it to the TableListLayer
                const allRoomStates = [];
                listOfRoomsByServer.forEach(server => {
                    server.rooms.forEach(room => {
                        room.server = server;
                        allRoomStates.push(room);
                    });
                });
                this.updateRoomStates(allRoomStates);
            }).catch(console.error);
        },

        startUpdateInterval: function () {
            this._updateIntervalId = setInterval(this.fetchUpdate.bind(this), 2000);
        },

        stopUpdateInterval: function () {
            clearInterval(this._updateIntervalId);
        },

        cleanup: function () {
            console.log(`Cleaning up TableSelectionScene`);
            this._super();
            this.stopUpdateInterval();
        },

        updateRoomStates: function (roomStates) {
            this._pnTableListPanel.updateRoomStates(roomStates);
        },
    });

    ef.TableListLayer = cc.Layer.extend({
        _lobbyType: null,
        _playerChannelType: null,

        _btnMultiple: null,
        _btnSolo: null,
        _lbRemainSeats: null,
        _tableType: null,

        _btnExpress: null,
        _btnSpectate: null,

        _pnTableList: null,

        _roomStates: null,
        _cnClippingNode: null,

        ctor: function (lobbyType, channelType, selectionMadeCallback) {
            cc.Layer.prototype.ctor.call(this);

            this._lobbyType = lobbyType || '1X';
            this._playerChannelType = channelType || '';

            //button
            const btnMultiple = this._btnMultiple = new ef.LayerColorButton("#SSMultiplayerChinese.png", 220, 55);
            this.addChild(btnMultiple);
            btnMultiple.setPosition(12, cc.visibleRect.top.y - 205);
            btnMultiple.setStatus(ef.BUTTONSTATE.SELECTED);
            btnMultiple.setClickHandler(this.tableTypeClick, this);
            btnMultiple._spButton._goOpaqueWhenSpectating = true;

            const btnSolo = this._btnSolo = new ef.LayerColorButton("#SSSoloChinese.png", 220, 55);
            this.addChild(btnSolo);
            btnSolo.setPosition(233, cc.visibleRect.top.y - 205);
            btnSolo.setStatus(ef.BUTTONSTATE.NORMAL);
            btnSolo.setClickHandler(this.tableTypeClick, this);
            btnSolo._spButton._goOpaqueWhenSpectating = true;

            //table panel
            const szTableListBg = new cc.Size(cc.visibleRect.width - 24, cc.visibleRect.height - 265);
            const pnTableListBg = new cc.LayerColor(new cc.Color(0, 0, 0, 140), szTableListBg.width, szTableListBg.height);
            pnTableListBg.setPosition(12, 60);
            this.addChild(pnTableListBg);
            ef.gameController.setTablePanel(pnTableListBg);

            //lobby type
            const spLobbyType = this._createLobbyTypeSprite();
            spLobbyType.setPosition(szTableListBg.width * 0.5, szTableListBg.height - 28);
            pnTableListBg.addChild(spLobbyType);

            //remain seats
            const lbRemainSeats = this._lbRemainSeats = new cc.LabelTTF("", "Arial", 22);
            lbRemainSeats.setAnchorPoint(1, 0.5);
            pnTableListBg.addChild(lbRemainSeats, 2);
            lbRemainSeats.setPosition(szTableListBg.width - 38, szTableListBg.height - 35);

            const lbRemainSeatsBG = new cc.Sprite("#SS_RoundConerBar.png");
            lbRemainSeatsBG.setAnchorPoint(1, 0.5);
            pnTableListBg.addChild(lbRemainSeatsBG, 1);
            lbRemainSeatsBG.setPosition(szTableListBg.width - 13 - lbRemainSeats.width, szTableListBg.height - 35);

            //express button
            const btnExpress = this._btnExpress = ef.ButtonSprite.createSpriteButton("#SS_YellowButton.png",
                "#SS_YellowHover.png", "#SS_ExpressChinese.png");
            btnExpress._goOpaqueWhenSpectating = true;
            btnExpress.setPosition(90, szTableListBg.height - 35);
            pnTableListBg.addChild(btnExpress);
            const expressButtonClicked = () => {
                if (ef.gameController.getGlobalProp('spectating')) {
                    return;
                }
                // If player has a locked room already, rejoin that (like the continue button)
                if (thisPlayersLockedRoom) {
                    continueButtonClicked();
                    return;
                }
                const singlePlay = this.getSelectedTableType() === TableType.SINGLE;
                selectionMadeCallback({singlePlay});
            };
            btnExpress.setClickHandler(expressButtonClicked, this);

            //overwrite the default mouse moving handler by checking spectating status
            btnExpress.onMouseOverIn = function () {
                if (ef.gameController.getGlobalProp('spectating')) {
                    return;
                }
                const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._selectedSprite.substr(1));
                if (spriteFrame)
                    this.setSpriteFrame(spriteFrame);
            };
            btnExpress.onMouseOverOut = function () {
                if (ef.gameController.getGlobalProp('spectating')) {
                    return;
                }
                const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._normalSprite.substr(1));
                if (spriteFrame)
                    this.setSpriteFrame(spriteFrame);
            };
            //onlookers button
            const btnSpectate = this._btnSpectate = new SpectateButton();
            btnSpectate.setPosition(220, szTableListBg.height - 35);
            pnTableListBg.addChild(btnSpectate);


            //btn continue
            let thisPlayersLockedRoom = null;

            const btnContinue = this._btnContinue = ef.ButtonSprite.createSpriteButton("#SS_PinkButton.png",
                "#SS_PinkHover.png", "#SS_ContinueChinese.png");
            btnContinue._goOpaqueWhenSpectating = true;
            btnContinue.setPosition(385, szTableListBg.height - 35);
            btnContinue.setVisible(false);
            pnTableListBg.addChild(btnContinue);
            const continueButtonClicked = () => {
                if (ef.gameController.getGlobalProp('spectating')) {
                    return;
                }
                if (!thisPlayersLockedRoom) {
                    return;
                }
                const lockedPlayer = thisPlayersLockedRoom.roomLockStatus.allowedPlayers[0];
                selectionMadeCallback({
                    roomId: thisPlayersLockedRoom.roomId,
                    serverUrl: 'ws://' + thisPlayersLockedRoom.server.ipAddress,
                    slot: lockedPlayer.slot || 0,
                });
            };
            btnContinue.setClickHandler(continueButtonClicked, this);

            btnContinue.checkRooms = function (allRooms) {
                thisPlayersLockedRoom = allRooms.find(roomBelongsToCurrentPlayer);
                btnContinue.setVisible(Boolean(thisPlayersLockedRoom));
            };
            //overwrite the default mouse moving handler by checking spectating status
            btnContinue.onMouseOverIn = function () {
                if (ef.gameController.getGlobalProp('spectating')) {
                    return;
                }
                const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._selectedSprite.substr(1));
                if (spriteFrame)
                    this.setSpriteFrame(spriteFrame);
            };
            btnContinue.onMouseOverOut = function () {
                if (ef.gameController.getGlobalProp('spectating')) {
                    return;
                }
                const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._normalSprite.substr(1));
                if (spriteFrame)
                    this.setSpriteFrame(spriteFrame);
            };

            const szClippingNode = new cc.Size(cc.visibleRect.width - 64, cc.visibleRect.height - 348);
            const dnStencil = new cc.DrawNode();
            const rectangle = [cc.p(0, 0), cc.p(szClippingNode.width, 0), cc.p(szClippingNode.width, szClippingNode.height),
                cc.p(0, szClippingNode.height)], green = new cc.Color(0, 255, 0, 255);
            dnStencil.drawPoly(rectangle, green, 3, green);

            const cnClippingNode = this._cnClippingNode = new cc.ClippingNode(dnStencil);
            cnClippingNode.setPosition(20, 15);
            pnTableListBg.addChild(cnClippingNode);

            //table list panel
            const pnTableList = this._pnTableList = new ef.TableListPanel(this._lobbyType, this._tableType, selectionMadeCallback);
            cnClippingNode.addChild(pnTableList);
            //pnTableList.setPosition(20, 15);

            //scroll button
            // const pnPageIndicator = this._pnPageIndicator = new PageIndicatorPanel();
            // this.addChild(pnPageIndicator);

            this.updateButtonStates();
        },

        _createLobbyTypeSprite: function () {
            if (this._lobbyType === '100X')
                return new cc.Sprite(ReferenceName.Seat100X);
            else if (this._lobbyType === '10X')
                return new cc.Sprite(ReferenceName.Seat10X);
            else
                return new cc.Sprite(ReferenceName.Seat1X);
        },

        tableTypeClick: function (touch, event) {
            const target = event.getCurrentTarget();
            if (target === this._btnMultiple) {
                if (target.getStatus() === ef.BUTTONSTATE.NORMAL) {
                    this._btnMultiple.setStatus(ef.BUTTONSTATE.SELECTED);
                    this._btnSolo.setStatus(ef.BUTTONSTATE.NORMAL);

                    //load the multiple table list
                    this._rerenderRooms();
                }
            } else {
                if (target.getStatus() === ef.BUTTONSTATE.NORMAL) {
                    this._btnMultiple.setStatus(ef.BUTTONSTATE.NORMAL);
                    this._btnSolo.setStatus(ef.BUTTONSTATE.SELECTED);

                    //load the solo table list
                    this._rerenderRooms();
                }
            }
        },

        getSelectedTableType: function () {
            if (this._btnMultiple.getStatus() === ef.BUTTONSTATE.SELECTED) {
                return TableType.MULTIPLE;
            } else {
                return TableType.SINGLE;
            }
        },

        updateRoomStates: function (roomStates) {
            // Sort rooms into ascending numerical order
            const getRoomNum = room => Number(room.roomTitle.replace(/^.*-[SMsm]?/, ''));
            const sortRooms = (a, b) => {
                return getRoomNum(a) - getRoomNum(b);
            };
            roomStates.sort(sortRooms);

            this._roomStates = roomStates;

            this._updateView();
        },

        _rerenderRooms: function () {
            this._pnTableList.clearAllTables();
            this._updateView();
        },

        _updateView: function () {
            if (this._roomStates) {
                // Select only those rooms we should display for this tab
                const tableType = this.getSelectedTableType();
                const roomHasCorrectType = roomState => {
                    if (roomState.sceneName !== this._lobbyType) {
                        return false;
                    }
                    const roomChannelType = roomState.roomTitle.split(':')[0];
                    //console.log("roomTitle, roomChannelType, _playerChannelType:", roomState.roomTitle, roomChannelType, this._playerChannelType);
                    if (roomChannelType !== this._playerChannelType) {
                        return false;
                    }
                    if (tableType === TableType.SINGLE) {
                        return roomState.singlePlay;
                    } else {
                        return !roomState.singlePlay;
                    }
                };
                const roomStatesToShow = this._roomStates.filter(roomHasCorrectType);
                this._btnContinue.checkRooms(roomStatesToShow);

                // Count free seats (of correct type)
                const freeSeats = getFreeSeatsCount(roomStatesToShow);
                this._lbRemainSeats.setString("剩余" + String(freeSeats) + "个吉位");

                // Update the state of existing room sprites (and append new sprites if needed)
                this._pnTableList.updateRoomStates(roomStatesToShow);
            }
        },

        updateButtonStates: function () {
            const isSpectating = ef.gameController.getGlobalProp('spectating');
            setNodeWithChildrenForProperty(this,
                node => node._goOpaqueWhenSpectating,
                obj => obj.opacity = isSpectating ? 120 : 255
            );
            this._btnSpectate.updateBtnText();
        },
    });

    const SpectateButton = cc.Sprite.extend({
        _normalName: "SS_BlueButton.png",
        _selectedName: "SS_BlueHover.png",

        _spIcon: null,
        _spTitle: null,

        _touchEventListener: null,
        _mouseoverEventListener: null,

        ctor: function () {
            //129 x 42
            cc.Sprite.prototype.ctor.call(this, "#" + this._normalName);

            //iconName: SS_SpectateIcon, SS_SpectateBackIcon
            const spIcon = this._spIcon = new cc.Sprite("#SS_SpectateIcon.png");
            this.addChild(spIcon);
            spIcon.setPosition(37, 22);

            //label name: SS_BackChinese, SS_SpectateChinese
            const spTitle = this._spTitle = new cc.Sprite("#SS_SpectateChinese.png");
            this.addChild(spTitle);
            spTitle.setPosition(90, 22);

            this._touchEventListener = new ef.SpriteClickHandler();
            this._mouseoverEventListener = new ef.MouseOverEventListener();
        },

        hitTest: function (point) {
            return cc.rectContainsPoint(cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        onEnter: function () {
            cc.Sprite.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
            if (this._mouseoverEventListener && !this._mouseoverEventListener._isRegistered())
                cc.eventManager.addListener(this._mouseoverEventListener, this);
        },

        setStatus: function (status) {
            if (this._status === status)
                return;

            this._status = status;
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(
                (this._status === ef.BUTTONSTATE.NORMAL) ? this._normalName : this._selectedName);
            if (spriteFrame)
                this.setSpriteFrame(spriteFrame);
        },

        /*
        onMouseOverIn: function () {
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._selectedName);
            if (spriteFrame)
                this.setSpriteFrame(spriteFrame);
        },
        onMouseOverOut: function () {
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._normalName);
            if (spriteFrame)
                this.setSpriteFrame(spriteFrame);
        },
        setClickHandler: function (callback, target) {
            this._clickCallback = callback;
            this._clickTarget = target;
        },
        */

        executeClickCallback: function (touch, event) {
            const isSpectating = !ef.gameController.getGlobalProp('spectating');
            ef.gameController.setGlobalProp('spectating', isSpectating);

            const tableListLayer = this.getParent().getParent();
            tableListLayer.updateButtonStates();

            /*
            if (this._clickCallback)
                this._clickCallback.call(this._clickTarget, touch, event);
            */
        },

        updateBtnText: function () {
            const isSpectating = ef.gameController.getGlobalProp('spectating');

            //update icon
            const inconStr = isSpectating ? "SS_SpectateBackIcon.png" : "SS_SpectateIcon.png";
            const iconSprite = cc.spriteFrameCache.getSpriteFrame(inconStr);
            this._spIcon.setSpriteFrame(iconSprite);

            //update text
            const textStr = isSpectating ? "SS_BackChinese.png" : "SS_SpectateChinese.png";
            const textSprite = cc.spriteFrameCache.getSpriteFrame(textStr);
            this._spTitle.setSpriteFrame(textSprite);
        }
    });

    // const PageIndicatorPanel = cc.Layer.extend({
    //     ctor: function () {
    //         cc.Layer.prototype.ctor.call(this);
    //
    //     }
    // });

    ef.TableListPanel = cc.Layer.extend({
        _lobbyType: null,
        _tableType: null,
        _selectionMadeCallback: null,

        _tableObjectsArray: null,
        _tableSpritesMap: null,

        _touchEventListener: null,
        _mouseEventListener: null,

        startPoint: null,
        OFFSET_DIST: 150,

        ctor: function (lobbyType, tableType, selectionMadeCallback) {
            cc.Layer.prototype.ctor.call(this);

            this._PageIndicatorPanel = new cc.Layer();
            ef.gameController.getTablePanel().addChild(this._PageIndicatorPanel);

            const szClippingNode = new cc.Size(cc.visibleRect.width - 64, cc.visibleRect.height - 348);
            this.setContentSize(szClippingNode);

            this._lobbyType = lobbyType || "1X";
            this._tableType = tableType || TableType.MULTIPLE;
            this._selectionMadeCallback = selectionMadeCallback;

            this._tableObjectsArray = [];
            this._tableSpritesMap = {};

            //const pnLayerColor = new cc.LayerColor(new cc.Color(200, 0, 0, 128));
            //this.addChild(pnLayerColor);

            // @todo touch event handler
            this._touchEventListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,

                onTouchBegan: function (touch, event) {
                    const target = event.getCurrentTarget();
                    target.startPoint = touch.getLocation();
                    return target.hitTest(target.startPoint);
                },

                onTouchMoved: function (touch, event) {
                    const target = event.getCurrentTarget();
                    const pos = touch.getLocation();
                    const offset = target.startPoint.x - pos.x;
                    target.setPosition(-ef.gameController.getCurLobbyPage() * 1366 - offset, 0);
                },

                onTouchEnded: function (touch, event) {
                    const target = event.getCurrentTarget();
                    const endPoint = touch.getLocation();
                    const offset = target.startPoint.x - endPoint.x;
                    if (Math.abs(offset) > target.OFFSET_DIST) {
                        //load next
                        if (offset > 0) {
                            //next
                            const curPage = ef.gameController.getCurLobbyPage();
                            const nextPage = ef.gameController.setCurLobbyPage('next');
                            target.switchNextPage(curPage, nextPage);
                        } else {
                            //previous
                            const curPage = ef.gameController.getCurLobbyPage();
                            const nextPage = ef.gameController.setCurLobbyPage('prev');
                            target.switchPrevPage(curPage, nextPage);
                        }
                        //target.runAction(cc.moveTo(0.3, 0, 0).easing(cc.easeExponentialOut()));
                    } else {
                        target.runAction(cc.moveTo(0.3, 0, 0).easing(cc.easeExponentialOut()));
                    }
                }
            });
            // page event
            let clickEvent = cc._EventListenerMouse.extend({
                ctor: function () {
                    cc._EventListenerMouse.prototype.ctor.call(this);
                },
                onMouseDown: function (event) {
                    let target = event.getCurrentTarget();

                    if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                            target.convertToNodeSpace(event.getLocation()))) {
                        const curPage = ef.gameController.getCurLobbyPage();
                        const nextPage = ef.gameController.setCurLobbyPage(this._node._pageNum - 1);
                        const parent = this._node._parentNode;
                        if (curPage < nextPage) {
                            parent.switchNextPage(curPage, nextPage);
                        } else if (curPage > nextPage) {
                            parent.switchPrevPage(curPage, nextPage);
                        }
                    }
                }
            });
            this._pageIndicatorClickEventListener = new clickEvent();

        },

        updatePageIndicator: function (parentPanel) {
            // clear existing nodes
            const pageIndicatorNode = this._PageIndicatorPanel;
            if (pageIndicatorNode) {
                ef.gameController.getTablePanel().removeChild(pageIndicatorNode);
            }

            delete this._PageIndicatorPanel;

            //add new set
            let pageIndicator = new cc.Layer();
            if (!ef.gameController.getTablePanel()) {
                return;
            }
            ef.gameController.getTablePanel().addChild(pageIndicator);

            const totalPage = ef.gameController.getTotalLobbyPage();
            const curPage = ef.gameController.getCurLobbyPage();
            const sectionWidth = totalPage * 60 + 10;
            const szClippingNode = new cc.Size(sectionWidth, 70);
            pageIndicator.setContentSize(szClippingNode);
            pageIndicator.setPosition(cc.visibleRect.width / 2 - sectionWidth / 2, -40);
            for (let i = 0; i < totalPage; i++) {
                const pageNumLabel = new cc.LabelTTF(i + 1, "Arial", 22);
                let pageIndicatorNum = (i === curPage)
                    ? new cc.Sprite('#SS_PageIndicatorYellow.png')
                    : new cc.Sprite('#SS_PageIndicatorBlue.png');
                const pageContent = pageIndicatorNum.getContentSize();
                pageNumLabel.setPosition(pageContent.width / 2, pageContent.height / 2);
                pageIndicatorNum.setPosition(i * 60, 10);
                pageIndicatorNum.addChild(pageNumLabel);
                pageIndicatorNum._pageNum = i + 1;
                pageIndicatorNum._parentNode = parentPanel;
                pageIndicator.addChild(pageIndicatorNum, 2);

                cc.eventManager.addListener(this._pageIndicatorClickEventListener.clone(), pageIndicatorNum);
            }
            this._PageIndicatorPanel = pageIndicator;
        },

        switchNextPage: function (curPage, nextPage) {
            const contentSize = this.getContentSize();
            this.runAction(cc.sequence(
                // cc.moveTo(0.3, -curPage * 1366, 0).easing(cc.easeExponentialOut()),
                // cc.callFunc(function () {
                //     this.setPosition(-curPage * 1366, 0);
                // }, this),
                cc.moveTo(0.3, -nextPage * 1366, 0).easing(cc.easeExponentialOut())
            ));
            this.updatePageIndicator(this);
        },

        switchPrevPage: function (curPage, nextPage) {
            const contentSize = this.getContentSize();
            this.runAction(cc.sequence(
                // cc.moveTo(0.3, -curPage * 1366, 0).easing(cc.easeExponentialOut()),
                // cc.callFunc(function () {
                //     this.setPosition(-curPage * 1366, 0);
                // }, this),
                cc.moveTo(0.3, -nextPage * 1366, 0).easing(cc.easeExponentialOut())
            ));
            this.updatePageIndicator(this);
        },

        onEnter: function () {
            cc.Layer.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
        },

        hitTest: function (point) {
            return cc.rectContainsPoint(cc.rect(0, 0, ef.gameController.getTotalLobbyPage() * 1366, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        //setLobbyType: function (lobbyType) {
        //    this._lobbyType = lobbyType;
        //},
        //
        //setTableType: function (tableType) {
        //    this._tableType = tableType;
        //},

        clearAllTables: function () {
            Object.keys(this._tableSpritesMap).forEach(roomId => {
                this.removeTableSprite(roomId);
            });
            this._tableSpritesMap = {};
        },

        updateRoomStates: function (roomStates) {
            // Remove any existing tables which are no longer alive
            const roomIdsInUpdate = {};
            roomStates.forEach(roomState => {
                roomIdsInUpdate[roomState.roomId] = true;
            });
            Object.keys(this._tableSpritesMap).forEach(roomId => {
                if (!roomIdsInUpdate[roomId]) {
                    this.removeTableSprite(roomId);
                }
            });

            // Reposition existing sprites (in case any were removed)
            Object_values(this._tableSpritesMap).forEach((tableSprite, index) => {
                this.positionTableSprite(tableSprite, index);
            });

            // Update existing rooms with latest data, and add new rooms if needed
            roomStates.forEach(roomState => {
                const roomId = roomState.roomId;
                if (!this._tableSpritesMap[roomId]) {
                    const newTableSprite = new ef.TableSprite(this._selectionMadeCallback, roomId);
                    const tableNumber = Object.keys(this._tableSpritesMap).length;
                    this.positionTableSprite(newTableSprite, tableNumber);
                    this.addChild(newTableSprite);
                    this._tableSpritesMap[roomId] = newTableSprite;
                }
                const tableSprite = this._tableSpritesMap[roomId];

                //testing code for occupied seats, can be removed
                //roomState.roomLockStatus = Date.now() % 2 == 0 ? [] : ['p'];

                tableSprite.setTableState(roomState);
            });
            ef.gameController.setTotalLobbyPage(Math.ceil(Object.keys(this._tableSpritesMap).length / 8));
            this.updatePageIndicator(this);
        },

        positionTableSprite: function (tableSprite, tableNumber) {
            const page = Math.floor(tableNumber / 8);
            const tableNumberOnPage = tableNumber % 8;
            const row = Math.floor(tableNumberOnPage / 4);
            const i = tableNumberOnPage % 4;
            tableSprite.setPosition(157 + 1366 * page + 328 * i, 310 - 215 * row);
        },

        removeTableSprite: function (roomId) {
            const tableSprite = this._tableSpritesMap[roomId];
            delete this._tableSpritesMap[roomId];
            if (tableSprite) {
                this.removeChild(tableSprite);
            }
        },
    });

    ef.TableSprite = cc.Sprite.extend({
        //SS_Table.png
        _spGlow: null,
        _lbTitle: null,
        _spSpecText: null,

        _lbReserveTime: null,
        _selectionMadeCallback: null,
        _roomId: null,

        _roomState: null,

        _spSeat1: null,
        _spSeat2: null,
        _spSeat3: null,
        _spSeat4: null,

        _tableStatus: null,
        _selectStatus: null,

        _isMouseOverIn: null,
        _mouseEventListener: null,
        _touchEventListener: null,

        ctor: function (selectionMadeCallback, roomId) {
            cc.Sprite.prototype.ctor.call(this, "#SS_Table.png");

            this._selectionMadeCallback = selectionMadeCallback;
            this._roomId = roomId;

            const szContent = this._contentSize;
            //glow
            const spGlow = this._spGlow = new cc.Sprite("#SS_TableHL.png");
            this.addChild(spGlow);
            spGlow.setPosition(szContent.width * 0.5, szContent.height * 0.5);
            spGlow.setVisible(false);

            //spectate text
            const spSpecText = this._spSpecText = new cc.Sprite("#SS_SpectateChinese.png");
            this.addChild(spSpecText);
            spSpecText.setPosition(szContent.width * 0.5, szContent.height * 0.5 + 10);
            spSpecText.setVisible(false);

            //title
            const lbTitle = this._lbTitle = new cc.LabelTTF("018", "Arial", 22);
            this.addChild(lbTitle);
            lbTitle.setPosition(szContent.width * 0.5, szContent.height - 38);

            const lbReserveTime = this._lbReserveTime = new cc.LabelTTF("00:00:00", "Arial", 22);
            this._lbReserveTime._goOpaqueWhenSpectating = true;
            this.addChild(lbReserveTime);
            lbReserveTime.setPosition(szContent.width * 0.5, szContent.height * 0.5 + 10);

            const seatSelectedCallback = (seatNumber) => {
                this.makeSelection({slot: seatNumber});
            };

            //seat1
            const spSeat1 = this._spSeat1 = new ef.TableSeatSprite(seatSelectedCallback, 0);
            spSeat1.setPosition(91, 40);
            this.addChild(spSeat1);

            //seat2
            const spSeat2 = this._spSeat2 = new ef.TableSeatSprite(seatSelectedCallback, 1);
            spSeat2.setPosition(189, 40);
            this.addChild(spSeat2);

            //seat3
            const spSeat3 = this._spSeat3 = new ef.TableSeatSprite(seatSelectedCallback, 2);
            spSeat3.setPosition(36, 105);
            this.addChild(spSeat3);

            //seat4
            const spSeat4 = this._spSeat4 = new ef.TableSeatSprite(seatSelectedCallback, 3);
            spSeat4.setPosition(250, 105);
            this.addChild(spSeat4);

            //reserve time.


            this._isMouseOverIn = false;

            //mouse event handler
            this._mouseEventListener = new ef.MouseOverEventListener();
            this._touchEventListener = new ef.SpriteClickHandler();
        },

        onEnter: function () {
            cc.Sprite.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
            if (this._mouseEventListener && !this._mouseEventListener._isRegistered())
                cc.eventManager.addListener(this._mouseEventListener, this);
        },

        hitTest: function (point) {
            const margin = 40;
            return cc.rectContainsPoint(cc.rect(margin, margin, this._contentSize.width - 2 * margin, this._contentSize.height - margin), this.convertToNodeSpace(point))
                || this._spSeat1.hitTest(point)
                || this._spSeat2.hitTest(point)
                || this._spSeat3.hitTest(point)
                || this._spSeat4.hitTest(point);
        },

        onMouseOverIn: function (mouseData) {
            if (!this._isMouseOverIn) {
                this._isMouseOverIn = true;
                if (!roomIsFull(this._roomState)) {
                    this._spGlow.setVisible(true);
                }
                if (ef.gameController.getGlobalProp('spectating')) {
                    this._spSpecText.setVisible(true);
                }
            }
        },

        onMouseOverOut: function (mouseData) {
            if (this._isMouseOverIn) {
                this._isMouseOverIn = false;
                this._spGlow.setVisible(false);
                this._spSpecText.setVisible(false);
            }
        },

        setTableState: function (roomState) {
            this._roomState = roomState;

            // We only want to show the room number, so we will remove the '100X-' prefix from the room title
            //const roomTitleForDisplay = roomState.roomTitle;
            const roomTitleForDisplay = roomState.roomTitle.replace(/^[^-]*-/, '');
            this._lbTitle.setString(roomTitleForDisplay);

            // Change display if room is locked
            if (roomState.roomLockStatus) {
                this._lbTitle.setString('保留');
                roomState.roomLockStatus.allowedPlayers[0].slot = roomState.roomLockStatus.allowedPlayers[0].slot || 0;
                this._lbReserveTime.setVisible(true);
                let secondsLeft = (roomState.roomLockStatus.expiryTime - Date.now()) / 1000;
                if (secondsLeft < 0) {
                    secondsLeft = 0;
                }
                const countdownString = getHHMMSSFromSeconds(secondsLeft);
                this._lbReserveTime.setString(countdownString);

                //set glowing of the reserved table
                this._spGlow.setVisible(true);
                const sequence = cc.sequence(cc.fadeIn(1), cc.fadeOut(1));
                const repeat = cc.repeatForever(sequence);
                this._spGlow.runAction(repeat);
            } else {
                this._lbReserveTime.setVisible(false);
                this._lbReserveTime.setString('--:--:--');
                // This will remove glow from mouse hover, even if mouse is still hovered.
                // It's not really needed since glow is set invisible when sprite is first created.
                //this._spGlow.setVisible(false);
            }

            for (let i = 0; i < 4; i++) {
                const seatState = roomState.playersBySlot[i];
                const seatSprite = this['_spSeat' + (i + 1)];
                seatSprite.setSeatPlayerState(roomState, seatState);
            }
        },

        setStatus: function (status) {
            //console.warn(`[TableSprite:setStatus] status=${status}`);
        },

        executeClickCallback: function (touch, event) {
            //console.warn(`[TableSprite:executeClickCallback] touch:`, touch, `event:`, event);
            this.makeSelection();
        },

        makeSelection: function (joinPrefs) {
            const curPlayer = ef.gameController.getCurrentPlayer();
            if (roomIsFull(this._roomState) && !ef.gameController.getGlobalProp('spectating')) {
                // Cannot join this room
                return;
            }

            if (this._roomState && this._roomState.roomLockStatus) {
                //disable players from entering the room other than owner.
                if (!roomBelongsToCurrentPlayer()) {
                    return;
                }
            }

            // If this is a single play room, check the player has enough credit to join
            if (this._roomState && this._roomState.singlePlay === true) {

                const multiObj = {
                    '1X': 1,
                    '10X': 10,
                    '100X': 100
                };
                const multiplier = multiObj[this._roomState.sceneName] || 1;

                // @todo const creditRequiredToJoinRoom = // Can be obtained from lobbyConfig
                const creditRequiredToJoinRoom = 5000 * multiplier;

                if (curPlayer.score < creditRequiredToJoinRoom) {
                    console.log('Not enough credit to join room');
                    const newErrorPanel = new ef.ErrorMsgDialog(600, 400, `You need at least ${creditRequiredToJoinRoom} credit to join a single player room`);
                    const tablePanel = ef.gameController.getTablePanel();
                    const content = tablePanel.getContentSize();
                    newErrorPanel.setPosition(content.width / 2, content.height * 2 / 3);
                    tablePanel.getParent().addChild(newErrorPanel, 100);
                    return;
                }
            }

            const roomState = this._roomState;
            joinPrefs = Object.assign({}, joinPrefs, {
                roomId: roomState.roomId,
                serverUrl: 'ws://' + roomState.server.ipAddress,
                spectate: ef.gameController.getGlobalProp('spectating'),
                // This is redundant, since we are selecting the specific room by roomId
                //singlePlay: roomState.singlePlay
            });
            this._selectionMadeCallback(joinPrefs);
        },
    });

    ef.TableSeatSprite = cc.Sprite.extend({
        _spPlayerBase: null,
        _lbPlayerName: null,

        _playerInfo: null,

        _seatStatus: null,

        _seatSelectedCallback: null,
        _seatNumber: null,

        ctor: function (seatSelectedCallback, seatNumber) {
            //SS_YellowSit,  SS_BlueSit
            cc.Sprite.prototype.ctor.call(this, "#SS_YellowSit.png");
            if (!cc.spriteFrameCache.getSpriteFrame("SS_YellowSit.png")) {
                cc.spriteFrameCache.addSpriteFrames("#SS_YellowSit.png");
            }
            if (!cc.spriteFrameCache.getSpriteFrame("SS_BlueSit.png")) {
                cc.spriteFrameCache.addSpriteFrames("#SS_BlueSit.png");
            }
            this._seatSelectedCallback = seatSelectedCallback;
            this._seatNumber = seatNumber;

            const szContent = this._contentSize;
            //SS_NameBase
            const spPlayerBase = this._spPlayerBase = new cc.Sprite("#SS_NameBase.png");
            spPlayerBase.setPosition(szContent.width * 0.5, szContent.height * 0.5);
            this.addChild(spPlayerBase);

            const lbPlayerName = this._lbPlayerName = new cc.LabelTTF("playerName", "Arial", 15);
            lbPlayerName.setPosition(szContent.width * 0.5, szContent.height * 0.5);
            this.addChild(lbPlayerName);

            // @todo This and hitTest and onEnter and onMouseOverIn/Out seem like common code.
            //       Can we move them into MouseOverEventListener and SpriteClickHandler()?

            //mouse event handler
            this._mouseEventListener = new ef.MouseOverEventListener();
            this._touchEventListener = new ef.SpriteClickHandler();
        },

        onEnter: function () {
            cc.Sprite.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
            if (this._mouseEventListener && !this._mouseEventListener._isRegistered())
                cc.eventManager.addListener(this._mouseEventListener, this);
        },

        hitTest: function (point) {
            return cc.rectContainsPoint(cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        onMouseOverIn: function (mouseData) {
            if (!this._isMouseOverIn) {
                this._isMouseOverIn = true;
            }
        },

        onMouseOverOut: function (mouseData) {
            if (this._isMouseOverIn) {
                this._isMouseOverIn = false;
            }
        },

        setSeatPlayerState: function (roomState, seatState) {
            const tableIsFull = roomIsFull(roomState);
            this._playerInfo = seatState;
            if (seatState && seatState.name) {
                // Shorten really long names
                // Perhaps we could get cocos to truncate the name for us?
                // The maximum length really depends on the size of the chars.  E.g. 'MMMM' is wider than 'llll'
                const nameToShow = shortenedString(seatState.name, 14);
                this.setVisible(true);
                this._spPlayerBase.setVisible(true);
                this._lbPlayerName.setVisible(true);
                this._lbPlayerName.setString(nameToShow);
            } else {
                this.setVisible(tableIsFull);
                this._lbPlayerName.setString('-');
                this._spPlayerBase.setVisible(false);
                this._lbPlayerName.setVisible(false);
            }
            let spriteStr = null;
            if (roomState.roomLockStatus) {
                /*
                 // Display the name of the player who locked this room
                 const fullName = roomState.roomLockStatus.allowedPlayers[0].playerName;
                 const nameToShow = shortenedString(fullName, 14);
                 this.setVisible(true);
                 this._spPlayerBase.setVisible(true);
                 this._lbPlayerName.setVisible(true);
                 this._lbPlayerName.setString(nameToShow);
                 */
                const isLockedByThisPlayer = roomBelongsToCurrentPlayer(roomState);
                if (this._seatNumber === roomState.roomLockStatus.allowedPlayers[0].slot) {
                    this._lbPlayerName.setVisible(true);
                    this._spPlayerBase.setVisible(true);
                    this._lbPlayerName.setString(roomState.roomLockStatus.allowedPlayers[0].playerName);
                } else {
                    this._spPlayerBase.setVisible(false);
                    this._lbPlayerName.setVisible(false);
                }
                if (isLockedByThisPlayer) {
                    this.setVisible(true);
                    spriteStr = "SS_YellowSit.png";
                } else {
                    this.setVisible(true);
                    spriteStr = "SS_BlueSit.png";
                }
            } else {
                spriteStr = "SS_YellowSit.png";
            }
            const spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteStr);
            if (spriteFrame) {
                this.setSpriteFrame(spriteFrame);
            }
        },

        setStatus: function (status) {
            //console.warn(`[TableSeatSprite:setStatus] status=${status}`);
        },

        executeClickCallback: function (touch, event) {
            //console.warn(`[TableSeatSprite:executeClickCallback] touch:`, touch, `event:`, event);
            this._seatSelectedCallback(this._seatNumber);
        },
    });


    // === Library functions === //

    const Object_values = (obj) => Object.keys(obj).map(key => obj[key]);

    function countPlayersInRoom(roomState) {
        return roomState.playersBySlot.filter(p => p != null).length;
    }

    function roomIsFull(roomState) {
        const playerCount = countPlayersInRoom(roomState);
        if (roomState.singlePlay) {
            return playerCount > 0;
        } else {
            return playerCount >= 4;
        }
    }

    function roomBelongsToCurrentPlayer(roomState) {
        const currentPlayerId = ef.gameController.getCurrentPlayer().id;
        return roomState.roomLockStatus && roomState.roomLockStatus.allowedPlayers.some(allowedPlayer => allowedPlayer.playerId === currentPlayerId);
    }

    function getFreeSeatsCount(roomStates) {
        let count = 0;
        roomStates.forEach(roomState => {
            if (!roomIsFull(roomState)) {
                if (roomState.singlePlay) {
                    count++;
                } else {
                    const freeSeatsInRoom = 4 - countPlayersInRoom(roomState);
                    count += freeSeatsInRoom;
                }
            }
        });
        return count;
    }

    function shortenedString(str, maxLen) {
        if (str.length > maxLen) {
            str = str.substring(0, maxLen - 2) + "..";
        }
        return str;
    }

    function getHHMMSSFromSeconds(seconds) {
        const hh = pad2(Math.floor(seconds / 60 / 60));
        const mm = pad2(Math.floor(seconds / 60 % 60));
        const ss = pad2(Math.floor(seconds % 60));
        return hh + ':' + mm + ':' + ss;
    }

    function pad2(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }

})(ef);

