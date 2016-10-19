var StaticGameUI = cc.Class.extend({});

StaticGameUI.dowsStaticGameUI = function (backdropSprite, scale) {
    cc.spriteFrameCache.addSpriteFrames(ImageName("cannon.plist"));
    // 等级，经验横幅
    // 背景图片
    var w = backdropSprite.getContentSize().width;
    var h = backdropSprite.getContentSize().height;
    var size = new cc.Size(0.87 * w, 0.88 * h);
    var lvSpriteBg = new cc.Sprite("#ui_box_01.png");
    lvSpriteBg.setAnchorPoint(AnchorPointTop);
    lvSpriteBg.setPosition(cc.p(size.width / 2, size.height));
    backdropSprite.addChild(lvSpriteBg);

    var lvTitleSp = new cc.Sprite("#ui_box_01-0.png");
    lvTitleSp.setPosition(cc.p(size.width / 2, size.height));
    lvTitleSp.setAnchorPoint(AnchorPointTop);
    backdropSprite.addChild(lvTitleSp);

    // 暂停音乐图片
    var pauseSprite = new cc.Sprite("#ui_button_01.png");
    pauseSprite.setAnchorPoint(AnchorPointTopLeft);
    pauseSprite.setPosition(cc.pAdd(cc.p(0, size.height), cc.p(30, 0)));
    backdropSprite.addChild(pauseSprite);

    var spriteMusic = new cc.Sprite("#ui_button_music_1.png");
    spriteMusic.setAnchorPoint(AnchorPointTopLeft);
    spriteMusic.setPosition(cc.pAdd(cc.p(0, size.height), cc.p(pauseSprite.getContentSize().width * scale + 30, 0)));
    backdropSprite.addChild(spriteMusic);

    // 照相和水族馆
    var spriteHide = new cc.Sprite("#ui_button_25.png");
    spriteHide.setAnchorPoint(AnchorPointTopRight);
    spriteHide.setPosition(cc.pAdd(cc.p(size.width, size.height), cc.p(-30, 0)));
    backdropSprite.addChild(spriteHide);

    var spriteCamra = new cc.Sprite("#button_other_001.png");
    spriteCamra.setAnchorPoint(AnchorPointTopRight);
    spriteCamra.setPosition(cc.p(size.width - spriteCamra.getContentSize().width * scale - 30, size.height));
    backdropSprite.addChild(spriteCamra);

    // 游戏最下栏
    // 底栏
    var weaponBase = new cc.Sprite("#ui_box_02.png");
    backdropSprite.addChild(weaponBase);
    weaponBase.setAnchorPoint(AnchorPointBottom);
    weaponBase.setPosition(cc.p(size.width / 2, 0));

    var weaponBaseRudder = new cc.Sprite("#ui_box_02_rudder.png");
    backdropSprite.addChild(weaponBaseRudder);
    weaponBaseRudder.setAnchorPoint(AnchorPointBottomLeft);
    weaponBaseRudder.setPosition(cc.p(0, 0));

    // 左调炮弹-
    var weaponLeft = new cc.Sprite("#ui_button_63.png");
    weaponLeft.setAnchorPoint(AnchorPointBottom);
    weaponLeft.setPosition(cc.pSub(cc.p(size.width / 2, 0), cc.p(71, 15)));
    weaponLeft.setScale(0.8);
    backdropSprite.addChild(weaponLeft);

    // 右调炮弹+
    var weaponRight = new cc.Sprite("#ui_button_65.png");
    weaponRight.setAnchorPoint(AnchorPointBottom);
    weaponRight.setPosition(cc.pAdd(cc.p(size.width / 2, 0), cc.p(71, -15)));
    weaponRight.setScale(0.8);
    backdropSprite.addChild(weaponRight);

    // 炮弹图片
    cc.spriteFrameCache.addSpriteFrames(ImageName("cannon10.plist"));
    cc.spriteFrameCache.addSpriteFrames(ImageName("SuperWeaponButton.plist"));
    var weaponSprite = new cc.Sprite("#actor_cannon1_11.png");
    weaponSprite.setPosition(cc.p(size.width / 2, 50));
    backdropSprite.addChild(weaponSprite);

    // 激光按键
    var laserSprite = new cc.Sprite("#button_prop_001_1.png");
    laserSprite.setAnchorPoint(AnchorPointBottom);
    laserSprite.setPosition(cc.p(VisibleRect.bottom().x + 250, VisibleRect.bottom().y));
    backdropSprite.addChild(laserSprite);

    // 武器选择按钮
    var lightSprite = new cc.Sprite("#button_lightning_1.png");
    lightSprite.setAnchorPoint(AnchorPointBottom);
    lightSprite.setPosition(cc.p(size.width / 2 + 160, 0));
    backdropSprite.addChild(lightSprite);

    // 在 HowToplay 界面，由于游戏背景图 backdropSprite 是实际背景图中截取的一部分
    // 按照前面代码设置的各个 UI 元素位置，各个元素位置可能会有偏移
    // 这段代码是为了调整各个 UI 元素的位置，使之显示正常
    var children = backdropSprite.getChildren();
    for (var i = 0; i < children.length; i++) {
        var node = children[i];
        if (node) {
            node.setPosition(cc.pAdd(node.getPosition(), cc.p(w * 0.041, h * 0.06)));
        }
    }

};