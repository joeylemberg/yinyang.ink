/*
	grabber.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.grabber = {
	selectable: 1,
	xOffset: -15,
	yOffset: -15,
	holding: false,
	edge:'top',
	enText:'move canvas',
	chText:'移动画布',
	init: function(){
		Menus.addButtonCover(377,5,"grabber");
	},
	select: function(){
		this.holding = false;
	},
	press: function(){
		this.holding = true;
		Main.setCursor();
		this.startGrab = [Input.mouseX,Input.mouseY];
		this.startSpot = [Yang.left, Yang.top];
	},
	hold: function(){
		if(this.holding){
			Yang.left = this.startSpot[0] + Input.mouseX - this.startGrab[0];
			Yang.top = this.startSpot[1] + Input.mouseY - this.startGrab[1];
			Yang.placePic();
		}
		
	},
	release: function(){
		this.holding = false;
		Main.setCursor();
	}
	
	
}

Tools.grabber.draw = function(ctx){
	if(!Tools.grabber.holding){
		ctx.save();
		ctx.beginPath();
		ctx.translate(0,-1);
		ctx.lineWidth = 1;
		ctx.strokeStyle ="#000000";
		ctx.fillStyle="#99b2ff";

		//index finger
		ctx.moveTo(9,17);
		ctx.lineTo(8.5,5);
		ctx.quadraticCurveTo(10.5,4,11.5,5);
		ctx.lineTo(12.5,16);
		ctx.lineTo(13,16);
		//middle finger
		ctx.lineTo(14,4);
		ctx.quadraticCurveTo(15.5,3,17,4);
		ctx.lineTo(17,16);
		//ring finger
		ctx.lineTo(19.5,6.5);
		ctx.quadraticCurveTo(21,5,22.5,6.5);
		ctx.lineTo(20,16.5);
		ctx.lineTo(21,17);
		//pinky
		ctx.lineTo(24,10);
		ctx.quadraticCurveTo(25,9,26.5,10.5);
		ctx.lineTo(23.5,20);
	
		ctx.quadraticCurveTo(19.5,24,20,27);
		ctx.quadraticCurveTo(15,28.5,9,27);
		//thumb finger
		ctx.quadraticCurveTo(8,22,4,18);
		ctx.lineTo(3,14);
		ctx.lineTo(3,12);
		ctx.quadraticCurveTo(5.5,11,8,17);
		ctx.lineTo(9,18);
		ctx.closePath();
		
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
	}else{
		ctx.save();
		ctx.beginPath();
		
		ctx.lineWidth = 1;
		ctx.strokeStyle ="#000000";
		ctx.fillStyle="#85a3fc";

		//index finger
		ctx.moveTo(9,17);
		ctx.lineTo(8.5,10);
		ctx.quadraticCurveTo(10.5,9,11.5,10);
		ctx.lineTo(12.5,16);
		ctx.lineTo(13,16);
		//middle finger
		ctx.lineTo(14,9);
		ctx.quadraticCurveTo(15.5,8,17,9);
		ctx.lineTo(17,16);
		//ring finger
		ctx.lineTo(19,10);
		ctx.quadraticCurveTo(20.5,10,22,10.5);
		ctx.lineTo(20,16.5);
		ctx.lineTo(21,17);
		//pinky
		ctx.lineTo(21,14);
		ctx.quadraticCurveTo(22,12,25,13.5);
		ctx.lineTo(22.5,20);
	
		ctx.quadraticCurveTo(19.5,24,20,27);
		ctx.quadraticCurveTo(15,28.5,9,27);
		//thumb
		ctx.quadraticCurveTo(7,23,4,18);
		ctx.quadraticCurveTo(2.5,15,8,13);
		ctx.lineTo(9,18);
		ctx.closePath();
		
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}	
};