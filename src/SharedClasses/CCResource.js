sino.resource = {
    _curLanguage: (cc.sys.language == cc.sys.LANGUAGE_CHINESE) ? cc.sys.LANGUAGE_CHINESE : cc.sys.LANGUAGE_ENGLISH ,
    _resPath:"res/",
    _resourceLanguageSuffixList: {
        0:"en",
        1:"cn"
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
            case cc.sys.LANGUAGE_ENGLISH:
                return "en";
            case cc.sys.LANGUAGE_CHINESE:
                return "cn";
            case cc.sys.LANGUAGE_FRENCH:
                return "fr";
            case cc.sys.LANGUAGE_ITALIAN:
                return "it";
            case cc.sys.LANGUAGE_GERMAN:
                return "de";
            case cc.sys.LANGUAGE_SPANISH:
                return "es";
            case cc.sys.LANGUAGE_RUSSIAN:
                return "ru";
            default:
                return "";
        }
    },
    getName:function (fileName) {
        return this._resPath + fileName;
    },
    getNameWithLang:function (fileName, isFrame, lang) {

        var resName, path = "";
        var num = fileName.lastIndexOf(".");
        var filePathWithoutExtension = fileName.substring(0, num);
        var extension = fileName.substring(num, fileName.length);
        if (!lang)
            lang = this._curLanguage;

        var langPath = this._langForPath(lang);
        console.log("this._resPath: " + this._resPath + ", langPath: " +langPath+ ", this._curLanguage: " +this._curLanguage+ ", lang: " +lang+ ", num: " +num);
        if (!isFrame)
            path = this._resPath + "lang-" + langPath + "/";

        resName = path + filePathWithoutExtension + "_" + langPath + extension;
        console.log("resName: " + resName + ", path: " +path+ ", filePathWithoutExtension: " +filePathWithoutExtension+ ", langPath: " +langPath+ ", extension: " +extension);
        return resName;
    }
};