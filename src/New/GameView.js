/**
 * Created by eugeneseah on 25/10/16.
 */

const GameView = function () {
    "use strict";

    let _parentNode;
    let _curretBKG;
    let _touchLayer;
    let _isRotated = false;
    let _gameConfig;
    let _playerId;
    let _playerSlot;

    let _fishGameArena;
    let _touchedPos;
    let _lastShotTime = -Infinity;

    //UIManagers
    let _playerViews = [];
    let _effectsManager;

    let _lobbyNode;
    let _lockOnCallback;

    function initialise(parentNode, gameConfig, fishGameArena, lockOnCallback, fishLockStatus) {
        if (gameConfig) { // going into game
            initialiseParent(parentNode);
            _fishGameArena = fishGameArena;
            _gameConfig = gameConfig;
            _lockOnCallback = lockOnCallback;

            if (_gameConfig.cannonPositions[_playerSlot][1] > cc.view.getDesignResolutionSize().height / 2) {
                // console.log(_gameConfig.cannonPositions[_playerSlot]);
                // console.log("player" + _playerSlot);
                // cc._canvas.rotate(180);
                _isRotated = true;
            }
            // console.log("initialised");
            for (let i = 0; i < _gameConfig.maxPlayers; i++) {
                const index = getPlayerSlot(i);
                _playerViews[index] = new PlayerViewManager(_gameConfig, index, i === _playerSlot, changeSeatRequest, lockOnRequest, fishLockStatus);
            }

            _effectsManager = new EffectsManager();
        }else if (!_lobbyNode){ // first time initialisation
            initialiseParent(parentNode);
            _lobbyNode = _parentNode;
        }else{ // reuse lobby node
            _parentNode = _lobbyNode;
        }
    }

    function initialiseParent(parent) {
        // cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
        const plists = ResourceLoader.getPlists("Game");
        for (let list in plists) {
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }
        if (parent === undefined && _parentNode && _parentNode.parent) {
            parent = _parentNode.parent;
        }
        _parentNode = new cc.Node();

        parent.addChild(_parentNode);
    }

    function goToGame(choice) {
        setBackgroundTo(0);
        // Or we could set a different initial background for each game type:
        //setBackgroundTo(choice ? choice.gameId : 0);

        //Request to remove frame
        const frame = new cc.Sprite(res.GameFrame2);
        frame.setPosition(cc.view.getDesignResolutionSize().width / 2, cc.view.getDesignResolutionSize().height / 2);
        _parentNode.addChild(frame, 99);

        initialiseTouch(touchAt);
    }

    function setBackgroundTo(choice) {
        if (_curretBKG) {
            _parentNode.removeChild(_curretBKG);
        }

        _curretBKG = new cc.Sprite(res['GameBackground' + (choice % 4).toString()]);
        // Fallback:
        //_curretBKG = new cc.Sprite(res.GameBackground1);

        _curretBKG.setPosition(cc.view.getDesignResolutionSize().width / 2, cc.view.getDesignResolutionSize().height / 2);
        _parentNode.addChild(_curretBKG, -5);
    }

    function addView(view, depth) {
        _parentNode.addChild(view, depth);
    }

    function destroyView(view) {
        _parentNode.removeChild(view);
        const plists = ResourceLoader.getPlists("Game");
        for (let list in plists) {
            cc.spriteFrameCache.removeSpriteFrameByName(plists[list]);
        }
    }

    const initialiseTouch = function (touchAt) {
        if (_touchLayer) {
            _parentNode.removeChild(_touchLayer);
        }
        _touchLayer = new TouchLayerRefactored(touchAt);
        _parentNode.addChild(_touchLayer, -1);
    };

    function getRotatedView(position, rotation) { //position in array, rotation in radians, output in degrees
        let x;
        let y;
        let rot = 0;
        if (_isRotated && _gameConfig.isUsingOldCannonPositions) {
            // console.log("isrotate");
            if (position) {
                x = cc.view.getDesignResolutionSize().width - position[0];
                y = cc.view.getDesignResolutionSize().height - position[1];
            }
            if (rotation != null) {
                rot = -(rotation * 180 / Math.PI);
            }
        } else {
            if (position) {
                x = position[0];
                y = position[1];
            }
            if (rotation != null) {
                rot = 180 - rotation * 180 / Math.PI;
            }
        }
        return {position: [x, y], rotation: rot}
    }

    function resetArena() {
        _isRotated = false;
        if (_gameConfig) {
            for (let i = 0; i < _gameConfig.maxPlayers; i++) {
                clearPlayerState(i);
            }
        }
        _lastShotTime = -Infinity
    }

    function destroyArena() {
        if (!_fishGameArena) {
            return;
        }

        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i].destroyView();
            delete _playerViews[i];
        }
        _fishGameArena = null;
    }

    function getPlayerSlot(slot) {
        if (_isRotated && _gameConfig.isUsingOldCannonPositions)
            return _gameConfig.maxPlayers - slot - 1;
        return slot;
    }

    function touchAt(pos, touchType) {
        if (touchType === TouchType.Began || touchType === TouchType.Moved) {
            _touchedPos = pos;
            const now = _fishGameArena.getGameTime();
            const timeSinceLastShot = now - _lastShotTime;
            if (timeSinceLastShot < _gameConfig.shootInterval) {
                // console.log("TOO FAST!");
                return;
            }

            _lastShotTime = now;

            let slot = getPlayerSlot(_playerSlot);

            const direction = cc.pNormalize(cc.pSub(pos, new cc.p(_gameConfig.cannonPositions[slot][0], _gameConfig.cannonPositions[slot][1])));
            const rot = Math.atan2(direction.x, direction.y);
            // _playerViews[slot].shootTo(rot * 180 / Math.PI);
            let info = getRotatedView(undefined, rot);

            const bulletId = _playerId + ':' + getPlayerBulletId();

            ClientServerConnect.getServerInformer().bulletFired(bulletId, (info.rotation - 90) / 180 * Math.PI);
        } else {
            _touchedPos = null;
        }
    }


    const getPlayerBulletId = function () {
        return _playerViews[0].getNextBulletId(); //currently bulletId is static no need to convert player slot
    };

    function setMyPlayerData(playerId, slot) {
        _playerId = playerId;
        _playerSlot = slot;
    }

    function shootTo(playerId, angle) {
        let slot = _fishGameArena.getPlayer(playerId).slot;
        let modifiedSlot = getPlayerSlot(slot);
        _playerViews[modifiedSlot].shootTo(angle);
    }

    function updateMultiplayerState(playerData, oldSlot) {
        const slot = getPlayerSlot(playerData.slot);
        if (oldSlot != null) {
            if (oldSlot === _playerSlot) {
                _playerSlot = slot;
            }
        }
        _playerViews[slot].updatePlayerData(playerData, oldSlot != null ? _playerSlot : undefined);
    }

    function clearPlayerState(slot) {
        if (_playerViews[slot]) {
            _playerViews[slot].clearPlayerData();
        }
    }

    function updateArena() {
        if (_touchedPos != null) {
            touchAt(_touchedPos, TouchType.Moved);
        }

        _fishGameArena.updateEverything();
    }

    function changeSeatRequest(slot) {
        ClientServerConnect.changeSeatRequest(slot);
    }

    function lockOnRequest(state){
        _lockOnCallback(state);
    }

    function caughtFishAnimationEnd(data) {
        if (data.playerSlot === _playerSlot) {
            _effectsManager.doCapturePrizeEffect(data.position, _gameConfig.cannonPositions[data.playerSlot], _gameConfig.fishClasses[data.type]);
        }
    }

    function setFreeRound(type){
        console.log("setFreeRound");
        if (type === 'clearing_for_free_shooting_game') {
            _effectsManager.showFreeRoundEffect();
        }
    }

    return {
        initialise: initialise,
        // parentNode : _parentNode,
        clearPlayerState: clearPlayerState,
        goToGame: goToGame,
        setBackgroundTo: setBackgroundTo,
        addView: addView,
        destroyView: destroyView,
        getRotatedView: getRotatedView,
        resetArena: resetArena,
        destroyArena: destroyArena,
        // getPlayerSlot : getPlayerSlot,
        setMyPlayerData: setMyPlayerData,
        shootTo: shootTo,
        updateMultiplayerState: updateMultiplayerState,
        updateArena: updateArena,
        caughtFishAnimationEnd: caughtFishAnimationEnd,
        setFreeRound :setFreeRound,

        //???
        getMyPlayerSlot: ()=> _playerSlot,
    }


}();