/**
 * Created by eugeneseah on 17/11/16.
 */

var OptionsManager = (function (){

    function OptionsManager(parent) {
        console.log("OptionsManager");
        cc.spriteFrameCache.addSpriteFrames(res.SideMenuPlist);
        this.view = new OptionsView(parent);
    }
    return OptionsManager;
})();