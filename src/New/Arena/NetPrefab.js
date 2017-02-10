const NetPrefab = (function () {
    "use strict";

    const baseRotation = 0;
    const scale1 = new cc.ScaleTo(0.2,0.9);
    const scale2 = new cc.ScaleTo(0.2,1.1);
    // const scale3 = new cc.ScaleTo(0.5,0.9);
    // const scale1 = new cc.ScaleTo(0.5,0.9);
    // let sequence = new cc.Sequence (scale1,scale2,scale1,scale2,destroyView);
    const NetPrefab = function (scale, x,y, resource) {


        this._parent = new cc.Node();
        GameView.addView(this._parent);
        // this._parent = parent;
        // this._parent.addChild(this.node);
        this._netParent = new cc.Node();
        this._parent.addChild(this._netParent);

        const topLeft = new cc.Sprite(resource);
        topLeft.setAnchorPoint(0,0);
        const topRight = new cc.Sprite(resource);
        topRight.setAnchorPoint(0,0);
        const bottomLeft = new cc.Sprite(resource);
        bottomLeft.setAnchorPoint(0,0);
        const bottomRight = new cc.Sprite(resource);
        bottomRight.setAnchorPoint(0,0);

        this._netParent.addChild(topLeft);
        this._netParent.addChild(topRight);
        this._netParent.addChild(bottomLeft);
        this._netParent.addChild(bottomRight);

        topLeft.setRotation(-90 + baseRotation);
        topRight.setRotation(baseRotation);
        bottomLeft.setRotation(180 + baseRotation);
        bottomRight.setRotation(90 + baseRotation);

        const width = topLeft.getContentSize().width;

        this._parent.setScale(scale/width);

        this.sequence = new cc.Sequence (scale1,scale2,scale1,scale2, new cc.callFunc(this.destroyView, this));


        this._parent.setPosition(x,y);
        this._netParent.runAction(this.sequence);
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