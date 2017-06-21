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

            //background
            /*
             const bkglayer = new cc.LayerGradient(new cc.Color(0,0,0,0), new cc.Color(0,0,0,0), cc.p(0, -1),
             [{p:0.9, color: new cc.Color(10,105,166,255)},
             {p:1, color: new cc.Color(20,145,224,255)}]
             );
             this.addChild(bkglayer);

             const target = new cc.Sprite("#Caustic_00000.png");
             target.setBlendFunc(cc.ONE, cc.ONE);
             const causticAnimation = GUIFunctions.getAnimation(ReferenceName.LobbyCaustics,0.05);
             target.runAction(causticAnimation.repeatForever());
             target.setPosition(cc.visibleRect.width * 0.5, cc.visibleRect.height * 0.5);
             this.addChild(target);
             */

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
            const spPlayerInfo = new PlayerInfoWidget(playerData);
            this.addChild(spPlayerInfo);
            spPlayerInfo.setPosition(120, cc.visibleRect.top.y - 78);

            //context menu
            const mmContextMenu = new GameFloatingMenu();
            mmContextMenu.setPosition(cc.visibleRect.center.x + 237, cc.visibleRect.top.y - 85);
            this.addChild(mmContextMenu);

            //jackpot panel
            const pnJackpot = new JackpotFloatPanel();
            this.addChild(pnJackpot);
            pnJackpot.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 102);

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
            const pnNotification = new ef.NotificationPanel(400, 32);
            pnNotification.setPosition(cc.visibleRect.center.x + 226, cc.visibleRect.top.y - 218);
            this.addChild(pnNotification);
            pnNotification.showNotification("Hello, this is an Elsa's message for testing notification................");

            this.fetchUpdate();
            this.startUpdateInterval();
        },

        fetchUpdate: function () {
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
        _pnPageIndicator: null,

        _roomStates: null,

        ctor: function (lobbyType, channelType, selectionMadeCallback) {
            cc.Layer.prototype.ctor.call(this);

            this._lobbyType = lobbyType || '1X';
            this._playerChannelType = channelType || '';

            //button
            const btnMultiple = this._btnMultiple = new ef.LayerColorButton("#SSMultiplayerChinese.png", 220, 55);
            this.addChild(btnMultiple);
            btnMultiple.setPosition(12, cc.visibleRect.top.y - 225);
            btnMultiple.setStatus(ef.BUTTONSTATE.SELECTED);
            btnMultiple.setClickHandler(this.tableTypeClick, this);

            const btnSolo = this._btnSolo = new ef.LayerColorButton("#SSSoloChinese.png", 220, 55);
            this.addChild(btnSolo);
            btnSolo.setPosition(233, cc.visibleRect.top.y - 225);
            btnSolo.setStatus(ef.BUTTONSTATE.NORMAL);
            btnSolo.setClickHandler(this.tableTypeClick, this);

            //table panel
            const szTableListBg = new cc.Size(cc.visibleRect.width - 24, cc.visibleRect.height - 265);
            const pnTableListBg = new cc.LayerColor(new cc.Color(0, 0, 0, 140), szTableListBg.width, szTableListBg.height);
            pnTableListBg.setPosition(12, 40);
            this.addChild(pnTableListBg);

            //lobby type
            const spLobbyType = this._createLobbyTypeSprite();
            spLobbyType.setPosition(szTableListBg.width * 0.5, szTableListBg.height - 28);
            pnTableListBg.addChild(spLobbyType);

            //remain seats
            const lbRemainSeats = this._lbRemainSeats = new cc.LabelTTF("", "Arial", 22);
            lbRemainSeats.setAnchorPoint(1, 0.5);
            pnTableListBg.addChild(lbRemainSeats);
            lbRemainSeats.setPosition(szTableListBg.width - 38, szTableListBg.height - 35);

            //express button
            const btnExpress = this._btnExpress = ef.ButtonSprite.createSpriteButton("#SS_YellowButton.png",
                "#SS_YellowHover.png", "#SS_ExpressChinese.png");
            btnExpress.setPosition(90, szTableListBg.height - 35);
            pnTableListBg.addChild(btnExpress);
            const expressButtonClicked = () => {
                const singlePlay = this.getSelectedTableType === TableType.SINGLE;
                selectionMadeCallback({singlePlay});
            };
            btnExpress.setClickHandler(expressButtonClicked, this);

            //onlookers button
            const btnSpectate = this._btnSpectate = new SpectateButton();
            btnSpectate.setPosition(220, szTableListBg.height - 35);
            pnTableListBg.addChild(btnSpectate);

            // @todo We need to make the TableListPanel scrollable somehow

            //table list panel
            const pnTableList = this._pnTableList = new ef.TableListPanel(this._lobbyType, this._tableType, selectionMadeCallback);
            pnTableListBg.addChild(pnTableList);
            pnTableList.setPosition(20, 15);

            //scroll button
            const pnPageIndicator = this._pnPageIndicator = new PageIndicatorPanel();
            this.addChild(pnPageIndicator);
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

                // Count free seats (of correct type)
                const freeSeats = getFreeSeatsCount(roomStatesToShow);
                this._lbRemainSeats.setString("剩余" + String(freeSeats) + "个吉位");

                // Update the state of existing room sprites (and append new sprites if needed)
                this._pnTableList.updateRoomStates(roomStatesToShow);
            }
        },
    });

    const SpectateButton = cc.Sprite.extend({
        _normalName: "SS_BlueButton.png",
        _selectedName: "SS_BlueHover.png",

        _spIcon: null,
        _spTitle: null,

        _touchEventListener: null,

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
        },

        hitTest: function (point) {
            return cc.rectContainsPoint(cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        onEnter: function () {
            cc.Sprite.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
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

        setClickHandler: function (callback, target) {
            this._clickCallback = callback;
            this._clickTarget = target;
        },

        executeClickCallback: function (touch, event) {
            if (this._clickCallback)
                this._clickCallback.call(this._clickTarget, touch, event);
        }
    });

    const PageIndicatorPanel = cc.Layer.extend({
        ctor: function () {
            cc.Layer.prototype.ctor.call(this);

        }
    });

    ef.TableListPanel = cc.Layer.extend({
        _lobbyType: null,
        _tableType: null,
        _selectionMadeCallback: null,

        _tableObjectsArray: null,
        _tableSpritesMap: null,

        _touchEventListener: null,
        _mouseEventListener: null,

        ctor: function (lobbyType, tableType, selectionMadeCallback) {
            cc.Layer.prototype.ctor.call(this);

            this._lobbyType = lobbyType || "1X";
            this._tableType = tableType || TableType.MULTIPLE;
            this._selectionMadeCallback = selectionMadeCallback;

            this._tableObjectsArray = [];
            this._tableSpritesMap = {};

            //const pnLayerColor = new cc.LayerColor(new cc.Color(200, 0, 0, 128));
            //this.addChild(pnLayerColor);

            ////row 1
            //for (let i = 0; i < 4; i++) {
            //    const tableSprite = new ef.TableSprite();
            //    tableSprite.setPosition(157 + i * 328, 310);
            //    this.addChild(tableSprite);
            //}
            //
            ////row 2
            //for (let i = 0; i < 4; i++) {
            //    const tableSprite = new ef.TableSprite();
            //    tableSprite.setPosition(157 + i * 328, 95);
            //    this.addChild(tableSprite);
            //}

            // @todo touch event handler


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
                tableSprite.setTableState(roomState);
            });
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

            //title
            const lbTitle = this._lbTitle = new cc.LabelTTF("018", "Arial", 22);
            this.addChild(lbTitle);
            lbTitle.setPosition(szContent.width * 0.5, szContent.height - 38);

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
            return cc.rectContainsPoint(cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        onMouseOverIn: function (mouseData) {
            if (!this._isMouseOverIn) {
                this._isMouseOverIn = true;
                if (!roomIsFull(this._roomState)) {
                    this._spGlow.setVisible(true);
                }
            }
        },

        onMouseOverOut: function (mouseData) {
            if (this._isMouseOverIn) {
                this._isMouseOverIn = false;
                this._spGlow.setVisible(false);
            }
        },

        setTableState: function (roomState) {
            this._roomState = roomState;

            // We only want to show the room number, so we will remove the '100X-' prefix from the room title
            //const roomTitleForDisplay = roomState.roomTitle;
            const roomTitleForDisplay = roomState.roomTitle.replace(/^[^-]*-/, '');
            this._lbTitle.setString(roomTitleForDisplay);

            // @todo Apply room locked/unlocked state

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
            if (roomIsFull(this._roomState)) {
                // Cannot join this room
                return;
            }
            const roomState = this._roomState;
            joinPrefs = Object.assign({}, joinPrefs, {
                roomId: roomState.roomId,
                serverUrl: 'ws://' + roomState.server.ipAddress,
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
                // @todo Can we get cocos to truncate the name for us?
                // The maximum length really depends on the size of the chars.  E.g. 'MMMM' is wider than 'llll'
                let nameToShow = seatState.name;
                if (nameToShow.length > 14) {
                    nameToShow = nameToShow.substring(0, 12) + "..";
                }
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

    function countPlayersInRoom (roomState) {
        return roomState.playersBySlot.filter(p => p != null).length;
    }

    function roomIsFull (roomState) {
        const playerCount = countPlayersInRoom(roomState);
        if (roomState.singlePlay) {
            return playerCount > 0;
        } else {
            return playerCount >= 4;
        }
    }

    function getFreeSeatsCount (roomStates) {
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

})(ef);

