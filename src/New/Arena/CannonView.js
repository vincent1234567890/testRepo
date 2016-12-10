/**
 * Created by eugeneseah on 25/10/16.
 */

"use strict";

const CannonView = (function () {

    let CannonView = cc.Sprite.extend({
        _className: "CannonView",
        _cannonPowerLabel: cc.LabelTTF,

        //@param {node} parent
        //@param {array[2]} pos
        ctor: function (parent, pos) {
            // var cannon = "#" + ReferenceName.Cannon;

            // var pinfo = new cc.auto(ReferenceName.Cannon);
            // var pinfo = new cc.polygo

            this._super(ReferenceName.Cannon);
            // this.setPosition(300, 300);
            parent.addChild(this, 20);

            let CannonPower = new cc.Sprite(ReferenceName.CannonPower);
            CannonPower.y = CannonPower.getContentSize().height / 2;
            parent.addChild(CannonPower, 25);

            this.setAnchorPoint(0.5,0.4);
            this.setPosition({x: pos[0], y: pos[1]});

            let fontDef = new cc.FontDefinition();
            fontDef.fontName = "Arial";
            fontDef.fontSize = "32";
            fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            this._cannonPowerLabel = new cc.LabelTTF('', fontDef);
            // CannonPower.addChild(this._cannonPowerLabel,1);

            parent.addChild(this._cannonPowerLabel, 29);
            const midX = cc.view.getDesignResolutionSize().width / 2;
            const midY = cc.view.getDesignResolutionSize().height / 2;

            if (pos[0] < midX) {
                CannonPower.x = CannonPower.getContentSize().width / 2;
            } else {
                CannonPower.x = midX * 2 - CannonPower.getContentSize().width / 2 + 1;
            }

            if (pos[1] > midY) {
                CannonPower.flippedY = true;
                CannonPower.y = cc.view.getDesignResolutionSize().height - CannonPower.getContentSize().height / 2 + 1;
            } else {
                CannonPower.y = CannonPower.getContentSize().height / 2 - 1;
            }

            this._cannonPowerLabel.setPosition(CannonPower.getPosition());

            // this.turnTo({x: cc.winSize.width / 2, y: cc.winSize.height / 2});
        },

        updateCannonPowerLabel: function (cannonPower) {
            this._cannonPowerLabel.setString(String(cannonPower));
        },

        clearCannonPowerLabel: function () {
            this._cannonPowerLabel.setString('');
        },

        // turnTo: function (newDirection) {
        //     const direction = cc.pNormalize(cc.pSub(newDirection, this.getPosition()));
        //     const ang = Math.atan2(direction.x, direction.y);
        //     console.log("turnto:" + ang);
        //
        //     // const rot = GameManager.getRotatedView(undefined, ang);
        //     // this.setRotation(rot.rotation);
        //     this.setRotation(ang);
        //     // const clockAngle = this.getRotation();
        //     // return rot.rotation * Math.PI / 180;
        //     return ang * Math.PI / 180;
        // },

        shootTo: function (angle) {
            // console.log("shootTo:" + angle);
            // const rot = GameManager.getRotatedView(undefined, angle);
            this.setRotation( angle);
            //shoot bullet
        },

        setupCannonChangeMenu: function (parent, cannonManager, pos, callbackCannonDown, callbackCannonUp) {
            let menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, cannonManager);
            let menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, cannonManager);


            let menu = new cc.Menu(menuLeft, menuRight);
            menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-92, -20)));
            menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(92, -20)));
            parent.addChild(menu, 50);

            // menu.y = this.getContentSize().height / 2 - 30;
            const midX = cc.view.getDesignResolutionSize().width / 2;
            const midY = cc.view.getDesignResolutionSize().height / 2;
            if (pos[0] > midX) {
                menu.x = midX - 137;
            } else {
                menu.x = -midX + 137;
            }

            if (pos[1] > midY) {
                menu.y = midY * 2 - 22;
            } else {
                menu.y = 22;
            }
        },

        //to refactor : from WeaponCannonExt
        // spawnBullet: function (pos) {
        //     //temp
        //     const currentCannonLevel = 1;
        //
        //
        //     let bullet = ActorFactory.create("BulletActor");
        //     const bulletPos = this.convertToWorldSpace(this.getPosition());
        //     const direction = cc.pNormalize(cc.pSub(pos, bulletPos));
        //
        //     let particle = particleSystemFactory.create(res.ParticlePlist, cc.pAdd(this.getPosition(), cc.pMult(direction, 60)), true);
        //
        //     bullet.setParticle(particle);
        //
        //     bullet.setShootFlag((new Date()).getTime());
        //     bullet.setCurWeaponLevel(currentCannonLevel);
        //     bullet.resetState();
        //     bullet.updateInfo();
        //     bullet.setGroup(GroupHeroBullet);
        //     bullet.setMoveDirection(direction);
        //     bullet.setPosition(bulletPos);
        //
        //
        //     bullet.setTargetPosition(pos);
        //     const speedSetArray = GameSetting.getInstance().getBulletSpeedArray();
        //     const bulletSpeed = speedSetArray[currentCannonLevel];
        //     bullet.setSpeed(bulletSpeed);
        //
        //     bullet.playAction(7 + currentCannonLevel - 1);
        //
        //     bullet.setZOrder(BulletActorZValue);
        //
        //     GameCtrl.sharedGame().getCurScene().addChild(particle, 10);
        //     GameCtrl.sharedGame().getCurScene().addActor(bullet);
        //
        //
        //     playEffect(FIRE_EFFECT);
        //
        //     console.log(bullet);
        //
        //     // So we can set bulletId
        //     return bullet;
        // },


    });

    return CannonView;
}());