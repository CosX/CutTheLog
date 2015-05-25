(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _baselength = 100; 
var _basevelocity = 30;

function Timber(level){
	this.length = _baselength + ((level * 100) * 10);
	this.velocity = _basevelocity;
	this.mark = Math.floor(Math.random() * (this.length - 10)) + 10;
}

exports.Timber = Timber;
},{}],2:[function(require,module,exports){
var Timber = require("./models/timber.js").Timber;
var canvas = document.getElementById("cutlog");
var ctx = canvas.getContext("2d");
var level = 1;
var countdown = 1;
var droplog = false;
var timber = "";

setTimeout(function(){
	if(countdown < 3){
		countdown++;
	} else{
		droplog = true;
	}
}, 1000);


window.addEventListener('resize', resizeCanvas, false);
        
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	render(); 
}

var render = function() {
	ctx.fillStyle = "brown";
	ctx.fillRect(10, 10, 100, timber.length);
	
	ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(10, timber.mark); 
    ctx.lineTo(110, timber.mark);
    ctx.lineWidth = 20;
    ctx.stroke();
    ctx.closePath();
};

var update = function(modifier){
	if(droplog){
		
	} else{
		
	}
};

var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};
var reset = function(lvl){
	droplog = false;
	countdown = 1;
	timber = new Timber(lvl);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
var then = Date.now();
resizeCanvas();
reset(level);
main();
},{"./models/timber.js":1}]},{},[2]);
