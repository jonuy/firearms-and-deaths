var STATES = ['AK','AL','AR','AZ','CA','CO','CT','DE','FL','GA','HI','IA','ID',
  'IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND',
  'NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX',
  'UT','VA','VT','WA','WI','WV','WY'];

var GLOBAL_SHOW_DEBUG = false;

window.onload = function() {}

window.onscroll = function() {
  var buffer;
  var canvas1Top;
  var screenBottom;

  // Only start playable1 once it comes into view
  buffer = 150;
  screenBottom = window.scrollY + window.innerHeight;
  canvas1Top = playable1Canvas.offsetTop + buffer;

  if (!playable1.hasStarted && screenBottom > canvas1Top) {
    playable1.run();
  }

  // Only init playable2 once it comes into view
  if (!playable2.hasStarted && screenBottom > canvas2Top) {
    playable2.init();
  }
}

window.addEventListener('keyup', function(event) {
  // 68 = 'd'
  if (event.keyCode == 68) {
    GLOBAL_SHOW_DEBUG = !GLOBAL_SHOW_DEBUG;
    console.log('Show debug = ' + GLOBAL_SHOW_DEBUG);
  }

}, false);