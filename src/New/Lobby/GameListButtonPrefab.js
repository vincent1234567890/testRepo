/**
 * Created by eugeneseah on 9/3/17.
 */

//experimenting with arrow function format
const GameListButtonPrefab = (function () {
    "use strict";
    const GameListButtonPrefab = function (itemData, widthOfButton, selectedCallback) {
        this._wrapper = new ccui.Widget();

        const touchEvent = (sender, type) => {
            // console.log("touch",sender,type);
            switch (type) {
                case ccui.Widget.TOUCH_MOVED:
                    // console.log(sender);
                    break;
                case ccui.Widget.TOUCH_BEGAN:
                    if (selected) return;
                    if(ball.getNumberOfRunningActions() == 0){ //base is requested to play all the time. Comments in case of re-reversion
                        // const _baseSequence = new cc.repeatForever(new cc.Sequence(getAnimationArray("GameSelectionBase")));
                        const _ballSequence = new cc.repeatForever(new cc.Sequence(getAnimationArray(itemData.gameName+"Top")));
                        // base.runAction(_baseSequence);
                        ball.runAction(_ballSequence);
                    }
                    selected = true;
                    // base.resume();
                    ball.resume();
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    selectedCallback(this);
                case ccui.Widget.TOUCH_CANCELED: // fallthrough intended
                    // base.pause();
                    ball.pause();
                    selected = false;
                    break;
            }
        };

        let isMouseDown = false;

        const onMouseMove = (mouseData)=>{
            // console.log(mouseData);
            const pos = content.convertToWorldSpace(cc.p());
            var rect = cc.rect(pos.x, pos.y, content.getBoundingBox().width, content.getBoundingBox().height);
            if (!isMouseDown && cc.rectContainsPoint(rect,mouseData.getLocation())){
                touchEvent(null, ccui.Widget.TOUCH_BEGAN);
            }else if (selected){
                touchEvent(null, ccui.Widget.TOUCH_CANCELED);
            }
        };

        const onMouseDown = (mouseData) =>{
            isMouseDown = true;
        };

        const onMouseUp = (mouseData) => {
            isMouseDown = false;
        };

        const _listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            swallowTouches: false,

            onMouseDown: onMouseDown,
            onMouseUp: onMouseUp,
            onMouseMove: onMouseMove,
            // onMouseScroll: null,
        });

        this.getGameData = () => {
            return content.gameData;
        };

        this.resetView = () => {
            // base.stopAllActions();
            // ball.resume();
            this._wrapper.setEnabled(true);
            // touchEvent(null, ccui.Widget.TOUCH_CANCELED);
        };

        this.disableContent = () => {
            this._wrapper.setEnabled(false);
            // base.stopAllActions(); // due to some unknown cause, pausing immediately after running doesn't work.
            ball.stopAllActions();
        };

        cc.eventManager.addListener(_listener, this._wrapper);

        const _baseSequence = new cc.repeatForever(new cc.Sequence(getAnimationArray("GameSelectionBase")));

        const base = new cc.Sprite("#GameSelectionBase_00000.png");
        base.setPosition(0,0);

        base.runAction(_baseSequence);

        const content = new ccui.Widget();
        const ball = new cc.Sprite("#" + itemData.gameName + "Top_00000.png");
        const text = new cc.Sprite("#" + itemData.gameName + "Chinese.png");

        const pos = new cc.p(ball.getContentSize().width,ball.getContentSize().height);
        content.setContentSize(pos.x,pos.y);
        content.addChild(base);
        content.setTouchEnabled(true);
        content.addTouchEventListener(touchEvent);
        content.gameData = itemData;
        content.setPosition(35,10);
        base.setPosition(165,140);

        content.setAnchorPoint(0,0);

        ball.setPosition(383, 330);
        base.addChild(ball);

        text.setAnchorPoint(0.5,0.5);
        text.setPosition(385, 117);
        base.addChild(text);

        this._wrapper.setContentSize(widthOfButton,ball.getContentSize().height);
        this._wrapper.addChild(content);

        // base.pause();
        ball.pause();

        let selected = false;
    };

    function getAnimationArray(baseName) {
        let animationArray = [];
        let count = 0;
        const padding = 5;
        while (true) {
            let frameCount = String(count);
            while (frameCount.length < padding) {
                frameCount = '0' + frameCount;
            }
            const frame = cc.spriteFrameCache.getSpriteFrame(baseName + "_" + frameCount + ".png");
            if (!frame) {
                break;
            }
            animationArray.push(frame);
            count++;
        }
        return new cc.Animate(new cc.Animation(animationArray, 2 / animationArray.length));
    }

    const proto = GameListButtonPrefab.prototype;

    proto.getContent = function () {
        return this._wrapper;
    };

    return GameListButtonPrefab;

}());