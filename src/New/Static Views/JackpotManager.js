/**
 * Created by eugeneseah on 10/3/17.
 */

const JackpotManager = (function () {
    "use strict";

    let _view;
    const JackpotManager = function (data) {
        _view = new JackpotView();
    };

    const proto = JackpotManager.prototype;

    proto.unattach = function () {
        _view.unattach();
    };

    proto.updateJackpot = function (jackpotValueResponse) {
        const total = Object.keys(jackpotValueResponse.data).map(key => jackpotValueResponse.data[key]).map(level => level.value).reduce((a, b) => a + b, 0);
        _view.updateJackpot(total);
    };

    proto.reattach = function () {
        _view.reattach();
    };

    return JackpotManager;
}());