/**
 * Controls the canvas canvas-2.
 *
 * The intent of this canvas is to observe the effectiveness of gun locks in a
 * simulation of attempted suicides by firearm.
 *
 */

var playable2;
var canvas2 = document.getElementById('canvas-2');

playable2 = (function() {

  var CANVAS_HEIGHT = canvas2.height;
  var CANVAS_WIDTH = canvas2.width;
  var CANVAS_GRID_SIZE = 12;

  // Colors
  var COLOR_CROSSHAIRS = '#cc3333';
  var COLOR_GRID = '#cccccc';
  var COLOR_BUTTON_HOVER = '#cccccc';
  var COLOR_BUTTON_OFF = '#333333';
  var COLOR_BUTTON_ON = '#777777';
  var COLOR_BUTTON_TEXT = '#ffffff';

  // Canvas and context
  var canvas;
  var ctx;

  // Boolean. True if this has already run init().
  var hasStarted = false
  
  // Boolean. True if we should draw debug stuff.
  var showDebug = false;

  // Boolean. True if the simulation is running.
  var isRunning = false;

  // Current mouse pointer positions
  var mouseX;
  var mouseY;

  // Event queue
  var eventQueue = [];

  /**
   * Setup initial view of the canvas
   */
  function init() {
    this.hasStarted = true;

    canvas = canvas2;
    ctx = canvas.getContext('2d');

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove);

    debugDrawGrid();

    window.requestAnimationFrame(draw);
  }

  /**
   * @todo Comment me
   */
  function onClick(event) {
    eventQueue.push(event);
  }

  /**
   * @todo Comment me
   */
  function onMouseMove(event) {
    mouseX = event.layerX;
    mouseY = event.layerY;
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
   * Main draw loop
   */
  function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (GLOBAL_SHOW_DEBUG) {
      debugDrawGrid();
      debugDrawPointer();
    }

    drawStartButton();
    drawSliders();

    // If nothing's consumed an event in the queue, then clear it all.
    // um... is this the right thing to do? Could we run into some weird
    // race condition where a click happens but nothing in this loop
    // actually gets a chance to see it?
    eventQueue = [];

    window.requestAnimationFrame(draw);
  }

  /**
   * Draw the "start simulation" button
   */
  function drawStartButton() {
    var i;
    var text;
    var isClicked = false;;
    var boxWidth = 200;
    var boxHeight = 36;
    var boxMargin = 12;

    var xPosBox = (CANVAS_WIDTH - boxWidth) / 2;
    var yPosBox = boxMargin;

    function inButtonBounds(x, y) {
      return mouseX >= xPosBox && mouseX <= xPosBox + boxWidth &&
          mouseY >= yPosBox && mouseY <= yPosBox + boxHeight
    }

    // Check event queue for any clicks
    i = eventQueue.length;
    while (i--) {
      if (eventQueue[i].type == 'click') {
        if (inButtonBounds(eventQueue[i].layerX, eventQueue[i].layerY)) {
          eventQueue.splice(i, 1);
          isClicked = true;
        }
      }
    }

    // If there was a click, switch the isRunning flag
    if (isClicked) {
      isRunning = !isRunning;
    }

    if (isRunning) {
      ctx.fillStyle = COLOR_BUTTON_ON;
      text = 'STOP SIMULATION';
    }
    else {
      ctx.fillStyle = COLOR_BUTTON_OFF;
      text = 'START SIMULATION';
    }

    // Is mouse currently hovering over
    if (inButtonBounds(mouseX, mouseY)) {
      ctx.fillStyle = COLOR_BUTTON_HOVER;
    }

    // Draw the button
    ctx.fillRect(xPosBox, yPosBox, boxWidth, boxHeight);

    // Draw text
    ctx.font = '16px Helvetica';
    ctx.fillStyle = COLOR_BUTTON_TEXT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, CANVAS_WIDTH / 2, boxMargin + (boxHeight / 2));
  }

  /**
   * Draw variable sliders.
   */
  function drawSliders() {
    var lineSize = 3;
    var lineWidth = 156;
    var lineEdgeHeight = 24;
    var yTop = 84;
    var leftMargin;
    var xSlider1;
    var xSlider2;
    var xSliderGap = 72;
    var sliderWidth = 12;
    var sliderHeight = 24;

    ctx.fillStyle = '#000'; // @todo pick better color
    ctx.font = '14px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Slider 1 - % of people with gun locks
    leftMargin = (CANVAS_WIDTH - (lineWidth * 2) - xSliderGap) / 2;
    xSlider1 = leftMargin;
    // horizontal line
    ctx.fillRect(xSlider1, yTop + 12 - 1, lineWidth, lineSize);
    // vertical lines
    ctx.fillRect(xSlider1, yTop, lineSize, lineEdgeHeight);
    ctx.fillRect(xSlider1 + lineWidth, yTop, lineSize, lineEdgeHeight);
    // text label
    ctx.fillText('% of people with gun locks', xSlider1 + (lineWidth / 2), yTop + lineEdgeHeight + 12);

    // Slider 2 - % effectiveness of gun locks
    xSlider2 = leftMargin + lineWidth + xSliderGap;
    // horizontal line
    ctx.fillRect(xSlider2, yTop + 12 - 1, lineWidth, lineSize);
    // vertical lines
    ctx.fillRect(xSlider2, yTop, lineSize, lineEdgeHeight);
    ctx.fillRect(xSlider2 + lineWidth, yTop, lineSize, lineEdgeHeight);
    // text label
    ctx.fillText('% effectiveness of gun locks', xSlider2 + (lineWidth / 2), yTop + lineEdgeHeight + 12);

    // Draw the movable parts
    ctx.fillStyle = '#cccccc'; // @todo pick better color
    ctx.textBaseline = 'bottom';

    // for Slider 1
    var s1Val = 0;
    var s1Pos = xSlider1 + (lineWidth * (s1Val / 100) - (sliderWidth / 2));
    ctx.fillRect(s1Pos, yTop, sliderWidth, sliderHeight);
    ctx.fillText(s1Val + '%', s1Pos + (sliderWidth / 2), yTop - 4);

    // for Slider 2
    var s2Val = 68;
    var s2Pos = xSlider2 + (lineWidth * (s2Val / 100) - (sliderWidth / 2));
    ctx.fillRect(s2Pos, yTop, sliderWidth, sliderHeight);
    ctx.fillText(s2Val + '%', s2Pos + (sliderWidth / 2), yTop - 4);
  }

  return {
    init: init,
    hasStarted: hasStarted
  };
})();

playable2.init();