const LeaderboardView = (function () {
    "use strict";
    const ZORDER = 10;
    let _parent;
    let _popup;
    let _listView;

    const titleHeight = 615;
    const LeaderboardView = function () {
        _parent = new cc.Node();
        _popup= new FloatingMenuPopupBasePrefab(dismissCallback);

        const textBG = new cc.Sprite(ReferenceName.LeaderboardTextBackground);
        const title = new cc.Sprite(ReferenceName.LeaderboardTitleChinese);

        const crown = new cc.Sprite(ReferenceName.CrownIcon);
        const playerName = new cc.Sprite (ReferenceName.LeaderboardTitlePlayerNameChinese);
        const onlineTime = new cc.Sprite (ReferenceName.LeaderboardTitleOnlineTimeChinese);
        const score = new cc.Sprite (ReferenceName.LeaderboardTitleScoreChinese);

        crown.setPosition(new cc.p(255, titleHeight));
        playerName.setPosition(new cc.p(455, titleHeight));
        onlineTime.setPosition(new cc.p(655, titleHeight));
        score.setPosition(new cc.p(855, titleHeight));

        textBG.setPosition(new cc.p(567.5,345));
        title.setPosition(new cc.p(560,705));

        _popup.getBackground().addChild(textBG,1);
        _popup.getBackground().addChild(title,1);

        _popup.getBackground().addChild(crown,1);
        _popup.getBackground().addChild(playerName,1);
        _popup.getBackground().addChild(onlineTime,1);
        _popup.getBackground().addChild(score,1);

        _popup.getParent().setPosition(new cc.p(683,384));

        _parent.addChild(_popup.getParent());
        ClientServerConnect.getLeaderboard().then(
            leaderboardData => {
                console.log(leaderboardData);
                _listView = doList(leaderboardData);
                _popup.getBackground().addChild(_listView,10);
                _listView.setPosition(new cc.p(185, 0));
            }
        );

        GameView.addView(_parent,ZORDER);
    };

    function doList(leaderboardData){
        const listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        // listView.setTouchEnabled(true);
        // listView.setBounceEnabled(true);
        listView.setItemsMargin(-30);

        const data = leaderboardData.data;

        for (let i = 0; i < data.length; i++) {
            if(data[i].val < 0)
                continue;
            const item = new ccui.Widget();

            const background = new cc.Sprite(ReferenceName.LeaderboardItemBackground);
            const rankingBackground = new cc.Sprite(ReferenceName.LeaderboardItemRankBackground);
            // const rankingLabel= new
            let rank = new cc.LabelTTF(i+1 , "Microsoft YaHei", 20);
            rank._setFontWeight("bold");
            rank.setFontFillColor(new cc.Color(255, 255, 255, 255));

            let name = new cc.LabelTTF(data[i].name , "Microsoft YaHei", 20);
            name._setFontWeight("bold");
            name.setFontFillColor(new cc.Color(0, 0, 0, 255));

            let time = new cc.LabelTTF(transferMinutesToString(data[i].minutesPlayed) , "Microsoft YaHei", 20);
            time._setFontWeight("bold");
            time.setFontFillColor(new cc.Color(0, 0, 0, 255));

            let score = new cc.LabelTTF(data[i].toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) ,
                "Microsoft YaHei", 20);
            score._setFontWeight("bold");
            score.setFontFillColor(new cc.Color(0, 0, 0, 255));

            item.setContentSize(background.getContentSize().width+100, rankingBackground.getContentSize().height );
            const size = item.getContentSize();

            background.setPosition(size.width/2,size.height/2);
            rankingBackground.setPosition(10,background.getContentSize().height/2);

            const itemHeight = background.getContentSize().height/2;
            rank.setPosition(10, itemHeight);
            name.setPosition(220, itemHeight);
            time.setPosition(420, itemHeight);
            score.setPosition(620,itemHeight);

            item.addChild(background);
            background.addChild(rankingBackground);
            background.addChild(rank);
            background.addChild(name);
            background.addChild(time);
            background.addChild(score);
            listView.pushBackCustomItem(item);
        }

        listView.setContentSize(1000,600);
        return listView;
    }

    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    const proto = LeaderboardView.prototype;

    proto.show = function () {
        if (_listView){
            _listView.getParent().removeChild(_listView);
        }
        _parent.setLocalZOrder(ZORDER);
        _parent.setVisible(true);
        ClientServerConnect.getLeaderboard().then(
            leaderboardData => {
                console.log(leaderboardData);
                _listView = doList(leaderboardData);
                _popup.getBackground().addChild(_listView,1);
                _listView.setPosition(new cc.p(185, 0));
            }
        );
        _popup.show();
    };

    proto.hide = function () {
        _parent.setLocalZOrder(-1000);

        BlockingManager.deregisterBlock(dismissCallback);
    };

    proto.unattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
    };

    proto.reattach = function () {
        if (_parent.getParent()) {
            _parent.getParent().removeChild(_parent, false);
        }
        GameView.addView(_parent);
    };

    return LeaderboardView;
}());