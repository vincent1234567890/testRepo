/**
 * Created by eugeneseah on 15/11/16.
 */

const ClientServerConnect = function () {
    "use strict";
    let _hasConnected = false;
    let _informServer ;
    //let _clientReceiver;
    let _gameWSClient;
    let _gameIOSocket;

    // let _debugSimulateLag = true;
    // let _debugGhosts = false;

    let _wasKickedOutByRemoteLogIn = false;

    const connectToMasterServer = function () {
        return new Promise((resolve, reject) => {
            // Do not connect if we are already connected!
            if (_hasConnected) return;

            // If the player logs in from somewhere else, our connection will be closed.
            // In that case, we should not reconnect.
            // If we reconnect, the log in process will cause the active login to be kicked out!
            // And that would create and endless cycle of clients fighting for the active login.
            if (_wasKickedOutByRemoteLogIn) return;

            let gameAPIServerUrl = 'ws://' + document.location.hostname + ':8088';
            // let gameAPIServerUrl = 'ws://192.168.1.16:8088';
            // const useJoeysServerDuringDevelopment = false;
            // const localNames = ['localhost', '127.0.0.1', '127.0.1.1', '0.0.0.0'];
            // const doingDevelopment = (localNames.indexOf(window.location.hostname) >= 0);
            // if (doingDevelopment) {
            //     gameAPIServerUrl = 'ws://127.0.0.1:8088';
            //     if (useJoeysServerDuringDevelopment) {
            //         gameAPIServerUrl = 'ws://192.168.1.16:8088';
            //     }
            // }

            // var clientServerConnect = this;

            const client = new WebSocketClient(gameAPIServerUrl);
            client.addService(new GameServices.GameService());
            client.addService(new PlayerServices.PlayerService());

            setGameWSClient(client);

            client.connect();
            client.addEventListener('open', function () {
                _hasConnected = true;

                client.callAPIOnce('game', 'requestServer', {}).then(
                    (serverList) => {
                        console.log("serverList:", serverList);
                        // Future: Maybe ping the servers here, then connect to the closest one
                    }
                ).catch(console.error.bind(console));

                if (typeof document !== 'undefined') {
                    var queryParams = getCurrentOrCachedQueryParams();
                    // Players without credentials will now auto log in as trial players
                    //if (queryParams.token && (queryParams.playerId || queryParams.email)) {
                    loginWithToken(queryParams.token, queryParams.playerId, queryParams.email, function (loginData) {
                        // If successful, remove the query parameters from the URL
                        window.history.pushState({where: 'start', search: document.location.search}, '', document.location.pathname);
                        // Start the game!
                        // AppManager.goToLobby();
                        // console.log(client);
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
                console.warn("You have been disconnected because you logged in from somewhere else.");
                // We don't actually need to close the socket here.  The server is about to close it for us!

                // We do need to stop trying to reconnect, at least until the player starts using this client again
                _wasKickedOutByRemoteLogIn = true;

                // @todo Show a nice message to the user

                // @todo When the user wants to reconnect again, set _wasKickedOutByRemoteLogIn back to false, and then call connectToMasterServer()
            });

            client.addEventListener('close', function () {
                _hasConnected = false;
                console.log("Disconnect detected." + (_wasKickedOutByRemoteLogIn ? "" : "  Will attempt reconnection soon..."));
                setTimeout(connectToMasterServer, 2000);

                setTimeout(cleanup, 0);
            });

            function cleanup(){
                GameManager.destroyArena();
                ClientServerConnect.postGameCleanup();
                AppManager.goBackToLobby();
            }
        });
    };

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

    const login = function (name, pass, onSuccess, onFailure) {
        const client = getGameWSClient();

        Promise.resolve().then(
            () => {
                return client.callAPIOnce('game', 'login', {
                    email: name,
                    password : pass,
                });
            }
        ).then(
            loginResponse => {
                console.log("loginResponse:", loginResponse);
                onSuccess(loginResponse.data.player);
                // return client.callAPIOnce('game', 'joinGame', {})
            }
        //).then(
        //     joinResponse => {
        //         console.log("joinResponse:", joinResponse);
        //
        //         var ioSocket = getGameIOSocket();
        //
        //         socketUtils.simulateNetworkLatency(ioSocket, 100);
        //
        //         var receiver = clientReceiver(ioSocket, GameCtrl.sharedGame());
        //
        //         informServer = serverInformer(ioSocket);
        //
        //         // GameManager.setServerInformer(informServer);
        //
        //         // clientServerConnect.startGameScene() will be run by clientReceiver when everything is ready.
        //     }
        // )
        ).catch(
            error => {
                console.log(error);
                if (onFailure) {
                    onFailure(error);
                } else {
                    console.error(error);
                }
            }
        );
    };

    const loginWithToken = function (token, playerId, email, onSuccess, onFailure) {
        const client = getGameWSClient();

        // Consider: We could provide an extra param here to say whether this is the first connect, or a reconnect.
        // In the case of an auto-reconnect, the server may decide to reject this login, if the player is currently
        // playing on another client.  This would solve the concern of a socket being closed before
        // the 'kickedByRemoteLogIn' event is received.

        client.callAPIOnce('game', 'login', {
            id: playerId,
            email: email,
            token: token,
        }).then(
            loginResponse => {
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
    };

    const joinGame = function (chosenScene) {
        const client = getGameWSClient();

        return Promise.resolve().then(
            () => {
                if (getServerInformer()) {
                    //registered events triggering multiple times are source of error.
                    throw Error("You are already in a game!");
                }

                console.log("Joining game");
                // self._connection.readyState != WebSocket.OPEN
                if (!client.isOpen()) {
                    throw Error("Socket is closed");
                }
                return client.callAPIOnce('game', 'joinGame', {scene: chosenScene});

            }

        ).then(
            joinResponse => {
                console.log("joinResponse:", joinResponse);

                // Wrapper which listens for game events
                const ioSocket = socketUtils.getIOSocketFromClient(client);
                // This object has on() and off() functions for receiving messages, and send() for sending them.
                //setGameIOSocket(ioSocket);
                AppManager.debugSimulateLag = true;
                AppManager.debugGhosts = false;

                if (AppManager.debugSimulateLag) {
                    socketUtils.simulateNetworkLatency(ioSocket, 100);
                }

                const receiver = clientReceiver(ioSocket);

                if (AppManager.debugGhosts) {
                    receiver.setupGhostingForSocket(ioSocket, 2000);
                }

                //setClientReceiver(receiver);

                setServerInformer(serverInformer(ioSocket));
                // _informServer = serverInformer(ioSocket);

                // GameManager.setServerInformer(informServer);

                // clientServerConnect.startGameScene() will be run by clientReceiver when everything is ready.
            }
        );
    };

    function leaveGame () {
        return _gameWSClient.callAPIOnce('game','leaveGame', {}).then(
            () => postGameCleanup()
        );
    }

    function postGameCleanup () {
        if (!_informServer) {
            return;
        }

        socketUtils.disengageIOSocketFromClient(_gameIOSocket, _gameWSClient);

        _informServer = undefined;
        //_clientReceiver = undefined;
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

    //var setClientReceiver = function (receiver) {
    //    _clientReceiver = receiver;
    //};

    function setServerInformer (informer) {
        _informServer = informer;
    }

    function getServerInformer() {
        return _informServer;
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

    function resetArena() {
        _clientReceiver.resetArena();
    }

    function getCurrentJackpotValues(){
        return _gameWSClient.callAPIOnce('game', 'getCurrentJackpotValues', {}).then(
            jackpotValueResponse => {
                console.log('jackpotValueResponse:', jackpotValueResponse);
                const total = Object_values(jackpotValueResponse.data).map(level => level.value).reduce((a, b) => a + b, 0);
                console.log('jackpotValueResponse:total:', total);
                //GameManager.updateJackpotPool(total);
                return jackpotValueResponse;
            }
        );
    }

    const Object_values = (obj) => Object.keys(obj).map(key => obj[key]);

    const changeSeatRequest = function (slot) {
        _informServer.changeSeat(slot);
    };

    function listUncollectedJackpots () {
        return _gameWSClient.callAPIOnce('game', 'listUncollectedJackpots', {});
    }

    function collectJackpot (rewardLogObjId) {
        return _gameWSClient.callAPIOnce('game', 'collectJackpot', {rewardLogObjId: rewardLogObjId});
    }

    const setFishLockRequest = function(fishId){
        _informServer.setTargetLockOnFish(fishId);
    };

    const unsetFishLockRequest = function () {
        console.log("unsetTargetLock");
        _informServer.unsetTargetLock();
    };

    function getGameSummaries (numDays) {
        return _gameWSClient.callAPIOnce('player', 'getGameSummaries', {hours: numDays * 24});
    }

    function getConsumptionLog (playerGameNumber, roundNumber) {
        return _gameWSClient.callAPIOnce('player', 'getConsumptionLog', {playerGameNumber: playerGameNumber, roundNumber: roundNumber});
    }

    function getRechargeLog (numDays) {
        return _gameWSClient.callAPIOnce('player', 'getRechargeLog', {hours: numDays * 24});
    }

    return {
        connectToMasterServer : connectToMasterServer,
        login : login,
        joinGame : joinGame,
        getServerInformer : getServerInformer,
        resetArena : resetArena,
        leaveGame : leaveGame,
        requestStats : requestStats,
        requestMyData : requestMyData,
        getGameWSClient: getGameWSClient,
        //getGameIOSocket: getGameIOSocket,
        postGameCleanup: postGameCleanup,
        listenForEvent: listenForEvent,
        changeSeatRequest : changeSeatRequest,
        listUncollectedJackpots: listUncollectedJackpots,
        collectJackpot: collectJackpot,
        getCurrentJackpotValues : getCurrentJackpotValues,
        setFishLockRequest : setFishLockRequest,
        unsetFishLockRequest : unsetFishLockRequest,
        getGameSummaries: getGameSummaries,
        getConsumptionLog : getConsumptionLog,
        getRechargeLog : getRechargeLog,
    };
}();
