/**
 * Created by eugeneseah on 13/12/16.
 */

const NetManager = (function (){
        "use strict";

    function NetManager (){
        // this.parent = new cc.Node();
    }

    const proto = NetManager.prototype;

    proto.explodeAt= function(gameConfig, bulletData){
        // cc.spriteFrameCache.addSpriteFrames(res.Net1);
        const rotPos = GameView.getRotatedView(bulletData.position).position;
        //get resource from gunId
        let scale = gameConfig.gunClasses[bulletData.gunId].explosionRadius;
        const net = new NetPrefab(scale, rotPos[0], rotPos[1], "#Net1.png");
    };

    return NetManager;

}());