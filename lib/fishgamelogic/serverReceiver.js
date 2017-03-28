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
        //noinspection JSAnnotator (it thinks we are overwriting a const in FishingRoom.js, but we aren't)
        root.serverReceiver = factory();
    }
}(this, function () {
    const dbPlayLog = require('../../../Server/dbModules/dbPlayLog');
    const dbPlayerStats = require("../../../Server/dbModules/dbPlayerStats.js");
    const errorUtils = require("../../../Server/modules/errorUtils.js");

    // This module exists on the server.  It receives messages from clients, validates them, and takes the appropriate action.

    const options = {
        logPlayerActions: false,
    };

    //const isNormalNumber = n => typeof n === 'number' && !isNaN(n) && n > -Infinity && n < +Infinity;
    const isNormalNumber = Number.isFinite;

    const serverReceiver = function (roomPlayer, ioSocket, fishingRoom, serverArena) {

        ioSocket.on('g', data => {
            const gunId = data.g;
            if (options.logPlayerActions) {
                console.log("] player %s selected gunId=%s", roomPlayer.id, gunId);
            }

            const isValid = isNormalNumber(gunId);
            if (!isValid) {
                throw Error("Invalid Data");
            }

            if (!fishingRoom.config.gunClasses[gunId]) {
                roomPlayer.informClient.error(`No such gun with id=${gunId} exists`);
                return;
            }

            // Is the player allowed to switch gun?
            if (!serverArena.superArena.canSwitchGun()) {
                // @todo Include the gunId in this error message, so the client knows how to switch back
                roomPlayer.informClient.error(`Gun selection is locked at this time`);
                return;
            }

            roomPlayer.arenaPlayer.gunId = gunId;
            //fishingRoom.informAllClientsExcept(roomPlayer).playerSelectedGun(roomPlayer.id, gunId);
            fishingRoom.informAllClients.playerSelectedGun(roomPlayer.id, gunId);

            roomPlayer.lastActionTime = Date.now();
        });

        ioSocket.on('p', data => {
            const angle = data.a;
            if (options.logPlayerActions) {
                console.log(") player %s pointed gun to angle=%s", roomPlayer.id, angle);
            }

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
            if (options.logPlayerActions) {
                console.log("> player %s fired bullet with id=%s at angle=%s", roomPlayer.id, bulletId, angle);
            }

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
            const lastShootTime = roomPlayer.arenaPlayer.lastShootTime || -Infinity;
            const now = serverArena.superArena.getGameTime();
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
            const gunClass = serverArena.superArena.getGunClass(arenaPlayer.gunId);
            const bulletCost = serverArena.bulletsCostNothing() ? 0 : gunClass.value;

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
            const scoreChange = -bulletCost;
            const expChange = +1;
            if (bulletCost !== 0) {
                serverArena.changePlayerScoreAndXPOnServer(arenaPlayer.id, -bulletCost, expChange, roomPlayer);
            }
            dbPlayLog.logBulletFired(fishingRoom.gameConfigId, roomPlayer.playerData, arenaPlayer.gunId, scoreChange, expChange);

            dbPlayerStats.recordBulletFired(roomPlayer, bulletCost);

            serverArena.superArena.addBullet(roomPlayer.id, bulletId, arenaPlayer.gunId, bulletCost, angle, now);
            roomPlayer.arenaPlayer.lastShootTime = now;

            // In future we might inform all clients *except* 'roomPlayer', and let him immediately add the bullet to his client arena.
            fishingRoom.informAllClients.playerFiredBullet(roomPlayer.id, bulletId, arenaPlayer.gunId, bulletCost, angle, now);

            roomPlayer.lastActionTime = Date.now();
        });

        //ioSocket.on('requestStatsForThisGame', () => {
        //    const gameStats = dbPlayerGameStats.getGameStats(roomPlayer);
        //    roomPlayer.informClient.yourGameStatsAre(gameStats);
        //});

        // Deprecated (simply because not used): Use API call instead.
        //ioSocket.on('leaveGame', () => {
        //    fishingRoom.removePlayerFromRoom(roomPlayer)
        //        .catch(err => errorUtils.reportError(err))
        //});

        ioSocket.on('changeSeat', data => {
            const newSlot = data.s;

            const isValid = isNormalNumber(newSlot);
            if (!isValid) {
                throw Error("Invalid Data");
            }

            fishingRoom.changePlayersSeat(roomPlayer, newSlot);
        });

        return {
            stopListening: function () {
                ioSocket.clearAllListeners();
            },
        };
    };

    return serverReceiver;
}));