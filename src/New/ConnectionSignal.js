var ConnectionSignal = cc.Layer.extend({
    _theme: null,
    signalImg : null,
    currentSignalSpeed : null,
    currentImg : null,
    signalCriteria : null,
    changeInterval: null,

    latencyPackageCount: null, //Count average of 5 packages
    checkLatencyPeroid: null, //Check every 1s
    lastUpdateTime: null,
    currentTime: null,

    ctor: function() {

        this._super();
        signalImg = new Array(
                new cc.Sprite(ReferenceName.Signal1),
                new cc.Sprite(ReferenceName.Signal2),
                new cc.Sprite(ReferenceName.Signal3),
                new cc.Sprite(ReferenceName.Signal4),
                new cc.Sprite(ReferenceName.Signal5)
        );

        _theme = ThemeDataManager.getThemeDataList("FloatingMenu");
        signalImg.forEach(sp => {
            this.addChild(sp);
            sp.setPosition(_theme["Signal"][0], _theme["Signal"][1]);
        });

        currentImg =  signalImg[4];
        //update new criteria here
        signalCriteria = new Array(80, 120, 160, 200);
        currentSignalSpeed = 0;
        //update every 5 seconds
        changeInterval = 5; //5 sec

        latencyPackageCount = changeInterval; //Count average of 5 packages
        checkLatencyPeroid = 1; //Check every 1s
        lastUpdateTime = Date.now();

        //update
        //cc.director.getScheduler().schedule(this, this.updateSignal, changeInterval, cc.REPEAT_FOREVER, 0, false, "keyCountDownTime");
        this.schedule(this.updateSignal, checkLatencyPeroid, cc.REPEAT_FOREVER);

        return true;
    },

    //for testing
    changeSpeed : function() {
        currentSignalSpeed = Math.floor((Math.random() * 60) + 1);
    },

    updateSignal: function()
    {
        this.checkLatency();
        //this.changeSpeed();
        this.getCurrentStatus();
        this.showCurrentImage();
    },

    // Check connection latency
    checkLatency: function ()
    {
        currentTime = Date.now();
        var deltaTime = currentTime - lastUpdateTime;
        if (deltaTime >= checkLatencyPeroid) {
            ClientServerConnect.checkLatency(latencyPackageCount);
            lastUpdateTime = currentTime;
        }
        currentSignalSpeed = ClientServerConnect.getLatency();
    },

    showCurrentImage: function() {
        var images = this.getSignalImg();
        for(var i = 0; i < images.length; i++){
            images[i].setOpacity(0);
        }
        this.getCurrentImg().setOpacity(255);
    },

    ///
    getCurrentStatus : function() {
        if (currentSignalSpeed < signalCriteria[0])
            currentImg = signalImg[4];
        else if (currentSignalSpeed < signalCriteria[1])
            currentImg = signalImg[3];
        else if (currentSignalSpeed < signalCriteria[2])
            currentImg = signalImg[2];
        else if (currentSignalSpeed < signalCriteria[3])
            currentImg = signalImg[1];
        else if (currentSignalSpeed > signalCriteria[3])
            currentImg = signalImg[0];

        return currentImg;
    },

    getInterval : function() {
        return changeInterval;
    },

    getSpeed : function() {
        return currentSignalSpeed;
    },

    getSignalImg : function() {
        return signalImg;
    },

    getCurrentImg : function() {
        return currentImg;
    },
});
