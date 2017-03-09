/**
 * Created by eugeneseah on 8/3/17.
 */
const LobbyWaterCausticInstance = (function () {
    "use strict";
    const LobbyWaterCausticInstance = function (parent, id) {
        this.id = id;

        if (!this._parent) {
            this._parent = new cc.Node();
            this._sprite = new cc.Sprite(res["WaterCaustic" + id]);
            this._parent.addChild(this._sprite);
        }
        parent.addChild(this._parent);
        this._startTime = Date.now();
        this._parent.update = () => {
            if (Date.now() > this._startTime){

            }
        };
        this._parent.scheduleUpdate();
    };

    const proto = LobbyWaterCausticInstance.prototype;

    proto.GetId = function () {
        return this.id;
    };

    proto.reclaimView = function () {
        this._parent.getParent().removeChild(this._parent, false);
    };

    return LobbyWaterCausticInstance;
}());