// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["common/WebSocketService"], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require("./../../server_common/WebSocketService"));
    }
    else {
        root.GameServices = factory(root.WebSocketService);
    }
}(this, function (wsService) {
    var rootObj = {};

    //create and add async function to WebSocketService
    var addServiceFunctions = function(wsService, service, functionNames){
        for( var i = 0; i < functionNames.length; i++ ){
            service[functionNames[i]] = new wsService.WebSocketAsyncFunction(functionNames[i]);
            service.addFunction(service[functionNames[i]]);
        }
    };

    var defineGameService = function(wsService){
        var GameService = function(connection){
            wsService.WebSocketService.call(this, "game", connection);

            //define functions
            var functionNames = [
                "registerNewPlayer",
                "login",
                "getLobbyInfo",
                "joinGame",
                "leaveGame",
                "getMyStatus",
                "getPlayerProfiles",
                "getMyGameStats",
                "checkBonusCoins",
                "collectBonusCoins",
                "creditChangeEvent",
                "jpVals",
                "kickedByRemoteLogIn",
                "getCurrentJackpotValues",
                "listUncollectedJackpots",
                "collectJackpot",
                "checkLatency",
                "someoneWonAJackpot",
                "broadcastAnnouncement",
            ];
            addServiceFunctions(wsService, this, functionNames);
        };
        GameService.prototype = Object.create(wsService.WebSocketService.prototype);
        GameService.prototype.constructor = GameService;

        rootObj.GameService = GameService;
    };
    
    // Individual services should be declared above, and called in here
    var defineServices = function(wsService){
        defineGameService(wsService);
    };

    defineServices(wsService);

    return rootObj;
}));
