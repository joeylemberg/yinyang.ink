Tools.selectbox = {
	selectable: 1,
	xOffset: -15,
	yOffset: -15,
	canvas: null,
	noPreviewClear: 1,
	edge:'left',
	enText:'select rectangle',
	chText:'切出的矩形',
	init: function(){
		Menus.addButtonCover(5,321,"selectbox", undefined, "selector");
		Tools.deleteselection = {
			draw: Tools.removelayer.draw
		}
	},
	select: function(){
		$("#clipped_range").remove();
		Clipboard.prev = 0;
	},
	finish: Clipboard.finish,
	unselect: function(){
		Clipboard.finish();
	},
	press : function(){
		if(Clipboard.handle){
			Clipboard.transforming = 1;
			Clipboard.press();
		}else{
			if(Clipboard.prev){
				var details = Clipboard.getAction();
				History.add(details);
				History.act(details);
				Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			}
			$("#clipped_range").remove();
			Clipboard.data = 0;
			Clipboard.start = {x:Input.x,y:Input.y,w:0,h:0,theta:0,path:[]};
			Clipboard.prev = 0;
			this.clickTime = Date.now();
		}
	},
	hold: function(){
		if(Clipboard.transforming){
			Clipboard.hold();
		}else{
			Clipboard.start.w = Input.x - Clipboard.start.x;
			Clipboard.start.h = Input.y - Clipboard.start.y;
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			Clipboard.drawStartRange();
		}
	},
	release: function(){
		if(Date.now() - this.clickTime < 100 && Math.abs(Clipboard.start.w/Yang.zoom) < 5 && Math.abs(Clipboard.start.h/Yang.zoom) < 5){
			$("#clipped_range").remove();
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		}else if(Clipboard.transforming){
			Clipboard.transforming = 0;
			Clipboard.release();
		}else{
			if(Clipboard.start.w < 0){
				Clipboard.start.x += Clipboard.start.w;	
				Clipboard.start.w *= -1;
			}
			if(Clipboard.start.h < 0){
				Clipboard.start.y += Clipboard.start.h;	
				Clipboard.start.h *= -1;
			}
			if(Clipboard.start.w < 1){
				Clipboard.start.w = 1;
			}
			if(Clipboard.start.h < 1){
				Clipboard.start.h = 1;
			}
			
			Clipboard.range = {
				x : Clipboard.start.x,
				y : Clipboard.start.y,
				w : Clipboard.start.w,
				h : Clipboard.start.h,
				path : [],
				theta : 0,
				flipX : 0,
				flipY : 0
			};
			
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			Clipboard.makeRange();
		}
	},
	deletePress: function(){
		var details = {
			tool: "deleteselection",
			layer: Yang.layer,
			x: Clipboard.range.x,
			y: Clipboard.range.y,
			w: Clipboard.range.w,
			h: Clipboard.range.h
		}
		History.add(details);
		History.act(details);
		Clipboard.drop();
	}
}




Tools.selectfree = {
	edge:'left',
	enText:'outline selection',
	chText:'选择轮廓',
	selectable: 1,
	xOffset: -3,
	yOffset: -25,
	canvas: null,
	noPreviewClear: 1,
	init: function(){
		Menus.addButtonCover(5,351,"selectfree");
	},
	finish: Clipboard.finish,
	select: function(){
		$("#clipped_range").remove();
		Clipboard.prev = 0;
	},
	unselect: function(){
		$("#clipped_range").remove();
		if(Clipboard.prev){
			var details = Clipboard.getAction();
			History.add(details);
			History.act(details);
		}
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
	},
	press : function(){
		if(Clipboard.handle){
			Clipboard.transforming = 1;
			Clipboard.press();
		}else{
			if(Clipboard.prev){
				var details = Clipboard.getAction();
				History.add(details);
				History.act(details);
			}
			Clipboard.data = 0;
			$("#clipped_range").remove();
			Clipboard.start = {x:Input.x,y:Input.y,w:0,h:0,theta:0,path:[[Input.x, Input.y]]};
			Clipboard.prev = 0;
			this.clickTime = Date.now();
		}
	},
	hold: function(){
		if(Clipboard.transforming){
			Clipboard.hold();
		}else{
			Clipboard.start.path.push([Input.x,Input.y]);
			Clipboard.start.w = Input.x - Clipboard.start.x;
			Clipboard.start.h = Input.y - Clipboard.start.y;
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			Clipboard.drawStartRange();
		}
	},
	release: function(){
		if(Date.now() - this.clickTime < 100 && Math.abs(Clipboard.start.w/Yang.zoom) < 5 && Math.abs(Clipboard.start.h/Yang.zoom) < 5){
			$("#clipped_range").remove();
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		}else if(Clipboard.transforming){
			Clipboard.transforming = 0;
			Clipboard.release();
		}else{
			Clipboard.start.x = Clipboard.start.path[0][0];
			Clipboard.start.y = Clipboard.start.path[0][1];
			for(var i = 1; i < Clipboard.start.path.length; i++){
				Clipboard.start.x = Math.min(Clipboard.start.x,Clipboard.start.path[i][0]);
				Clipboard.start.y = Math.min(Clipboard.start.y,Clipboard.start.path[i][1]);
			}
			for(var i = 1; i < Clipboard.start.path.length; i++){
				Clipboard.start.w = Math.max(Clipboard.start.w,Math.abs(Clipboard.start.path[i][0]-Clipboard.start.x));
				Clipboard.start.h = Math.max(Clipboard.start.h,Math.abs(Clipboard.start.path[i][1]-Clipboard.start.y));
			}
			if(Clipboard.start.w < 0){
				Clipboard.start.x += Clipboard.start.w;	
				Clipboard.start.w *= -1;
			}
			if(Clipboard.start.h < 0){
				Clipboard.start.y += Clipboard.start.h;	
				Clipboard.start.h *= -1;
			}
			if(Clipboard.start.w < 1){
				Clipboard.start.w = 1;
			}
			if(Clipboard.start.h < 1){
				Clipboard.start.h = 1;
			}
			Clipboard.range = {
				x : Clipboard.start.x,
				y : Clipboard.start.y,
				w : Clipboard.start.w,
				h : Clipboard.start.h,
				path : [],
				theta : 0,
				flipX : 0,
				flipY : 0
			};
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			Clipboard.makeRange();
		}
	},
	deletePress : function(ctx){
		var details = {
			tool: "deleteselection",
			layer: Yang.layer,
			x: Clipboard.start.x,
			y: Clipboard.start.y,
			w: Clipboard.start.w,
			h: Clipboard.start.h,
			path: $.extend([],Clipboard.start.path)
		}
		History.add(details);
		History.act(details);
		Clipboard.drop();
	}
	
}


/*Tools.selectbox = {
	selectable: 1,
	xOffset: -15,
	yOffset: -15,
	canvas: null,
	range: {x:0,y:0,w:0,h:0,layer:Yang.layer,path:[],canvas:null},
	state: "idle",
	details: {},
	type: "box",
	noPreviewClear: 1,
	init: function(){
		Menus.addButtonCover(5,321,"selectbox");
		Menus.addButtonCover(5,351,"selectfree");
	},
	select: function(){
		this.state = "idle";
		Clipboard.hideRangeControls();
		this.type = "box";
	},
	unselect: function(){
		Clipboard.hideRangeControls();
		$("#cursor_canvas").show();
		$("#cursor_canvas").show();
		History.actPending();
	},
	press : function(){
		if(this.state == "idle"){
			History.actPending();
			Clipboard.hideRangeControls();
			this.range.x = Input.x;
			this.range.y = Input.y;
			this.range.w = 0;
			this.range.h = 0;
			this.range.layer = Yang.layer;
			this.range.pathDiff = [0,0];
			if(this.type == "box"){
				this.range.path = [];
			}else{
				this.range.path = [[Input.x,Input.y]];
			}
		}
	},
	hold : function(){
		
		if(this.state == "idle"){
			
			this.range.w = Input.x - this.range.x;
			this.range.h = Input.y - this.range.y;
			this.range.canvas = null;
			
			if(this.type == "free"){
				this.range.path.push([Input.x,Input.y]);
			}
			
			this.boxUpRange();
		}else{
			Clipboard.hold();
		}
		
	},
	release : function(keepdata){
		
		if(this.state == "idle"){
			if(this.range.w != 0 && this.range.h != 0){
				if(this.range.w < 0){
					this.range.x += this.range.w;
					this.range.w  *= -1;
				}
				if(this.range.h < 0){
					this.range.y += this.range.h;
					this.range.h  *= -1;
				}
				
					this.range.canvas = document.createElement("canvas");
					this.range.canvas.width = this.range.w;
					this.range.canvas.height = this.range.h;
					this.range.popped = 0;
					var ctx = this.range.canvas.getContext("2d");
					ctx.save();
					ctx.translate(-this.range.x,-this.range.y);
					if(this.range.path.length){
						ctx.beginPath();
						ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
						for(var i = 1; i < this.range.path.length; i++){
							ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
						}
						ctx.closePath();
						ctx.clip();
					}
					
					ctx.drawImage($("#canvas_layer" + Yang.layer)[0],0,0);
					ctx.restore();
					Clipboard.range = $.extend({},Tools.selectbox.range);
					//Clipboard.pendingAnchor = [this.range.x,this.range.y];
				
				Clipboard.setRange(this.range);	
			}
		}else{
			Clipboard.release();
		}
	},
	boxUpRange : function(range){
		//if(range != undefined){
		//	this.range = range;
		//}
		var ctx = Yang.ctx;
		ctx.clearRect(0,0,Pic.w,Pic.h);
		if(this.type == "free"){
			for(var i = 1; i < this.range.path.length; i++){
				this.range.x = Math.min(this.range.x,this.range.path[i][0]);
				this.range.y = Math.min(this.range.y,this.range.path[i][1]);
			}
			for(var i = 1; i < this.range.path.length; i++){
				this.range.w = Math.max(this.range.w,Math.abs(this.range.path[i][0]-this.range.x));
				this.range.h = Math.max(this.range.h,Math.abs(this.range.path[i][1]-this.range.y));
			}
			ctx.beginPath();
			ctx.strokeStyle = "rgba(255,255,255,0.3)";
			ctx.lineWidth = 3;
			ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
			for(var i = 1; i < this.range.path.length; i++){
				ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
			}
			ctx.stroke();
			ctx.beginPath();
			ctx.strokeStyle = "rgba(0,0,0,0.6)";
			ctx.lineWidth = 1;
			ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
			for(var i = 1; i < this.range.path.length; i++){
				ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
			}
			//ctx.moveTo(this.path[this.path.length-2][0],this.path[this.path.length-1][1]);

			ctx.stroke();
		}
		
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.3)";
		ctx.lineWidth = 3;
		ctx.strokeRect(this.range.x,this.range.y,this.range.w,this.range.h);
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,0.6)";
		ctx.lineWidth = 1;
		ctx.strokeRect(this.range.x,this.range.y,this.range.w,this.range.h);
		
		
		
		
		
	}
};
Tools.selectfree = {
	selectable: 1,
	xOffset: -3,
	yOffset: -25,
	range: {x:0,y:0,w:0,h:0,layer:Yang.layer,path:[],canvas:null},
	init: function(){
		//Menus.addButtonCover(5,351,"selectfree");
	},
	select: function(){
		Tools.selectbox.type = 'free';
		this.state = "idle";
		Clipboard.hideRangeControls();
	
	},
	unselect: function(){
		
	},
	drawPreview: function(){
		
	},
	press: function(){
		Yang.tool = Tools.selectbox;
		Tools.selectbox.press();
		this.range.x = Input.x;
		this.range.y = Input.y;
		this.range.path = [[Input.x,Input.y]];
	},
	hold: function(){
		this.range.path.push([Input.x,Input.y]);
		var ctx = Yang.ctx;
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.3)";
		ctx.lineWidth = 3;
		ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
		for(var i = 1; i < this.range.path.length; i++){
			ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,0.6)";
		ctx.lineWidth = 1;
		ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
		for(var i = 1; i < this.range.path.length; i++){
			ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
		}
		//ctx.moveTo(this.path[this.path.length-2][0],this.path[this.path.length-1][1]);
		
		ctx.stroke();
	//	ctx.beginPath();
		
	//	ctx.moveTo(this.path[this.path.length-2][0],this.path[this.path.length-1][1]);
	//	ctx.lineTo(this.path[this.path.length-2][0],this.path[this.path.length-1][1]);
	//	ctx.stroke();
	},
	release: function(){
		
		
			var ctx = Yang.ctx;
			ctx.beginPath();
			ctx.strokeStyle = "rgba(255,255,255,0.3)";
			ctx.lineWidth = 3;
			ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
			for(var i = 1; i < this.range.path.length; i++){
				ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
			}
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.strokeStyle = "rgba(0,0,0,0.6)";
			ctx.lineWidth = 1;
			ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
			for(var i = 1; i < this.range.path.length; i++){
				ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
			}
			ctx.closePath();
			ctx.stroke();

			this.range.canvas = document.createElement("canvas");
			for(var i = 1; i < this.range.path.length; i++){
				this.range.x = Math.min(this.range.x,this.range.path[i][0]);
				this.range.y = Math.min(this.range.y,this.range.path[i][1]);
				this.range.w = Math.max(this.range.w,this.range.path[i][0]);
				this.range.h = Math.max(this.range.h,this.range.path[i][1]);
			}
			this.range.w = this.range.w - this.range.x;
			this.range.h = this.range.h - this.range.y;
			this.range.canvas.width = this.range.w;
			this.range.canvas.height = this.range.h;

			var ctx = this.range.canvas.getContext("2d");
			ctx.save();


			ctx.translate(-this.range.x,-this.range.y);
			ctx.beginPath();
			ctx.moveTo(this.range.path[0][0],this.range.path[0][1]);
			for(var i = 1; i < this.range.path.length; i++){
				ctx.lineTo(this.range.path[i][0],this.range.path[i][1]);
			}
			ctx.closePath();
			ctx.clip();

			//
			ctx.drawImage($("#canvas_layer" + Yang.layer)[0],0,0);
			ctx.restore();
			console.log(this.range.canvas.toDataURL());
			Tools.selectbox.boxUpRange(this.range);
			console.log(this.range);
			Tools.selectbox.range = this.range;
			Clipboard.range = $.extend({},this.range);
			Clipboard.placeRangeControls();
			
		
		
	//	History.add(this.details)
	//	History.act(this.details);
	}
};
*/

Tools.selectbox.draw = function(ctx){
	ctx.beginPath();
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 4;
	ctx.moveTo(15,7);
	ctx.lineTo(15,23);
	ctx.moveTo(7,15);
	ctx.lineTo(23,15);
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	ctx.moveTo(15,8);
	ctx.lineTo(15,22);
	ctx.moveTo(8,15);
	ctx.lineTo(22,15);
	ctx.stroke();
	ctx.beginPath();
	
};

Tools.selectfree.draw = function(ctx){
	ctx.save();
	
	//Blade
	ctx.beginPath();
	ctx.lineJoin = 'miter';
	ctx.lineWidth = 1;
	ctx.strokeStyle="#000000";
	ctx.moveTo(9,19);
	ctx.lineTo(6,21);
	ctx.lineTo(3,24);
	ctx.lineTo(11,21);
	ctx.stroke();
	ctx.fillStyle="#c4c4c4";
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(4.3,23.5);
	ctx.lineTo(11,21);
	ctx.stroke();
	
	
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 3;
	ctx.moveTo(24,6);
	ctx.lineTo(11,19);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.strokeStyle = "#c4c4c4";
	ctx.lineWidth = 2;
	ctx.moveTo(24,6);
	ctx.lineTo(11,19);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth = 4.5;
	ctx.strokeStyle="#222222";
	ctx.moveTo(13,17);
	ctx.lineTo(11,19);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth = 3.5;
	ctx.strokeStyle="#9e9e9e";
	ctx.moveTo(13,17);
	ctx.lineTo(11,19);
	ctx.stroke();

	ctx.restore();
	
};

Tools.mover = {};
Tools.mover.draw = function(ctx){
	ctx.beginPath();
	ctx.lineJoin = 'round';
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'black';
	ctx.lineWidth = 3;

	ctx.moveTo(6,15);
	ctx.lineTo(24,15);
	ctx.moveTo(15,6);
	ctx.lineTo(15,24);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.moveTo(4,15);
	ctx.lineTo(7,18);
	ctx.lineTo(7,12);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(26,15);
	ctx.lineTo(23,18);
	ctx.lineTo(23,12);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(15,26);
	ctx.lineTo(18,23);
	ctx.lineTo(12,23);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(15,4);
	ctx.lineTo(18,7);
	ctx.lineTo(12,7);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();	
}

Tools.resizer = {}
Tools.resizer.draw = function(ctx){
	ctx.beginPath();
	ctx.lineJoin = 'round';
	ctx.strokeStyle = 'black';

	var radgrad = ctx.createRadialGradient(4, 19, 3, 15, 15, 15);
	radgrad.addColorStop(0, '#cccccc');
	radgrad.addColorStop(1, '#999999');

	ctx.fillStyle = radgrad;
	ctx.lineWidth = 2;

	ctx.moveTo(15, 12);
	ctx.lineTo(10, 7);
	ctx.lineTo(12, 5);
	ctx.lineTo(5, 5);
	ctx.lineTo(5, 12);
	ctx.lineTo(7, 10);

	ctx.lineTo(12, 15);
	ctx.lineTo(7, 20);
	ctx.lineTo(5, 18);
	ctx.lineTo(5, 25);
	ctx.lineTo(12, 25);
	ctx.lineTo(10, 23);

	ctx.lineTo(15, 18);
	ctx.lineTo(20, 23);
	ctx.lineTo(18, 25);
	ctx.lineTo(25, 25);
	ctx.lineTo(25, 18);
	ctx.lineTo(23, 20);

	ctx.lineTo(18, 15);
	ctx.lineTo(23, 10);
	ctx.lineTo(25, 12);
	ctx.lineTo(25, 5);
	ctx.lineTo(18, 5);
	ctx.lineTo(20, 7);

	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.lineJoin = 'miter';
};
Tools.rotater = {};
Tools.rotater.draw = function(ctx){
	ctx.save();
	ctx.translate(30,0);
	ctx.scale(-1,1);
	ctx.beginPath();
	ctx.lineCap = 'butt';
	ctx.strokeStyle = 'black';

	var radgrad = ctx.createRadialGradient(4, 19, 3, 15, 15, 15);
	radgrad.addColorStop(0, 'rgba(0, 0, 225, .1)');
	radgrad.addColorStop(1, 'rgba(0, 0, 225, .9)');

	ctx.fillStyle = radgrad;
	ctx.lineWidth = 2;
	ctx.arc(16, 17, 5, Math.PI * 5 / 4, 3 * Math.PI / 4, 0);
	ctx.arc(16, 17, 10, 3 * Math.PI / 4, 5 * Math.PI / 4, 1);
	ctx.lineTo(6, 6);
	ctx.lineTo(6, 17);
	ctx.lineTo(15, 17);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

Tools.dummymover = {
	draw: Tools.mover.draw
}

Tools.selectfree.preDraw = function(ctx){
		ctx.translate(-1,-1.5);
		ctx.scale(1.2,1.2);
}
Tools.selectbox.preDraw = function(ctx){
		ctx.translate(-1,-1.5);
		ctx.scale(1.2,1.2);
}

	Tools.resizer = {}
	Tools.resizer.draw = function(ctx){
		ctx.beginPath();
		ctx.lineJoin = 'round';
		ctx.strokeStyle = 'black';

		var radgrad = ctx.createRadialGradient(4, 19, 3, 15, 15, 15);
		radgrad.addColorStop(0, '#1ea500');
		radgrad.addColorStop(1, '#3bff00');

		ctx.fillStyle = radgrad;
		ctx.lineWidth = 2;

		ctx.moveTo(15, 12);
		ctx.lineTo(10, 7);
		ctx.lineTo(12, 5);
		ctx.lineTo(5, 5);
		ctx.lineTo(5, 12);
		ctx.lineTo(7, 10);

		ctx.lineTo(12, 15);
		ctx.lineTo(7, 20);
		ctx.lineTo(5, 18);
		ctx.lineTo(5, 25);
		ctx.lineTo(12, 25);
		ctx.lineTo(10, 23);

		ctx.lineTo(15, 18);
		ctx.lineTo(20, 23);
		ctx.lineTo(18, 25);
		ctx.lineTo(25, 25);
		ctx.lineTo(25, 18);
		ctx.lineTo(23, 20);

		ctx.lineTo(18, 15);
		ctx.lineTo(23, 10);
		ctx.lineTo(25, 12);
		ctx.lineTo(25, 5);
		ctx.lineTo(18, 5);
		ctx.lineTo(20, 7);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.lineJoin = 'miter';
	};