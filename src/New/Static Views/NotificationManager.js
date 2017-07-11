const NotificationManager = (function () {
    "use strict";

    let _notificationsPanel;

    // Perhaps the notification panel should have its own manager

    function createNewNotificationPanel () {
        const pnNotification = new NotificationPanel(440, 32);
        GameManager.setGlobalNotificationPanel(pnNotification);
        return pnNotification;
    }

    function placeNotificationsPanelBelowJackpotPanel (jackpotPanel, currentScreen) {
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
        notificationsPanel.setPosition(jackpotPanel.getPositionX() - notificationsPanel._szSize.width / 2, jackpotPanel.getPositionY() - 120);
        newContainer.addChild(notificationsPanel);

        notificationsPanel.styleForScreen(currentScreen);

        notificationsPanel.showNotification("Hello, this is an Elsa's message for testing notification................");
    }

    const NotificationManager = {
        //createNewNotificationPanel,
        placeNotificationsPanelBelowJackpotPanel: placeNotificationsPanelBelowJackpotPanel,
    };

    return NotificationManager;
}());