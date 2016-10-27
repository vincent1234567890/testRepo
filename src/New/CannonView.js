/**
 * Created by eugeneseah on 25/10/16.
 */

"use strict";

var CannonView = (function () {

    var CannonView = cc.Sprite.extend({
        _className: "CannonView",

        //@param {node} parent
        //@param {array[2]} pos
        ctor: function (parent, pos) {

            // var cannon = "#" + ReferenceName.Cannon;
            cc.Sprite.prototype.ctor.call(this, ReferenceName.Cannon);
            // this.setPosition(300, 300);
            parent.addChild(this,999999);

            this.setPosition({x:pos[0], y:pos[1]});


            this.turnTo({x:cc.winSize.width/2,y:cc.winSize.height/2});
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
            var particle = particleSystemFactory.createParticle(res.ParticlePlist);
            particle.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            particle.setShapeType(cc.PARTICLE_STAR_SHAPE);

            particle._dontTint = true;
            bullet.setParticle(particle);
            bullet.setShootFlag((new Date()).getTime());
            bullet.setCurWeaponLevel(currentCannonLevel);
            bullet.resetState();
            bullet.updateInfo();
            bullet.setGroup(GroupHeroBullet);
            var bulletPos = this.convertToWorldSpace(this.getPosition());
            var direction = cc.pNormalize(cc.pSub(pos, bulletPos));
            bullet.setMoveDirection(direction);
            bullet.setPosition(bulletPos);
            particle.setPosition(cc.pAdd(this.getPosition(), cc.pMult(direction, 60)));

            bullet.setTargetPosition(pos);
            var speedSetArray = GameSetting.getInstance().getBulletSpeedArray();
            var bulletSpeed = speedSetArray[currentCannonLevel];
            bullet.setSpeed(bulletSpeed);

            bullet.playAction(7 + currentCannonLevel - 1);
            // if (type) {
            //     bullet.setActorType(type);
            // }
            bullet.setZOrder(BulletActorZValue);

            // var ang = Math.atan2(direction.x, direction.y);
            // this.getWeaponSprite().setRotation((ang / Math.PI * 180.0 - this.getRotation()));
            GameCtrl.sharedGame().getCurScene().addChild(particle, 10);
            GameCtrl.sharedGame().getCurScene().addActor(bullet);

            // switch (type) {
            //     case ActorType.eActorTypeTL:
            //         PlayerActor.sharedActorTL().shootFinished(bullet.getCurWeaponLevel());
            //         break;
            //
            //     case ActorType.eActorTypeTR:
            //         PlayerActor.sharedActorTR().shootFinished(bullet.getCurWeaponLevel());
            //         break;
            //
            //     case ActorType.eActorTypeBR:
            //         PlayerActor.sharedActorTR().shootFinished(bullet.getCurWeaponLevel());
            //         break;
            //
            //     case ActorType.eActorTypeBL:
            //         PlayerActor.sharedActorTR().shootFinished(bullet.getCurWeaponLevel());
            //         break;
            //
            //     case ActorType.eActorTypeNormal:
            //     default:
            //         PlayerActor.sharedActor().shootFinished(bullet.getCurWeaponLevel());
            //         break;
            // }

            playEffect(FIRE_EFFECT);

            // So we can set bulletId
            return bullet;
        }

    });

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