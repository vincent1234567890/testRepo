/**
 * Created by eugeneseah on 8/3/17.
 */

const LobbyWaterCaustics = (function () {
    "use strict";


    const _pools  = [];
    let _parent = null;

    const noOfTypes = 4;
    const noOfCausticInstances = 10;

    // const causticsArray = [];
    let count;
    let WaterArea;

    const timingMin = 2;
    const timingMax = 5;
    const timingPauseMin = 0.5;
    const timingPauseMax = 1;

    const movementMax = 30;
    const movementMin = -30;

    const scaleMin = 0.7;
    const scaleMax = 1.3;

    const LobbyWaterCaustics = function () {
        _parent = new cc.Node();
        GameView.addView(_parent,-1);
        const bkglayer = new cc.LayerGradient(new cc.Color(0,0,0,0), new cc.Color(0,0,0,0), cc.p(0, -1)
            ,
                [{p:0.9, color: new cc.Color(10,105,166,255)},
                // {p:.5, color: new cc.Color(0,0,0,0)},
                {p:1, color: new cc.Color(20,145,224,255)}]
        );
        _parent.addChild(bkglayer, -5);
        // alloc(0);
        count = 0;

        // console.log(WaterArea);

        WaterArea = new cc.Rect(0,0,cc.view.getDesignResolutionSize().width,120);
        
        _parent.update = function () {
            if (count < noOfCausticInstances){
                const instance = alloc();
                // causticsArray.push(instance);
                // instance.startAt(pos,)
                count++
            }
        };
        _parent.scheduleUpdate();
    };

    function free(type, instance){
        _pools[type].free(instance);
    }

    function alloc() {
        const type = getRandomInt(1,noOfTypes);
        if (_pools[type] == null){
            _pools[type] = new ObjectPool(LobbyWaterCausticInstance);
        }
        const pos = new cc.p(getRandomInt(0,WaterArea.width), getRandomInt(0,WaterArea.height));
        const timingIn = getRandomInt(timingMin,timingMax);
        const timingPause = getRandomInt(0,10)/10 * (timingPauseMax-timingPauseMin) + timingPauseMin;
        const timingOut = getRandomInt(timingMin,timingMax);
        const rotation = getRandomInt(0,360);
        const xMovement = getRandomInt(movementMax,movementMin);
        const yMovement = getRandomInt(movementMax,movementMin);
        const scale = getRandomInt(0,10)/10 * (scaleMax-scaleMin) + scaleMin;


        return _pools[type].alloc(_parent, type, pos, rotation, timingIn, timingPause, timingOut, new cc.p(xMovement,yMovement), scale, onAnimationEnd);
    }
    
    function onAnimationEnd(instance, type) {
        free(type, instance);
        count--;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return LobbyWaterCaustics;

}());