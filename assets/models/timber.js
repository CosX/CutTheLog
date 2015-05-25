var _baselength = 100; 
var _gravity = 9.81;
var Cd = 0.47;
var rho = 1;
var A = Math.PI * 15 * 15 / (10000);
var frameRate = 1/40;


function Timber(level){
	this.still = true;
	this.length = _baselength + ((level * 100) * 10);
	this.initiallength = this.length;
	this.timberposition = Math.abs(this.length) * -1;
	this.velocity = 1;
	this.level = level;
	this.markers = this.addmarkers();
	this.lastmarker = this.getlastmarker();
}

Timber.prototype.drawtimber = function(ctx){
	var centeredPlacement = (window.innerWidth - 10) / 2;
	ctx.fillStyle = '#CA6924';
	ctx.fillRect(centeredPlacement, this.timberposition, 200, this.length);
};

Timber.prototype.drawmarkers = function(ctx){
	for (var i = 0; i < this.markers.length; i++) {
		var centeredPlacement = (window.innerWidth - 10) / 2;
		ctx.fillStyle = '#ECF0F1';
		ctx.fillRect(centeredPlacement, this.markers[i].y, 200, 20);
	}
	
};

Timber.prototype.falling = function(){
	var force = -0.5 * Cd * A * rho * this.velocity * this.velocity * this.velocity / Math.abs(this.velocity);
	force = (isNaN(force) ? 0 : force);
	var accelleration = force / 0.1;
	if(this.velocity < 6){
		this.velocity -= accelleration*frameRate;
	}
	for (var i = 0; i < this.markers.length; i++) {
		this.markers[i].y += this.velocity*frameRate*100;
	}
	this.timberposition += this.velocity*frameRate*100;
};

Timber.prototype.drop = function(){
	this.still = false;
};

Timber.prototype.addmarkers = function(){
	var markers = [];
	for (var i = 0; i < this.level; i++) {
		var markerposition = (Math.abs(this.length) * -1) + Math.floor(Math.random() * (this.length - 10)) + 10;
		markers[i] = {y: markerposition, ishit: false}; 
	}
	return markers;
};

Timber.prototype.getlastmarker = function(){
	var currenthighest = 90;
	var highestmarker = {};
	for (var i = 0; i < this.markers.length; i++) {
		var tempheight = Math.abs(this.markers[i].y);
		if(tempheight > currenthighest){
			currenthighest = tempheight;
			highestmarker = this.markers[i];
		}
	};
	return highestmarker;
};

Timber.prototype.reducewood = function(y){
	this.length = this.initiallength - ((this.initiallength + this.timberposition) - (window.innerHeight + (y - window.innerHeight - 40)));
};
exports.Timber = Timber;