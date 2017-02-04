/**
 * Created by eugeneseah on 3/2/17.
 */
const PlayerData = (function () {
    "use strict";

    let score;

    function updateScore(amount){
        score = amount;
    }

    function getScore(){
        return score;
    }



    return {
        updateScore : updateScore,
        getScore : getScore,
    };
}());