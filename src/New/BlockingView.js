/**
 * Created by eugeneseah on 24/1/17.
 */

const BlockingView = (function() {
    "use strict";

    let _touchCallback;
    let _colourBG;
    let _touchlayer;
    const hideColour = cc.color(0,0,0,0);
    const showColour = cc.color(0,0,0,196);

    let _mouseLayer;
    function BlockingView (touchCallback) {
        // console.log("new!");
        this._parent = new cc.Node();

        GameView.addView(this._parent, 9);

        _touchlayer = new TouchLayerRefactored(onBackgroundClicked);
        _touchlayer.setSwallowTouches(true);
        _touchlayer.setEnable(false);
        this._parent.addChild(_touchlayer,-1);

        // _mouseLayer = new MouseLayer(onBackgroundClicked);
        // _mouseLayer.setSwallowTouches(true);
        // _mouseLayer.setEnable(false);
        // this._parent.addChild(_mouseLayer,-1);
        const _listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            swallowTouches: true,
        });

        cc.eventManager.addListener(_listener, _touchlayer);

        _colourBG = new cc.LayerColor(hideColour);
        this._parent.addChild(_colourBG,-1);

        _touchCallback = touchCallback;
    }

    function onBackgroundClicked (touch){
        _touchCallback(touch);
    }

    const proto = BlockingView.prototype;

    proto.hideView = function(){
        _touchlayer.setEnable(false);
        // _mouseLayer.setEnable(false);
        _colourBG.init(hideColour);
    };
    
    proto.showView = function() {
        // console.log("show!");
        _touchlayer.setEnable(true);
        // _mouseLayer.setEnable(true);
        _colourBG.init(showColour);
    };

    proto.destroyView = function () {
        GameView.destroyView(this._parent);
    };

    return BlockingView;
}());