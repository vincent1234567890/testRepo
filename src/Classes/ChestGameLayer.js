var ChestGameState = {
    kChestGameNotStart:0,//小宝箱未点击前
    kChestGameStart:1,//点击小宝箱开始动画
    kChestGamePick:2//随机动画结束，玩家可选择宝箱。
};
var LUIChestMoveTag	= 14;

var ChestGameLayer = cc.Layer.extend({
    addChest:function(){
        var chestArray = this.getDelegate().getActors(GroupChestActor);
        for(var m = 0; m < chestArray.length; m++)
        {
            var chest = chestArray[m];
            chest.setVisible(false);
        }

        var AchieveArray = GameSetting.getInstance().getChestFishArray();
        var pDict = AchieveArray[this.iChestFishID];

        var Reward = pDict["Reward"];
        var RewardRandom = [];
        for (var i=0; i<Reward.length; i++) {
            var pRewardDict = Reward[i];
            RewardRandom[i] = parseInt(pRewardDict["Random"]);
        }

        for (var i = 0; i <5; i++) {

            var big = ActorFactory.create("MaxChestActor");
            big.resetState();
            big.setZOrder(300);
            big.setPosition(VisibleRect.center());
            big.setIDirection(i);
            var AllRandom = 0;
            for (var g=0; g<Reward.length; g++) {
                AllRandom += RewardRandom[g];
            }

            var qz = Math.random()*AllRandom;
            var allqz = 0;
            for (var j=0; j<Reward.length; j++) {
                if (RewardRandom[j]<=0) {
                    continue;
                }
                allqz+=RewardRandom[j];
                if (qz<allqz) {
                    var pRewardDict = Reward[j];
                    big.setPrizeNumber(parseInt(pRewardDict["Num"]));
                    big.setPrizeType(pRewardDict["Type"]);
                    big.setGetRandomNum(parseInt(pRewardDict["GetRandom"]));
                    RewardRandom[j] = 0;
                    break;
                }
            }

            big.playAction(2);
            this.getDelegate().addActor(big);
            big.ChestMove();
        }
        var parAchieve = new cc.ParticleSystem(ImageName("kaibaoxiang01.plist"));
        this.addChild(parAchieve, 200);
        parAchieve.setPosition(VisibleRect.center());
    },
    DelChestScoreNumber:function(){
        var flashSprite = new cc.Sprite("#ui_box_go_bg.png");
        var flashGo = new cc.Sprite("#ui_box_go_1.png");
        var fadeIn = cc.FadeIn.create(1.0);
        var reverse = fadeIn.reverse();
        var sequ = cc.Sequence.create(fadeIn, reverse);
        flashGo.runAction(cc.RepeatForever.create(sequ));
        flashGo.setPosition(cc.p(flashSprite.getContentSize().width/2, flashSprite.getContentSize().height/2));
        flashSprite.addChild(flashGo);

        var selectedSprite = new cc.Sprite("#ui_box_go_2.png");
        var goButton = new cc.MenuItemSprite(flashSprite,
            selectedSprite,
            this.GoRandomOval, this);

        var OKMenu = cc.Menu.create(goButton);
        var posOffset = cc.p(0, -100);
        var pos = cc.pAdd(VisibleRect.center(), posOffset);
        OKMenu.setPosition(pos);
        this.addChild(OKMenu, 130, LUIChestMoveTag);
    },
    GoRandomOval:function(GoImage){
        playEffect(COUNTDOWN_EFFECT);
        this.removeChildByTag(LUIChestMoveTag, true);

        var moveDis= -100;
        while (true) {
            var UIChestPrompt = this.getChildByTag(LUIChestTag);
            if (!UIChestPrompt) {
                break;
            }
            UIChestPrompt.setTag(LUIChestMoveTag);
            var MoveTo = cc.MoveBy.create(1.0, cc.p(0, moveDis));
            var FadeTo = cc.FadeTo.create(1.0, 120);
            var Sequence = cc.Spawn.create(MoveTo,FadeTo);
            UIChestPrompt.runAction(Sequence);
        }
        playEffect(GO_EFFECT);
        while (this.getChildByTag(LUIChestTag)) {
            this.removeChildByTag(LUIChestTag, true);
        }
        this.schedule(this.RandomOvalinit, 1.0);
    },
    RandomOvalinit:function(dt){
        this.getScheduler().unschedule(this.RandomOvalinit, this);
        while (this.getChildByTag(LUIChestMoveTag)) {
            this.removeChildByTag(LUIChestMoveTag, true);
        }

        var pChestArray = this.getDelegate().getActors(GroupMaxChestActor);
        for(var i = 0; i < pChestArray.length; i++)
        {
            var chest = pChestArray[i];
            chest.ChestMoveCenter();
        }

        this.iChestMoveNum = 0;
    },
    RandomOval:function(dt){
        this.getScheduler().unschedule(this.RandomOval, this);
        if (this.iChestMoveNum++<15)
        {
            var iRandom = 0|(Math.random()*4+1);
            var chestRandom = [];
            chestRandom[0]=0|(Math.random()*iRandom);
            chestRandom[1]=0|(Math.random()*(5-iRandom)+iRandom);

            var i = 0;
            var Ovali = 0;

            playEffect(SO_EFFECT);

            var ChestOval = [];
            var pChestArray = this.getDelegate().getActors(GroupMaxChestActor);
            for(var k = 0; k < pChestArray.length; k++)
            {
                var chest = pChestArray[i];
                if ((i==chestRandom[0]||i==chestRandom[1]) && Ovali<2) {

                    ChestOval.push(chest);
                    Ovali++;
                }
                i++;
            }
            var timeNum = 0.1;
            this.schedule(this.RandomOval, timeNum * 1.2);
            // 		[NSTimer scheduledTimerWithTimeInterval:
            // 										 target: self
            // 									   selector: @selector(RandomOval)
            // 									   userInfo: nil
            // 										repeats: NO];
            ChestOval[0].ChestMoveToPos((ChestOval[1]).getPosition(), timeNum);
            ChestOval[1].ChestMoveToPos((ChestOval[0]).getPosition(), timeNum);
        }
        else
        {
            this.chestGameState = ChestGameState.kChestGamePick;
        }
    },
    RandomOvalForCall:function(pSender){
        this.RandomOval(0);
    },
    didPlayerStartChestGame:function(aposition){
        if (this.getDelegate().getIsPause()) {
            return false;
        }

        if (this.getDelegate().getActors(GroupMaxChestActor).length>0) {
            return false;
        }

        var pChestArray = this.getDelegate().getActors(GroupChestActor);
        for(var i = 0; i < pChestArray.length; i++)
        {
            var chest = pChestArray[i];

            if (cc.Rect.CCRectContainsPoint(chest.getChestRect(), aposition)) {
                playEffect(BOX_EFFECT);
                this.getDelegate().pauseGameBG(VisibleRect.center());
                this.getDelegate().BigPrize();
                chest.addParticleSystem();
                chest.ChestMove();
                return true;
            }
        }
        return false;
    },
    didPlayerPickAChest:function(aposition){
        if (this.chestGameState!=ChestGameState.kChestGamePick) {
            return false;
        }
        //get all 5 prized chest
        var pChestArray = this.getDelegate().getActors(GroupMaxChestActor);
        for(var i = 0; i < pChestArray.length; i++)
        {
            var chest = pChestArray[i];
            //if click position inside one of the 5 chests
            if (cc.Rect.CCRectContainsPoint(chest.getChestRect(), aposition)) {


                playEffect(BOX_EFFECT);

                chest.setIsOpen(true);
                chest.playAction(1);


                var AllGetRandomNum = 0;

                for(var j = 0; j < pChestArray.length; j++)
                {
                    var chest = pChestArray[j];

                    if (chest.getGetRandomNum()==0) {
                        continue;
                    }
                    AllGetRandomNum += chest.getGetRandomNum();
                }
                var GetNum = Math.random()*AllGetRandomNum;
                AllGetRandomNum = 0;
                var GetprizeNumber=0;
                var GetprizeType ="Gold";
                for(var k = 0; k < pChestArray.length; k++)
                {
                    var chest = pChestArray[k];
                    if (chest.getGetRandomNum()==0) {
                        continue;
                    }
                    AllGetRandomNum += chest.getGetRandomNum();
                    if(GetNum<AllGetRandomNum)
                    {
                        GetprizeNumber = chest.getPrizeNumber();//A宝箱中物品的数量
                        GetprizeType = chest.getPrizeType();
                        break;
                    }
                }
                //in this loop, it removes all other chests
                for(var o = pChestArray.length-1; o >=0; o--)
                {
                    var chest = pChestArray[o];
                    if (!chest.getIsOpen()) {
                        chest.removeSelfFromScene();
                    }else {
                        chest.setPrizeNumber(GetprizeNumber);
                        chest.setPrizeType(GetprizeType);
                    }

                    chest.setIsAlive(false);
                }

                var levelChests = this.getDelegate().getActors(GroupChestActor);
                for(var p = 0; p < levelChests.length; p++)
                {
                    var levelChest = levelChests[p];
                    levelChest.setVisible(true);
                }

                this.getDelegate().getActors(GroupMaxChestActor)[0].addGameReward();

                this.getDelegate().removeBlurBG();
                return true;
            }

        }
        return false;
    },
    chestControl:function(control, aposition){
        switch (this.chestGameState) {
            case ChestGameState.kChestGameNotStart://小宝箱未点击前
                if(this.didPlayerStartChestGame(aposition))
                {
                    this.chestGameState = ChestGameState.kChestGameStart;
                    //Nacson 用户每天点击宝箱的时间点
                    //ApparkDataManagerWrapper::logEvent(USERLOG_CLICK_CHEST, 0);
                    return true;
                }
                break;
            case ChestGameState.kChestGamePick://随机动画结束，玩家可选择宝箱。
                if(this.didPlayerPickAChest(aposition))
                {
                    this.chestGameState = ChestGameState.kChestGameNotStart;
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    },
    addMinChest:function(ChestFishID, FishCCP){
        var minPos=(cc.p(VisibleRect.bottomLeft().x + 45, VisibleRect.bottomLeft().y + 42));
        var maxPos=(cc.p(VisibleRect.topRight().x - 45, VisibleRect.topRight().y - 42));

        if (FishCCP.x<minPos.x) {
            FishCCP.x=minPos.x;
        }
        if (FishCCP.x>maxPos.x) {
            FishCCP.x=maxPos.x;
        }
        if (FishCCP.y<minPos.y) {
            FishCCP.y=minPos.y;
        }
        if (FishCCP.y>maxPos.y) {
            FishCCP.y=maxPos.y;
        }

        this.iChestFishID = ChestFishID;
        var big = ActorFactory.create("ChestActor");
        big.resetState();
        big.setZOrder(100);
        big.setPosition(FishCCP);
        big.playAction(2);
        big.setVisible(true);
        this.getDelegate().addActor(big);
    },
    initLayer:function(delegateLayer){
        this.chestGameState = ChestGameState.kChestGameNotStart;
        this.delegate = delegateLayer;
    },
    delegate:null,
    getDelegate:function(){return this.delegate},
    setDelegate:function(delegate){this.delegate = delegate},
    iChestMoveNum:0,
    getIChestMoveNum:function(){return this.iChestMoveNum},
    setIChestMoveNum:function(iChestMoveNum){this.iChestMoveNum = iChestMoveNum},
    iChestFishID:0,
    getIChestFishID:function(){return this.iChestFishID},
    setIChestFishID:function(iChestFishID){this.iChestFishID = iChestFishID},
    chestGameState:null,
    getChestGameState:function(){return this.chestGameState},
    setChestGameState:function(chestGameState){this.chestGameState = chestGameState}
});
ChestGameLayer.create = function(){
    var ret = new ChestGameLayer();
    ret.init();
    return ret;
};