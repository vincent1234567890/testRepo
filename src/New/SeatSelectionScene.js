var SeatSelectionScene = cc.Scene.extend({
    _lobbyType: null,
    ctor: function(lobbyType){
        cc.Scene.prototype.ctor.call(this);

        this._lobbyType = lobbyType || 1;

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
            console.log("click button");
        });
        this.addChild(btnBack);
        btnBack.setPosition(50, cc.visibleRect.top.y - 60);

        //info panel

        //context menu

        //jackpot panel

        //title
        let spNotificationBar = new cc.Sprite(ReferenceName.SeatNotificationBar);
        this.addChild(spNotificationBar);
        spNotificationBar.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 268);
        let spLobbyType = this._createLobbyTypeSprite();
        spNotificationBar.addChild(spLobbyType);
        let notificationSize = spNotificationBar.getContentSize();
        spLobbyType.setPosition(notificationSize.width * 0.5, notificationSize.height * 0.5);

        //multiple
        let pnMultipleTable = new TableSeatPanel(TableType.MULTIPLE);
        pnMultipleTable.setPosition(0, 0);
        this.addChild(pnMultipleTable);

        //solo
        let pnSoleTable = new TableSeatPanel(TableType.SINGLE);
        pnSoleTable.setPosition(cc.visibleRect.center.x, 0);
        this.addChild(pnSoleTable);
    },

    _createLobbyTypeSprite: function() {
        if (this._lobbyType === 100)
            return new cc.Sprite(ReferenceName.Seat100X);
        else if (this._lobbyType === 10)
            return new cc.Sprite(ReferenceName.Seat10X);
        else
            return new cc.Sprite(ReferenceName.Seat1X);
    },

    cleanup: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.SeatSelectionPlist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.LobbyUIPlist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.LobbyUI2Plist);

        cc.Scene.prototype.cleanup.call(this);
    }
});

const TableSeatPanel = cc.Layer.extend({
    _tableType: null,
    _spSeatLeft: null,
    _spSeatBtmLeft: null,
    _spSeatBtmRight: null,
    _spSeatRight: null,

    ctor: function(tableType){
        cc.Layer.prototype.ctor.call(this);
        this._tableType = tableType || TableType.MULTIPLE;
        this._className = "TableSeatPanel";

        //type title
        let spWood = new cc.Sprite(ReferenceName.SeatWoodBackground);
        this.addChild(spWood);
        spWood.setPosition(348, 395);
        let woodSize = spWood.getContentSize();
        let spTitle = this._createTitleByType();
        spWood.addChild(spTitle);
        spTitle.setPosition(woodSize.width * 0.5, woodSize.height * 0.5);

        //seat Left
        let spSeatLeft = this._spSeatLeft = new SeatSprite(ReferenceName.SeatChair);
        spSeatLeft.setSeatPosition(SeatPosition.LEFT);
        spSeatLeft.setPosition(72, 195);
        spSeatLeft.setTableType(this._tableType);
        this.addChild(spSeatLeft);

        //seat right
        let spSeatRight = this._spSeatRight = new SeatSprite(ReferenceName.SeatChair);
        spSeatRight.setSeatPosition(SeatPosition.RIGHT);
        spSeatRight.setPosition(596, 195);
        spSeatRight.setTableType(this._tableType);
        this.addChild(spSeatRight);

        //table
        let spTable = new cc.Sprite(ReferenceName.SeatTable);
        spTable.setPosition(348, 158);
        this.addChild(spTable);
        let spTablePicture = this._createTablePicture();
        spTable.addChild(spTablePicture);
        spTablePicture.setPosition(292, 348);

        //seat Bottom Left
        let spSeatBtmLeft = this._spSeatBtmLeft = new SeatSprite(ReferenceName.SeatChair);
        spSeatBtmLeft.setSeatPosition(SeatPosition.BOTTOM_LEFT);
        spSeatBtmLeft.setPosition(230, 60);
        spSeatBtmLeft.setTableType(this._tableType);
        this.addChild(spSeatBtmLeft);

        //seat Bottom Right
        let spSeatBtmRight = this._spSeatBtmRight = new SeatSprite(ReferenceName.SeatChair);
        spSeatBtmRight.setSeatPosition(SeatPosition.BOTTOM_RIGHT);
        spSeatBtmRight.setPosition(450, 60);
        spSeatBtmRight.setTableType(this._tableType);
        this.addChild(spSeatBtmRight);

        if(this._tableType === TableType.SINGLE){
            spTable.setFlippedX(true);
            spTablePicture.setPosition(325, 348);
            spSeatLeft.setPositionX(99);
            spSeatRight.setPositionX(625);
        }
    },

    _createTablePicture: function(){
        return new cc.Sprite(
            this._tableType === TableType.MULTIPLE? ReferenceName.SeatMultiPlayerPic: ReferenceName.SeatSoloPic);
    },

    _createTitleByType: function() {
        return new cc.Sprite(
            this._tableType === TableType.MULTIPLE ? ReferenceName.SeatMultiPlayerChinese : ReferenceName.SeatSoloChinese);
    }
});

var SeatSprite = cc.Sprite.extend({
    _seatPosition: null,
    _spGlow: null,
    _spArrow: null,
    _eventListener: null,

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

                } else {

                }
            },

            onTouchEnded: function (touch, event) {
                let target = event.getCurrentTarget();
                target._hideSelectedStatus();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {

                } else {

                }
            }
        });
    },

    _showSelectedStatus: function(){
        let spArrow = this._spArrow;
        spArrow.setVisible(true);
        spArrow.setPosition(63, 125);
        spArrow.runAction(cc.sequence(
            cc.moveTo(0.3, 63, 140).easing(cc.easeBounceIn()), cc.delayTime(0.2),
            cc.moveTo(0.3, 63, 125).easing(cc.easeBounceOut()), cc.delayTime(0.1)).repeatForever());
        this._spGlow.setVisible(true);
    },

    _hideSelectedStatus: function(){
        let spArrow = this._spArrow;
        spArrow.stopAllActions();
        spArrow.setVisible(false);
        this._spGlow.setVisible(false);
    },

    onEnter: function(){
        cc.Sprite.prototype.onEnter.call(this);
        if (this._eventListener && !this._eventListener._isRegistered())
            cc.eventManager.addListener(this._eventListener, this);
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
    }
});

const SeatPosition = {
    LEFT: 0,
    BOTTOM_LEFT: 1,
    BOTTOM_RIGHT: 2,
    RIGHT: 3
};

const TableType = {
    MULTIPLE: 0,    //多人
    SINGLE: 1       //包桌
};