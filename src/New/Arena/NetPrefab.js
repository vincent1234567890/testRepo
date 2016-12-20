const NetPrefab = (function () {
    "use strict";

    const baseRotation = 0;
    const scale1 = new cc.ScaleTo(0.2,0.9);
    const scale2 = new cc.ScaleTo(0.2,1.1);
    // const scale3 = new cc.ScaleTo(0.5,0.9);
    // const scale1 = new cc.ScaleTo(0.5,0.9);
    // let sequence = new cc.Sequence (scale1,scale2,scale1,scale2,destroyView);
    const NetPrefab = function (parent, x,y, resource) {

        this.node = new cc.Node();
        this._parent = parent;
        this._parent.addChild(this.node);

        const topLeft = new cc.Sprite(resource);
        topLeft.setAnchorPoint(0,0);
        const topRight = new cc.Sprite(resource);
        topRight.setAnchorPoint(0,0);
        const bottomLeft = new cc.Sprite(resource);
        bottomLeft.setAnchorPoint(0,0);
        const bottomRight = new cc.Sprite(resource);
        bottomRight.setAnchorPoint(0,0);

        this.node.addChild(topLeft);
        this.node.addChild(topRight);
        this.node.addChild(bottomLeft);
        this.node.addChild(bottomRight);

        topLeft.setRotation(-90 + baseRotation);
        topRight.setRotation(baseRotation);
        bottomLeft.setRotation(180 + baseRotation);
        bottomRight.setRotation(90 + baseRotation);

        this.sequence = new cc.Sequence (scale1,scale2,scale1,scale2, cc.callFunc(this.destroyView, this));


        this.node.setPosition(x,y);
        this.node.runAction(this.sequence);
    };

    const proto = NetPrefab.prototype;

    // proto.explodeAt = function (x,y) {
    //
    // };

    proto.destroyView = function () {
        // console.log(proto);
        // console.trace();
        // console.log(this);

        // if (this) {
            this._parent.removeChild(this.node);
            this.node = null;
        // }
    };

    return NetPrefab;

}());