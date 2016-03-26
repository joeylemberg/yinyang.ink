/*
	magicwand.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.magicwand = {
	selectable: 1,
	name: 'magicwand',
	yinyang: "yang",
	xOffset: -20,
	yOffset: -10,
	edge:'left',
	enText:'automagic select',
	chText:'自动切刀',
	selectable:1,
	paintData: [],
	allData :[],
	pointData : [],
	likePoints: [],
	deltas: [],
	threshold: 0,
	anchor: [],
	pxSet : [],
	canvas: null,
	ctx: null,
	clickTime: 0,
	init: function(){
		Menus.addButtonCover(5,381,"magicwand");
		this.canvas = document.createElement('canvas');
	},
	select:function(){
		this.paintData = [];
		this.loaded = 0;
		
		
		
		this.canvas.width = Pic.w;
		this.canvas.height = Pic.h;
		this.ctx = this.canvas.getContext("2d");
	},
	unselect:function(){
		this.loaded = 0;
	},
	blankPress: false,
	//press: Wand.press,
	//hold: Wand.hold,
	//release: Wand.release
	press: function(){
		Input.x = Math.max(Math.min(Input.x,Pic.w-1),2);
		Input.y = Math.max(Math.min(Input.y,Pic.h-1),2);
		this.pointData = Pic.Layers[Yang.layer].ctx.getImageData(Input.x, Input.y, 1, 1).data;
		if(!this.pointData[3]){
			this.blankPress = true;
		}else{
			this.blankPress = false;
		}
		this.threshold = 0;
		this.allData = Pic.Layers[Yang.layer].ctx.getImageData(1, 1, Pic.w, Pic.h).data;
		this.clickTime = Date.now();
		
		//var p = Pic.Layers[Yang.layer].ctx.getImageData(Input.x, Input.y, 3, 3).data;
		//this.pointData = [(p[0] + p[4] + p[8])/3,(p[1] + p[5] + p[9])/3,(p[2] + p[6] + p[10])/3,(p[3] + p[7] + p[11])/3];
		this.pointData = Pic.Layers[Yang.layer].ctx.getImageData(Input.x, Input.y, 1, 1).data;
		//this.pointData = Pic.Layers[Yang.layer].ctx.getImageData(Input.x, Input.y, 1, 1).data;
		
		this.anchor = [Input.x, Input.y];
		var r = 0;
		var s = 0;
		this.deltas = [];
		for(var r = 0; r < Pic.h; r++){
			var rowDeltas = [];
			for(var c = 0; c < Pic.w; c++){

					s = 4*(r*Pic.w + c);
					rowDeltas.push(Math.abs(this.allData[s] - this.pointData[0]) + Math.abs(this.allData[s+1] - this.pointData[1]) + Math.abs(this.allData[s+2] - this.pointData[2]) + Math.abs(this.allData[s+3] - this.pointData[3])/4);

			}
			this.deltas.push(rowDeltas);
		}
		if(!this.blankPress){
			this.refresh();
		}
	},
	lastThreshRefresh: 0,
	hold : function(){
		var dx = Input.x - this.anchor[0];
		var dy = Input.y - this.anchor[1];
		this.threshold = Math.sqrt(dx*dx+dy*dy);
		this.noLimit = 1;
		if(Math.abs(this.lastThreshRefresh - this.threshold) > 10/Yang.zoom){
			if(!this.blankPress){
				this.refresh();
			}
			this.lastThreshRefresh = this.threshold;
		}
	},
	
	refresh: function(){
		
		var allPx = [];
		for(var i = 0; i < Pic.w; i++){
			var pxx = [];
			for(var j = 0; j < Pic.h; j++){
				pxx.push(0);
			}
		//	pxx[-1] = 0;
		//	pxx[Pic.h] = 0;
			allPx.push(pxx);
		}
	/*	for(var i = 0; i < Pic.w; i++){
			var pxx = [];
			for(var j = 0; j < Pic.h; j++){
				pxx.push(0);
			}
			pxx[-1] = 0;
			pxx[Pic.h] = 0;
			allPx[-1] = $.extend([],pxx);
			allPx[Pic.w] = $.extend([],pxx);
		}*/
		
		var pxUnit = Math.ceil(Pic.w*Pic.h / 100000/1/1);
		if(Input.overPic){
			var distBonus = 0;
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			Yang.ctx.beginPath();
			Yang.ctx.fillStyle = "rgba(225,50,50,0.3)";
			for(var r = 0; r < Pic.h; r+=pxUnit){
				for(var c = 0; c < Pic.w; c+=pxUnit){
					var dx = c - this.anchor[0];
					var dy = r - this.anchor[1];
					/*if(this.noLimit){
						distBonus = Math.sqrt(dx*dx+dy*dy)/8*pxUnit;
					}*/
				/*	if(this.deltas[r][c] + distBonus < this.threshold){
						allPx.push([r,c]);
						Yang.ctx.fillRect(c,r,pxUnit,pxUnit);
					}*/
				}
			}
		}
		var x;// = this.anchor[0];
		var y;/// = this.anchor[1];
		var r = 0;
		this.anchor[0] = Math.round(this.anchor[0]);
		this.anchor[1] = Math.round(this.anchor[1]);
		var px = [[this.anchor[0],this.anchor[1]]];
		allPx[this.anchor[0]][this.anchor[1]] = 1;
		var added = [0,0,0,0];
		for(var r = 1; r < Math.max(Pic.h,Pic.w); r++){
			for(var i = 0; i <= r*2; i++){
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
		
		
		for(var i = 0; i < Pic.w; i++){
			for(var j = 0; j < Pic.h; j++){
				if(!allPx[i][j]){
					if(this.deltas[j][i] < this.threshold){
						for(var q = -1; q < 2; q++){
							for(var w = -1; w < 2; w++){
								var x = i+q;
								var y = j+w;
								if(x >= 0 && x < Pic.w && y >= 0 && y < Pic.h){
									if(allPx[x][y]){
										allPx[i][j] = 1;
									}
								}
							}
						}
					}
				}
			}
		}
		for(var i = Pic.w-1; i >= 0; i--){
			for(var j = Pic.h-1; j >= 0; j--){
				if(!allPx[i][j]){
					if(this.deltas[j][i] < this.threshold){
						for(var q = -1; q < 2; q++){
							for(var w = -1; w < 2; w++){
								var x = i+q;
								var y = j+w;
								if(x >= 0 && x < Pic.w && y >= 0 && y < Pic.h){
									if(allPx[x][y]){
										allPx[i][j] = 1;
									}
								}
							}
						}
					}
				}
			}
		}
	/*	for(var r = Math.max(Pic.h,Pic.w); r > 0; r--){
			for(var i = 0; i <= r*2; i++){
				x = this.anchor[0] - r + i;
				y = this.anchor[1] - r;
				if(y < Pic.h && y >= 0 && x < Pic.w && x >= 0){
					if(allPx[x][y-1] || (x-1 >= 0 && allPx[x-1][y-1]) || (x+1 < Pic.w && allPx[x+1][y-1])){
						if(this.deltas[y][x] < this.threshold){
							allPx[x][y] = 1;
						}
					}
				}
				
				y = this.anchor[1] + r;
				if(y < Pic.h && y >= 0 && x < Pic.w && x >= 0){
					if(allPx[x][y+1] || (x-1 >= 0 && allPx[x-1][y+1]) || (x+1 < Pic.w && allPx[x+1][y+1])){
						if(this.deltas[y][x] < this.threshold){
							allPx[x][y] = 1;
						}
					}
				}*/
		/*		x = this.anchor[0] - r;
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
					
					if(allPx[x+1][y] || y+1 < Pic.h && allPx[x+1][y+1] || y-1 >= 0 && allPx[x+1][y-1]){
				//	if(allPx[x-1][y] || y+1 < Pic.h && allPx[x-1][y+1] || y-1 >= 0 && allPx[x-1][y-1]){
						if(this.deltas[y][x] < this.threshold){
							allPx[x][y] = 1;
						}
					}
				}*/
	//		}
	//	}
		this.pxSet = [];
		this.ctx.beginPath();
		this.ctx.fillStyle = "rgba(0,0,0,0.5)";
		this.ctx.clearRect(0,0,Pic.w,Pic.h);
		for(var i = 0; i < Pic.w; i++){
			for(var j = 0; j < Pic.h; j++){
				if(allPx[i][j]){
					this.pxSet.push(i);
					this.pxSet.push(j);
				//	console.log(allPx[i][j]);
				//	Yang.ctx.fillRect(i,j,3,3);
				//	this.ctx.fillRect(i,j,3,3);
				Yang.ctx.fillRect(i,j,2.5,2.5);
				this.ctx.fillRect(i,j,2.5,2.5);
				//	Yang.ctx.drawImage(this.canvas,0,0);
				}
			}
		}
		//console.log(this.canvas.toDataURL());
		//this.pxSet = allPx;
	},
	finish: Clipboard.finish,
	release: function(){
		//console.log(this.threshold);
		if(this.threshold < 3){
			this.threshold = 50;
			this.noLimit = 0;
			if(!this.blankPress){
				this.refresh();
			}
			this.loaded = 1;
		}
		
	/*
		if(Date.now() - this.clickTime < 100 && Math.abs(Clipboard.start.w/Yang.zoom) < 5 && Math.abs(Clipboard.start.h/Yang.zoom) < 5){
			$("#clipped_range").remove();
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		}else if(Clipboard.transforming){
			Clipboard.transforming = 0;
			Clipboard.release();
		}else{
		
			var x = Pic.w;
			var y = Pic.h;
			var xMax = 0;
			var yMax = 0;

			for(var i = 0; i < this.pxSet.length; i++){
				if(pxSet[i] < x){
					x = pxSet[i];
				}
				if(pxSet[i] > xMax){
					xMax = pxSet[i];
				}
				i++;
				if(pxSet[i] < y){
					y = pxSet[i];
				}
				if(pxSet[i] > yMax){
					yMax = pxSet[i];
				}
			}
		
			
			Clipboard.range = {
				x : x,//Clipboard.start.x,
				y : y,//Clipboard.start.y,
				w : xMax-x,//Clipboard.start.w,
				h : yMax-y,//Clipboard.start.h,
				path : [],
				theta : 0,
				flipX : 0,
				flipY : 0
			};
			
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			Clipboard.makeRange();
		}*/
		
	},
	getCanvas: function(){
		var canvas = document.createElement('canvas');
		canvas.width = Pic.w;
		canvas.height = Pic.h;
		canvas.getContext("2d").drawImage(this.canvas,0,0);
		return canvas;
	},
	deletePress: function(){
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		/*var distBonus = 0;
		var pxSet = [];
		
		for(var r = 0; r < Pic.h; r++){
			for(var c = 0; c < Pic.w; c++){
				var dx = c - this.anchor[0];
				var dy = r - this.anchor[1];
				if(this.noLimit){
					distBonus = Math.sqrt(dx*dx+dy*dy)/8;
				}
				if(this.deltas[r][c] + distBonus < this.threshold){
					pxSet.push(c);
					pxSet.push(r);
				}
			}
		}*/
		/*var details = {
			tool:'magicwand',
			pxSet : $.extend([],Tools.magicwand.pxSet),
			layer: Yang.layer,
			rangeType: "pxSet"
			};*/
			var details = {
				tool:'magicwand',
				canvas: Tools.magicwand.getCanvas(),
				layer: Yang.layer,
				rangeType: "pxSet"
				};
		History.add(details);
		History.act(details, Pic.Layers[Yang.layer].ctx);
	}
};

Tools.magicwand.act = function(ctx, d){
	
	//ctx.save();
	//ctx.beginPath();
	ctx.globalCompositeOperation = "destination-out";
	ctx.drawImage(d.canvas,0,0);
	//ctx.restore();
	
	//for(var i = 0; i < d.pxSet.length; i+=2){
	//	ctx.clearRect(d.pxSet[i],d.pxSet[i+1],1,1);
	//}
}

Tools.magicwand.draw = function(ctx){
	
	//rod
	ctx.save();
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(20,10);
	ctx.lineWidth = 3.5;
	ctx.strokeStyle = "#000000";
	ctx.lineTo(5,25);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(20,10);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#c97474";
	ctx.lineTo(5,25);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#eaeaea";
	ctx.moveTo(7,23);
	ctx.lineTo(9,21);
	ctx.moveTo(11,19);
	ctx.lineTo(13,17);
	ctx.moveTo(15,15);
	ctx.lineTo(17,13);
	ctx.stroke();
	ctx.restore();
	
	//star
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = "#000000";
	ctx.translate(20,10);
	ctx.rotate(0.1);
	
	ctx.moveTo(2,0);
	
	for(var i = 0; i < 8; i++){
		ctx.lineTo(2.5,0);
		ctx.rotate(Math.PI/7);
		ctx.lineTo(6,0);
		ctx.rotate(Math.PI/7);
	}
	ctx.stroke();
	ctx.fillStyle="#ffbf00";
	ctx.fill();
	ctx.restore();
};