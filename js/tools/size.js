/*
	size.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.size = {
	enText:'picture size',
	chText:'图片大小',
	edge:'left',
	selectable: 1,
	xOffset: -15,
	yOffset: -15,
	stretch: 1,
	active: 0,
	theta: 0,
	rotationInterval: null,
	resize: function(w, h, dx,dy, dontrebase){
		var w = Math.round(w);
		var h = Math.round(h);
		if(w < 1){
			w = 1;
			Pic.w = 1;
			$("#doc_width").val("1px");
		}
		if(h < 1){
			h = 1;
			Pic.h = 1;
			$("#doc_height").val("1px");
		}
		
		if(w > Config.maxSize){
			w = Config.maxSize;
			$("#doc_width").val(Config.maxSize + "px");
		}
		if(h > Config.maxSize){
			h = Config.maxSize;
			$("#doc_height").val(Config.maxSize + "px");
		}
		
		if(!Tools.size.active){
			
			if(dx == undefined){
				dx = 0;
			}
			if(dy == undefined){
				dy = 0;
			}
			
			Tools.size.active = 1;
			var startX = $("#picture").position().left;
			//$("#picture, #picture_shadow").animate({"width":"0px", "left": (startX +Pic.w*Yang.zoom/2 )+"px" },250, function(){
				 Pic.w = w;
				 Pic.h = h;
				for(var i = 0; i < Pic.Layers.length; i++){
					if(Pic.Layers[i]){
				var canvas = document.createElement('canvas');
				canvas.width = Pic.w;
				canvas.height = Pic.h;
				$(canvas).ready(function(){
					var ctx = canvas.getContext("2d");
						if(Tools.size.stretch){
								ctx.drawImage($("#canvas_layer" + i)[0], dx,dy, Pic.w, Pic.h);
						}else{
								ctx.drawImage($("#canvas_layer" + i)[0], dx,dy);
						}
						$("#canvas_layer" + i).attr("width", w).attr("height", h);
						$("#canvas_layer" + i).ready(function(){
							var c = $("#canvas_layer" + i)[0].getContext("2d");
							c.clearRect(0,0,Pic.w,Pic.h);
							c.drawImage(canvas,0,0,Pic.w,Pic.h);
						});
				});
						}
					}
					$("#picture, #picture_shadow").css({"width":(Pic.w*Yang.zoom ) + "px","height":(Pic.h*Yang.zoom ) + "px"});
					$("#top_canvas").attr("width", w).attr("height", h);
					
					History.rebase();
					Tools.size.active = 0;
					Yang.drawUnitMarks();
		}
	},
	init: function(){
		
			Tools.size.initSubMenu();
			Tools.size.initExtras();
		
			$('#doc_height').focus(function(){
				$(this).val(Pic.h);
			});
			
			$('#doc_width').focus(function(){
				$(this).val(Pic.w);
			});

			$('#doc_height').blur(function(){
				var h = parseInt($(this).val());
				if(Util.isNumber(h)){
					Math.max(1,Math.min(h,Config.maxSize));
					$(this).val(h + "px");
					Tools.size.resize(Pic.w,h);
				}else{
					$(this).val(Pic.h + "px");
				}
			});	

			

			$('#doc_width').blur(function(){
				var w = parseInt($(this).val());
				if(Util.isNumber(w)){
					Math.max(1,Math.min(w,Config.maxSize));
					$(this).val(w + "px");
					Tools.size.resize(w,Pic.h);
				}else{
					$(this).val(Pic.w + "px");
				}
			});
		$(".size_stretch_button").click(function(){
			$(".size_stretch_button").removeClass("pressed_button");
			$(this).addClass("pressed_button");
			if($(this).attr("id") != "size_stretch"){
				Tools.size.stretch = 0;
			}else{
				Tools.size.stretch = 1;
			}
		}).last().trigger("click");
		
		$("#horizontalflip").click(function(){
			if(!Tools.size.active){
				Tools.size.active = 1;
				var startX = $("#picture").position().left;
				$("#picture_shadow").hide();
				$("#picture").animate({"width":"0px", "left": (startX +Pic.w*Yang.zoom/2 )+"px" },150, function(){
					for(var i = 0; i < Pic.Layers.length; i++){
						if(Pic.Layers[i]){
					var canvas = document.createElement('canvas');
					canvas.width = Pic.w;
					canvas.height = Pic.h;
					$(canvas).ready(function(){
						console.log("ASd");
						var ctx = canvas.getContext("2d");
						ctx.translate(Pic.w,0);
						ctx.scale(-1,1);

								ctx.drawImage($("#canvas_layer" + i)[0], 0, 0, Pic.w, Pic.h);
								var c = $("#canvas_layer" + i)[0].getContext("2d");
								c.clearRect(0,0,Pic.w,Pic.h);
								c.drawImage(canvas,0,0,Pic.w,Pic.h);

						//Pic.Layers[i].savedFrame = {index: History.index, data:canvas}
					});
							}
						}
						$("#picture, #picture_shadow").animate({"width":(Pic.w*Yang.zoom ) + "px","left":startX+"px"},150, function(){
								Tools.size.active = 0;
								Yang.drawUnitMarks();
								History.rebase();
								$("#picture_shadow").show();
						});
						
				});
			
			}
		});
		
		$("#verticalflip").click(function(){
			if(!Tools.size.active){
				Tools.size.active = 1;
				var startY = $("#picture").position().top;
				$("#picture_shadow").hide();
				$("#picture").animate({"height":"0px", "top": (startY +Pic.h*Yang.zoom/2 )+"px" },150, function(){
					for(var i = 0; i < Pic.Layers.length; i++){
						if(Pic.Layers[i]){
					var canvas = document.createElement('canvas');
					canvas.width = Pic.w;
					canvas.height = Pic.h;
					$(canvas).ready(function(){
						var ctx = canvas.getContext("2d");
						ctx.translate(0,Pic.h);
						ctx.scale(1,-1);

								ctx.drawImage($("#canvas_layer" + i)[0], 0, 0, Pic.w, Pic.h);
								var c = $("#canvas_layer" + i)[0].getContext("2d");
								c.clearRect(0,0,Pic.w,Pic.h);
								c.drawImage(canvas,0,0,Pic.w,Pic.h);

						//Pic.Layers[i].savedFrame = {index: History.index, data:canvas}
					});
							}
						}
						$("#picture, #picture_shadow").animate({"height":(Pic.h*Yang.zoom ) + "px","top":startY+"px"},150, function(){
							Tools.size.active = 0;
							Yang.drawUnitMarks();
								History.rebase();
							$("#picture_shadow").show();
						});
				});
				
			}
		});
		
		$("#rotate").click(function(){
			if(!Tools.size.active){
				Tools.size.active = 1;
				Tools.size.theta = 0;
				var startCorn = $("#picture").position();
				Tools.size.rotationInterval = setInterval(function(){
					
					if(Tools.size.theta < 90){
						Tools.size.theta+=15;
						$("#picture, #picture_shadow").rotate(Tools.size.theta);
							$("#picture, #picture_shadow").css({
								"left": (Yang.left + Pic.h*Tools.size.theta*Yang.zoom/90) + "px"
							});
						$("#corner_pic_resizer").css("bottom", (-12 + Pic.h*Tools.size.theta*Yang.zoom/90)+"px");
					}else{
						$("#picture, #picture_shadow").css({'-webkit-transform' : '',
					                 '-moz-transform' : '',
					                 '-ms-transform' : '',
					                 'transform' : '',
									'webkit-transform-origin': ''});
						$("#corner_pic_resizer").css("bottom", "-12px");
						Yang.placePic();
						var startX = $("#picture").position().left;
						//$("#picture, #picture_shadow").animate({"width":"0px", "left": (startX +Pic.w*Yang.zoom/2 )+"px" },250, function(){
							 var x = Pic.w;
								Pic.w = Pic.h;
							 Pic.h = x;
							for(var i = 0; i < Pic.Layers.length; i++){
								if(Pic.Layers[i]){
							var canvas = document.createElement('canvas');
							canvas.width = Pic.w;
							canvas.height = Pic.h;
							$(canvas).ready(function(){
								var ctx = canvas.getContext("2d");
									ctx.save();
									ctx.translate(Pic.w,0);
									ctx.rotate(Math.PI/2);
											ctx.drawImage($("#canvas_layer" + i)[0], 0, 0);
									$("#canvas_layer" + i).attr("width", Pic.w).attr("height", Pic.h);
									$("#canvas_layer" + i).ready(function(){
										var c = $("#canvas_layer" + i)[0].getContext("2d");
										c.clearRect(0,0,Pic.w,Pic.h);
										c.drawImage(canvas,0,0,Pic.w,Pic.h);
									});
							});
									}
								}
								$("#top_canvas").attr("width", Pic.w).attr("height", Pic.h);
								$("#picture, #picture_shadow").animate({"width":(Pic.w*Yang.zoom ) + "px","height":(Pic.h*Yang.zoom ) + "px"}, 0, function(){		
									Tools.size.active = 0;
									Yang.drawUnitMarks();
									History.rebase();
									Yang.placePic();
								});
								clearInterval(Tools.size.rotationInterval);
								
					}
				}, 30);
				
			}
		});
	},
	select: function(){
	//	alert("Changing the width, height, or rotating your picture erases the picture's history.");
		
		$('#size_submenu').addClass("expanded_submenu").animate({'width':'60px'}, 100);
		$('#doc_height').val(Pic.h + "px");
		$('#doc_width').val(Pic.w + "px");
		
		$("#left_pic_resizer, #right_pic_resizer, #top_pic_resizer, #bottom_pic_resizer, #corner_pic_resizer").show();
		$("#cursor_canvas").hide();
		$("body").css("cursor","auto");
		$("#picture").css("cursor","move");
	},
	unselect: function(){
		$('#size_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
		$("#left_pic_resizer, #right_pic_resizer, #top_pic_resizer, #bottom_pic_resizer, #corner_pic_resizer").hide();
		$("#cursor_canvas").show();
		$("body").css("cursor","");
		$("#picture").css("cursor","");
		$(".canvas_layer").css({
			"width":"",
			"height":""
		});
		$("#picture").css("overflow","");
	},
	press: function(){
		
		if(Tools.size.hover != "corner_pic_resizer" && Input.x > 0 && Input.x < Pic.w && Input.y > 0 && Input.y < Pic.h){
			Tools.size.hover = "mover";
		}
		
		switch(Tools.size.hover){
			case "mover":
				this.holding = true;
				Main.setCursor();
				this.startGrab = [Input.mouseX,Input.mouseY];
				this.startSpot = [Yang.left, Yang.top];
			break;
			
		}
		
		if(!Tools.size.stretch){
			$(".canvas_layer").css({
				"width":(Pic.w*Yang.zoom) + "px",
				"height":(Pic.h*Yang.zoom) + "px"
			});
			$("#picture").css("overflow","hidden");
		}else{
			$(".canvas_layer").css({
				"width":"",
				"height":""
			});
			$("#picture").css("overflow","");
		}
	},
	hold: function(){
		
		
		
		switch(Tools.size.hover){
			case "mover":
				if(this.holding){
					Yang.left = this.startSpot[0] + Input.mouseX - this.startGrab[0];
					Yang.top = this.startSpot[1] + Input.mouseY - this.startGrab[1];
					Yang.placePic();
				}
			break;
			case "left_pic_resizer":
				if(Pic.w - Input.x < 1*Yang.zoom){
					Input.x = Pic.w-1;
				}
				$("#picture, #picture_shadow").css({
					"width": (Pic.w - Input.x)*Yang.zoom + "px",
					"left": (Input.x*Yang.zoom + Yang.left) + "px"
					});
				if(!Tools.size.stretch){
					$(".canvas_layer").css("left", -Input.x*Yang.zoom + "px");
				}
			break;
			case "top_pic_resizer":
				if(Pic.h - Input.y < 1*Yang.zoom){
					Input.y = Pic.h-1;
				}
				$("#picture, #picture_shadow").css({
					"height": (Pic.h - Input.y)*Yang.zoom + "px",
					"top": (Input.y*Yang.zoom + Yang.top) + "px"
					});
				if(!Tools.size.stretch){
					$(".canvas_layer").css("top", -Input.y*Yang.zoom + "px");
				}
			break;
			case "right_pic_resizer":
				$("#picture, #picture_shadow").css("width", Input.x*Yang.zoom + "px");
			break;
			case "bottom_pic_resizer":
				$("#picture, #picture_shadow").css("height", Input.y*Yang.zoom + "px");
			break;
			case "corner_pic_resizer":
				var ratio = Math.min(Input.x/Pic.w, Input.y/Pic.h);
				$("#picture, #picture_shadow").css({
					"height": Pic.h*ratio*Yang.zoom + "px",
					"width": Pic.w*ratio*Yang.zoom + "px"
					});
			break;
			
		}
		
		if(Tools.size.hover != "mover"){
			$("#doc_width").val(Math.round($("#picture").width()/Yang.zoom) + "px");
			$("#doc_height").val(Math.round($("#picture").height()/Yang.zoom) + "px");
		}
		
	},
	release: function(){
		$(".canvas_layer").css({
			"width":"",
			"height":""
		});
		$("#picture").css("overflow","");
		switch(Tools.size.hover){
			case "mover":
				if(this.holding){
					Yang.left = this.startSpot[0] + Input.mouseX - this.startGrab[0];
					Yang.top = this.startSpot[1] + Input.mouseY - this.startGrab[1];
					Yang.placePic();
				}
			break;
			case "top_pic_resizer":
				if(Pic.h - Input.y < 1*Yang.zoom){
					Input.y = Pic.h-1;
				}
				Yang.top = Input.y*Yang.zoom + Yang.top;
				if(Tools.size.stretch){
					Tools.size.resize(Pic.w,Pic.h - Input.y);
				}else{
					Tools.size.resize(Pic.w,Pic.h - Input.y, 0, -Input.y);
				}
			
				Yang.placePic();
			break;
			case "left_pic_resizer":
				if(Pic.w - Input.x < 1*Yang.zoom){
					Input.x = Pic.w-1;
				}
				Yang.left = Input.x*Yang.zoom + Yang.left;
				if(Tools.size.stretch){
					Tools.size.resize(Pic.w - Input.x,Pic.h);
				}else{
					Tools.size.resize(Pic.w - Input.x,Pic.h, -Input.x);
				}
			
				Yang.placePic();
			break;
			case "right_pic_resizer":
				Tools.size.resize(Input.x,Pic.h);
			break;
			case "bottom_pic_resizer":
				Tools.size.resize(Pic.w, Input.y);
			break;
			case "corner_pic_resizer":
				var ratio = Math.min(Input.x/Pic.w, Input.y/Pic.h);
				Tools.size.resize(Math.round(Pic.w*ratio), Math.round(Pic.h*ratio));
			break;
		}
		this.holding = false;
		Main.setCursor();
		
		if(Tools.size.hover == "corner_pic_resizer"){
			Tools.size.hover = "none";
			if(Math.abs(Input.x - Pic.w) < 8 && Math.abs(Input.y - Pic.h) < 8){
				Tools.size.hover = "corner_pic_resizer";
			}
		}
		
		$("#doc_width").val(Pic.w + "px");
		$("#doc_height").val(Pic.h + "px");
	},
	deletePress: function(){
		var details = {
			tool: "totaldelete",
			layer: Yang.layer
		};
		History.act(details);
		History.add(details);
	}
	
}

Tools.horizontalflip = {
	edge:'deep_left',
	enText:'Flip Horizontally',
	chText:'映横'
}

Tools.verticalflip = {
	edge:'deep_left',
	enText:'Flip Vertically',
	chText:'映上下'
}

Tools.lock = {
	edge:'deep_left',
	enText:'    no stretching',
	chText:'   仍旧图片大小'
}

Tools.stretch = {
	edge:'deep_left',
	enText:'  stretch to fit',
	chText:'  延伸'
}

Tools.rotate = {
	edge:'deep_left',
	enText:'rotate',
	chText:'打转'
}



Tools.size.initSubMenu = function(){
		Menus.addButtonCover(5,93,"size", undefined, "picture_size_button");
		var subMenu = "<input id='doc_height' value='250' style='font-size: 10px;width:40px;height:20px;position:absolute;top:20px;left:0px;border-bottom:1px solid #c4c4c4;'>";
		subMenu += "<input id='doc_width' value='400' style='font-size: 10px;width:40px;height:20px;position:absolute;top:0px;left:0px;'>";
		subMenu += "<canvas id='size_stretch_lock' data-key='lock' class='size_stretch_button menu_minibutton' width='20' height='20' style='position:absolute;top:40px;left:-1px'></canvas>";
		subMenu += "<canvas id='size_stretch' data-key='stretch' class='size_stretch_button menu_minibutton' width='20' height='20' style='position:absolute;top:40px;left:19px'></canvas>";
		subMenu += "<canvas id='rotate' data-key='rotate' class='menu_minibutton' width='20' height='20' style='position:absolute;top:39px;left:39px'></canvas>";
		subMenu += "<canvas id='horizontalflip' data-key='horizontalflip' class='menu_minibutton' width='20' height='20' style='position:absolute;top:-1px;left:39px'></canvas>";
		subMenu += "<canvas id='verticalflip' data-key='verticalflip' class='menu_minibutton' width='20' height='20' style='position:absolute;top:19px;left:39px'></canvas>";
		
		$("#size_submenu").append(subMenu);
		$("#size_submenu").find(".menu_minibutton").each(function(){scaleUp(this);});
		Tools.size.drawCanvases();
		
		
}

Tools.size.initExtras = function(){
	
	var picExtras = "<div id='left_pic_resizer'></div>";
	picExtras += "<div id='right_pic_resizer'></div>";
	picExtras += "<div id='top_pic_resizer'></div>";
	picExtras += "<div id='bottom_pic_resizer'></div>";
	picExtras += "<div id='corner_pic_resizer'></div>";
	$("#picture").append(picExtras);
	
$("#bottom_pic_resizer, #top_pic_resizer, #left_pic_resizer, #right_pic_resizer, #corner_pic_resizer").hover(function(){
	if(!Input.click){
		Tools.size.hover = $(this).attr("id");
	}
}, function(){
	if(!Input.click){
		Tools.size.hover = "none";
	}
	
//	$("#cursor_canvas").show();
});

}

Tools.size.drawCanvases = function(){
		var ctx = $('#size_stretch')[0].getContext('2d');
		Tools.size.drawLock(ctx);
		ctx = $('#size_stretch_lock')[0].getContext('2d');
		Tools.size.drawStretch(ctx);
		ctx = $('#horizontalflip')[0].getContext('2d');
		ctx.translate(1.5,1.5);
		ctx.scale(0.85,0.85);
		OtherIcons.width.draw(ctx);
		ctx = $('#verticalflip')[0].getContext('2d');
		ctx.translate(1.5,1.5);
		ctx.scale(0.85,0.85);
		OtherIcons.height.draw(ctx);
		ctx = $('#rotate')[0].getContext('2d');
		ctx.scale(0.7,0.7);
		ctx.translate(0,-2);
		OtherIcons.rotate.draw(ctx);
		//Tools.horizontalflip.draw(ctx);
		
		/*FontIcons["middleSpace"].draw(ctx);
		ctx = $('#text_doubleSpace_disp')[0].getContext('2d');
		FontIcons["doubleSpace"].draw(ctx);*/
}

var OtherIcons = {
	'rotate': {
		draw: function(ctx){
			
			ctx.translate(30,0);
			ctx.scale(-1,1);
			ctx.beginPath();
			ctx.lineCap = 'butt';
			ctx.strokeStyle = 'black';
			ctx.fillStyle = "black";
			ctx.lineWidth = 2;
			ctx.arc(16, 17, 5, Math.PI * 5 / 4, 3 * Math.PI / 4, 0);
			ctx.arc(16, 17, 10, 3 * Math.PI / 4, 5 * Math.PI / 4, 1);
			ctx.lineTo(6, 6);
			ctx.lineTo(6, 17);
			ctx.lineTo(15, 17);
			ctx.closePath();
			ctx.fill();
		//	ctx.stroke();
		}
	},
	'height' : {
		draw : function(ctx){

		ctx.beginPath();
		ctx.strokeStyle="black";
		ctx.fillStyle="white";
		ctx.lineWidth = 1;
		ctx.rect(0,2,20,16);
		ctx.fill();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(10,5);
		ctx.lineTo(10,15);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.moveTo(7,7);
		ctx.lineTo(13,7);
		ctx.lineTo(10,4);
		ctx.closePath();
		ctx.fill();
		
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.moveTo(7,13);
		ctx.lineTo(13,13);
		ctx.lineTo(10,16);
		ctx.closePath();
		ctx.fill();
		
		}
	},
	'width': {
		draw : function(ctx){

		ctx.beginPath();
		ctx.strokeStyle="black";
		ctx.fillStyle="white";
		ctx.lineWidth = 1;
		ctx.rect(0,2,20,16);
		ctx.fill();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(4,10);
		ctx.lineTo(16,10);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.moveTo(3,10);
		ctx.lineTo(7,13);
		ctx.lineTo(7,7);
		ctx.closePath();
		ctx.fill();
		
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.moveTo(17,10);
		ctx.lineTo(14,13);
		ctx.lineTo(14,7);
		ctx.closePath();
		ctx.fill();
		
		}
	}
}

/*Tools.horizontalflip.draw = function(ctx){
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#4c4c4c";
	ctx.moveTo(5,20);
	ctx.lineTo(20,2);
	ctx.lineTo(20,10);
	ctx.lineTo(80,10);
	ctx.lineTo(80,5);
	ctx.lineTo(95,20);
	ctx.lineTo(80,38);
	ctx.lineTo(80,30)
	ctx.lineTo(20,30);
//	ctx.
	ctx.stroke();
}*/

Tools.size.drawStretch = function(ctx){
	ctx.beginPath();
	ctx.strokeStyle='#000';
	ctx.lineWidth = 4;
	ctx.moveTo(13,11);
	ctx.arc(10,7,3,0,3.14,1);
	ctx.lineTo(7,11);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = "#c4c4c4";
	ctx.moveTo(13,11);
	ctx.arc(10,7,3,0,3.14,1);
	ctx.lineTo(7,11);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = '#a38630';
	ctx.strokeStyle='#000';
	ctx.lineWidth = 2;

	ctx.strokeRect(4,10,12,7);
	ctx.fillRect(4,10,12,7);

	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.arc(10,14,1.5,0,6.3,1);
	ctx.fill();
}

Tools.size.drawLock = function(ctx){
	ctx.beginPath();
	ctx.save();
	ctx.scale(0.66,0.66);
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
	ctx.restore();
}

Tools.size.draw = function(ctx){
	ctx.beginPath();
	ctx.strokeStyle="black";
	ctx.fillStyle="white";
	ctx.lineWidth = 1;
	ctx.rect(4,5,22,20);
	ctx.fill();
	ctx.stroke();


	ctx.save();
	ctx.translate(-1.5,2.5);
	ctx.beginPath();
	ctx.moveTo(10,5);
	ctx.lineTo(10,15);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle="black";
	ctx.moveTo(7,7);
	ctx.lineTo(13,7);
	ctx.lineTo(10,4);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle="black";
	ctx.moveTo(7,13);
	ctx.lineTo(13,13);
	ctx.lineTo(10,16);
	ctx.closePath();
	ctx.fill();
	
	
	ctx.translate(8.5,7.5);
	
	ctx.beginPath();
	ctx.moveTo(4,10);
	ctx.lineTo(16,10);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle="black";
	ctx.moveTo(3,10);
	ctx.lineTo(7,13);
	ctx.lineTo(7,7);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle="black";
	ctx.moveTo(17,10);
	ctx.lineTo(14,13);
	ctx.lineTo(14,7);
	ctx.closePath();
	ctx.fill();
	
	ctx.restore();
};