//watchify assets/main.js -o bundle2.js -v
var Timber = require("./models/timber.js").Timber;
var CanvasState =  require("./models/canvasState.js").CanvasState;
var canvasel = document.getElementById("cutlog");
var level = 1;
var countdown = 1;

var s = new CanvasState(canvasel);
s.addTimber(new Timber(level));

document.getElementsByClassName("btn-start")[0].addEventListener("click", function(){
	s.timber.drop();
});