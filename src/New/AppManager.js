/**
 * Created by eugeneseah on 6/2/17.
 */

//what is the different of AppManager and GameManager?
const AppManager = (function () {
    "use strict";

    let _currentScene;
    let _gameTicker;

    function goToLobby(loginData) {
        // cc.director.popScene();
        _currentScene = new cc.Scene();
        cc.director.runScene(_currentScene);
        GameManager.initialiseLogin(_currentScene);
        GameManager.goToLobby(goBackToLobby,goToSeatSelection);
    }

    function goToGame(fishGameArena){
        if(!_gameTicker) {
            _gameTicker = new GameTicker(GameManager.updateEverything);
        }else{
            _currentScene.removeChild(_gameTicker,false);
        }

        _currentScene = new cc.Scene();
        cc.director.pushScene(_currentScene);

        _currentScene.addChild(_gameTicker);
        GameManager.initialiseGame(_currentScene, fishGameArena);
        _gameTicker.unpauseTicker();
    }

    function goToSeatSelection(gameSelection, playerData){
        // Original seat selection code:
        //_currentScene = new SeatSelectionScene(gameSelection, playerData, onSeatSelected);

        // New table + seat selection code:
        const lobbyType = gameSelection;
        const selectionMadeCallback = (joinPrefs) => {
            joinPrefs.scene = lobbyType;
            onRoomSelected(joinPrefs);
        };

        _currentScene = new ef.TableSelectionScene(gameSelection, playerData, selectionMadeCallback);
        cc.director.pushScene(_currentScene);
        GameManager.enterSeatSelectionScene(_currentScene);

        // @todo We should update the list regularly, until the callback is called, or the selection scene is abandoned (btnBack calls exitToLobby)
        ClientServerConnect.getListOfRoomsByServer().then(listOfRoomsByServer => {
            console.log("listOfRoomsByServer:", listOfRoomsByServer);
            // Prepare the rooms for passing to TableSelectionScene
            const allRoomStates = [];
            listOfRoomsByServer.forEach(server => {
                server.rooms.forEach(room => {
                    room.server = server;
                    allRoomStates.push(room);
                });
            });
            if (_currentScene instanceof ef.TableSelectionScene) {
                _currentScene.updateRoomStates(allRoomStates);
            }
        }).catch(console.error);
    }

    function onSeatSelected(type,seat){
        GameManager.seatSelected(type,seat);
    }

    function onRoomSelected (joinPrefs) {
        GameManager.roomSelected(joinPrefs);
    }

    function goBackToLobby(){
        if (_gameTicker) {
            _gameTicker.pauseTicker();
            _currentScene.removeChild(_gameTicker, false);
        }
        cc.director.popToSceneStackLevel(1);
        setTimeout(initialiseGameManager, 0);
    }

    function initialiseGameManager(){
        GameManager.initialiseLogin(cc.director.getRunningScene());
        GameManager.resetLobby();
    }

    return{
        goToLobby : goToLobby,
        goToGame : goToGame,
        goBackToLobby : goBackToLobby,
    }
}());