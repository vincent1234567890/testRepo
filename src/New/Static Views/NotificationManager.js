const NotificationManager = (function () {
    "use strict";

    let _notificationsPanel;

    // Perhaps the notification panel should have its own manager

    function createNewNotificationPanel () {
        const pnNotification = new NotificationPanel(440, 32, true);
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

    const NotificationManager = {
        //createNewNotificationPanel,
        placeNotificationsPanelBelowJackpotPanel,
    };

    return NotificationManager;
}());