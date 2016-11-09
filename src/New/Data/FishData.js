/**
 * Created by eugeneseah on 7/11/16.
 */
"use strict"

var FishAnimationData = function () {
    // const paddingName = "padding";
    const animationSpeed = 0.1;
    const padding = 5;
    let _hasInitialised = false;

    var FishRawData = {
        Ray: {
            animationInterval: [0,5],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            ]
        },
        Squid: {
            animationInterval: [5,5],
            frameOrders: [
                [0, 1, 2, 3, 4, 3, 0],
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            ]
        },
        Puffer: {
            animationInterval: [0,0],
            frameOrders: [
                [8, 9, 10, 11, 12], //swim
                [0, 1, 2, 3, 4], //bloated
                [5, 6, 7], // shrinking
                [],// death
            ]
        }
    };

    var FishAnimationData = new Array(FishRawData.length);

    function resolveName (number, fishType) {
        number = number + '';
        while (number.length < padding){
            number = '0' + number;
        }
        var frameName = fishType + '_' + number + '.png';

        return frameName;
    }


    FishAnimationData.initialise = function(){
        if (_hasInitialised) return;
        for ( var fishType in FishRawData ){
            var data = FishRawData[fishType];

            var animationArray = data.frameOrders.map(
                animationSequence => {
                    var frameArray = animationSequence.map(
                        frame => {
                            return cc.spriteFrameCache.getSpriteFrame(resolveName(frame, fishType));
                        }
                    );
                    var animation = new cc.Animation(frameArray, animationSpeed);
                    return new cc.Animate(animation);
                }
            );
            var fishDataArray = new Array(animationArray.length);

            for (var i = 0; i < animationArray.length; i++){
                fishDataArray[i] = { animation: animationArray[i], animationInterval : FishRawData[fishType].animationInterval[i]};
            }

            // FishAnimationData[fishType] = { animation: animationArray, animationInterval: FishRawData[fishType].animationInterval}; //refactor to single?
            FishAnimationData[fishType] = fishDataArray;
        }
        _hasInitialised = true;
    };

    return FishAnimationData;
}();

