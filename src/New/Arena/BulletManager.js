/**
 * Created by eugeneseah on 30/11/16.
 */

/*
currently does not conform to new structure of GameManaager -> GameView -> GameView.addView
@TODO : refactor to include BulletManagerView
 */

const BulletManager = (function(){
    "use strict";
    let _parent;
    let _fishGameArena;
    let _bulletCache = [];

    const BulletManager = function (fishGameArena) {
        _parent = new cc.Node();
        _fishGameArena = fishGameArena;
        GameView.addView(_parent);
    };

    const proto = BulletManager.prototype;

    proto.createBullet = function (gunId, bulletId) {
        if (gunId >5) gunId = 4; // temp fix
        _bulletCache[bulletId] = new BulletView(_parent, "#Bullet"+(gunId+1)+".png");
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

                const model = GameView.getRotatedView(bulletModel.position, bulletModel.angle);
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
        const bullet = _bulletCache[bulletId];

        if (bullet){
            bullet.destroyView();
            delete _bulletCache[bulletId];
            const bulletModel = _fishGameArena && _fishGameArena.getBullet(bulletId);
            if (bulletModel){
                return { position:bulletModel.position, gunId : bulletModel.gunId}
            }
        }else{
            console.warn("Could not find bulletView with id: " + bulletId + ".  Unable to show net explosion!")
        }
        return null;
    };

    proto.getView = function () {
        return _parent;
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
        GameView.destroyView(_parent);
        _parent = null;
    };



    return BulletManager;

}());