/**
 * Created by eugeneseah on 7/11/16.
 */
"use strict"

const FishAnimationData = function () {
    // const paddingName = "padding";
    const animationSpeed = 0.1;
    const padding = 5;
    let _hasInitialised = false;

    // pivot
    // y -> 1 => move fish right relative to hitbox
    // x -> 1 => move fish forward relative to hitbox
    const FishRawData = {
        Ray: {
            animationInterval: [0, 0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]// unused
            ],
            pivot: [{x: 0.3, y: 0.5}, {x: 0.3, y: 0.5}],
            animationSpeed: 0.075,
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
                [0, 1, 2, 3, 4], //swim
                [7, 8, 9, 10, 11], //bloated
                [2, 5, 6], // shrinking
                [],// death
            ],
            pivot: [{x: 0.35, y: 0.5}, {x: 0.35, y: 0.5}]
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
            pivot: [{x: 0.55, y: 0.5}]
        },
        Shark:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.40, y: 0.5}]
        },
        GoldShark:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            pivot: [{x: 0.40, y: 0.5}]
        },
        ButterFly:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7,]
            ],
            pivot: [{x: 0.45, y: 0.5}]
        },
        SmallFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7,]
            ],
            pivot: [{x: 0.45, y: 0.5}]
        },
        Amphiprion:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
        },
        AmphiprionBW:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
        },
        GrouperFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            ],
        },
        MarlinsFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            ],
        },
        AngelFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
        },
        DemoFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },


        //new
        AngelFish2:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },

        BlackWhiteYellowFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },

        BlackYellowButterflyFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },
        BlueTang2:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },
        ButterflyFish2:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },
        BWNemo:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },
        KissingFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },
        Seahorse:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },
        Turtle2:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.15,
        },
        YellowFish:{
            animationInterval: [0],
            frameOrders: [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            ],
            pivot: [{x: 0.5, y: 0.5}],
            animationSpeed: 0.03,
        },

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

