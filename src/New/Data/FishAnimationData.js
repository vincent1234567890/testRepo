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
        Ray: {
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
            ],
            pivot: [{x: 0.3, y: 0.5}, {x: 0.3, y: 0.5}],
            animationSpeed: 0.075,
        },
        Squid: {
            animationInterval: [5],
            frameOrders: [
                [0, 1, 2, 3, 4, 3, 0],
            ]
        },
        Puffer: {
            frameOrders: [
                [0, 1, 2, 3, 4, 5], //swim
                [7, 8, 9, 10, 11], //bloated
                [2, 5, 6], // shrinking
                [],// death
            ],
            pivot: [{x: 0.35, y: 0.5}, {x: 0.35, y: 0.5}]
        },
        Chelonian: {
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7]
            ],
            pivot: [{x: 0.55, y: 0.5}, {x: 0.55, y: 0.5}]
        },
        Porgy: {
            frameOrders: [
                [0, 1, 2, 3]
            ],
            pivot: [{x: 0.4, y: 0.5}]
        },
        Lantern: {
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.55, y: 0.5}]
        },
        Shark:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.40, y: 0.5}]
        },
        GoldShark:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.40, y: 0.5}]
        },
        ButterFly:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7,]
            ],
            pivot: [{x: 0.45, y: 0.5}]
        },
        SmallFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7,]
            ],
            pivot: [{x: 0.45, y: 0.5}]
        },
        Amphiprion:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.45, y: 0.5}]
        },
        AmphiprionBW:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.45, y: 0.5}]
        },
        GrouperFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            ],
        },
        MarlinsFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            ],
        },
        Angelfish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
        },

        HorseshoeCrab:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            ],
            pivot: [{x: 0.375, y: 0.5}],
        },

        PaddleFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.375, y: 0.5}],
        },


        DemoFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            ],
            animationSpeed: 0.03,
        },


        //new
        AnemoneFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27, ],
            ],
            animationSpeed: 0.03,
        },
        AngelFish2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            ],
            animationSpeed: 0.03,
        },
        BlackWhiteYellowFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            ],
            animationSpeed: 0.03,
        },
        BlackYellowButterflyFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
            ],
            animationSpeed: 0.03,
        },
        BlueTang2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27],
            ],
            animationSpeed: 0.03,
        },
        ButterflyFish2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26],
            ],
            animationSpeed: 0.03,
        },
        BWNemo:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22,23,24,25,26,27,28,29,30,31],
            ],
            animationSpeed: 0.03,
        },
        JellyFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                [],
                [],
                [21,22,23,24,25,26,27,28],
            ],
            animationSpeed: 0.03,
        },
        KissingFish:{
            animationInterval: [],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22,23,24,25,26,27],
            ],
            animationSpeed: 0.03,
        },
        Lantern2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22,23,24,25,26,27],
            ],
            animationSpeed: 0.03,
        },
        LionFish2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22,23,24,25,26,27],
            ],
            animationSpeed: 0.03,
        },
        Marlins2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
            ],
            animationSpeed: 0.03,
        },
        Octopus:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, ],
                [],
                [],
                [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, ],
            ],
            animationSpeed: 0.1,
        },
        PaddleFish2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27,],
            ],
        },
        Seahorse:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27,],
            ],
            animationSpeed: 0.03,
        },
        Shark2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
            ],
        },
        Turtle2:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                [],
                [],
                [21, 22, 23, 24, 25, 26, 27, 28, 29, 30,],
            ],
            animationSpeed: 0.15,
        },
        YellowFish:{
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [],
                [],
                [22, 23, 24, 25, 26, 27],
            ],
            animationSpeed: 0.03,
          },
          Mermaid:{
              frameOrders: [
                  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                  [],
                  [],
                  [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 82, 83, 84, 85, 86],
              ],
              animationSpeed: 0.04,

        },

    };

    //let FishAnimationData = new Array(FishRawData.length);

    //let FishRawData = {};
    let FishAnimationData = [];

    function resolveName(number, fishType) {
        number = number + '';
        while (number.length < padding) {
            number = '0' + number;
        }
        return fishType + '_' + number + '.png';
    }

    FishAnimationData.setData = function(data){
        //FishRawData = data;
        console.log(data);
        for (let entry in data){
          FishRawData[entry] = data[entry];
        }
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
