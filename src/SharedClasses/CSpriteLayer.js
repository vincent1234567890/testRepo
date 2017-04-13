var PlistAndPlist = 0;
var PlistAndSprite = 1;
var SpriteAndPlist = 2;
var SpriteAndSprite = 3;

var CSpriteLayer = cc.Sprite.extend({
});

CSpriteLayer.setButtonBox = function (buttonBoxName, itemName, loadStart, pos, scaleBox, scaleItem) {
    if (scaleBox == null) {
        scaleBox = 1;
    }
    if (scaleItem == null) {
        scaleItem = 1;
    }
    var num = itemName.lastIndexOf("/") + 1;
    if(num){
    itemName = itemName.substring(num,itemName.length);
    }
    var ButtonBox;
    var ButtonItem;
    switch (loadStart) {
        case PlistAndPlist:
            ButtonBox = new cc.Sprite("#" + buttonBoxName);
            ButtonItem = new cc.Sprite('#' + itemName);
            break;
        case PlistAndSprite:
            ButtonBox = new cc.Sprite("#" + buttonBoxName);
            ButtonItem = new cc.Sprite(itemName);
            break;
        case SpriteAndPlist:
            ButtonBox = new cc.Sprite(buttonBoxName);
            ButtonItem = new cc.Sprite("#" + itemName);
            break;
        case SpriteAndSprite:
            ButtonBox = new cc.Sprite(buttonBoxName);
            ButtonItem = new cc.Sprite(itemName);
            break;
        default:
            break;
    }

    ButtonItem.setAnchorPoint(cc.p(0.5, 0.5));
    ButtonItem.setPosition(cc.p(ButtonBox.getContentSize().width / 2 + pos.x, ButtonBox.getContentSize().height / 2 + pos.y));
    ButtonItem.setScale(scaleBox);
    ButtonBox.setScale(scaleItem);
    ButtonBox.addChild(ButtonItem);

    return ButtonBox;

};
CSpriteLayer.getButtonBoxOffsetX = function (buttonBoxName, itemName, loadStart, offsetX) {
    var pos = cc.p(offsetX, 0);
    return CSpriteLayer.setButtonBox(buttonBoxName, itemName, loadStart, pos, 1, 1);
};
CSpriteLayer.getButtonBoxOffsetY = function (buttonBoxName, itemName, loadStart, offsetY) {
    var pos = cc.p(0, offsetY);
    return CSpriteLayer.setButtonBox(buttonBoxName, itemName, loadStart, pos, 1, 1);
};
CSpriteLayer.getButtonBox = function (buttonBoxName, itemName, loadStart) {
    var pos = cc.p(0, 0);
    return CSpriteLayer.setButtonBox(buttonBoxName, itemName, loadStart, pos, 1, 1);
};
CSpriteLayer.getButtonBoxScale = function (buttonBoxName, itemName, loadStart, scaleBox, scaleItem) {
    var pos = cc.p(0, 0);
    return CSpriteLayer.setButtonBox(buttonBoxName, itemName, loadStart, pos, scaleBox, scaleItem);
};