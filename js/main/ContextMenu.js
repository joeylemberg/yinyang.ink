// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

var ContextMenu = {
	x: 0,
	y: 0,
	init: function(){
		
		$(function() {
			$(this).bind("contextmenu", function(e) {
				e.preventDefault();
				$("#context_menu").show().css("top",e.pageY).css("left",e.pageX);
				ContextMenu.x = Input.x;
				ContextMenu.y = Input.y;
				if(Input.overPic){
					if(!$("#clipped_range").length){
						$("#context_copy, #context_cut, #context_delete, #context_flipx, #context_flipy").addClass("disabled_context_item");
					}else{
						$("#context_copy, #context_cut, #context_delete, #context_flipx, #context_flipy").removeClass("disabled_context_item");
					}
					if(Yang.toolName == "magicwand"){
						$("#context_copy, #context_cut, #context_delete").removeClass("disabled_context_item");
					}
					if($(".active_clipboard_canvas").length){
						$("#context_paste").removeClass("disabled_context_item");
					}else{
						$("#context_paste").addClass("disabled_context_item");
					}
				}else{
					$(".context_menu_item").addClass("disabled_context_item");
				}
				
			});
		});
		
		$(".context_menu_item").click(function(){
			if(!$(this).hasClass("disabled_context_item")){
				$("#context_menu").hide();
				ContextMenu[$(this).attr("id")]();
			}
		});
		
	},
	context_copy: function(){
		if(Clipboard.range || Yang.toolName == "magicwand"){
			if(Yang.tool.finish){
				Yang.tool.finish();
			}
		
			$("#clipboard_menu, #clipboard_list").show();
			var canvas;
			if(Yang.toolName == "magicwand"){
				var x = Pic.w;
				var y = Pic.h;
				var xMax = 0;
				var yMax = 0;
				var pxSet = Tools.magicwand.pxSet;
				for(var i = 0; i < pxSet.length; i++){
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
				Clipboard.range = {x: x, y: y, w: xMax-x, h:yMax-y};
				canvas = document.createElement("canvas");
				canvas.width = Clipboard.range.w;
				canvas.height = Clipboard.range.h;
				var ctx = canvas.getContext("2d");
				ctx.save();
			
			
				ctx.translate(-x,-y);
				ctx.drawImage(Tools.magicwand.getCanvas(),0,0);
				ctx.globalCompositeOperation = "source-in";
				ctx.drawImage($("#canvas_layer" + Yang.layer)[0],0,0);
				//console.log(Tools.magicwand.canvas.toDataURL());
				//console.log(canvas.toDataURL());
				//console.log(canvas.width);
				ctx.restore();
				//Clipboard.data = canvas;
				//ctx.drawImage(Clipboard.data,0,0,Clipboard.range.w, Clipboard.range.h);
			}else{
				canvas = document.createElement("canvas");
				canvas.width = Clipboard.range.w;
				canvas.height = Clipboard.range.h;
				var ctx = canvas.getContext("2d");
				if(!Clipboard.data){
					Clipboard.press();
				}
				ctx.drawImage(Clipboard.data,0,0,Clipboard.range.w, Clipboard.range.h);
			}
		
		
		
		
			Clipboard.copyDataIndex = Clipboard.copyData.length;
			$(".active_clipboard_canvas").removeClass("active_clipboard_canvas");
			canvas.setAttribute("id", "clipboard_data" + Clipboard.copyDataIndex);
			canvas.setAttribute("class", "clipboard_canvas active_clipboard_canvas");
			canvas.setAttribute("data-index", Clipboard.copyDataIndex);
			canvas.setAttribute("data-w", Math.round(Clipboard.range.w));
			canvas.setAttribute("data-h", Math.round(Clipboard.range.h));
			$("#clipboard_list").append(canvas);
			Clipboard.copyData.push({
				data: canvas,
				width: Clipboard.range.w,
				height: Clipboard.range.h
			});
		
			$("#clipboard_data" + Clipboard.copyDataIndex).click(function(){
				$(".active_clipboard_canvas").removeClass("active_clipboard_canvas");
				$(this).addClass("active_clipboard_canvas");
			});
		
			$("#clipboard_list").animate({scrollTop:$("#clipboard_list")[0].scrollHeight - $("#clipboard_list").height()}, '500', 'swing');
		
		}
		
	},
	context_cut: function(){
		if(Clipboard.range || Yang.toolName == "magicwand"){
			if(Yang.toolName == "selectbox" || Yang.toolName == "selectfree" || Yang.toolName == "magicwand"){
				$("#clipboard_menu, #clipboard_list").show();
				ContextMenu.context_copy();
				ContextMenu.context_delete();
			}
		}
	},
    context_paste: function(){
        if(Clipboard.data){
            if(Yang.tool.name != 'selectbox' && Yang.tool.name != 'freeselect'){
					$("#selector").trigger("click");
		    }
		
				var w = parseInt($(".active_clipboard_canvas").first().attr("data-w"));
				var h = parseInt($(".active_clipboard_canvas").first().attr("data-h"));
				var x = Math.round(Input.x-w/2);
				var y = Math.round(Input.y-h/2);
				if(x < 0){
					x = 0
				}else if(x + w > Pic.w){
					x = Pic.w - w;
				}
				if(y < 0){
					y = 0
				}else if(y + h > Pic.h){
					y = Pic.h - h;
				}
		
				var details = {
					tool: "upload",
					data: $(".active_clipboard_canvas")[0],
					layer: Yang.layer,
					x : x,
					y : y,
					start: {realTool:"paste"} 
				}
		
				History.act(details, Yang.ctx);
				History.add({
					tool:"upload",
					layer: Yang.layer,
					isDummy: 1
				});
				//History.add(details);
				Clipboard.start = {
					x : x,
					y : y,
					w : w,
					h : h,
					nodelete: 1,
					path : [],
					theta : 0
				};
				Clipboard.data = $(".active_clipboard_canvas")[0];
				Clipboard.range = $.extend({}, Clipboard.start);
				Clipboard.prev = $.extend({}, Clipboard.start);
				Clipboard.start.realTool = "upload";
				Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
				Clipboard.makeRange();
				Clipboard.dashRange();
				Clipboard.drawData(Yang.ctx);
        }
    },
	context_delete: function(){
		if(Clipboard.range || Yang.toolName == "magicwand"){
			if(Yang.tool.deletePress != undefined){
				Yang.tool.deletePress();
				Clipboard.range = 0;
			}
		}
	},
	context_flipx: function(){
		if(Clipboard.range.flipX == undefined || !Clipboard.range.flipX){
			Clipboard.range.flipX = 1;
		}else{
			Clipboard.range.flipX = 0;
		}
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		Clipboard.dashRange();
		Clipboard.drawData(Yang.ctx);
	},
	context_flipy: function(){
		
		if(Clipboard.range.flipY == undefined || !Clipboard.range.flipY){
			Clipboard.range.flipY = 1;
		}else{
			Clipboard.range.flipY = 0;
		}
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		Clipboard.dashRange();
		Clipboard.drawData(Yang.ctx);
	}
};