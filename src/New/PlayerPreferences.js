/**
 * Created by eugeneseah on 24/11/16.
 */

let PlayerPreferences = (function () {
    //keys
    const userName = 'persistent_username';
    const pass = 'persistent_password';

    function setLoginDetails(data){
        if (cc.sys.localStorage) {
            cc.sys.localStorage.setItem(userName, data.name);
            cc.sys.localStorage.setItem(pass, data.pass);
        }
    }

    function getLoginDetails(){
        "use strict";
        if (cc.sys.localStorage) {
            let old_username = cc.sys.localStorage.getItem(userName);
            let old_password = cc.sys.localStorage.getItem(pass);
            return {username: old_username, password: old_password};
        }
    }

    return {
        setLoginDetails : setLoginDetails,
        getLoginDetails : getLoginDetails,
    };

}());