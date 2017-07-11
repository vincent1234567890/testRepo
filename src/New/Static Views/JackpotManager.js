/**
 * Created by eugeneseah on 10/3/17.
 */

const JackpotManager = (function () {
    "use strict";

    let _view;
    let _jackpotFloatPanel;

    let _notificationsPanel;

    const JackpotManager = function (data) {
        _view = new JackpotView();
        // If I add the first created JackpotView to the welcome page, it loses its icon forever.
        //placeNotificationsPanelBelowJackpotPanel(_view.getJackpotPanel());
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
        placeNotificationsPanelBelowJackpotPanel(_view.getJackpotPanel());
    };

    proto.setJackpotFloatPanel = function (jackpotFloatPanel) {
        _jackpotFloatPanel = jackpotFloatPanel;
        placeNotificationsPanelBelowJackpotPanel(_jackpotFloatPanel);
    };

    // Perhaps the notification panel should have its own manager

    function createNewNotificationPanel () {
        const pnNotification = new ef.NotificationPanel(440, 32, true);
        GameManager.setGlobalNotificationPanel(pnNotification);
        return pnNotification;
    }

    function placeNotificationsPanelBelowJackpotPanel (jackpotPanel) {
        if (!jackpotPanel) {
            console.warn("No jackpotPanel to add to!");
            return;
        }

        _notificationsPanel = _notificationsPanel || createNewNotificationPanel();

        const notificationsPanel = _notificationsPanel;

        const oldContainer = notificationsPanel.getParent();
        if (oldContainer) {
            oldContainer.removeChild(notificationsPanel);
        }

        const newContainer = jackpotPanel.getParent();
        console.log("notificationsPanel.getContentSize():", notificationsPanel.getContentSize());
        notificationsPanel.setPosition(jackpotPanel.getPositionX() - notificationsPanel._szSize.width / 2, jackpotPanel.getPositionY() - 100);
        newContainer.addChild(notificationsPanel);
        //notificationsPanel.removeChild(notificationsPanel._spNotificationIcon);
        //notificationsPanel._spNotificationIcon.setPosition(18, 18);
        //notificationsPanel.addChild(notificationsPanel._spNotificationIcon);
        notificationsPanel.showNotification("Hello, this is an Elsa's message for testing notification................");
    }

    return JackpotManager;
}());