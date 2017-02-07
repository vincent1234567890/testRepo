/**
 * Created by eugeneseah on 6/2/17.
 */

const AppManager = (function () {
    "use strict";

    let _currentScene;
    let _gameTicker;

    function goToLobby() {
        // cc.director.popScene();
        _currentScene = new cc.Scene();
        cc.director.runScene(_currentScene);
        GameManager.initialiseLogin(_currentScene);
        GameManager.goToLobby(goBackToLobby);
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

    function goBackToLobby(){
        _gameTicker.pauseTicker();
        _currentScene.removeChild(_gameTicker,false);
        _currentScene = new cc.Scene();
        cc.director.runScene(_currentScene);
        GameManager.initialiseLogin(_currentScene);

        // _gameTicker.pauseTicker();
        // _currentScene.removeChild(_gameTicker,false);
        // cc.director.popScene();
        // _currentScene = cc.director.getRunningScene();
        // GameManager.initialiseLogin(_currentScene);
    }

    return{
        goToLobby : goToLobby,
        goToGame : goToGame,
    }

}());