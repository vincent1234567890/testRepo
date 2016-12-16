/******************************************************************
 *        NinjaPandaManagement
 *  Copyright (C) 2015-2016 Sinonet Technology Singapore Pte Ltd.
 *  All rights reserved.
 ******************************************************************/

// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["common/WebSocketService"], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require("../../../../Server/server_common/WebSocketService"));
    }
    else {
        root.APIServices = factory(root.WebSocketService);
    }
}(this, function (sinonet) {
    var rootObj = {};

    //create and add async function to WebSocketService
    var addServiceFunctions = function(sinonet, service, functionNames){
        for( var i = 0; i < functionNames.length; i++ ){
            service[functionNames[i]] = new sinonet.WebSocketAsyncFunction(functionNames[i]);
            service.addFunction(service[functionNames[i]]);
        }
    };

    var defineAPIService = function(sinonet){
        var APIService = function(connection){
            sinonet.WebSocketService.call(this, "api", connection);

            //define functions
            var functionNames = [
                "recharge",
                "rechargestatus",
                "betlog",
            ];
            addServiceFunctions(sinonet, this, functionNames);
        };
        APIService.prototype = Object.create(sinonet.WebSocketService.prototype);
        APIService.prototype.constructor = APIService;

        rootObj.APIService = APIService;
    };

    // Individual services should be declared above, and called in here
    var defineServices = function(sinonet){
        defineAPIService(sinonet);
    };

    defineServices(sinonet);

    return rootObj;
}));