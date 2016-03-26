Tools.layers = {
	init: function(){
		this.initSubMenu();
		
		$("#layer_list").on("click", ".listed_layer", function(){
			Yang.selectLayer(parseInt($(this).attr("data-index")));
		});
		
		$("#layer_list").on("mousedown", ".layer_name", function(){
			Yang.stopTool();
			var dex = $(this).parent().attr("data-index");
			Tools.layers.setFlasher(dex);
		}).on("mouseup", ".layer_name", function(){
			Tools.layers.clearFlasher();
		}).on("mouseleave", ".layer_name", function(){
			Tools.layers.clearFlasher();
		});
	},
	clearFlasher: function(){
		$(".shown_layer").removeClass("shown_layer");
		clearInterval(Tools.layers.flasher);
		for(var i = 0; i < Pic.Layers.length; i++){
			if(Pic.Layers[i] && !Pic.Layers[i].hidden){
				$("#canvas_layer" + i).css("opacity", Math.round(Pic.Layers[i].alpha)/100);
			}
		}
	},
	setFlasher: function(dex){
		var t = 1;
		var dt = -0.13;
		var downLow = 0;
		$("#canvas_layer" + dex).addClass("shown_layer");
		Tools.layers.flasher = setInterval(function(){
						$(".canvas_layer").each(function(){
							for(var i = 0; i < Pic.Layers.length; i++){
								if(Pic.Layers[i] && !Pic.Layers[i].hidden){
									$("#canvas_layer" + i).css("opacity", Math.round(Pic.Layers[i].alpha*t)/100);
								}
							}
					
							if (t < 0.05){
								downLow = 1;
								dt = 0.005;
							}else if (t > 0.25 && downLow){
								dt = -0.005;
							}
							t += dt;
						});
					}, 50);
	},
	flashInt: 0,
	flashLayer: 0,
	fadeOthers: function(i){
		/*if(Tools.settings.opts.hide_other_layers_during_action){
			if(i == undefined){
				i = Yang.layer;
			}
			$("#top_canvas").addClass("shown_layer");
			$(".canvas_layer").each(function(){
				if(parseInt($(this).attr("data-index")) == i){
					$(this).addClass("shown_layer", 250);
				}else{
					$(this).addClass("hidden_layer", 250);
				}
			});
		}*/
		
	},
	showOthers: function(){
		/*if(Tools.settings.opts.hide_other_layers_during_action){
			$("#top_canvas").removeClass("shown_layer", 250);
			$(".canvas_layer").removeClass("shown_layer", 250);
			$(".canvas_layer").removeClass("hidden_layer", 250);
		}*/
	}
}

Tools.layers.initSubMenu = function(){
	
	Menus.addButtonCover(43, 281, "addlayer", "right");
	Menus.addButtonCover(13, 281, "removelayer", "right");
	Menus.addButtonCover(73, 281, "flatten", "right");
	Menus.addButtonCover(103, 281, "sortlayers", "right", "sortlayers_cover");
};

Tools.addlayer = {
	edge:'bottom',
	enText:'  add new layer',
	chText:'        新层',
	selectable: 0,
	click: function(){
		Yang.newLayer();
		Yang.selectLayer(Pic.Layers.length-1);
	}
};
Tools.removelayer = {
	edge:'bottom',
	enText:'  delete layer',
	chText:'      删除层',
	selectable:0,
	popLayer: function(dex){
		Pic.Layers[dex] = null;
	  	$("#canvas_layer" + dex).hide();
		$("#listed_layer" + dex).hide();
		$(".faded_history_tile, .history_tile_layer" + dex).remove();
		
		for(var i = 0; i < History.actions.length; i++){
			if(History.actions[i].layer == dex || i > History.index){
				History.actions.splice(i,1);
				i--;
			}
		}
		History.index = History.actions.length;
		var targetLayer = -1;
		for(var i = 0; i < Pic.Layers.length; i++){
			if(Pic.Layers[i]){
				targetLayer = i;
				break;
			}
		}
		if(targetLayer < 0){
			Yang.newLayer("New Base Layer");
			$(document).ready(function(){
				var i = 0;
				Yang.selectLayer(Pic.Layers.length-1);
			});
			
		}else{
			Yang.selectLayer(targetLayer);
		}
		$("#history_tiles").children(".history_tile").each(function(){
			$(this).attr("id", "history_tile" + i);
			i++;
		});
	},
	click: function(){
		var x;
		var r=confirm("Delete " + $("#listed_layer" + Yang.layer).children("input").first().val() + "?");
		if (r==true){
			Tools.removelayer.popLayer(Yang.layer);
		}
	}
};
Tools.flatten = {
	edge:'bottom',
	enText:'  merge layers',
	chText:'    合并图层',
	selectable: 0,
	click: function(){
		
		//var r=confirm("Flatten Image?  This action can't be undone.");
		//if (r==true){
			if(Yang.tool && Yang.tool.unselect){
				Yang.tool.unselect;
			}
					var canvas = document.createElement('canvas');
					canvas.width = Pic.w;
					canvas.height = Pic.h;
					var ctx = canvas.getContext('2d');
					ctx.globalCompositeOperation = 'destination-over';

				//	$(document).ready(function(){
						$("#layer_list").children(".listed_layer").each(function(){
							var i = parseInt($(this).attr("data-index"),10);
							if(Pic.Layers[i]){
								var lay = $('#canvas_layer' + i)[0];
								ctx.beginPath();
								ctx.globalAlpha = Pic.Layers[i].alpha/100;
								ctx.drawImage(lay,0,0);
							}
						});
						$(".listed_layer").remove();
						$(".canvas_layer").remove();
						$(".history_tile").remove();
						Pic.Layers = [];
					//	$(document).ready(function(){
							Yang.newLayer("Flattened Canvas");
							Yang.selectLayer(0);
					//		$(document).ready(function(){
								var ctx = $('#canvas_layer0')[0].getContext('2d');
							//	History.add({tool:"flattenimage",data: canvas, special: 1, layer: 0}, true);
								History.actions = [];
								History.index = 0;
								var details = {
									tool:"upload",
									data: canvas,
									layer:0
								}
								History.act(details, ctx);
								History.add(details);
		}
//	 }
};
Tools.sortlayers = {
	edge:'bottom',
	enText:'  reorder layers',
	chText:'    重新排序层',
	selectable: 0,
	xOffset:-15,
	yOffset:-15,
	enabled: 0,
	click: function(){
		if(!Tools.sortlayers.enabled){
			Tools.sortlayers.enabled = 1;
				$("#sortlayers_cover").addClass("active_button_cover");
				$('#layer_list').sortable({
					enabled: true,
					containment: 'parent',
					axis: 'y',
					update: function(){
						var i = 0;
						var len = $("#layer_list").children(".listed_layer").length;
						$("#layer_list").children(".listed_layer").each(function(){
							var index = $(this).attr("data-index");
							$(this).attr("data-rank",len-i);
							$("#canvas_layer" + index).css("z-index", (len-i)*2);
							i++;
						});
					}
				});
				$(".listed_layer").append("<div class='drag_cover'></div>");
			
		}else{
            Tools.sortlayers.unselect();
		}
	},
	unselect: function(){
			Tools.sortlayers.enabled = 0;
			$("#sortlayers_cover").removeClass("active_button_cover");
			$(".drag_cover").remove();
			$("#layer_list").sortable("destroy");
	},
	otherClick: function(){
		//this.unselect
	},
	press: function(){},
	hold: function(){},
	release: function(){}
};

Tools.addlayer.draw = function(ctx){
	ctx.beginPath();

	ctx.lineCap = 'butt';
	var radgrad = ctx.createRadialGradient(15, 25, 5, 15, 15, 15);
	radgrad.addColorStop(0, '#4ac0f7');
	radgrad.addColorStop(0.5, '#0c91ce');	
	radgrad.addColorStop(1, '#040082');

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 8;
	ctx.moveTo(15, 27);
	ctx.lineTo(15, 3);
	ctx.moveTo(27, 15);
	ctx.lineTo(3, 15);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = radgrad;
	ctx.lineWidth = 4;
	ctx.moveTo(15, 25);
	ctx.lineTo(15, 5);
	ctx.moveTo(25, 15);
	ctx.lineTo(5, 15);
	ctx.stroke();
};
Tools.removelayer.draw = function(ctx){
	ctx.beginPath();

	ctx.lineCap = 'butt';
	var radgrad = ctx.createRadialGradient(4, 25, 3, 15, 15, 15);
	radgrad.addColorStop(0, '#db2727');
	radgrad.addColorStop(1, 'rgba(225, 0, 0, .9)');

	ctx.lineWidth = 8;
	ctx.strokeStyle = 'black';
	ctx.moveTo(5.5, 5.5);
	ctx.lineTo(24.5, 24.5);
	ctx.moveTo(5.5, 24.5);
	ctx.lineTo(24.5, 5.5);
	ctx.stroke();



	ctx.beginPath();
	ctx.strokeStyle = radgrad;
	ctx.lineWidth = 4;
	ctx.moveTo(7, 7);
	ctx.lineTo(23, 23);
	ctx.moveTo(7, 23);
	ctx.lineTo(23, 7);
	ctx.stroke();
	
};
Tools.flatten.draw = function(ctx){
	ctx.beginPath();
	ctx.strokeStyle='#1c1c1c';
	ctx.fillStyle='white';
	ctx.lineWidth=2;
	
	ctx.beginPath();
	ctx.moveTo(6,20);
	ctx.lineTo(15,24);
	ctx.lineTo(24,20);
	ctx.lineTo(15,16);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(6,17);
	ctx.lineTo(15,21);
	ctx.lineTo(24,17);
	ctx.lineTo(15,13);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(6,14);
	ctx.lineTo(15,18);
	ctx.lineTo(24,14);
	ctx.lineTo(15,10);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.beginPath();
	ctx.save();
	ctx.translate(-3,23);
	ctx.scale(1,-0.7);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1.5;
	ctx.moveTo(16, 27);
	ctx.lineTo(20, 27);
	ctx.lineTo(20, 21);
	ctx.lineTo(24, 21);
	ctx.lineTo(18, 13);
	ctx.lineTo(12, 21);
	ctx.lineTo(16, 21);

	radgrad = ctx.createRadialGradient(20, 12, 1, 19, 11, 10);
	radgrad.addColorStop(0, '#066800');
	radgrad.addColorStop(1, 'rgba(0, 218, 0, 1)');

	ctx.closePath();
	ctx.fillStyle = radgrad;
	ctx.fill();
	ctx.stroke();
	
	ctx.restore();
};
Tools.sortlayers.draw = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 1;
	ctx.font = "bold 7pt arial";
	ctx.strokeText("123", 1.5, 10);
	ctx.fillText("123", 1.5, 10);
	
	
	ctx.save();
	ctx.translate(-1,8.5);
	ctx.scale(0.75,0.75);
		ctx.beginPath();
		ctx.strokeStyle='#1c1c1c';
		ctx.fillStyle='white';
		ctx.lineWidth=2;
		
		ctx.beginPath();
		ctx.moveTo(6,20);
		ctx.lineTo(15,24);
		ctx.lineTo(24,20);
		ctx.lineTo(15,16);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.translate(0,-2);
		
		ctx.beginPath();
			ctx.fillStyle = '#066800';
		ctx.moveTo(6,17);
		ctx.lineTo(15,21);
		ctx.lineTo(24,17);
		ctx.lineTo(15,13);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.translate(0,-2);
		
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.moveTo(6,14);
		ctx.lineTo(15,18);
		ctx.lineTo(24,14);
		ctx.lineTo(15,10);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
		
		ctx.beginPath();
		
		ctx.save();
		
		
		ctx.translate(14.5,-10);
		ctx.scale(0.55,0.65);
		ctx.translate(14,14);
		ctx.rotate(0.8);
		
		ctx.beginPath();
		ctx.lineCap = 'butt';
		ctx.strokeStyle = 'black';

		var radgrad = ctx.createRadialGradient(20, 12, 1, 19, 11, 10);
		radgrad.addColorStop(0, '#066800');
		radgrad.addColorStop(1, 'rgba(0, 218, 0, 1)');

		ctx.fillStyle = radgrad;
		ctx.lineWidth = 2;
		ctx.arc(16, 17, 5, Math.PI * 5 / 4, Math.PI / 4, 0);
		ctx.arc(16, 17, 10, Math.PI / 4, 5 * Math.PI / 4, 1);
		ctx.lineTo(6, 6);
		ctx.lineTo(6, 17);
		ctx.lineTo(15, 17);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		
};

Tools.ghost = {
	draw: function(ctx){
		ctx.beginPath();
		ctx.scale(0.9,1);
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#e8e8e8";
		ctx.arc(10,10,9,0,3.14,1);
		ctx.stroke();
		
		ctx.moveTo(19,10);
		ctx.lineTo(19,19);
		ctx.lineTo(16,16);
		ctx.lineTo(13,19);
		ctx.lineTo(10,16);
		ctx.lineTo(7,19);
		ctx.lineTo(4,16);
		ctx.lineTo(1,19);
		ctx.lineTo(1,10);
		ctx.fill();
		ctx.stroke();
		
		
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.fillStyle = "#FFFFFF";
		ctx.arc(6.5,9,2.5,0,6.28,0);
		ctx.stroke();
		ctx.fill();
		
		ctx.beginPath();
		ctx.arc(13.5,9,2.5,0,6.28,0);
		ctx.stroke();
		ctx.fill();
		
		ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.fillRect(6.5,7.5,2,2);
		ctx.fillRect(13.5,7.5,2,2);
	}
};