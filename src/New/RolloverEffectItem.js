/**
 * Created by eugeneseah on 31/3/17.
 */

const RolloverEffectItem = (function () {
    const RolloverEffectItem = function () {
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
            base.stopAllActions(); // due to some unknown cause, pausing immediately after running doesn't work.
            ball.stopAllActions();
        };

        cc.eventManager.addListener(_listener, this._wrapper);

        const base = new cc.Sprite("#GameSelectionBase_00000.png");
        base.setPosition(0,0);

        const content = new ccui.Widget();
        const ball = new cc.Sprite("#" + itemData.gameName + "Top_00000.png");
        const text = new cc.Sprite("#" + itemData.gameName + "Chinese.png");

        const pos = new cc.p(ball.getContentSize().width,ball.getContentSize().height);
        content.setContentSize(pos.x,pos.y);
        content.addChild(base);
        content.setTouchEnabled(true);
        content.addTouchEventListener(touchEvent);
        content.gameData = itemData;
        // base.setPosition(pos);
        content.setPosition(35,10);
        base.setPosition(165,140);

        content.setAnchorPoint(0,0);
        // base.setAnchorPoint(0,0);


        ball.setPosition(383, 330);
        base.addChild(ball);


        text.setAnchorPoint(0.5,0.5);
        text.setPosition(385, 117);
        base.addChild(text);

        this._wrapper.setContentSize(widthOfButton,ball.getContentSize().height);
        this._wrapper.addChild(content);

        base.pause();
        ball.pause();

        let selected = false;
    };

    return RolloverEffectItem;
}());
