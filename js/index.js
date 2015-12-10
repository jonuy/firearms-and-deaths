var STATES = ['AK','AL','AR','AZ','CA','CO','CT','DE','FL','GA','HI','IA','ID',
  'IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND',
  'NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX',
  'UT','VA','VT','WA','WI','WV','WY'];

var GLOBAL_SHOW_DEBUG = false;

window.onload = function() {}

window.onscroll = function() {
  var buffer;
  var canvas1Top;
  var canvas2Top;
  var canvas3Top;
  var canvas2Bottom;
  var canvas3Bottom;
  var screenTop;
  var screenBottom;

  // Only start playable1 once it comes into view
  buffer = 150;
  screenTop = window.scrollY;
  screenBottom = window.scrollY + window.innerHeight;

  canvas1Top = playable1Canvas.offsetTop + buffer;
  if (!playable1.hasStarted && screenBottom > canvas1Top) {
    playable1.run();
  }

  canvas2Top = canvas2.offsetTop + buffer;
  canvas2Bottom = canvas2.offsetTop + canvas2.height;
  // Only init playable2 once it comes into view
  if (!playable2.hasStarted() && screenBottom > canvas2Top) {
    playable2.start();
  }
  else if (playable2.hasStarted() && !playable2.isPaused() &&
           (screenTop > canvas3Bottom || screenBottom < canvas2Top)) {
    playable2.pause();
  }
  else if (playable2.isPaused() && screenBottom > canvas2Top && screenTop < canvas2Bottom) {
    playable2.resume();
  }

  canvas3Top = canvas3.offsetTop + buffer;
  canvas3Bottom = canvas3.offsetTop + canvas3.height;
  if (!playable3.hasStarted() && screenBottom > canvas3Top) {
    playable3.start();
  }
  else if (playable3.hasStarted() && !playable3.isPaused() &&
           (screenTop > canvas3Bottom || screenBottom < canvas3Top)) {
    playable3.pause();
  }
  else if (playable3.isPaused() && screenBottom > canvas3Top && screenTop < canvas3Bottom) {
    playable3.resume();
  }

}

window.addEventListener('keyup', function(event) {
  // 68 = 'd'
  if (event.keyCode == 68) {
    GLOBAL_SHOW_DEBUG = !GLOBAL_SHOW_DEBUG;
    console.log('Show debug = ' + GLOBAL_SHOW_DEBUG);
  }

}, false);