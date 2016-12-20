/**
 * Created by eugeneseah on 30/11/16.
 */

const BulletManager = (function(){
    "use strict";
    let _parent;
    let _fishGameArena;
    let _bulletCache = [];
    let _rotationFunction;

    const BulletManager = function (parent, fishGameArena, rotationFunction) {
        _parent = parent;
        _fishGameArena = fishGameArena;
        _rotationFunction = rotationFunction;
    };

    const proto = BulletManager.prototype;

    proto.createBullet = function (bulletId) {
        // cc.spriteFrameCache.addSpriteFrames(res.bull);
        _bulletCache[bulletId] = new BulletView(_parent, ReferenceName.Bullet1);
        // console.log(_bulletCache);
    };


    proto.update = function () {
        for (let bulletId in _bulletCache) {
            const bulletModel = _fishGameArena && _fishGameArena.getBullet(bulletId);
            if (!bulletModel) {
                // Only happens if we fire bullets without going through the server/arena
                console.warn("No bullet found in arena with id:", bulletId);
                console.trace();
                continue;
            }

            if (bulletModel && !bulletModel.position) {
                console.warn("bulletModel does not have a position!", bulletModel);
                continue;
            }

            //console.log("bulletModel:", bulletModel);
            if (bulletModel && bulletModel.position) {
                let bulletView = _bulletCache[bulletId];
                // console.log("bulletModel: " + JSON.stringify(bulletModel) + ", bulletId: " + bulletId + ", bulletView: " + bulletView);
                //console.log("bulletModel.position:", bulletModel.position);
                //this.setPosition(new cc.Point(bulletModel.position[0], bulletModel.position[1]));

                const model = _rotationFunction(bulletModel.position, bulletModel.angle);
                // console.log(JSON.stringify(model));
                bulletView.setPosition(model.position[0], model.position[1]);
                bulletView.setRotation(180 - model.rotation);
            }

            //for particle
            // let nextStep = cc.pAdd(this.getPosition(), cc.p(this._speed * dt * this._moveDirection.x, this._speed * dt * this._moveDirection.y));
            // let Dir = cc.pSub(nextStep, this.getPosition());
            // let ang = Math.atan2(Dir.x, Dir.y);
            // if (this._particle) {
            //     this._particle.setPosition(this.getPosition());
            //     if (ang < 0) {
            //         this._particle.setAngle(270 - ang / Math.PI * 180);
            //     }
            //     else {
            //         this._particle.setAngle(270 - ang / Math.PI * 180);
            //     }
            // }
        }
    };

    proto.explodeBullet = function (bulletId) {
        //@TODO:add fish nets
        const bullet = _bulletCache[bulletId];

        if (bullet){
            bullet.destroyView();
            delete _bulletCache[bulletId];
            const bulletModel = _fishGameArena && _fishGameArena.getBullet(bulletId);
            if (bulletModel){
                return bulletModel.position;
            }
        }else{
            console.warn("Could not find bulletView with id: " + bulletId + ".  Unable to show net explosion!")
        }
        return null;
    };

    proto.destroyView = function () {
        for ( let bulletId in _bulletCache){
            const bullet = _bulletCache[bulletId];
            if (bullet){
                bullet.destroyView();
                delete _bulletCache[bulletId];
            }
        }
        _bulletCache = [];
    };



    return BulletManager;

}());