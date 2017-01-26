/**
 * Created by eugeneseah on 15/11/16.
 */

"use strict";

const ClientServerConnect = function () {

    let _hasConnected = false;
    let _informServer ;
    //let _clientReceiver;
    let _gameWSClient;
    let _gameIOSocket;


    const connectToMasterServer = function () {
        if (_hasConnected) return;
        const useJoeysServerDuringDevelopment = false;

        let gameAPIServerUrl = 'ws://' + document.location.hostname + ':8088';

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
        const gameService = new GameServices.GameService();
        client.addService(gameService);

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

            if (typeof document !== 'undefined' && document.location.search) {
                var queryParams = parseQueryParams();
                if (queryParams.token && (queryParams.playerId || queryParams.email)) {
                    loginWithToken(queryParams.token, queryParams.playerId, queryParams.email, function () {
                        // If successful, remove the query parameters from the URL
                        window.history.pushState({where: 'start', search: document.location.search}, '', document.location.pathname);
                        // Start the game!
                        GameManager.goToLobby();
                    });
                }
            }
        });
    };

    function parseQueryParams () {
        var queryParams = {};
        document.location.search.substring(1).split('&').forEach(
            pair => {
                var splitPair = pair.split('=');
                var key = decodeURIComponent(splitPair[0]);
                var val = decodeURIComponent(splitPair[1]);
                queryParams[key] = val;
            }
        )
        return queryParams;
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

        client.callAPIOnce('game', 'login', {
            id: playerId,
            email: email,
            token: token,
        }).then(
            loginResponse => {
                console.log("loginResponse:", loginResponse);
                onSuccess(loginResponse.data.player);
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
                return client.callAPIOnce('game', 'joinGame', {scene: chosenScene});
            }
        ).then(
            joinResponse => {
                console.log("joinResponse:", joinResponse);

                // Wrapper which listens for game events
                const ioSocket = socketUtils.getIOSocketFromClient(client);
                // This object has on() and off() functions for receiving messages, and send() for sending them.
                //setGameIOSocket(ioSocket);

                GameCtrl.debugSimulateLag = true;
                GameCtrl.debugGhosts = false;
                if (GameCtrl.debugSimulateLag) {
                    socketUtils.simulateNetworkLatency(ioSocket, 100);
                }
                if (GameCtrl.debugGhosts) {
                    clientReceiver.ghostActors(ioSocket, 2000);
                }

                const receiver = clientReceiver(ioSocket, GameCtrl.sharedGame()); // @TODO : move to GameManager?

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

    function resetArena() {
        _clientReceiver.resetArena();
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
        //getGameIOSocket: getGameIOSocket,
        postGameCleanup: postGameCleanup,
    };
}();
