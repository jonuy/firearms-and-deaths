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
  var COLOR_PERSONS_DEFAULT = '#777777';
  var COLOR_PERSONS_W_LOCK = '#2c2863';
  var COLOR_GUN_LOCK = '#07a1c5';
  var COLOR_ATTEMPT = '#ef5f48';
  var COLOR_SAVED = '#88ca41';
  var COLOR_UNSUCCESSFUL = '#faa821';
  var COLOR_FATAL = '#3a0031';
  var COLOR_CROSSHAIRS = '#cc3333';
  var COLOR_GRID = '#cccccc';
  var COLOR_BUTTON_HOVER = '#cccccc';
  var COLOR_BUTTON_OFF = '#333333';
  var COLOR_BUTTON_ON = '#777777';
  var COLOR_BUTTON_TEXT = '#ffffff';
  var COLOR_SIM_DEFAULT = '#ff0000';


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

  // Current slider variable values
  var startupInProgress = false;
  var startupDuration = 500;
  var startupTimeLeft = startupDuration;
  var startupLastTimeChecked = 0;
  var withLockStartVal = 15;
  var lockEffectStartVal = 68;
  var vWithLock = 0;
  var vLockEffect = 0;

  // Boolean. True if dragging one of the sliders.
  var isDraggingSlider1 = false;
  var isDraggingSlider2 = false;

  // Simulation system
  var simSystem;
  var simSize = 100;

  // Results from the simulation
  var vSimSaved = 0;
  var vSimUnsuccessful = 0;
  var vSimFatal = 0;

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
    startupInProgress = true;

    canvas = canvas2;
    ctx = canvas.getContext('2d');

    simSystem = new SimSystem();

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

  /******************
   * Main draw loop *
   ******************/
  function draw() {
    var time;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (GLOBAL_SHOW_DEBUG) {
      debugDrawGrid();
      debugDrawPointer();
    }

    drawStartButton();
    drawSliders();
    drawSectionBounds();

    if (simSystem && simSystem.isRunning()) {
      simSystem.run();
    }

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
    var isRunning;
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

    // If there was a click, switch the system on or off
    if (isClicked) {
      if (simSystem.isRunning()) {
        if (simSystem.isDone()) {
          simSystem.start();
        }
        else {
          simSystem.stop();
        }
      }
      else {
        simSystem.start();
      }
    }

    if (simSystem.isRunning()) {
      if (simSystem.isDone()) {
        ctx.fillStyle = COLOR_BUTTON_OFF;
        text = 'RESTART';
      }
      else {
        ctx.fillStyle = COLOR_BUTTON_ON;
        text = 'STOP';
      }
    }
    else {
      ctx.fillStyle = COLOR_BUTTON_OFF;
      text = 'START';
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

    // Draw progress label
    var progress = vSimSaved + vSimUnsuccessful + vSimFatal + ' / ' + simSize + ' persons';
    ctx.font = '12px Helvetica';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(progress, CANVAS_WIDTH / 2, boxMargin + boxHeight + 10);
  }

  /**
   * Draw variable sliders.
   */
  function drawSliders() {
    var i;
    var lineSize = 3;
    var lineWidth = 156;
    var lineEdgeHeight = 24;
    var yTop = 86;
    var leftMargin;
    var xSlider1;
    var xSlider2;
    var xSliderGap = 72;
    var sliderWidth = 12;
    var sliderHeight = 24;
    var lockSliders = simSystem.isRunning() && !simSystem.isDone();

    if (startupInProgress) {
      var startupPctProgress;

      time = (new Date()).getTime();
      if (startupLastTimeChecked > 0) {
        startupTimeLeft -= time - startupLastTimeChecked;
      }

      startupLastTimeChecked = time;

      if (startupTimeLeft <= 0) {
        startupInProgress = false;
      }

      startupPctProgress = (startupDuration - startupTimeLeft) / startupDuration;
      vWithLock = Math.floor(startupPctProgress * withLockStartVal);
      vLockEffect = Math.floor(startupPctProgress * lockEffectStartVal);
    }

    ctx.fillStyle = lockSliders ? COLOR_BUTTON_ON : '#000';
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
    ctx.fillText('Gun lock usage', xSlider1 + (lineWidth / 2), yTop + lineEdgeHeight + 12);

    // Slider 2 - % effectiveness of gun locks
    xSlider2 = leftMargin + lineWidth + xSliderGap;
    // horizontal line
    ctx.fillRect(xSlider2, yTop + 12 - 1, lineWidth, lineSize);
    // vertical lines
    ctx.fillRect(xSlider2, yTop, lineSize, lineEdgeHeight);
    ctx.fillRect(xSlider2 + lineWidth, yTop, lineSize, lineEdgeHeight);
    // text label
    ctx.fillText('Chance at preventing attempt', xSlider2 + (lineWidth / 2), yTop + lineEdgeHeight + 12);

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
    if (!lockSliders && isDraggingSlider1) {
      vWithLock = Math.round(((mouseX - xSlider1) / lineWidth) * 100);
      if (vWithLock < 0) {
        vWithLock = 0;
      }
      else if (vWithLock > 100) {
        vWithLock = 100;
      }
      s1Pos = calcSliderPos(xSlider1, vWithLock);
    }
    else if (!lockSliders && isDraggingSlider2) {
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
    ctx.fillStyle = COLOR_PERSONS_W_LOCK;
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
    var area1X = 102; // basically, leftMargin + area1Radius
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
    ctx.fillText('Decision is made', area1X, area1Y - area1Radius - 20);
    ctx.fillText('to attempt suicide', area1X, area1Y - area1Radius - 4);

    // Area 2 - Gun lock
    var area2Width = 132;
    var area2Height = 72;
    var area2X = area1X + area1Radius + marginBwSections;
    var area2Y = 208;
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
    ctx.fillText('Trying to bypass gun lock', area2X + area2Width / 2, area2Y - 20);

    ctx.fillStyle = '#a0a0a0';
    ctx.fillText('Chance at prevention:    ', area2X - 4 + area2Width / 2, area2Y - 4);

    ctx.fillStyle = COLOR_GUN_LOCK;
    ctx.textAlign = 'left';
    ctx.fillText(vLockEffect + '%', area2X + area2Width - 4, area2Y - 4);

    // Area 3 - Attempt with firearm
    var area3Width = 132;
    var area3Height = 72;
    var area3X = area2X;
    var area3Y = 332;
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
    ctx.font = '14px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Attempt at suicide', area3X + area3Width / 2, area3Y - 20);

    ctx.fillStyle = '#a0a0a0';
    ctx.fillText('Chance of fatality: 85%', area3X + area3Width / 2, area3Y - 4);

    // Area 4 - Saved
    var area4Width = 156;
    var area4Height = 70;
    var area4X = area2X + area2Width + marginBwSections;
    var area4Y = 196;
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
    ctx.font = 'bold 20px Helvetica';
    ctx.textBaseline = 'bottom';
    ctx.fillText(vSimSaved, area4X + area4Width + 52, area4Y + (area4Height / 2));

    ctx.font = '14px Helvetica';
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.fillText('Lives Saved', area4X + area4Width + 52, area4Y + (area4Height / 2));

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
    ctx.font = 'bold 20px Helvetica';
    ctx.textBaseline = 'bottom';
    ctx.fillText(vSimUnsuccessful, area5X + area5Width + 52, area5Y + (area5Height / 2));

    ctx.font = '14px Helvetica';
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.fillText('Non-Fatal', area5X + area5Width + 52, area5Y + (area5Height / 2));
    ctx.fillText('Attempts', area5X + area5Width + 52, area5Y + (area5Height / 2) + 14);

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
    ctx.font = 'bold 20px Helvetica';
    ctx.textBaseline = 'bottom';
    ctx.fillText(vSimFatal, area6X + area6Width + 52, area6Y + (area6Height / 2));

    ctx.font = '14px Helvetica';
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.fillText('Fatal', area6X + area6Width + 52, area6Y + (area6Height / 2));
    ctx.fillText('Attempts', area6X + area6Width + 52, area6Y + (area6Height / 2) + 14);
  }

  /**
   * Manages the simulated people going through the simulation.
   */
  function SimSystem() {
    // Arrays of persons in diff states
    var pending = [];
    var active = [];
    var done = [];

    // System is currently running
    this.running = false;

    // Define the spawn area
    var spawnArea = {x: 102, y: 310, r: 90};

    // Timing things
    var SPAWN_INTERVAL = 200;
    var lastTimeUpdated = 0;
    var deltaTime = 0;
    var timeUntilNextSpawn = 0;

    function start() {
      var i;

      // Reset any persons still on the canvas
      pending = [];
      active = [];
      done = [];

      for (i = 0; i < simSize; i++) {
        pending[pending.length] = new Person();
      }

      lastTimeUpdated = (new Date()).getTime();
      timeUntilNextSpawn

      this.running = true;

      debugLog('SimSystem.start at: ' + lastTimeUpdated);
    }

    function run() {
      var tmp;
      var spawnPos;
      var i;
      var time;
      var countSave = 0;
      var countUnsuccessful = 0;
      var countFatal = 0;

      time = (new Date()).getTime();
      deltaTime = time - lastTimeUpdated;
      lastTimeUpdated = time;

      // If anyone's in pending, these persons should spawn every .2 seconds
      timeUntilNextSpawn -= deltaTime;
      if (pending.length > 0 && timeUntilNextSpawn <= 0) {
        // Spawn and add to the active array
        tmp = pending.pop();
        active.push(tmp);
        timeUntilNextSpawn = SPAWN_INTERVAL;

        // Choose random spawn position
        spawnPos = _randomSpawnPosition(spawnArea.x, spawnArea.y, spawnArea.r - 10);

        tmp.spawn(spawnPos.x, spawnPos.y);
      }

      // Draw any in done
      for (i = 0; i < done.length; i++) {
        done[i].run(deltaTime);

        if (done[i].isSaved()) {
          countSave++;
        }
        else if (done[i].isUnsuccessful()) {
          countUnsuccessful++;
        }
        else if (done[i].isFatal()) {
          countFatal++;
        }
      }

      // Update sim counts
      // vSimSaved = Math.floor((countSave / simSize) * 100);
      // vSimUnsuccessful = Math.floor((countUnsuccessful / simSize) * 100);
      // vSimFatal = Math.floor((countFatal / simSize) * 100);
      vSimSaved = countSave;
      vSimUnsuccessful = countUnsuccessful;
      vSimFatal = countFatal;

      // Draw any in active
      for (i = 0; i < active.length; i++) {
        active[i].run(deltaTime);

        if (active[i].isDone()) {
          tmp = active.pop();
          done.push(tmp);
        }
      }
    }

    function stop() {
      debugLog('TODO: SimSystem.stop()');

      this.running = false;
    }

    /**
     * Utility function to choose a random spawn position
     *
     * @param x Spawn area center x
     * @param y Spawn area center y
     * @param r Spawn area radius
     *
     * @return Object {int x, int y}
     */
    function _randomSpawnPosition(x, y, r) {
      // Choose a random angle in radians
      var theta = Math.random() * Math.PI * 2;

      // Choose random position along the r
      var tmpR = Math.floor(Math.random() * r);

      var x1 = Math.floor(tmpR * Math.cos(theta));
      var y1 = Math.floor(tmpR * Math.sin(theta));

      return {
        x: x + x1,
        y: y + y1
      };
    }

    return {
      isRunning: function() {return this.running;},
      isDone: function() {
        return vSimSaved + vSimFatal + vSimUnsuccessful == simSize;
      },
      init: init,
      run: run,
      start: start,
      stop: stop
    };
  }

  /**
   * All things Person position, drawing and state related.
   */
  function Person() {
    // possible states? inactive, active, moving, start, gunlock, attempt, saved, unsuccessful, fatal, done
    var States = {
      SPAWNING: 0,
      SPAWN_TRANSITION: 1,
      MOVE_TO_GUN_LOCK: 2,
      MOVE_TO_ATTEMPT: 3,
      TRY_LOCK: 4,
      TRY_ATTEMPT: 5,
      MOVE_TO_UNSUCCESSFUL: 6,
      MOVE_TO_FATAL: 7,
      MOVE_TO_SAVED: 8,
      DONE_UNSUCCESSFUL: 9,
      DONE_FATAL: 10,
      DONE_SAVED: 11,
    };

    var size = 8;
    var spawnDuration = 250;
    var moveDuration = 500;
    var simDuration = 1500;
    var spawnTransitionDuration = 1000;
    var attemptRate = 85;

    var state;
    var timeUntilNextState;

    var position;
    var moveFromPosition;
    var moveToPosition;
    var hasGunLock;
    var simValue;

    function drawSpawn(deltaTime) {
      var currSize;
      var color = hasGunLock ? COLOR_PERSONS_W_LOCK : COLOR_PERSONS_DEFAULT;

      // Scale size based on how much time is left
      currSize = Math.floor(((spawnDuration - timeUntilNextState) / spawnDuration) * size);
      _drawPerson(position.x, position.y, currSize, color);
    }

    function drawSpawnTransition() {
      var color = hasGunLock ? COLOR_PERSONS_W_LOCK : COLOR_PERSONS_DEFAULT;

      _drawPerson(position.x, position.y, size, color);
    }

    function drawActive(colorOverride) {
      var color;

      if (typeof colorOverride === 'undefined') {
        color = hasGunLock ? COLOR_PERSONS_W_LOCK : COLOR_PERSONS_DEFAULT;
      }
      else {
        color = colorOverride;
      }

      _drawPerson(position.x, position.y, size, color);
    }

    function drawSim() {
      var arcPct;
      var colorSim;
      var color = hasGunLock ? COLOR_PERSONS_W_LOCK : COLOR_PERSONS_DEFAULT;
      var totalSimTime = simDuration * (simValue / 100);

      arcPct = ((totalSimTime - timeUntilNextState) / totalSimTime) * (simValue / 100);

      if (state == States.TRY_LOCK) {
        colorSim = COLOR_GUN_LOCK;
      }
      else if (state == States.TRY_ATTEMPT) {
        colorSim = COLOR_ATTEMPT;
      }
      else {
        colorSim = COLOR_SIM_DEFAULT;
      }

      _drawPerson(position.x, position.y, size, color, arcPct, colorSim);
    }

    function drawMove(colorOverride) {
      var pctMove = (moveDuration - timeUntilNextState) / moveDuration;
      position.x = moveFromPosition.x + ((moveToPosition.x - moveFromPosition.x) * pctMove);
      position.y = moveFromPosition.y + ((moveToPosition.y - moveFromPosition.y) * pctMove);

      drawActive(colorOverride);
    }

    function reset() {}

    function run(deltaTime) {
      timeUntilNextState -= deltaTime;

      if (state == States.SPAWNING) {
        drawSpawn(deltaTime);

        if (timeUntilNextState < 0) {
          state = States.SPAWN_TRANSITION;
          timeUntilNextState = spawnTransitionDuration;
        }
      }
      else if (state == States.SPAWN_TRANSITION) {
        drawSpawnTransition();

        if (timeUntilNextState < 0) {
          if (hasGunLock) {
            state = States.MOVE_TO_GUN_LOCK;
          }
          else {
            state = States.MOVE_TO_ATTEMPT;
          }

          timeUntilNextState = moveDuration;
          _prepMove(state);
        }
      }
      else if (state == States.MOVE_TO_GUN_LOCK) {
        drawMove();

        if (timeUntilNextState < 0) {
          state = States.TRY_LOCK;

          simValue = Math.floor(Math.random() * 100);
          if (simValue <= vLockEffect) {
            simValue = 100;
          }

          timeUntilNextState = simDuration * (simValue / 100);
        }
      }
      else if (state == States.MOVE_TO_ATTEMPT) {
        drawMove();

        if (timeUntilNextState < 0) {
          state = States.TRY_ATTEMPT;

          simValue = Math.floor(Math.random() * 100);
          if (simValue > attemptRate) {
            simValue = 100;
          }

          timeUntilNextState = simDuration * (simValue / 100);
        }
      }
      else if (state == States.TRY_LOCK) {
        drawSim();

        if (timeUntilNextState < 0) {
          // Gun lock prevented attempt
          if (simValue == 100) {
            state = States.MOVE_TO_SAVED;
          }
          // Move on to attempt
          else {
            state = States.MOVE_TO_ATTEMPT;
            hasGunLock = false;
          }

          timeUntilNextState = moveDuration;
          _prepMove(state);
        }
      }
      else if (state == States.TRY_ATTEMPT) {
        drawSim();

        if (timeUntilNextState < 0) {
          // Attempt was a success
          if (simValue != 100) {
            state = States.MOVE_TO_FATAL;
          }
          // Attempt was unsuccessful
          else {
            state = States.MOVE_TO_UNSUCCESSFUL;
          }

          timeUntilNextState = moveDuration;
          _prepMove(state);
        }
      }
      else if (state == States.MOVE_TO_SAVED) {
        drawMove(COLOR_SAVED);

        if (timeUntilNextState < 0) {
          state = States.DONE_SAVED;
        }
      }
      else if (state == States.MOVE_TO_UNSUCCESSFUL) {
        drawMove(COLOR_UNSUCCESSFUL);

        if (timeUntilNextState < 0) {
          state = States.DONE_UNSUCCESSFUL;
        }
      }
      else if (state == States.MOVE_TO_FATAL) {
        drawMove(COLOR_FATAL);

        if (timeUntilNextState < 0) {
          state = States.DONE_FATAL;
        }
      }
      else if (state == States.DONE_SAVED) {
        drawActive(COLOR_SAVED);
      }
      else if (state == States.DONE_UNSUCCESSFUL) {
        drawActive(COLOR_UNSUCCESSFUL);
      }
      else if (state == States.DONE_FATAL) {
        drawActive(COLOR_FATAL);
      }
    }

    function spawn(x, y) {
      debugLog('spawn: ' + x + ', ' + y);
      position = {x: x, y: y};
      state = States.SPAWNING;
      timeUntilNextState = spawnDuration;

      if (Math.random() > vWithLock / 100) {
        hasGunLock = false;
      }
      else {
        hasGunLock = true;
      }
    }

    function _drawPerson(x, y, currSize, color, simPct, simColor) {
      var arc;

      ctx.beginPath();
      ctx.arc(position.x, position.y, currSize, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();

      if (typeof simPct !== 'undefined') {
        arc = (2 * Math.PI * simPct) - (Math.PI / 2);
        ctx.beginPath();
        ctx.arc(position.x, position.y, currSize, -1 * (Math.PI / 2), arc, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = simColor;
        ctx.stroke();

        // eh, feels kinda hacky, but there's a lot of places where stroke is used.
        // reverting back to its default lineWidth = 1
        ctx.lineWidth = 1;
      }
    }

    function _prepMove(nextState) {
      var x;
      var y;
      var width;
      var height;
      var margin = 10;

      if (nextState == States.MOVE_TO_GUN_LOCK) {
        x = 228;
        y = 208;
        width = 128;
        height = 70;
      }
      else if (nextState == States.MOVE_TO_ATTEMPT) {
        x = 228;
        y = 332;
        width = 128;
        height = 70;
      }
      else if (nextState == States.MOVE_TO_UNSUCCESSFUL) {
        x = 396;
        y = 271;
        width = 146;
        height = 70;
      }
      else if (nextState == States.MOVE_TO_FATAL) {
        x = 396;
        y = 346;
        width = 146;
        height = 70;
      }
      else if (nextState == States.MOVE_TO_SAVED) {
        x = 396;
        y = 196;
        width = 146;
        height = 70;
      }

      moveFromPosition = {};
      moveFromPosition.x = position.x;
      moveFromPosition.y = position.y;

      moveToPosition = {};
      moveToPosition.x = x + margin + Math.floor(Math.random() * (width - margin * 2));
      moveToPosition.y = y + margin + Math.floor(Math.random() * (height - margin * 2));
    }

    function isDone() {
      return state == States.DONE_SAVED ||
          state == States.DONE_UNSUCCESSFUL ||
          state == States.DONE_FATAL;
    }

    function isSaved() {
      return state == States.DONE_SAVED;
    }

    function isUnsuccessful() {
      return state == States.DONE_UNSUCCESSFUL;
    }

    function isFatal() {
      return state == States.DONE_FATAL;
    }

    return {
      isDone: isDone,
      isSaved: isSaved,
      isUnsuccessful: isUnsuccessful,
      isFatal: isFatal,
      reset: reset,
      run: run,
      spawn: spawn
    };
  }

  return {
    init: init,
    hasStarted: hasStarted
  };
})();

// playable2.init();