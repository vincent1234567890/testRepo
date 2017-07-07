//Player static component.
const PlayerViewStaticPrefab = (function () {
    "use strict";

    //玩家信息组件
    const stackValueTriggerPointLow = 1.1;
    const stackValueTriggerPointMedium = 20;
    const stackValueTriggerPointHigh = 300;
    const stackHeightLow = 4;
    const stackHeightMed = 8;
    const stackHeightHigh = 16;

    /**
     * Player view static information panel
     * @param {Object} gameConfig
     * @param {Number} slot  Seat position
     * @param {Boolean} isPlayer is current player
     * @param {function} changeSeatCallback the callback when Player change seat.
     * @param {function} lockOnCallback lock/release button callback.
     * @param {function} fishLockStatus get fish lock status.
     * @constructor
     */
    const PlayerViewStaticPrefab = function(gameConfig, slot, isPlayer, changeSeatCallback, lockOnCallback, fishLockStatus){
        this._parent = new cc.Node();
        GameView.addView(this._parent,1);
        this._parent.setPosition(300,300);
        if(isPlayer)
            ef.gameController.setCurrentSeat(slot);

        this._fishLockStatus = fishLockStatus;

        const themeData = ThemeDataManager.getThemeDataList("CannonPlatformPositions");

        const base = new cc.Sprite(ReferenceName.Base);  //base sprite
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

        this._playerName = new cc.LabelTTF(' ', "Arial", 20);   //player name
        this._playerName.setAnchorPoint(0,0.5);
        base.addChild(this._playerName,1);

        this._gold = new cc.LabelTTF('', "Arial", 20);   //player credit
        this._gold.setAnchorPoint(0,0.5);
        base.addChild(this._gold,1);

        function changeSlotCallback(){
            ef.gameController.setCurrentSeat(slot);
            changeSeatCallback(slot);
        }

        this._changeSlotButton = GUIFunctions.createButton(ReferenceName.ChangeSeatButton,
            ReferenceName.ChangeSeatButtonDown, changeSlotCallback, res.ChangeSeatButtonPressedSound);
        this._changeSlotButton.setPosition(255, 55);
        base.addChild(this._changeSlotButton, 5);

        this._slotLabel = new cc.LabelTTF('点击换座', "Arial", 20);
        this._slotLabel.setPosition(55, 10);
        this._changeSlotButton.addChild(this._slotLabel);

        this._changeSlotButton.setVisible(GameManager.isPlayer);

        let pos;
        let markerPos;   //the direction determine by position.
        if (gameConfig.isUsingOldCannonPositions) {
            pos = gameConfig.oldCannonPositions[slot];
            markerPos = gameConfig.oldCannonPositions[0];
        }else{
            pos = gameConfig.cannonPositions[slot];
            markerPos = gameConfig.cannonPositions[0]
        }

        //should we change this position on server?
        this._parent.x = pos[0]+ themeData["Base"][0];
        this._parent.y = pos[1]+ themeData["Base"][1];
        this._gold.x = themeData["Gold"][0][0];
        this._gold.y = themeData["Gold"][0][1];
        this._playerName.x = themeData["PlayerName"][0][0];
        this._playerName.y = themeData["PlayerName"][0][1];

        let vector = new cc.p(0,150);
        const LockOnCallback = (state) =>{   //state => bool, true: locked, false: release
            lockOnCallback({state :state, callback: setCallback});
        };

        const setCallback = (state) => {
            if (state) {
                this._lockOnButton.switchToLocked();
            }else{
                this._lockOnButton.switchTargetRelease();  //only user click release.
            }
        };

        let direction;
        if (pos[1] > markerPos[1]) {
            this._parent.y = pos[1]+ themeData["Base"][0];
            if (pos[0] > markerPos[0]){
                this._parent.x = pos[0]- themeData["Base"][1];
                this._parent.setRotation(-90);
                direction = PlayerSeatDirection.VERTICAL;
            }else {
                this._parent.setRotation(90);
                this._parent.x = pos[0]+ themeData["Base"][1];
                direction = PlayerSeatDirection.DW_VERTICAL;
            }
        }else{
            direction = PlayerSeatDirection.HORIZONTAL;
        }

        const lockButton = this._lockOnButton = new LockFishButton(direction, LockOnCallback);
        lockButton.setPosition(-170, 30);
        this._parent.addChild(this._lockOnButton);

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
        let gold = playerData.score.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
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

    proto.setPlayerLockStatus = function (lockStatus) {
        this._lockOnButton.setLockStatusTo(lockStatus);
    };

    proto.clearPlayerData = function () {
        this._changeSlotButton.setVisible(GameManager.isPlayer);
        this._playerName.setString('');
        this._gold.setString('');
        this._playerIcon.setVisible(false);
        this._otherPlayerIcon.setVisible(false);
        this._coinIcon.setVisible(false);
        this._isPlayer = null;
        // We don't call switchToRelease() because that is asynchronous (it performs actions after animation)
        // setLockStatusToRelease() is immediate
        this._lockOnButton.setLockStatusToRelease();
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
            if (isPlayer) {
                this._lockOnButton.setLockSprites(ef.gameController.getLockMode());
            }
        }
    };

    proto.showAwardMedal = function (type, amount) {
        const parentNode = new cc.Node();
        const coin = new cc.Sprite();
        const awardMedalSequence = new cc.Sequence(
            GUIFunctions.getAnimation(ReferenceName.AwardEffect, 0.05), new cc.CallFunc(onAwardMedalEffectEnd));
        coin.runAction(awardMedalSequence);
        this._parent.addChild(parentNode);
        const parent = this._parent, strAmount = (amount * this._multiplier).toLocaleString('en-US', {maximumFractionDigits: 2});

        const label = new cc.LabelBMFont(strAmount, res.InGameLightGoldFontFile);
        label.setScale(0.7 + 0.3/amount.toString().length);
        parentNode.addChild(coin);
        parentNode.addChild(label,1);

        label.setPosition(0,215);
        coin.setPosition(0,200);

        console.log("#" + type + "NameChinese");

        const fishName = new cc.Sprite("#" + type + "NameChinese.png");
        parentNode.addChild(fishName);
        fishName.setPosition(0,158);

        function onAwardMedalEffectEnd(){
            parent.removeChild(parentNode);
        }
    };

    proto.setMultiplier = function (multiplier) {
        this._multiplier = multiplier;
    };

    return PlayerViewStaticPrefab;
}());


let LockFishButton = cc.Sprite.extend({
    _lockStatus: null,
    _direction: null,

    _spCircle: null,
    _spIcon: null,
    _spLabel: null,

    _lockCallback: null,
    _touchEventListener: null,

    ctor: function(direction, lockCallback) {
        let sfLockBase = cc.spriteFrameCache.getSpriteFrame("LOBase.png");
        if (!sfLockBase) {
            cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
            sfLockBase = cc.spriteFrameCache.getSpriteFrame("LOBase.png");
        }
        cc.Sprite.prototype.ctor.call(this, sfLockBase);

        this._lockStatus = ef.gameController.getLockMode();
        this._direction = direction || PlayerSeatDirection.HORIZONTAL;
        this._lockCallback = lockCallback;

        const szContentSize = this.getContentSize();

        let spLabel;
        const spCircle = this._spCircle = new cc.Sprite("#LOCircle.png");
        spCircle.setPosition(22, szContentSize.height * 0.5);
        this.addChild(spCircle, 3);

        const spIcon = this._spIcon = new cc.Sprite("#LOIconWhite.png");
        spIcon.setPosition(26,18);
        spCircle.addChild(spIcon);
        if (this._direction === PlayerSeatDirection.HORIZONTAL) {
            spLabel = this._spLabel = new cc.Sprite("#LOLockWhiteH.png");
            spLabel.setPosition(szContentSize.width * 0.5, szContentSize.height * 0.5);
            this.addChild(spLabel, 1);
        } else {
            //this.setRotation(90);
            spLabel = this._spLabel = new cc.Sprite("#LOLockWhiteV.png");
            spLabel.setPosition(szContentSize.width * 0.5, szContentSize.height * 0.5);
            spLabel.setRotation(this._direction === PlayerSeatDirection.DW_VERTICAL ? -90 : 90);
            this.addChild(spLabel, 1);
        }

        //touch event listener
        this._touchEventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                const target = event.getCurrentTarget();
                return (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                    target.convertToNodeSpace(touch.getLocation())));
            },

            onTouchEnded: function(touch, event){
                const target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    target.switchStatus();
                }
            }
        });
    },

    switchStatus: function() {
        // @todo Changing state after a timeout (when these animations complete) can be complicated:
        // - What if the player changes seat before the animation completes?  Will we be setting the correct view?
        // - After the timeout, should we set the _current_player_ view, instead of this view?  (This view might be for the old seat.)
        // - What if we receive a server message "Target lock off" before the animation completes?  Will we be setting the wrong state at the end of the animation?
        // Increase duration to test these edge cases.

        const status = this._lockStatus, contentSize = this.getContentSize(), duration = 0.3, lockCallback = this._lockCallback;
        this._lockStatus = LockFishStatus.SWITCHING;
        if (status === LockFishStatus.RELEASE) {
            if(lockCallback)
                lockCallback(true);
            this._touchEventListener.setEnabled(false);
            this._spCircle.runAction(cc.moveTo(duration, contentSize.width - 22, contentSize.height * 0.5));

            // Is it really necessary to set the sprite at this moment?  Can we just leave it on what it was?
            if (this._direction === PlayerSeatDirection.HORIZONTAL) {
                this._spLabel.setSpriteFrame("LOLockGreenH.png");
            } else {
                this._spLabel.setSpriteFrame("LOLockGreenV.png");
            }

            this.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function(){
                this._touchEventListener.setEnabled(true);
                this.setLockStatusToLock();
            }, this)));
        } else if (status === LockFishStatus.LOCK || status === LockFishStatus.LOCKED) {
            if(lockCallback)
                lockCallback(false);
            this._touchEventListener.setEnabled(false);
            this._spCircle.runAction(cc.moveTo(duration, 22, contentSize.height * 0.5));

            // Is it really necessary to set the sprite at this moment?  Can we just leave it on what it was?
            if (this._direction === PlayerSeatDirection.HORIZONTAL) {
                this._spLabel.setSpriteFrame("LOReleaseGreenH.png");
            } else {
                this._spLabel.setSpriteFrame("LOReleaseGreenV.png");
            }

            this.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function(){
                this._touchEventListener.setEnabled(true);
                this.setLockStatusToRelease();
            }, this)));
        }
    },

    switchToRelease: function(){
        if(this._lockStatus === LockFishStatus.LOCK || this._lockStatus === LockFishStatus.LOCKED){
            this._lockStatus = LockFishStatus.SWITCHING;
            const szContent = this.getContentSize(), duration = 0.3;
            this._spIcon.setSpriteFrame("LOIconWhite.png");
            this._spCircle.runAction(cc.moveTo(duration, 22, szContent.height * 0.5));
            if (this._direction === PlayerSeatDirection.HORIZONTAL) {
                this._spLabel.setSpriteFrame("LOReleaseGreenH.png");
            } else {
                this._spLabel.setSpriteFrame("LOReleaseGreenV.png");
            }
            this.runAction(cc.sequence(cc.delayTime(duration), cc.callFunc(function(){
                this.setLockStatusToRelease();
            }, this)));
        }
    },

    switchTargetRelease: function(){
        if(this._lockStatus === LockFishStatus.LOCKED){
            this.setLockStatusToLock();
        }
    },

    setLockStatusToRelease: function () {
        this.setLockStatusTo(LockFishStatus.RELEASE);
    },

    setLockStatusToLock: function () {
        this.setLockStatusTo(LockFishStatus.LOCK);
    },

    setLockStatusToLocked: function () {
        this.setLockStatusTo(LockFishStatus.LOCKED);
    },

    setLockStatusTo: function (newStatus) {
        // Why do we have two places to store the same piece of information?
        // Are they ever different?  #SSOT
        this._lockStatus = newStatus;
        ef.gameController.setLockMode(newStatus);
        this.setLockSprites(this._lockStatus);
    },

    setLockSprites: function (status) {
        const szContent = this.getContentSize();
        const direction = this._direction === PlayerSeatDirection.HORIZONTAL ? 'H' : 'V';
        let iconStr = '';
        let labelStr = '';
        if (status === LockFishStatus.LOCK) {
            iconStr = 'LOIconWhite.png';
            labelStr = 'LOReleaseWhite' + direction + '.png';
            this._spCircle.setPosition(szContent.width - 22, szContent.height * 0.5);
        } else if (status === LockFishStatus.LOCKED) {
            iconStr = 'LOIconGreen.png';
            labelStr = 'LOReleaseGreen' + direction + '.png';
            this._spCircle.setPosition(szContent.width - 22, szContent.height * 0.5);
        } else if (status === LockFishStatus.RELEASE) {
            iconStr = 'LOIconWhite.png';
            labelStr = 'LOLockWhite' + direction + '.png';
            this._spCircle.setPosition(22, szContent.height * 0.5);
        }
        this._spIcon.setSpriteFrame(iconStr);
        this._spLabel.setSpriteFrame(labelStr);
    },

    switchToLocked: function () {
        if (this._lockStatus === LockFishStatus.LOCK) {
            this.setLockStatusToLocked();
        }
    },

    getDirection: function(){
        return this._direction;
    },

    setDirection: function(direction){
        //todo
        if(this._direction !== direction){
            this._direction = direction;

            if (this._direction === PlayerSeatDirection.HORIZONTAL) {
                //this.setRotation(0);
                //this._spLabel.setRotation(0);
            }else{
                //this.setRotation(90);
                //this._spLabel.setRotation(-90);
            }
        }
    },

    onEnter: function(){
        cc.Sprite.prototype.onEnter.call(this);
        if (this._touchEventListener && !this._touchEventListener._isRegistered())
            cc.eventManager.addListener(this._touchEventListener, this);
    }
});

