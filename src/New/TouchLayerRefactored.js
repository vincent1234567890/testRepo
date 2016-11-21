/**
 * Created by eugeneseah on 3/11/16.
 */
// var MOUSE_DOWN = false;
var TouchLayerRefactored = cc.Layer.extend({
    _enable: false,
    _callback: null,
    ctor: function (callback) {
        this._super();
        this.setEnable(true);
        this._callback = callback;

        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchesBegan.bind(this),
            onTouchMoved: this.onTouchesMoved.bind(this),
            onTouchEnded: this.onTouchesEnded.bind(this)
        });
        cc.eventManager.addListener(touchListener, this);
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
            this._callback(touchPoint);
        }

    },
    onTouchesCancelled: function (touches, event) {
    }
});

