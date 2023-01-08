/**
 * 11 boxes across
 * 7 boxes high
 *
 * 56 x 56?
 */

var playable3;
var canvas3 = document.getElementById('canvas-3');

playable3 = (function () {
  var CANVAS_HEIGHT = canvas3.height;
  var CANVAS_WIDTH = canvas3.width;
  var CANVAS_GRID_SIZE = 12;
  var STATE_SIZE = 56;
  var STATE_CANVAS_MARGIN = 16;

  // Colors
  var COLOR_GRID = '#cccccc';
  var COLOR_CROSSHAIRS = '#cc3333';

  // Canvas and context
  var canvas;
  var ctx;

  // Current mouse pointer positions
  var mouseX;
  var mouseY;

  // Timers
  var time;
  var timeLastChecked;

  // Vars to help with startup animation
  var startupCounter = 0;
  var startupCountdown = 10;
  var startupInterval = 10;

  // Bottom estimates bar animation
  var estBarCountdown = 0;
  var estBarInterval = 250;
  var estBarOld = undefined;

  // Array of state objects
  var p3States = [];
  var p3StatesData = [
    {
      abbr: 'AK',
      fullname: 'Alaska',
      row: 6,
      col: 0,
      deaths: 424,
      saved: 288,
      lawEnacted: false,
    },
    {
      abbr: 'AL',
      fullname: 'Alabama',
      row: 5,
      col: 6,
      deaths: 1910,
      saved: 1298,
      lawEnacted: false,
    },
    {
      abbr: 'AR',
      fullname: 'Arkansas',
      row: 4,
      col: 4,
      deaths: 1194,
      saved: 811,
      lawEnacted: false,
    },
    {
      abbr: 'AZ',
      fullname: 'Arizona',
      row: 4,
      col: 1,
      deaths: 2612,
      saved: 1776,
      lawEnacted: false,
    },
    {
      abbr: 'CA',
      fullname: 'California',
      row: 3,
      col: 0,
      deaths: 6176,
      saved: 0,
      lawEnacted: true,
    },
    {
      abbr: 'CO',
      fullname: 'Colorado',
      row: 3,
      col: 2,
      deaths: 1892,
      saved: 1286,
      lawEnacted: false,
    },
    {
      abbr: 'CT',
      fullname: 'Connecticut',
      row: 2,
      col: 9,
      deaths: 424,
      saved: 0,
      lawEnacted: true,
    },
    {
      abbr: 'DE',
      fullname: 'Delaware',
      row: 3,
      col: 8,
      deaths: 195,
      saved: 132,
      lawEnacted: false,
    },
    {
      abbr: 'FL',
      fullname: 'Florida',
      row: 6,
      col: 9,
      deaths: 6060,
      saved: 4120,
      lawEnacted: false,
    },
    {
      abbr: 'GA',
      fullname: 'Georgia',
      row: 5,
      col: 7,
      deaths: 2957,
      saved: 2010,
      lawEnacted: false,
    },
    {
      abbr: 'HI',
      fullname: 'Hawaii',
      row: 6,
      col: 1,
      deaths: 150,
      saved: 102,
      lawEnacted: false,
    },
    {
      abbr: 'IA',
      fullname: 'Iowa',
      row: 2,
      col: 4,
      deaths: 758,
      saved: 515,
      lawEnacted: false,
    },
    {
      abbr: 'ID',
      fullname: 'Idaho',
      row: 1,
      col: 1,
      deaths: 725,
      saved: 493,
      lawEnacted: false,
    },
    {
      abbr: 'IL',
      fullname: 'Illinois',
      row: 3,
      col: 5,
      deaths: 1889,
      saved: 1284,
      lawEnacted: false,
    },
    {
      abbr: 'IN',
      fullname: 'Indiana',
      row: 2,
      col: 5,
      deaths: 1902,
      saved: 1293,
      lawEnacted: false,
    },
    {
      abbr: 'KS',
      fullname: 'Kansas',
      row: 4,
      col: 3,
      deaths: 981,
      saved: 667,
      lawEnacted: false,
    },
    {
      abbr: 'KY',
      fullname: 'Kentucky',
      row: 3,
      col: 6,
      deaths: 1779,
      saved: 1209,
      lawEnacted: false,
    },
    {
      abbr: 'LA',
      fullname: 'Louisiana',
      row: 5,
      col: 4,
      deaths: 1545,
      saved: 1050,
      lawEnacted: false,
    },
    {
      abbr: 'MA',
      fullname: 'Massachusetts',
      row: 1,
      col: 10,
      deaths: 517,
      saved: 0,
      lawEnacted: true,
    },
    {
      abbr: 'MD',
      fullname: 'Maryland',
      row: 3,
      col: 7,
      deaths: 993,
      saved: 675,
      lawEnacted: false,
    },
    {
      abbr: 'ME',
      fullname: 'Maine',
      row: 0,
      col: 10,
      deaths: 457,
      saved: 310,
      lawEnacted: false,
    },
    {
      abbr: 'MI',
      fullname: 'Michigan',
      row: 1,
      col: 6,
      deaths: 2517,
      saved: 1711,
      lawEnacted: false,
    },
    {
      abbr: 'MN',
      fullname: 'Minnesota',
      row: 1,
      col: 4,
      deaths: 1251,
      saved: 850,
      lawEnacted: false,
    },
    {
      abbr: 'MO',
      fullname: 'Missouri',
      row: 3,
      col: 4,
      deaths: 2104,
      saved: 1430,
      lawEnacted: false,
    },
    {
      abbr: 'MS',
      fullname: 'Mississippi',
      row: 5,
      col: 5,
      deaths: 1099,
      saved: 747,
      lawEnacted: false,
    },
    {
      abbr: 'MT',
      fullname: 'Montana',
      row: 1,
      col: 2,
      deaths: 593,
      saved: 403,
      lawEnacted: false,
    },
    {
      abbr: 'NC',
      fullname: 'North Carolina',
      row: 4,
      col: 8,
      deaths: 2915,
      saved: 1982,
      lawEnacted: false,
    },
    {
      abbr: 'ND',
      fullname: 'North Dakota',
      row: 1,
      col: 3,
      deaths: 246,
      saved: 167,
      lawEnacted: false,
    },
    {
      abbr: 'NE',
      fullname: 'Nebraska',
      row: 3,
      col: 3,
      deaths: 443,
      saved: 301,
      lawEnacted: false,
    },
    {
      abbr: 'NH',
      fullname: 'New Hampshire',
      row: 1,
      col: 9,
      deaths: 356,
      saved: 242,
      lawEnacted: false,
    },
    {
      abbr: 'NJ',
      fullname: 'New Jersey',
      row: 3,
      col: 9,
      deaths: 722,
      saved: 490,
      lawEnacted: false,
    },
    {
      abbr: 'NM',
      fullname: 'New Mexico',
      row: 4,
      col: 2,
      deaths: 877,
      saved: 596,
      lawEnacted: false,
    },
    {
      abbr: 'NV',
      fullname: 'Nevada',
      row: 2,
      col: 1,
      deaths: 1127,
      saved: 766,
      lawEnacted: false,
    },
    {
      abbr: 'NY',
      fullname: 'New York',
      row: 2,
      col: 8,
      deaths: 1945,
      saved: 0,
      lawEnacted: true,
    },
    {
      abbr: 'OH',
      fullname: 'Ohio',
      row: 2,
      col: 6,
      deaths: 3034,
      saved: 2063,
      lawEnacted: false,
    },
    {
      abbr: 'OK',
      fullname: 'Oklahoma',
      row: 5,
      col: 3,
      deaths: 1660,
      saved: 1128,
      lawEnacted: false,
    },
    {
      abbr: 'OR',
      fullname: 'Oregon',
      row: 2,
      col: 0,
      deaths: 1475,
      saved: 1003,
      lawEnacted: false,
    },
    {
      abbr: 'PA',
      fullname: 'Pennsylvania',
      row: 2,
      col: 7,
      deaths: 3382,
      saved: 2299,
      lawEnacted: false,
    },
    {
      abbr: 'RI',
      fullname: 'Rhode Island',
      row: 2,
      col: 10,
      deaths: 110,
      saved: 74,
      lawEnacted: false,
    },
    {
      abbr: 'SC',
      fullname: 'South Carolina',
      row: 5,
      col: 8,
      deaths: 1721,
      saved: 1170,
      lawEnacted: false,
    },
    {
      abbr: 'SD',
      fullname: 'South Dakota',
      row: 2,
      col: 3,
      deaths: 272,
      saved: 184,
      lawEnacted: false,
    },
    {
      abbr: 'TN',
      fullname: 'Tennessee',
      row: 4,
      col: 5,
      deaths: 2478,
      saved: 1685,
      lawEnacted: false,
    },
    {
      abbr: 'TX',
      fullname: 'Texas',
      row: 6,
      col: 3,
      deaths: 6910,
      saved: 4698,
      lawEnacted: false,
    },
    {
      abbr: 'UT',
      fullname: 'Utah',
      row: 3,
      col: 1,
      deaths: 1121,
      saved: 762,
      lawEnacted: false,
    },
    {
      abbr: 'VA',
      fullname: 'Virginia',
      row: 4,
      col: 7,
      deaths: 2368,
      saved: 1610,
      lawEnacted: false,
    },
    {
      abbr: 'VT',
      fullname: 'Vermont',
      row: 1,
      col: 8,
      deaths: 245,
      saved: 166,
      lawEnacted: false,
    },
    {
      abbr: 'WA',
      fullname: 'Washington',
      row: 1,
      col: 0,
      deaths: 1971,
      saved: 1340,
      lawEnacted: false,
    },
    {
      abbr: 'WI',
      fullname: 'Wisconsin',
      row: 1,
      col: 5,
      deaths: 1514,
      saved: 1029,
      lawEnacted: false,
    },
    {
      abbr: 'WV',
      fullname: 'West Virginia',
      row: 4,
      col: 6,
      deaths: 833,
      saved: 566,
      lawEnacted: false,
    },
    {
      abbr: 'WY',
      fullname: 'Wyoming',
      row: 2,
      col: 2,
      deaths: 358,
      saved: 243,
      lawEnacted: false,
    },
  ];

  // Event listener
  var stateEventListener = {
    hoverEvent: undefined,
    clickEvent: undefined,
  };

  // Playable state
  var hasStarted;
  var isPaused;

  function init() {
    var i;
    var p3s;

    canvas = canvas3;
    ctx = canvas.getContext('2d');
    hasStarted = false;
    isPaused = false;

    // Initialize states
    for (i = 0; i < p3StatesData.length; i++) {
      p3s = new P3State();
      p3s.ctx = ctx;
      p3s.canvas = canvas;
      p3s.eventListener = stateEventListener;
      p3s.x = STATE_CANVAS_MARGIN + p3StatesData[i].col * STATE_SIZE;
      p3s.y = STATE_CANVAS_MARGIN + p3StatesData[i].row * STATE_SIZE;
      p3s.name = p3StatesData[i].abbr;
      p3s.estDeaths = p3StatesData[i].deaths;
      p3s.estSaved = p3StatesData[i].saved;
      p3s.size = STATE_SIZE;
      p3s.lawEnacted = p3StatesData[i].lawEnacted;
      if (p3s.lawEnacted === true) {
        p3s.enabled = false;
      }

      p3States[p3States.length] = p3s;
    }

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove);
  }

  function start() {
    hasStarted = true;

    draw();
  }

  function pause() {
    isPaused = true;
  }

  function resume() {
    isPaused = false;
    draw();
  }

  /**
   * The main draw loop.
   */
  function draw() {
    var deltaTime;

    // Break out of the draw loop if paused
    if (isPaused === true) {
      return;
    }

    time = new Date().getTime();
    // skip first frame
    if (timeLastChecked === undefined) {
      timeLastChecked = time;
      window.requestAnimationFrame(draw);
      return;
    } else {
      deltaTime = time - timeLastChecked;
      timeLastChecked = time;
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (GLOBAL_SHOW_DEBUG) {
      debugDrawGrid();
      debugDrawPointer();
    }

    // Startup animation logic
    if (startupCounter < p3States.length) {
      if (startupCountdown <= 0) {
        p3States[startupCounter].isVisible = true;
        startupCounter++;
        startupCountdown = startupInterval;
      } else {
        startupCountdown -= deltaTime;
      }
    }

    // Draw state boxes
    drawStates();

    // Do whatever in response to some custom events
    runStateEvents();

    // Draw bottom bar of estimates
    // HACK: because of how I've setup the events and when this thing draws, this needs
    // to happen after runStateEvents() otherwise you'll see a flicker each time a
    // state is clicked. Sure, I could refactor, but mehhhhhh.
    drawEstimatesBar(deltaTime);

    window.requestAnimationFrame(draw);
  }

  /**
   * Draw state boxes.
   */
  function drawStates() {
    var i;
    var mouseInBounds = false;

    // Default cursor style
    canvas.style.cursor = 'default';

    // Default outline stroke style
    ctx.lineWidth = '2';
    ctx.strokeStyle = '#000000';

    // Default fill text style
    ctx.font = '16px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (i = 0; i < p3States.length; i++) {
      if (p3States[i].isVisible) {
        if (p3States[i].isInBounds(mouseX, mouseY)) {
          mouseInBounds = true;
        } else {
          mouseInBounds = false;
        }
        p3States[i].draw(mouseInBounds);
      }
    }
  }

  /**
   * Draw bottom bar displaying suicide estimates.
   */
  function drawEstimatesBar(deltaTime) {
    var i;
    var label;
    var useDefault = true;
    var defaultTotal = 81187;
    var defaultLabel = 'Firearm Suicides (2010-2013): ' + defaultTotal;
    var estLabel = 'Est. Firearm Suicides (2010-2013): ';
    var estSavedLabel = ' / Est. Saved: ';
    var estTotal = defaultTotal;
    var estSaved = 0;
    var animProgress = 0;

    for (i = 0; i < p3States.length; i++) {
      if (p3States[i].lawEnacted && p3States[i].enabled) {
        useDefault = false;
        estTotal -= p3States[i].estSaved;
        estSaved += p3States[i].estSaved;
      }
    }

    if (estBarCountdown > 0) {
      animProgress = estBarCountdown / estBarInterval;
      estBarCountdown -= deltaTime;
    }

    if (estBarCountdown < 0) {
      estBarCountdown = 0;
    }

    // Draw label
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    if (useDefault) {
      label = defaultLabel;
    } else {
      label = estLabel + estTotal + estSavedLabel + estSaved;
    }
    ctx.fillText(label, CANVAS_WIDTH / 2, 424);

    var boxX = STATE_CANVAS_MARGIN;
    var boxY = 444;
    var boxW = CANVAS_WIDTH - STATE_CANVAS_MARGIN * 2;
    var boxH = 24;

    // Draw box fill
    var estWidth;
    var origWidth = boxW - 2;
    var drawTotal = estTotal;

    if (animProgress > 0) {
      drawTotal += Math.floor(animProgress * (estBarOld - estTotal));
    }

    estWidth = Math.floor((drawTotal / defaultTotal) * origWidth);

    // Background color underneath the animated bar
    ctx.fillStyle = '#07a1c5';
    ctx.fillRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);
    // Animated bar
    ctx.fillStyle = '#ef5f48';
    ctx.fillRect(boxX + 1, boxY + 1, estWidth, boxH - 2);

    // Draw box outline
    ctx.lineWidth = '2';
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(boxX, boxY, boxW, boxH);
  }

  /**
   * Draw state stats
   */
  function runStateEvents() {
    var i;
    var hasLawEnacted;
    var stateInfo;
    var labelsX = STATE_CANVAS_MARGIN + 146;
    var labelsY = STATE_CANVAS_MARGIN + 2;
    var statsX = STATE_CANVAS_MARGIN + 380;
    var statsY = STATE_CANVAS_MARGIN + 2;

    if (stateEventListener.hoverEvent !== undefined) {
      stateInfo = getStateInfo(stateEventListener.hoverEvent);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 18px Helvetica';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      ctx.fillText(
        stateInfo.fullname,
        STATE_CANVAS_MARGIN,
        STATE_CANVAS_MARGIN
      );

      ctx.font = '14px Helvetica';

      ctx.fillText('Firearm suicides from 2010-2013:', labelsX, labelsY);
      ctx.fillText(stateInfo.deaths, statsX, statsY);

      if (stateInfo.saved > 0) {
        ctx.fillText(
          'Est. # of suicides if law was in place:',
          labelsX,
          labelsY + 20
        );
        ctx.fillText(stateInfo.deaths - stateInfo.saved, statsX, statsY + 20);
      }
    }

    if (stateEventListener.clickEvent !== undefined) {
      stateInfo = getStateInfo(stateEventListener.clickEvent);

      // start countdown to new value
      estBarCountdown = estBarInterval;

      // Store the starting value for the animation
      estBarOld = 0;
      for (i = 0; i < p3States.length; i++) {
        // This one was just clicked, so use the opposite
        if (stateInfo.abbr == p3States[i].name) {
          hasLawEnacted = !p3States[i].lawEnacted;
        } else {
          hasLawEnacted = p3States[i].lawEnacted;
        }

        if (hasLawEnacted) {
          estBarOld += p3States[i].estDeaths - p3States[i].estSaved;
        } else {
          estBarOld += p3States[i].estDeaths;
        }
      }

      // Clear the click event
      stateEventListener.clickEvent = undefined;
    }
  }

  /**
   * Helper that gets state info for the given abbreviation.
   */
  function getStateInfo(abbr) {
    var i;

    for (i = 0; i < p3StatesData.length; i++) {
      if (abbr == p3StatesData[i].abbr) {
        return p3StatesData[i];
      }
    }

    return undefined;
  }

  /**
   * For debug. Draw grid.
   */
  function debugDrawGrid() {
    var i;
    var xpos;
    var ypos;

    ctx.strokeStyle = COLOR_GRID;

    // Draw vertical lines
    i = 0;
    while (i * CANVAS_GRID_SIZE <= CANVAS_WIDTH) {
      xpos = i * CANVAS_GRID_SIZE;

      ctx.beginPath();
      ctx.moveTo(xpos, 0);
      ctx.lineTo(xpos, CANVAS_HEIGHT);
      ctx.stroke();

      i++;
    }

    // Draw horizontal lines
    i = 0;
    while (i * CANVAS_GRID_SIZE <= CANVAS_HEIGHT) {
      ypos = i * CANVAS_GRID_SIZE;

      ctx.beginPath();
      ctx.moveTo(0, ypos);
      ctx.lineTo(CANVAS_WIDTH, ypos);
      ctx.stroke();

      i++;
    }
  }

  /**
   * Debug. Draw crosshairs on the pointer position.
   */
  function debugDrawPointer() {
    ctx.fillStyle = COLOR_CROSSHAIRS;
    ctx.strokeStyle = COLOR_CROSSHAIRS;

    ctx.beginPath();

    // Vertical line
    ctx.moveTo(mouseX, 0);
    ctx.lineTo(mouseX, CANVAS_HEIGHT);

    // Horizontal line
    ctx.moveTo(0, mouseY);
    ctx.lineTo(CANVAS_WIDTH, mouseY);

    ctx.stroke();

    // Draw positions
    ctx.font = '12px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('x: ' + mouseX, CANVAS_WIDTH - 40, 12);
    ctx.fillText('y: ' + mouseY, CANVAS_WIDTH - 40, 24);
  }

  /**
   * click event listener
   */
  function onClick(event) {
    for (i = 0; i < p3States.length; i++) {
      if (p3States[i].isInBounds(mouseX, mouseY)) {
        p3States[i].onclick();
        return;
      }
    }
  }

  /**
   * mousemove event listener
   */
  function onMouseMove(event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  }

  return {
    hasStarted: function () {
      return hasStarted;
    },
    isPaused: function () {
      return isPaused;
    },
    init: init,
    start: start,
    pause: pause,
    resume: resume,
  };
})();

playable3.init();
