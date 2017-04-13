var kBgTag = 999;
var kTitleTag = 998;
var kTopDesTag = 997;
var kBottomDesTag = 996;

var HelpStageSelLayer = cc.Sprite.extend({
    initWithBg:function (bgName, title, topdes, bottmDes) {
        if (this.initWithSpriteFrameName(bgName)) {
            var titlePos = cc.p(105, 385);
            var descPos = cc.pAdd(cc.p(this.getContentSize().width / 2, 0), cc.p(20, 150));
            var titleSprite = new cc.Sprite("#" + title);
            titleSprite.setPosition(titlePos);
            this.addChild(titleSprite, 0, kTitleTag);

            var topDesSprite = new cc.Sprite("#" + topdes);
            topDesSprite.setAnchorPoint(cc.p(0.5, 0.5));
            topDesSprite.setPosition(descPos);
            this.addChild(topDesSprite, 0, kTopDesTag);
            return true;
        }
        return false;
    }
});