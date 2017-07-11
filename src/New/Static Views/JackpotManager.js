/**
 * Created by eugeneseah on 10/3/17.
 */

const JackpotManager = (function () {
    "use strict";

    let _view;
    let _jackpotFloatPanel;

    const JackpotManager = function (data) {
        _view = new JackpotView();
        // If I add the first created JackpotView to the welcome page, it loses its icon forever.
        //NotificationManager.placeNotificationPanelBelowJackpotPanel(_view.getJackpotPanel());
    };

    const proto = JackpotManager.prototype;

    proto.unattach = function () {
        _view.unattach();
    };

    proto.updateJackpot = function (jackpotValueResponse) {
        const total = Object.keys(jackpotValueResponse.data).map(key => jackpotValueResponse.data[key]).map(level => level.value).reduce((a, b) => a + b, 0);
        _view.updateJackpot(total);
        if (_jackpotFloatPanel) {
            _jackpotFloatPanel.updateJackpot(total);
        }
    };

    proto.reattach = function () {
        _view.reattach();
        NotificationManager.placeNotificationPanelBelowJackpotPanel(_view.getJackpotPanel(), '');
    };

    proto.setJackpotFloatPanel = function (jackpotFloatPanel) {
        _jackpotFloatPanel = jackpotFloatPanel;
        NotificationManager.placeNotificationPanelBelowJackpotPanel(_jackpotFloatPanel, 'TableSelection');
    };

    return JackpotManager;
}());