/**
 * Created by eugeneseah on 30/11/16.
 */

const BulletView = (function () {
    "use strict";

    const BulletView = function (parent, resource) {
        this._parent = parent;
        if (this.resource != resource) {
            this.resource = resource;

            if (this._particle){
                this._view.removeChild(this._particle,false);
            }
            if (this._view) {
                // this._parent.addChild(this._view);
                this._parent.removeChild(this._view);
            }
            this._view = new cc.Sprite(resource);


            if (!this._particle) {
                this._particle = particleSystemFactory.create(res.ParticlePlist, new cc.p(this._view.getContentSize().width / 2, this._view.getContentSize().height / 2), true);
            }


            this._view.addChild(this._particle);
            this._parent.addChild(this._view);
        }

        this._particle.setVisible(true);
        this._view.setVisible(true);
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
        // this._view.removeChild(this._particle,false);
        // if (!this._view.getParent()){
        //     this._parent.addChild(this._view);
        // }
        this._parent.removeChild(this._view);
    };

    proto.reclaimView = function(){
        // this._parent.removeChild(this._view,false);
        this._particle.setVisible(false);
        this._view.setVisible(false);
    };

    return BulletView;

}());