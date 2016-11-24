/**
 * Created by eugeneseah on 15/11/16.
 */

"use strict";

var ClientServerConnect = function () {

    let _hasConnected = false;
    let _informServer ;
    //let _clientReceiver;
    let _gameWSClient;
    let _gameIOSocket;


    var connectToMasterServer = function () {
        if (_hasConnected) return;
        const useJoeysServerDuringDevelopment = true;

        let gameAPIServerUrl = 'ws://3dfishing88888.sinonet.sg:8088';

        const localNames = ['localhost', '127.0.0.1', '127.0.1.1', '0.0.0.0'];
        const doingDevelopment = (localNames.indexOf(window.location.hostname) >= 0);
        if (doingDevelopment) {
            gameAPIServerUrl = 'ws://127.0.0.1:8088';
            if (useJoeysServerDuringDevelopment) {
                gameAPIServerUrl = 'ws://192.168.1.18:8088';
            }
        }

        var clientServerConnect = this;

        var client = new WebSocketClient(gameAPIServerUrl);
        var gameService = new GameServices.GameService();
        client.addService(gameService);

        setGameWSClient(client);

        client.connect();
        client.addEventListener('open', function () {
            Promise.resolve().then(
                () => client.callAPIOnce('game', 'requestServer', {})
            ).then(
                (serverList) => {
                    console.log("serverList:", serverList);
                    // Future: Maybe ping the servers here, then connect to the closest one
                }
            ).catch(console.error.bind(console));
        });
    };

    var login = function ( name, pass, callback) {
        var client = getGameWSClient();

        Promise.resolve().then(
            () => {

                return client.callAPIOnce('game', 'login', {
                            email: name,
                            password : pass,
                        })

            }
        ).then(
            loginResponse => {
                console.log("loginResponse:", loginResponse);
                callback(true);
                // return client.callAPIOnce('game', 'joinGame', {})
            }, error => {
                    console.log(error);
                    callback(false);
                }


        )
            // .then(
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
            .catch( error => {
                console.error(error);
            });
    };

    var joinGame = function (gameId) {
        const client = getGameWSClient();

        return Promise.resolve().then(
            () => {
                if (getServerInformer()) {
                    //registered events triggering multiple times are source of error.
                    throw Error("You are already in a game!");
                }

                console.log("Joining game");
                return client.callAPIOnce('game', 'joinGame', {gameId: gameId});
            }
        ).then(
            joinResponse => {
                console.log("joinResponse:", joinResponse);

                // Wrapper which listens for game events
                var ioSocket = socketUtils.getIOSocketFromClient(client);
                // This object has on() and off() functions for receiving messages, and send() for sending them.
                //setGameIOSocket(ioSocket);

                GameCtrl.debugGhosts = false;
                if (GameCtrl.debugGhosts) {
                    clientReceiver.ghostActors(ioSocket, 2000);
                }
                socketUtils.simulateNetworkLatency(ioSocket, 100);

                var receiver = clientReceiver(ioSocket, GameCtrl.sharedGame()); // @TODO : move to GameManager?

                //setClientReceiver(receiver);

                setServerInformer(serverInformer(ioSocket));
                // _informServer = serverInformer(ioSocket);

                // GameManager.setServerInformer(informServer);

                // clientServerConnect.startGameScene() will be run by clientReceiver when everything is ready.
            }
        );
    };

    function leaveGame () {
        const client = getGameWSClient();

        return getGameWSClient().callAPIOnce('game','leaveGame', {}).then(
            () => {
                const ioSocket = _gameIOSocket;
                socketUtils.disengageIOSocketFromClient(ioSocket, client);

                _informServer = undefined;
                //_clientReceiver = undefined;
            }
        );
    }

    function requestStats() {
        return getGameWSClient().callAPIOnce('game','getMyStats', {});
    }



    var setGameWSClient = function (client) {
        _gameWSClient = client;
    };

    var getGameWSClient = function () {
        return _gameWSClient;
    };

    //var setGameIOSocket = function (ioSocket) {
    //    _gameIOSocket = ioSocket;
    //};
    //var getGameIOSocket = function () {
    //    return _gameIOSocket;
    //};

    //var setClientReceiver = function (receiver) {
    //    _clientReceiver = receiver;
    //};

    var setServerInformer = function (informer) {
        _informServer = informer;
    };

    var getServerInformer = function () {
        return _informServer;
    };

    var resetArena = function () {
        _clientReceiver.resetArena();
    };



    var ClientServerConnect = {
        connectToMasterServer : connectToMasterServer,
        login : login,
        joinGame : joinGame,
        getServerInformer : getServerInformer,
        resetArena : resetArena,
        leaveGame : leaveGame,
        requestStats : requestStats,
        //getGameIOSocket: getGameIOSocket,
    };

    return ClientServerConnect;
}();
