
var TestScene = cc.Scene.extend({
    ctor: function(){
        cc.Scene.prototype.ctor.call(this);

        var winSize = cc.director.getWinSize();

        var layerColor = new cc.LayerColor(new cc.Color(77, 50, 30));
        this.addChild(layerColor);

        //add Fishes
        // var shark = new SharkActor();
        // this.addChild(shark);
        // shark.setPosition(winSize.width * 0.5, winSize.height * 0.5);
        // shark.scheduleUpdate();

        // var cannonlayer = new CanonLayer();
        // GameManager.initialise(this);
        // GameManager.development(this);

        //const waterCausticsLayer = new WaterCausticsLayer();
        //this.addChild(waterCausticsLayer,999);

        //let jackpotPanel = new JackpotDetailPanel();
        //this.addChild(jackpotPanel);

        let waveTransition = new WaveTransition(res.GameBackground0);
        this.addChild(waveTransition);
        waveTransition.transition(res.GameBackground1);

        //const pnWait = new WaitingPanel();
        //this.addChild(pnWait);
        let spButton = new LockFishButton(PlayerSeatDirection.HORIZONTAL);
        this.addChild(spButton);
        spButton.setPosition(cc.visibleRect.center);

        let spButton1 = new LockFishButton(PlayerSeatDirection.VERTICAL);
        this.addChild(spButton1);
        spButton1.setPosition(cc.visibleRect.center.x, cc.visibleRect.center.y + 100);
    }
});