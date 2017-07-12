const NotificationPanel = cc.Node.extend({
    _spNotificationBase: null,
    _spNotificationIcon: null,
    _cpClippingNode: null,
    _lbNotification: null,
    _szSize: null,
    _duration: 6,

    isScrolling: false,
    // If a message is currently scrolling, its details will be stored here
    _currentNotification: null,

    ctor: function (width, height) {
        cc.Node.prototype.ctor.call(this);
        this._className = "NotificationPanel";

        const szSize = this._szSize = new cc.Size(width || 100, height || 30);

        // Background (works):
        const spNotificationBase = this._spNotificationBase = new cc.Sprite("#LR_NotificationBase.png");
        // Background (@todo does not work!):
        //const spNotificationBase = this._spNotificationBase = new cc.Sprite("#NotificationBackground.png");
        const spNotificationSize = spNotificationBase.getContentSize();
        spNotificationBase.setPosition(szSize.width * 0.5, szSize.height * 0.5);
        spNotificationBase.setScale(szSize.width / spNotificationSize.width, szSize.height / spNotificationSize.height);
        this.addChild(spNotificationBase);

        const padding = 36;

        const dnStencil = new cc.DrawNode();
        const rectangle = [cc.p(0, 0), cc.p(szSize.width - 2 * padding, 0), cc.p(szSize.width - 2 * padding, szSize.height),
            cc.p(0, szSize.height)], green = new cc.Color(0, 255, 0, 255);
        dnStencil.drawPoly(rectangle, green, 3, green);

        const cpClippingNode = this._cpClippingNode = new cc.ClippingNode(dnStencil);
        cpClippingNode.setPosition(padding, 0);
        this.addChild(cpClippingNode);

        //const testLayer = new cc.LayerColor(new cc.Color(255, 0, 0, 255));
        //cpClippingNode.addChild(testLayer);

        const lbNotification = this._lbNotification = new cc.LabelTTF("", "Arial", 18);
        lbNotification.setPosition(szSize.width * 0.5, szSize.height * 0.5);
        cpClippingNode.addChild(lbNotification);

        const spNotificationIcon = this._spNotificationIcon = new cc.Sprite(ReferenceName.NotificationIcon);
        spNotificationIcon.setPosition(18, 18);
        this.addChild(spNotificationIcon);

        // Initial state
        this.setInitialFade();
    },

    showNotification: function (message, callback, target) {
        const lbNotification = this._lbNotification;
        if (!message) {
            lbNotification.setString("");
            if (callback)
                callback.call(target);
            return;
        }

        this.isScrolling = true;
        this._currentNotification = {message, callback, target};

        const szSize = this._szSize;
        lbNotification.stopAllActions();
        lbNotification.setString(message);
        const contentSize = this._lbNotification.getContentSize();
        lbNotification.setPosition(szSize.width + contentSize.width * 0.5, szSize.height * 0.5);
        lbNotification.runAction(cc.sequence(
            cc.moveBy(this._duration, -(szSize.width + contentSize.width), 0),
            cc.callFunc(() => {
                this.isScrolling = false;
                this._currentNotification = null;
                if (callback)
                    callback.call(target);
                }
            )
        ));
    },

    /**
     * When we move the notificationPanel to a new parent, its current scrolling animation stops.
     * This is especially problematic when we are waiting for the animations callback!
     * It happens even if we set cleanup=false and try to resume like this:
     *
     *     notificationPanel.removeFromParent(false);
     *     newContainer.addChild(notificationPanel);
     *     notificationPanel.lbNotification.resume();
     *
     * So after moving the panel to its new parent, you should call notificationPanel.resumeScrolling() to restart
     * the currently playing message, and ensure the callback will eventually get called.
     */
    resumeScrolling: function () {
        const n = this._currentNotification;
        if (n) {
            this.showNotification(n.message, n.callback, n.target);
        }
    },

    styleForScreen: function (currentScreen) {
        const showBackground = currentScreen !== 'TableSelection';
        const showIcon = currentScreen === 'TableSelection';
        this._spNotificationBase.setVisible(showBackground);
        this._spNotificationIcon.setVisible(showIcon);
    },

    setInitialFade: function () {
        this._spNotificationBase.setOpacity(0);
    },

    fadeIn: function () {
        this._spNotificationBase.stopAllActions();
        this._spNotificationBase.runAction(cc.sequence(cc.fadeIn(1)));
    },

    fadeOut: function () {
        this._spNotificationBase.stopAllActions();
        this._spNotificationBase.runAction(cc.sequence(cc.fadeOut(1)));
    },
});