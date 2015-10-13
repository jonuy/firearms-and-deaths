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
var stateHitBoxes = [];
var canvas = document.getElementById('playable-1');
var ctx = canvas.getContext('2d');

// @todo Get actual data in here
var STATE_DATA = {
  'AL': {suicide: 1, accident: 2, total: 5},
  'AK': {suicide: 2, accident: 4, total: 10},
  'AZ': {suicide: 3, accident: 6, total: 12},
  'AR': {suicide: 4, accident: 8, total: 16},
  'CA': {suicide: 5, accident: 10, total: 20},
  'CO': {suicide: 6, accident: 12, total: 24},
  'CT': {suicide: 7, accident: 14, total: 28},
  'DE': {suicide: 8, accident: 16, total: 32},
  'FL': {suicide: 9, accident: 18, total: 36},
  'GA': {suicide: 10, accident: 20, total: 40},
  'HI': {suicide: 11, accident: 1, total: 44},
  'ID': {suicide: 12, accident: 3, total: 48},
  'IL': {suicide: 13, accident: 5, total: 52},
  'IN': {suicide: 14, accident: 7, total: 56},
  'IA': {suicide: 15, accident: 9, total: 60},
  'KS': {suicide: 16, accident: 11, total: 64},
  'KY': {suicide: 17, accident: 13, total: 68},
  'LA': {suicide: 18, accident: 15, total: 72},
  'ME': {suicide: 19, accident: 17, total: 76},
  'MD': {suicide: 20, accident: 19, total: 80},
  'MA': {suicide: 1, accident: 2, total: 84},
  'MI': {suicide: 2, accident: 4, total: 88},
  'MN': {suicide: 3, accident: 6, total: 92},
  'MS': {suicide: 4, accident: 8, total: 96},
  'MO': {suicide: 5, accident: 10, total: 100},
  'MT': {suicide: 6, accident: 12, total: 24},
  'NE': {suicide: 7, accident: 14, total: 28},
  'NV': {suicide: 8, accident: 16, total: 32},
  'NH': {suicide: 9, accident: 18, total: 36},
  'NJ': {suicide: 10, accident: 20, total: 40},
  'NM': {suicide: 11, accident: 1, total: 44},
  'NY': {suicide: 12, accident: 3, total: 48},
  'NC': {suicide: 13, accident: 5, total: 52},
  'ND': {suicide: 14, accident: 7, total: 56},
  'OH': {suicide: 15, accident: 9, total: 60},
  'OK': {suicide: 16, accident: 11, total: 64},
  'OR': {suicide: 17, accident: 13, total: 68},
  'PA': {suicide: 18, accident: 15, total: 72},
  'RI': {suicide: 19, accident: 17, total: 76},
  'SC': {suicide: 20, accident: 19, total: 80},
  'SD': {suicide: 1, accident: 2, total: 6},
  'TN': {suicide: 2, accident: 4, total: 10},
  'TX': {suicide: 3, accident: 6, total: 15},
  'UT': {suicide: 4, accident: 8, total: 20},
  'VT': {suicide: 5, accident: 10, total: 25},
  'VA': {suicide: 6, accident: 12, total: 27},
  'WA': {suicide: 7, accident: 14, total: 33},
  'WV': {suicide: 8, accident: 16, total: 45},
  'WI': {suicide: 9, accident: 18, total: 51},
  'WY': {suicide: 10, accident: 20, total: 53}
};

/**
 * This is the function that's actually run.
 */
function run() {
  setupStates();
  updatePersons('AL');

  canvas.addEventListener('click', onClick);
}

/**
 * Initial draw of the states.
 */
function setupStates() {
  var i;
  var currentX;
  var currentY;
  var hitBox;
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

    // Draw box
    ctx.strokeRect(currentX, currentY, boxSize, boxSize);

    // Draw state abbreviation
    ctx.textAlign = 'center';
    ctx.fillText(STATES[i], currentX + (boxSize / 2), currentY + 16);

    // Store coordinates for click events
    hitBox = {
      state: STATES[i],
      xmin: currentX,
      xmax: currentX + boxSize,
      ymin: currentY,
      ymax: currentY + boxSize
    };
    stateHitBoxes[stateHitBoxes.length] = hitBox;
  }
}

/**
 * Initial draw of the peoples.
 */
var currPerson;
var intervalId;
function updatePersons(state) {
  // Reset person counter
  currPerson = 0;

  // Clear any persons drawn previously
  ctx.clearRect(24, 100, 520, 220);

  intervalId = window.setInterval(drawPerson.bind({state: state}), 20);
}

/**
 * Function to be called on intervals to draw the person images.
 * Requires that an object with a `state` property be binded to the function call.
 */
function drawPerson() {
  var i;
  var currentX;
  var currentY;
  var row;
  var xAdjust;
  var haltDrawing = false;
  var startPosX = 24;
  var startPosY = 100;
  var imgWidth = 20;
  var imgHeight = 40;
  var totalPersons = 100;
  var onefifth = totalPersons / 5;
  var img;
  var imgPerson = document.getElementById('img-person');
  var imgSuicide = document.getElementById('img-person-suicide');
  var imgAccident = document.getElementById('img-person-accident');

  // Ensure `state` property exists in the `this`
  if (typeof this.state !== 'string') {
    console.log('playable1.drawPerson() called without a `state` property');
    haltDrawing = true;
  }
  // Ensure we actually have data for this `state`
  else if (typeof STATE_DATA[this.state] === 'undefined') {
    console.log('playable1.drawPerson() has no data for ' + this.state);
    haltDrawing = true;
  }
  // Done Drawing
  else if (currPerson >= STATE_DATA[this.state].total) {
    haltDrawing = true;
  }

  if (haltDrawing) {
    window.clearInterval(intervalId);
    intervalId = undefined;
    return;
  }

  i = currPerson;

  // Determine row
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

  // Determine image source
  img = imgPerson;
  if (i < STATE_DATA[this.state].suicide) {
    img = imgSuicide;
  }
  else if (i >= STATE_DATA[this.state].suicide &&
    i < STATE_DATA[this.state].suicide + STATE_DATA[this.state].accident) {
    img = imgAccident;
  }

  xAdjust = onefifth * row;
  // + 2px for padding in between persons
  currentX = ((i - xAdjust) * (imgWidth + 2)) + startPosX;
  currentY = startPosY + (row * (imgHeight + 4));

  ctx.drawImage(img, currentX, currentY, imgWidth, imgHeight);
  currPerson++;
}

/**
 * Listener for click events on the canvas.
 */
function onClick(event) {
  // Stop any current draw in progress
  if (typeof intervalId !== 'undefined') {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }

  var hit = checkHit(event.layerX, event.layerY);
  if (hit) {
    updatePersons(hit);
  }
}

/**
 * Check if a state box was hit on a given set of coordinates
 *
 * @param x x position of the click
 * @param y y position of the click
 * @returns The state if a hit is found. Otherwise, false.
 */
function checkHit(x, y) {
  var i;

  for (i = 0; i < stateHitBoxes.length; i++) {
    if (x > stateHitBoxes[i].xmin &&
        x < stateHitBoxes[i].xmax &&
        y > stateHitBoxes[i].ymin &&
        y < stateHitBoxes[i].ymax) {
      return stateHitBoxes[i].state;
    }
  }

  return false;
}

return {
  run: run
}

})().run();