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
    const PlayerViewStaticPrefab = function(gameConfig, slot, isPlayer, changeSeatCallback, lockOnCallback, fishLockStatus){
        this._parent = new cc.Node();
        GameView.addView(this._parent,1);
        this._parent.setPosition(300,300);

        this._fishLockStatus = fishLockStatus;

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

        this._playerName = new cc.LabelTTF(' ', "Arial", 20);
        this._playerName.setAnchorPoint(0,0.5);
        base.addChild(this._playerName,1);

        this._gold = new cc.LabelTTF('', "Arial", 20);
        this._gold.setAnchorPoint(0,0.5);
        base.addChild(this._gold,1);

        function changeSlotCallback(){
            changeSeatCallback(slot);
        }

        this._changeSlotButton = GUIFunctions.createButton(ReferenceName.ChangeSeatButton, ReferenceName.ChangeSeatButtonDown,changeSlotCallback);
        this._changeSlotButton.setPosition(255,55);
        base.addChild(this._changeSlotButton,5);

        this._slotLabel = new cc.LabelTTF('点击换座',"Arial", 20);
        this._slotLabel.setPosition(55,10);
        this._changeSlotButton.addChild(this._slotLabel);

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

        let vector = new cc.p(0,150);

        const LockOnCallback = (state) =>{
            lockOnCallback({state :state, callback: setCallback});
        };

        const setCallback = (state) => {
            if (state) {
                this._lockOnButton.setState(state);
            }else{
                this._lockOnButton.setLook(state);
            }
        };

        let name;
        if (pos[1] > markerPos[1]) {
            name = ReferenceName.LockOnButtonSide;
        }else{
            name = ReferenceName.LockOnButtonBottom;
        }

        this._lockOnButton = new AnimatedButton(name,0.03,true,LockOnCallback);
        this._lockOnButton.getParent().setPosition(-170, 30);
        this._parent.addChild(this._lockOnButton.getParent());

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

        this._lockOnButton.getParent().setRotation(this._parent.getRotation() * -1);

        this._lockOnButton.setVisible(isPlayer);

        this._coinStackManager = new CoinStackManager(this._parent);

        if(isPlayer) {
            this._coinIcon.setVisible(true);
            this.setPlayer(isPlayer);
            this._playerSeatIndicator =  new cc.Sprite(ReferenceName.PlayerSeatIndicator);
            this._parent.addChild(this._playerSeatIndicator,50);
            this._playerSeatIndicator.setPosition(0,-50);
            this._playerSeatIndicator.runAction(new cc.Sequence(new cc.MoveTo(0.5,vector), new cc.Blink(1,3), new cc.MoveTo(0.5,cc.pMult(vector,-1))));
            this._playerSeatIndicator.runAction(new cc.Sequence(new cc.DelayTime(1.5), new cc.FadeOut(0.5)));
        }
    };

    const proto = PlayerViewStaticPrefab.prototype;

    proto.updatePlayerData = function (playerData, playerSlot) {
        let nameToShow = playerData.name;
        if (nameToShow.length > 10) {
            nameToShow = nameToShow.substring(0,8) + "..";
        }
        this._playerName.setString(nameToShow);
        if ( playerData.scoreChange && playerData.scoreChange > 0){
            this.animateCoinStack(playerData.scoreChange);
            playerData.scoreChange = 0;
        }
        let gold = Math.floor(playerData.score).toLocaleString('en-US', {maximumFractionDigits: 2});
        if (gold.length > 10) {
            gold = gold.substring(0,9) + "..";
        }
        this._gold.setString(gold);
        const activatePlayerIcons = this._isPlayer == null || playerData.slot == playerSlot;
        if(activatePlayerIcons){
            this._coinIcon.setVisible(true);
            this.setPlayer(playerData.slot == playerSlot);
        }
    };

    proto.clearPlayerData = function () {
        this._changeSlotButton.setVisible(true);
        this._playerName.setString('');
        this._gold.setString('');
        this._playerIcon.setVisible(false);
        this._otherPlayerIcon.setVisible(false);
        this._coinIcon.setVisible(false);
        this._isPlayer = null;
        this._lockOnButton.setLook(false);
        this._lockOnButton.setVisible(false);
    };

    proto.destroyView = function () {
        GameView.destroyView(this._parent);
    };

    proto.animateCoinStack = function ( increase ) {
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
        this._changeSlotButton.setVisible(false);

        if (this._lockOnButton){
            this._lockOnButton.setVisible(isPlayer);
            if(isPlayer){
                this._lockOnButton.setState(this._fishLockStatus());
            }
        }
    };

    proto.showAwardMedal = function (amount) {
        const coin = new cc.Sprite();
        const awardMedalSequence = new cc.Sequence(GUIFunctions.getAnimation(ReferenceName.AwardEffect, 0.05), new cc.CallFunc(onAwardMedalEffectEnd));
        coin.runAction(awardMedalSequence);
        this._parent.addChild(coin);
        const parent = this._parent;

        const label = new cc.LabelBMFont(amount * this._multiplier, res.InGameLightGoldFontFile);
        label.setScale(0.7 + 0.3/amount.toString().length);
        coin.addChild(label);
        label.setPosition(90,105);

        coin.setPosition(0,200);
        function onAwardMedalEffectEnd(){
            parent.removeChild(coin);
        }
    };

    proto.setMultiplier = function (multiplier) {
        this._multiplier = multiplier;


    };


    return PlayerViewStaticPrefab;
}());
