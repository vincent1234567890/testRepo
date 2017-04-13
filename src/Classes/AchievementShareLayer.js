var AchiveUITag = {
    kAchieveBgTag:111,
    kAchieveImageTag:112,
    kAchieveTitleTag:113,
    kAchieveDesTag:114,
    kAchieveScoreTag:115,
    kAchieveScoreBgTag:116
};

var AchievementShareLayer = cc.Sprite.extend({
    _isFetched:null,
    _achieveIndex:null,
    _achievePoint:null,
    _achieveTitle:null,
    _achieveDescription:null,
    initWithIndex:function (index, value) {
        var cache = cc.spriteFrameCache;
        cache.addSpriteFrames(ImageName("AchieveIconTP.plist"));
        cache.addSpriteFrames(ImageName("achieve.plist"));

        var bgSpriteStr = value ? "#ui_ach_002.png" : "#ui_ach_003.png";
        var bgSprite = new cc.Sprite(bgSpriteStr);
        bgSprite.setPosition(cc.p(0, 0));
        this.addChild(bgSprite, 0, AchiveUITag.kAchieveBgTag);
        var tmpIndex = (index + 1) > 99 ? (index + 1) : "0" + (index + 1);
        var imageName = "#icon_ach_" + tmpIndex + (value ? "" : "_gray") + ".png";
        var spriteAchImage = new cc.Sprite(imageName);
        spriteAchImage.setPosition(cc.p(-180, 0));
        this.addChild(spriteAchImage, 1, AchiveUITag.kAchieveImageTag);

        var lang = (cc.sys.language == cc.sys.LANGUAGE_CHINESE) ? cc.sys.LANGUAGE_CHINESE : cc.sys.LANGUAGE_ENGLISH;
        var suffix = sino.resource.getLanguageSuffixList(lang);

        var titleKey = "ItemTitle_" + suffix;
        var gainPre = value ? "" : "_none";
        var tempDict = GameSetting.getInstance().getAchieveArray()[index];
        var titleStr = tempDict[titleKey];

        var title = cc.LabelTTF.create(titleStr, "Microsoft YaHei", 25, new cc.Size(300, 30), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(title, 1, AchiveUITag.kAchieveTitleTag);
        title.setPosition(cc.p(-200 + bgSprite.getContentSize().width / 2, 25));

        var descKey = "ItemDescription_" + suffix + gainPre;
        var describtionStr;
        var valObj = tempDict[descKey];
        if (valObj) {
            describtionStr = valObj;
        }

        var desLabel = cc.LabelTTF.create(describtionStr, "Microsoft YaHei", 25, new cc.Size(300, 30), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(desLabel, 1, AchiveUITag.kAchieveTitleTag);
        desLabel.setPosition(cc.p(-200 + bgSprite.getContentSize().width / 2, -12));
        desLabel.setColor(cc.color.BLACK);

        var scoreBgStr = value ? "#ui_ach_010.png" : "#ui_ach_005.png";
        var scoreBgSprite = new cc.Sprite(scoreBgStr);
        this.addChild(scoreBgSprite, 2, AchiveUITag.kAchieveScoreBgTag);
        scoreBgSprite.setPosition(cc.p(170, 0));

        if (value) {
            var score = tempDict["Score"];
            var scoreLabel = cc.LabelTTF.create(score, "Microsoft YaHei", 30);
            this.addChild(scoreLabel, 3, AchiveUITag.kAchieveScoreTag);
            scoreLabel.setPosition(cc.p(170, 5));
        }

        return true;
    },
    onExit:function(){
        this._super();
        var cache = cc.spriteFrameCache;
        cache.removeSpriteFrameByName(ImageName("AchieveIconTP.plist"));
        cache.removeSpriteFrameByName(ImageName("achieve.plist"));
    }
});