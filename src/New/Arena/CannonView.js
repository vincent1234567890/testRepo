/**
 * Created by eugeneseah on 25/10/16.
 */
const CannonView = (function () {
    "use strict";
    const padding = 5;

    const CannonView = function (gameConfig, slot) {
        this._gameConfig = gameConfig;
        this._cannonNode = new cc.Node();

        this.createView(slot);

        // this.setSparkSprite();   //show the spark when cannon is firing.
        this.setDirection(slot);
        GameView.addView(this._cannonNode, 2);
    };

    const proto = CannonView.prototype;

    proto.createView = function (slot) {
        this.pos = [];
        let markerPos;

        //create by config.
        this._theme = ThemeDataManager.getThemeDataList("CannonMenuPositions");
        if (this._gameConfig.isUsingOldCannonPositions) {
            this.pos = this._gameConfig.oldCannonPositions[slot];
            markerPos = this._gameConfig.oldCannonPositions[0];
        } else {
            this.pos = this._gameConfig.cannonPositions[slot];
            markerPos = this._gameConfig.cannonPositions[0]
        }

        this._cannonPowerLabel = new cc.LabelTTF('' , "Arial", 24);
        this._cannonPowerLabel._setFontWeight("bold");
        this._cannonPowerLabel.setFontFillColor(new cc.Color(0,0,0,255));
        this.setCannonSprite(1);
        this._isAnimating = false;

        this._cannonPowerBG = new cc.Sprite(ReferenceName.SideMenuBG);
        this._cannonNode.addChild(this._cannonPowerBG, 27);
        if (this.pos[1] > markerPos[1]) {
            let multiplier = 1;
            if (this.pos[0] > markerPos[0]) {
                multiplier = -1;
            }
            this._cannonPowerBG.setRotation(multiplier * 90);
        }
        this._cannonPowerBG.x = this.pos[0];
        this._cannonPowerBG.y = this.pos[1];
    };

    //initialize cannon animation.
    proto.getCannonAnimation = function (cannonPower) {
        let animationArray = [];
        let count = 0;
        while (true) {
            let frameCount = String(count);
            while (frameCount.length < padding) {
                frameCount = '0' + frameCount;
            }
            const frame = cc.spriteFrameCache.getSpriteFrame("Cannon" + cannonPower + "_" + frameCount + ".png");
            if (!frame) {
                break;
            }
            animationArray.push(frame);
            count++;
        }
        animationArray.push(cc.spriteFrameCache.getSpriteFrame("Cannon" + cannonPower + "_00000.png"));
        return new cc.Animate(new cc.Animation(animationArray, this._gameConfig.shootInterval / 1000 / animationArray.length));
    };

    proto.setDirection = function (slot) {
        const direction = cc.pNormalize(cc.pSub({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        }, cc.p(this._gameConfig.cannonPositions[slot][0], this._gameConfig.cannonPositions[slot][1])));
        const rot = Math.atan2(direction.x, -direction.y);
        let angle = (GameView.getRotatedView(undefined, rot)).rotation;
        this._cannonSprite.setRotation(angle);
    };

    proto.updateCannonPowerLabel = function (cannonPower) {
        if(cannonPower == null || isNaN(cannonPower))
            cannonPower = 1;
        this._cannonPowerLabel.setString(String(cannonPower * (this._multiplier === undefined ? 1 : this._multiplier)));
        cc.audioEngine.playEffect(res.GunCockSound);
        this.setCannonSprite(cannonPower);
    };

    proto.setCannonSprite = function (cannonPower) {
        if (cannonPower > 5) {
            cannonPower = 5;
        }else if(cannonPower === 5){
            cannonPower = 4;
        } else if (cannonPower < 1) {
            cannonPower = 1;
        }

        let angle;
        if (this._cannonSprite) {
            angle = this._cannonSprite.getRotation();
            // this._cannonSprite.removeChild(this._sparkSprite, false);
            this._cannonSprite.removeChild(this._cannonPowerLabel, false);
            this._cannonNode.removeChild(this._cannonSprite);
        }
        this._cannonSprite = new cc.Sprite("#Cannon" + (cannonPower) + "_00000.png");

        this._cannonSprite.setAnchorPoint(0.5, 0.5);
        this._cannonSprite.setPosition({x: this.pos[0], y: this.pos[1]});

        // this._sequence = new cc.Sequence(this.getCannonAnimation(cannonPower), new cc.CallFunc(this.onAnimateShootEnd, this));
        this._sequence = new cc.Sequence(this.getCannonAnimation(cannonPower), new cc.CallFunc(this.onAnimateShootEnd, this));
        this._sequence.setOriginalTarget(this._cannonSprite); // due to some unknown error, we need to set the original target, although this is discouraged by the docs
        this._cannonNode.addChild(this._cannonSprite, 20);
        this._cannonSprite.addChild(this._cannonPowerLabel, 29);

        const size = this._cannonSprite.getContentSize();
        const cannonLabelPos = new cc.p(size.width / 2 + this._theme["CannonLabelPosition"][0], size.height / 2 + this._theme["CannonLabelPosition"][1]);
        this._cannonPowerLabel.setAnchorPoint(0.5, 0.5);
        this._cannonPowerLabel.setPosition(cannonLabelPos);

        // this.setSparkSprite();

        if (angle) {
            this._cannonSprite.setRotation(angle);
        }
    };

    // proto.setSparkSprite = function () {
    //     this._cannonSprite.addChild(this._sparkSprite, 99);
    //     const size = this._cannonSprite.getContentSize();
    //     this._sparkSprite.setPosition(size.width / 2, size.height);
    // };

    proto.clearCannonPowerLabel = function () {
        this._cannonPowerLabel.setString('1');
        this.setCannonSprite(1);
    };

    proto.shootTo = function (angle) {
        let modifiedAngle = (GameView.getRotatedView(undefined, angle)).rotation - 90;
        this._cannonSprite.setRotation(modifiedAngle);
        // this._spriteDown.setRotation(modifiedAngle);
        this.animateShootTo();
    };

    proto.animateShootTo = function () { //Request to remove spark sprite.
        if (this._isAnimating) {
            this._cannonSprite.stopAction(this._sequence);
            // this._sparkSprite.stopAction(this._sparkSequence);
        }
        // this._sparkSprite.setVisible(true);
        cc.audioEngine.playEffect(res.GunShotSound);
        this._isAnimating = true;
        this._cannonSprite.runAction(this._sequence);

        // this._sparkSprite.runAction(this._sparkSequence);
    };

    proto.onAnimateShootEnd = function () {
        this._isAnimating = false;
        // this._sparkSprite.setVisible(false);
    };

    proto.setupCannonChangeMenu = function (cannonManager, gameConfig, slot, callbackCannonDown, callbackCannonUp) {
        if(this._menu)
            return;
        let menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon),
            new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, cannonManager);
        let menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon),
            new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, cannonManager);

        this._menu = new cc.Menu(menuLeft, menuRight);
        const pMenuLeft = new cc.p(this._theme["MenuLeft"][0], this._theme["MenuLeft"][1]);
        const pMenuRight = new cc.p(this._theme["MenuRight"][0], this._theme["MenuRight"][1]);
        menuLeft.setPosition(pMenuLeft);
        menuRight.setPosition(pMenuRight);
        this._cannonPowerBG.addChild(this._menu, 50);

        this._menu.x = this._theme["MenuOffset"][0];
        this._menu.y = this._theme["MenuOffset"][1];
    };

    proto.destroyView = function () {
        GameView.destroyView(this._cannonNode);
    };

    proto.hideView = function () {
        this._cannonNode.setVisible(false);
        if (this._menu){
            this._menu.removeFromParent(true);
            //this._cannonPowerBG.removeChild(this._menu);
            this._menu = null;
        }
    };

    proto.showView = function () {
        this._cannonNode.setVisible(true);
    };

    proto.setMultiplier = function (multiplier) { // only happens once at initialisation
        this._multiplier = multiplier;
        let power = parseInt(this._cannonPowerLabel.getString());
        if (isNaN(power))
            power = 1;

        if (this._cannonPowerLabel) {
            this._cannonPowerLabel.setString(power * multiplier);
        }
    };

    return CannonView;
}());