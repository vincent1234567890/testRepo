/**
 * Created by eugeneseah on 31/3/17.
 */

const RolloverEffectItem = (function () {
    const RolloverEffectItem = function (widget, onSelectedCallback, onUnselectedCallback, onHoverCallback, onUnhoverCallback) {
        let isMouseDown = false;
        // let selected = false;
        const touchEvent = (sender, type) => {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    console.log(sender);
                    if (onSelectedCallback) {
                        onSelectedCallback(widget);
                    }
                case ccui.Widget.TOUCH_CANCELED: // fallthrough intended
                    if (onUnselectedCallback) {
                        onUnselectedCallback(widget);
                    }
                    break;
            }
        };

        const onMouseMove = (mouseData)=>{
            // console.log(mouseData);
            const pos = widget.convertToWorldSpace(cc.p());
            var rect = cc.rect(pos.x, pos.y, widget.getBoundingBox().width, widget.getBoundingBox().height);
            if (!isMouseDown){
                if(cc.rectContainsPoint(rect,mouseData.getLocation())) {
                    if (onHoverCallback) {
                        onHoverCallback(widget);
                    }
                }else{
                    if (onUnhoverCallback) {
                        onUnhoverCallback(widget);
                    }
                }
            }else{
                onUnhoverCallback(widget);
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
            onMouseDown: onMouseDown,
            onMouseUp: onMouseUp,
            onMouseMove: onMouseMove,
            // onMouseScroll: null,
        });

        widget.addTouchEventListener(touchEvent);

        cc.eventManager.addListener(_listener, widget);
    };

    return RolloverEffectItem;
}());
