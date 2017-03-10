/**
 * Created by eugeneseah on 25/10/16.
 */
const CannonView = (function () {
    "use strict";
    const padding = 5;


    const CannonView = function (gameConfig, slot) {

        this._gameConfig = gameConfig;
        this._cannonNode = new cc.Node();

        let animationArray = [];
        let count = 0;
        while (true) {
            const frame = cc.spriteFrameCache.getSpriteFrame("Spark" + count + ".png");
            if (!frame) {
                break;
            }
            animationArray.push(frame);
            count++;
        }
        animationArray.push(new cc.SpriteFrame(" "));
        this._sparkSprite = new cc.Sprite();
        this._sparkSequence = new cc.Sequence(new cc.Animate(new cc.Animation(animationArray, this._gameConfig.shootInterval / 1000 / animationArray.length)));

        this.createView(slot);

        // this.setSparkSprite();
        this.setDirection(slot);
        GameView.addView(this._cannonNode, 2);
    };

    const proto = CannonView.prototype;

    proto.createView = function (slot) {
        this.pos = [];
        let markerPos;

        this._theme = ThemeDataManager.getThemeDataList("CannonMenuPositions");


        if (this._gameConfig.isUsingOldCannonPositions) {
            this.pos = this._gameConfig.oldCannonPositions[slot];
            markerPos = this._gameConfig.oldCannonPositions[0];
        } else {
            this.pos = this._gameConfig.cannonPositions[slot];
            markerPos = this._gameConfig.cannonPositions[0]
        }

        const cannonLabelFontDef = new cc.FontDefinition();
        cannonLabelFontDef.fontName = "Arial";
        cannonLabelFontDef.fontSize = "24";
        cannonLabelFontDef.fillStyle = new cc.color(this._theme["CannonLabelColour"][0], this._theme["CannonLabelColour"][1], this._theme["CannonLabelColour"][2]);
        cannonLabelFontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;

        this._cannonPowerLabel = new cc.LabelTTF('', cannonLabelFontDef);

        // console.log(this._cannonPowerLabel,cannonLabelPos);

        this.setCannonSprite(1);

        this._isAnimating = false;
        // this._sprite = new cc.Sprite(ReferenceName.Cannon1);
        // this._spriteDown = new cc.Sprite(ReferenceName.CannonDown1);
        // this._spriteDown.setVisible(false);

        // this._cannonNode.addChild(this._spriteDown, 20);

        this._cannonPowerBG = new cc.Sprite(ReferenceName.SideMenuBG);
        this._cannonNode.addChild(this._cannonPowerBG, 27);


        // this._spriteDown.setAnchorPoint(this._sprite.getAnchorPoint());
        // this._spriteDown.setPosition(this._sprite.getPosition());


        // this._cannonNode.setPosition(cc.view.getDesignResolutionSize().width/2,cc.view.getDesignResolutionSize().height/2)


        // if (pos[1] > markerPos[1]){
        //     let multiplier = 1;
        //     let diff = theme["CannonPowerBGRotationOffset"];
        //     if (pos[0] > markerPos[0]){
        //         multiplier = -1;
        //     }
        //     this._cannonPowerBG.x = pos[0] + (diff * multiplier);
        //     this._cannonPowerBG.y = pos[1];
        //     this._cannonPowerBG.setRotation( multiplier * 90);
        // }else{
        //     this._cannonPowerBG.x = pos[0];
        //     this._cannonPowerBG.y = pos[1];
        // }

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
        }, new cc.p(this._gameConfig.cannonPositions[slot][0], this._gameConfig.cannonPositions[slot][1])));
        const rot = Math.atan2(direction.x, -direction.y);
        let angle = (GameView.getRotatedView(undefined, rot)).rotation;
        this._cannonSprite.setRotation(angle);
        // this._spriteDown.setRotation(angle);
        // this._spriteDown.setVisible(false);
    };

    proto.updateCannonPowerLabel = function (cannonPower) {
        this._cannonPowerLabel.setString(String(cannonPower));

        this.setCannonSprite(cannonPower);
    };

    proto.setCannonSprite = function (cannonPower) {
        if (cannonPower > 5) {
            cannonPower = 5;
        } else if (cannonPower < 1) {
            cannonPower = 1;
        }

        let angle;
        if (this._cannonSprite) {
            angle = this._cannonSprite.getRotation();
            this._cannonSprite.removeChild(this._sparkSprite, false);
            this._cannonSprite.removeChild(this._cannonPowerLabel, false);
            this._cannonNode.removeChild(this._cannonSprite);
        }
        this._cannonSprite = new cc.Sprite("#Cannon" + (cannonPower) + "_00000.png");

        this._cannonSprite.setAnchorPoint(0.5, 0.5);
        this._cannonSprite.setPosition({x: this.pos[0], y: this.pos[1]});

        this._sequence = new cc.Sequence(this.getCannonAnimation(cannonPower), new cc.CallFunc(this.onAnimateShootEnd, this));
        this._cannonNode.addChild(this._cannonSprite, 20);
        this._cannonSprite.addChild(this._cannonPowerLabel, 29);

        const size = this._cannonSprite.getContentSize();

        const cannonLabelPos = new cc.p(size.width / 2 + this._theme["CannonLabelPosition"][0], size.height / 2 + this._theme["CannonLabelPosition"][1]);
        this._cannonPowerLabel.setAnchorPoint(0.5, 0.5);
        this._cannonPowerLabel.setPosition(cannonLabelPos);

        this.setSparkSprite();

        if (angle) {
            this._cannonSprite.setRotation(angle);
        }
    };

    proto.setSparkSprite = function () {
        this._cannonSprite.addChild(this._sparkSprite, 99);
        const size = this._cannonSprite.getContentSize();
        this._sparkSprite.setPosition(size.width / 2, size.height);
    };

    proto.clearCannonPowerLabel = function () {
        this._cannonPowerLabel.setString('');
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
            cc.audioEngine.playEffect(res.GunShotSound);
            // this._sparkSprite.stopAction(this._sparkSequence);
        }
        // this._sparkSprite.setVisible(true);

        this._isAnimating = true;
        this._cannonSprite.runAction(this._sequence);

        cc.audioEngine.playEffect(res.GunCockSound);
        // this._sparkSprite.runAction(this._sparkSequence);
    };

    proto.onAnimateShootEnd = function () {
        this._isAnimating = false;
        // this._sparkSprite.setVisible(false);
        cc.audioEngine.playEffect(res.GunShotSound);
    };

    proto.setupCannonChangeMenu = function (cannonManager, gameConfig, slot, callbackCannonDown, callbackCannonUp) {
        let menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, cannonManager);
        let menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, cannonManager);

        let menu = new cc.Menu(menuLeft, menuRight);
        const pMenuLeft = new cc.p(this._theme["MenuLeft"][0], this._theme["MenuLeft"][1]);
        const pMenuRight = new cc.p(this._theme["MenuRight"][0], this._theme["MenuRight"][1]);
        menuLeft.setPosition(pMenuLeft);
        menuRight.setPosition(pMenuRight);
        this._cannonPowerBG.addChild(menu, 50);


        menu.x = this._theme["MenuOffset"][0];
        menu.y = this._theme["MenuOffset"][1];
    };

    proto.destroyView = function () {
        GameView.destroyView(this._cannonNode);
    };

    return CannonView;
}());