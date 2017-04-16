/**
 * Created by eugeneseah on 5/1/17.
 */
const ProfileView = (function () {
    "use strict";

    const listSize = new cc.size(900,650);
    const _parent = new cc.Node();
    let _playerData;
    function ProfileView() {
        cc.spriteFrameCache.addSpriteFrames(res.ProfileUIPlist);
        GameView.addView(_parent,10);

        this._bkg = new cc.Sprite(ReferenceName.ProfileBackground);
        _parent.addChild(this._bkg);
        this._bkg.setPosition(this._bkg.getContentSize().width/2 + 35,this._bkg.getContentSize().height/2);
        // const statitemTest = createStatItem();
        // this._bkg.addChild(statitemTest);
        // statitemTest.setPosition(this._bkg.getContentSize().width/2 + 40,this._bkg.getContentSize().height/2);

        const list = createFishList();
        _parent.addChild(list,1);
        list.setPosition(this._bkg.getContentSize().width/2 + 200,this._bkg.getContentSize().height/2-20);

        BlockingManager.registerBlock(hideView);
    }

    function loadProfilePicture(){

    }

    function createStatItem(name ){
        console.log("createStatItem");
        const parent = new cc.Node();

        const bkg = new cc.Sprite(ReferenceName.ProfileFishBackground);
        const fishStatsBg = new cc.Sprite(ReferenceName.ProfileFishStatsBackground);

        parent.addChild(bkg);
        parent.addChild(fishStatsBg);
        fishStatsBg.setPosition(0,-bkg.getContentSize().height/2)

        return parent;
    }
    
    function createRowItem(arrayOfNames) {
        if (arrayOfNames) {
            let content = new ccui.Widget();
            content.setContentSize(listSize.width,220);

            for (let i = 0; i < arrayOfNames.length; i++) {
                let statItem =createStatItem(arrayOfNames[i]);
                content.addChild(statItem);
                statItem.setPosition(i * 220 + 105, 130);
            }
            return content;
        }
    }

    function createFishList(){
        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        // listView.setDirection(ccui.ScrollView.DIR_NONE);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        // listView.setBackGroundImage(res.HelloWorld_png);
        listView.setContentSize(listSize);
        // listView.setInnerContainerSize(200,200)
        listView.setAnchorPoint(cc.p(0.5, 0.5));
        // listView.setPosition(width/2, height/2 -150);

        for(let i = 0; i < 4; i++){
            let rowItem = createRowItem(["","","",""]);
            listView.pushBackCustomItem(rowItem);

        }

        return listView
    }

    const proto = ProfileView.prototype;

    function hideView(){
        BlockingManager.deregisterBlock(hideView);
        _parent.setVisible(false);
    }

    proto.showView = function(){
        BlockingManager.registerBlock(hideView);
        _parent.setVisible(true);
    };

    return ProfileView;
}());