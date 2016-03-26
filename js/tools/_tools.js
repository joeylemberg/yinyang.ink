/*
	_tools.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

var Tools = {
	init: function(){
		
	},
	yinyang: {}
}

Tools.yinyang.draw = function(ctx){
	ctx.save();
	
	ctx.beginPath();
	ctx.moveTo(60,0);
	ctx.lineTo(20,0);
	ctx.quadraticCurveTo(0,0,0,20);
	ctx.lineTo(0,60);
	ctx.quadraticCurveTo(0,80,20,80);
	ctx.lineTo(60,80);
	ctx.quadraticCurveTo(80,80,80,60);
	ctx.lineTo(80,20);
	ctx.quadraticCurveTo(80,0,60,0);
	ctx.closePath();
	ctx.clip();
	
	ctx.beginPath();
	ctx.lineJoin = 'bevel';
	ctx.lineWidth=3;
	ctx.strokeStyle='black';
	ctx.fillStyle='rgb(0, 0, 0)';
	ctx.moveTo(80,0);
	ctx.lineTo(20,0);
	ctx.quadraticCurveTo(0,0,0,20);
	ctx.lineTo(0,80);
	ctx.quadraticCurveTo(60,70,40,40);
	ctx.quadraticCurveTo(20,10,80,0);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle='#ffffff';
	ctx.moveTo(80,0);
	ctx.lineTo(80,60);
	ctx.quadraticCurveTo(80,80,60,80);
	ctx.lineTo(0,80);
	ctx.quadraticCurveTo(60,70,40,40);
	ctx.quadraticCurveTo(20,10,80,0);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle='#000000';
	ctx.arc(60,30,10,0,6.3,1);
	ctx.closePath();
	ctx.fill();


	ctx.beginPath();
	ctx.fillStyle='#ffffff';
	ctx.arc(20,50,10,0,6.3,1);
	ctx.closePath();
	ctx.fill();

ctx.beginPath();
ctx.restore();
ctx.save();

var gradient = ctx.createLinearGradient(0, 100, 80, 0);
gradient.addColorStop(0, '#7c7c7c');
gradient.addColorStop(0.1, '#dddddd');
gradient.addColorStop(0.2, '#9b9b9b');
gradient.addColorStop(0.3, '#c4c4c4');
gradient.addColorStop(0.4, '#707070');
gradient.addColorStop(0.5, '#999999');
gradient.addColorStop(0.6, '#c9c9c9');
gradient.addColorStop(0.7, '#707070');
gradient.addColorStop(0.8, '#898989');
gradient.addColorStop(0.9, '#9b9b9b');
gradient.addColorStop(1, '#c4c4c4');
ctx.beginPath();
ctx.strokeStyle = gradient;
ctx.lineWidth = 4;
ctx.moveTo(60,0);
ctx.lineTo(20,0);
ctx.quadraticCurveTo(0,0,0,20);
ctx.lineTo(0,60);
ctx.quadraticCurveTo(0,80,20,80);
ctx.lineTo(60,80);
ctx.quadraticCurveTo(80,80,80,60);
ctx.lineTo(80,20);
ctx.quadraticCurveTo(80,0,60,0);
ctx.closePath();
ctx.stroke();

ctx.restore();
ctx.save();

ctx.restore();

};