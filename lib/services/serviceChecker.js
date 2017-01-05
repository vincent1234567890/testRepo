"use strict";

function checkClientScriptMatchesAPIActions (clientServicesScriptFile, serviceName, listOfAPIActions) {
    return checkClientScriptHasFunctions(clientServicesScriptFile, serviceName, listOfAPIActions);
}

function checkClientScriptMatchesService (clientServicesScriptFile, serviceName, ServiceImplement) {
    const serviceImplement = new ServiceImplement();
    const listOfFunctionNames = serviceImplement._functions.map(f => f.name);
    return checkClientScriptHasFunctions(clientServicesScriptFile, serviceName, listOfFunctionNames);
}

// Helper function: Warns developer if we have forgotten to add any of the functions to the client script
function checkClientScriptHasFunctions (clientServicesScriptFile, serviceName, listOfFunctionNames) {
    const Service = require(clientServicesScriptFile)[serviceName];
    const service = new Service();
    for (let functionName of listOfFunctionNames) {
        const foundFunction = service.getFunction(functionName);
        if (!foundFunction) {
            console.warn(`The '${service.name}' WebSocketService is missing '${functionName}'.  Please add it to '${serviceName}' list in ${clientServicesScriptFile}`);
        }
    }
}

module.exports = {
    checkClientScriptMatchesAPIActions,
    checkClientScriptMatchesService,
    //checkClientScriptHasFunctions,
};