var MOUSE_DOWN = false;
var TouchLayer = cc.Layer.extend({
    _enable:false,
    _delegate:null,
    ctor:function () {
        this._super();
        this.setEnable(true);
        window.addEventListener("mousedown", function () {
            MOUSE_DOWN = true;
        });
        window.addEventListener("mouseup", function () {
            MOUSE_DOWN = false;
        });
    },
    getDelegate:function () {
        return this._delegate;
    },
    setDelegate:function (v) {
        this._delegate = v;
    },
    getEnable:function () {
        return this._enable;
    },
    setEnable:function (enabled) {
        if (this._enable != enabled) {
            this._enable = enabled;
            if (this._enable) {
                cc.Director.getInstance().getTouchDispatcher().addStandardDelegate(this, 0);
            }
            else {
                cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
            }
        }
    },
    onTouchesBegan:function (touches, event) {
        var touchPoint = touches[0].getLocation();
        var array = [];

        for (var i = 0; i < touches.length; i++) {
            var testPoint = touches[i].getLocation();
            var str = JSON.stringify(testPoint);
            array.push(str);
        }
        if (this._delegate) {
            this._delegate.controlNewPosition(this, touchPoint);
            //this._delegate.controlNewPositions(this, array);
        }
    },

    onTouchesMoved:function (touches, event) {
        var touchLocation = touches[0].getLocation();

        if (MOUSE_DOWN) {
            var array = [];

            for (var i = 0; i < touches.length; i++) {
                var testPoint = touches[i].getLocation();
                var str = JSON.stringify(testPoint);
                array.push(str);
            }
            if (this._delegate) {
                this._delegate.controlNewPosition(this, touchLocation);
                //this._delegate.controlNewPositions(this, array);
            }
        }
        else if (this._delegate) {
            this._delegate.controlDPad(this, touchLocation);
        }
    },
    onTouchesEnded:function (touches, event) {
        if (touches.length != 0) {
            var touchPoint = touches[0].getLocation();
            if (this._delegate) {
                this._delegate.controlEndPosition(this, touchPoint);
            }
        }
    },
    onTouchesCancelled:function (touches, event) {
        return;
    }
});

TouchLayer.create = function () {
    var ret = new TouchLayer();
    if (ret.init()) {
        return ret;
    }
};