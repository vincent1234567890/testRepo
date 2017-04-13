/**
 * Created by eugeneseah on 16/2/17.
 */

const ThemeDataManager = (function () {
    "use strict";
    const _themeData = {};
    function setThemeData(type, data){
        _themeData[type] = _themeData[type] || [];
        for (let i in data){
            _themeData[type][i] =data[i];
        }
    }

    function getThemeDataList(type){
        return _themeData[type];
    }

    return {
        setThemeData : setThemeData,
        getThemeDataList : getThemeDataList,
    }
})();