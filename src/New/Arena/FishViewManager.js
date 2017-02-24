/**
 * Created by eugeneseah on 3/11/16.
 */

const FishViewManager = (function(){


    const FishViewManager = function(fishGameArena, gameConfig){
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

        cc.spriteFrameCache.addSpriteFrames(res.AmphiprionPlist);
        cc.spriteFrameCache.addSpriteFrames(res.AmphiprionBWPlist);
        cc.spriteFrameCache.addSpriteFrames(res.GrouperFishPlist);
        cc.spriteFrameCache.addSpriteFrames(res.MarlinsFishPlist);
        cc.spriteFrameCache.addSpriteFrames(res.AngelFishPlist);
        cc.spriteFrameCache.addSpriteFrames(res.ButterflyPlist);
        cc.spriteFrameCache.addSpriteFrames(res.HorseshoeCrabPlist);
        cc.spriteFrameCache.addSpriteFrames(res.PaddleFishPlist);


        //new game

        // cc.spriteFrameCache.addSpriteFrames(res.AnemoneFishPlist);
        // cc.spriteFrameCache.addSpriteFrames(res.AngelFish2Plist);
        // cc.spriteFrameCache.addSpriteFrames(res.BlackWhiteYellowFishPlist);
        // cc.spriteFrameCache.addSpriteFrames(res.BlackYellowButterflyFishPlist);
        // cc.spriteFrameCache.addSpriteFrames(res.BlueTang2Plist);
        // cc.spriteFrameCache.addSpriteFrames(res.ButterflyFish2Plist);
        // cc.spriteFrameCache.addSpriteFrames(res.BWNemoPlist);
        // cc.spriteFrameCache.addSpriteFrames(res.DemoFishPlist);
        // cc.spriteFrameCache.addSpriteFrames(res.KissingFishPlist);
        // cc.spriteFrameCache.addSpriteFrames(res.Marlins2Plist);
        // cc.spriteFrameCache.addSpriteFrames(res.SeahorsePlist);
        // cc.spriteFrameCache.addSpriteFrames(res.Shark2Plist);
        // cc.spriteFrameCache.addSpriteFrames(res.Turtle2Plist);
        // cc.spriteFrameCache.addSpriteFrames(res.YellowFishPlist);

        const plists = ResourceLoader.getPlists("Fish");
        for ( let list in plists){
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }



        // FishAnimationData();
        FishAnimationData.initialise();

        this._parent = new cc.Node();
        this._fishes = {};
        this._fishGameArena = fishGameArena;
        this._gameConfig = gameConfig;

        // this.rotationFunction = rotationFunction;

        GameView.addView(this._parent);
    };

    const proto = FishViewManager.prototype;

    proto.addFish = function(fishId, fishType){
        this._fishes[fishId] = new FishView(this._parent, this._gameConfig.fishClasses[fishType], fishType);
        return this._fishes[fishId];

        //debug version:
        // const parent = new cc.Node();
        // this._parent.addChild(parent);
        // new FishView(parent, fishType);
        // this._fishes[fishId] = parent;
        // return this._fishes[fishId];

    };

    proto.getFish = function(id){
        return this._fishes[id];
    };
    
    proto.caughtFish = function (id) {
        // console.log("caughtFish : id", id);
        return this._fishes[id].killFish(this, this.removeFish, id);
    };

    proto.removeFish = function (reference, id) {
        // console.log("removeFish: ", reference, "id", id);
        this._fishes[id].destroyView(this._parent);
        delete this._fishes[id];
    };

    proto.update = function () {
        for ( let fishId in this._fishes){
            const fishModel = this._fishGameArena.getFish(fishId);
            if (fishModel) {
                //console.log(`Moving fish ${this.FishID} to ${fishModel.position}`);

                // const model = this.rotationFunction(fishModel.position, fishModel.angle);
                const model = GameView.getRotatedView(fishModel.position, fishModel.angle);
                this._fishes[fishId].updateView(cc.p(model.position[0],model.position[1]), model.rotation);
                // this._fishes[fishId].setRotation(model.rotation);
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
        GameView.destroyView(this._parent);
        this._parent = null;
    };

    return FishViewManager;
})();