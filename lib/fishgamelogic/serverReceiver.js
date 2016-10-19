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
    // This module exists on the server.  It receives messages from clients, validates them, and takes the appropriate action.

    const serverReceiver = function (player, ioSocket, fishGame, arena) {

        ioSocket.on('g', data => {
            const gunId = data.g;
            console.log("player %s selected gunId=%s", player.playerId, gunId);

            // @todo: Check if the player has access to that gun!

            player.gunId = gunId;
            fishGame.informAllClientsExcept.playerSelectedGun(player, player.playerId, gunId);
        });

        ioSocket.on('p', data => {
            const angle = data.a;
            console.log("player %s pointed gun to angle=%s", player.playerId, angle);

            player.gunAngle = angle; // Probably not needed
            fishGame.informAllClientsExcept.playerPointedGun(player, player.playerId, angle);
        });

        ioSocket.on('b', data => {
            const bulletId = data.b;
            const angle = data.a;
            console.log("player %s fired bullet with id=%s at angle=%s", player.playerId, bulletId, angle);

            const splitParts = bulletId.split(':');
            if (splitParts[0] !== String(player.playerId)) {
                player.informClient.error("bulletId '" + bulletId + "' must be of the form '<your_playerId>:<counter>'.  (Your playerId is '" + player.playerId + "')");
                return;
            }

            // @todo Check refire time, and spawn if possible
        });

    };

    return serverReceiver;
}));