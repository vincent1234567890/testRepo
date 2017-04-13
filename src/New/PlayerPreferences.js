/**
 * Created by eugeneseah on 24/11/16.
 */

const PlayerPreferences = (function () {
    "use strict";

    //keys
    const userName = 'persistent_username';
    const pass = 'persistent_password';
    const musicVolume = 'music_volume';
    const soundVolume = 'sound_volume';

    function setLoginDetails(data){
        if (cc.sys.localStorage) {
            cc.sys.localStorage.setItem(userName, data.name);
            cc.sys.localStorage.setItem(pass, data.pass);
        }
    }

    function getLoginDetails(){

        if (cc.sys.localStorage) {
            let old_username = cc.sys.localStorage.getItem(userName);
            let old_password = cc.sys.localStorage.getItem(pass);
            return {username: old_username, password: old_password};
        }
    }

    function setMusicVolume(value){
        cc.sys.localStorage.setItem(musicVolume, value);
    }

    function getMusicVolume(){
        return cc.sys.localStorage.getItem(musicVolume);
    }
    function setSoundVolume(value){
        cc.sys.localStorage.setItem(soundVolume, value);
    }
    function getSoundVolume(){
        return cc.sys.localStorage.getItem(soundVolume);
    }

    return {
        setLoginDetails : setLoginDetails,
        getLoginDetails : getLoginDetails,
        setMusicVolume : setMusicVolume,
        getMusicVolume : getMusicVolume,
        setSoundVolume : setSoundVolume,
        getSoundVolume : getSoundVolume,
    };

}());