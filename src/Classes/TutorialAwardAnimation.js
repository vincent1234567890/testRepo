var TutorialAwardAnimation = cc.Class.extend({});

TutorialAwardAnimation.addScoreNumber = function (score, count, target) {
    if(count.x && count.y)
    {
        //this is a ccp
        var szLabel = score * target.getOddsNumber();
        szLabel = (0 | szLabel);
        var fontSize = 48;
        var labelNum = cc.LabelAtlas.create(szLabel, ImageName("prizenum.png"), fontSize, fontSize, '0');
        var prizeSprite = new cc.Sprite("#prizesign1.png");
        var movePoition = cc.p(0, 48);
        var move = cc.p(prizeSprite.getContentSize().width / 2, -prizeSprite.getContentSize().height / 2);

        var sequ = cc.sequence(cc.fadeIn(0.35), cc.delayTime(0.35), cc.fadeOut(0.35));
        var spawn = cc.spawn(sequ, cc.moveBy(1.05, movePoition));
        prizeSprite.runAction(cc.sequence(spawn, cc.callFunc(target.removeSprite, target)));
        prizeSprite.setPosition(count);
        prizeSprite.setScale(1.0);
        target.addChild(prizeSprite, 120);

        var sequ1 = cc.sequence(cc.fadeIn(0.35), cc.delayTime(0.35), cc.fadeOut(0.35));
        var spawn1 = cc.spawn(sequ1, cc.moveBy(1.05, movePoition));
        labelNum.runAction(cc.sequence(spawn1, cc.callFunc(target.removeSprite, target)));
        labelNum.setPosition(cc.pAdd(count, move));

        target.addChild(labelNum, 100);
    }
    else{
        var coinXInterval = VisibleRect.rect().width / (count + 1);
        for (var idx = 0; idx < count; idx++) {
            var curScore = score / (count - idx);
            TutorialAwardAnimation.addScoreNumber(curScore, cc.p(VisibleRect.left().x + coinXInterval*(idx+1), VisibleRect.center().y), target);
            score = score - curScore;
        }
    }

};

TutorialAwardAnimation.addGoldPrize = function (score, count, target) {
    var distpos = cc.p(VisibleRect.bottom().x - 250, VisibleRect.bottom().y);
    var position = cc.p(512, 600);
    var perPoint = score / count;
    var coinXInterval = VisibleRect.rect().width / (count + 1);
    for (var idx = 0; idx < count; idx++) {
        var p = cc.p(VisibleRect.left().x + coinXInterval * (idx + 1), VisibleRect.top().y / 2);
        //var pParticle = new cc.ParticleSystem(ImageName("goldlizi.plist"));

        var goldcoin = ActorFactory.create("GoldPrizeActor");
        goldcoin.setPoint(perPoint);
        goldcoin.setPosition(p);
        //goldcoin.setParticle(pParticle);
        goldcoin.resetState();

        //////////////////////////////////////////////////////////////////////////
        // 以下函数用来解决由于资源加载时间长导致金币刚出现就偏离设定初始位置太远的问题，
        // 和GoldPrizeActorBase.update(cc.Time dt) 配合工作。
        goldcoin.setUpdatebySelf(false);
        //////////////////////////////////////////////////////////////////////////

        goldcoin.dropGoldPrizeWithFishPoint(goldcoin.getPosition(), distpos);
        //pParticle.setPosition(p);
        //target.addChild(pParticle, 10);
        target.addActor(goldcoin);
    }

    target.addPlayerMoney(score);

    if (score >= 80) {
        target.coinsAnimation(position);
    }
    else if (score >= 60) {
        playEffect(COIN_EFFECT2);
    }
    else if (score >= 50) {
        playEffect(COIN_EFFECT2);

    }
    else if (score >= 40) {
        playEffect(COIN_EFFECT2);
    }

    else if (score >= 20) {
        playEffect(COIN_EFFECT2);
    }
    else {
        playEffect(COIN_EFFECT1);
    }
};