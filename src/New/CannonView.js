/**
 * Created by eugeneseah on 25/10/16.
 */

"use strict";

var CannonView = (function () {

    var CannonView = cc.Sprite.extend({
        _className: "CannonView",
        _cannonPowerLabel : cc.LabelTTF,

        //@param {node} parent
        //@param {array[2]} pos
        ctor: function (parent, pos) {
            // var cannon = "#" + ReferenceName.Cannon;
            cc.Sprite.prototype.ctor.call(this, ReferenceName.Cannon);
            // this.setPosition(300, 300);
            parent.addChild(this,20);

            var CannonPower = new cc.Sprite(ReferenceName.CannonPower);
            CannonPower.y = CannonPower.getContentSize().height/2;
            parent.addChild(CannonPower,25);


            this.setPosition({x:pos[0], y:pos[1]});

            var fontDef = new cc.FontDefinition();
            fontDef.fontName = "Arial";
            fontDef.fontSize = "32";
            fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            this._cannonPowerLabel = new cc.LabelTTF('', fontDef);
            // CannonPower.addChild(this._cannonPowerLabel,1);

            parent.addChild(this._cannonPowerLabel,29);
            var midX = cc.view.getDesignResolutionSize().width/2;
            var midY = cc.view.getDesignResolutionSize().height/2;

            if (pos[0] < midX) {
                CannonPower.x = CannonPower.getContentSize().width/2;
            } else {
                CannonPower.x = midX * 2 - CannonPower.getContentSize().width/2 + 1;
            }

            if (pos[1] > midY){
                CannonPower.flippedY = true;
                CannonPower.y = cc.view.getDesignResolutionSize().height - CannonPower.getContentSize().height/2 + 1;
            }else {
                CannonPower.y = CannonPower.getContentSize().height/2 - 1;
            }

            this._cannonPowerLabel.setPosition(CannonPower.getPosition() );


            this.turnTo({x:cc.winSize.width/2,y:cc.winSize.height/2});


        },

        updateCannonPowerLabel : function (cannonPower) {
            this._cannonPowerLabel.setString(String(cannonPower));
        },

        turnTo:  function (newDirection) {
            var direction = cc.pNormalize(cc.pSub(newDirection, this.getPosition()));
            var ang = Math.atan2(direction.x, direction.y);
            this.setRotation(ang / Math.PI * 180.0);
            var clockAngle = this.getRotation();
            return Math.PI/2 - clockAngle * Math.PI / 180;;
        },
        
        shootTo: function (pos) {
            this.turnTo(pos);
            //shoot bullet
        },

        //to refactor : from WeaponCannonExt
        spawnBullet: function(pos){
            //temp
            var currentCannonLevel = 1;


            var bullet = ActorFactory.create("BulletActor");
            var bulletPos = this.convertToWorldSpace(this.getPosition());
            var direction = cc.pNormalize(cc.pSub(pos, bulletPos));

            var particle = particleSystemFactory.create(res.ParticlePlist, cc.pAdd(this.getPosition(), cc.pMult(direction, 60)), true);

            bullet.setParticle(particle);

            bullet.setShootFlag((new Date()).getTime());
            bullet.setCurWeaponLevel(currentCannonLevel);
            bullet.resetState();
            bullet.updateInfo();
            bullet.setGroup(GroupHeroBullet);
            bullet.setMoveDirection(direction);
            bullet.setPosition(bulletPos);


            bullet.setTargetPosition(pos);
            var speedSetArray = GameSetting.getInstance().getBulletSpeedArray();
            var bulletSpeed = speedSetArray[currentCannonLevel];
            bullet.setSpeed(bulletSpeed);

            bullet.playAction(7 + currentCannonLevel - 1);

            bullet.setZOrder(BulletActorZValue);

            GameCtrl.sharedGame().getCurScene().addChild(particle, 10);
            GameCtrl.sharedGame().getCurScene().addActor(bullet);



            playEffect(FIRE_EFFECT);

            // So we can set bulletId
            return bullet;
        },

        setupCannonChangeMenu : function (parent, cannonManager, pos, callbackCannonDown, callbackCannonUp) {
            var menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, cannonManager);
            var menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, cannonManager);


            var menu = new cc.Menu(menuLeft, menuRight);
            menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-92, -20)));
            menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(92, -20)));
            parent.addChild(menu, 50);

            // menu.y = this.getContentSize().height / 2 - 30;
            var midX = cc.view.getDesignResolutionSize().width / 2;
            var midY = cc.view.getDesignResolutionSize().height / 2;
            if (pos[0] > midX) {
                // menu.x = playerViewStaticPrefabInstance.getContentSize().width / 2 ;
                menu.x = midX - 137;
            } else {
                // menu.x = playerViewStaticPrefabInstance.x + playerViewStaticPrefabInstance.getContentSize().width;

                menu.x = -midX + 137;
            }

            if (pos[1] > midY) {
                menu.y = midY * 2 - 22;
            } else {
                menu.y = 22;
            }
        }


    });

    // var setupCannonChangeMenu = function (parent, cannonManager, pos, callbackCannonDown, callbackCannonUp){
    //     var menuLeft = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.DecreaseCannon), new cc.Sprite(ReferenceName.DecreaseCannon_Down), callbackCannonDown, cannonManager);
    //     var menuRight = new cc.MenuItemSprite(new cc.Sprite(ReferenceName.IncreaseCannon), new cc.Sprite(ReferenceName.IncreaseCannon_Down), callbackCannonUp, cannonManager);
    //
    //
    //     var menu = new cc.Menu(menuLeft, menuRight);
    //     menuLeft.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuLeft.getContentSize().height / 2), cc.p(-92, -20)));
    //     menuRight.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, menuRight.getContentSize().height / 2), cc.p(92, -20)));
    //     parent.addChild(menu, 50);
    //
    //     // menu.y = this.getContentSize().height / 2 - 30;
    //     var midX = cc.view.getDesignResolutionSize().width / 2;
    //     var midY = cc.view.getDesignResolutionSize().height / 2;
    //     if (pos[0] > midX) {
    //         // menu.x = playerViewStaticPrefabInstance.getContentSize().width / 2 ;
    //         menu.x = midX - 137;
    //     } else {
    //         // menu.x = playerViewStaticPrefabInstance.x + playerViewStaticPrefabInstance.getContentSize().width;
    //
    //         menu.x = -midX + 137;
    //     }
    //
    //     if (pos[1] > midY){
    //         menu.y = cc.view.getDesignResolutionSize().height - 22;
    //     }else {
    //         menu.y = 22 ;
    //     }
    //
    // };


    return CannonView;
}());



// "use strict";
//
// const DKJFDJKF_DFKDJ = 3;
//
//
// var CannonView = (function () {
//
//
//     function somefunction (dsfsd) {
//         dsfsd._spriteResource
//     };
//
//     var CannonView = cc.Sprite.extend({
//         _className: "CannonView",
//         _spriteResource :  null,
//
//
//         //@param {String} spriteResource path (use res)
//         ctor: function (spriteResource) {
//             this._spriteResource = spriteResource;
//             // var cache = cc.spriteFrameCache;
//             // cache.addSpriteFrames(res.CannonPlist);
//             cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
//             var cannon = "#" + ReferenceName.Cannon;
//             cc.Sprite.prototype.ctor.call(this, cannon);
//             this.setPosition(300, 300);
//
//
//         },
//
//         otherfunction:  function () {
//             somefunction(this);
//         },
//
//     });
//     return {
//
//     }
// }());
//
// var w = new CannonView(sprite);
//
// w.otherfunction();