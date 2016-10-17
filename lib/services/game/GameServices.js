/******************************************************************
 *        NinjaPandaManagement
 *  Copyright (C) 2015-2016 Sinonet Technology Singapore Pte Ltd.
 *  All rights reserved.
 ******************************************************************/

(function(){
    var isNode = (typeof module !== 'undefined' && module.exports);

    var rootObj = {};

    //create and add async function to WebSocketService
    var addServiceFunctions = function(sinonet, service, functionNames){
        for( var i = 0; i < functionNames.length; i++ ){
            service[functionNames[i]] = new sinonet.WebSocketAsyncFunction(functionNames[i]);
            service.addFunction(service[functionNames[i]]);
        }
    };

    var defineGameService = function(sinonet){
        var GameService = function(connection){
            sinonet.WebSocketService.call(this, "game", connection);

            //define functions
            var functionNames = [
                "registerNewPlayer",
                "login",
                "requestServer",
                "joinGame",
            ];
            addServiceFunctions(sinonet, this, functionNames);
        };
        GameService.prototype = Object.create(sinonet.WebSocketService.prototype);
        GameService.prototype.constructor = GameService;

        rootObj.GameService = GameService;
    };
    
    // Individual services should be declared above, and called in here
    var defineServices = function(sinonet){
        defineGameService(sinonet);
    };

    if(isNode){
        var sinonet = require("./../../server_common/WebSocketService");
        defineServices(sinonet);
        module.exports = rootObj;
    } else {
        define(["common/WebSocketService"], function(sinonet){
            defineServices(sinonet);
            return rootObj;
        });
    }
})();