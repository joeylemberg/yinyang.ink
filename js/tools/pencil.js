/*
	pencil.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.pencil = {
	enText:'pencil',
	chText:'铅笔',
	edge:'left',
	selectable: 1,
	xOffset: -5,
	yOffset: -25,
	color: null,
	size: null,
	name: "pencil",
	used: 0,
	init: function(){
		Tools.pencil.initSubMenu();
		$("#pencil_color").change(function(){
			if(Util.isHexColor($(this).val())){
				Tools.pencil.color = $(this).val();
				Tools.pencil.refresh();
			}
		//}).mouseover(function(){
		//	$("#pencil_color").trigger("focus");
		}).val("6F00FF").trigger("change");
	},
	select: function(){
		$('#pencil_submenu').addClass("expanded_submenu").animate({'width':'60px'}, 100);
	},
	refresh: function(){
		var ctx = $('#pencil_size_disp')[0].getContext('2d');
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
		ctx.fillStyle = "#" + this.color;
		ctx.moveTo(10, 10);
		var r = this.size/4;
		ctx.arc(10,10,r,0,6.3,1);
		ctx.fill();
		ctx.restore();
	},
	unselect: function(){
		$('#pencil_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
	},
	drawPreview: function(){
		var ctx = Yang.ctx;
		ctx.save();
		ctx.clearRect(0,0,Pic.w,Pic.h);
		ctx.beginPath();
		ctx.fillStyle = "#" + this.color;
		ctx.globalAlpha = 0.25;
		ctx.globalCompositeOperation = "destination-over";

		var r = this.size/2;
		ctx.arc(Input.x,Input.y,r,0,6.29,1);
		ctx.fill();
		ctx.restore();
	},
	press: function(){
		this.pos = [Input.x,Input.y];
		this.path = [[Input.x,Input.y]];
		var ctx = Yang.ctx;
		ctx.beginPath();
		ctx.lineWidth = this.size;
		ctx.strokeStyle = "#" + this.color;
		ctx.lineCap = "round";this.pos = [Input.x,Input.y];
		this.path = [[Input.x,Input.y]];
		var ctx = Yang.ctx;
		ctx.beginPath();
		ctx.lineWidth = this.size;
		ctx.strokeStyle = this.color;
		ctx.lineCap = "round";
		this.drawPreview();
		this.details = {
			tool:'pencil',
			color: Yang.tool.color,
			size: Yang.tool.size,
			layer: Yang.layer,
			path: Yang.tool.path
			};
			History.act(this.details,Yang.ctx);
	},
	hold: function(){
		this.path.push([Input.x,Input.y]);
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			
		
			History.act(this.details,Yang.ctx);
	},
	release: function(){
		History.add(this.details)
		History.act(this.details);
	}
	
}


Tools.pencil.act = function(ctx,d){
	ctx.beginPath();
	ctx.lineWidth = d.size;
	ctx.strokeStyle = "#" + d.color;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	var p = d.path;
	
	
	if(p.length){
		var m1 = 0;
		var m2 = 0;
		var m3 = 0;
		if(p.length == 1){
			ctx.beginPath();
			ctx.fillStyle = "#" + d.color;
			ctx.arc(p[0][0],p[0][1],d.size/2,0,6.29,1);
			ctx.fill();
		}else if(p.length){
			function avgPoint(p1,p2){
				var x = (p1[0] + p2[0]) / 2;
				var y = (p1[1] + p2[1]) / 2;
				return [x,y];
			}
			var mid = avgPoint(p[0],p[1]);
			ctx.beginPath();
			ctx.moveTo(p[0][0],p[0][1]);
			ctx.lineTo(mid[0],mid[1]);
			for(var i=1; i+1 < p.length; i++){
				mid = avgPoint(p[i], p[i+1]);
				ctx.quadraticCurveTo(p[i][0], p[i][1], mid[0], mid[1]);
			}
			ctx.lineTo(p[p.length-1][0], p[p.length-1][1]);
			ctx.stroke();
			/*m2 = Math.atan2(p[1][1]-p[0][1],p[1][0]-p[0][0]);
			ctx.moveTo(p[0][0],p[0][1]);
			for(var j = 1; j < p.length-1; j++){
				m1 = m2;
				m2 = Math.atan2(p[j+1][1]-p[j][1],p[j+1][0]-p[j][0]);
				if(Math.abs(m2-m1) > 0.25){
					if(j < p.length-2){
						m3 = Math.atan2(p[j+2][1]-p[j+1][1],p[j+2][0]-p[j+1][0]);
						if(Math.abs(m3-m2) > 0.4){
							ctx.bezierCurveTo(p[j][0],p[j][1],p[j+1][0],p[j+1][1],p[j+2][0],p[j+2][1]);
							j+=2;
						}else{
							ctx.quadraticCurveTo(p[j][0],p[j][1],p[j+1][0],p[j+1][1]);
							j++;
						}
					}else{
						ctx.quadraticCurveTo(p[j][0],p[j][1],p[j+1][0],p[j+1][1]);
						j++;	
					}
				}else{
					ctx.lineTo(p[j][0],p[j][1]);
				}
			}
			ctx.lineTo(p[p.length-1][0],p[p.length-1][1]);
			ctx.stroke();*/
		}
	}
		
}

Tools.pencil.initSubMenu = function(){
	
	
	
	Menus.addButtonCover(5,147,"pencil");
	var subMenu = "<input id='pencil_color' class='color jl_color jl_minimal_input' style='width:60px;position:absolute;top:0px;left:0px;padding-left:5px;height:20px;'/>";
	subMenu += "<input id='pencil_size' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:40px;height:20px;margin:0px;position:absolute;top:20px;left:20px;height:20px;'/>";
	subMenu += "<canvas id='pencil_size_disp' width='20' height='20' style='position:absolute;top:20px;left:0px;background-color:white;'></canvas>";
	subMenu += "<canvas id='pencil_size_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:40px;left:0px;'></canvas>";
	$("#pencil_submenu").append(subMenu);
},

Tools.pencil.draw = function(ctx) {

	var color = 'black';

	ctx.save();

	ctx.beginPath();
	ctx.strokeStyle = '#ff6868';
	ctx.lineWidth = 8.5;
	ctx.lineCap = 'round';
	ctx.moveTo(23, 7);
	ctx.lineTo(15, 15);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#ce9506';
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'butt';
	ctx.moveTo(18, 8);
	ctx.lineTo(8, 18);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#bc8c10';
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'butt';
	ctx.moveTo(22, 12);
	ctx.lineTo(12, 22);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#eac054';
	ctx.lineWidth = 3;
	ctx.lineCap = 'butt';
	ctx.moveTo(20, 10);
	ctx.lineTo(10, 20);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#b7b7b7';
	ctx.lineWidth = 2;
	ctx.lineCap = 'butt';
	ctx.moveTo(17, 7);
	ctx.lineTo(23, 13);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.lineCap = 'butt';
	ctx.moveTo(7, 17);
	ctx.lineTo(13, 23);
	ctx.lineTo(5, 25);
	ctx.fillStyle = "#DAB870";
	ctx.strokeStyle = '#DAB870';
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.lineCap = 'butt';
	ctx.moveTo(6, 22);
	ctx.lineTo(4, 26);
	ctx.lineTo(8, 24);
	ctx.fillStyle = color;
	ctx.closePath();
	ctx.fill();

	ctx.lineJoin = 'miter';

	ctx.restore();
};