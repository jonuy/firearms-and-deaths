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
  var COLOR_BOUNDARIES = '#000000';
  var COLOR_GUN_LOCK = '#92bfb4'; // @todo may want to revisit this color
  var COLOR_ATTEMPT = '#ec9e56'; // @todo may want to revist this color
  var COLOR_SAVED = '#00ff00'; // @todo change me
  var COLOR_UNSUCCESSFUL = '#ffff00'; // @todo change me
  var COLOR_FATAL = '#ff0000'; // @todo change me
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

  // Current slider variable values
  var vWithLock = 0;
  var vLockEffect = 68;

  // Boolean. True if dragging one of the sliders.
  var isDraggingSlider1 = false;
  var isDraggingSlider2 = false;

  // Event queue
  var eventQueue = [];

  /**
   * Utility console log that only prints when debug is on.
   */
  function debugLog(msg) {
    if (GLOBAL_SHOW_DEBUG) {
      console.log(msg);
    }
  }

  /**
   * Setup initial view of the canvas
   */
  function init() {
    this.hasStarted = true;

    canvas = canvas2;
    ctx = canvas.getContext('2d');

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    debugDrawGrid();

    window.requestAnimationFrame(draw);
  }

  /**
   * click event listener
   */
  function onClick(event) {
    eventQueue.push(event);
    debugLog('click');
  }

  /**
   * mousemove event listener
   */
  function onMouseMove(event) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }

  /**
   * mousedown event listener
   */
  function onMouseDown(event) {
    eventQueue.push(event);
    debugLog('mousedown');
  }

  /**
   * mouseup event listener
   */
  function onMouseUp(event) {
    eventQueue.push(event);
    debugLog('mouseup');
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
    drawSectionBounds();

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
    var i;
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

    // Slider positions
    function calcSliderPos(xSliderPos, val) {
      return xSliderPos + (lineWidth * (val / 100) - (sliderWidth / 2));
    }

    var s1Pos = calcSliderPos(xSlider1, vWithLock);
    var s2Pos = calcSliderPos(xSlider2, vLockEffect);

    function isCursorOnSlider(sliderPos, x, y) {
      return x >= sliderPos && x <= sliderPos + sliderWidth &&
          y >= yTop && y <= yTop + sliderHeight;
    }

    // Did it click one of the sliders?
    i = eventQueue.length;
    while (i--) {
      // If we're dragging a slider, we're looking for a mouseup event
      if (isDraggingSlider1 || isDraggingSlider2) {
        if (eventQueue[i].type == 'mouseup') {
          isDraggingSlider1 = false;
          isDraggingSlider2 = false;
          eventQueue.splice(i, 1);
        }
      }
      // Otherwise we'll look for a click
      else if (eventQueue[i].type == 'mousedown') {
        // Is the click on a slider 1
        if (isCursorOnSlider(s1Pos, eventQueue[i].layerX, eventQueue[i].layerY)) {
          isDraggingSlider1 = true;
          eventQueue.splice(i, 1);
        }
        else if (isCursorOnSlider(s2Pos, eventQueue[i].layerX, eventQueue[i].layerY)) {
          isDraggingSlider2 = true;
          eventQueue.splice(i, 1);
        }
      }
    }

    // Change style of cursor if hovering over slider
    if (isDraggingSlider1 || isDraggingSlider2 ||
        isCursorOnSlider(s1Pos, mouseX, mouseY) ||
        isCursorOnSlider(s2Pos, mouseX, mouseY)) {
      canvas.style.cursor = 'ew-resize';
    }
    else {
      canvas.style.cursor = 'default';
    }

    // If we're currently dragging, update the positions of the slider
    if (isDraggingSlider1) {
      vWithLock = Math.round(((mouseX - xSlider1) / lineWidth) * 100);
      if (vWithLock < 0) {
        vWithLock = 0;
      }
      else if (vWithLock > 100) {
        vWithLock = 100;
      }
      s1Pos = calcSliderPos(xSlider1, vWithLock);
    }
    else if (isDraggingSlider2) {
      vLockEffect = Math.round(((mouseX - xSlider2) / lineWidth) * 100);
      if (vLockEffect < 0) {
        vLockEffect = 0;
      }
      else if (vLockEffect > 100) {
        vLockEffect = 100;
      }
      s2Pos = calcSliderPos(xSlider2, vLockEffect);
    }

    ctx.textBaseline = 'bottom';
    // draw Slider 1
    ctx.fillStyle = '#cccccc'; // @todo pick better color
    ctx.fillRect(s1Pos, yTop, sliderWidth, sliderHeight);
    ctx.fillText(vWithLock + '%', s1Pos + (sliderWidth / 2), yTop - 4);

    // draw Slider 2
    ctx.fillStyle = COLOR_GUN_LOCK;
    ctx.fillRect(s2Pos, yTop, sliderWidth, sliderHeight);
    ctx.fillText(vLockEffect + '%', s2Pos + (sliderWidth / 2), yTop - 4);
  }

  /**
   * Draws the bounding areas for all the sections plus updates their
   * associated labels.
   */
  function drawSectionBounds() {
    var i;
    var lineWidth = 3;
    var leftMargin = 12;
    var marginBwSections = 36;
    var area1Radius = 90;
    var area1X = leftMargin + area1Radius;
    var area1Y = 310;

    ctx.fillStyle = COLOR_BOUNDARIES;
    ctx.strokeStyle = COLOR_BOUNDARIES;

    // Area 1 - circle. Start persons deci
    ctx.beginPath();
    for (i = 0; i < lineWidth; i++) {
      ctx.ellipse(area1X, area1Y, area1Radius - 1 + i, area1Radius - 1 + i,
        0 /*rotation*/, 0 /*start angle*/, 2 * Math.PI/*end angle*/);
    }
    ctx.stroke();
    // Label
    ctx.font = '14px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Decision to attempt', area1X, area1Y - area1Radius - 20);
    ctx.fillText('suicide by firearm', area1X, area1Y - area1Radius - 4);

    // Area 2 - Gun lock
    var area2Width = 132;
    var area2Height = 72;
    var area2X = area1X + area1Radius + marginBwSections;
    var area2Y = 196;
    // Boundary box
    ctx.strokeStyle = COLOR_BOUNDARIES;
    ctx.strokeRect(area2X, area2Y, area2Width, area2Height);
    ctx.strokeRect(area2X-1, area2Y-1, area2Width+2, area2Height+2);
    ctx.strokeRect(area2X+1, area2Y+1, area2Width-2, area2Height-2);
    // Colored side
    ctx.strokeStyle = COLOR_GUN_LOCK;
    for (i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(area2X - 1 + i, area2Y - 2);
      ctx.lineTo(area2X - 1 + i, area2Y + area2Height + 2);
      ctx.stroke();
    }
    // Label
    ctx.fillStyle = '#000';
    ctx.font = '14px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Gun lock on', area2X + area2Width / 2, area2Y - 18);
    ctx.fillText('Chance at prevention: ' + vLockEffect + '%', area2X + area2Width / 2, area2Y - 4);

    // Area 3 - Attempt with firearm
    var area3Width = 132;
    var area3Height = 72;
    var area3X = area2X;
    var area3Y = 344;
    // Boundary box
    ctx.strokeStyle = COLOR_BOUNDARIES;
    ctx.strokeRect(area3X, area3Y, area3Width, area3Height);
    ctx.strokeRect(area3X-1, area3Y-1, area3Width+2, area3Height+2);
    ctx.strokeRect(area3X+1, area3Y+1, area3Width-2, area3Height-2);
    // Colored side
    ctx.strokeStyle = COLOR_ATTEMPT;
    for (i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(area3X - 1 + i, area3Y - 2);
      ctx.lineTo(area3X - 1 + i, area3Y + area3Height + 2);
      ctx.stroke();
    }
    // Label
    ctx.fillStyle = '#000';
    ctx.fillText('Suicide attempt', area3X + area3Width / 2, area3Y - 18);
    ctx.fillText('Chance of fatality: 85%', area3X + area3Width / 2, area3Y - 4);

    // Area 4 - Saved
    var area4Width = 156;
    var area4Height = 70;
    var area4X = area2X + area2Width + marginBwSections;
    var area4Y = area2Y;
    // Boundary box
    ctx.strokeStyle = COLOR_BOUNDARIES;
    ctx.strokeRect(area4X, area4Y, area4Width, area4Height);
    ctx.strokeRect(area4X-1, area4Y-1, area4Width+2, area4Height+2);
    ctx.strokeRect(area4X+1, area4Y+1, area4Width-2, area4Height-2);
    // Colored side
    ctx.strokeStyle = COLOR_SAVED;
    for (i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(area4X - 1 + i, area4Y - 2);
      ctx.lineTo(area4X - 1 + i, area4Y + area4Height + 2);
      ctx.stroke();
    }
    // Label
    ctx.fillStyle = COLOR_SAVED;
    ctx.textAlign = 'center';
    ctx.font = '14px Helvetica';
    ctx.textBaseline = 'bottom';
    ctx.fillText('XX %', area4X + area4Width + 52, area4Y + (area4Height / 2));

    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.fillText('Saved', area4X + area4Width + 52, area4Y + (area4Height / 2));

    // Area 5 - Unsuccessful
    var area5Width = 156;
    var area5Height = 70;
    var area5X = area4X;
    var area5Y = area4Y + area4Height + 5;
    // Boundary box
    ctx.strokeStyle = COLOR_BOUNDARIES;
    ctx.strokeRect(area5X, area5Y, area5Width, area5Height);
    ctx.strokeRect(area5X-1, area5Y-1, area5Width+2, area5Height+2);
    ctx.strokeRect(area5X+1, area5Y+1, area5Width-2, area5Height-2);
    // Colored side
    ctx.strokeStyle = COLOR_UNSUCCESSFUL;
    for (i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(area5X - 1 + i, area5Y - 2);
      ctx.lineTo(area5X - 1 + i, area5Y + area5Height + 2);
      ctx.stroke();
    }
    // Label
    ctx.fillStyle = COLOR_UNSUCCESSFUL;
    ctx.textAlign = 'center';
    ctx.font = '14px Helvetica';
    ctx.textBaseline = 'bottom';
    ctx.fillText('YY %', area5X + area5Width + 52, area5Y + (area5Height / 2));

    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.fillText('Unsuccessful', area5X + area5Width + 52, area5Y + (area5Height / 2));

    // Area 6 - Fatal
    var area6Width = 156;
    var area6Height = 70;
    var area6X = area4X;
    var area6Y = area5Y + area5Height + 5;
    // Boundary box
    ctx.strokeStyle = COLOR_BOUNDARIES;
    ctx.strokeRect(area6X, area6Y, area6Width, area6Height);
    ctx.strokeRect(area6X-1, area6Y-1, area6Width+2, area6Height+2);
    ctx.strokeRect(area6X+1, area6Y+1, area6Width-2, area6Height-2);
    // Colored side
    ctx.strokeStyle = COLOR_FATAL;
    for (i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(area6X - 1 + i, area6Y - 2);
      ctx.lineTo(area6X - 1 + i, area6Y + area6Height + 2);
      ctx.stroke();
    }
    // Label
    ctx.fillStyle = COLOR_FATAL;
    ctx.textAlign = 'center';
    ctx.font = '14px Helvetica';
    ctx.textBaseline = 'bottom';
    ctx.fillText('ZZ %', area6X + area6Width + 52, area6Y + (area6Height / 2));

    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.fillText('Fatal', area6X + area6Width + 52, area6Y + (area6Height / 2));
  }

  return {
    init: init,
    hasStarted: hasStarted
  };
})();

playable2.init();