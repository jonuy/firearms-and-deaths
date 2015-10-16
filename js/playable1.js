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
 * Canvas size: 648 x 360 (TBD)
 *
 */
var playable1;
var playable1Canvas = document.getElementById('playable-1');

playable1 = (function() {

  var canvas;
  var ctx;
  var selectedState;
  var STARTING_STATE = 'CA';
  var CANVAS_WIDTH = 648;
  var CANVAS_HEIGHT = 440;
  var stateHitBoxes = [];
  var hasStarted = false;
  var hasStateHighlight = false;

  // Helper vars for drawing state numbers
  var drawNumsTotalAnimTime = 500;
  var drawNumsAnimInterval = 50;
  var drawNumsAnimTime = 0;
  var drawNumsIntervalId;

  // Data from 2010-2013 retrieved from http://webappa.cdc.gov/sasweb/ncipc/dataRestriction_inj.html
  var STATE_DATA = {
    'AK': {name: 'Alaska', suicide_normalized: 4, accident_normalized: 1, total_normalized: 5, suicide_raw: 424, accident_raw: 11, total_raw: 546},
    'AL': {name: 'Alabama', suicide_normalized: 16, accident_normalized: 1, total_normalized: 27, suicide_raw: 1910, accident_raw: 99, total_raw: 3258},
    'AR': {name: 'Arkansas', suicide_normalized: 10, accident_normalized: 1, total_normalized: 16, suicide_raw: 1194, accident_raw: 50, total_raw: 1872},
    'AZ': {name: 'Arizona', suicide_normalized: 21, accident_normalized: 1, total_normalized: 31, suicide_raw: 2612, accident_raw: 31, total_raw: 3782},
    'CA': {name: 'California', suicide_normalized: 51, accident_normalized: 1, total_normalized: 100, suicide_raw: 6176, accident_raw: 115, total_raw: 12033},
    'CO': {name: 'Colorado', suicide_normalized: 15, accident_normalized: 1, total_normalized: 20, suicide_raw: 1892, accident_raw: 35, total_raw: 2419},
    'CT': {name: 'Connecticut', suicide_normalized: 4, accident_normalized: 0, total_normalized: 7, suicide_raw: 424, accident_raw: 0, total_raw: 807},
    'DE': {name: 'Delaware', suicide_normalized: 2, accident_normalized: 0, total_normalized: 3, suicide_raw: 195, accident_raw: 0, total_raw: 361},
    'FL': {name: 'Florida', suicide_normalized: 50, accident_normalized: 1, total_normalized: 79, suicide_raw: 6060, accident_raw: 89, total_raw: 9561},
    'GA': {name: 'Georgia', suicide_normalized: 25, accident_normalized: 1, total_normalized: 42, suicide_raw: 2957, accident_raw: 129, total_raw: 5003},
    'HI': {name: 'Hawaii', suicide_normalized: 2, accident_normalized: 0, total_normalized: 2, suicide_raw: 150, accident_raw: 0, total_raw: 183},
    'IA': {name: 'Iowa', suicide_normalized: 7, accident_normalized: 0, total_normalized: 8, suicide_raw: 758, accident_raw: 12, total_raw: 903},
    'ID': {name: 'Idaho', suicide_normalized: 6, accident_normalized: 0, total_normalized: 7, suicide_raw: 725, accident_raw: 21, total_raw: 824},
    'IL': {name: 'Illinois', suicide_normalized: 16, accident_normalized: 1, total_normalized: 37, suicide_raw: 1889, accident_raw: 77, total_raw: 4473},
    'IN': {name: 'Indiana', suicide_normalized: 16, accident_normalized: 1, total_normalized: 25, suicide_raw: 1902, accident_raw: 61, total_raw: 3004},
    'KS': {name: 'Kansas', suicide_normalized: 8, accident_normalized: 1, total_normalized: 11, suicide_raw: 981, accident_raw: 29, total_raw: 1337},
    'KY': {name: 'Kentucky', suicide_normalized: 15, accident_normalized: 1, total_normalized: 20, suicide_raw: 1779, accident_raw: 69, total_raw: 2449},
    'LA': {name: 'Louisiana', suicide_normalized: 13, accident_normalized: 1, total_normalized: 29, suicide_raw: 1545, accident_raw: 146, total_raw: 3460},
    'MA': {name: 'Massachusetts', suicide_normalized: 4, accident_normalized: 0, total_normalized: 8, suicide_raw: 517, accident_raw: 0, total_raw: 970},
    'MD': {name: 'Maryland', suicide_normalized: 8, accident_normalized: 1, total_normalized: 19, suicide_raw: 993, accident_raw: 15, total_raw: 2247},
    'ME': {name: 'Maine', suicide_normalized: 3, accident_normalized: 0, total_normalized: 4, suicide_raw: 457, accident_raw: 0, total_raw: 537},
    'MI': {name: 'Michigan', suicide_normalized: 21, accident_normalized: 1, total_normalized: 39, suicide_raw: 2517, accident_raw: 43, total_raw: 4644},
    'MN': {name: 'Minnesota', suicide_normalized: 10, accident_normalized: 1, total_normalized: 13, suicide_raw: 1251, accident_raw: 17, total_raw: 1570},
    'MO': {name: 'Missouri', suicide_normalized: 18, accident_normalized: 1, total_normalized: 29, suicide_raw: 2104, accident_raw: 72, total_raw: 3462},
    'MS': {name: 'Mississippi', suicide_normalized: 9, accident_normalized: 1, total_normalized: 17, suicide_raw: 1099, accident_raw: 67, total_raw: 2065},
    'MT': {name: 'Montana', suicide_normalized: 5, accident_normalized: 0, total_normalized: 6, suicide_raw: 593, accident_raw: 17, total_raw: 674},
    'NC': {name: 'North Carolina', suicide_normalized: 24, accident_normalized: 1, total_normalized: 39, suicide_raw: 2915, accident_raw: 115, total_raw: 4675},
    'ND': {name: 'North Dakota', suicide_normalized: 2, accident_normalized: 0, total_normalized: 2, suicide_raw: 246, accident_raw: 0, total_raw: 285},
    'NE': {name: 'Nebraska', suicide_normalized: 3, accident_normalized: 1, total_normalized: 5, suicide_raw: 443, accident_raw: 19, total_raw: 648},
    'NH': {name: 'New Hampshire', suicide_normalized: 3, accident_normalized: 0, total_normalized: 3, suicide_raw: 356, accident_raw: 11, total_raw: 420},
    'NJ': {name: 'New Jersey', suicide_normalized: 6, accident_normalized: 1, total_normalized: 16, suicide_raw: 722, accident_raw: 13, total_raw: 1888},
    'NM': {name: 'New Mexico', suicide_normalized: 7, accident_normalized: 1, total_normalized: 10, suicide_raw: 877, accident_raw: 10, total_raw: 1256},
    'NV': {name: 'Nevada', suicide_normalized: 10, accident_normalized: 1, total_normalized: 13, suicide_raw: 1127, accident_raw: 13, total_raw: 1526},
    'NY': {name: 'New York', suicide_normalized: 16, accident_normalized: 1, total_normalized: 32, suicide_raw: 1945, accident_raw: 27, total_raw: 3848},
    'OH': {name: 'Ohio', suicide_normalized: 25, accident_normalized: 1, total_normalized: 41, suicide_raw: 3034, accident_raw: 55, total_raw: 4927},
    'OK': {name: 'Oklahoma', suicide_normalized: 14, accident_normalized: 1, total_normalized: 20, suicide_raw: 1660, accident_raw: 69, total_raw: 2417},
    'OR': {name: 'Oregon', suicide_normalized: 12, accident_normalized: 1, total_normalized: 15, suicide_raw: 1475, accident_raw: 19, total_raw: 1783},
    'PA': {name: 'Pennsylvania', suicide_normalized: 28, accident_normalized: 1, total_normalized: 47, suicide_raw: 3382, accident_raw: 139, total_raw: 5649},
    'RI': {name: 'Rhode Island', suicide_normalized: 1, accident_normalized: 0, total_normalized: 1, suicide_raw: 110, accident_raw: 0, total_raw: 180},
    'SC': {name: 'South Carolina', suicide_normalized: 15, accident_normalized: 1, total_normalized: 24, suicide_raw: 1721, accident_raw: 78, total_raw: 2841},
    'SD': {name: 'South Dakota', suicide_normalized: 3, accident_normalized: 0, total_normalized: 3, suicide_raw: 272, accident_raw: 0, total_raw: 310},
    'TN': {name: 'Tennessee', suicide_normalized: 20, accident_normalized: 1, total_normalized: 32, suicide_raw: 2478, accident_raw: 103, total_raw: 3905},
    'TX': {name: 'Texas', suicide_normalized: 57, accident_normalized: 1, total_normalized: 90, suicide_raw: 6910, accident_raw: 194, total_raw: 10834},
    'UT': {name: 'Utah', suicide_normalized: 10, accident_normalized: 0, total_normalized: 11, suicide_raw: 1121, accident_raw: 10, total_raw: 1285},
    'VA': {name: 'Virginia', suicide_normalized: 20, accident_normalized: 1, total_normalized: 29, suicide_raw: 2368, accident_raw: 45, total_raw: 3447},
    'VT': {name: 'Vermont', suicide_normalized: 2, accident_normalized: 0, total_normalized: 2, suicide_raw: 245, accident_raw: 0, total_raw: 269},
    'WA': {name: 'Washington', suicide_normalized: 16, accident_normalized: 1, total_normalized: 21, suicide_raw: 1971, accident_raw: 33, total_raw: 2546},
    'WI': {name: 'Wisconsin', suicide_normalized: 13, accident_normalized: 1, total_normalized: 17, suicide_raw: 1514, accident_raw: 19, total_raw: 1999},
    'WV': {name: 'West Virginia', suicide_normalized: 7, accident_normalized: 1, total_normalized: 9, suicide_raw: 833, accident_raw: 23, total_raw: 1109},
    'WY': {name: 'Wyoming', suicide_normalized: 3, accident_normalized: 0, total_normalized: 3, suicide_raw: 358, accident_raw: 13, total_raw: 407}
  };

  /**
   * Setup initial view of the canvas. Not yet interactive.
   */
  function init() {
    canvas = playable1Canvas;
    ctx = canvas.getContext('2d');

    setupLegend();
    drawStates(STARTING_STATE, undefined, true);
  }

  /**
   * Start interactive stuff.
   */
  function run() {
    this.hasStarted = true;

    updatePersons(selectedState);

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove.bind({this: this}));
  }

  /**
   * Draw the legend section of the canvas.
   */
  function setupLegend() {
    ctx.font = '14px Helvetica';
    ctx.textAlign = 'left';

    // Suicide label
    ctx.fillStyle = '#387567';
    ctx.fillRect(476, 108, 24, 24);
    ctx.fillText('Suicide', 512, 126);

    // Unintentional label
    ctx.fillStyle = '#D1A732';
    ctx.fillRect(476, 152, 24, 24);
    ctx.fillText('Unintentional Death', 512, 170);

    // Other
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(476, 196, 24, 24);
    ctx.strokeRect(477, 197, 22, 22);
    ctx.fillStyle = '#000000';
    ctx.fillText('Other', 512, 214);
  }

  /**
   * Draws updates to the state boxes. Yea, there'll be a little copy/paste
   * action that's about to happen.
   *
   * @param selected State that's selected
   * @param highlight State to highlight
   * @param isInit true if this is the initial draw of the states
   */
  function drawStates(selected, highlight, isInit) {
    var i;
    var currentX;
    var currentY;
    var hitBox;
    var startPosX = 24;
    var startPosY = 24;
    var boxSize = 24;

    if (highlight) {
      hasStateHighlight = true;
    }
    else {
      hasStateHighlight = false;
    }

    if (typeof selected === 'undefined') {
      console.log('WARNING: playable1.drawStates called without a selected state');
    }
    else if (selected && selectedState != selected) {
      selectedState = selected;

      // Draw state name
      ctx.clearRect(24, 346 - 16, 624, 200); //@todo figure out what that 200 height should actually be
      ctx.font = '600 16px Helvetica';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'left';
      ctx.fillText(STATE_DATA[selected].name, 24, 346);

      // Animation time for this text is dictated by the total_normalized number
      drawNumsAnimTime = 0;
      drawNumsIntervalId = window.setInterval(drawStateNumbers.bind({state: selected}), drawNumsAnimInterval);
    }

    ctx.clearRect(startPosX, startPosY, boxSize * 25, boxSize * 2);

    ctx.font = '12px Helvetica';
    ctx.textAlign = 'center';

    for (i = 0; i < STATES.length; i++) {
      // Reset styles
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#000000';
      
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
      if (STATES[i] == highlight && highlight != selected) {
        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(currentX+1, currentY+1, boxSize-2, boxSize-2);
      }

      if (STATES[i] == selected) {
        ctx.fillRect(currentX, currentY, boxSize, boxSize);
      }

      ctx.strokeRect(currentX, currentY, boxSize, boxSize);

      // Draw state abbreviation
      if (STATES[i] == selected) {
        ctx.fillStyle = '#fefefe';
      }
      else if (STATES[i] == highlight) {
        ctx.fillStyle = '#ff0000';
      }
      else {
        ctx.fillStyle = '#000000';
      }

      ctx.fillText(STATES[i], currentX + (boxSize / 2), currentY + (boxSize * .75));

      // Store coordinates for click events
      if (isInit) {
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
  }

  /**
   * Draw single frame of the state numbers updating.
   */
  function drawStateNumbers() {
    var fontSize = 14;
    var paddingY = 10
    var startY = 354;
    var labelX = 36;
    var numX = 178 + fontSize * 5 /*eh, the 5 is arbitrary*/;
    var totalNum;
    var suicideNum;
    var accidentNum;

    ctx.clearRect(labelX, startY, 624, 200);

    ctx.font = '14px Helvetica';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';

    var totalLineY =  startY + fontSize;
    var suicideLineY = startY + fontSize + paddingY + fontSize;
    var accidentLineY = startY + ((fontSize + paddingY) * 2) + fontSize;

    // Draw total # label
    ctx.fillText('Total firearm deaths:', labelX, totalLineY);

    // Draw suicide # label
    ctx.fillText('by suicide:', labelX, suicideLineY);

    // Draw accident # label
    ctx.fillText('unintentional:', labelX, accidentLineY);

    // Numbers align right
    ctx.textAlign = 'right';

    if (drawNumsAnimTime > drawNumsTotalAnimTime) {
      // Just make sure the final #s are actually drawn
      ctx.fillText(STATE_DATA[this.state].total_raw, numX, totalLineY);
      ctx.fillText(STATE_DATA[this.state].suicide_raw, numX, suicideLineY);
      ctx.fillText(STATE_DATA[this.state].accident_raw, numX, accidentLineY);

      // Done animating
      window.clearInterval(drawNumsIntervalId);
    }
    else {
      drawNumsAnimTime += drawNumsAnimInterval;

      totalNum = Math.floor(STATE_DATA[this.state].total_raw * (drawNumsAnimTime / drawNumsTotalAnimTime));
      ctx.fillText(totalNum, numX, totalLineY);

      suicideNum = Math.floor(STATE_DATA[this.state].suicide_raw * (drawNumsAnimTime / drawNumsTotalAnimTime));
      ctx.fillText(suicideNum, numX, suicideLineY);

      accidentNum = Math.floor(STATE_DATA[this.state].accident_raw * (drawNumsAnimTime / drawNumsTotalAnimTime));
      ctx.fillText(accidentNum, numX, accidentLineY);
    }
  }

  /**
   * Initial draw of the peoples.
   */
  // @todo More properly handle these two vars
  var currPerson;
  var intervalId;
  function updatePersons(state) {
    // Reset person counter
    currPerson = 0;

    // Clear any persons drawn previously
    ctx.clearRect(24, 100, 448, 220);

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
    var paddingX = 2;
    var paddingY = 4;
    var totalPersons = 100;
    var onefifth = totalPersons / 5;
    var numSuicideAccident;
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
    // Stop drawing once we hit the total
    else {
      // For cases where the estimations end up making it look like suicides and
      // accidental deaths account for 100% of deaths, throw in another 'other'
      // person to clarify that it's not actually 100%.
      /* ... ehhh actualy maybe don't do this. we'll be showing the totals anyway
      numSuicideAccident = STATE_DATA[this.state].suicide_normalized + STATE_DATA[this.state].accident_normalized;
      if (STATE_DATA[this.state].total_normalized == numSuicideAccident) {
        haltDrawing = currPerson > STATE_DATA[this.state].total_normalized;
      }
      else {
      */
        haltDrawing = currPerson >= STATE_DATA[this.state].total_normalized
      //}
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
    if (i < STATE_DATA[this.state].suicide_normalized) {
      img = imgSuicide;
    }
    else if (i >= STATE_DATA[this.state].suicide_normalized &&
      i < STATE_DATA[this.state].suicide_normalized + STATE_DATA[this.state].accident_normalized) {
      img = imgAccident;
    }

    xAdjust = onefifth * row;
    // + 2px for padding in between persons
    currentX = ((i - xAdjust) * (imgWidth + paddingX)) + startPosX;
    currentY = startPosY + (row * (imgHeight + paddingY));

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
      drawStates(hit, hit, false);
    }
  }

  /**
   * Listener for mouse movements on the canvas.
   */
  function onMouseMove(event) {
    // Highlight states on hover over
    var hit = checkHit(event.layerX, event.layerY);
    if (hit) {
      drawStates(selectedState, hit, false);
    }
    else if (hasStateHighlight) {
      drawStates(selectedState, undefined, false); 
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
    hasStarted: hasStarted,
    init: init,
    run: run
  }

})();

playable1.init();

/**
 * Only start playable1 once it comes into view.
 */
window.onscroll = function() {
  var buffer = 150;
  var screenBottom = window.scrollY + window.innerHeight;
  var canvasTop = playable1Canvas.offsetTop + buffer;

  if (!playable1.hasStarted && screenBottom > canvasTop) {
    playable1.run();
  }
}