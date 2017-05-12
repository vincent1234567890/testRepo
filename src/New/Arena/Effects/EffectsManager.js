const EffectsManager = (function () {
    "use strict";
    let coinEffectsManager;
    let freeRoundEffectView;
    let _shakeableNode;

    const shakeMinX = -60;
    const shakeMaxX = 10;
    const shakeMinY = -60;
    const shakeMaxY = 10;

    const numberShakesMin = 5;
    const numberShakesMax = 10;

    const shakeSpeed = .032;
    const scaleAmount = 1.06;
    const scaleSpeed = 0.1;

    let originalPosition;

    const EffectsManager = function (shakeableNode) {//总的效果控制器
        _shakeableNode = shakeableNode;
        originalPosition = shakeableNode.getPosition();
        coinEffectsManager = new CaptureCoinEffectManager();
        freeRoundEffectView = new FreeRoundView();
    };

    const proto = EffectsManager.prototype;

    proto.doCapturePrizeEffect = function (pos, target, fish) {
        if (fish.screenShake && _shakeableNode.getNumberOfRunningActions() === 0) {//do screen shake
            const points = [];
            points.push(new cc.ScaleTo(scaleSpeed, scaleAmount));
            const numberOfShakes = getRandom(numberShakesMin, numberShakesMax);
            for (let i = 0; i < numberOfShakes; i++) {
                const shakeX = originalPosition.x + parseFloat(getRandom(shakeMinX, shakeMaxX));
                const shakeY = originalPosition.y + parseFloat(getRandom(shakeMinY, shakeMaxY));
                const action = new cc.MoveTo(shakeSpeed, cc.p(shakeX, shakeY));
                // action.easing(cc.easeBackOut());
                action.easing(cc.easeExponentialInOut());
                points.push(action);
            }
            points.push(new cc.MoveTo(shakeSpeed, originalPosition));
            points.push(new cc.ScaleTo(scaleSpeed, 1));
            const shakeSequence = new cc.Sequence(points);
            _shakeableNode.runAction(shakeSequence);
        }

        //We are doing it this way because there might be more than one effect triggered.
        //Possibly refactor into NVVM sturcture.
        const coinEffect = new cc.Sprite();
        const effectSprite = new cc.Sprite();
        coinEffect.setPosition(pos);
        effectSprite.setPosition(pos);

        let explosionSequence;

        if (fish.tier % 100 > 1) {

            const coinExplosionSequence = new cc.Sequence(GUIFunctions.getAnimation(ReferenceName.CoinExplosionEffect, 1/15), new cc.CallFunc(onCoinExplosionEffectEnd));
            coinEffect.runAction(coinExplosionSequence);
            coinEffect.setScale(1.5);
            // console.log("CoinExplode! : ", fish, coinEffect, coinExplosionSequence);
            GameView.addView(coinEffect);
        }
        if (fish.tier % 100 === 2) {
            cc.audioEngine.playEffect(res.FishCaptureEffectExplosionSound);
            explosionSequence = new cc.Sequence(GUIFunctions.getAnimation(ReferenceName.ExplosionEffect, 0.05), new cc.CallFunc(onExplosionEffectEnd));
            effectSprite.runAction(explosionSequence);
            GameView.addView(effectSprite);
            // console.log("Explode! : ", fish, effectSprite, explosionSequence);
        }else if (fish.tier % 100 === 3) {
            cc.audioEngine.playEffect(res.BigFishCaptureEffectExplosionSound);
            effectSprite.setScale(2);
            explosionSequence = new cc.Sequence(GUIFunctions.getAnimation(ReferenceName.LightEffect, 0.1), new cc.CallFunc(onExplosionEffectEnd));
            effectSprite.runAction(explosionSequence);
            GameView.addView(effectSprite);
        }

        function onExplosionEffectEnd() {
            GameView.destroyView(effectSprite);
        }

        function onCoinExplosionEffectEnd() {
            GameView.destroyView(coinEffect);
        }

        coinEffectsManager.triggerCoins(pos, target, fish);
    };

    proto.showFreeRoundEffect = function () {
        cc.audioEngine.playEffect(res.FreeGameSound);
        freeRoundEffectView.show();
    };

    function getRandom(randomMin, randomMax) {
        return (Math.random() * (randomMax - randomMin) + randomMin).toFixed(4);
    }

    return EffectsManager;
}());
