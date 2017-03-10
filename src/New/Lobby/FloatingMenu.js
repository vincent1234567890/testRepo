/**
 * Created by eugeneseah on 9/3/17.
 */
const FloatingMenu = (function () {
    "use strict";
    let _parent;
    let _theme;
    const FloatingMenu = function () {
        _parent = new cc.Node();
        GameView.addView(_parent);

        _theme = ThemeDataManager.getThemeDataList("FloatingMenu");

        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        // listView.setTouchEnabled(true);
        // listView.setBounceEnabled(true);
        // listView.setBackGroundImage(res.HelloWorld_png);
        listView.setContentSize(cc.size(500, 100));
        // listView.setInnerContainerSize(200,200)
        listView.setAnchorPoint(cc.p(0.5, 0.5));
        listView.setPosition(_theme["SettingsButton"][0],_theme["SettingsButton"][1]);

        const settings = doButton(ReferenceName.FloatingMenuButtonSettingsIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonSettingsText,
            onSettingsSelected
        );

        // _parent.addChild(settings);
        // settings.setPosition(_theme["SettingsButton"][0],_theme["SettingsButton"][1]);

        listView.pushBackCustomItem(settings);



    };

    function doButton(iconSprite, buttonImage, buttonSelected, labelImage, selectedCallBack) {
        const touchEvent = (sender, type) => {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    // gameSelected(sender);
                    console.log(sender.gameData);
                    selectedCallBack(sender);
                    break;
            }
        };

        let button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(buttonImage, buttonSelected, undefined, ccui.Widget.PLIST_TEXTURE);
        button.setPosition(button.getContentSize().width/2-120, button.getContentSize().height/2 + 120);
        button.addTouchEventListener(touchEvent);

        const size = button.getContentSize();
        if (iconSprite){
            let icon = new cc.Sprite(iconSprite);
            button.addChild(icon);
            icon.setPosition(size.width/2, size.height/2 - 10);
        }

        if(labelImage) {
            let label = new cc.Sprite(labelImage);
            button.addChild(label);
            // label.setAnchorPoint(0.5,0.5);
            label.setPosition(size.width/2, 0);
        }

        return button;
    }

    function onSettingsSelected(){


    }

    return FloatingMenu;
}());