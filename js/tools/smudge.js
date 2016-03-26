/*
	smudge.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.smudge = {
	selectable: 1,
	xOffset: -10,
	yOffset: -5,
	size: 1,
	canvas: null,
	edge:'left',
	enText:'smudge',
	chText:'弄脏',
	init: function(){
		Tools.smudge.canvas = document.createElement('canvas');
		this.initSubMenu();
	},
	select: function(){
		$('#smudge_submenu').addClass('expanded_submenu').animate({'width':'60px'}, 100);
	},
	unselect: function(){
		$('#smudge_submenu').removeClass('expanded_submenu').animate({'width':'0px'}, 100);
	},
	refresh: function(){
		var ctx = $('#smudge_size_disp')[0].getContext('2d');
		ctx.clearRect(0,0,20,20);
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(20,0);
		ctx.lineTo(20,20);
		ctx.lineTo(0,20);
		ctx.closePath();
		ctx.clip();
		ctx.beginPath();
		ctx.fillStyle = '#000000';
		ctx.moveTo(10, 10);
		var r = this.size/4;
		ctx.arc(10,10,r,0,6.3,1);
		ctx.fill();
		ctx.restore();
		
	},
	drawPreview: function(){
		var ctx = Yang.ctx;
		ctx.save();
		ctx.clearRect(0,0,Pic.w,Pic.h);
		ctx.beginPath();
		ctx.fillStyle = '#000000';
		ctx.globalAlpha = 0.5;
		ctx.globalCompositeOperation = "destination-over";
		ctx.arc(Input.x,Input.y,this.size/2,0,6.29,1);
		ctx.fill();
		ctx.restore();
	},
	press: function(){
		this.sampleCanvas(Input.x,Input.y,this.size, $("#canvas_layer" + Yang.layer)[0]);
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		this.pos = [Input.x,Input.y];
		this.path = [[Input.x,Input.y]];
		var ctx = Yang.ctx;
		ctx.beginPath();
		ctx.lineWidth = this.size;
		ctx.strokeStyle = this.color;
		ctx.lineCap = "round";this.pos = [Input.x,Input.y];
		this.path = [[Input.x,Input.y]];
		var ctx = Yang.ctx;
		ctx.beginPath();
		ctx.lineWidth = this.size;
		ctx.strokeStyle = this.color;
		ctx.lineCap = "round";
		this.drawPreview();
		this.details = {
			tool:'smudge',
			size: Yang.tool.size,
			layer: Yang.layer,
			path: Yang.tool.path,
			canvas: Tools.smudge.canvas
			};
	},
	hold: function(){
	
			this.path.push([Input.x,Input.y]);
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			History.act(this.details,Yang.ctx);
	
		
	},
	release: function(){
		var img = new Image();
		img.src = Tools.smudge.canvas.toDataURL();
		img.onload = function(){
			History.act(deets, Pic.Layers[Yang.layer].ctx);
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		}
		this.details.canvas = img;
		var deets = $.extend({},this.details);
		History.add(deets);
		
	},
	/*hold: function(){
		var ctx = Pic.Layers[Yang.layer].ctx;
		ctx.save();
		ctx.globalAlpha = 0.5;
		
		ctx.drawImage(this.canvas,Input.x-this.size/2,Input.y-this.size/2);
		this.sampleCanvas(Input.x,Input.y,this.size, $("#canvas_layer" + Yang.layer)[0]);
		ctx.restore();
		//Pic.Layers[Yang.layer].ctx
	},
	release: function(){
		//Pic.Layers[Yang.layer].ctx.drawImage($("#top_canvas")[0],0,0);
		//Yang.ctx.clearRect(0,Pic.w,Pic.h);
	},*/
	sampleCanvas: function(x,y,s,target){
		Tools.smudge.canvas.width = s;
		Tools.smudge.canvas.height = s;
		var ctx = Tools.smudge.canvas.getContext('2d');
		ctx.save();
		ctx.clearRect(0,0,s,s);
		ctx.beginPath();
		ctx.arc(s/2,s/2,s/2,0,6.3,1);
		ctx.closePath();
		ctx.clip();
		ctx.translate(-x,-y);
		ctx.drawImage(target, s/2, s/2);
		ctx.restore();
	}
};

Tools.smudge.act = function(ctx,d){
	for(var i = 1; i < d.path.length && i < 10; i++){
		var dist = Util.dist(d.path[i], d.path[i-1]);
		var t = Math.max(Math.min(2*dist/d.size,10),2);
		for(var j = 0; j < t; j++){
			ctx.globalAlpha = (10-i)/15/t;
			ctx.drawImage(d.canvas,(d.path[i][0]*j + d.path[i-1][0]*(t-j))/t -d.size/2,(d.path[i][1]*j + d.path[i-1][1]*(t-j))/t -d.size/2);
		}
	}
};


Tools.smudge.initSubMenu = function(){
	Menus.addButtonCover(5,411,"smudge",undefined, "smudger");
	var subMenu = "<canvas id='smudge_size_disp' width='22' height='20' style='position:absolute;top:0px;left:0px;background-color:white;'></canvas>";
	subMenu += "<input id='smudge_size' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:40px;height:20px;margin:0px;position:absolute;top:0px;left:20px;' value='25'/>";
	subMenu += "<canvas id='smudge_size_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:20px;left:0px;'></canvas>";
	$("#smudge_submenu").append(subMenu);
};

Tools.smudge.draw = function(ctx){
	ctx.save();
	ctx.beginPath();
	ctx.translate(0,-1);
	ctx.lineWidth = 1;
	ctx.strokeStyle ="#000000";
	ctx.fillStyle="#81c97e";

	//index finger
	ctx.moveTo(9,17);
	ctx.lineTo(8.5,5);
	ctx.quadraticCurveTo(10.5,3.5,11.5,5);
	ctx.lineTo(12.5,16);
	ctx.lineTo(13,16);
	//middle finger
	ctx.lineTo(13.5,9.5);
	ctx.quadraticCurveTo(15,8,16.5,9.5);
	ctx.lineTo(17,16);
	//ring finger
	ctx.lineTo(18.5,10);
	ctx.quadraticCurveTo(20,10,21.5,10.5);
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
};