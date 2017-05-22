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
    const utilityService = require('../../../Server/modules/utilityService.js');

    // This module exists on the server.  It receives messages from clients, validates them, and takes the appropriate action.
    // receive client message. only for server
    const options = {
        logPlayerActions: false,
    };

    //const isNormalNumber = n => typeof n === 'number' && !isNaN(n) && n > -Infinity && n < +Infinity;
    const isNormalNumber = Number.isFinite;
    const serverReceiver = function (roomPlayer, ioSocket, fishingRoom, serverArena) {
        //client select a gun.
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

        //pointed gun.
        ioSocket.on('a', data => {
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

        //fire bullet.
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

        //left arena
        ioSocket.on('l', data => {
            const fishId = data.f;
            if (!fishId) {
                throw Error("Invalid Data: no 'f' property (fishId) provided");
            }
            serverArena.requestSetPlayerLockOnFish(roomPlayer, fishId);
        });

        //lock a fish.
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

        //change the seat.
        ioSocket.on('changeSeat', data => {
            const newSlot = data.s;
            const isValid = isNormalNumber(newSlot);
            if (!isValid) {
                throw Error("Invalid Data");
            }
            fishingRoom.changePlayersSeat(roomPlayer, newSlot);
        });

        //start jackpot game.
        ioSocket.on('requestStartJackpotGame', data => {
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
                    if (serverArena.gameIsPaused()) {
                        // Deny request to play jackpot game
                        return;
                    }

                    serverArena.pauseGame({why: 'jackpot_game', playerRoomId: roomPlayer.id});

                    // Let the player know his jackpot minigame can start
                    const jackpotRewardObject = jackpotRewardLog.toObject();
                    jackpotRewardObject.playerDisplayName = roomPlayer.playerData.displayName || roomPlayer.playerData.name;
                    roomPlayer.informClient.playerStartedJackpotGame(roomPlayer.id, jackpotRewardObject);
                    // Let the other players in the room know too
                    // We don't send the whole object to other players in the room.
                    // We send just enough info for them to display the minigame.
                    const jackpotRewardObjectReduced = utilityService.selectProps(jackpotRewardObject, 'lotteryPattern, level, rewardValue, playerDisplayName');
                    fishingRoom.informAllClientsExcept(roomPlayer).playerStartedJackpotGame(roomPlayer.id, jackpotRewardObjectReduced);
                }
            ).catch(errorUtils.reportError);
        });

        //open jackpot box.
        ioSocket.on('jackpotBoxOpened', data => {
            const boxNumber = data.b;
            const isValid = isNormalNumber(boxNumber);
            if (!isValid) {
                throw Error("Invalid Data");
            }
            fishingRoom.informAllClientsExcept(roomPlayer).playerOpenedJackpotBox(boxNumber);
        });

        ioSocket.on('jackpotGameOver', () => {
            serverArena.jackpotGameEnded();
        });

        // Received heartbeat
        ioSocket.on('hb', () => {
            roomPlayer.lastHeartbeatTime = Date.now();
        });

        return {
            stopListening: function () {
                ioSocket.clearAllListeners();
            },
        };
    };

    return serverReceiver;
}));