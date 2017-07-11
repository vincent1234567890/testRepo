const NotificationManager = (function () {
    "use strict";

    let notificationPanel;

    // Perhaps the notification panel should have its own manager

    function createNewNotificationPanel () {
        const pnNotification = new NotificationPanel(440, 32);
        GameManager.setGlobalNotificationPanel(pnNotification);
        return pnNotification;
    }

    function placeNotificationPanelBelowJackpotPanel (jackpotPanel, currentScreen) {
        if (!jackpotPanel) {
            console.warn("No jackpotPanel to add to!");
            return;
        }

        notificationPanel = notificationPanel || createNewNotificationPanel();

        const oldContainer = notificationPanel.getParent();
        if (oldContainer) {
            oldContainer.removeChild(notificationPanel);
        }

        const newContainer = jackpotPanel.getParent();
        notificationPanel.setPosition(jackpotPanel.getPositionX() - notificationPanel._szSize.width / 2, jackpotPanel.getPositionY() - 120);
        newContainer.addChild(notificationPanel);

        notificationPanel.styleForScreen(currentScreen);

        notificationPanel.showNotification("Hello, this is an Elsa's message for testing notification................");
    }

    const NotificationManager = {
        //createNewNotificationPanel,
        placeNotificationPanelBelowJackpotPanel: placeNotificationPanelBelowJackpotPanel,
    };

    return NotificationManager;
}());