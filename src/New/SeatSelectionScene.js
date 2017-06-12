let SeatSelectionScene = cc.Scene.extend({
    _lobbyType: null,
    ctor: function(lobbyType, playerData){
        cc.Scene.prototype.ctor.call(this);

        this._lobbyType = lobbyType || '1X';

        cc.spriteFrameCache.addSpriteFrames(res.LobbyUI2Plist);
        cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        cc.spriteFrameCache.addSpriteFrames(res.SeatSelectionPlist);

        //background
        let spBackground = new cc.Sprite(ReferenceName.LobbyBackground);
        this.addChild(spBackground);
        spBackground.setAnchorPoint(0.5, 1);
        spBackground.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y);
        let spBtmBackground = new cc.Sprite(ReferenceName.SeatBackgroundBottom);
        this.addChild(spBtmBackground);
        spBtmBackground.setAnchorPoint(0.5, 0);
        spBtmBackground.setPosition(cc.visibleRect.center.x, cc.visibleRect.bottom.y);

        //back button
        let btnBack = GUIFunctions.createButton(ReferenceName.SeatBackBtn, ReferenceName.SeatBackBtnSelected, function(){
            //back to Lobby
            //GameManager.goToLobby();
            GameManager.exitToLobby();
        });
        this.addChild(btnBack);
        btnBack.setPosition(50, cc.visibleRect.top.y - 78);

        //info panel
        let spPlayerInfo = new PlayerInfoWidget(playerData);
        this.addChild(spPlayerInfo);
        spPlayerInfo.setPosition(120, cc.visibleRect.top.y - 78);

        //context menu
        //let mmContextMenu = new GameFloatingMenu();
        //mmContextMenu.setPosition(cc.visibleRect.center.x + 337, cc.visibleRect.top.y - 85);
        //this.addChild(mmContextMenu);

        //jackpot panel
        let pnJackpot = new JackpotFloatPanel();
        this.addChild(pnJackpot);
        pnJackpot.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 102);

        //title
        let spNotificationBar = new cc.Sprite(ReferenceName.SeatNotificationBar);
        this.addChild(spNotificationBar);
        spNotificationBar.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 268);
        let spLobbyType = this._createLobbyTypeSprite();
        spNotificationBar.addChild(spLobbyType);
        let notificationSize = spNotificationBar.getContentSize();
        spLobbyType.setPosition(notificationSize.width * 0.5, notificationSize.height * 0.5);

        //multiple
        let pnMultipleTable = new TableSeatPanel(this._lobbyType, TableType.MULTIPLE);
        pnMultipleTable.setPosition(0, 0);
        this.addChild(pnMultipleTable);

        //solo
        let pnSoleTable = new TableSeatPanel(this._lobbyType, TableType.SINGLE);
        pnSoleTable.setPosition(cc.visibleRect.center.x, 0);
        this.addChild(pnSoleTable);
    },

    onEnter: function(){
        cc.Scene.prototype.onEnter.call(this);
        cc.audioEngine.playMusic(res.LobbyBGM, true);
    },

    //onExit: function(){
    //    cc.Scene.prototype.onExit.call(this);
        //cc.audioEngine.stopMusic(false);
    //},

    _createLobbyTypeSprite: function() {
        if (this._lobbyType === '100X')
            return new cc.Sprite(ReferenceName.Seat100X);
        else if (this._lobbyType === '10X')
            return new cc.Sprite(ReferenceName.Seat10X);
        else
            return new cc.Sprite(ReferenceName.Seat1X);
    },

    cleanup: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.SeatSelectionPlist);

        cc.Scene.prototype.cleanup.call(this);
    }
});

const TableSeatPanel = cc.Layer.extend({
    _lobbyType: null,
    _tableType: null,
    _spSeatLeft: null,
    _spSeatBtmLeft: null,
    _spSeatBtmRight: null,
    _spSeatRight: null,

    ctor: function(lobbyType, tableType){
        cc.Layer.prototype.ctor.call(this);
        this._className = "TableSeatPanel";
        this._lobbyType = lobbyType;
        this._tableType = tableType || TableType.MULTIPLE;

        //type title
        let spWood = new cc.Sprite(ReferenceName.SeatWoodBackground);
        this.addChild(spWood);
        spWood.setPosition(348, 395);
        let woodSize = spWood.getContentSize();
        let spTitle = this._createTitleByType();
        spWood.addChild(spTitle);
        spTitle.setPosition(woodSize.width * 0.5, woodSize.height * 0.5);

        //seat Left
        let spSeatLeft = this._spSeatLeft = new SeatSprite();
        spSeatLeft.setSeatPosition(SeatPosition.LEFT);
        spSeatLeft.setPosition(72, 195);
        spSeatLeft.setTableType(this._tableType);
        this.addChild(spSeatLeft);

        //seat right
        let spSeatRight = this._spSeatRight = new SeatSprite();
        spSeatRight.setSeatPosition(SeatPosition.RIGHT);
        spSeatRight.setPosition(596, 195);
        spSeatRight.setTableType(this._tableType);
        this.addChild(spSeatRight);

        //table
        let spTable = new TableSprite(this._tableType);
        spTable.setPosition(348, 158);
        this.addChild(spTable);

        //seat Bottom Left
        let spSeatBtmLeft = this._spSeatBtmLeft = new SeatSprite();
        spSeatBtmLeft.setSeatPosition(SeatPosition.BOTTOM_LEFT);
        spSeatBtmLeft.setPosition(230, 60);
        spSeatBtmLeft.setTableType(this._tableType);
        this.addChild(spSeatBtmLeft);

        //seat Bottom Right
        let spSeatBtmRight = this._spSeatBtmRight = new SeatSprite();
        spSeatBtmRight.setSeatPosition(SeatPosition.BOTTOM_RIGHT);
        spSeatBtmRight.setPosition(450, 60);
        spSeatBtmRight.setTableType(this._tableType);
        this.addChild(spSeatBtmRight);

        if(this._tableType === TableType.SINGLE){
            spSeatLeft.setPositionX(99);
            spSeatRight.setPositionX(625);
        }
    },

    _createTitleByType: function() {
        return new cc.Sprite(
            this._tableType === TableType.MULTIPLE ? ReferenceName.SeatMultiPlayerChinese : ReferenceName.SeatSoloChinese);
    }
});

let TableSprite = cc.Sprite.extend({
    _tableType: null,
    _touchEventListener: null,
    _mouseEventListener: null,
    _spTablePicture: null,
    _spGlow: null,
    isMouseDown: false,

    ctor: function(tableType) {
        cc.Sprite.prototype.ctor.call(this, ReferenceName.SeatTable);
        this._tableType = tableType;

        const spTablePicture = this._spTablePicture = this._createTablePicture();
        this.addChild(spTablePicture);

        const spGlow = this._spGlow = new cc.Sprite("#SSTableGlow.png");
        this.addChild(spGlow);
        spGlow.setVisible(false);

        if (this._tableType === TableType.SINGLE) {
            spTablePicture.setPosition(325, 348);
            spGlow.setPosition(321, 297);
            this.setFlippedX(true);
            spGlow.setFlippedX(true)
        } else {
            spTablePicture.setPosition(292, 348);
            spGlow.setPosition(292, 297);
        }

        this._touchEventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                const target = event.getCurrentTarget(), parent = target.getParent();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    parent._showSelectedStatus();
                    return true;
                }
                return false;
            },

            onTouchMoved: function(touch, event){
                let target = event.getCurrentTarget(), parent = target.getParent();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    if(!parent._spGlow.isVisible())
                        parent._showSelectedStatus();
                } else {
                    if(parent._spGlow.isVisible())
                        parent._hideSelectedStatus();
                }
            },

            onTouchEnded: function (touch, event) {
                let target = event.getCurrentTarget(), parent = target.getParent();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    GameManager.seatSelected(parent.getTableType());
                }
                parent._hideSelectedStatus();
            }
        });

        this._mouseEventListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(mouseData){
                let target = mouseData.getCurrentTarget().getParent();
                target.isMouseDown = true;
            },
            onMouseMove: function(mouseData){
                let target = mouseData.getCurrentTarget(), parent = target.getParent();
                if (!target.isMouseDown){
                    if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                            target.convertToNodeSpace(mouseData.getLocation()))) {
                        if(!parent._spGlow.isVisible())
                            parent._showSelectedStatus();
                        return;
                    }
                }
                if(parent._spGlow.isVisible())
                    parent._hideSelectedStatus();
            },
            onMouseUp: function(mouseData){
                let target = mouseData.getCurrentTarget().getParent();
                target.isMouseDown = false;
            }
        });
    },

    getTableType: function(){
        return this._tableType;
    },

    _createTablePicture: function(){
        return new cc.Sprite(
            this._tableType === TableType.MULTIPLE? ReferenceName.SeatMultiPlayerPic: ReferenceName.SeatSoloPic);
    },

    onEnter: function(){
        cc.Sprite.prototype.onEnter.call(this);
        if (this._touchEventListener && !this._touchEventListener._isRegistered())
            cc.eventManager.addListener(this._touchEventListener, this._spTablePicture);
        if (this._mouseEventListener && !this._mouseEventListener._isRegistered())
            cc.eventManager.addListener(this._mouseEventListener, this._spTablePicture);
    },

    _showSelectedStatus: function(){
        this._spGlow.stopAllActions();
        this._spGlow.setVisible(true);
        this._spGlow.setOpacity(0);
        this._spGlow.runAction(cc.fadeIn(0.3))
    },

    _hideSelectedStatus: function(){
        this._spGlow.stopAllActions();
        this._spGlow.runAction(cc.sequence(cc.fadeOut(0.3), cc.hide()));
    }
});

let SeatSprite = cc.Sprite.extend({
    _seatPosition: null,
    _tableType: null,
    _LobbyType: null,
    _spGlow: null,
    _spArrow: null,
    _eventListener: null,
    _mouseEventListener: null,
    isMouseDown: false,

    ctor: function(){
        cc.Sprite.prototype.ctor.call(this, ReferenceName.SeatChair);
        this._className = "SeatSprite";

        let spSeatGlow = this._spGlow = new cc.Sprite(ReferenceName.SeatChairGlow);
        this.addChild(spSeatGlow, -1);
        spSeatGlow.setPosition(66, 59);
        spSeatGlow.setVisible(false);

        let spArrow = this._spArrow = new cc.Sprite(ReferenceName.SeatArrow);
        this.addChild(spArrow);
        spArrow.setPosition(63, 125);  //125,140
        spArrow.setVisible(false);

        this._eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    target._showSelectedStatus();
                    return true;
                }
                return false;
            },

            onTouchMoved: function(touch, event){
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    if(!target._spGlow.isVisible())
                        target._showSelectedStatus();
                } else {
                    if(target._spGlow.isVisible())
                        target._hideSelectedStatus();
                }
            },

            onTouchEnded: function (touch, event) {
                let target = event.getCurrentTarget();

                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    cc.audioEngine.playEffect(res.MenuButtonPressSound);
                    GameManager.seatSelected(target.getTableType(), target.getSeatPosition());
                }
                target._hideSelectedStatus();
            }
        });

        this._mouseEventListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(mouseData){
                let target = mouseData.getCurrentTarget();
                target.isMouseDown = true;
            },
            onMouseMove: function(mouseData){
                let target = mouseData.getCurrentTarget();
                if (!target.isMouseDown){
                    if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                            target.convertToNodeSpace(mouseData.getLocation()))) {
                        //scale to 1.2
                        if(!target._spGlow.isVisible())
                            target._showSelectedStatus();
                        return;
                    }
                }
                //scale to 1.0
                if(target._spGlow.isVisible())
                    target._hideSelectedStatus();
            },
            onMouseUp: function(mouseData){
                let target = mouseData.getCurrentTarget();
                target.isMouseDown = false;
            }
        });
    },

    _showSelectedStatus: function(){
        let spArrow = this._spArrow;
        spArrow.stopAllActions();
        spArrow.setVisible(true);
        spArrow.setOpacity(255);
        spArrow.setPosition(63, 125);
        spArrow.runAction(cc.sequence(
            cc.moveTo(0.3, 63, 140).easing(cc.easeBounceIn()), cc.delayTime(0.2),
            cc.moveTo(0.3, 63, 125).easing(cc.easeBounceOut()), cc.delayTime(0.1)).repeatForever());

        this._spGlow.stopAllActions();
        this._spGlow.setVisible(true);
        this._spGlow.setOpacity(255);
    },

    _hideSelectedStatus: function(){
        let spArrow = this._spArrow;
        spArrow.stopAllActions();
        spArrow.runAction(cc.sequence(cc.fadeOut(0.2), cc.hide()));
        this._spGlow.stopAllActions();
        this._spGlow.runAction(cc.sequence(cc.fadeOut(0.2), cc.hide()));
    },

    onEnter: function(){
        cc.Sprite.prototype.onEnter.call(this);
        if (this._eventListener && !this._eventListener._isRegistered())
            cc.eventManager.addListener(this._eventListener, this);
        if (this._mouseEventListener && !this._mouseEventListener._isRegistered())
            cc.eventManager.addListener(this._mouseEventListener, this);
    },

    setSeatPosition: function(position){
        this._seatPosition = position;
    },

    getSeatPosition: function(){
        return this._seatPosition;
    },

    setTableType: function(tableType){
        this._tableType = tableType;
    },

    getTableType: function(){
        return this._tableType;
    },

    setLobbyType: function(lobbyType){
        this._LobbyType = lobbyType;
    },

    getLobbyType: function(){
        return this._LobbyType;
    }
});

