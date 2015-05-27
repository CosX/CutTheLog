var _baselength = 100; 
var _gravity = 9.81;
var Cd = 0.47;
var rho = 1;
var A = Math.PI * 15 * 15 / (10000);
var frameRate = 1/40;
var trees = [
	{
		name: "Oak",
		color: "#B07B38"
	},
	{
		name: "Firewood",
		color: "#8A5817"
	},
	{
		name: "Brownwood",
		color: "#5F3500"
	}
];

function Timber(level){
	this.still = true;
	this.length = _baselength + ((level * 100) * 10);
	this.initiallength = this.length;
	this.timberposition = Math.abs(this.length) * -1;
	this.woodtype = trees[Math.floor(Math.random() * (trees.length - 1))];
	this.velocity = 1;
	this.level = level;
	this.markers = this.addmarkers();
	this.lastmarker = this.getlastmarker();
	this.woodchips = [];
}

Timber.prototype.drawtimber = function(ctx){
	var centeredPlacement = (window.innerWidth - 10) / 2;
	ctx.fillStyle = this.woodtype.color;
	ctx.fillRect(centeredPlacement, this.timberposition, 200, this.length);
};

Timber.prototype.drawmarkers = function(ctx){
	for (var i = 0; i < this.markers.length; i++) {
		if(!this.markers[i].ishit){
			var centeredPlacement = (window.innerWidth - 10) / 2;
			ctx.fillStyle = '#ECF0F1';
			ctx.fillRect(centeredPlacement, this.markers[i].y, 200, 20);
		}
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

Timber.prototype.reducewood = function(mouse){
	var centeredPlacement = (window.innerWidth - 10) / 2;
	var mouseY = mouse.center.y;
	if(mouseY < (this.length + this.timberposition)){
		var newlength = this.initiallength - ((this.initiallength + this.timberposition) - (window.innerHeight + (mouseY - window.innerHeight)));
		var chipheight = this.length - newlength;
		this.length = newlength;
		
		var chip = {
			height: chipheight,
			velocity: mouse.velocity,
			age: 0,
			maxAge: 80,
			y: mouseY,
			x: centeredPlacement,
			bits: []
		};
		
		for (var i = 0; i < Math.floor(Math.random() * 50) + 20; i++) {
			chip.bits.push({
				x: centeredPlacement, 
				y: mouseY, 
				velocity: mouse.velocity * (Math.random() * 1), 
				height: 20, 
				threshold: (Math.floor(Math.random() * 20) + 10), 
				color: shadeColor('#FFCD8A', (Math.random() * (0.40 - 0.0200) + 0.0200).toFixed(4))
			});
		}
		
		this.woodchips.push(chip);
	}
};

Timber.prototype.animatewoodchips = function(ctx){
	if(this.woodchips.length){
		for (var i = 0; i < this.woodchips.length; i++) {
			if(this.woodchips[i].age < this.woodchips[i].maxAge){
				this.woodchips[i].age++;
				this.woodchips[i].x -= this.woodchips[i].velocity * 8;
				this.woodchips[i].y += this.velocity*frameRate*100;
				ctx.fillStyle = this.woodtype.color;
				ctx.fillRect(this.woodchips[i].x, this.woodchips[i].y, 200, this.woodchips[i].height);
				this.animatechipsbits(ctx, this.woodchips[i].bits);
			}
		}
	}
};

Timber.prototype.animatechipsbits = function(ctx, bits){
	if(bits.length){
		for (var i = 0; i < bits.length; i++) {
			bits[i].x -= bits[i].velocity * 8;
			bits[i].y += (this.velocity*frameRate*100) - bits[i].threshold;
			ctx.fillStyle = bits[i].color;
			ctx.fillRect(bits[i].x, bits[i].y, bits[i].height, bits[i].height);
		}
	}
};

function shadeColor(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
exports.Timber = Timber;