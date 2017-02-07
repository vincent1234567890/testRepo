/**
 * Created by eugeneseah on 25/10/16.
 */

const GameView = function(){
    "use strict";

    let _parentNode;
    let _curretBKG;
    let _touchLayer;
    let _isRotated = false;
    let _gameConfig;
    let _playerId;
    let _playerSlot;
    let _playerViews = [];
    let _fishGameArena;
    let _touchedPos;
    let _lastShotTime = -Infinity;

    function initialise (parentNode, gameConfig, fishGameArena) {

        initialiseParent(parentNode);
        // console.log("initialise:gameconfig:",gameConfig);
        if (gameConfig) {
            _fishGameArena = fishGameArena;
            _gameConfig = gameConfig;

            if (_gameConfig.cannonPositions[_playerSlot][1] > cc.view.getDesignResolutionSize().height / 2) {
                // console.log(_gameConfig.cannonPositions[_playerSlot]);
                // console.log("player" + _playerSlot);
                // cc._canvas.rotate(180);
                _isRotated = true;
            }
            // console.log("initialised");
            for (let i = 0; i < _gameConfig.maxPlayers; i++) {
                const index = getPlayerSlot(i);
                _playerViews[index] = new PlayerViewManager(_gameConfig, index, i == _playerSlot);
            }
        }
    }

    function initialiseParent(parent) {
        cc.spriteFrameCache.addSpriteFrames(res.GameUIPlist);
        if (parent === undefined && _parentNode && _parentNode.parent) {
            parent = _parentNode.parent;
        }
        if (_parentNode && _parentNode.parent) {
            _parentNode.parent.removeChild(_parentNode);
        }
        _parentNode = new cc.Node();
        parent.addChild(_parentNode, 99999);
    }

    function goToGame (choice) {//temporary
        if (_curretBKG){
            _parentNode.removeChild(_curretBKG);
        }
        if (choice < 4 ){
            _curretBKG = new cc.Sprite(res['GameBackground' + choice.toString()]);
        }
        else {
            _curretBKG = new cc.Sprite(res.GameBackground1);
        }
        const frame = new cc.Sprite(res.GameFrame);
        frame.setPosition(cc.view.getDesignResolutionSize().width/2, cc.view.getDesignResolutionSize().height/2);
        _parentNode.addChild(frame,99);

        _curretBKG.setPosition(cc.view.getDesignResolutionSize().width/2, cc.view.getDesignResolutionSize().height/2);
        _parentNode.addChild(_curretBKG,-5);

        initialiseTouch(touchAt);
    }

    function addView(view, depth){
        _parentNode.addChild(view, depth);
    }

    function destroyView(view){
        _parentNode.removeChild(view);
    }

    const initialiseTouch = function (touchAt) {
        if(_touchLayer){
            _parentNode.removeChild(_touchLayer);
        }

        _touchLayer = new TouchLayerRefactored(touchAt);
        _parentNode.addChild(_touchLayer, -1);
    };

    function getRotatedView(position, rotation){ //position in array, rotation in radians, output in degrees
        let x;
        let y;
        let rot = 0;
        if (_isRotated && _gameConfig.isUsingOldCannonPositions) {
            // console.log("isrotate");
            if (position) {
                x = cc.view.getDesignResolutionSize().width - position[0];
                y = cc.view.getDesignResolutionSize().height - position[1];
            }
            if (rotation) {
                rot = -(rotation * 180 / Math.PI);

            }
        } else {
            if (position) {
                x = position[0];
                y = position[1];
            }
            if (rotation) {
                rot = 180 - rotation * 180 / Math.PI;
            }
        }
        return {position: [x, y], rotation: rot}
    }

    function resetArena() {
        _isRotated = false;
        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            clearPlayerState(i);
        }
        _lastShotTime = -Infinity
    }

    function destroyArena(){
        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i].destroyView();
            delete _playerViews[i];
        }
        _fishGameArena = null;
    }

    function getPlayerSlot(slot){
        if (_isRotated && _gameConfig.isUsingOldCannonPositions)
            return _gameConfig.maxPlayers - slot - 1;
        return slot;
    }

    function touchAt  (pos, touchType) {
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
        }else{
            _touchedPos = null;
        }
    }


    const getPlayerBulletId = function () {
        return _playerViews[0].getNextBulletId(); //currently bulletId is static no need to convert player slot
    };

    function setMyPlayerData (playerId,slot){
        _playerId = playerId;
        _playerSlot = slot;
    }

    function shootTo (playerId, angle){
        let slot = _fishGameArena.getPlayer(playerId).slot;
        let modifiedSlot = getPlayerSlot(slot);
        _playerViews[modifiedSlot].shootTo(angle);
    }

    function updateMultiplayerState(playerData) {
        const slot = getPlayerSlot(playerData.slot);
        _playerViews[slot].updatePlayerData(playerData);
    }

    function clearPlayerState (slot) {
        _playerViews[slot].clearPlayerData();
    }
    
    function updateArena() {
        if (_touchedPos!=null){
            touchAt(_touchedPos,TouchType.Moved);
        }

        _fishGameArena.updateEverything();
    }



    return {
        initialise : initialise,
        // parentNode : _parentNode,
        clearPlayerState : clearPlayerState,
        goToGame : goToGame,
        addView : addView,
        destroyView : destroyView,
        getRotatedView : getRotatedView,
        resetArena : resetArena,
        destroyArena : destroyArena,
        getPlayerSlot : getPlayerSlot,
        setMyPlayerData : setMyPlayerData,
        shootTo : shootTo,
        updateMultiplayerState : updateMultiplayerState,
        updateArena : updateArena,
    }



}();