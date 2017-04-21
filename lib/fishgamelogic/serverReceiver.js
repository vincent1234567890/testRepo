"use strict";

// UMD (Universal Module Definition) returnExports.js
(function (root, factory) {
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
    const dbModel = require('../../../Server/dbModules/dbModel');
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

            try {
                if (roomPlayer.targetLockOnFishId) {
                    //noinspection ExceptionCaughtLocallyJS
                    throw Error("You cannot shoot while auto-firing");
                }

                serverArena.requestFireBullet(roomPlayer, bulletId, angle);
            } catch (error) {
                roomPlayer.informClient.error(error.message);
            }
        });

        ioSocket.on('l', data => {
            const fishId = data.f;

            if (!fishId) {
                throw Error("Invalid Data: no 'f' property (fishId) provided");
            }

            serverArena.requestSetPlayerLockOnFish(roomPlayer, fishId);
        });

        ioSocket.on('lo', data => {
            serverArena.requestSetPlayerLockOnFish(roomPlayer, null);

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

        ioSocket.on('jackpotGameStarted', data => {
            const jackpotId = data.j;

            const isValid = typeof jackpotId === 'string' && jackpotId[0] === 'J';
            if (!isValid) {
                throw Error("Invalid Data");
            }

            dbModel.jackpotRewardLog.findOne({
                playerId: roomPlayer.playerData.id,
                jackpotId: jackpotId
            }).then(
                jackpotRewardLog => {
                    // We don't send the whole object to other players in the room.
                    // We send just enough info for them to display the minigame.
                    const jackpotRewardObject = {
                        lotteryPattern: jackpotRewardLog.lotteryPattern,
                        level: jackpotRewardLog.level,
                        rewardValue: jackpotRewardLog.rewardValue,
                    };
                    fishingRoom.informAllClientsExcept(roomPlayer).playerStartedJackpotGame(roomPlayer.id, jackpotRewardObject);
                }
            ).catch(errorUtils.reportError);
        });

        ioSocket.on('jackpotBoxOpened', data => {
            const boxNumber = data.b;

            console.log("data:", data);

            const isValid = isNormalNumber(boxNumber);
            if (!isValid) {
                throw Error("Invalid Data");
            }

            fishingRoom.informAllClientsExcept(roomPlayer).playerOpenedJackpotBox(boxNumber);
        });

        return {
            stopListening: function () {
                ioSocket.clearAllListeners();
            },
        };
    };

    return serverReceiver;
}));