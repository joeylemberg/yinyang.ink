Tools.brush = {
	edge: 'left',
	enText: 'paint brush',
	chText:'画笔',
	selectable: 1,
	xOffset: -5,
	yOffset: -25,
	hardness: 0.5,
	canvas: null,
	name: "brush",
	used: 0,
	init: function(){
		Tools.brush.canvas = document.createElement('canvas');
		this.initSubMenu();
		$("#brush_color").change(function(){
			if(Util.isHexColor($(this).val())){
				Tools.brush.color = $(this).val();
				Tools.brush.refresh();
			}
		//}).mouseover(function(){
		//	$("#brush_color").trigger("focus");
		}).val("1900FC").trigger("change");
		//gaton
		//Tools.cat = {lily : "yang"}; 
		$(".brush_cap_type").click(function(){
			$(".brush_cap_type").removeClass("active_minibutton");
			$(this).addClass("active_minibutton");
			Tools.brush.brushType = $(this).attr("data-key");
			Tools.brush.setCanvas();
		}).first().trigger("click");
	},
	select: function(){
		$('#brush_submenu').addClass("expanded_submenu").animate({'width':'60px'}, 100);
		//Tools.brush.types.init();
	},
	unselect: function(){
		$('#brush_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
		/*$(".brush_cap_type").each(function(){
			this.getContext("2d").clearRect(-10,-10,40,40);
		});*/
	},
	setCanvas: function(){
		Tools.brush.canvas.width = this.size/2;
		Tools.brush.canvas.height = this.size/2;
		var ctx = Tools.brush.canvas.getContext("2d");
		ctx.clearRect(0,0,this.size/2,this.size/2);
		
		switch(Tools.brush.brushType){
			case "line":
			ctx.strokeStyle = "#" + this.color;
				Tools.brush.types.liner(ctx,this.size/4, Tools.brush.hardness);
				break;
			case "dab":
			ctx.fillStyle = "#" + this.color;
				Tools.brush.types.dabber(ctx,this.size/4, Tools.brush.hardness);
				break;
			case "round":
			ctx.strokeStyle = "#" + this.color;
			ctx.lineWidth = 0.1;
				Tools.brush.types.rounder(ctx,this.size/4, Tools.brush.hardness);
			break;
		}
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
	//	this.drawPreview();
		
	
		this.details = {
			tool:'brush',
			color: Yang.tool.color,
			size: Yang.tool.size,
			layer: Yang.layer,
			path: Yang.tool.path,
			canvas: Tools.brush.canvas,
			hardness: Tools.brush.hardness,
			brushType: Tools.brush.brushType
			};
			this.drawPreview();
	},
	hold: function(){
		if(this.path.length == 1){
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		}
		this.path.push([Input.x,Input.y]);
				var deets = $.extend({},this.details);
				deets.path = [this.details.path[this.details.path.length-2], this.details.path[this.details.path.length-1]];
					History.act(deets);
			
		
	},
	release: function(){
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		var img = new Image();
		img.src = Tools.brush.canvas.toDataURL();
		this.details.canvas = img;
		if(this.details.path.length == 1){
			this.details.path.push([this.details.path[0][0] + Math.random()/10,this.details.path[0][1] + Math.random()/10]);
			History.act(this.details);
		}
		History.add(this.details);
		
		this.setCanvas();
	},
	refresh: function(){
		var ctx = $('#brush_size_disp')[0].getContext('2d');
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
		ctx.fillStyle = '#' + $('#brush_color').val();
		ctx.moveTo(10, 10);
		var r = this.size/4;
		ctx.arc(10,10,r,0,6.3,1);
		ctx.fill();
		ctx.restore();
		
		ctx = $('#brush_hardness_disp')[0].getContext('2d');
		
		ctx.clearRect(0,0,20,20);

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(20,0);
		ctx.lineTo(20,20);
		ctx.lineTo(0,20);
		ctx.closePath();
		ctx.clip();
		
		var hardness = Tools.brush.hardness;
		var rgb = Util.hexToRgb(this.color);
		
		var radgrad = ctx.createRadialGradient(10, 10, 0, 10, 10, 10);
			radgrad.addColorStop(0, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + (hardness/10) + ')');
			if(hardness == 12){
				radgrad.addColorStop(1, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',1)');
			}else 	if(hardness == 11){
					radgrad.addColorStop(1, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.5)');
				}else {
				radgrad.addColorStop(1, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0)');
			}
			
		
		ctx.beginPath();
		ctx.fillStyle = radgrad;
		
		ctx.arc(10,10,10,0,6.3,1);
		ctx.fill();

		ctx.restore();
		
		this.setCanvas();
	},
	drawPreview: function(){
		var ctx = Yang.ctx;
		ctx.save();
		ctx.globalAlpha = Math.round((0.5 + this.hardness/24)*100)/100;
		ctx.clearRect(0,0,Pic.w,Pic.h);
		ctx.drawImage(this.canvas, Input.x-this.size/4,Input.y-this.size/4);
		ctx.restore();
	}
}

Tools.brush.act = function(ctx,d){
	var p = d.path;
	var dx;
	var dy;
	var x;
	var y;
	var theta;
	if(d.brushType == "line"){
		ctx.globalAlpha = d.hardness/12;
	}else{
		ctx.globalAlpha = d.hardness/100;
	}
	
		for(var i = 1; i < d.path.length; i+= Math.max(1,Tools.brush.size/100)){
			//x = p[i-1][0];
			//y = p[i-1][1];
			var dist = Util.dist(p[i-1],p[i]);
			if(p.length <= 2 && dist < 1){
				ctx.globalAlpha = d.hardness/10;
			}
			var dx = (p[i][0] - p[i-1][0])/dist;
			var dy = (p[i][1] - p[i-1][1])/dist;
			//console.log(dist);
			for (var j = 0; j <= dist; j++) {
			    ctx.drawImage(d.canvas, p[i-1][0] + dx* j -d.size/4,p[i-1][1] + dy* j -d.size/4);
			}


		}
	
	
	
	ctx.globalAlpha = 1;
}

Tools.brush.initSubMenu = function(){
	Menus.addButtonCover(5,177,"brush");
	var subMenu = "<canvas id='brush_size_disp' width='22' height='20' style='position:absolute;top:20px;left:0px;background-color:white;'></canvas>";
	subMenu += "<input id='brush_color' class='color jl_color jl_minimal_input' style='width:60px;position:absolute;top:0px;left:0px;padding-left:5px;height:20px;'/>";
	subMenu += "<input id='brush_size' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:40px;height:20px;margin:0px;padding:0px;position:absolute;top:20px;left:20px;height:20px;'/>";	
	subMenu += "<canvas id='brush_size_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:40px;left:0px;'></canvas>";
	subMenu += "<canvas id='brush_hardness_disp' width='22' height='20' style='position:absolute;top:50px;left:0px;background-color:white;'></canvas>";
	subMenu += "<input id='brush_hardness' class='yang_integer' type='text' min='1' max='12' step='1'  style='width:40px;height:20px;margin:0px;position:absolute;top:50px;left:20px;height:20px;'/>";
	subMenu += "<canvas id='brush_hardness_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:70px;left:0px;'></canvas>";
	subMenu += "<canvas data-key='line' class='menu_minibutton brush_cap_type' id='brush_line_disp' width='20' height='20' style='position:absolute;top:80px;left:-1px;'></canvas>";
	subMenu += "<canvas data-key='round' class='menu_minibutton brush_cap_type' id='brush_round_disp' width='20' height='20' style='position:absolute;top:80px;left:19px;'></canvas>";
	subMenu += "<canvas data-key='dab' class='menu_minibutton brush_cap_type' id='brush_dab_disp' width='20' height='20' style='position:absolute;top:80px;left:39px;'></canvas>";
	$("#brush_submenu").append(subMenu);
	Tools.brush.types.init();
},

Tools.brush.draw = function(ctx) {
	ctx.beginPath();
	ctx.strokeStyle = 'brown';
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';
	ctx.moveTo(20, 6);
	ctx.lineTo(13, 20);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#a5a5a5';
	ctx.moveTo(16, 14);
	ctx.lineTo(11, 23);
	ctx.lineWidth = 5;
	ctx.lineCap = 'butt';
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#474747';
	ctx.moveTo(10, 20);
	ctx.bezierCurveTo(7, 21, 8, 24, 5, 24);
	ctx.quadraticCurveTo(17, 24, 14, 22);
	ctx.closePath();
	ctx.lineWidth = 1;
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.fill();
};

Tools.brush.types = {
	init: function(){
		var ctx = $("#brush_round_disp")[0].getContext("2d");
		ctx.save();
		this.rounder(ctx, 10);
		ctx = $("#brush_dab_disp")[0].getContext("2d");
		ctx.save();
		this.dabber(ctx, 10);
		ctx = $("#brush_line_disp")[0].getContext("2d");
		ctx.save();
		this.liner(ctx, 10);
		/*$("#brush_dab_disp").click(function(){
			var ctx = $("#brush_dab_disp")[0].getContext("2d");
			ctx.clearRect(0,0,20,20);
			Tools.brush.types.dabber(ctx, 10);
		});*/
	},
	dabber: function(ctx, scale, hardness){
		if(hardness == undefined){
			hardness = 5;
		}
		
		ctx.scale(scale,scale);
		ctx.translate(1,1);
		ctx.scale(0.8,0.8);
		var r;
		var theta;
		var alpha;
		for(var i = 0; i < 50 * hardness; i++){
			theta = Math.random()*Math.PI*2;
			r = Math.random();
			ctx.globalAlpha = Util.round2(Math.random()/2 + hardness/6);
			ctx.rotate(theta);
			ctx.fillRect(0,r,0.1,0.05 + 0.02*hardness);
			ctx.fillRect(0,r,0.1,0.05 + 0.02*hardness);
			ctx.fillRect(0,r,0.1,0.05 + 0.02*hardness);
		}
		ctx.restore();
	},
	liner: function(ctx, scale, hardness){
		if(hardness == undefined){
			hardness = 5;
		}
		
		ctx.lineWidth = 0.1 + 0.04*hardness;
		ctx.scale(scale,scale);
		ctx.translate(1,1);
		ctx.scale(0.8,0.8);
		ctx.rotate(0.12);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		var r;
		var theta;
		ctx.beginPath;
		ctx.globalAlpha = 0.1 + Util.round2(hardness/14);
		ctx.moveTo(-0.7,-0.7);
		for(var i = 0; i < 5 + hardness; i++){
			ctx.lineTo((0.7 + Math.random()/4)/i,(0.7 + Math.random()/4)/i);
			ctx.lineTo(-0.7 + Math.random()/4,-0.7 + Math.random()/4);
		}
		ctx.stroke();
		ctx.restore();
	},
	rounder: function(ctx, scale, hardness){
		if(hardness == undefined){
			hardness = 5;
		}
		ctx.lineWidth = 0.02 + 0.01*hardness;
		ctx.scale(scale,scale);
		ctx.translate(1,1);
		ctx.scale(0.8,0.8);
		ctx.lineCap = "round";
		alpha = Util.round2(Math.random()/2 + hardness/6);
		var r;
		var theta;
		for(var i = 0; i < 4 * hardness; i++){
			theta = Math.random()*Math.PI*2;
			r = Math.random();
			ctx.rotate(theta);
			ctx.beginPath;
			ctx.globalAlpha = Util.round2(Math.random()/5 + hardness/30);
			for(var j = 0; j < 4; j++){
				ctx.moveTo(Math.random()/5,-r + Math.random()/5);
				ctx.lineTo(Math.random()/5,r + Math.random()/5);
			}
			ctx.stroke();
		}
		ctx.restore();
		
	}
	
	
};