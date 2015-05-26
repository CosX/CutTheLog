var Timber = require("./timber.js").Timber;
var Hammer = require("../lib/scripts/hammer.min.js");
function CanvasState(canvas){
 	var self = this;
 	this.canvas = canvas;
 	this.width = canvas.width;
  	this.height = canvas.height;
  	this.ctx = canvas.getContext('2d');
	this.timber = [];
	this.cuts = 0;
	
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	Hammer(canvas).on("swipeleft swiperight", function(e) {
	    self.cutTimber(e);
	});
	 
 	this.interval = 30;
  	//setInterval(function() { self.draw(); }, self.interval);
  	window.requestAnimationFrame(function(){self.draw();});
}

CanvasState.prototype.cutTimber = function(e){
	if(!this.timber.still && (this.timber.level - this.cuts) > 0){
		console.log("SWOOSH!");
		this.cuts++;
		this.timber.reducewood(e);
		var marker = this.findClosestMarker(e.center.y);
		if(marker.difference < 80 && marker.difference > -80){
			this.timber.markers[marker.index].ishit = true;
			console.log("HIT!");
		}
	}
};

CanvasState.prototype.findClosestMarker = function(mouseY){
	var currentdifference = 90;
	var currentmarker = 0;
	for (var i = 0; i < this.timber.markers.length; i++) {
		var tempdifference = Math.abs(this.timber.markers[i].y - mouseY);
		if(tempdifference < currentdifference){
			currentdifference = tempdifference;
			currentmarker = i;
		}
	};
	return {difference: currentdifference, index: currentmarker};
};

CanvasState.prototype.addTimber = function(timber) {
  this.timber = timber;
};

CanvasState.prototype.calculateGame = function(){
	this.timber.still = true;
	var didwin = true;
	for (var i = 0; i < this.timber.markers.length; i++) {
		if(!this.timber.markers[i].ishit){
			didwin = false;
			break;
		}
	};
	this.reset(didwin);
};

CanvasState.prototype.reset = function(isnext){
	this.cuts = 0;
	if(isnext){
		var nextlvl = this.timber.level + 1;
		this.addTimber(new Timber(nextlvl));
	} else {
		this.addTimber(new Timber(1));
	}
}; 

CanvasState.prototype.clear = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight - 40;
	
	this.ctx.save();
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.ctx.restore();
};

CanvasState.prototype.draw = function() {
	var self = this;
	this.clear();
	if(!this.timber.still && (this.timber.timberposition < this.canvas.height)) {
		this.timber.falling();
	}
	
	if(this.timber.timberposition > this.canvas.height){
		this.calculateGame();
	}
	this.timber.animatewoodchips(this.ctx);
	this.timber.drawtimber(this.ctx);
	this.timber.drawmarkers(this.ctx);
	this.drawscore();
	window.requestAnimationFrame(function(){self.draw();});
};

CanvasState.prototype.drawscore = function(){
	this.ctx.font = "32px helvetica";
	this.ctx.fillStyle = "#264348";
	this.ctx.fillText("LEVEL: " + this.timber.level, 10, 50);
	this.ctx.fillText("CUTS LEFT: " + (this.timber.level - this.cuts), 10, 100);
};

exports.CanvasState = CanvasState;