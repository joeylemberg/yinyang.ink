Tools.line = {
	selectable: 1,
	xOffset: -5,
	yOffset: -25,
	holding: false,
	edge:'left',
	enText:'line',
	chText:'移动画布',
	lastClick: 0,
	primary_color:"line_color",
	init: function(){
		Tools.line.initSubMenu();
		$("#line_color").change(function(){
			if(Util.isHexColor($(this).val())){
				Tools.line.color = $(this).val();
				Tools.line.refresh();
			}
		//}).mouseover(function(){
		//	$("#line_color").trigger("focus");
		}).val("1D4024").trigger("change");
	},
	select: function(){
		this.holding = false;
		$('#line_submenu').addClass("expanded_submenu").animate({'width':'60px'}, 100);
	},
	unselect: function(){
		$('#line_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
	},
	refresh: function(){
		var ctx = $('#line_size_disp')[0].getContext('2d');
		ctx.clearRect(0,0,20,20);
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#" + this.color;
		ctx.lineWidth = this.size/4;
		ctx.moveTo(-2, 22);
		ctx.lineTo(22,-2);
		ctx.stroke();
		ctx.restore();
	},
	drawPreview: function(){
		var ctx = Yang.ctx;
		ctx.save();
		ctx.clearRect(0,0,Pic.w,Pic.h);
		ctx.beginPath();
		ctx.fillStyle = "#" + this.color;
		ctx.globalAlpha = 1;
//		ctx.globalCompositeOperation = "destination-over";

		var r = this.size/4;
		ctx.arc(Input.x,Input.y,r,0,6.29,1);
		ctx.fill();
		ctx.restore();
		if(this.holding){
			this.path[this.path.length-1] = [Input.x,Input.y];
			History.act(this.details,Yang.ctx);
		}
	},
	
	press: function(){
		if(!this.holding){
			this.pos = [Input.x,Input.y];
			this.path = [[Input.x,Input.y]];
			var ctx = Yang.ctx;
			ctx.beginPath();
			ctx.lineWidth = this.size;
			ctx.strokeStyle = "#" + this.color;
			ctx.lineCap = "round";this.pos = [Input.x,Input.y];
			this.path = [[Input.x,Input.y],[Input.x,Input.y]];
			var ctx = Yang.ctx;
			ctx.beginPath();
			ctx.lineWidth = this.size;
			ctx.strokeStyle = this.color;
			ctx.lineCap = "round";
			this.drawPreview();
			this.lastClick = 0;
			this.details = {
				tool:'line',
				color: Yang.tool.color,
				size: Yang.tool.size,
				layer: Yang.layer,
				path: Yang.tool.path,
				lineType: Tools.line.lineType
				};
				History.act(this.details,Yang.ctx);
		}else{
			History.act(this.details,Yang.ctx);
		}
		
	},
	hold: function(){
		//this.path.push([Input.x,Input.y]);
		this.path[this.path.length-1] = [Input.x,Input.y];
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			
		
			History.act(this.details,Yang.ctx);
	},
	release: function(){
		if(Tools.line.lineType == "single"){
			if(Util.dist(this.details.path[0],this.details.path[1]) >= 1){
				History.add(this.details)
				History.act(this.details);
			}
		}else{
			this.path.push([Input.x,Input.y]);
			History.act(this.details,Yang.ctx);
			if(Date.now() - this.lastClick < 250){
				Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
				History.add(this.details);
				History.act(this.details);
				this.holding = false;	
			}else{
				this.holding = true;
			}
			this.lastClick = Date.now();
		}
		
	},
	finish: function(){
		if(this.holding){
			History.add(this.details);
			History.act(this.details);
			this.holding = false;
		}
	}
	
	
}

Tools.line.act = function(ctx,d){
	ctx.beginPath();
	ctx.lineWidth = d.size/2;
	ctx.strokeStyle = "#" + d.color;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	var p = d.path;
	if(p.length){
		if(d.lineType != "smooth"){
			ctx.moveTo(p[0][0],p[0][1]);
			for(var i = 0; i < p.length; i++){
				ctx.lineTo(p[i][0],p[i][1]);
			}
			ctx.stroke();
		}else{
			
			var i = 0;
			ctx.moveTo(p[0][0],p[0][1]);
			while(i+1 < p.length){
				if(p.length < i+4){
					if(p.length < i+3){
						ctx.lineTo(p[i+1][0],p[i+1][1]);
						i++;
					}else{
						ctx.quadraticCurveTo(p[i+1][0],p[i+1][1],p[i+2][0],p[i+2][1]);
						i+=2;
					}
				}else{
					ctx.bezierCurveTo(p[i+1][0],p[i+1][1],p[i+2][0],p[i+2][1],(p[i+2][0]+p[i+3][0])/2,(p[i+2][1]+p[i+3][1])/2);
					i+=2;
				}
			}
			ctx.stroke();
		}
	}
}

Tools.line.initSubMenu = function(){
	Menus.addButtonCover(5,147,"line");
	var subMenu = "<input id='line_color' class='color jl_color jl_minimal_input' style='width:60px;position:absolute;top:0px;left:0px;padding-left:5px;height:20px;'/>";
	subMenu += "<input id='line_size' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:40px;height:20px;margin:0px;position:absolute;top:20px;left:20px;height:20px;'/>";
	subMenu += "<canvas id='line_size_disp' width='20' height='20' style='position:absolute;top:20px;left:0px;background-color:white;'></canvas>";
	subMenu += "<canvas id='line_size_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:40px;left:0px;'></canvas>";
	subMenu += "<canvas data-key='single' class='menu_minibutton line_cap_type' id='line_single_disp' width='20' height='20' style='position:absolute;top:50px;left:-1px;'></canvas>";
	subMenu += "<canvas data-key='multi' class='menu_minibutton line_cap_type' id='line_multi_disp' width='20' height='20' style='position:absolute;top:50px;left:19px;'></canvas>";
	subMenu += "<canvas data-key='smooth' class='menu_minibutton line_cap_type' id='line_smooth_disp' width='20' height='20' style='position:absolute;top:50px;left:39px;'></canvas>";
	$("#line_submenu").append(subMenu);
	Tools.line.types.init();
}

Tools.line.draw = function(ctx){
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	if(Yang.toolName == "line"){
		ctx.moveTo(9,21);
		ctx.lineTo(25,5);
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(9,21);
		ctx.lineTo(5,25);
		ctx.stroke();
	}else{
		ctx.moveTo(5,25);
		ctx.lineTo(25,5);
		ctx.stroke();
	}
	
	
}

Tools.line.types = {
	init: function(){
		var ctx = $("#line_single_disp")[0].getContext("2d");
		ctx.save();
		this.single(ctx, 10);
		ctx = $("#line_multi_disp")[0].getContext("2d");
		ctx.save();
		this.multi(ctx, 10);
		ctx = $("#line_smooth_disp")[0].getContext("2d");
		ctx.save();
		this.smooth(ctx, 10);
		$(".line_cap_type").click(function(){
			$(".line_cap_type").removeClass("active_minibutton");
			$(this).addClass("active_minibutton");
			Tools.line.lineType = $(this).attr("data-key");
		}).first().trigger("click");
	},
	single: function(ctx, scale, hardness){
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.moveTo(4,16);
		ctx.lineTo(16,4);
		ctx.stroke();
	},
	multi: function(ctx, scale, hardness){
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.moveTo(3,15);
		ctx.lineTo(6.5,5);
		ctx.lineTo(10,15);
		ctx.lineTo(13.5,5);
		ctx.lineTo(17,15);
		ctx.stroke();
	},
	smooth: function(ctx, scale, hardness){
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.moveTo(3,15);
		ctx.quadraticCurveTo(6.5,5,10,10);
		ctx.quadraticCurveTo(15,15,15,5);
		ctx.stroke();
		
	}
};