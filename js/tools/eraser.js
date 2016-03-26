/*
	eraser.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.eraser = {
	selectable: 1,
	xOffset: -5,
	yOffset: -10,
	canvas: null,
	hardness: 1,
	edge:'left',
	enText:'eraser',
	chText:'橡皮搽',
	init: function(){
		this.initSubMenu();
		Tools.eraser.canvas = document.createElement('canvas');
	},
	select: function(){
		$('#eraser_submenu').addClass("expanded_submenu").animate({'width':'60px'}, 100);
	},
	unselect: function(){
		$('#eraser_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
	},
	press: function(){
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
	//	
		
	
		this.details = {
			tool:'eraser',
			color: Yang.tool.color,
			size: Yang.tool.size,
			layer: Yang.layer,
			path: Yang.tool.path,
			canvas: Tools.eraser.canvas,
			hardness: Tools.eraser.hardness
			};
		//	this.drawPreview();
	},
	hold: function(){
		/*if(this.path.length < 5){
			Yang.ctx.clearRect(0,0,Pic.w,Pic.H)
		}*/
		this.path.push([Input.x,Input.y]);
		//Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			
			if(this.path.length > 1){
				var deets = $.extend({},this.details);
				deets.path = [this.details.path[this.details.path.length-2], this.details.path[this.details.path.length-1]];
					History.act(deets);
			}
			
		
	},
	release: function(){
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		var img = new Image();
		//gatita
		if(Yang.zoomPlace > 0){
			img.src = Tools.eraser.canvas.toDataURL();
		}else{
			//$(".button_cover").attr("data-key", "cover");
		}
		this.details.canvas = img;
		History.add(this.details)
		if(this.path.length==1){
			History.act(this.details);
		}
		//
	},
	refresh: function(){
		var ctx = $('#eraser_size_disp')[0].getContext('2d');
		ctx.clearRect(0,0,20,20);
		ctx.save();
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
		var r = Tools.eraser.size/4;
		ctx.arc(10,10,r,0,6.3,1);
		ctx.fill();
		ctx.restore();
		
		ctx = $('#eraser_hardness_disp')[0].getContext('2d');
		
		ctx.clearRect(0,0,20,20);

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(20,0);
		ctx.lineTo(20,20);
		ctx.lineTo(0,20);
		ctx.closePath();
		ctx.clip();
		
		var hardness = Tools.eraser.hardness;
		
		var radgrad = ctx.createRadialGradient(10, 10, 0, 10, 10, 10);
		
			radgrad.addColorStop(0, 'rgba(0,0,0,' + (hardness/10) + ')');
			if(hardness < 11){
				radgrad.addColorStop(1, 'rgba(0,0,0,0)');
			}else if(hardness == 11){
				radgrad.addColorStop(1, 'rgba(0,0,0,0.5)');
			}else if (hardness == 12){
				radgrad.addColorStop(1, 'rgba(0,0,0,1)');
			}

		ctx.beginPath();
		ctx.fillStyle = radgrad;
		
		ctx.arc(10,10,10,0,6.3,1);
		ctx.fill();

		ctx.restore();
		
		Tools.eraser.canvas.width = Tools.eraser.size;
		Tools.eraser.canvas.height = Tools.eraser.size;
			var ctx = Tools.eraser.canvas.getContext('2d');
			ctx.clearRect(0,0,Tools.eraser.size,Tools.eraser.size);
			
			ctx.save();
			ctx.beginPath();
			var hardness = Tools.eraser.hardness;
			var r = Tools.eraser.size/2;

			var radgrad = ctx.createRadialGradient(r, r, 0, r, r, r);
			
			
			var gradCenter = 'rgba(0,0,0,' + (hardness/10) + ')';
			var gradPerim = 'rgba(0,0,0,0)';
			if(hardness == 11){
				gradPerim = 'rgba(0,0,0,0.5)';
			}else if(hardness == 12){
				gradPerim = 'rgba(0,0,0,1)';
			}
				radgrad.addColorStop(0, gradCenter);
				radgrad.addColorStop(1, gradPerim);
		
			ctx.beginPath();
			ctx.fillStyle = radgrad;

			ctx.arc(r,r,r,0,6.3,1);
			ctx.fill();

			ctx.restore();
		
	},
	drawPreview: function(){
		var ctx = Yang.ctx;
		ctx.save();
		ctx.globalAlpha = Math.round((0.5 + this.hardness/24)*100)/100;
		ctx.clearRect(0,0,Pic.w,Pic.h);
		ctx.drawImage(this.canvas, Input.x-this.size/2,Input.y-this.size/2);
		ctx.restore();
	}
};

Tools.eraser.act = function(ctx,d){
	ctx.save();
	ctx.beginPath();
	ctx.globalCompositeOperation = "destination-out";
	ctx.lineWidth = d.size;
	ctx.fillStyle = d.color;
	ctx.lineCap = d.cap;
	ctx.lineJoin = d.join;
	var dist;
	var dx;
	var dy;
	var p = d.path;
	var fac = Math.max(1,d.size/11);
	if(p.length == 1){
		ctx.drawImage(d.canvas,p[0][0] -d.size/2,p[0][1] -d.size/2);
	}else{
		for(var j = 1; j < p.length; j++){
			dist = Util.dist(p[j],p[j-1]);
			dx = (p[j-1][0] - p[j][0])/dist;
			dy = (p[j-1][1] - p[j][1])/dist;
			ctx.globalAlpha = Util.round2(fac/dist);
			for(var i = 0; i < dist; i+=fac){
				ctx.drawImage(d.canvas,p[j-1][0] + dx*i -d.size/2,p[j-1][1] + dy*i-d.size/2);
			}
			//ctx.drawImage(d.canvas,p[j][0]-d.size/2,p[j][1]-d.size/2);
		}
	}
	ctx.restore();
}

Tools.eraser.initSubMenu = function(){
	Menus.addButtonCover(5,207,"eraser");
	var subMenu = "<canvas id='eraser_size_disp' width='22' height='20' style='position:absolute;top:0px;left:0px;background-color:white;'></canvas>";
	subMenu += "<input id='eraser_size' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:40px;height:20px;margin:0px;position:absolute;top:0px;left:20px;' value='25'/>";
	subMenu += "<canvas id='eraser_size_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:20px;left:0px;'></canvas>";
	subMenu += "<canvas id='eraser_hardness_disp' width='22' height='20' style='position:absolute;top:30px;left:0px;background-color:white;'></canvas>";
	subMenu += "<input id='eraser_hardness' class='yang_integer' type='text' min='1' max='12' step='1'  style='width:40px;height:20px;margin:0px;position:absolute;top:30px;left:20px;' value='15'/>";
	subMenu += "<canvas id='eraser_hardness_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:50px;left:0px;'></canvas>";
	$("#eraser_submenu").append(subMenu);
	
}


Tools.eraser.draw = function(ctx) {
	var radgrad = ctx.createRadialGradient(4, 4, 4, 15, 15, 20);
	radgrad.addColorStop(0, '#9F5969');
	radgrad.addColorStop(1, '#CE7991');

	ctx.lineJoin = 'round';

	ctx.fillStyle = radgrad;
	ctx.beginPath();
	ctx.moveTo(4, 12);
	ctx.lineTo(19, 15);
	ctx.lineTo(22, 21);
	ctx.lineTo(7, 18);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#D07E95';
	ctx.lineWidth = 2;
	ctx.moveTo(4, 12);
	ctx.lineTo(9, 9);
	ctx.lineTo(24, 12);
	ctx.lineTo(19, 15);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#C36F86';
	ctx.lineWidth = 2;
	ctx.moveTo(24, 12);
	ctx.lineTo(19, 15);
	ctx.lineTo(22, 21);
	ctx.lineTo(27, 18);
	ctx.closePath();
	ctx.fill();
};