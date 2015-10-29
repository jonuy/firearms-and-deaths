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

  return {
    init: init,
    hasStarted: hasStarted
  };
})();

playable2.init();