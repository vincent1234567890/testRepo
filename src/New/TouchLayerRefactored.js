/**
 * Created by eugeneseah on 3/11/16.
 */
// var MOUSE_DOWN = false;
var TouchLayerRefactored = cc.Layer.extend({
    _enable: false,
    _callback: null,
    _listener : null,
    ctor: function (callback) {
        this._super();
        this.setEnable(true);
        this._callback = callback;

        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchesBegan.bind(this),
            onTouchMoved: this.onTouchesMoved.bind(this),
            onTouchEnded: this.onTouchesEnded.bind(this)
        });
        cc.eventManager.addListener(this._listener, this);
    },

    getEnable: function () {
        return this._enable;
    },
    setEnable: function (enabled) {
        if (this._enable != enabled) {
            this._enable = enabled;
        }
    },

    onTouchesBegan: function (touches, event) {
        if (!this._enable) return;
        var touchPoint = touches.getLocation();
        if (this._callback) {
            this._callback(touchPoint);
        }
        return true;
    },

    onTouchesMoved: function (touches, event) {
        if (!this._enable) return;
        var touchPoint = touches.getLocation();

        if (this._callback) {
            this._callback(touchPoint);
        }
    },

    onTouchesEnded: function (touches, event) {
        if (!this._enable) return;
        var touchPoint = touches.getLocation();
        if (this._callback) {
            this._callback(touchPoint,true);
        }

    },
    onTouchesCancelled: function (touches, event) {
        if (!this._enable) return;
        // var touchPoint = touches.getLocation();
        if (this._callback) {
            this._callback(null);
        }
    },

    setSwallowTouches: function(isSwallow){
        this._listener.setSwallowTouches(isSwallow);
    },
});

