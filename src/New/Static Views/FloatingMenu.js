/**
 * Created by eugeneseah on 9/3/17.
 */
const FloatingMenu = (function () {
    "use strict";
    let _parent;
    let _theme;
    let _settingsCallback;

    const hoverSize = 1.2;
    const originalSize = 1;

    let _leaderboardView;

    const FloatingMenu = function (settingsCallback) {
        _parent = new cc.Node();
        GameView.addView(_parent);

        _settingsCallback = settingsCallback;

        _theme = ThemeDataManager.getThemeDataList("FloatingMenu");

        // const listView = new ccui.ListView();
        // listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        // // listView.setTouchEnabled(true);
        // // listView.setBounceEnabled(true);
        // // listView.setBackGroundImage(res.HelloWorld_png);
        // listView.setContentSize(cc.size(500, 100));
        // // listView.setInnerContainerSize(200,200)
        // listView.setAnchorPoint(cc.p(0.5, 0.5));
        // // listView.setPosition(_theme["SettingsButton"][0],_theme["SettingsButton"][1]);
        // listView.setPosition(500,500);
        const settings = doButton(ReferenceName.FloatingMenuButtonSettingsIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonSettingsText,
            onSettingsSelected
        );

        _parent.addChild(settings);
        settings.setPosition(_theme["SettingsButton"][0], _theme["SettingsButton"][1]);

        const assets = doButton(ReferenceName.FloatingMenuButtonGameLogIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonGameLogText,
            onAssetsSelected
        );

        _parent.addChild(assets);
        assets.setPosition(_theme["AssetsButton"][0], _theme["AssetsButton"][1]);

        const info = doButton(ReferenceName.FloatingMenuButtonInfoIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonInfoText,
            onInfoSelected
        );

        _parent.addChild(info);
        info.setPosition(_theme["InfoButton"][0], _theme["InfoButton"][1]);

        const leaderboard = doButton(ReferenceName.FloatingMenuButtonLeaderboardIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonLeaderboardText,
            onLeaderboardSelected
        );

        _parent.addChild(leaderboard);
        leaderboard.setPosition(_theme["LeaderboardButton"][0], _theme["LeaderboardButton"][1]);

        const FAQ = doButton(ReferenceName.FloatingMenuButtonFAQIcon,
            ReferenceName.FloatingMenuButtonBackground,
            ReferenceName.FloatingMenuButtonBackgroundDown,
            ReferenceName.FloatingMenuButtonFAQText,
            onFAQSelected
        );

        _parent.addChild(FAQ);
        FAQ.setPosition(_theme["FAQButton"][0], _theme["FAQButton"][1]);
        //
        // listView.pushBackCustomItem(settings);
        //
        // _parent.addChild(listView);

    };

    function doButton(iconSprite, buttonImage, buttonSelected, labelImage, selectedCallBack) {
        let isMouseDown = false;
        // let selected = false;
        const touchEvent = (sender, type) => {
            switch (type) {
                // case ccui.Widget.TOUCH_MOVED:
                //     // console.log(sender);
                //     break;
                // case ccui.Widget.TOUCH_BEGAN:
                //     if (selected) return;
                //     selected = true;
                //     break;
                case ccui.Widget.TOUCH_ENDED:
                    // gameSelected(sender);
                    console.log(sender);
                    selectedCallBack(sender);
                case ccui.Widget.TOUCH_CANCELED: // fallthrough intended
                    // label.runAction(new cc.ScaleTo(0.01,originalSize));
                    label.setScale(originalSize);
                    break;
            }
        };

        const onMouseMove = (mouseData)=>{
            // console.log(mouseData);
            const pos = button.convertToWorldSpace(cc.p());
            var rect = cc.rect(pos.x, pos.y, button.getBoundingBox().width, button.getBoundingBox().height);
            if (!isMouseDown){
                if(cc.rectContainsPoint(rect,mouseData.getLocation())) {
                    // label.runAction(new cc.ScaleTo(0.01, hoverSize));
                    label.setScale(hoverSize);
                    touchEvent(null, ccui.Widget.TOUCH_BEGAN);
                }else{
                    label.setScale(originalSize);
                    // label.runAction(new cc.ScaleTo(0.01,originalSize));
                }
            }
            // else if (selected){
            //     // touchEvent(null, ccui.Widget.TOUCH_CANCELED);
            // }
        };

        const onMouseDown = (mouseData) =>{
            isMouseDown = true;
        };

        const onMouseUp = (mouseData) => {
            isMouseDown = false;
        };

        const _listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,

            onMouseDown: onMouseDown,
            onMouseUp: onMouseUp,
            onMouseMove: onMouseMove,
            // onMouseScroll: null,
        });

        let button = new ccui.Button();
        button.setTouchEnabled(true);
        button.loadTextures(buttonImage, buttonSelected, undefined, ccui.Widget.PLIST_TEXTURE);
        button.setPosition(button.getContentSize().width / 2 - 120, button.getContentSize().height / 2 + 120);
        button.addTouchEventListener(touchEvent);

        const size = button.getContentSize();
        let icon;
        if (iconSprite) {
            icon = new cc.Sprite(iconSprite);
            button.addChild(icon);
            icon.setPosition(size.width / 2, size.height / 2 - 10);
        }

        let label;
        if (labelImage) {
            label = new cc.Sprite(labelImage);
            button.addChild(label);
            // label.setAnchorPoint(0.5,0.5);
            label.setPosition(size.width / 2, 0);
        }

        cc.eventManager.addListener(_listener, button);

        return button;
    }

    function onSettingsSelected() {
        if (_settingsCallback) {
            _settingsCallback();
        }
    }

    function onAssetsSelected() {

    }

    function onInfoSelected() {

    }

    function onLeaderboardSelected() {
        console.log("onLeaderboardSelected");
        if (!_leaderboardView){
            _leaderboardView = new LeaderboardView();
        }else{
            _leaderboardView.show();
        }
    }

    function onFAQSelected() {

    }

    const proto = FloatingMenu.prototype;


    proto.reattach = function () {
        _parent.getParent().removeChild(_parent,false);
        GameView.addView(_parent);
    };

    // proto.Move

    return FloatingMenu;
}());