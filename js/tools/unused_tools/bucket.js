Tools.bucket = {
	selectable: 1,
	xOffset: -24,
	yOffset: -24,
	holding: false,
	edge:'left',
	enText:'fill region',
	chText:'移动画布',
	color:"0011FF",
	primary_color:"bucket_color",
	r:1,
	w:0,
	h:0,
	init: function(){
		this.initSubMenu();
		this.canvas = document.createElement('canvas');
		this.canvas.width = Pic.w;
		this.canvas.height = Pic.h;
		this.ctx = this.canvas.getContext("2d");
	},
	initSubMenu: function(){
		Menus.addButtonCover(5,267,"bucket");
		var subMenu = "<input id='bucket_color' class='color jl_color jl_minimal_input' style='width:60px;position:absolute;top:0px;left:0px;padding-left:5px;height:20px;'/>";
		$("#bucket_submenu").append(subMenu);
	},
	select: function(){
		this.holding = false;
		$('#bucket_submenu').addClass("expanded_submenu").animate({'width':'60px'}, 100);
		this.r = 1;
		while(Math.ceil(Pic.w/this.r) * Math.ceil(Pic.h/this.r) > 50000){
			this.r++;
		}
		if(this.r > 1){
			var w = Math.ceil(Pic.w/this.r);
			var h = Math.ceil(Pic.h/this.r);
			var canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			var ctx = canvas.getContext("2d");
			ctx.drawImage($("#canvas_layer" + Yang.layer)[0],0,0,w,h);
			$(canvas).ready(function(){
				Tools.bucket.allData = ctx.getImageData(0,0,w,h).data;
				console.log(canvas.toDataURL());
			});
			
			this.w = w;
			this.h = h;	
		}else{
			this.w = Pic.w;
			this.h = Pic.h;
			this.allData = Pic.Layers[Yang.layer].ctx.getImageData(0,0,Pic.w,Pic.h).data;
		}
		
		
		
	},
	unselect: function(){
		$('#bucket_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
	},
	press: function(){
		var x = Input.x;
		var y = Input.y;
		this.x = Input.x;
		this.y = Input.y;
		
		this.anchor = [x,y];
		
		var clickData = Pic.Layers[Yang.layer].ctx.getImageData(this.x,this.y,1,1).data;
		this.pointData = clickData;
	//	Yang.ctx.fillRect(this.x,this.y,10,10);
		
		var r = 1;
		
		while(Math.ceil(Pic.w/r) * Math.ceil(Pic.h/r) > 10000){
			r++;
		}
	//	alert(r);
		console.log(r + " " + Math.ceil(Pic.w/r) * Math.ceil(Pic.h/r));
		var rrr = r;
		this.dataMap = [];
		var pxData;
		
		var allPx = [];
	/*	var pxRow = [];
			for(var i = 0; i < Pic.h; i+=r){
				var rowData = [];
				for(var j = 0; j < Pic.w; j+=r){
					rowData.push(0);
				}
			allPx.push(rowData);
			}*/
	//	console.log(allPx);
	
	
//	console.log(this.allData);
	
	this.deltas = [];
	for(var r = 0; r < this.h; r++){
		var rowDeltas = [];
		for(var c = 0; c < this.w; c++){
				s = 4*(r*this.w + c);
				if(10 > Math.abs(this.allData[s] - this.pointData[0]) + Math.abs(this.allData[s+1] - this.pointData[1]) + Math.abs(this.allData[s+2] - this.pointData[2])/* + Math.abs(this.allData[s+3] - this.pointData[3])/4*/){
					rowDeltas.push(1);
				}else{
					rowDeltas.push(0);
				}
			//	rowDeltas.push(Math.abs(this.allData[s] - this.pointData[0]) + Math.abs(this.allData[s+1] - this.pointData[1]) + Math.abs(this.allData[s+2] - this.pointData[2]) + Math.abs(this.allData[s+3] - this.pointData[3])/4);

		}
		this.deltas.push(rowDeltas);
	}
	
	/*
	console.log("RRR" + r);
		for(var i = 0; i < Pic.h; i+=r){
			var rowData = [];
			for(var j = 0; j < Pic.w; j+=r){
				pxData = Pic.Layers[Yang.layer].ctx.getImageData(j,i,1,1).data;
				if(clickData[0] == pxData[0] && clickData[1] == pxData[1] && clickData[2] == pxData[2] && clickData[3] == pxData[3]){
					rowData.push(1);
				}else{
					rowData.push(0);
				}
				
				
			}
			this.dataMap.push(rowData);
		}*/
	
			var region = Util.exploreMap(this.deltas, Math.floor(Input.x*this.w/Pic.w), Math.floor(Input.y*this.h/Pic.h));//x, y);
	console.log(region);
	console.log("PENIS SUCKER");
	
	/*	this.pxSet = [];
		this.ctx.beginPath();
		this.ctx.fillStyle = "rgba(0,0,0,0.5)";
		this.ctx.clearRect(0,0,Pic.w,Pic.h);
		
	
		
	this.canvas.height = this.h;
	this.canvas.width = this.w;*/
	//this.ctx.save();
	//this.ctx.scale(Pic.w/this.w,Pic.h/this.h);
	
	var bcanvas = document.createElement('canvas');
	bcanvas.width = this.w;
	bcanvas.height = this.h;
	var bcxt = bcanvas.getContext("2d");
	bcxt.fillStyle = "#" + $("#primary_color").val();
	
		for(var i = 0; i < this.h; i++){
			for(var j = 0; j < this.w; j++){
				
			//	if(this.deltas[i][j]){
					if(region[i][j]){
				//	this.pxSet.push(i);
				//	this.pxSet.push(j);
			
				bcxt.fillRect(j,i,1,1);
				}
			}
		}
	//	console.log(this.canvas.toDataURL());
//	this.ctx.restore();
//	Yang.ctx.drawImage(this.canvas,0,0,Pic.w,Pic.h);
	
	var details = {
		tool: "bucket",
		color: Yang.tool.color,
		layer: Yang.layer,
		canvas: bcanvas,
		w: Yang.tool.w,
		h: Yang.tool.h
	}
	
	History.act(details);
	
	Tools.bucket.select();
	/*	for(var i = 0; i < this.dataMap.length; i++){
			for(var j = 0; j < this.dataMap[0].length; j++){
				if(this.dataMap[i][j]){
					Pic.Layers[0].ctx.fillRect(i*q, j*q, q, q);	
				}
			}
		}*/
	//	console.log(allPx);
		
		//
		
		
		
	/*	for(var r = 1; r < Math.max(allPx.length,allPx[0].length); r++){
			for(var i = 0; i <= r*2; i++){
				x = this.anchor[0] - r + i;
				y = this.anchor[1] - r;
				if(y < allPx.length && y >= 0 && x < allPx[0].length && x >= 0){
					if(allPx[x][y+1] || (x-1 >= 0 && allPx[x-1][y+1]) || (x+1 < allPx[0].length && allPx[x+1][y+1])){
						if(this.dataMap){
							allPx[x][y] = 1;
						}
					}
				}
				
				y = this.anchor[1] + r;
				if(y < allPx.length && y >= 0 && x < allPx[0].length && x >= 0){
					if(allPx[x][y-1] || (x-1 >= 0 && allPx[x-1][y-1]) || (x+1 < allPx[0].length && allPx[x+1][y-1])){
						if(this.dataMap){
							allPx[x][y] = 1;
						}
					}
				}
				x = this.anchor[0] - r;
				y = this.anchor[1] - r + i;
				if(y < allPx.length && y >= 0 && x < allPx[0].length && x >= 0){
					if(allPx[x+1][y] || y+1 < allPx.length && allPx[x+1][y+1] || y-1 >= 0 && allPx[x+1][y-1]){
						if(this.dataMap){
							allPx[x][y] = 1;
						}
					}
				}
				x = this.anchor[0] + r;
				if(y < allPx.length && y >= 0 && x < allPx[0].length && x >= 0){
					if(allPx[x-1][y] || y+1 < allPx.length && allPx[x-1][y+1] || y-1 >= 0 && allPx[x-1][y-1]){
						if(this.dataMap){
							allPx[x][y] = 1;
						}
					}
				}
			}
		}
		
		Yang.ctx.fillStyle = "rgba(0,0,250,0.7)";
		for(var i = 0; i < allPx.length; i++){
			for(var j = 0; j < allPx[0].length; j++){
				if(allPx[i][j]){
					Yang.ctx.fillRect(i*q, j*q, q, q);	
				}
			}
		}*/
		
	/*	for(var r = 0; r < dataMap.length; r++){
			for(var i = 0; i <= dataMap[0].length; i++){
				x = this.anchor[0] - r + i;
				y = this.anchor[1] - r;
				if(y < Pic.h && y >= 0 && x < Pic.w && x >= 0){
					if(allPx[x][y+1] || (x-1 >= 0 && allPx[x-1][y+1]) || (x+1 < Pic.w && allPx[x+1][y+1])){
						if(this.deltas[y][x] < this.threshold){
							allPx[x][y] = 1;
						}
					}
				}
				
				y = this.anchor[1] + r;
				if(y < Pic.h && y >= 0 && x < Pic.w && x >= 0){
					if(allPx[x][y-1] || (x-1 >= 0 && allPx[x-1][y-1]) || (x+1 < Pic.w && allPx[x+1][y-1])){
						if(this.deltas[y][x] < this.threshold){
							allPx[x][y] = 1;
						}
					}
				}
				x = this.anchor[0] - r;
				y = this.anchor[1] - r + i;
				if(y < Pic.h && y >= 0 && x < Pic.w && x >= 0){
					if(allPx[x+1][y] || y+1 < Pic.h && allPx[x+1][y+1] || y-1 >= 0 && allPx[x+1][y-1]){
						if(this.deltas[y][x] < this.threshold){
							allPx[x][y] = 1;
						}
					}
				}
				x = this.anchor[0] + r;
				if(y < Pic.h && y >= 0 && x < Pic.w && x >= 0){
					if(allPx[x-1][y] || y+1 < Pic.h && allPx[x-1][y+1] || y-1 >= 0 && allPx[x-1][y-1]){
						if(this.deltas[y][x] < this.threshold){
							allPx[x][y] = 1;
						}
					}
				}
			}
		}
		*/
		
		
	},
	hold: function(){
		this.x = Input.x;
		this.y = Input.y;
	//	Yang.ctx.fillRect(this.x,this.y,10,10);
	},
	release: function(){
		
	}
}


Tools.bucket.act = function(ctx,d){
	ctx.drawImage(d.canvas, 0,0, Pic.w,Pic.h);
}

Tools.bucket.draw = function(ctx){
	
	ctx.save();
	ctx.translate(-1,0);
	
	ctx.beginPath();
	ctx.strokeStyle = "#686868";
	ctx.fillStyle = "#333333";
	ctx.lineWidth = 2;
	ctx.moveTo(15,5);
	ctx.lineTo(5,15);
	ctx.quadraticCurveTo(8,22,15,25);
	ctx.lineTo(25,15);
	ctx.quadraticCurveTo(22,8,15,5);
	ctx.fill();
	ctx.stroke();
	
	
	ctx.beginPath();
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = "#212121";
	var gradient = ctx.createLinearGradient(0, 30, 30, 30);
	gradient.addColorStop(0, '#828282');
	gradient.addColorStop(0.1, '#969696');
	gradient.addColorStop(0.4, '#aaaaaa');
	gradient.addColorStop(0.8, '#969696');
	gradient.addColorStop(1, '#828282');
	ctx.fillStyle = gradient;
	ctx.moveTo(15,5);
	ctx.lineTo(5,15);
	ctx.quadraticCurveTo(8,22,15,25);
	ctx.lineTo(25,15);
	ctx.quadraticCurveTo(18,12,15,5);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "#4E4F7F";
	ctx.lineWidth = 2.5;
	ctx.moveTo(13,7);
	ctx.quadraticCurveTo(0,0,14,14);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(25,15);
	ctx.quadraticCurveTo(18,12,15,5);
	ctx.quadraticCurveTo(22,8,15,5);
	ctx.closePath();
	ctx.fillStyle = "#000000";
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = "#" + $("#primary_color").val();
	ctx.moveTo(25,15);
	ctx.bezierCurveTo(18,12,17,7,20,8);
	ctx.quadraticCurveTo(31,20,25,25);
	ctx.quadraticCurveTo(23,20,24,14);
	ctx.fill();
	
/*	ctx.beginPath();
	ctx.translate(28,24);
	ctx.rotate(-0.2)
	ctx.scale(1.3,2.5);
	ctx.arc(0,0,1,0,Math.PI*2,1);
	ctx.fill();*/
//	ctx.stroke();
	
	ctx.restore();
}