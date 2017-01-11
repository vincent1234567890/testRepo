const NetPrefab = (function () {
    "use strict";

    const baseRotation = 0;
    const scale1 = new cc.ScaleTo(0.2,0.9);
    const scale2 = new cc.ScaleTo(0.2,1.1);
    // const scale3 = new cc.ScaleTo(0.5,0.9);
    // const scale1 = new cc.ScaleTo(0.5,0.9);
    // let sequence = new cc.Sequence (scale1,scale2,scale1,scale2,destroyView);
    const NetPrefab = function (x,y, resource) {

        this._parent = new cc.Node();
        GameView.addView(this._parent);
        // this._parent = parent;
        // this._parent.addChild(this.node);


        const topLeft = new cc.Sprite(resource);
        topLeft.setAnchorPoint(0,0);
        const topRight = new cc.Sprite(resource);
        topRight.setAnchorPoint(0,0);
        const bottomLeft = new cc.Sprite(resource);
        bottomLeft.setAnchorPoint(0,0);
        const bottomRight = new cc.Sprite(resource);
        bottomRight.setAnchorPoint(0,0);

        this._parent.addChild(topLeft);
        this._parent.addChild(topRight);
        this._parent.addChild(bottomLeft);
        this._parent.addChild(bottomRight);

        topLeft.setRotation(-90 + baseRotation);
        topRight.setRotation(baseRotation);
        bottomLeft.setRotation(180 + baseRotation);
        bottomRight.setRotation(90 + baseRotation);

        this.sequence = new cc.Sequence (scale1,scale2,scale1,scale2, new cc.callFunc(this.destroyView, this));


        this._parent.setPosition(x,y);
        this._parent.runAction(this.sequence);
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
        //     this._parent.removeChild(this.node);
            GameView.destroyView(this._parent);
            this._parent = null;
        // }
    };

    return NetPrefab;

}());