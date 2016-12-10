/**
 * Created by eugeneseah on 7/11/16.
 */
"use strict"

const FishAnimationData = function () {
    // const paddingName = "padding";
    const animationSpeed = 0.1;
    const padding = 5;
    let _hasInitialised = false;

    const FishRawData = {
        Ray: {
            animationInterval: [0, 0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]// unused
            ],
            pivot: [{x: 0.3, y: 0.5}, {x: 0.3, y: 0.5}]
        },
        Squid: {
            animationInterval: [5, 5],
            frameOrders: [
                [0, 1, 2, 3, 4, 3, 0],
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]//unused
            ]
        },
        Puffer: {
            animationInterval: [0, 0],
            frameOrders: [
                [8, 9, 10, 11, 12, 11, 10, 9], //swim
                [0, 1, 2, 3, 4], //bloated
                [5, 6, 7], // shrinking
                [],// death
            ],
            pivot: [{x: 0.3, y: 0.55}, {x: 0.3, y: 0.55}]
        },
        Chelonian: {
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7]
            ],
            pivot: [{x: 0.55, y: 0.5}, {x: 0.55, y: 0.5}]
        },
        Porgy: {
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3]
            ],
            pivot: [{x: 0.4, y: 0.5}]
        },
        Lantern: {
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],

        }
    };

    let FishAnimationData = new Array(FishRawData.length);

    function resolveName(number, fishType) {
        number = number + '';
        while (number.length < padding) {
            number = '0' + number;
        }
        return fishType + '_' + number + '.png';
    }

    //have to use initialise _after_ assets have been loaded.
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
                    let animation = new cc.Animation(frameArray, animationSpeed);
                    return new cc.Animate(animation);
                }
            );
            let fishDataArray = new Array(animationArray.length);

            for (let i = 0; i < animationArray.length; i++) {
                let pivot = undefined;
                if (data.pivot) {
                    pivot = data.pivot[i];
                }
                fishDataArray[i] = {
                    animation: animationArray[i],
                    animationInterval: FishRawData[fishType].animationInterval[i],
                    pivot: pivot
                };
            }

            // FishAnimationData[fishType] = { animation: animationArray, animationInterval: FishRawData[fishType].animationInterval}; //refactor to single?
            FishAnimationData[fishType] = fishDataArray;
        }
        _hasInitialised = true;
    };

    return FishAnimationData;
}();

