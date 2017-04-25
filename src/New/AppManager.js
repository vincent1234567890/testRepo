/**
 * Created by eugeneseah on 6/2/17.
 */

const AppManager = (function () {
    "use strict";

    let _currentScene;
    let _gameTicker;

    function goToLobby(loginData) {
        // cc.director.popScene();
        _currentScene = new cc.Scene();
        cc.director.runScene(_currentScene);
        GameManager.initialiseLogin(_currentScene, loginData);
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

    function goToSeatSelection(gameSelection){
        _currentScene = new SeatSelectionScene(gameSelection, onSeatSelected);
        cc.director.pushScene(_currentScene);
        GameManager.enterSeatSelectionScene(_currentScene);
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