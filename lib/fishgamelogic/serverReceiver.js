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
    const dbPlayLog = require('../../../Server/dbModules/dbPlayLog');
    const dbPlayerGameStats = require("../../../Server/dbPlayerGameStats.js");

    // This module exists on the server.  It receives messages from clients, validates them, and takes the appropriate action.

    // @todo The data here should be validated, otherwise it might cause errors to be thrown, either now or later (based on the data).
    // Errors thrown when a message is being processed will be caught by the try...catch in socketUtils.
    // However errors thrown later, due to invalid data being passed around the system, might not be caught!

    const serverReceiver = function (player, ioSocket, fishGame, arena) {

        ioSocket.on('g', data => {
            const gunId = data.g;
            console.log("] player %s selected gunId=%s", player.id, gunId);

            // @todo: Check if the player has access to that gun!
            if (!fishGame.config.gunClasses[gunId]) {
                player.informClient.error(`No such gun with id=${gunId} exists`);
                return;
            }

            player.arenaPlayer.gunId = gunId;
            fishGame.informAllClientsExcept(player).playerSelectedGun(player.id, gunId);
        });

        ioSocket.on('p', data => {
            const angle = data.a;
            console.log(") player %s pointed gun to angle=%s", player.id, angle);

            player.arenaPlayer.gunAngle = angle; // Probably not needed
            fishGame.informAllClientsExcept(player).playerPointedGun(player.id, angle);
        });

        ioSocket.on('b', data => {
            const bulletId = data.b;
            const angle = data.a;
            console.log("> player %s fired bullet with id=%s at angle=%s", player.id, bulletId, angle);

            const gameConfig = fishGame.config;

            const splitParts = bulletId.split(':');
            if (splitParts[0] !== String(player.id)) {
                player.informClient.error(`bulletId '${bulletId}' must be of the form '<your_playerId>:<counter>'.  (Your playerId is '${player.id}')`);
                return;
            }

            // Check refire time, and reject the request if illegal
            const lastShootTime = player.lastShootTime || -Infinity;
            const now = arena.getGameTime();
            const timeSinceLastShot = now - lastShootTime;
            if (timeSinceLastShot < 0.98 * gameConfig.shootInterval) {
                // This might happen if the player was experiencing network congestion (lag) and then it cleared.
                // We will not register this shot, and wait for the next one.
                // We could make this message shorter, or skip it entirely.
                player.informClient.error("You are trying to fire too quickly.  Requested shot will not be fired.");
                return;
            }

            // Check player credits
            const arenaPlayer = player.arenaPlayer;
            const gunClass = arena.getGunClass(arenaPlayer.gunId);
            const bulletCost = gunClass.bulletCost;
            if (arenaPlayer.score < bulletCost) {
                player.informClient.error("You cannot afford to fire this bullet.  You should know that already!");
                return;
            }

            // Dock player credits
            arena.changePlayerScore(arenaPlayer.id, -bulletCost, player);
            dbPlayLog.logBulletFired(player.playerData._id, arenaPlayer.gunId, -bulletCost);

            dbPlayerGameStats.recordBulletFired(player, bulletCost);

            arena.spawnBullet(player.id, bulletId, arenaPlayer.gunId, angle, now);
            player.lastShootTime = now;

            // In future we might inform all clients *except* 'player', and let him immediately add the bullet to his client arena.
            fishGame.informAllClients.playerFiredBullet(player.id, bulletId, arenaPlayer.gunId, angle, arena.getGameTime());
        });

        ioSocket.on('requestGameStats', data => {
            const gameStats = dbPlayerGameStats.getGameStats(player);
            player.informClient.yourGameStatsAre(gameStats);
        });

    };

    return serverReceiver;
}));