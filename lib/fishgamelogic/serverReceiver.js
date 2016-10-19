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

            const gameConfig = fishGame.config;

            const splitParts = bulletId.split(':');
            if (splitParts[0] !== String(player.playerId)) {
                player.informClient.error(`bulletId '${bulletId}' must be of the form '<your_playerId>:<counter>'.  (Your playerId is '${player.playerId}')`);
                return;
            }

            // Check refire time, and spawn the bullet if legal
            const lastShootTime = player.lastShootTime || 0;
            const timeSinceLastShot = Date.now() - lastShootTime;
            if (timeSinceLastShot < 0.9 * gameConfig.shootInterval) {
                // @todo We should not keep this, it is far too long for a player who really is experiencing lag!
                player.informClient.error("You are trying to fire too quickly, or you are experiencing network lag.  Requested shot will not be fired.");
                return;
            }

            // @consider refactoring this, and maybe also the check(s) above, so that the client can use it too
            const bulletSpeed = gameConfig.defaultBulletSpeed;
            const newBullet = {
                id: bulletId,
                owner: player.playerId,
                position: player.cannonPosition,
                velocity: [bulletSpeed * Math.cos(angle), bulletSpeed * Math.sin(angle)],
            };
            arena.addBullet(newBullet);

            // In future we might inform all clients *except* 'player', and let him immediately add the bullet to his client arena.
            fishGame.informAllClients.playerFiredBullet(player.playerId, bulletId, angle, arena.getGameTime(), player.gunId);
        });

    };

    return serverReceiver;
}));