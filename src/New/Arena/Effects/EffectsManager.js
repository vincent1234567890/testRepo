/**
 * Created by eugeneseah on 21/2/17.
 */

const EffectsManager = (function () {
    "use strict";
    let coinEffectsManager;
    let freeRoundEffectView;
    let _shakeableNode;

    const shakeMinX = -70;
    const shakeMaxX = 70;
    const shakeMinY = -70;
    const shakeMaxY = 70;

    const numberShakesMin = 6;
    const numberShakesMax = 8;

    const shakeSpeed = 0.075;
    const scaleAmount = 1.15;
    const scaleSpeed = 0.1;

    let originalPosition;

    const EffectsManager = function (shakeableNode) {
        _shakeableNode = shakeableNode;
        originalPosition = shakeableNode.getPosition();
        coinEffectsManager = new CaptureCoinEffectManager();
        freeRoundEffectView = new FreeRoundView();


    };

    const proto = EffectsManager.prototype;

    proto.doCapturePrizeEffect = function (pos, target, fish) {
        if (fish.tier >1 && _shakeableNode.getNumberOfRunningActions() === 0){//do screen shake
            const points = [];
            points.push(new cc.ScaleTo(scaleSpeed,scaleAmount));
            const numberOfShakes = getRandom(numberShakesMin,numberShakesMax);
            for (let i = 0; i<numberOfShakes; i++){
                const shakeX = originalPosition.x + parseFloat(getRandom(shakeMinX,shakeMaxX));
                const shakeY = originalPosition.y + parseFloat(getRandom(shakeMinY,shakeMaxY));
                points.push(new cc.MoveTo(shakeSpeed,cc.p( shakeX, shakeY)));
            }
            points.push(new cc.MoveTo(shakeSpeed,originalPosition));
            points.push(new cc.ScaleTo(scaleSpeed,1));
            const shakeSequence = new cc.Sequence(points);
            _shakeableNode.runAction(shakeSequence);
        }
        const effectSprite = new cc.Sprite();
        const coinEffect = new cc.Sprite();
        if (fish.tier === 3){
            const explosionSequence = new cc.Sequence(GUIFunctions.getAnimation(ReferenceName.ExplosionEffect,0.1),cc.callFunc(onExplosionEffectEnd));
            const coinExplosionSequence = new cc.Sequence(GUIFunctions.getAnimation(ReferenceName.CoinExplosionEffect,0.1), cc.callFunc(onExplosionEffectEnd));
            GameView.addView(effectSprite);
            GameView.addView(coinEffect);
            effectSprite.runAction(explosionSequence);
            coinEffect.runAction(coinExplosionSequence);
        }else if (fish.tier == 2){
            
        }

        function onExplosionEffectEnd(){
            GameView.destroyView(effectSprite);
        }

        function onCoinExplosionEffectEnd(){
            GameView.destroyView(coinEffect);
        }
        coinEffectsManager.triggerCoins(pos, target, fish);
    };



    proto.showFreeRoundEffect = function () {
        freeRoundEffectView.show();
    };

    function getRandom(randomMin,randomMax) {
        return (Math.random() * (randomMax - randomMin) + randomMin).toFixed(4);
    }

    return EffectsManager;
}());