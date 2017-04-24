/**
 * Created by eugeneseah on 3/11/16.
 */

//use for manage fishes.
const FishViewManager = (function(){

    const FishViewManager = function(fishGameArena, gameConfig, animationEndEvent, getFishLockStatus, onFishLockSelectedCallback){
        const plists = ResourceLoader.getPlists("Fish");
        for ( let list in plists){
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }

        FishAnimationData.initialise();

        this._parent = new cc.Node();
        this._fishes = {};
        this._fishGameArena = fishGameArena;
        this._gameConfig = gameConfig;
        this._onAnimationEndEvent = animationEndEvent;

        const targetLockUI = new cc.Sprite(ReferenceName.LockOnTargetCrosshair);

        // this.rotationFunction = rotationFunction;
        GameView.addView(this._parent);

        proto._onFishClicked = (fishView) =>{
            if (!getFishLockStatus()){
                return;
            }
            let id = -1;
            for( let fishId in this._fishes ) {
                if( this._fishes[ fishId ] === fishView ) {
                    id = fishId;
                    break;
                }
            }
            if (targetLockUI.getParent() != null){
                targetLockUI.getParent().removeChild(targetLockUI,false);
            }
            fishView.addTarget(targetLockUI);
            onFishLockSelectedCallback(id);
        }
    };

    const proto = FishViewManager.prototype;

    proto.addFish = function(fishId, fishType){
        this._fishes[fishId] = new FishView(this._parent, this._gameConfig.fishClasses[fishType], fishType, this._onFishClicked);
        return this._fishes[fishId];
    };

    proto.getFish = function(id){
        return this._fishes[id];
    };
    
    proto.caughtFish = function (id, playerSlot) {
        // console.log("caughtFish : id", id);
        if (!this._fishes[id]) {
            console.warn("Could not find fishActor for fish " + id + ".  Perhaps scene was not initialised.")
        }
        this._fishes[id].killFish(this, this.removeFish, id, playerSlot);
    };

    proto.removeFish = function (reference, data) {
        if (!this._parent){
            console.warn("parent has already been destroyed. Possible invisible fish or out of order destruction.");
            return;
        }
        // console.log("removeFish: ", reference, "id", id);
        if (!this._fishes[data.id]) {
            console.warn("Could not find fishActor for fish " + data.id + ".  Perhaps scene was not initialised.")
        }
        this._fishes[data.id].destroyView(this._parent);
        if(data.type && data.position && (data.playerSlot!=null)) {
            this._onAnimationEndEvent(data);
        }
        delete this._fishes[data.id];
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
        if(this._parent) {
            for (let fishId in this._fishes) {
                const fishModel = this._fishGameArena.getFish(fishId);
                if (fishModel) {
                    this._parent.removeChild(fishModel);
                    //delete fishModel;   //it is wrong.
                    this._fishGameArena.removeFish(fishId);
                }
            }
            GameView.destroyView(this._parent);
            this._parent = null;
        }
    };

    return FishViewManager;
})();