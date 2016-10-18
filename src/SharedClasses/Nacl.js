/****************************************************************************

 ****************************************************************************/


//For cocos2dnacl
var cocos2dnaclModule = null;  // Global application object.
var statusText = 'NO-STATUS';

var naclRandomCmd = "NaclRandom"//'NaclRandom';
var naclSignUpdateCmd = 'NaclSignUpdate';
var naclSignInit = 'NaclSignInit';

// Indicate load success.
function moduleDidLoad() {
    cocos2dnaclModule = document.getElementById('nacl');
    updateStatus('SUCCESS');
    //Send a message to the NaCl module.
    if(cocos2dnaclModule.postMessage ==  null){
        if(cc.Application.getCurrentLanguage() == cc.LANGUAGE_CHINESE){
            alert("请打开Native Client模块，并重启浏览器! ")
        } else {
            alert("Please enable Native Client, and relaunch Chrome! ")
        }
    }
    //cocos2dnaclModule.postMessage(syncCmd + "I am cocos2d.");
}

// The 'message' event handler.  This handler is fired when the NaCl module
// posts a message to the browser by calling PPB_Messaging.PostMessage()
// (in C) or pp::Instance.PostMessage() (in C++).  This implementation
// simply displays the content of the message in an alert panel.
function handleMessage(message_event) {

    if (message_event.data.search(naclSignInit) >= 0) {
        //cc.log("Nacl:  "+message_event.data);
        var first_split = message_event.data.split(":");
        var without_cmd = first_split[1];
        var second_split = without_cmd.split(",");
        var index = second_split[0];
        var without_index = second_split[1];
        var third_split = without_index.split(";");
        var signNum = third_split[0];

        // Capture the fish.
        var tempUnit = signPool[0];
        while(tempUnit != null && tempUnit.index != null) {
            if (tempUnit.index == index) {
                signPool.shift();
                //cc.log("Remove success.");
                if (signNum == tempUnit.preSign){
                    if(tempUnit.money == 0) {
                        //alert("@1");
                        //KingFisher cc.log("Set player money: 0. @1");
                    }
                    //cc.log("setPlayerMoney: " + tempUnit.money);
                    PlayerActor.sharedActor().setPlayerMoney(tempUnit.money);
                } else {

                    //alert("@2");
                    //KingFisher cc.log("Reset player money. @2");
                    PlayerActor.sharedActor().setPlayerMoney(GameSetting.getInstance().getPlayerMoney());
                }

            } else if (tempUnit.index < index) {
                //KingFisher cc.log("SignPool queue shift!")
                signPool.shift();
            } else if(tempUnit.index > index) {
                //cc.log("Rec index: "+ index+ " Pool index: "+ tempUnit.index);
                break;
            }
            // fetch next unit
            tempUnit = signPool[0];
        }


    } else if (message_event.data.search(naclSignUpdateCmd) >= 0) {
        //cc.log(message_event.data);
        var first_split = message_event.data.split(":");
        var without_cmd = first_split[1];
        var second_split = without_cmd.split(",");
        var index = second_split[0];
        var without_index = second_split[1];
        var third_split = without_index.split(";");
        var signNum = third_split[0];

        // Capture the fish.
        var tempUnit = signPool[0];
        if (tempUnit.index == index) {
            signPool.shift();
            //cc.log("Remove success.");
            // get
            var entity = PlayerEntity_Wrapper.getInstance();

            // update the money and signnum
            if(tempUnit.money == 0){
                //alert("@3");
                //KingFisher cc.log("Set user money: 0. @3");
            }
            entity.setPlayerMoney(tempUnit.money);
            entity.setSignnum(signNum);
            // save the data
            entity.saveToLocalStorage();

        } else {
            //KingFisher cc.log("SignPool update queue error!");
            signPool.length = 0;
        }

    } else if (message_event.data.search(naclRandomCmd) >= 0) {
        //cc.log(message_event.data);

        // get the fish index and result.
        if (naclFishPool.length > 0) {

            var first_split = message_event.data.split(":");
            var without_cmd = first_split[1];
            var second_split = without_cmd.split(",");
            var index = second_split[0];
            var without_index = second_split[1];
            var third_split = without_index.split(";");
            var finalRandom = third_split[0];

            //cc.log(first_split[0]);
            //cc.log(index);
            //cc.log(finalRandom);


            var random = Math.random() * 10000;
            //cc.log(finalRandom + " : " + random);

            // Capture the fish.
            var tempUnit = naclFishPool[0];
            if (tempUnit.index == index) {
                naclFishPool.shift();
                //cc.log("Remove success.");
            } else {
                naclFishPool.length = 0;
            }

            var iFinalRadom = Math.ceil(parseFloat(finalRandom));
            // process the result
            if (random < iFinalRadom || tempUnit.fish.HP < 0) {
                //cc.log("captured");
                tempUnit.fish.grapedByFishNet(tempUnit.netActor);
            }
        }

    }
}

// If the page loads before the Native Client module loads, then set the
// status message indicating that the module is still loading.  Otherwise,
// do not change the status message.
function pageDidLoad() {
    if (cocos2dnaclModule == null) {
        updateStatus('LOADING...');
    } else {
        // It's possible that the Native Client module onload event fired
        // before the page's onload event.  In this case, the status message
        // will reflect 'SUCCESS', but won't be displayed.  This call will
        // display the current message.
        updateStatus();
    }
}

// Set the global status message.  If the element with id 'statusField'
// exists, then set its HTML to the status message as well.
// opt_message The message test.  If this is null or undefined, then
// attempt to set the element with id 'statusField' to the value of
// |statusText|.
function updateStatus(opt_message) {
    if (opt_message)
        statusText = opt_message;
    //var statusField = document.getElementById('status_field');
    //if (statusField) {
    //    statusField.innerHTML = statusText;
    //}
}


// Here's a difference. Method 'init' in cocos2d-x returns bool, instead of returning 'id' in cocos2d-iphone
function naclInit() {


    var listener = document.getElementById('listener');
    listener.addEventListener('message', handleMessage, true);
    pageDidLoad();
    moduleDidLoad();

    //naclCmdProcess(asyncCmd, "I am cocos2d.");
    //var testValue = naclCmdProcess(syncCmd, "I am cocos2d.");
    //alert(testValue);

    return true;
}

var naclFishPool = [];
var naclFishIndex = 0;

function finalRandomProcess(fishIndex, fishLevel, fishRandom, weaponLevel, collideIndex, ratio, oddsNumber, playerMoney, experienceRation, preReturnRation) {
    // var message = naclRandomCmd + ":"
    //     + fishIndex + ','
    //     + fishLevel + ','
    //     + fishRandom + ','
    //     + weaponLevel + ','
    //     + collideIndex + ','
    //     + ratio + ','
    //     + oddsNumber + ','
    //     + playerMoney + ','
    //     + experienceRation.toFixed(4) + ','
    //     + preReturnRation.toFixed(4) + ';';
    //
    // cocos2dnaclModule.postMessage(message);
}

var signPool = [];
var signIndex = 0;

var signUnit = function (playerMoney, preSign, index) {
    this.money = playerMoney;
    this.preSign = preSign;
    this.index = index;
};

function updatePlayerMoney(index, playerMoney) {
    if(index == null || playerMoney == null){
        //KingFisher cc.log("UpdateSign Error!");
        signPool.length = 0;
        return;
    }

    // var message = naclSignUpdateCmd + ":"
    //     + index + ','
    //     + playerMoney + ';';
    //
    // cocos2dnaclModule.postMessage(message);
}

function initPlayerMoney(index, playerMoney) {
    if(index == null || playerMoney == null){
        //KingFisher cc.log("InitSign Error!");
        playerMoney = 200;
    }
    // var message = naclSignInit + ":"
    //     + index + ','
    //     + playerMoney + ';';
    //
    // cocos2dnaclModule.postMessage(message);
}




