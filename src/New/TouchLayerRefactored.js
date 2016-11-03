/**
 * Created by eugeneseah on 3/11/16.
 */
// var MOUSE_DOWN = false;
var TouchLayerRefactored = cc.Layer.extend({
    _enable:false,
    // _delegate:null,
    _callback : null,
    ctor:function (callback) {
        this._super();
        this.setEnable(true);
        _callback = callback;
        // window.addEventListener("mousedown", function () {
        //     MOUSE_DOWN = true;
        // });
        // window.addEventListener("mouseup", function () {
        //     MOUSE_DOWN = false;
        // });

        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchesBegan.bind(this),
            onTouchMoved: this.onTouchesMoved.bind(this),
            onTouchEnded: this.onTouchesEnded.bind(this)
        });
        cc.eventManager.addListener(touchListener, this);
    },
    // getDelegate:function () {
    //     return this._delegate;
    // },
    // setDelegate:function (v) {
    //     this._delegate = v;
    // },
    getEnable:function () {
        return this._enable;
    },
    setEnable:function (enabled) {
        if (this._enable != enabled) {
            this._enable = enabled;
            // if (this._enable) {
            //     // cc.Director.getInstance().getTouchDispatcher().addStandardDelegate(this, 0);
            //     // cc.addTouchEventListener(this.setEnable, this);
            //
            // }
            // else {
            //     // cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
            //     // cc.removeDelegate(this.setEnable, this);
            // }
        }
    },
    onTouchesBegan:function (touches, event) {
        if ( ! this._enable) return;
        var touchPoint = touches.getLocation();
        var array = [];

        for (var i = 0; i < touches.length; i++) {
            var testPoint = touches[i].getLocation();
            var str = JSON.stringify(testPoint);
            array.push(str);
        }
        if (this._callback) {
            _callback(touchPoint);
            // this._delegate.controlNewPosition(this, touchPoint);
            //this._delegate.controlNewPositions(this, array);
        }
    },

    onTouchesMoved:function (touches, event) {
        if ( ! this._enable) return;
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
        if ( ! this._enable) return;
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

// TouchLayer.create = function () {
//     var ret = new TouchLayer();
//     if (ret.init()) {
//         return ret;
//     }
// };