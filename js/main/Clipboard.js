// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

var Clipboard = {
	start: {},
	end: {},
	prev: 0,
	range: 0,
	data: 0,
	copyData: [],
	copyDataIndex: -1,
	handle: 0,
	trueHandle: 0,
	transforming: 0,
	anchor: [0,0],
	init: function(){
		Tools.deleter = {
			no_cover:1,
			draw: Tools.removelayer.draw,
			lastTime: window.location.origin,
			click: function(){
				if(Yang.tool.deletePress != undefined){
					Yang.tool.deletePress();
				}
			}
		}			
		Tools.totaldelete = {
			draw: Tools.deleter.draw
		};
	},
	getAction: function(){
		var details = {
			tool : Yang.toolName,
			start: $.extend({}, Clipboard.start),
			range: $.extend({}, Clipboard.range),
			data: document.createElement("canvas"),
			layer: Yang.layer
		}
		details.data.width = this.start.w;
		details.data.height = this.start.h;
		var ctx = details.data.getContext("2d");
		ctx.drawImage(this.data,0,0,details.data.width,details.data.height);
		return details;
	},
	finish: function(){
		$("#clipped_range").remove();
		if(Clipboard.prev){
			var details = Clipboard.getAction();
			History.add(details);
			History.act(details);
		}
		Clipboard.drop();
	},
	pasteIn: function(d){
		Clipboard.drop();
		$("#selector").trigger("click");
		//Clipboard.prev = $()
	},
	press: function(){
		if(!Clipboard.prev){
			this.range.flipX = 0;
			this.range.flipY = 0;
			this.prev = $.extend({},this.range);
			this.data = document.createElement("canvas");
			this.data.width = this.range.w;
			this.data.height = this.range.h;
			var ctx = this.data.getContext("2d");
			ctx.save();
			ctx.translate(-this.range.x,-this.range.y);
			if(this.start.path.length){
				ctx.beginPath();
				ctx.moveTo(this.start.path[0][0],this.start.path[0][1]);
				for(var i = 1; i < this.start.path.length; i++){
					ctx.lineTo(this.start.path[i][0],this.start.path[i][1]);
				}
				ctx.closePath();
				ctx.clip();
			}
			ctx.drawImage($("#canvas_layer" + Yang.layer)[0],0,0);
			ctx.restore();
			
			ctx = Pic.Layers[Yang.layer].ctx;
			ctx.save();
			if(this.start.path.length){
				ctx.beginPath();
				ctx.moveTo(this.start.path[0][0],this.start.path[0][1]);
				for(var i = 1; i < this.start.path.length; i++){
					ctx.lineTo(this.start.path[i][0],this.start.path[i][1]);
				}
				ctx.closePath();
				ctx.clip();
			}
			ctx.clearRect(this.start.x,this.start.y,this.start.w,this.start.h);
			ctx.restore();
			var details = {
				tool:Yang.toolName,
				layer: Yang.layer,
				isDummy: 1
			}
			History.add(details);
		}
		this.anchor = [Input.x, Input.y];
		this.anchorTheta = Math.atan2(this.prev.y+this.prev.h/2 - Input.y,this.prev.x+this.prev.w/2-Input.x) - this.prev.theta;
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		this.dashRange();
		this.drawData(Yang.ctx);
	},
	hold:function(){
		switch(this.handle){
			case "mover_div":
				this.range.x = Input.x - this.anchor[0] + this.prev.x;
				this.range.y = Input.y - this.anchor[1] + this.prev.y;
				this.transformRange();
			break;
			case "top_rotater":
			case "bottom_rotater":
			case "left_rotater":
			case "right_rotater":
			case "top_left_rotater":
			case "bottom_left_rotater":
			case "top_right_rotater":
			case "bottom_right_rotater":
				this.range.theta = Math.atan2(this.prev.y+this.prev.h/2 - Input.y,this.prev.x+this.prev.w/2-Input.x) -this.anchorTheta;
				this.transformRange();
			break;
			case "right_resizer":
				this.range.w = Math.max(1,Input.x - this.anchor[0] + this.prev.w);
				this.transformRange();
			break;
			case "left_resizer":
				this.range.x = Math.min(this.prev.w+this.prev.x-1, Input.x - this.anchor[0] + this.prev.x);
				this.range.w = Math.max(1, this.prev.w + this.prev.x - this.range.x);
				this.transformRange();
			break;
			case "bottom_resizer":
				this.range.h = Math.max(1,Input.y - this.anchor[1] + this.prev.h);
				this.transformRange();
			break;
			case "top_resizer":
				this.range.y = Math.min(this.prev.h+this.prev.y-1, Input.y - this.anchor[1] + this.prev.y);
				this.range.h = Math.max(1, this.prev.h + this.prev.y - this.range.y);
				this.transformRange();
			break;
			case "top_right_resizer":
				this.range.y = Math.min(this.prev.h+this.prev.y-1, Input.y - this.anchor[1] + this.prev.y);
				this.range.h = Math.max(1, this.prev.h + this.prev.y - this.range.y);
				this.range.w = Math.max(1,Input.x - this.anchor[0] + this.prev.w);
				this.transformRange();
			break;
			case "bottom_right_resizer":
				this.range.w = Math.max(1,Input.x - this.anchor[0] + this.prev.w);
				this.range.h = Math.max(1,Input.y - this.anchor[1] + this.prev.h);
				this.transformRange();
			break;
			case "bottom_left_resizer":
				this.range.h = Math.max(1,Input.y - this.anchor[1] + this.prev.h);
				this.transformRange();
				this.range.x = Math.min(this.prev.w+this.prev.x-1, Input.x - this.anchor[0] + this.prev.x);
				this.range.w = Math.max(1, this.prev.w + this.prev.x - this.range.x);
				this.transformRange();
			break;
			case "top_left_resizer":
				this.range.x = Math.min(this.prev.w+this.prev.x-1, Input.x - this.anchor[0] + this.prev.x);
				this.range.w = Math.max(1, this.prev.w + this.prev.x - this.range.x);
				this.range.y = Math.min(this.prev.h+this.prev.y-1, Input.y - this.anchor[1] + this.prev.y);
				this.range.h = Math.max(1, this.prev.h + this.prev.y - this.range.y);
				this.transformRange();
			break;
		}
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		this.dashRange();
		this.drawData(Yang.ctx);
	},
	release: function(){
		this.transforming = 0;
		this.prev = $.extend({},this.range);
		this.handle = this.trueHandle;
	},
	transformRange: function(){
	
		var r = this.range;
		$("#clipped_range").css({
			"transform-origin": (r.x+r.w/2)*Yang.zoom + "px " + (r.y+r.h/2)*Yang.zoom + "px",
			"transform-origin": (r.x+r.w/2)*Yang.zoom + "px " + (r.y+r.h/2)*Yang.zoom + "px",
			"left" :"0px",
			"top" : "0px",
			"width" : r.w*Yang.zoom + "px",
			"height" : r.h*Yang.zoom + "px",
			"transform": "rotate(" + 180*r.theta/Math.PI + "deg) translateY(" + r.y*Yang.zoom + "px) translateX(" + r.x*Yang.zoom + "px)",
			"-webkit-transform": "rotate(" + 180*r.theta/Math.PI + "deg) translateY(" + r.y*Yang.zoom + "px) translateX(" + r.x*Yang.zoom + "px)"
		});
		
		
	},
	drawStartRange: function(){
		//draw a dashed border around this.range
		var r = this.start;
		var ctx = Yang.ctx;
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = Math.max(3,3/Yang.zoom);
		ctx.lineCap = "butt";
		ctx.strokeStyle = "white";
		if(is_firefox){
			ctx.mozDash = [Math.max(2,2/Yang.zoom),Math.max(3,3/Yang.zoom)];
		}else{
			ctx.setLineDash([Math.max(2,2/Yang.zoom),Math.max(3,3/Yang.zoom)]);
		}

		if(r.path && r.path.length){
			ctx.moveTo(r.path[0][0],r.path[0][1]);
			for(var i = 0; i < r.path.length; i++){
				ctx.lineTo(r.path[i][0],r.path[i][1])
			}
			ctx.stroke();
			ctx.beginPath();
			ctx.strokeStyle = "black";
			ctx.lineWidth = Math.max(1.5,1.5/Yang.zoom);
			ctx.moveTo(r.path[0][0],r.path[0][1]);
			for(var i = 0; i < r.path.length; i++){
				ctx.lineTo(r.path[i][0],r.path[i][1])
			}
			ctx.stroke();
		}else{
			ctx.translate(r.x,r.y);
			ctx.rotate(r.theta);
			ctx.strokeRect(0,0,r.w,r.h);
			ctx.beginPath();
			ctx.strokeStyle = "black";
			ctx.lineWidth = Math.max(1.5,1.5/Yang.zoom);
			ctx.strokeRect(0,0,r.w,r.h);
		}
		ctx.restore();
	},
	makeRange: function(){
		
		var r = this.range;
		
		var str = "<div id='clipped_range' style='";
		str += "z-index:999;position:absolute;"; 
		str += "width:" + r.w*Yang.zoom + "px;";
		str += "height:" + r.h*Yang.zoom + "px;";
		str += "left:" + r.x*Yang.zoom + "px;";
		str += "top:" + r.y*Yang.zoom + "px;'>";
		str += '<div class="resize_handle" id="top_left_resizer"></div>';
		str += '<div class="resize_handle" id="top_right_resizer"></div>';
		str += '<div class="resize_handle" id="top_resizer"></div>';
		str += '<div class="resize_handle" id="left_resizer"></div>';
		str += '<div class="resize_handle" id="right_resizer"></div>';
		str += '<div class="resize_handle" id="bottom_left_resizer"></div>';
		str += '<div class="resize_handle" id="bottom_right_resizer"></div>';
		str += '<div class="resize_handle" id="bottom_resizer"></div>';
		str += '<canvas class="rotate_handle" id="top_rotater" width="20" height="20"></canvas>';
		str += '<canvas class="rotate_handle" id="right_rotater" width="20" height="20"></canvas>';
		str += '<canvas class="rotate_handle" id="left_rotater" width="20" height="20"></canvas>';
		str += '<canvas class="rotate_handle" id="bottom_rotater" width="20" height="20"></canvas>';
		str += '<canvas class="rotate_handle" id="top_left_rotater" width="20" height="20"></canvas>';
		str += '<canvas class="rotate_handle" id="top_right_rotater" width="20" height="20"></canvas>';
		str += '<canvas class="rotate_handle" id="bottom_left_rotater" width="20" height="20"></canvas>';
		str += '<canvas class="rotate_handle" id="bottom_right_rotater" width="20" height="20"></canvas>';
		str += '<div id="mover_div"></div>';
		str += "</div>";
		$("#picture").append(str);
		
		$(".rotate_handle").each(function(){
			var ctx = this.getContext("2d");
			ctx.beginPath();
			ctx.strokeStyle="#000000";
			ctx.fillStyle="#ffffff";
			ctx.lineWidth=2;
			ctx.arc(10,10,5,0,6.3,1);
			ctx.stroke();
			ctx.fill();
		});
		
		$("#clipped_range").hover(function(){
			$("#cursor_canvas").hide();
		},function(){
			$("#cursor_canvas").show();
		});
		
		$(".resize_handle, .rotate_handle, #mover_div").hover(function(){
			if(!Clipboard.transforming){
				$("#cursor_canvas").hide();
				Clipboard.handle = $(this).attr("id");
			}
			Clipboard.trueHandle = $(this).attr("id");
		},function(){
			if(!Clipboard.transforming){
				if(Clipboard.handle == $(this).attr("id")){
					Clipboard.handle = 0;
				}
				$("#cursor_canvas").show();
			}
			Clipboard.trueHandle = 0;
			
		});
		
		this.dashRange();
	},
	drop: function(){
		$("#clipped_range").remove();
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		Clipboard.prev = 0;
		$("#cursor_canvas").show();
		Clipboard.handle = 0;
	},
	drawData: function(ctx){
		var r = this.range;
		var ctx = Yang.ctx;
			ctx.save();
			ctx.translate(r.x+r.w/2,r.y+r.h/2);
			if(r.flipX != undefined && r.flipX){
				ctx.scale(-1,1);
			}
			if(r.flipY != undefined && r.flipY){
				ctx.scale(1,-1);
			}
			if(r.flipX + r.flipY == 1){
				ctx.rotate(-r.theta);
			}else{
				ctx.rotate(r.theta);
			}
			try{
			ctx.drawImage(this.data,-r.w/2,-r.h/2,r.w,r.h);
			}catch(e){
				console.log(e);
			}
			ctx.restore();
	},
	dashRange: function(){
		//draw the dashed lines, resizer handles and rotation handles.
		var r = this.range;
		var ctx = Yang.ctx;
		
		//dashed box
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = Math.max(3,3/Yang.zoom);
		ctx.lineCap = "butt";
		ctx.strokeStyle = "white";
		if(is_firefox){
			ctx.mozDash = [Math.max(2,2/Yang.zoom),Math.max(3,3/Yang.zoom)];
		}else{
			ctx.setLineDash([Math.max(2,2/Yang.zoom),Math.max(3,3/Yang.zoom)]);
		}
		ctx.translate(r.x+r.w/2,r.y+r.h/2);
		ctx.rotate(r.theta);
		ctx.strokeRect(-r.w/2,-r.h/2,r.w,r.h);
		var x = r.w/this.start.w;
		var y = r.h/this.start.h;
		if(this.start.path != undefined && this.start.path.length){
			ctx.beginPath();
			ctx.moveTo(x*(this.start.path[0][0] - this.start.x - this.start.w/2),y*(this.start.path[0][1] - this.start.y- this.start.h/2));
			for(var i = 1; i < this.start.path.length; i++){
				ctx.lineTo(x*(this.start.path[i][0]- this.start.x - this.start.w/2),y*(this.start.path[i][1]- this.start.y - this.start.h/2));
			}
			ctx.closePath();
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = Math.max(1.5,1.5/Yang.zoom);
		ctx.strokeRect(-r.w/2,-r.h/2,r.w,r.h);
		//dashed lines for rotate handles
		ctx.beginPath();
		ctx.moveTo(-r.w/2,-r.h/2);
		ctx.lineTo(-r.w/2-25/Yang.zoom,-r.h/2-25/Yang.zoom);
		ctx.moveTo(r.w/2,r.h/2);
		ctx.lineTo(r.w/2+25/Yang.zoom,r.h/2+25/Yang.zoom);
		ctx.moveTo(r.w/2,-r.h/2);
		ctx.lineTo(r.w/2+25/Yang.zoom,-r.h/2-25/Yang.zoom);
		ctx.moveTo(-r.w/2,r.h/2);
		ctx.lineTo(-r.w/2-25/Yang.zoom,r.h/2+25/Yang.zoom);
		
		ctx.moveTo(0,-r.h/2);
		ctx.lineTo(0,-r.h/2-35/Yang.zoom);
		ctx.moveTo(0,r.h/2);
		ctx.lineTo(0,r.h/2+35/Yang.zoom);
		ctx.moveTo(-r.w/2,0);
		ctx.lineTo(-r.w/2-35/Yang.zoom,0);
		ctx.moveTo(r.w/2,0);
		ctx.lineTo(r.w/2+35/Yang.zoom,0);
		
		ctx.stroke();
		
		if(this.start.path != undefined && this.start.path.length){
			ctx.beginPath();
			ctx.moveTo(x*(this.start.path[0][0] - this.start.x - this.start.w/2),y*(this.start.path[0][1] - this.start.y- this.start.h/2));
			for(var i = 1; i < this.start.path.length; i++){
				ctx.lineTo(x*(this.start.path[i][0]- this.start.x - this.start.w/2),y*(this.start.path[i][1]- this.start.y - this.start.h/2));
			}
			ctx.closePath();
			ctx.stroke();
		}
		
		ctx.restore();
		
		
	},
	drawHandles: function(){
		//draw the dashed lines, resizer handles and rotation handles.
		var r = this.range;
		var ctx = Yang.ctx;
		
		//dashed box
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = Math.max(3,3/Yang.zoom);
		ctx.lineCap = "butt";
		ctx.strokeStyle = "white";
		if(is_firefox){
			ctx.mozDash = [Math.max(2,2/Yang.zoom),Math.max(3,3/Yang.zoom)];
		}else{
			ctx.setLineDash([Math.max(2,2/Yang.zoom),Math.max(3,3/Yang.zoom)]);
		}
		ctx.translate(r.x,r.y);
		ctx.rotate(r.theta);
		ctx.strokeRect(-r.w/2,-r.h/2,r.w,r.h);
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = Math.max(1.5,1.5/Yang.zoom);
		ctx.strokeRect(-r.w/2,-r.h/2,r.w,r.h);
		//dashed lines for rotate handles
		ctx.beginPath();
		ctx.moveTo(-r.w/2,-r.h/2);
		ctx.lineTo(-r.w/2-25/Yang.zoom,-r.h/2-25/Yang.zoom);
		ctx.moveTo(r.w/2,r.h/2);
		ctx.lineTo(r.w/2+25/Yang.zoom,r.h/2+25/Yang.zoom);
		ctx.moveTo(r.w/2,-r.h/2);
		ctx.lineTo(r.w/2+25/Yang.zoom,-r.h/2-25/Yang.zoom);
		ctx.moveTo(-r.w/2,r.h/2);
		ctx.lineTo(-r.w/2-25/Yang.zoom,r.h/2+25/Yang.zoom);
		ctx.stroke();
		ctx.restore();
		
		//resize handles
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = Math.max(3,3/Yang.zoom);
		ctx.strokeStyle = "rgba(0,0,0,0.7)";
		ctx.fillStyle = "white";
		ctx.translate(r.x,r.y);
		ctx.rotate(r.theta);
		var boxSize = 10/Yang.zoom;
		ctx.translate(-boxSize/2,-boxSize/2);
		ctx.rect(-r.w/2,-r.h/2,boxSize,boxSize);
		ctx.rect(r.w/2,r.h/2,boxSize,boxSize);
		ctx.rect(-r.w/2,r.h/2,boxSize,boxSize);
		ctx.rect(r.w/2,-r.h/2,boxSize,boxSize);
		ctx.rect(-r.w/2,0,boxSize,boxSize);
		ctx.rect(r.w/2,0,boxSize,boxSize);
		ctx.rect(0,r.h/2,boxSize,boxSize);
		ctx.rect(0,-r.h/2,boxSize,boxSize);
		ctx.stroke();
		ctx.fill();
		//rotate handles
		ctx.beginPath();
		ctx.arc(-r.w/2-25/Yang.zoom+boxSize/2,r.h/2+25/Yang.zoom+boxSize/2, boxSize/2, 0, 2*Math.PI);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	},
	act: function(ctx, d){
		ctx.save();
		if(d.start.path && d.start.path.length){
			ctx.beginPath();
			ctx.moveTo(d.start.path[0][0],d.start.path[0][1]);
			for(var i = 0; i < d.start.path.length; i++){
				ctx.lineTo(d.start.path[i][0],d.start.path[i][1])
			}
			ctx.closePath();
			ctx.clip();
		}
		if(d.start.realTool == undefined || Clipboard.start.realTool != "upload"){
			if(d.start.nodelete == undefined){
				ctx.clearRect(d.start.x,d.start.y,d.start.w,d.start.h);
			}
		}
		
		ctx.restore();
		ctx.translate(d.range.x+d.range.w/2,d.range.y+d.range.h/2);
		if(d.range.flipX){
			ctx.scale(-1,1);
		}
		if(d.range.flipY){
			ctx.scale(1,-1);
		}
		if(d.range.flipX + d.range.flipY == 1){
			ctx.rotate(-d.range.theta);
		}else{
			ctx.rotate(d.range.theta);
		}
		
		ctx.drawImage(d.data,-d.range.w/2,-d.range.h/2,d.range.w,d.range.h);
	}
};