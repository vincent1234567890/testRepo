/**
 * Created by eugeneseah on 13/12/16.
 */

const NetManager = (function (){
        "use strict";

    function NetManager (){
        // this.parent = new cc.Node();
    }

    const proto = NetManager.prototype;

    proto.explodeAt= function(bulletData){
        // cc.spriteFrameCache.addSpriteFrames(res.Net1);
        const rotPos = GameView.getRotatedView(bulletData.position).position;
        //get resource from gunId
        const net = new NetPrefab(rotPos[0], rotPos[1], ReferenceName.Net1);
    };

    return NetManager;

}());