"use strict";

// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root.serverReceiver = factory();
    }
}(this, function () {
    // This module exists on the server.  It receives messages from clients and takes the appropriate action.

    const serverReceiver = function (player, ioSocket, fishGame, arena) {

        ioSocket.on('g', data => {
            const gunId = data.g;
            console.log("player %s selected gunId=%s", player.slot, gunId);
            // @todo
        });

        ioSocket.on('p', data => {
            const angle = data.a;
            console.log("player %s pointed gun to angle=%s", player.slot, angle);
            // @todo
        });

        ioSocket.on('b', data => {
            const bulletId = data.b;
            const angle = data.a;
            console.log("player %s fired bullet with id=%s at angle=%s", player.slot, bulletId, angle);

            const splitParts = bulletId.split(':');
            if (splitParts[0] !== String(player.playerId)) {
                player.informClient.error("bulletId must be of the form \"<your_slotId>:<counter>\"");
                return;
            }

            // @todo
        });

    };

    return serverReceiver;
}));