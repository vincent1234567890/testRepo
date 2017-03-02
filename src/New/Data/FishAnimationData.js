/**
 * Created by eugeneseah on 7/11/16.
 */


const FishAnimationData = function () {
    "use strict";
    // const paddingName = "padding";
    const animationSpeed = 0.1;
    const padding = 5;
    let _hasInitialised = false;

    // pivot
    // y -> 1 => move fish right relative to hitbox
    // x -> 1 => move fish forward relative to hitbox
    /*
    const FishRawData = {
        // Ray: {
        //     animationInterval: [5,5],
        //     frameOrders: [
        //         [0, 1, 2, 3], //swim
        //         [4, 5, 6],   //bloated
        //         [], // shrinking
        //         [0], //death
        //
        //     ],
        //     pivot: [{x: 0.3, y: 0.5}, {x: 0.3, y: 0.5}],
        //     animationSpeed: 0.075,
        // },
    };

    */
    let FishRawData = {};
    let FishAnimationData = [];

    function resolveName(number, fishType) {
        number = number + '';
        while (number.length < padding) {
            number = '0' + number;
        }
        return fishType + '_' + number + '.png';
    }

    FishAnimationData.setData = function(data){
        FishRawData = data;
        // FishAnimationData = new Array(FishRawData.length);
    };

    FishAnimationData.initialise = function () {
        if (_hasInitialised) return;
        for (let fishType in FishRawData) {
            let data = FishRawData[fishType];

            let animationArray = data.frameOrders.map(
                animationSequence => {
                    let frameArray = animationSequence.map(
                        frame => {
                            return cc.spriteFrameCache.getSpriteFrame(resolveName(frame, fishType));
                        }
                    );
                    let speed = animationSpeed;
                    if (data.animationSpeed){
                        speed = data.animationSpeed;
                    }
                    let animation = new cc.Animation(frameArray, speed);
                    return new cc.Animate(animation);
                }
            );

            let fishDataArray = new Array(animationArray.length);

            for (let i = 0; i < animationArray.length; i++) {
                let pivot = undefined;
                if (data.pivot) {
                    pivot = data.pivot[i];
                }
                let animationInterval = 0;
                if (FishRawData[fishType].animationInterval && FishRawData[fishType].animationInterval[i]) {
                    animationInterval = FishRawData[fishType].animationInterval[i]
                }
                fishDataArray[i] = {
                    animation: animationArray[i],
                    animationInterval: animationInterval,
                    pivot: pivot
                };
            }

            FishAnimationData[fishType] = fishDataArray;
        }
        _hasInitialised = true;
    };

    return FishAnimationData;
}();

