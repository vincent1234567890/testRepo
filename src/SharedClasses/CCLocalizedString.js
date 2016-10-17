cc.LocalizedString = {
    stringDict:null,
    localizedString:function (key) {
        if (!key) {
            return 0;
        }
        if (!this.stringDict) {
            this.stringDict = cc.FileUtils.getInstance().dictionaryWithContentsOfFile(ImageNameLang("LocalizedString.plist"));
        }

        var value = this.stringDict[key];

        if (!value) {
            return key;
        }
        else {
            return value;
        }
    },
    purgeLocalizedString:function () {
        this.stringDict = null;
    }
};