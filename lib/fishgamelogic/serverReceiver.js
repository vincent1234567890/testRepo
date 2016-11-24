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
    const dbPlayerGameStats = require("../../../Server/dbModules/dbPlayerGameStats.js");
    const errorUtils = require("../../../Server/modules/errorUtils.js");

    // This module exists on the server.  It receives messages from clients, validates them, and takes the appropriate action.

    //const isNormalNumber = n => typeof n === 'number' && !isNaN(n) && n > -Infinity && n < +Infinity;
    const isNormalNumber = Number.isFinite;

    const serverReceiver = function (roomPlayer, ioSocket, fishingRoom, arena) {

        ioSocket.on('g', data => {
            const gunId = data.g;
            console.log("] player %s selected gunId=%s", roomPlayer.id, gunId);

            const isValid = isNormalNumber(gunId);
            if (!isValid) {
                throw Error("Invalid Data");
            }

            // @todo: Check if the player has access to that gun!
            if (!fishingRoom.config.gunClasses[gunId]) {
                roomPlayer.informClient.error(`No such gun with id=${gunId} exists`);
                return;
            }

            roomPlayer.arenaPlayer.gunId = gunId;
            fishingRoom.informAllClientsExcept(roomPlayer).playerSelectedGun(roomPlayer.id, gunId);

            roomPlayer.lastActionTime = Date.now();
        });

        ioSocket.on('p', data => {
            const angle = data.a;
            console.log(") player %s pointed gun to angle=%s", roomPlayer.id, angle);

            const isValid = isNormalNumber(angle);
            if (!isValid) {
                throw Error("Invalid Data");
            }

            roomPlayer.arenaPlayer.gunAngle = angle; // Probably not needed
            fishingRoom.informAllClientsExcept(roomPlayer).playerPointedGun(roomPlayer.id, angle);

            roomPlayer.lastActionTime = Date.now();
        });

        ioSocket.on('b', data => {
            const bulletId = data.b;
            const angle = data.a;
            console.log("> player %s fired bullet with id=%s at angle=%s", roomPlayer.id, bulletId, angle);

            const isValid = typeof bulletId === 'string' && isNormalNumber(angle);
            if (!isValid) {
                throw Error("Invalid Data");
            }

            const gameConfig = fishingRoom.config;

            const splitParts = bulletId.split(':');
            if (splitParts[0] !== String(roomPlayer.id)) {
                roomPlayer.informClient.error(`bulletId '${bulletId}' must be of the form '<your_playerId>:<counter>'.  (Your playerId is '${roomPlayer.id}')`);
                return;
            }

            // Check refire time, and reject the request if illegal
            const lastShootTime = roomPlayer.lastShootTime || -Infinity;
            const now = arena.getGameTime();
            const timeSinceLastShot = now - lastShootTime;
            if (timeSinceLastShot < 0.98 * gameConfig.shootInterval) {
                // This might happen if the player was experiencing network congestion (lag) and then it cleared.
                // We will not register this shot, and wait for the next one.
                // We could make this message shorter, or skip it entirely.
                roomPlayer.informClient.error("Your gun is still reloading.");
                return;
            }

            // Check player credits
            const arenaPlayer = roomPlayer.arenaPlayer;
            const gunClass = arena.getGunClass(arenaPlayer.gunId);
            const bulletCost = gunClass.bulletCost;
            if (arenaPlayer.score < bulletCost) {
                // This could happen if the client fires a second bullet before it receives acknowledgement of the first bullet
                roomPlayer.informClient.error("You cannot afford to fire this bullet.");
                return;
            }

            if (arenaPlayer.bulletsOnScreen >= gameConfig.maxBulletsPerPlayer) {
                roomPlayer.informClient.error("Maximum bullets exceeded.");
                return;
            }

            // Dock player credits
            arena.changePlayerScore(arenaPlayer.id, -bulletCost, roomPlayer);
            dbPlayLog.logBulletFired(roomPlayer.playerData, arenaPlayer.gunId, -bulletCost);

            dbPlayerGameStats.recordBulletFired(roomPlayer, bulletCost);

            arena.spawnBullet(roomPlayer.id, bulletId, arenaPlayer.gunId, angle, now);
            roomPlayer.lastShootTime = now;

            arenaPlayer.bulletsOnScreen++;

            // In future we might inform all clients *except* 'roomPlayer', and let him immediately add the bullet to his client arena.
            fishingRoom.informAllClients.playerFiredBullet(roomPlayer.id, bulletId, arenaPlayer.gunId, angle, now);

            roomPlayer.lastActionTime = Date.now();
        });

        ioSocket.on('requestStatsForThisGame', () => {
            const gameStats = dbPlayerGameStats.getGameStats(roomPlayer);
            roomPlayer.informClient.yourGameStatsAre(gameStats);
        });

        // Deprecated (simply because not used): Use API call instead.
        //ioSocket.on('leaveGame', () => {
        //    fishingRoom.removePlayer(roomPlayer)
        //        .catch(err => errorUtils.reportError(err))
        //});

        return {
            stopListening: function () {
                ioSocket.clearAllListeners();
            },
        };
    };

    return serverReceiver;
}));