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

    // @todo Change this into goToRoomSelection() ?
    function goToSeatSelection(gameSelection, playerData){
        // Original seat selection code:
        _currentScene = new SeatSelectionScene(gameSelection, playerData, onSeatSelected);
        cc.director.pushScene(_currentScene);
        GameManager.enterSeatSelectionScene(_currentScene);

        // New code for room selection:
        //GameManager.enterRoomSelectionScene(_currentScene);
        ClientServerConnect.getListOfRoomsByServer().then(listOfRoomsByServer => {
            console.log("listOfRoomsByServer:", listOfRoomsByServer);
            // Display the rooms
            // ...
        }).catch(console.error);
    }

    function onSeatSelected(type,seat){
        GameManager.seatSelected(type,seat);
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