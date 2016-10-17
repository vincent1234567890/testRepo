cc.Resource = cc.Class.extend({
    _curLangague:null,
    _resPath:"res/",
    _resourceLanguageSuffixList:{},
    ctor:function () {
        this._curLangague = (cc.Application.getCurrentLanguage() == cc.LANGUAGE_CHINESE) ? cc.LANGUAGE_CHINESE : cc.LANGUAGE_ENGLISH ;
        this._resourceLanguageSuffixList = {
            0:"en",
            1:"cn"
        };
    },
    getResPath:function () {
        return this._resPath;
    },
    setResPath:function (v) {
        this._resPath = v;
    },
    /**
     *  //example
     *  res.setLanguageSuffixList(cc.LANGUAGE_ENGLISH,cc.LANGUAGE_CHINESE);
     */
    setLanguageSuffixList:function (/*multi parameter*/) {
        for (var i = 0; i <= arguments.length; i++) {
            var langKey = arguments[i];
            this._resourceLanguageSuffixList[langKey] = this._langForPath(langKey);
        }
    },
    /**
     *  //example
     *  res.setLanguageSuffixList(cc.LANGUAGE_ENGLISH,cc.LANGUAGE_CHINESE);
     */
    getLanguageSuffixList:function (lang) {
        if (this._resourceLanguageSuffixList[lang]) {
            return this._resourceLanguageSuffixList[lang];
        }
    },
    _langForPath:function (lang) {
        switch (lang) {
            case cc.LANGUAGE_ENGLISH:
                return "en";
            case cc.LANGUAGE_CHINESE:
                return "cn";
            case cc.LANGUAGE_FRENCH:
                return "fr";
            case cc.LANGUAGE_ITALIAN:
                return "it";
            case cc.LANGUAGE_GERMAN:
                return "de";
            case cc.LANGUAGE_SPANISH:
                return "es";
            case cc.LANGUAGE_RUSSIAN:
                return "ru";
            default:
                return "";
        }
    },
    getName:function (fileName) {
        return this._resPath + fileName;
    },
    getNameWithLang:function (fileName, isFrame, lang) {
        var resName, path = "", langPath = "";
        var num = fileName.lastIndexOf(".");
        var filePathWithoutExtension = fileName.substring(0, num);
        var extension = fileName.substring(num, fileName.length);
        if (!lang) {
            lang = this._curLangague;
        }

        langPath = this.getLanguageSuffixList(lang);

        if (!isFrame) {
            path = this._resPath + "lang-" + langPath + "/";
        }

        resName = path + filePathWithoutExtension + "_" + langPath + extension;

        return resName;
    }
});
cc.Resource.instance = null;
cc.Resource.getInstance = function () {
    if (!cc.Resource.instance) {
        cc.Resource.instance = new cc.Resource();
    }
    return cc.Resource.instance;
};