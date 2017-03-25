/**
 * Created by eugeneseah on 27/10/16.
 */


const PlayerViewStaticPrefab = (function () {
    "use strict";

    const stackValueTriggerPointLow = 1.1;
    const stackValueTriggerPointMedium = 20;
    const stackValueTriggerPointHigh = 300;
    const stackHeightLow = 4;
    const stackHeightMed = 8;
    const stackHeightHigh = 16;
    const PlayerViewStaticPrefab = function(gameConfig, slot, isPlayer, changeSeatCallback){
        // this._slot = slot;
        this._parent = new cc.Node();
        GameView.addView(this._parent,1);
        this._parent.setPosition(300,300);

        const themeData = ThemeDataManager.getThemeDataList("CannonPlatformPositions");

        const base = this._base = new cc.Sprite(ReferenceName.Base);
        this._parent.addChild(base);

        this._coinIcon = new cc.Sprite(ReferenceName.CoinIcon);
        this._coinIcon.setPosition(themeData.CoinIcon[0],themeData.CoinIcon[1]);
        this._coinIcon.setVisible(false);
        base.addChild(this._coinIcon);

        this._playerIcon = new cc.Sprite(ReferenceName.PlayerIcon);
        this._playerIcon.setPosition(themeData.PlayerIcon[0],themeData.PlayerIcon[1]);
        this._playerIcon.setVisible(isPlayer);
        base.addChild(this._playerIcon);

        this._otherPlayerIcon = new cc.Sprite(ReferenceName.OtherPlayerIcon);
        this._otherPlayerIcon.setPosition(themeData.PlayerIcon[0],themeData.PlayerIcon[1]);
        this._otherPlayerIcon.setVisible(false);
        base.addChild(this._otherPlayerIcon);

        const fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = 20;
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;

        this._playerName = new cc.LabelTTF('', fontDef);
        this._playerName.setDimensions(cc.size(themeData.PlayerName[1][0],themeData.PlayerName[1][1]));
        this._playerName.setAnchorPoint(0,0.5);
        base.addChild(this._playerName,1);

        this._gold = new cc.LabelTTF('', fontDef);
        this._gold.setDimensions(cc.size(themeData.Gold[1][0],themeData.Gold[1][1]));
        this._gold.setAnchorPoint(0,0.5);
        base.addChild(this._gold,1);

        const changeSlot = (sender, type) => {
            switch (type) {
                // case ccui.Widget.TOUCH_MOVED:
                //     // console.log(sender);
                //     break;
                // case ccui.Widget.TOUCH_BEGAN:
                //     if (selected) return;
                //     selected = true;
                //     break;
                case ccui.Widget.TOUCH_ENDED:
                    // gameSelected(sender);
                    // console.log(sender);
                    changeSeatCallback(slot);
                // selectedCallBack(sender);
                case ccui.Widget.TOUCH_CANCELED: // fallthrough intended
                    // label.runAction(new cc.ScaleTo(0.01,originalSize));
                    // label.setScale(originalSize);
                    break;
            }
        };
        // this._changeSlotbutton = new ccui.Button(ReferenceName.ChangeSeatButton, ReferenceName.ChangeSeatButtonDown, changeSlot);
        this._changeSlotbutton = new ccui.Button();
        this._changeSlotbutton.setTouchEnabled(true);
        this._changeSlotbutton.loadTextures(ReferenceName.ChangeSeatButton, ReferenceName.ChangeSeatButtonDown, undefined, ccui.Widget.PLIST_TEXTURE);
        this._changeSlotbutton.setPosition(255,55);
        this._changeSlotbutton.addTouchEventListener(changeSlot);
        base.addChild(this._changeSlotbutton,5);

        this._slotLabel = new cc.LabelTTF('点击换座',fontDef);
        this._slotLabel.setPosition(55,10);
        this._changeSlotbutton.addChild(this._slotLabel);

        let pos;
        let markerPos;
        if (gameConfig.isUsingOldCannonPositions) {
            pos = gameConfig.oldCannonPositions[slot];
            markerPos = gameConfig.oldCannonPositions[0];
        }else{
            pos = gameConfig.cannonPositions[slot];
            markerPos = gameConfig.cannonPositions[0]
        }

        this._parent.x = pos[0]+ themeData["Base"][0];
        this._parent.y = pos[1]+ themeData["Base"][1];
        this._gold.x = themeData["Gold"][0][0];
        this._gold.y = themeData["Gold"][0][1];
        this._playerName.x = themeData["PlayerName"][0][0];
        this._playerName.y = themeData["PlayerName"][0][1];

        if (pos[1] > markerPos[1]) {
            this._parent.y = pos[1]+ themeData["Base"][0];
            if (pos[0] > markerPos[0]){
                this._parent.x = pos[0]- themeData["Base"][1];
                this._parent.setRotation(-90);
            }else {
                this._parent.setRotation(90);
                this._parent.x = pos[0]+ themeData["Base"][1];

            }
        }
        this._coinStackManager = new CoinStackManager(this._parent);

        if(isPlayer) {
            this._playerSlot = slot;
            this._coinIcon.setVisible(true);
            this.setPlayer(isPlayer);
        }
    };

    const proto = PlayerViewStaticPrefab.prototype;

    proto.updatePlayerData = function (playerData, playerSlot) {
        let nameToShow = playerData.name;
        if (nameToShow.length > 12) {
            nameToShow = nameToShow.substring(0,10) + "..";
        }
        this._playerName.setString(nameToShow);
        // const goldAmount = parseFloat(this._gold.getString());
        if ( playerData.scoreChange && playerData.scoreChange > 0){
            this.AnimateCoinStack(playerData.scoreChange);
            playerData.scoreChange = 0;
        }
        let gold = Math.floor(playerData.score).toLocaleString('en-US', {maximumFractionDigits: 2});
        if (gold.length > 10) {
            gold = gold.substring(0,9) + "..";
        }

        this._gold.setString(gold);
        GUIFunctions.shrinkNumberString(playerData.score);
        const activatePlayerIcons = this._isPlayer == null || playerData.slot == playerSlot;
        if(activatePlayerIcons){
            this._coinIcon.setVisible(true);
            this.setPlayer(playerData.slot == playerSlot);
        }
        // this._gem.setString(0);
    };

    proto.clearPlayerData = function () {
        this._playerSlot = null;
        this._changeSlotbutton.setVisible(true);
        this._playerName.setString('');
        this._gold.setString('');
        this._playerIcon.setVisible(false);
        this._otherPlayerIcon.setVisible(false);
        this._coinIcon.setVisible(false);
        this._isPlayer = null;
        // this._gem.setString('');
    };

    proto.destroyView = function () {
        GameView.destroyView(this._parent);
    };

    proto.AnimateCoinStack = function ( increase ) {
        if (increase >= stackValueTriggerPointHigh){
            this._coinStackManager.addStack(stackHeightHigh,increase);
        }else if (increase >= stackValueTriggerPointMedium ){
            this._coinStackManager.addStack(stackHeightMed, increase);
        }else{
            this._coinStackManager.addStack(stackHeightLow, increase);
        }
    };

    proto.setPlayer = function (isPlayer) {
        this._isPlayer = isPlayer;
        this._playerIcon.setVisible(isPlayer);
        this._otherPlayerIcon.setVisible(!isPlayer);
        this._changeSlotbutton.setVisible(false);
        // this._cann
    };

    return PlayerViewStaticPrefab;
}());
