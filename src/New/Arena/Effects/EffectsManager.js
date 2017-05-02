/**
 * Created by eugeneseah on 21/2/17.
 */

const EffectsManager = (function () {//总的效果控制器
    let coinEffectsManager;
    let freeRoundEffectView;
    const EffectsManager = function () {
        coinEffectsManager = new CaptureCoinEffectManager();
        freeRoundEffectView = new FreeRoundView();
    };

    const proto = EffectsManager.prototype;

    proto.doCapturePrizeEffect = function (pos, target, fish) {
        coinEffectsManager.triggerCoins(pos, target, fish);
    };

    proto.showFreeRoundEffect = function () {
        console.log("showFreeRoundEffect");
        freeRoundEffectView.show();
    };

    return EffectsManager;
}());