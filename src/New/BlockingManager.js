/**
 * Created by eugeneseah on 24/1/17.
 */
const BlockingManager = (function(){
    "use strict";

    const _callbackStack = [];

    let _view;

    function showView(){
        // console.log("showView");
        if (!_view){
            // console.log("!_view");
            _view = new BlockingView(onClick);
        }
        _view.showView();
    }

    function registerBlock (callback) {
        // console.log("registerBlock:",_callbackStack);
        if (_callbackStack.length == 0){
            // console.log("0 show");
            showView();
        }
        _callbackStack.push(callback);
    }

    function deregisterBlock (callback) {
        const index = _callbackStack.indexOf(callback);
        if(index !== -1) {
            _callbackStack.splice(index, 1);
        }
        if(_callbackStack.length == 0 && _view){ // check for view in case its part of cleanup
            _view.hideView();
        }
    }

    function onClick(touch){
        let callback = _callbackStack[_callbackStack.length-1];
        callback(touch);
    }

    function destroyView() {
        if (_view) {
            _view.destroyView();
            _view = null;
        }
    }

    return {
        registerBlock : registerBlock,
        deregisterBlock : deregisterBlock,
        destroyView : destroyView,
    }

}());