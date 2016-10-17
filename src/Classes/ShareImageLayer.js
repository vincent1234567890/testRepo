var SUPPORT_SHARE_URL = "http://t.cn/anaIzr";
var SHARE_MESSAGE_SUFFIX = "（分享自@捕鱼达人游戏 " + SUPPORT_SHARE_URL + "）";

var ShareImageUITag = {

    kShareImageBgTag:111
    /*kAchieveImageTag : 112,
     kAchieveTitleTag : 113,
     kAchieveDesTag : 114,
     kAchieveScoreTag : 115,
     kAchieveScoreBgTag : 116*/
};

var ShareImageLayer = cc.Layer.extend({
    itemTwiter:null,
    itemFacebook:null,
    itemCancel:null,
    pPreview:null,
    init:function () {
        var winSize = cc.Director.getInstance().getWinSize();

        var spriteLabel = cc.Sprite.create(ImageNameLang("fonts_other_011.png"));
        this.addChild(spriteLabel, 1);
        spriteLabel.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y));

        var itemCancle = cc.MenuItemSprite.create(
            cc.Sprite.createWithSpriteFrameName(("button_other_012.png")),
            cc.Sprite.createWithSpriteFrameName(("button_other_013.png")),
            this, this.back);
        itemCancle.setPosition(cc.p(spriteLabel.getPosition().x + spriteLabel.getContentSize().width / 2 - 12, spriteLabel.getPosition().y + spriteLabel.getContentSize().height / 2 - 4));

        this.SaveToPhoto();

        var menu;

        if (true/*kIsChinese*/) {
            var itemWeibo = cc.MenuItemSprite.create(
                cc.Sprite.create(ImageName("button_other_030.png")),
                cc.Sprite.create(ImageName("button_other_031.png")),
                this, this.ShareToWeibo);
            itemWeibo.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y - itemWeibo.getContentSize().height / 2));
            menu = cc.Menu.create(itemWeibo, itemCancle);
        }
        else {
            var itemFaceBook = cc.MenuItemSprite.create(
                cc.Sprite.create(ImageName("button_other_006.png")),
                cc.Sprite.create(ImageName("button_other_007.png")),
                this, this.ShareToFaceBook);

            var itemTwiter = cc.MenuItemSprite.create(
                cc.Sprite.create(ImageName("button_other_008.png")),
                cc.Sprite.create(ImageName("button_other_009.png")),
                this, this.ShareToTwitter);

            itemFaceBook.setPosition(cc.p(VisibleRect.center().x - itemFaceBook.getContentSize().width / 2, VisibleRect.center().y - 40));
            itemTwiter.setPosition(cc.p(VisibleRect.center().x + itemTwiter.getContentSize().width / 2, VisibleRect.center().y - 40));
            menu = cc.Menu.create(itemFaceBook, itemTwiter, itemCancle);
        }

        menu.setPosition(cc.PointZero());
        this.addChild(menu, 10, 997);

        return true;
    },
    menuCallBack:function (sender) {
        var nTag = sender.getTag();
        switch (nTag) {
            case 0:
                this.back(sender);
                break;
            case 1:
                this.ShareToFaceBook(sender);
                break;
            case 2:
                this.ShareToTwitter(sender);
                break;
            case 3:
                this.ShareToWeibo(sender);
                break;
            default:
                break;
        }
    },
    SaveToPhoto:function () {
    },
    ShareToFaceBook:function (sender) {
    },
    ShareToTwitter:function (sender) {
    },
    ShareToWeibo:function (sender) {
        var str = [
            "我iphone版#捕鱼达人#玩的可好了，不信的看图！" + SHARE_MESSAGE_SUFFIX,
            "我正在玩iphone版#捕鱼达人#，看我到第几级了！" + SHARE_MESSAGE_SUFFIX,
            "iphone版#捕鱼达人#更新后也太爽了吧！" + SHARE_MESSAGE_SUFFIX,
            "一直玩的iphone版#捕鱼达人#，跟曾经在游戏厅里的一样。看着金币哗哗进账有爽到的感觉。" + SHARE_MESSAGE_SUFFIX,
            "iphone版#捕鱼达人#比炒股还刺激。各种瞌睡各种困都消失了。O(∩_∩)O" + SHARE_MESSAGE_SUFFIX
        ];

        var i = wrapper.getIntegerForKey(kWeiBoAdd);
        var image = FishGameSnapshotPath();
        var title = str[i];
        wrapper.setIntegerForKey(kWeiBoAdd, (i + 1) % 5);

        var href = "http://v.t.sina.com.cn/share/share.php?url=" + SUPPORT_SHARE_URL + "&title=" + title + "&appkey=3787440247";
        window.open(href, "_blank");
        this.back();
    },
    back:function () {
        this.removeAllChildrenWithCleanup(true);
        this.removeFromParentAndCleanup(true);
    },
    getPreviewIamge:function () {
        var strFile = FishGameSnapshotPath();
        var image = new Image();
        image.src = strFile;
        return image;
    }
});

ShareImageLayer.create = function () {
    var layer = new ShareImageLayer();
    if (layer.init()) {
        return layer;
    }
    return null;
};
