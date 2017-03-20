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

    proto.updateJackpot = function (value) {
        _view.updateJackpot(value);
    };

    return JackpotManager;
}());