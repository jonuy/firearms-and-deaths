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
  var COLOR_GRID = '#cccccc';
  var COLOR_CROSSHAIRS = '#cc3333';

  // Canvas and context
  var canvas;
  var ctx;

  // Boolean. True if this has already run init().
  var hasStarted = false
  
  // Boolean. True if we should draw debug stuff.
  var showDebug = false;

  // Current mouse pointer positions
  var mouseX;
  var mouseY;

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

    window.requestAnimationFrame(draw);
  }

  return {
    init: init,
    hasStarted: hasStarted
  };
})();

playable2.init();