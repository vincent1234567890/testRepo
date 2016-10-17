var TutorialHintBackLayer = cc.Sprite.extend({
    _hintBg:null,
    _label:null,
    getHintBg:function () {
        return this._hintBg;
    },
    setHintBg:function (v) {
        this._hintBg = v;
    },
    getLabel:function () {
        return this._label;
    },
    setLabel:function (v) {
        this._label = v;
    },
    setOpacity:function (opacity) {
        this.getHintBg().setOpacity(opacity);
        this.getLabel().setOpacity(opacity);
    },
    init:function (hint) {
        this._super();
        cc.SpriteFrameCache.getInstance().addSpriteFrames(ImageName("tutorial.plist"));
        var bg = cc.Sprite.createWithSpriteFrameName(("ui_teach_001.png"));
        this.setHintBg(bg);
        this.setLabel(cc.LabelTTF.create(hint, "Microsoft YaHei", 18, cc.SizeMake(bg.getContentSize().width * 0.8, bg.getContentSize().height), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER));
        this.addChild(this.getHintBg());
        this.addChild(this.getLabel());

        return true;
    },
    onExit:function(){
        this._super();
        cc.SpriteFrameCache.getInstance().removeSpriteFrameByName(ImageName("tutorial.plist"));
    },
    setHint:function (hint) {
        this.getLabel().setString(hint);
    },
    playAppear:function () {
        this.runAction(cc.FadeIn.create(0.7));
    },
    playDisappear:function () {
        this.runAction(cc.FadeTo.create(0.5, 0));
    }
});
