/**
 * Created by eugeneseah on 13/12/16.
 */

const NetManager = (function (){
        "use strict";

    function NetManager (){
        // this.parent = new cc.Node();
    }

    const proto = NetManager.prototype;

    proto.explodeAt= function(x,y,gunId){
        // cc.spriteFrameCache.addSpriteFrames(res.Net1);

        //get resource from gunId
        const net = new NetPrefab(x, y, ReferenceName.Net1);
    };

    return NetManager;

}());