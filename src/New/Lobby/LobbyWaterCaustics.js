/**
 * Created by eugeneseah on 8/3/17.
 */

const LobbyWaterCaustics = (function () {
    "use strict";


    const _pools  = [];
    let _parent = null;
    const LobbyWaterCaustics = function (parent, dimensions) {
        _parent = new cc.Node();
        GameView.addView(_parent);
        alloc(0);
    };

    function free(id, caustic){
        _pools[id].free(caustic);
    }

    function alloc(id) {
        if (_pools[id] == null){
            _pools[id] = new ObjectPool(LobbyWaterCausticInstance);
        }
        return _pools[id].alloc(_parent, id);
    }

    return LobbyWaterCaustics;

}());