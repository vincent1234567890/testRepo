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

(function(ef) {
    ef.TableSelectionScene = cc.Scene.extend({
        _lobbyType: null,
        _pnNotification: null,

        ctor: function (lobbyType, playerData) {
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
            let spBtmBackground = new cc.Sprite(ReferenceName.SeatBackgroundBottom);
            this.addChild(spBtmBackground);
            spBtmBackground.setAnchorPoint(0.5, 0);
            spBtmBackground.setPosition(cc.visibleRect.center.x, cc.visibleRect.bottom.y);

            //back button
            let btnBack = GUIFunctions.createButton(ReferenceName.SeatBackBtn, ReferenceName.SeatBackBtnSelected, function () {
                //back to Lobby
                GameManager.exitToLobby();
            });
            this.addChild(btnBack);
            btnBack.setPosition(50, cc.visibleRect.top.y - 78);

            //info panel
            let spPlayerInfo = new PlayerInfoWidget(playerData);
            this.addChild(spPlayerInfo);
            spPlayerInfo.setPosition(120, cc.visibleRect.top.y - 78);

            //context menu
            let mmContextMenu = new GameFloatingMenu();
            mmContextMenu.setPosition(cc.visibleRect.center.x + 237, cc.visibleRect.top.y - 85);
            this.addChild(mmContextMenu);

            //jackpot panel
            let pnJackpot = new JackpotFloatPanel();
            this.addChild(pnJackpot);
            pnJackpot.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y - 102);

            //table list layer.
            const tableListPanel = new ef.TableListLayer();
            this.addChild(tableListPanel);

            //notification panel.
            const pnNotification = new ef.NotificationPanel(400, 32);
            pnNotification.setPosition(cc.visibleRect.center.x + 226, cc.visibleRect.top.y - 218);
            this.addChild(pnNotification);
            pnNotification.showNotification("Hello, this is an Elsa's message for testing notification................");
        }
    });

    ef.TableListLayer = cc.Layer.extend({
        _lobbyType: null,
        _btnMultiple: null,
        _btnSolo: null,
        _lbRemainSeats: null,
        _tableType: null,

        _btnExpress: null,
        _btnSpectate: null,

        _pnTableList: null,
        _pnPageIndicator: null,

        ctor: function (lobbyType) {
            cc.Layer.prototype.ctor.call(this);

            this._lobbyType = lobbyType || "1X";
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
            const lbRemainSeats = this._lbRemainSeats = new cc.LabelTTF("剩余88个吉位", "Arial", 22);
            lbRemainSeats.setAnchorPoint(1, 0.5);
            pnTableListBg.addChild(lbRemainSeats);
            lbRemainSeats.setPosition(szTableListBg.width - 38, szTableListBg.height - 35);

            //express button
            const btnExpress = this._btnExpress = ef.ButtonSprite.createSpriteButton("#SS_YellowButton.png",
                "#SS_YellowHover.png", "#SS_ExpressChinese.png");
            btnExpress.setPosition(90, szTableListBg.height - 35);
            pnTableListBg.addChild(btnExpress);

            //onlookers button
            const btnSpectate = this._btnSpectate = new SpectateButton();
            btnSpectate.setPosition(220, szTableListBg.height - 35);
            pnTableListBg.addChild(btnSpectate);

            //table list panel
            const pnTableList = this._pnTableList = new ef.TableListPanel(this._lobbyType, this._tableType);
            pnTableListBg.addChild(pnTableList);
            pnTableList.setPosition(20, 15);

            //scroll button
            const pnPageIndicator = this._pnPageIndicator = new PageIndicatorPanel();
            this.addChild(pnPageIndicator);
        },

        tableTypeClick: function (touch, event) {
            const target = event.getCurrentTarget();
            if (target === this._btnMultiple) {
                if (target.getStatus() === ef.BUTTONSTATE.NORMAL) {
                    this._btnMultiple.setStatus(ef.BUTTONSTATE.SELECTED);
                    this._btnSolo.setStatus(ef.BUTTONSTATE.NORMAL);

                    //load the multiple table list
                }
            } else {
                if (target.getStatus() === ef.BUTTONSTATE.NORMAL) {
                    this._btnMultiple.setStatus(ef.BUTTONSTATE.NORMAL);
                    this._btnSolo.setStatus(ef.BUTTONSTATE.SELECTED);

                    //load the solo table list
                }
            }
        },

        _createLobbyTypeSprite: function () {
            if (this._lobbyType === '100X')
                return new cc.Sprite(ReferenceName.Seat100X);
            else if (this._lobbyType === '10X')
                return new cc.Sprite(ReferenceName.Seat10X);
            else
                return new cc.Sprite(ReferenceName.Seat1X);
        },
    });

    let SpectateButton = cc.Sprite.extend({
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

    let PageIndicatorPanel = cc.Layer.extend({
        ctor: function(){
            cc.Layer.prototype.ctor.call(this);

        }
    });

    ef.TableListPanel = cc.Layer.extend({
        _lobbyType: null,
        _tableType: null,

        _tableObjectsArray: null,
        _tableSpritesArray: null,

        _touchEventListener: null,
        _mouseEventListener: null,

        ctor: function(lobbyType, tableType){
            cc.Layer.prototype.ctor.call(this);

            this._lobbyType = lobbyType || "1X";
            this._tableType = tableType || TableType.MULTIPLE;

            this._tableObjectsArray = [];
            this._tableSpritesArray = [];

            //const pnLayerColor = new cc.LayerColor(new cc.Color(200, 0, 0, 128));
            //this.addChild(pnLayerColor);

            //row 1
            for(let i = 0; i < 4; i++){
                const tableSprite = new ef.TableSprite();
                tableSprite.setPosition(157 + i * 328, 310);
                this.addChild(tableSprite);
            }

            //row 2
            for(let i = 0; i < 4; i++){
                const tableSprite = new ef.TableSprite();
                tableSprite.setPosition(157 + i * 328, 95);
                this.addChild(tableSprite);
            }

            //touch event handler


        },

        setLobbyType: function(lobbyType){
            this._lobbyType = lobbyType;
        },

        setTableType: function(tableType){
            this._tableType = tableType;
        }
    });

    ef.TableSprite = cc.Sprite.extend({
        //SS_Table.png
        _tableObj: null,
        _spGlow: null,
        _lbTitle: null,
        _lbReserveTime: null,

        _spSeat1: null,
        _spSeat2: null,
        _spSeat3: null,
        _spSeat4: null,

        _tableStatus: null,
        _selectStatus: null,

        _isMouseOverIn: null,
        _mouseEventListener: null,
        _touchEventListener: null,

        ctor: function(tableObj){
            cc.Sprite.prototype.ctor.call(this, "#SS_Table.png");

            this._tableObj = tableObj;

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

            //seat1
            const spSeat1 = this._spSeat1 = new ef.TableSeatSprite();
            spSeat1.setPosition(91, 40);
            this.addChild(spSeat1);

            //seat2
            const spSeat2 = this._spSeat2 = new ef.TableSeatSprite();
            spSeat2.setPosition(189, 40);
            this.addChild(spSeat2);

            //seat3
            const spSeat3 = this._spSeat3 = new ef.TableSeatSprite();
            spSeat3.setPosition(36, 105);
            this.addChild(spSeat3);

            //seat4
            const spSeat4 = this._spSeat4 = new ef.TableSeatSprite();
            spSeat4.setPosition(250, 105);
            this.addChild(spSeat4);

            //reserve time.


            this._isMouseOverIn = false;

            //mouse event handler
            this._mouseEventListener = new ef.MouseOverEventListener();
            this._touchEventListener = new ef.SpriteClickHandler();
        },

        onEnter: function(){
            cc.Sprite.prototype.onEnter.call(this);
            if (this._touchEventListener && !this._touchEventListener._isRegistered())
                cc.eventManager.addListener(this._touchEventListener, this);
            if (this._mouseEventListener && !this._mouseEventListener._isRegistered())
                cc.eventManager.addListener(this._mouseEventListener, this);
        },

        setStatus: function(status){

        },

        hitTest: function(point){
            return cc.rectContainsPoint(cc.rect(0, 0, this._contentSize.width, this._contentSize.height),
                this.convertToNodeSpace(point));
        },

        executeClickCallback: function(touch, event){

        },

        onMouseOverIn: function(mouseData){
            if(!this._isMouseOverIn){
                this._isMouseOverIn = true;
                this._spGlow.setVisible(true);
            }
        },

        onMouseOverOut: function(mouseData){
            if(this._isMouseOverIn){
                this._isMouseOverIn = false;
                this._spGlow.setVisible(false);
            }
        }
    });

    ef.TableSeatSprite = cc.Sprite.extend({
        _spPlayerBase: null,
        _lbPlayerName: null,

        _playerInfo: null,

        _seatStatus: null,

        ctor: function(playerInfo){
            //SS_YellowSit,  SS_BlueSit
            cc.Sprite.prototype.ctor.call(this, "#SS_YellowSit.png");

            this._playerInfo = playerInfo;

            const szContent = this._contentSize;
            //SS_NameBase
            const spPlayerBase = this._spPlayerBase = new cc.Sprite("#SS_NameBase.png");
            spPlayerBase.setPosition(szContent.width * 0.5, szContent.height * 0.5);
            this.addChild(spPlayerBase);

            const lbPlayerName = this._lbPlayerName = new cc.LabelTTF("playerName", "Arial", 15);
            lbPlayerName.setPosition(szContent.width * 0.5, szContent.height * 0.5);
            this.addChild(lbPlayerName);
        },

        setSeatStatus: function(seatStatus){

        }
    });

})(ef);

