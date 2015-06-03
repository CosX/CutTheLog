var Color = require("../lib/scripts/color.js").Color; 
var basecolors = ["#189233"]; //, "#3AA752", "#57AB1C", "#79C344", "#9CCD47"
var pixelconst = 60;

function Background(){
	this.tiles = this.generateTiles();
}

Background.prototype.generateTiles = function(){
	var tiles = [];
	var numPixHeight = Math.ceil(window.innerHeight / pixelconst);
	var numPixWidth = Math.ceil(window.innerWidth / pixelconst);
	
	var numtiles = numPixHeight * numPixWidth;
	
	for (var i = 0; i < numtiles; i++) {
		var color = Math.floor(Math.random() * basecolors.length);
		
		tiles.push({
			color: basecolors[color], 
			shadervelocity: Math.random() * (0.003 - 0.0001) + 0.0001, 
			shadervalue: 0, 
			shadermax: Math.random() * (0.60 - 0.20) + 0.20,
			movingup: true
		});
	}
	return tiles;
};

Background.prototype.animateTiles = function(ctx){
	var numPixHeight = Math.ceil(window.innerHeight / pixelconst);
	var numPixWidth = Math.ceil(window.innerWidth / pixelconst);
	
	var oindex = 0;
	var ypos = 0;
	var xpos = 0;
	for (var i = 0; i < numPixHeight; i++) {
		for (var e = 0; e < numPixWidth; e++) {
			if(this.tiles[oindex].movingup){
				this.tiles[oindex].shadervalue += this.tiles[oindex].shadervelocity;
			} else{
				this.tiles[oindex].shadervalue -= this.tiles[oindex].shadervelocity;
			}
			
			if(this.tiles[oindex].shadervalue > this.tiles[oindex].shadermax){
				this.tiles[oindex].movingup = false;
			} else if(this.tiles[oindex].shadervalue < 0){
				this.tiles[oindex].movingup = true;
			}
			
			ctx.fillStyle = Color.shadeColor(this.tiles[oindex].color, this.tiles[oindex].shadervalue);
			ctx.fillRect(xpos, ypos, pixelconst, pixelconst);
			
			oindex++;
			xpos += pixelconst;
		}
		ypos += pixelconst;
		xpos = 0;
	}
};

exports.Background = Background;