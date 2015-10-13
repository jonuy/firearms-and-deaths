/**
 * Controls the canvas playable-1.
 *
 * The intent of this canvas is to just show stats. For each state, how many
 * deaths were there by firearms for a given year. Of those, what percentage
 * were accidental deaths and what percentage were by suicide.
 *
 * @todo: Possible consideration - instead of each being out of a 100 persons, 
 * normalize the total number of persons displayed for each state. So if MD has
 * the most firearm deaths overall, that'll have 100 shown. And if VA has only
 * 10% of that, then only show 10 there.
 *
 */

(function() {

var CANVAS_WIDTH = 648;
var CANVAS_HEIGHT = 360;
var states;
var canvas = document.getElementById('playable-1');
var ctx = canvas.getContext('2d');

/**
 * This is the function that's actually run.
 */
function run() {
  setupStates();
  setupPersons();
}

/**
 * Initial draw of the states.
 */
function setupStates() {
  var i;
  var currentX;
  var currentY;
  var startPosX = 24;
  var startPosY = 24;
  var boxSize = 24;

  ctx.font = '12px Helvetica';

  for (i = 0; i < STATES.length; i++) {
    // First half of states on one line, second half below it
    if (i < STATES.length / 2) {
      currentX = (i * boxSize) + startPosX;
      currentY = startPosY;
    }
    else {
      currentX = ((i - (STATES.length / 2)) * boxSize) + startPosX;
      currentY = startPosY + boxSize;
    }

    ctx.strokeRect(currentX, currentY, boxSize, boxSize);

    ctx.textAlign = 'center';
    ctx.fillText(STATES[i], currentX + (boxSize / 2), currentY + 16);
  }
}

/**
 * Initial draw of the peoples.
 */
var currPerson = 0;
var intervalId;
function setupPersons() {
  intervalId = window.setInterval(drawPerson, 20);
}

function drawPerson() {
  var i;
  var currentX;
  var currentY;
  var row;
  var xAdjust;
  var startPosX = 24;
  var startPosY = 100;
  var imgWidth = 20;
  var imgHeight = 40;
  var totalPersons = 100;
  var onefifth = totalPersons / 5;
  var imgPerson = document.getElementById('img-person');

  if (currPerson >= totalPersons) {
    window.clearInterval(intervalId);
    return;
  }

  i = currPerson;
  if (i < onefifth) {
    row = 0;
  }
  else if(i < onefifth * 2) {
    row = 1;
  }
  else if (i < onefifth * 3) {
    row = 2;
  }
  else if (i < onefifth * 4) {
    row = 3;
  }
  else {
    row = 4;
  }

  xAdjust = onefifth * row;
  // + 2px for padding in between persons
  currentX = ((i - xAdjust) * (imgWidth + 2)) + startPosX;
  currentY = startPosY + (row * (imgHeight + 4));

  ctx.drawImage(imgPerson, currentX, currentY, imgWidth, imgHeight);
  currPerson++;
}

return {
  run: run
}

})().run();