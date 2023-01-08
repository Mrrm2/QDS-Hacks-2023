// globals
let fuelConsumed = 0
let timeElapsed = 0

// already set global
let currTerrain = path[segment];

// set constant
let fuelRate = 202
let fuelAvg0 = 54.88
let fuelAvg1 = 61.53
let fuelAvgTotal = 111.19
let fuelMultiplier = 5 // change value to match irl-like value
let scoreMultiplier = 7 // change value depending on how big we want scores to be


// to display fuelConsumed throughout gameplay
function fuel() {
    if (currTerrain === 'FLAT') {
        fuelConsumed += timeElapsed * fuelRate * fuelMultiplier 
    } else if (currTerrain === 'DECLINE') {
        fuelConsumed += timeElapsed * fuelRate * fuelMultiplier * 0.8
    } else if (currTerrain === 'INCLINE') {
        fuelConsumed += timeElapsed * fuelRate * fuelMultiplier * 1.4
    }
}


// to display score (cost saved) at @ end of gameLeg0 & gameLeg1
// call this function @ end of gameLeg0 & gameLeg1
function score() {
    if (gameLeg === 0) {
        score = (fuelAvg0 - fuelConsumed) * 2.2
    } else if (gameLeg === 1) {
        score = (fuelConsumed / fuelAvg1) * scoreMultiplier
    }
}


// time elapsed based on when player clicks Start and End buttons
var startTime, endTime;

function start() {
    startTime = new Date();
}

function end() {
    endTime = new Date();
    var timeDiff = endTime - startTime; // this is in milliseconds
    timeDiff /= 1000; // strip the ms

    // convert to seconds
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
    
    // document.getelementByID("asdf").innerHTML = seconds 
}



