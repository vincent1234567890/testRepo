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
        GameManager.goToLobby(goBackToLobby, goToSeatSelection);
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
            onRoomSelected(joinPrefs).catch(error => {
                // Sometimes even in healthy conditions we can fail to join the selected game,
                // e.g. because another player took the seat just 1ms before us.
                console.error("Failed to join game:", error);
                // Offer the seat selection screen again:
                console.log("Showing seat selection scene again");
                cc.director.popToSceneStackLevel(1);
                goToSeatSelection(gameSelection, playerData);
            }).catch(console.error);
        };

        _currentScene = new ef.TableSelectionScene(gameSelection, playerData, GameManager.getChannelType(), selectionMadeCallback);
        cc.director.pushScene(_currentScene);
        GameManager.enterSeatSelectionScene(_currentScene);
    }

    function onSeatSelected(type,seat){
        GameManager.seatSelected(type,seat);
    }

    function onRoomSelected (joinPrefs) {
        return GameManager.roomSelected(joinPrefs);
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