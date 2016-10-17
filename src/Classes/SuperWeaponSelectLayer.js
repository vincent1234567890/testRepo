var SuperWeaponSelectLayer = cc.Layer.extend({
    _spriteMark:null,
    _currentPlayerActor:null,
    _itemWidth:0,
    _weaponButtonBackground:null,
    createMenuToggle:function () {
        var button_push = cc.MenuItemToggle.create(
            cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("button_weapon_1.png"),
            cc.Sprite.createWithSpriteFrameName("button_weapon_1.png")),
            this, this.weaponButtonClicked
        );

        return button_push;
    },
    createBackgroundButtons:function () {
        var pushItem;
        for (var i = 0; i < 2; i++) {
            pushItem = this.createMenuToggle();
            pushItem.setPosition(cc.p(-121 + i * (pushItem.getContentSize().width - 2), 0));
            this._weaponButtonBackground.push(pushItem);
            if (i > 1) {
                pushItem.setEnabled(false);
            }
        }

        var bgMenu = cc.Menu.create(this._weaponButtonBackground[0], this._weaponButtonBackground[1])

        this.addChild(bgMenu, 10);
        bgMenu.setPosition(cc.p(0, 0));

        return pushItem.getContentSize().width;
    },
    createWeaponSprites:function (buttonWidth) {
        var xBegin = -121;

        var weaponSprite = cc.Sprite.createWithSpriteFrameName("tubiao-jiguang.png");
        this.addChild(weaponSprite, 15);
        weaponSprite.setPosition(cc.p(xBegin, 0));

        weaponSprite = cc.Sprite.createWithSpriteFrameName("ui_lightning_1.png");
        this.addChild(weaponSprite, 15);
        weaponSprite.setPosition(cc.p(xBegin - 1 + buttonWidth, 0));
    },
    loadSelectedIndicator:function () {
        var frameCache = cc.SpriteFrameCache.getInstance();
        var frames = [];

        for (var i = 1; i <= 6; i++) {
            var frameName = "ui_weapon_choice" + i + ".png";
            var frame = frameCache.getSpriteFrame(frameName);
            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, 0.1);
        var selectMark = cc.Sprite.createWithSpriteFrameName("ui_weapon_choice1.png");
        selectMark.runAction(cc.RepeatForever.create(cc.Animate.create(animation)));
        this.addChild(selectMark, 20);
        this.setSpriteMark(selectMark);
        frames = [];
    },
    initLayerWithSelectedWeapon:function () {
        var tempArray = [];
        this.setWeaponButtonBackground(tempArray);

        // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
        var frameCache = cc.SpriteFrameCache.getInstance();
        frameCache.addSpriteFrames(ImageName("SuperWeaponSelect.plist"));
        frameCache.addSpriteFrames(ImageName("SuperWeaponSelectedMark.plist"));
        var bg = cc.Sprite.createWithSpriteFrameName("ui_weapon_bg.png");
        this.addChild(bg, 1);
        this._itemWidth = this.createBackgroundButtons();

        this.createWeaponSprites(this._itemWidth);
        this.loadSelectedIndicator();

        var curSpecialWeapon = wrapper.getIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY);
        var xBegin = -122;
        if (curSpecialWeapon == FishWeaponType.eWeaponLevel9) {
            this._spriteMark.setPosition(cc.p(xBegin + this._itemWidth, -1));
        }
        else {
            this._spriteMark.setPosition(cc.p(xBegin, 0));
        }
    },
    weaponButtonClicked:function (sender) {
        var xBegin = -121;

        var curSuperWeapon = wrapper.getIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY);

        var currentScene = GameCtrl.sharedGame().getCurScene();
        if (sender == this._weaponButtonBackground[0]) {
            if (FishWeaponType.eWeaponLevel8 != curSuperWeapon) {
                wrapper.setIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY, FishWeaponType.eWeaponLevel8);
                this._spriteMark.setPosition(cc.p(xBegin, 0));
                currentScene.superWeaponChanged();
            }
        }
        else if (sender == this._weaponButtonBackground[1]) {
            if (FishWeaponType.eWeaponLevel9 != curSuperWeapon) {
                wrapper.setIntegerForKey(CURRENT_SPECIAL_WEAPON_KEY, FishWeaponType.eWeaponLevel9);
                this._spriteMark.setPosition(cc.p(xBegin + this._itemWidth, 0));
                currentScene.superWeaponChanged();
            }
        }
        else {
            cc.Assert(false, "Wrong button been clicked!!!");
        }
    },
    onExit:function(){
        this._super();
        var frameCache = cc.SpriteFrameCache.getInstance();
        frameCache.removeSpriteFrameByName(ImageName("SuperWeaponSelect.plist"));
        frameCache.removeSpriteFrameByName(ImageName("SuperWeaponSelectedMark.plist"));
    },
    newWeaponNotifySetSelect:function () {
        var xBegin = -122;

        this._spriteMark.setPosition(cc.p(xBegin + this._itemWidth, -1));
    },
    getSpriteMark:function () {
        return  this._spriteMark;
    },
    setSpriteMark:function (v) {
        this._spriteMark = v;
    },
    getCurrentPlayerActor:function () {
        return  this._currentPlayerActor;
    },
    setCurrentPlayerActor:function (v) {
        this._currentPlayerActor = v;
    },
    getItemWith:function () {
        return  this._itemWidth;
    },
    setItemWith:function (v) {
        this._itemWidth = v;
    },
    getWeaponButtonBackground:function () {
        return  this._weaponButtonBackground;
    },
    setWeaponButtonBackground:function (v) {
        this._weaponButtonBackground = v;
    }
});