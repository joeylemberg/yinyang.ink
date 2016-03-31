var Yang = {
	tool : null,
	toolName: "",
	zoom : 0,
	left : 100,
	top : 100,
	unitMark: 1,
	ctx: null,
	layer: 0,
	busy: 0,
	zoomPlace: 1,
	init : function(){
		this.newPic();
		$("#picture_title").blur(function(){
			Pic.title = $(this).val();
		});
	},
	newPic : function(){
		var w = Math.min(Config.maxSize, Math.round($(window).width() * 0.65 * pxRatio));
		var h = Math.min(Config.maxSize, Math.round($(window).height() * 0.65 * pxRatio));
		Yang.setPicSize(w,h);
		Yang.left = 110;
		Yang.top = 110;
		Yang.placePic();
		Yang.newLayer("Base Layer");
		Yang.selectLayer(0);
		Pic.title = "untitled_picture";// + Math.round(Math.random()*100000);
		$("#picture_title").val(Pic.title);
		
	},
	newLayer: function(name){
		var layerIndex = Pic.Layers.length;
		if(name == undefined){
			name = ("Layer_" + Pic.Layers.length);
		}
		var newLayer = {
			name : name,
			alpha : 100,
			data : null,
			ctx : null,
			savedFrame: null,
			hidden:false
		};
		$("#picture").append('<canvas data-index="' + layerIndex + '" style="z-index:' + layerIndex*2 + ';" class="canvas_layer" id="canvas_layer' + layerIndex + '" height="' + Pic.h + '" width="' + Pic.w + '"></canvas>');
		newLayer.ctx = $('#canvas_layer' + layerIndex)[0].getContext("2d");
		Pic.ctx = newLayer.ctx;
		Pic.Layers.push(newLayer);
		
		
		
		Yang.layer = layerIndex;
		$("#layer_list").prepend("<div data-rank='" + layerIndex + "' data-index='" + layerIndex + "' id='listed_layer" + layerIndex + "' class='listed_layer'><input class='layer_name' value='" + name + "'><canvas width='" + (20*pxRatio) + "' height='" + (20*pxRatio) + "' class='alpha_ghost' id='alpha_ghost" + layerIndex + "'></canvas><canvas class='alpha_slider' width='30' height='10' id='alpha" + layerIndex + "_slider'></canvas><input type='text' id='alpha" + layerIndex + "' class='yang_integer alpha_value' data-index='" + layerIndex + "' value='100'/></div>");
		var gtx = $("#alpha_ghost" + layerIndex)[0].getContext("2d");
		gtx.save();
		gtx.scale(0.8*pxRatio,0.8*pxRatio);
		gtx.translate(3,3);
		Tools.ghost.draw(gtx);
		gtx.restore();
		$("#alpha_ghost" + layerIndex).click(function(){
			var ctx = this.getContext("2d");
			var index = parseInt($(this).parent().attr("data-index"));
			if($(this).hasClass("hidden_ghost")){
				Pic.Layers[index].hidden = false;
				ctx.save();
				ctx.clearRect(0,0,30,30);
				ctx.scale(0.8,0.8);
				ctx.translate(3,3);
				Tools.ghost.draw(ctx);
				ctx.restore();
				$(this).removeClass("hidden_ghost");
				$("#canvas_layer" + index).show();
				$("#alpha" + index).show();
				if(Yang.layer == index){
					$("#top_canvas").show();
				}
			}else{
				Pic.Layers[index].hidden = true;
				$(this).addClass("hidden_ghost");
				ctx.clearRect(0,0,30,30);
				ctx.save();
				ctx.scale(0.7,0.7);
				Tools.removelayer.draw(ctx);
				ctx.restore();
				//$(this).parent().addClass("hidden_listed_layer");
				$("#canvas_layer" + index).hide();
				$("#alpha" + index).hide();
				if(Yang.layer == index){
					$("#top_canvas").hide();
				}
			}
			/*if(Pic.Layers[layerIndex].alpha <= 50){
				$("#alpha" + layerIndex).val(100).trigger("blur");
			}else{
				$("#alpha" + layerIndex).val(0).trigger("blur");
			}*/
		});
		var sliderName = "alpha" + layerIndex;
		Sliders[sliderName] = {
			name: sliderName,
			unit: "%",
			width: 30,
			value: 100,
			min: 0,
			med: 50,
			max: 100,
			onUpdate: function(){
				if($("#alpha_ghost" + layerIndex).hasClass("hidden_ghost")){
					$("#alpha_ghost" + layerIndex).trigger("click");
				}
				Pic.Layers[layerIndex].alpha = Sliders[sliderName].value;
				if(layerIndex == Yang.layer){
					$("#top_canvas").css("opacity", Util.round2(Sliders[sliderName].value/100));
				}
				$("#alpha_ghost" + layerIndex + ",#canvas_layer" + layerIndex).css("opacity", Util.round2(Sliders[sliderName].value/100));
			}
		};
		Sliders.bindSlider(sliderName);
		$("#listed_layer" + layerIndex).children("input").first().blur(function(){
			Pic.Layers[layerIndex].name = $(this).val();
		});
		
		$("#layer_list").scrollTop(Math.ceil($("#layer_list").children(".listed_layer").length * 20));
		
	},
	stopTool: function(){
		if(Yang.tool && Yang.tool.finish != undefined){
			Yang.tool.finish();
		}
	},
	selectLayer: function(i){
		$(".active_listed_layer").removeClass("active_listed_layer");
		$("#listed_layer" + i).addClass("active_listed_layer");
		Yang.layer = i;
		$("#top_canvas").css("opacity",  Util.round2(Pic.Layers[i].alpha/100));
		var zIndex = parseInt($("#canvas_layer" + i).css("z-index")) + 1;
		$("#top_canvas").css("z-index", zIndex);
		if(Pic.Layers[i].hidden){
			$("#top_canvas").hide();
		}else{
			$("#top_canvas").show();
		}
	},
	setPicSize: function(w,h){
		Pic.w = w;
		Pic.h = h;
		$("#top_canvas, .canvas_layer").attr("width", w).attr("height", h);
	},
	setZoom: function(zoom){
		if(zoom < 0.05){
			zoom = 0.05;
		}else if(zoom > 9.95){
			zoom = 9.95;
		}
		
		if(zoom != this.zoom){
			this.zoom = zoom;
			var bgSize = Math.max(2,Math.ceil(20*Yang.zoom));
			$("#picture").css("background-size",bgSize + "px");

		
			$('#picture, #picture_shadow').css({
				'width' : Pic.w*Yang.zoom + 'px',
				'height': Pic.h*Yang.zoom + 'px'
			});
			
			
			Yang.drawUnitMarks();
			
			if(Pic.w*Yang.zoom + Yang.left < 40){
				Yang.left = 45;
			}
			if(Pic.h*Yang.zoom + Yang.top < 85){
				Yang.top = 85;
			}
			if(Yang.left + 25 > $(window).width() || Yang.top + 15 > $(window).height()){
				Yang.left = 75;
				Yang.top = 105;
			}
			
			Yang.placePic();
		}
	},
	placePic : function(){
		
		$('#picture').css({
			'left' : Yang.left + 'px',
			'top' : Yang.top + 'px'
		});
		
		$('#picture_shadow').css({
			'left' : (Yang.left + 3*Yang.zoom) + 'px',
			'top' : (Yang.top + 3*Yang.zoom) + 'px'
		});
		
		$("#x_units_canvas").css("left", (Yang.left-10) + "px")
		$("#x_units_canvas").css("top", (Yang.top - 20) + "px");
		$("#y_units_canvas").css("left", (Yang.left - 50) + "px")
		$("#y_units_canvas").css("top", (Yang.top - 10) + "px");
		
	},
	
	drawUnitMarks: function(){
		if(Yang.zoom < 0.1){
			Yang.unitMark = 1000;
		}else if(Yang.zoom < 0.25){
			Yang.unitMark = 500;
		}else if(Yang.zoom < 0.5){
			Yang.unitMark = 250;
		}else if(Yang.zoom <= 2){
				Yang.unitMark = 100;
		}else if(Yang.zoom < 4){
				Yang.unitMark = 25;
		}else if(Yang.zoom < 6.5){
				Yang.unitMark = 10;
		}else{
			Yang.unitMark = 5;
		}
		
		//gaton gatita
		//Yang.zoomPlace = Input.place.indexOf(Yang.sname);
		
		if(true || Yang.unitMark != markVal){
			$("#x_units_canvas").show().attr("width", Math.ceil(Pic.w*Yang.zoom)+50);
			$("#y_units_canvas").show().attr("height", Math.ceil(Pic.h*Yang.zoom)+10);
			var ctx = $("#x_units_canvas")[0].getContext('2d');
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#000000";
			ctx.fillStyle = "#000000";
			ctx.font = '8pt Courier New';
			ctx.textAlign = 'center';
			var i;
			for(i = 0; i < Pic.w; i+= Yang.unitMark){
				ctx.moveTo(i*Yang.zoom+10,20);
				ctx.lineTo(i*Yang.zoom+10,15);
				ctx.fillText(i + "px",10+i*Yang.zoom,11);
			}
			ctx.stroke();
			ctx = $("#y_units_canvas")[0].getContext('2d');
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#000000";
			ctx.fillStyle = "#000000";
			ctx.font = '8pt Courier New';
			ctx.textAlign = 'right';
			for(i = 0; i < Pic.h; i+= Yang.unitMark){
				ctx.moveTo(50,i*Yang.zoom+10);
				ctx.lineTo(45,i*Yang.zoom+10);
				ctx.fillText(i + "px",44,i*Yang.zoom+13);
			}
			ctx.stroke();
		}
	}
};