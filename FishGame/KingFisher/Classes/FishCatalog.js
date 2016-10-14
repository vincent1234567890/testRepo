var FishCatalog = cc.Class.extend({
    UID:0,
    FishName:"",
    getUID:function () {
        return this.UID
    },
    setUID:function (uid) {
        this.UID = uid
    },
    getFishName:function () {
        return this.FishName
    },
    setFishName:function (name) {
        this.FishName = name
    }
});