
var TestScene = cc.Scene.extend({
    ctor: function(){
        cc.Scene.prototype.ctor.call(this);

        var winSize = cc.director.getWinSize();

        var layerColor = new cc.LayerColor(new cc.Color(77, 50, 30));
        this.addChild(layerColor);

        //add Fishes
        var shark = new SharkActor();
        this.addChild(shark);
        shark.setPosition(winSize.width * 0.5, winSize.height * 0.5);
        shark.scheduleUpdate();

        // var cannonlayer = new CanonLayer();
        GameManager.initialise(this);
    }
});

var CanonLayer = cc.Layer.extend({
    ctor: function(){
        cc.Layer.prototype.ctor.call(this);

        GameManager.initialise(this);


    }
})