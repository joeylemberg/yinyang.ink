Tools.square = {
	selectable: 1,
	xOffset: -15,
	yOffset: -15,
	holding: false,
	edge:'left',
	enText:'square',
	chText:'移动画布',
	primary_color:"square_color",
	secondary_color:"square_fill_color",
	init: function(){
		Tools.square.initSubMenu()
		$("#square_color").change(function(){
			if(Util.isHexColor($(this).val())){
				
				Tools.square.color = $(this).val();
				Tools.square.refresh();
			}
		//}).mouseover(function(){
		//	$("#line_color").trigger("focus");
		}).val("0011FF").trigger("change");
		
		$("#square_fill_color").change(function(){
			if(Util.isHexColor($(this).val())){
				Tools.square.fillColor = $(this).val();
				Tools.square.refresh();
			}
		//}).mouseover(function(){
		//	$("#line_color").trigger("focus");
		}).val("FF0000").trigger("change");
		
	},
	select: function(){
		this.holding = false;
		$('#square_submenu').addClass("expanded_submenu").animate({'width':'60px'}, 100);
	},
	unselect: function(){
		$('#square_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
	},
	refresh: function(){
		var ctx = $('#square_size_disp')[0].getContext('2d');
		ctx.clearRect(0,0,20,20);
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#" + this.color;
		ctx.fillStyle = "#" + this.fillColor;
		ctx.lineWidth = this.size;
		ctx.rect(5,5,10,10);
		
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	},
	drawPreview: function(){
		if(this.holding){
			this.path[this.path.length-1] = [Input.x,Input.y];
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			History.act(this.details,Yang.ctx);
		}
	},
	press: function(){
		this.x = Input.x;
		this.y = Input.y;
	},
	hold: function(){
		this.w = Input.x - this.x;
		this.h = Input.y - this.y;
		if(Input.altDown || Input.shiftDown){
			var side = Math.max(Math.abs(this.w),Math.abs(this.h));
			
			this.w *= side/Math.abs(this.w);
			this.h *= side/Math.abs(this.h);
		}
		this.details = {
			tool:'square',
			color: Yang.tool.color,
			fillColor: Yang.tool.fillColor,
			size: Yang.tool.size,
			layer: Yang.layer,
			x: Tools.square.x,
			y: Tools.square.y,
			w: Tools.square.w,
			h: Tools.square.h
		}
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			History.act(this.details,Yang.ctx);
			
				Yang.ctx.beginPath();
					Yang.ctx.strokeStyle = "rgba(250,250,250,0.5)";
				Yang.ctx.lineWidth = 2/Yang.zoom;
				Yang.ctx.moveTo(this.x,this.y);
				Yang.ctx.lineTo(this.x+this.w,this.y+this.h);
				Yang.ctx.moveTo(this.x+this.w,this.y);
				Yang.ctx.lineTo(this.x,this.y+this.h);
				Yang.ctx.stroke();
				
					Yang.ctx.beginPath();
					Yang.ctx.strokeStyle = "rgba(0,0,0,0.5)";
					Yang.ctx.lineWidth = 1/Yang.zoom;
				Yang.ctx.strokeRect(this.x-1,this.y-1, 2,2);
				Yang.ctx.moveTo(this.x,this.y);
				Yang.ctx.lineTo(this.x+this.w,this.y+this.h);
				Yang.ctx.moveTo(this.x+this.w,this.y);
				Yang.ctx.lineTo(this.x,this.y+this.h);
					Yang.ctx.stroke();
			
	},
	release: function(){
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		History.add(this.details);
		History.act(this.details);
		/*	this.path.push([Input.x,Input.y]);
			History.act(this.details,Yang.ctx);
			if(Date.now() - this.lastClick < 250){
				Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
				History.add(this.details);
				History.act(this.details);
				this.holding = false;	
			}else{
				this.holding = true;
			}
			this.lastClick = Date.now();*/
		
	},
	finish: function(){
		if(this.holding){
			History.add(this.details);
			History.act(this.details);
			this.holding = false;
		}
	}
	
	
}

Tools.square.act = function(ctx,d){
	ctx.beginPath();
	ctx.lineWidth = d.size/2;
	ctx.strokeStyle = "#" + d.color;
	ctx.fillStyle = "#" + d.fillColor;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.rect(d.x,d.y,d.w,d.h);
	ctx.closePath();
	ctx.fill();
	if(d.size){
	ctx.stroke();	
	}
	
}

Tools.square.initSubMenu = function(){
	Menus.addButtonCover(5,237,"square");
	var subMenu = "<input id='square_color' class='color jl_color jl_minimal_input' style='width:60px;position:absolute;top:0px;left:0px;padding-left:5px;height:20px;'/>";
	subMenu += "<input id='square_size' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:40px;height:20px;margin:0px;position:absolute;top:20px;left:20px;height:20px;'/>";
	subMenu += "<canvas id='square_size_disp' width='20' height='20' style='position:absolute;top:20px;left:0px;background-color:white;'></canvas>";
	subMenu += "<canvas id='square_size_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:40px;left:0px;'></canvas>";
	subMenu += "<input id='square_fill_color' class='color jl_color jl_minimal_input' style='width:60px;position:absolute;top:50px;left:0px;padding-left:5px;height:20px;'/>";
	//subMenu += "<canvas data-key='single' class='menu_minibutton square_cap_type' id='square_single_disp' width='20' height='20' style='position:absolute;top:50px;left:-1px;'></canvas>";
	//subMenu += "<canvas data-key='multi' class='menu_minibutton square_cap_type' id='square_multi_disp' width='20' height='20' style='position:absolute;top:50px;left:19px;'></canvas>";
	//subMenu += "<canvas data-key='smooth' class='menu_minibutton square_cap_type' id='square_smooth_disp' width='20' height='20' style='position:absolute;top:50px;left:39px;'></canvas>";
	$("#square_submenu").append(subMenu);
}

Tools.square.draw = function(ctx){
	ctx.beginPath();
	ctx.strokeStyle = "rgba(10,10,10,0.8)";
	ctx.fillStyle = "rgba(200,0,0,0.4)";
	ctx.lineWidth = 2.5;
	ctx.fillRect(6,6,18,18);
	ctx.strokeRect(6,6,18,18);
	
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.moveTo(15,12);
	ctx.lineTo(15,18);
	ctx.moveTo(12,15);
	ctx.lineTo(18,15);
	ctx.stroke();
	
};
