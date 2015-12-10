/**
 * 11 boxes across
 * 7 boxes high
 *
 * 56 x 56?
 */

var playable3;
var canvas3 = document.getElementById('canvas-3');

playable3 = (function() {

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
  var startupCountdown = 16;
  var startupInterval = 16;

  // Array of state objects
  var p3States = [];
  var p3StatesData = [
    {abbr: 'AK', fullname: 'Alaska', row: 6, col: 0, deaths: 424, saved: 0, lawEnacted: false},
    {abbr: 'AL', fullname: 'Alabama', row: 5, col: 6, deaths: 1910, saved: 0, lawEnacted: false},
    {abbr: 'AR', fullname: 'Arkansas', row: 4, col: 4, deaths: 1194, saved: 0, lawEnacted: false},
    {abbr: 'AZ', fullname: 'Arizona', row: 4, col: 1, deaths: 2612, saved: 0, lawEnacted: false},
    {abbr: 'CA', fullname: 'California', row: 3, col: 0, deaths: 6176, saved: 0, lawEnacted: true},
    {abbr: 'CO', fullname: 'Colorado', row: 3, col: 2, deaths: 1892, saved: 0, lawEnacted: false},
    {abbr: 'CT', fullname: 'Connecticut', row: 2, col: 9, deaths: 424, saved: 0, lawEnacted: true},
    {abbr: 'DE', fullname: 'Delaware', row: 3, col: 8, deaths: 195, saved: 0, lawEnacted: false},
    {abbr: 'FL', fullname: 'Florida', row: 6, col: 9, deaths: 6060, saved: 0, lawEnacted: false},
    {abbr: 'GA', fullname: 'Georgia', row: 5, col: 7, deaths: 2957, saved: 0, lawEnacted: false},
    {abbr: 'HI', fullname: 'Hawaii', row: 6, col: 1, deaths: 150, saved: 0, lawEnacted: false},
    {abbr: 'IA', fullname: 'Iowa', row: 2, col: 4, deaths: 758, saved: 0, lawEnacted: false},
    {abbr: 'ID', fullname: 'Idaho', row: 1, col: 1, deaths: 725, saved: 0, lawEnacted: false},
    {abbr: 'IL', fullname: 'Illinois', row: 3, col: 5, deaths: 1889, saved: 0, lawEnacted: false},
    {abbr: 'IN', fullname: 'Indiana', row: 2, col: 5, deaths: 1902, saved: 0, lawEnacted: false},
    {abbr: 'KS', fullname: 'Kansas', row: 4, col: 3, deaths: 981, saved: 0, lawEnacted: false},
    {abbr: 'KY', fullname: 'Kentucky', row: 3, col: 6, deaths: 1779, saved: 0, lawEnacted: false},
    {abbr: 'LA', fullname: 'Louisiana', row: 5, col: 4, deaths: 1545, saved: 0, lawEnacted: false},
    {abbr: 'MA', fullname: 'Massachusetts', row: 1, col: 10, deaths: 517, saved: 0, lawEnacted: true},
    {abbr: 'MD', fullname: 'Maryland', row: 3, col: 7, deaths: 993, saved: 0, lawEnacted: false},
    {abbr: 'ME', fullname: 'Maine', row: 0, col: 10, deaths: 457, saved: 0, lawEnacted: false},
    {abbr: 'MI', fullname: 'Michigan', row: 1, col: 6, deaths: 2517, saved: 0, lawEnacted: false},
    {abbr: 'MN', fullname: 'Minnesota', row: 1, col: 4, deaths: 1251, saved: 0, lawEnacted: false},
    {abbr: 'MO', fullname: 'Missouri', row: 3, col: 4, deaths: 2104, saved: 0, lawEnacted: false},
    {abbr: 'MS', fullname: 'Mississippi', row: 5, col: 5, deaths: 1099, saved: 0, lawEnacted: false},
    {abbr: 'MT', fullname: 'Montana', row: 1, col: 2, deaths: 593, saved: 0, lawEnacted: false},
    {abbr: 'NC', fullname: 'North Carolina', row: 4, col: 8, deaths: 2915, saved: 0, lawEnacted: false},
    {abbr: 'ND', fullname: 'North Dakota', row: 1, col: 3, deaths: 246, saved: 0, lawEnacted: false},
    {abbr: 'NE', fullname: 'Nebraska', row: 3, col: 3, deaths: 443, saved: 0, lawEnacted: false},
    {abbr: 'NH', fullname: 'New Hampshire', row: 1, col: 9, deaths: 356, saved: 0, lawEnacted: false},
    {abbr: 'NJ', fullname: 'New Jersey', row: 3, col: 9, deaths: 722, saved: 0, lawEnacted: false},
    {abbr: 'NM', fullname: 'New Mexico', row: 4, col: 2, deaths: 877, saved: 0, lawEnacted: false},
    {abbr: 'NV', fullname: 'Nevada', row: 2, col: 1, deaths: 1127, saved: 0, lawEnacted: false},
    {abbr: 'NY', fullname: 'New York', row: 2, col: 8, deaths: 1945, saved: 0, lawEnacted: true},
    {abbr: 'OH', fullname: 'Ohio', row: 2, col: 6, deaths: 3034, saved: 0, lawEnacted: false},
    {abbr: 'OK', fullname: 'Oklahoma', row: 5, col: 3, deaths: 1660, saved: 0, lawEnacted: false},
    {abbr: 'OR', fullname: 'Oregon', row: 2, col: 0, deaths: 1475, saved: 0, lawEnacted: false},
    {abbr: 'PA', fullname: 'Pennsylvania', row: 2, col: 7, deaths: 3382, saved: 0, lawEnacted: false},
    {abbr: 'RI', fullname: 'Rhode Island', row: 2, col: 10, deaths: 110, saved: 0, lawEnacted: false},
    {abbr: 'SC', fullname: 'South Carolina', row: 5, col: 8, deaths: 1721, saved: 0, lawEnacted: false},
    {abbr: 'SD', fullname: 'South Dakota', row: 2, col: 3, deaths: 272, saved: 0, lawEnacted: false},
    {abbr: 'TN', fullname: 'Tennessee', row: 4, col: 5, deaths: 2478, saved: 0, lawEnacted: false},
    {abbr: 'TX', fullname: 'Texas', row: 6, col: 3, deaths: 6910, saved: 0, lawEnacted: false},
    {abbr: 'UT', fullname: 'Utah', row: 3, col: 1, deaths: 1121, saved: 0, lawEnacted: false},
    {abbr: 'VA', fullname: 'Virginia', row: 4, col: 7, deaths: 2368, saved: 0, lawEnacted: false},
    {abbr: 'VT', fullname: 'Vermont', row: 1, col: 8, deaths: 245, saved: 0, lawEnacted: false},
    {abbr: 'WA', fullname: 'Washington', row: 1, col: 0, deaths: 1971, saved: 0, lawEnacted: false},
    {abbr: 'WI', fullname: 'Wisconsin', row: 1, col: 5, deaths: 1514, saved: 0, lawEnacted: false},
    {abbr: 'WV', fullname: 'West Virginia', row: 4, col: 6, deaths: 833, saved: 0, lawEnacted: false},
    {abbr: 'WY', fullname: 'Wyoming', row: 2, col: 2, deaths: 358, saved: 0, lawEnacted: false}
  ];

  var hasStarted;

  function init() {
    var i;
    var p3s;

    canvas = canvas3;
    ctx = canvas.getContext('2d');
    hasStarted = false;

    // Initialize states
    for (i = 0; i < p3StatesData.length; i++) {
      p3s = new P3State();
      p3s.ctx = ctx;
      p3s.canvas = canvas;
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

  /**
   * The main draw loop.
   */
  function draw() {
    var deltaTime;

    time = (new Date()).getTime();
    // skip first frame
    if (timeLastChecked === undefined) {
      timeLastChecked = time;
      window.requestAnimationFrame(draw);
      return;
    }
    else {
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
      }
      else {
        startupCountdown -= deltaTime;
      }
    }
    drawStates();

    window.requestAnimationFrame(draw);
  }

  function drawStates() {
    var i;

    ctx.beginPath();
    ctx.lineWidth = '2';
    ctx.strokeStyle = 'black';

    for (i = 0; i < p3States.length; i++) {
      if (p3States[i].isVisible) {
        p3States[i].draw();
      }
    }
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
    console.log('onClick');
  }

  /**
   * mousemove event listener
   */
  function onMouseMove(event) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }

  return {
    hasStarted: hasStarted,
    init: init,
    start: start
  }
})();

playable3.init();