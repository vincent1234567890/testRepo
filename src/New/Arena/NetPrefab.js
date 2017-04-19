const NetPrefab = (function () {
    "use strict";

    const scale1 = new cc.ScaleTo(0.2,0.9);
    const scale2 = new cc.ScaleTo(0.2,1.1);
    const NetPrefab = function (scale, x,y, resource) {
        this._parent = new cc.Node();
        GameView.addView(this._parent);
        // this._parent = parent;
        // this._parent.addChild(this.node);
        this._netParent = new cc.Node();
        this._parent.addChild(this._netParent);

        this._net = new cc.Sprite(resource);
        this._netParent.addChild(this._net);

        const width = this._net.getContentSize().width;

        this._parent.setScale(scale*2/width);

        this.sequence = new cc.Sequence (scale1,scale2,scale1,scale2, new cc.callFunc(this.destroyView, this));

        this._parent.setPosition(x,y);
        this._netParent.runAction(this.sequence);
    };

    const proto = NetPrefab.prototype;

    proto.destroyView = function () {
        GameView.destroyView(this._parent);
        this._parent = null;
    };

    return NetPrefab;

}());