/**
 * Created by eugeneseah on 22/3/17.
 */
var MouseLayer = cc.Layer.extend({
    _enable: false,
    _callback: null,
    _listener: null,
    ctor: function (callback) {
        this._super();
        this.setEnable(true);
        this._callback = callback;

        this._listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            swallowTouches: false,
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this),
            onMouseMove: this.onMouseMoved.bind(this),
            onMouseScroll: this.onMouseScrolled.bind(this)
        });

        // this._hideListener = cc
        //cc.game.EVENT_HIDE
        // var lstnr = cc.EventListenerCustom.create("game_on_show", this.gameShowingFunc);
        // cc.eventManager.addListener(lstnr, this);
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

    onMouseDown: function (mouseData, event) {
        if (!this._enable) return;
        var touchPoint = mouseData.getLocation();
        // debugger;
        if (this._callback) {
            this._callback(touchPoint, MouseType.MouseDown);
            // console.log(touches);
        }
        return true;
    },

    onMouseMoved: function (mouseData, event) {
        if (!this._enable) return;
        var touchPoint = mouseData.getLocation();

        if (this._callback) {
            this._callback(touchPoint, MouseType.Moved);
        }
    },

    onMouseUp: function (mouseData, event) {
        if (!this._enable) return;
        var touchPoint = mouseData.getLocation();
        if (this._callback) {
            this._callback(touchPoint, MouseType.MouseUp);
        }
    },

    onMouseScrolled: function (mouseData, event) {
        if (!this._enable) return;
        var touchPoint = mouseData.getLocation();
        if (this._callback) {
            this._callback(touchPoint, MouseType.Scrolled);
        }
    },

    setSwallowTouches: function (isSwallow) {
        this._listener.setSwallowTouches(isSwallow);
    },
});

const MouseType = { // same as cc.EventTouch.EventCode
    MouseDown: 0,
    MouseUp: 1,
    Moved: 2,
    Scrolled: 3,
};