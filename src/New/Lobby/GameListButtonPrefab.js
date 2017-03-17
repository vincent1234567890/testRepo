/**
 * Created by eugeneseah on 9/3/17.
 */
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
                    if(base.getNumberOfRunningActions() == 0){
                        // console.log("run");
                        const _baseSequence = new cc.repeatForever(new cc.Sequence(getAnimationArray("GameSelectionBase")));
                        const _ballSequence = new cc.repeatForever(new cc.Sequence(getAnimationArray(itemData.gameName+"Top")));

                        base.runAction(_baseSequence);
                        ball.runAction(_ballSequence);
                    }
                    selected = true;
                    base.resume();
                    ball.resume();
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    // console.log(sender.gameData);
                    selectedCallback(this);
                case ccui.Widget.TOUCH_CANCELED:
                    // gameSelected(sender);
                    base.pause();
                    ball.pause();
                    selected = false;
                    // this._selectedCallBack(sender);
                    break;
            }
        };

        let isMouseDown = false;

        const onMouseMove = (mouseData)=>{
            // console.log(mouseData);
            if (!isMouseDown && cc.rectContainsPoint(this._wrapper.getBoundingBox(),mouseData.getLocation())){
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
            base.stopAllActions(); // due to some unknown cause, pausing immediately after running doesn't work.
            ball.stopAllActions();
            console.log(cc.director.getScheduler(),cc.director.getScheduler().isTargetPaused(base));
        };

        cc.eventManager.addListener(_listener, this._wrapper);

        const base = new cc.Sprite("#GameSelectionBase_00000.png");
        base.setPosition(0,0);

        const content = new ccui.Widget();
        const pos = new cc.p(base.getContentSize().width,base.getContentSize().height);
        content.setContentSize(pos.x,pos.y);
        content.addChild(base);
        content.setTouchEnabled(true);
        content.addTouchEventListener(touchEvent);
        content.gameData = itemData;
        // base.setPosition(pos);
        content.setPosition(375,300);
        base.setPosition(210,300);

        const ball = new cc.Sprite("#" + itemData.gameName + "Top_00000.png");
        ball.setPosition(383, 330);
        base.addChild(ball);

        const text = new cc.Sprite("#" + itemData.gameName + "Chinese.png");
        text.setAnchorPoint(0.5,0.5);
        text.setPosition(385, 115);
        base.addChild(text);

        this._wrapper.setContentSize(widthOfButton,base.getContentSize().height);
        this._wrapper.addChild(content);

        base.pause();
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