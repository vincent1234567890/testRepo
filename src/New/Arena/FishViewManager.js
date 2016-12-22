/**
 * Created by eugeneseah on 3/11/16.
 */

const FishViewManager = (function(){


    const FishViewManager = function(fishGameArena, rotationFunction){
        // console.log

        cc.spriteFrameCache.addSpriteFrames(res.SquidPlist);
        cc.spriteFrameCache.addSpriteFrames(res.PufferfishPlist);
        cc.spriteFrameCache.addSpriteFrames(res.TurtlePlist);
        cc.spriteFrameCache.addSpriteFrames(res.PorgyPlist);
        cc.spriteFrameCache.addSpriteFrames(res.StingrayPlist);
        cc.spriteFrameCache.addSpriteFrames(res.LanternPlist);
        cc.spriteFrameCache.addSpriteFrames(res.ButterflyPlist);
        cc.spriteFrameCache.addSpriteFrames(res.GoldSharkPlist);
        cc.spriteFrameCache.addSpriteFrames(res.SharkPlist);
        cc.spriteFrameCache.addSpriteFrames(res.SmallFishPlist);
        // FishAnimationData();
        FishAnimationData.initialise();

        this._parent = new cc.Node();
        this._fishes = {};
        this._fishGameArena = fishGameArena;

        this.rotationFunction = rotationFunction;

    };

    const proto = FishViewManager.prototype;

    proto.addFish = function(fishId, fishType){
        // this._fishes[fishId] = new FishView(this._parent, fishType);
        // return this._fishes[fishId];

        //debug version:
        const parent = new cc.Node();
        this._parent.addChild(parent);
        new FishView(parent, fishType);
        this._fishes[fishId] = parent;
        return this._fishes[fishId];

    };

    proto.getFish = function(id){
        return this._fishes[id];
    };
    
    proto.removeFish = function (id) {
        this._parent.removeChild(this._fishes[id]);
        delete this._fishes[id];
    };

    proto.update = function () {
        for ( let fishId in this._fishes){
            const fishModel = this._fishGameArena.getFish(fishId);
            if (fishModel) {
                //console.log(`Moving fish ${this.FishID} to ${fishModel.position}`);

                const model = this.rotationFunction(fishModel.position, fishModel.angle);
                this._fishes[fishId].setPosition(cc.p(model.position[0],model.position[1]));
                this._fishes[fishId].setRotation(model.rotation);
            }
        }
    };

    proto.destroyView = function(){
        for ( let fishId in this._fishes){
            const fishModel = this._fishGameArena.getFish(fishId);
            if (fishModel) {
                this._parent.removeChild(fishModel);
                delete fishModel;
            }
        }

    };

    proto.getView = function () {
        return this._parent;
    };
    return FishViewManager;
})();