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

  // Colors
  var COLOR_GRID = '#cccccc';

  // Canvas and context
  var canvas;
  var ctx;

  function init() {
    canvas = canvas3;
    ctx = canvas.getContext('2d');

    debugDrawGrid();
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

  return {
    init: init
  }
})();

playable3.init();