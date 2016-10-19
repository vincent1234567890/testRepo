var CompactUserInfo = cc.Layer.extend({
    _userTitle:null,
    _userTitleBG:null,
    _experienceProcess:null,
    currentShowingUserTitle:null,
    getCurrentShowingUserTitle:function () {
        return this.currentShowingUserTitle;
    },
    setCurrentShowingUserTitle:function (v) {
        this.currentShowingUserTitle = v;
    },
    getUserTitle:function () {
        return this._userTitle;
    },
    setUserTitle:function (v) {
        this._userTitle = v;
    },
    getUserTitleBG:function () {
        return this._userTitleBG;
    },
    setUserTitleBG:function (v) {
        this._userTitleBG = v;
    },
    getExperienceProcess:function () {
        return this._experienceProcess;
    },
    setExperienceProcess:function (v) {
        this._experienceProcess = v;
    },
    loadUI:function () {
        var spriteTemp = new cc.Sprite("#ui_usertitle_bg.png");
        this.addChild(spriteTemp, 1);
        this.setUserTitleBG(spriteTemp);

        spriteTemp = new cc.Sprite("#ui_expbar_bg.png");
        this.addChild(spriteTemp, 1);
        spriteTemp.setPosition(cc.pAdd(spriteTemp.getPosition(), cc.p(spriteTemp.getContentSize().width + 6, 0)));

        var processDef = ProcessDef.defaultDef();
        var proSprite = new ProcessSprite();
        proSprite.initWithDef(processDef);
        this.setExperienceProcess(proSprite);
        this._experienceProcess.setPosition(cc.pAdd(spriteTemp.getPosition(), cc.p(-1, 3)));
        this.setScale(0.85);

        this.addChild(this._experienceProcess, 10);
    },
    updateUserInfo:function () {
        var sharedActor = PlayerActor.sharedActor();
        var title = sharedActor.title();
        if (title != this.getCurrentShowingUserTitle()) {
            this.setCurrentShowingUserTitle(title);
            var tempSprite = new cc.Sprite("#" + ImageNameLang(title, true));
            //this.setUserTitle(tempSprite);
            this.addChild(tempSprite, 10);

            tempSprite.setPosition(cc.pAdd(this.getUserTitleBG().getPosition(), cc.p(15, 4)));
            this.setUserTitle(tempSprite);
        }

        var processdef = this.getExperienceProcess().getProcessDef();
        processdef.setTotalValue(sharedActor.getNextExp() - sharedActor.getPreviousExp());
        processdef.setCurrentValue(sharedActor.getTotalGain() - sharedActor.getPreviousExp());
        this.getExperienceProcess().updatePosition();
    }
});