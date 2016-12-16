/**
 * Created by eugeneseah on 13/12/16.
 */

const NetManager = (function (){
        "use strict";

    function NetManager (parent){
        this.parent = parent;
    }

    const proto = NetManager.prototype;

    proto.explodeAt= function(x,y){
        let net = new NetPrefab(this.parent, x,y);
    };

    return NetManager;

}());