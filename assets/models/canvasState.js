var Timber = require("./timber.js").Timber;
var Background = require("./background.js").Background;
var Hammer = require("../lib/scripts/hammer.min.js");
function CanvasState(canvas){
 	var self = this;
 	this.canvas = canvas;
 	this.width = canvas.width;
  	this.height = canvas.height;
  	this.ctx = canvas.getContext('2d');
	this.timber = [];
	this.background = new Background();
	this.cuts = 0;
	this.lastcutpos = 0;
	this.hitState = {active: false, age: 0, maxage: 30, didhit: false};
	
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	Hammer(canvas).on("swipeleft swiperight", function(e) {
	    self.cutTimber(e);
	});
	 
  	window.requestAnimationFrame(function(){self.draw();});
}

CanvasState.prototype.cutTimber = function(e){
	if(!this.timber.still && (this.timber.level - this.cuts) > 0){
		this.cuts++;
		this.timber.reducewood(e);
		var marker = this.findClosestMarker(e.center.y);
		this.lastcutpos = e.center;
		if(marker.difference < 80 && marker.difference > -80 && !this.timber.markers[marker.index].ishit){
			this.timber.markers[marker.index].ishit = true;
			this.resetHitState(true);
		} else{
			this.resetHitState(false);
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

CanvasState.prototype.resetHitState = function(didhit){
	this.hitState = {
		active: true, 
		age: 0, 
		maxage: 30, 
		didhit: didhit
	};
};

CanvasState.prototype.clear = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	
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
	this.background.animateTiles(this.ctx);
	this.timber.drawtimber(this.ctx);
	this.timber.animatewoodchips(this.ctx);
	this.timber.drawmarkers(this.ctx);
	this.drawscore();
	this.drawhitstate();
	window.requestAnimationFrame(function(){self.draw();});
};
CanvasState.prototype.drawhitstate = function(){
	if(this.hitState.active && this.hitState.age < this.hitState.maxage){
		this.hitState.age++;
		var text = this.hitState.didhit ? "HIT" : "MISS";
		this.ctx.font = "32px helvetica";
		this.ctx.fillStyle = this.hitState.didhit ? "#2ecc71" : "#e74c3c";
		this.ctx.fillText(text+"!", this.canvas.width/2, this.lastcutpos.y - this.hitState.age);
	}
};
CanvasState.prototype.drawscore = function(){
	this.ctx.font = "32px helvetica";
	this.ctx.fillStyle = "#fff";
	this.ctx.shadowColor = '#000';
	this.ctx.shadowBlur = 20;
	this.ctx.shadowOffsetX = 0;
	this.ctx.shadowOffsetY = 0;
	this.ctx.fillText("LEVEL: " + this.timber.level, 10, 50);
	this.ctx.fillText("CUTS LEFT: " + (this.timber.level - this.cuts), 10, 100);
};

exports.CanvasState = CanvasState;