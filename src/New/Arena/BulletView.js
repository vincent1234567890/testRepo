/**
 * Created by eugeneseah on 30/11/16.
 */

const BulletView = (function () {
    "use strict";

    const BulletView = function (parent, resource) {
        this._parent = parent;

        this._view = new cc.Sprite(resource);
        this._parent.addChild(this._view);

        this._particle = particleSystemFactory.create(res.ParticlePlist, undefined, true);
        this._particle.setPosition (this._view.getContentSize().width/2, this._view.getContentSize().height/2);

        this._view.addChild(this._particle);
    };

    const proto = BulletView.prototype;

    proto.setPosition = function (x,y) {
        this._view.setPosition(x,y);
    };

    proto.setRotation = function (rot){
        this._view.setRotation(rot);
        this._particle.setRotation(-rot);
    };

    proto.destroyView = function () {
        this._parent.removeChild(this._view);
    };

    return BulletView;

}());