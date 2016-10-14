/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
    var d = document;
    var c = {
        menuType:'canvas', //whether to use canvas mode menu or dom menu
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        showFPS:false,
        frameRate:60,
        tag:'gameCanvas', //the dom element to run cocos2d on
        engineDir:'../lib/cocos2d/',
        appFiles:[
            //auto adapter screen
            'SharedClasses/AutoAdapterScreen.js',

            //loading screen
            'SharedClasses/LoadingScreen.js',

            //Fish
            'KingFisher/Classes/FishGroup.js',

            //shared classes
            'SharedClasses/CCResource.js',
            'SharedClasses/GameConfig.js',
            'SharedClasses/ConstantEnum.js',
            'SharedClasses/GameCtrl.js',
            'SharedClasses/CSpriteLayer.js',
            'SharedClasses/ActorFactory.js',
            'SharedClasses/BaseSprite.js',
            'SharedClasses/BaseActor.js',
            'SharedClasses/BaseFishActor.js',
            'SharedClasses/SPReusablePool.js',
            'SharedClasses/GamePreference.js',
            'SharedClasses/GameSetting.js',
            'SharedClasses/CCSessionController.js',
            'SharedClasses/GameSessionController.js',
            'SharedClasses/GameMainSessionController.js',
            'SharedClasses/FishSeasonSessionController.js',
            'SharedClasses/CCLocalizedString.js',
            'SharedClasses/FishNetCollideHandler.js',
            'SharedClasses/ParticleSystemFactory.js',

            //platform
            'SharedClasses/wrapper.js',

            'KingFisher/Resource.js',

            //scene
            'KingFisher/Classes/LogoScene.js',
            'KingFisher/Classes/MainMenuScene.js',
            'KingFisher/Classes/GameScene.js',

            //layer
            'KingFisher/Classes/AboutLayer.js',
            'KingFisher/Classes/OptionsLayer.js',
            'KingFisher/Classes/StartMenuLayer.js',
            'KingFisher/Classes/LogoWaveLayer.js',
            'KingFisher/Classes/HowToPlayLayer.js',
            'KingFisher/Classes/StageSelectLayer.js',
            'KingFisher/Classes/HelpStageSelLayer.js',
            'KingFisher/Classes/StaticGameUI.js',
            'KingFisher/Classes/UnLockStageLayer.js',
            'KingFisher/Classes/GameBackgroundLayer.js',
            'KingFisher/Classes/ScoreBarLayer.js',
            'KingFisher/Classes/PauseMenuLayer.js',
            'KingFisher/Classes/UserInfoLayer.js',
            'KingFisher/Classes/NumberScrollLabel.js',
            'KingFisher/Classes/TouchLayer.js',
            'KingFisher/Classes/SuperWeaponSelectLayer.js',
            'KingFisher/Classes/ShareImageLayer.js',
            'KingFisher/Classes/CompactUserInfo.js',
            'KingFisher/Classes/AchievementShareLayer.js',
            'KingFisher/Classes/ChestGameLayer.js',
            'KingFisher/Classes/IAP.js',


            //actor player
            'KingFisher/Classes/PlayerEntity_Wrapper.js',
            'KingFisher/Classes/PlayerActor.js',
            'KingFisher/Classes/FishNetActor.js',
            'KingFisher/Classes/BulletActor.js',
            'KingFisher/Classes/ProcessSprite.js',
            'KingFisher/Classes/GoldPrizeActor.js',
            'KingFisher/Classes/Starfish.js',

            //weapon
            'KingFisher/Classes/WeaponManager.js',
            'KingFisher/Classes/Weapon.js',
            'KingFisher/Classes/WeaponCannon.js',
            'KingFisher/Classes/WeaponSpecial.js',
            'KingFisher/Classes/WeaponSpecialRay.js',
            'KingFisher/Classes/WeaponSpecialLevinStorm.js',

            //tutorial
            'KingFisher/Classes/TutorialConfirmLayer.js',
            'KingFisher/Classes/TutorialHintBackLayer.js',
            'KingFisher/Classes/TutorialSessionController.js',
            'KingFisher/Classes/TutorialHintLayer.js',
            'KingFisher/Classes/TutorialAwardAnimation.js',

            // Nacl
            'Platform/NativeClient/Nacl.js',

            //punchbox ad
            'SharedClasses/webKingFisherAd.js'

        ]
    };
    window.addEventListener('DOMContentLoaded', function () {
        //first load engine file if specified
        var s = d.createElement('script');
        s.src = c.engineDir + 'platform/jsloader.js';
        s.c = c;
        s.id = 'cocos2d-html5';
        d.body.appendChild(s);
        //else if single file specified, load singlefile
        //s.src = 'KingFisherH5_advanced.js';
    });
})();