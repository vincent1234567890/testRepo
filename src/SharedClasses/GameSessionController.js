var GameSessionController = CCSessionController.extend({
    updateBullets:function (dt, allBulletsOnScreen, fishesOnScreen) {
        if (allBulletsOnScreen != null && fishesOnScreen != null) {
            for (var i = 0; i < allBulletsOnScreen.length; i++) {
                var bullet = allBulletsOnScreen[i];
                bullet.update(dt);

                if (GameCtrl.isOnlineGame()) {
                    continue;
                }

                if (bullet.getCurWeaponLevel() == FishWeaponType.eWeaponLevel9) {
                    var pFish;
                    for (var j = 0; j < fishesOnScreen.length; j++) {
                        if (bullet.collideWith(fishesOnScreen[j])) {
                            fishesOnScreen[j].handleCollide(bullet);
                        }
                    }
                }
                else if (bullet.getCurWeaponLevel() == FishWeaponType.eWeaponLevel12) {
                    for (var j = 0; j < fishesOnScreen.length; j++) {
                        if (bullet.collideWith(fishesOnScreen[j])) {
                            fishesOnScreen[j].handleCollide(bullet);
                            playEffect(NET_EFFECT);
                        }
                        else {
                            // @todo fish.setBPulled(false);
                        }
                    }
                }
                else {
                    for (var j = 0; j < fishesOnScreen.length; j++) {
                        if (bullet.collideWith(fishesOnScreen[j])) {
                            fishesOnScreen[j].handleCollide(bullet);
                            playEffect(NET_EFFECT)
                        }
                    }
                }
            }
        }
        else {
            var gameScene = this._currentScene;

            if (gameScene.getShootPosList().length > 0) {
                var pos = gameScene.getShootPosList()[0];
                gameScene.shootBulletTo(pos);
                gameScene.getShootPosList().shift();
            }

            if (!gameScene.getCanSendBullet()) {
                gameScene.setPastTime(gameScene.getPastTime() + dt);
            }


            if ((gameScene.getPastTime() >= GameSetting.getInstance().getShootInterval()) && !gameScene.getCanSendBullet()) {
                gameScene.setPastTime(0);
                gameScene.setCanSendBullet(true);
            }
        }
    },
    updateAllGolds:function () {

    },
    updateAllFishes:function (fishesOnScreen, netsOnScreen, dt) {
        if (FishNetCollideHandler.shareFishNetCollideHandler().getTested()) {
            var pGameScene = this._currentScene;

            var pFishArray = [];
            if (pFishArray) {

                //for every nets on screen
                for (var i = 0; i < netsOnScreen.length; i++) {
                    var fishNet = netsOnScreen[i];
                    fishNet.update(dt);
                    if (!fishNet.getBeginAnimation()) {
                        continue;
                    }

                    var catched = false;

                    for (var j = 0; j < fishesOnScreen.length; j++) {
                        var fish = fishesOnScreen[j];
                        //for every fish on screen, if it collides with the net, add the fish to the fishArray
                        var collideIndex = fishNet.collideIndexWith(fish);
                        if (collideIndex >= 0) {
                            fish.setCurCollideIndex(collideIndex);
                            pFishArray.push(fish);
                            if (fish.getIsChangeColor()) {
                                fish.setHP(fish.getHP() - PlayerActor.sharedActor().getCurWeaponLevel());
                                if (fish.getHP() < 0) {
                                    fish.grapedByFishNet(fishNet);
                                    var removeIndex = pFishArray.indexOf(fish);
                                    if (removeIndex != -1)
                                        pFishArray.splice(removeIndex, 1);

                                } // if
                            }

                            if (false)//ipad
                            {
                                if (pGameScene.getCurStage() == 2) {
                                    fishNet.setCurRatio(fishNet.getCurRatio() - 20);

                                }
                                else if (pGameScene.getCurStage() == 1) {
                                    fishNet.setCurRatio(fishNet.getCurRatio() - 15);
                                } // if
                            }
                            else {
                                if (pGameScene.getCurStage() == 2) {
                                    fishNet.setCurRatio(fishNet.getCurRatio() - 18);

                                }
                                else if (pGameScene.getCurStage() == 1) {
                                    fishNet.setCurRatio(fishNet.getCurRatio() - 13);
                                } // if
                            }
                        } // if
                    } // cc.ARRAY_FOREACH
                    var pDeadFish = FishNetCollideHandler.shareFishNetCollideHandler().handleCollide(fishNet, pFishArray);
                    for (var l = 0; l < pDeadFish.length; ++l) {
                        pDeadFish[l].grapedByFishNet(fishNet);
                    } // cc.ARRAY_FOREACH
                    pDeadFish = [];
                    fishNet.setBeginAnimation(false);
                } // cc.ARRAY_FOREACH
                pFishArray = null;
            } // if


        }
        else {
            var gameScene = this._currentScene;
            var bFishRandom = true; //本次捕到的鱼奖励
            var FishSortNum = [];
            for (var i = 0; i < 20; i++) {
                FishSortNum[i] = 0;
            }

            for (var n = 0; n < netsOnScreen.length; n++) {
                var fishNet = netsOnScreen[n];
                fishNet.update(dt);
                if (!fishNet.getBeginAnimation()) {
                    continue;
                }

                var catched = false;

                var pFish;
                for (var f = 0; f < fishesOnScreen.length; f++) {
                    var fish = fishesOnScreen[f];

                    var collideIndex = fishNet.collideIndexWith(fish);
                    if (collideIndex >= 0) {
                        fish.setCurCollideIndex(collideIndex);

                        if (fish.getIsChangeColor()) {
                            fish.setHP(fish.getHP() - PlayerActor.sharedActor().getCurWeaponLevel());
                        }

                        if (fish.handleCollide(fishNet)) {
                            catched = true;
                            FishSortNum[fish.getFishLevel()] = FishSortNum[fish.getFishLevel()] + 1;
                            if (FishSortNum[fish.getFishLevel()] > 2 && bFishRandom) {
                                bFishRandom = false;
                            }
                        }
                        else {
                            //[PlayerActor sharedActor].comboCount = 0;
                        }

                        if (false)//ipad
                        {
                            if (gameScene.getCurStage() == 2) {
                                fishNet.setCurRatio(fishNet.getCurRatio() - 20);
                            }
                            else if (gameScene.getCurStage() == 1) {
                                fishNet.setCurRatio(fishNet.getCurRatio() - 15);
                            }
                        }
                        else {
                            if (gameScene.getCurStage() == 2) {
                                fishNet.setCurRatio(fishNet.getCurRatio() - 18);
                            }
                            else if (gameScene.getCurStage() == 1) {
                                fishNet.setCurRatio(fishNet.getCurRatio() - 13);
                            }
                        }
                    }
                }

                fishNet.setBeginAnimation(false);
            }

        } // if
    },
    updateShellActor:function () {

    },
    updateAllActors:function (dt) {
        if (this._sessionRunning) {
            var gameScene = this._currentScene;
            var groupFishOnScreen = gameScene.getActors(GroupFishActor);
            var allBulletsOnScreen = gameScene.getActors(GroupHeroBullet);
            this.updateBullets(dt, allBulletsOnScreen, groupFishOnScreen);

            var allGolds = gameScene.getActors(GroupGoldPrizeActor);
            this.updateAllGolds(allGolds, dt);

            var allNetsOnScreen = gameScene.getActors(GroupFishNetActor);
            this.updateAllFishes(groupFishOnScreen, allNetsOnScreen, dt);

            this.updateBullets(dt);
            for (var i = 0; i < groupFishOnScreen.length; i++) {
                groupFishOnScreen[i].update(dt);
            }

            this.updateShellActor(dt);
        }
    }
});