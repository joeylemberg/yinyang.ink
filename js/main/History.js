// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

var History = {
	
	index: 0,
	actions: [],
	pendingAction: null,
	add: function(details){
		if(History.actions[History.index-1] != undefined && History.actions[History.index-1].isDummy != undefined){
			History.actions.splice(History.index-1,1);
			$("#history_tile" + (History.index-1)).remove();
			History.index--;
		}
		$(".faded_history_tile, #pending_tile").remove();
		while(History.index < History.actions.length){
			History.actions.pop();
		}
		this.actions.push(details);
		var tileId = 'history_tile' + History.index;
		layerClass = "history_tile_layer" + details.layer;
		var w = 20*pxRatio;
		var h = 20*pxRatio;
		var s = 0.66*pxRatio;
		$('#history_tiles').append("<canvas data-index=" + History.index + " width='" + w + "' height='" + h + "' class='history_tile active_history " + layerClass + "' id='" + tileId + "' style='float:left;width:20px;height:20px;'></canvas>");
		$("#history_tiles").animate({scrollTop:Math.ceil(History.index/7)*20}, '500', 'swing');
		var ctx = $("#" + tileId)[0].getContext("2d");
		ctx.save();
		if(Tools[details.tool].preDraw != undefined){
			Tools[details.tool].preDraw(ctx);
		}
		ctx.scale(s,s);
		if(details.start != undefined && details.start.realTool != undefined){
			Tools[details.start.realTool].draw(ctx);
		}else{
			Tools[details.tool].draw(ctx);
		}
		ctx.restore();
		this.index++;
	},
	pendingTool: "",
	addPending: function(tool){
		$(".faded_history_tile, #pending_tile").remove();
		var w = 20*pxRatio;
		var h = 20*pxRatio;
		var s = 0.66*pxRatio;
		$('#history_tiles').append("<canvas data-index=" + History.index + " id='pending_tile' width='" + w + "' height='" + h + "' style='float:left;width:20px;height:20px;'></canvas>");
		$("#history_tiles").animate({scrollTop:Math.ceil(History.index/7)*20}, '500', 'swing');
		var ctx = $("#pending_tile")[0].getContext("2d");
		ctx.scale(s,s);
		Tools[tool].draw(ctx);
		this.pendingTool = tool;
	},
	actPending: function(){
		if(Clipboard.pendingAction){
				Clipboard.hideRangeControls();
			Clipboard.pendingAction();
			Clipboard.pendingAction = null;
		
		}
		this.pendingTool = "";
	},
	rebase: function(){
		History.actions = [];
		History.index = 0;
		Tools.flatten.click(1);
		/*var details = {
			tool: "rebase",
			Layers: [],
			layer: 0
		}
		for(var i = 0; i < Pic.Layers.length; i++){
			if(!Pic.Layers[i]){
				details.Layers.push(null);
			}else{
				var img = new Image();
				img.src = $("#canvas_layer" + i).toDataURL();
				img.onload = function(){
					Layers.push(img);
				}
			}
		}
		
		$(".history_tile").remove();
		History.add(details);*/
	},
	act: function(details, context){
		
		var d = details;
		var ctx;
		
		if(context != undefined){
			ctx = context;
		}else{
			ctx = Pic.Layers[d.layer].ctx;
		}
		ctx.save();
		
		switch(d.tool){
			
			case 'deleteselection':
				if(d.path != undefined && d.path.length){
					ctx.beginPath();
					ctx.moveTo(d.path[0][0],d.path[0][1]);
					for(var i = 1; i < d.path.length; i++){
						ctx.lineTo(d.path[i][0],d.path[i][1]);
					}
					ctx.closePath();
					ctx.clip();
				}
			
				ctx.clearRect(d.x,d.y,d.w,d.h);
			break;
			
			case 'selectbox':
			case 'selectfree':
				Clipboard.act(ctx,d);
			break;
			
			case 'flatten':
				ctx.drawImage(d.canvas,0,0);
			break;
			
			case 'upload':
			
				var x = 0;
				var y = 0;
				if(d.x != undefined){
					x = d.x;
				}
				if(d.y != undefined){
					y = d.y;
				}
				if(d.h != undefined && d.h != undefined){
					ctx.drawImage(d.data,x,y,d.w,d.h);
				}else{
					ctx.drawImage(d.data,x,y);
				}
				
				
			break;
			
			case 'pencil':
				Tools.pencil.act(ctx,d);
			break;
			
			case 'brush':
				Tools.brush.act(ctx,d);
			break;
			
			case 'eraser':
				Tools.eraser.act(ctx,d);
			break;
			
			case 'text':
				Tools.text.act(ctx,d);
			break;
			
			case 'magicwand':
				Tools.magicwand.act(ctx,d);
			break;
			
			case 'smudge':
				Tools.smudge.act(ctx,d);
			break;
			
			case 'mover':
				ctx.save();	
				if(d.range.path.length){
					Clipboard.clipRange(ctx, d.range.path);
				}
				
					ctx.clearRect(d.range.x,d.range.y,d.range.w,d.range.h);
				
				ctx.restore();
				ctx.drawImage(d.range.canvas,d.endpoint[0],d.endpoint[1]);
			break;
			case 'resizer':
					ctx.save();	
					if(d.range.path.length){
						Clipboard.clipRange(ctx, d.range.path);
					}
					//ctx.clearRect(d.endPoint[0],d.endPoint[1],d.range.w,d.range.h);
					ctx.clearRect(d.range.x,d.range.y,d.range.w,d.range.h);
					ctx.restore();
					ctx.translate(d.endRange.x, d.endRange.y);
					ctx.scale(d.endRange.xScale,d.endRange.yScale);
					ctx.drawImage(d.range.canvas,0,0, d.endRange.w,d.endRange.h);
			break;
			
			case 'totaldelete':
				ctx.clearRect(0,0,Pic.w,Pic.h);
			break;
			
			
		}
		
		ctx.restore();
	}
	
};