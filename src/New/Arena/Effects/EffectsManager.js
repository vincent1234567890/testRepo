/**
 * Created by eugeneseah on 21/2/17.
 */

const EffectsManager = (function () {
    let coinEffectsManager;
    const EffectsManager = function () {
        coinEffectsManager = new CaptureCoinEffectManager();
    };

    const proto = EffectsManager.prototype;

    proto.doCapturePrizeEffect = function (pos, target, fish) {
        coinEffectsManager.triggerCoins(pos, target, fish);
    };

    return EffectsManager;
}());