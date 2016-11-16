/**
 * Created by eugeneseah on 15/11/16.
 */

var ClientServerConnect = function () {
    let _hasConnected = false;
    let informServer;


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
            // Wrapper which listens for game events
            var ioSocket = socketUtils.getIOSocketFromClient(client);
            // This object has on() and off() functions for receiving messages, and send() for sending them.
            setGameIOSocket(ioSocket);

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

    var login = function ( name, pass) {
        var client = getGameWSClient();

        Promise.resolve().then(
            () => {
                // Create a test player
                var playerName = name + "testplayername" + Date.now() + Math.floor(Math.random() * 100000000);

                var playerData = {
                    name: playerName,
                    email: playerName + '@testmail189543.com',
                    password: 'test_password.12345',
                    // password: password,
                };
                return client.callAPIOnce('game', 'registerNewPlayer', playerData).then(
                    response => response.data
                );
            }
        ).then
        (
            // Log in
            (testPlayer) => client.callAPIOnce('game', 'login', {
                id: testPlayer.id,
                password: 'test_password.12345'
            })
        )
            .then(
            loginResponse => {
                console.log("loginResponse:", loginResponse);

                // return client.callAPIOnce('game', 'joinGame', {})
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
            .catch(console.error.bind(console));
    };

    var joinGame = function (gameId) {
        var client = getGameWSClient();
        Promise.resolve().then(
            () => {
                return client.callAPIOnce('game', 'joinGame', {})
            }
        ).then(
            joinResponse => {
                console.log("joinResponse:", joinResponse);

                var ioSocket = getGameIOSocket();

                socketUtils.simulateNetworkLatency(ioSocket, 100);

                var receiver = clientReceiver(ioSocket, GameCtrl.sharedGame()); // @TODO : move to GameManager?

                informServer = serverInformer(ioSocket);

                // GameManager.setServerInformer(informServer);

                // clientServerConnect.startGameScene() will be run by clientReceiver when everything is ready.
            }
        ).catch(console.error.bind(console));
    };



    var setGameWSClient = function (client) {
        this.gameWSClient = client;
    };

    var getGameWSClient = function () {
        return this.gameWSClient;
    };

    var setGameIOSocket = function (ioSocket) {
        this.gameIOSocket = ioSocket;
    };
    var getGameIOSocket = function () {
        return this.gameIOSocket;
    };


    var ClientServerConnect = {
        connectToMasterServer : connectToMasterServer,
        login : login,
        joinGame : joinGame,
        serverInformer : informServer,
    };

    return ClientServerConnect;
}();