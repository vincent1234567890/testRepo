/**
 * Created by eugeneseah on 6/2/17.
 */

const AppManager = (function () {
    "use strict";

    let _currentScene;

    function goToLobby() {
        console.log("lobby!");
        _currentScene = new cc.Scene();
        cc.director.runScene(_currentScene);
        GameManager.initialiseLogin(_currentScene);
        GameManager.goToLobby();
    }

    function goToGame(fishGameArena){
        _currentScene = new cc.Scene();
        cc.director.runScene(_currentScene);
        GameManager.initialiseGame(_currentScene, fishGameArena);
    }

    return{
        goToLobby : goToLobby,
        goToGame : goToGame,
    }

}());