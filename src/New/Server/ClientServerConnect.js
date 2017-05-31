//connector of the game server.
const ClientServerConnect = function () {
    "use strict";

    const srvList = window["serverList"];
    const masterServerUrl = srvList ? 'ws://' + srvList["masterServer"] : 'ws://' + document.location.hostname + ':8089';
    // This is optional.  It is a fallback in case other servers do not work.
    const defaultGameAPIServerAddress = srvList ? srvList["defaultGameServer"] : document.location.hostname + ':8088';

    let _masterServerSocket = null;

    let _currentGameServerUrl = null;
    let _serverInformer;
    let _gameWSClient;
    let _gameIOSocket;

    let _nextDisconnectIsExpected = false;
    let _wasKickedOutByRemoteLogIn = false;

    let _loginParams = null;

    let _sendHeartbeatToGameServerIntervalId = null;

    function getMasterServerSocket () {
        if (!_masterServerSocket) {
            const socket = io.connect(masterServerUrl + '/player');
            //socket.on('connect', function(){});
            //socket.on('event', function(data){});
            //socket.on('disconnect', function(){});
            _masterServerSocket = socket;
        }
        return _masterServerSocket;
    }

    function doInitialConnect () {
        if (_wasKickedOutByRemoteLogIn) {
            return Promise.reject(Error("We were kicked.  Clear _wasKickedOutByRemoteLogIn if you want to reconnect."));
        }

        console.log(`Requesting initial game server from master server...`);

        // Without any join prefs, this will just give us the least busy game server to join initially
        const joinPrefs = {};
        return connectToARecommendedGameServer(joinPrefs);
    }

    function connectToARecommendedGameServer (joinPrefs) {
        return socketEmitPromise(getMasterServerSocket(), 'getRecommendedServers', joinPrefs).then(recommendedServers => {
            //console.log("recommendedServers:", recommendedServers);

            // In case none of the recommended servers work, add the default server as a fallback
            recommendedServers.push(defaultGameAPIServerAddress);

            const tryNextGameServer = () => {
                if (recommendedServers.length === 0) {
                    throw Error("Failed to join any of the recommended servers");
                }

                // Remove the first server from the list
                const urlToUse = 'ws://' + recommendedServers.shift();

                // Connect to that server, but if it fails, try the next one
                return connectToGameServer(urlToUse).catch(error => {
                    // This might happen if the gameServer has filled up just when we were trying to connect to it
                    console.warn(`Failed to connect to recommended server:`, error);
                    return tryNextGameServer();
                });
            };

            return tryNextGameServer();
        }, error => {
            // We arrive here if the master server did not respond, or was not awake.
            console.warn(`Problem getting recommended server from the master server:`, error);
            console.warn(`So falling back to default: ${defaultGameAPIServerAddress}`);
            return connectToGameServer('ws://' + defaultGameAPIServerAddress);
        });
    }

    function socketEmitPromise (socket /* ...args... */) {
        const args = Array.prototype.slice.call(arguments, 1);
        return new Promise((resolve, reject) => {
            args.push(function (err, response) {
                if (err) return reject(err);
                resolve(response);
            });
            socket.emit.apply(socket, args);
            setTimeout(() => {
                reject(Error(`Socket call (${JSON.stringify(args.slice(0, args.length - 1))}) timed out`));
            }, 15000);
        });
    }

    function connectToGameServer (gameAPIServerUrl) {
        return new Promise((resolve, reject) => {
            // Do not connect if we are already connected to that server
            if (_currentGameServerUrl === gameAPIServerUrl) {
                console.log(`Already on recommended server, so no need to reconnect.`);
                // @todo We should return the earlier loginResponseData here, or alternatively skip the following connect code and do the login again
                // Luckily right now the loginResponseData is not being used for anything.
                resolve();
                return;
            }

            // If the player logs in from somewhere else, our connection will be closed.
            // In that case, we should not reconnect.
            // If we reconnect, the log in process will cause the active login to be kicked out!
            // And that would create and endless cycle of clients fighting for the active login.
            if (_wasKickedOutByRemoteLogIn) {
                return Promise.reject(Error("We were kicked.  Clear _wasKickedOutByRemoteLogIn if you want to reconnect."));
            }

            const oldClient = getGameWSClient();
            if (oldClient) {
                console.log(`Disconnecting from old gameServer`);
                _currentGameServerUrl = null;
                clearServerInformer();
                try {
                    oldClient.disconnect();
                    // When that disconnect event is fired, do not take too much notice of it
                    // @todo Perhaps this variable should be specific to the oldClient that expects it
                    _nextDisconnectIsExpected = true;
                } catch (error) {
                    // This might happen if the old client is already disconnected
                    // In those cases, there is no reason even to log the error
                    console.warn("Error while trying to disconnect from old client:", error);
                }
                setGameWSClient(null);
            }

            console.log(`Connecting to ${gameAPIServerUrl} ...`);

            // Reject the promise if the connect stalls for some reason
            // @todo However if we really do time out, we should consider removing the event listeners below, otherwise
            // a late connect might later also produce a 'close' event, which if unexpected, could trigger cleanup()
            // and doInitialConnect() again!
            setTimeout(
                () => reject(Error("Timeout while connecting to " + gameAPIServerUrl)),
                15000
            );

            const client = new WebSocketClient(gameAPIServerUrl);
            client.addService(new GameServices.GameService());
            client.addService(new PlayerServices.PlayerService());

            setGameWSClient(client);

            client.connect();

            client.addEventListener('open', function () {
                _currentGameServerUrl = gameAPIServerUrl;

                clearInterval(_sendHeartbeatToGameServerIntervalId);
                _sendHeartbeatToGameServerIntervalId = setInterval(sendHeartbeatToGameServer, 15 * 1000);

                if (typeof document !== 'undefined') {
                    if (!_loginParams) {
                        // We keep the login credentials in memory, so that we can log in to other gameServers later.
                        _loginParams = getCurrentOrCachedQueryParams();
                    }
                    // Players without credentials will now auto log in as trial players
                    //if (queryParams.token && (queryParams.playerId || queryParams.email)) {
                    loginWithParams(_loginParams, function (loginData) {
                        // If successful, remove the query parameters from the URL
                        window.history.pushState({where: 'start', search: document.location.search}, '', document.location.pathname);
                        // Start the game!
                        // AppManager.goToLobby();
                        // console.log(client);
                        GameManager.setupPostLoginListeners();
                        resolve(loginData);
                    });

                    // // This is example code to demonstrate how to collect stats from
                    // // It can be removed, commented,  or used elsewhere.
                    // Promise.resolve().then(
                    //     //() => client.callAPIOnce('player', 'authPlayer', {playerId: queryParams.playerId, token: queryParams.token}).then(
                    //     //    authResponse => {
                    //     //        console.log("authResponse:", authResponse);
                    //     //    }
                    //     //)
                    //
                    //     // But we don't need to use that auth mechanism if the login above completes
                    //     () => new Promise(resolve => setTimeout(resolve, 8000))
                    // ).then(
                    //     () => client.callAPIOnce('player', 'getConsumptionLog', {}).then(
                    //         consumptions => {
                    //             console.log("consumptions:", consumptions);
                    //             GameManager.setConsumptionLogData(consumptions);
                    //         }
                    //     )
                    // ).catch(console.error.bind(console));
                }
            });

            ClientServerConnect.listenForEvent('kickedByRemoteLogIn', data => {
                console.log("You have been disconnected because you logged in from somewhere else.");
                // We don't actually need to close the socket here.  The server is about to close it for us!

                // We do need to stop trying to reconnect, at least until the player starts using this client again
                _wasKickedOutByRemoteLogIn = true;

                // @todo Show a nice message to the user

                // @todo When the user wants to reconnect again, set _wasKickedOutByRemoteLogIn back to false, and then call doInitialConnect()
            });

            client.addEventListener('close', function () {
                // This is an expected disconnect, e.g. because we are switching to a different game server
                if (_nextDisconnectIsExpected) {
                    console.log("Disconnected ok.");
                    _nextDisconnectIsExpected = false;
                    return;
                }

                // This was an unexpected disconnect, e.g. because the net went down, or the server crashed
                _currentGameServerUrl = null;
                setTimeout(cleanup, 0);
                if (_wasKickedOutByRemoteLogIn) {
                    console.log("Disconnect detected.  We were kicked, so will not auto-reconnect.  Will wait for player activity.");
                } else {
                    console.log("Disconnect detected.  Will reconnect and return to lobby soon...");
                    setTimeout(() => doInitialConnect().catch(console.error), 2000);
                }
            });

            function cleanup(){
                // GameManager.destroyArena();
                GameManager.exitToLobby();
                ClientServerConnect.postGameCleanup();
                // AppManager.goBackToLobby();
            }
        });
    }

    function sendHeartbeatToGameServer () {
        try {
            // This will only work when we are in a game
            if (ClientServerConnect.getServerInformer()) {
                ClientServerConnect.getServerInformer().sendHeartbeat();
            }
            // The socket bug can happen even when we are outside a game
            //const client = getGameWSClient();
            //if (client) {
            //    const message = {service: 'game', functionName: 'heartbeat', data: {}};
            //    client._connection.send(JSON.stringify(message));
            //}
        } catch (e) {
            console.log("Could not send heartbeat to server: " + e);
        }
    }

    function parseQueryParams (searchString) {
        if (searchString === undefined) {
            searchString = document.location.search;
        }
        var queryParams = {};
        searchString.substring(1).split('&').forEach(
            pair => {
                var splitPair = pair.split('=');
                var key = decodeURIComponent(splitPair[0]);
                var val = decodeURIComponent(splitPair[1]);
                queryParams[key] = val;
            }
        );
        return queryParams;
    }

    // If there are no current queryParams, then look for previous queryParams in localStorage
    // This allows us or the player to reload the page, even after the queryParams have been removed from the URL.
    // This isn't really needed in production, but is pretty useful for development and testing.
    function getCurrentOrCachedQueryParams () {
        let searchString = document.location.search;

        if (window.localStorage) {
            if (searchString) {
                localStorage['FishGame_Cached_Query_Params'] = searchString;
            } else {
                searchString = localStorage['FishGame_Cached_Query_Params'] || '';
            }
        }

        return parseQueryParams(searchString);
    }

    // Requirement: In production environments, if a player closes their tab, and then shortly afterwards a malicious
    // user has access to that machine, that user should not be able to log in to the player's account.
    //
    // To meet this requirement, we will drop the token from localStorage if the server requests it.
    function forgetCachedQueryParams () {
        if (window.localStorage) {
            localStorage['FishGame_Cached_Query_Params'] = '';
        }
    }

    function loginWithParams (loginParams, onSuccess, onFailure) {
        const client = getGameWSClient();

        // Consider: We could provide an extra param here to say whether this is the first connect, or a reconnect.
        // In the case of an auto-reconnect, the server may decide to reject this login, if the player is currently
        // playing on another client.  This would solve the concern of a socket being closed before
        // the 'kickedByRemoteLogIn' event is received.

        client.callAPIOnce('game', 'login', {
            playerId: loginParams.playerId,
            // If we don't have the playerId, we can log in with channelId and username
            channel: loginParams.channelId,
            username: loginParams.username,
            // Or with their email
            email: loginParams.email,
            // But in all cases, the player needs to provide their secretAuthToken
            token: loginParams.token,
        }).then(
            loginResponse => {
                if (loginResponse.data && loginResponse.data.version) {
                    console.log("Server version: " + loginResponse.data.version);
                }
                if (loginResponse.data && loginResponse.data.forgetYourToken) {
                    forgetCachedQueryParams();
                }
                console.log("loginResponse:", loginResponse);
                onSuccess(loginResponse.data);
            }
        ).catch(
            error => {
                if (onFailure) {
                    onFailure(error);
                } else {
                    console.error(error);
                }
            }
        );
    }

    function joinGame (chosenScene, seat, type) {
        const joinPrefs = {scene: chosenScene, preferredSeat: seat, singlePlay: type === TableType.SINGLE};

        console.log(`Requesting suitable game server from master server...`);

        return connectToARecommendedGameServer(joinPrefs).then(
            loginResponseData => {
                console.log("loginResponseData:", loginResponseData);
            }
        ).then(
            () => {
                const client = getGameWSClient();

                if (getServerInformer()) {
                    //registered events triggering multiple times are source of error.
                    throw Error("You are already in a game!");
                }

                console.log("Joining game");
                // self._connection.readyState != WebSocket.OPEN
                if (!client.isOpen()) {
                    throw Error("Socket is closed");
                }
                return client.callAPIOnce('game', 'joinGame', joinPrefs);
            }
        ).then(
            joinResponse => {
                console.log("joinResponse:", joinResponse);

                const client = getGameWSClient();

                // Wrapper which listens for game events
                // This object has on() and off() functions for receiving messages, and send() for sending them.
                const ioSocket = socketUtils.getIOSocketFromClient(client);

                AppManager.debugSimulateLag = true;
                AppManager.debugGhosts = false;

                if (AppManager.debugSimulateLag) {
                    socketUtils.simulateNetworkLatency(ioSocket, 100);
                }

                const receiver = clientReceiver(ioSocket);

                if (AppManager.debugGhosts) {
                    receiver.setupGhostingForSocket(ioSocket, 2000);
                }

                setServerInformer(serverInformer(ioSocket));
            }
        );
    }

    function leaveGame () {
        return _gameWSClient.callAPIOnce('game', 'leaveGame', {}).then(
            () => postGameCleanup()
        );
    }

    function postGameCleanup () {
        if (!_serverInformer) {
            return;
        }

        socketUtils.disengageIOSocketFromClient(_gameIOSocket, _gameWSClient);

        clearServerInformer();
    }

    function requestStats() {
        return _gameWSClient.callAPIOnce('game','getMyGameStats', {});
    }

    function requestMyData(){
        return _gameWSClient.callAPIOnce('game', 'getMyStatus', {});
    }

    function setGameWSClient (client) {
        _gameWSClient = client;
    }

    function getGameWSClient () {
        return _gameWSClient;
    }

    //var setGameIOSocket = function (ioSocket) {
    //    _gameIOSocket = ioSocket;
    //};
    //var getGameIOSocket = function () {
    //    return _gameIOSocket;
    //};

    function clearServerInformer () {
        _serverInformer = null;
    }

    function setServerInformer (informer) {
        _serverInformer = informer;
    }

    function getServerInformer() {
        return _serverInformer;
    }

    function listenForEvent (wsFuncName, callback) {
        // Listens for the specified message to be pushed from the server, without any request being made first.
        const service = _gameWSClient.getService('game');
        const wsFunc = service[wsFuncName];
        if (!wsFunc) {
            throw Error("The wsFunc '" + wsFuncName + "' that was passed to listenForEvent() does not exist!");
        }
        wsFunc.addListener(callback);
    }

    function getCurrentJackpotValues(){
        return _gameWSClient.callAPIOnce('game', 'getCurrentJackpotValues', {}).then(
            jackpotValueResponse => {
                console.log('jackpotValueResponse:', jackpotValueResponse);
                // const total = Object_values(jackpotValueResponse.data).map(level => level.value).reduce((a, b) => a + b, 0);
                // console.log('jackpotValueResponse:total:', total);
                //GameManager.updateJackpotPool(total);
                return jackpotValueResponse;
            }
        );
    }

    const Object_values = (obj) => Object.keys(obj).map(key => obj[key]);

    const changeSeatRequest = function (slot) {
        _serverInformer.changeSeat(slot);
    };

    function listUncollectedJackpots () {
        return _gameWSClient.callAPIOnce('game', 'listUncollectedJackpots', {});
    }

    function collectJackpot (rewardLogObjId) {
        return _gameWSClient.callAPIOnce('game', 'collectJackpot', {rewardLogObjId: rewardLogObjId});
    }

    const setFishLockRequest = function(fishId){
        _serverInformer.setTargetLockOnFish(fishId);
    };

    const unsetFishLockRequest = function () {
        console.log("unsetTargetLock");
        _serverInformer.unsetTargetLock();
    };

    function getGameSummaries (numDays) {
        return _gameWSClient.callAPIOnce('player', 'getGameSummaries', {hours: numDays * 24});
    }

    function getProfileStats () {
        return _gameWSClient.callAPIOnce('player', 'getProfileStats').then(response => response.data);
    }

    function getConsumptionLog (playerGameNumber, roundNumber, index, limit) { // index is pagination
        return _gameWSClient.callAPIOnce('player', 'getConsumptionLog', {playerGameNumber: playerGameNumber, roundNumber: roundNumber, index : index, limit:limit});
    }

    function getRechargeLog (numDays) {
        return _gameWSClient.callAPIOnce('player', 'getRechargeLog', {hours: numDays * 24});
    }

    function changePlayerDisplayName (newDisplayName) {
        return _gameWSClient.callAPIOnce('player', 'changePlayerDisplayName', {newDisplayName: newDisplayName});
    }

    function getLeaderboard(){
        return _gameWSClient.callAPIOnce('player', 'getTopRankedPlayers');
    }

    return {
        doInitialConnect: doInitialConnect,
        joinGame: joinGame,
        getServerInformer: getServerInformer,
        leaveGame: leaveGame,
        requestStats: requestStats,
        requestMyData: requestMyData,
        getGameWSClient: getGameWSClient,
        postGameCleanup: postGameCleanup,
        listenForEvent: listenForEvent,
        changeSeatRequest: changeSeatRequest,
        listUncollectedJackpots: listUncollectedJackpots,
        collectJackpot: collectJackpot,
        getCurrentJackpotValues: getCurrentJackpotValues,
        setFishLockRequest: setFishLockRequest,
        unsetFishLockRequest: unsetFishLockRequest,

        getGameSummaries: getGameSummaries,
        getProfileStats: getProfileStats,
        getConsumptionLog: getConsumptionLog,
        getRechargeLog: getRechargeLog,
        changePlayerDisplayName: changePlayerDisplayName,
        getLeaderboard: getLeaderboard,
    };
}();
