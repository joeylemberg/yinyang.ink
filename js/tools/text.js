// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

Tools.text = {
	edge:'left',
	enText:' text',
	chText:' 添加文本',
	xOffset: -10,
	yOffset: -5,
	selectable: 1,
	details: null,
	switcher: 0,
	name: "text",
	menuHover: 0,
	init: function(){
		this.initSubMenu();
		$("#text_bold_disp, #text_italic_disp, #text_underline_disp").click(function(){
			$(this).toggleClass("pressed_button");
			Tools.text.refresh();
		});
		
		
		$(".text_spacing_button").click(function(){
			var id = $(this).attr("id");
			Tools.text.lineSpacing = parseInt($(this).attr("data-line-spacing-val"),10)/10;
			if(Tools.text.details)
			Tools.text.details.lineHeight = Tools.text.lineSpacing;
			$(".text_spacing_button").removeClass("pressed_button");
					$(this).addClass("pressed_button");
			
			$("#text_box").css("line-height",Tools.text.lineSpacing);
			Tools.text.refresh();
			setTimeout(function(){$("#text_box").focus()}, 200);
		}).first().trigger("click");
		$(".text_align_button").click(function(){
			var id = $(this).attr("id");
			Tools.text.textAlign = $(this).attr("data-text-align-val");
			if(Tools.text.details)
			Tools.text.details.textAlign = Tools.text.textAlign;
			$(".text_align_button").removeClass("pressed_button");
			$(this).addClass("pressed_button");
			
			$("#text_box").css("text-align",Tools.text.textAlign);
			Tools.text.refresh();
			setTimeout(function(){$("#text_box").focus()}, 200);
		}).first().trigger("click");
		
			$("#text_face").change(function(){
				Tools.text.font = $(this).val();
				$("#text_box").css("font-family",Tools.text.font);
				Tools.text.refresh();
				if(Tools.text.details)
				Tools.text.details.font = Tools.text.font;
				setTimeout(function(){$("#text_box").focus()}, 200);
			});
		
		$("#text_outline_color").change(function(){
			Tools.text.outlineColor = $(this).val();
			Tools.text.refresh();
			if(Tools.text.details)
			Tools.text.details.outlineColor = Tools.text.outlineColor;
			setTimeout(function(){$("#text_box").focus()}, 200);
		}).val("110080").trigger("change");
		
		$("#text_color").change(function(){
			if(Util.isHexColor($(this).val())){
				Tools.text.color = $(this).val();
				Tools.text.refresh();
				if(Tools.text.details)
				Tools.text.details.color = Tools.text.color;
				setTimeout(function(){$("#text_box").focus()}, 200);
			}
	//	}).mouseover(function(){
	//		$("#text_color").trigger("focus");
		}).val("80FF00").trigger("change");
		
		$("#text_submenu").hover(function(){
			Tools.text.menuHover = 1;
		}, function(){
			Tools.text.menuHover = 0;
		});
	},
	select: function(){
		jscolor.xShift = 92;
		this.textInterval = setInterval(function(){
			Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
			if(Tools.text.details){
				Tools.text.details.lines =  $("#text_box").val().replace(/\r?\n/g, '<br />').split("<br />");
				if(Tools.text.switcher){
					
					Tools.text.details.cursorSpot = getCaret($("#text_box")[0]);
					Tools.text.switcher = 0;
				}else{
					delete Tools.text.details.cursorSpot;
					Tools.text.switcher = 1;
				}
				if(Input.overPic){
					$("#text_box").focus();
				}
				Tools.text.details.lineSpacing = Tools.text.lineSpacing;
				History.act(Tools.text.details, Yang.ctx);
			}
			
		},200);
		
	    $('#text_submenu').addClass("expanded_submenu").animate({'width':'92px'}, 100);
	},
	unselect: function(){
		jscolor.xShift = 60;
		clearInterval(this.textInterval);
			Tools.text.finish();
		$('#text_submenu').removeClass("expanded_submenu").animate({'width':'0px'}, 100);
		Tools.text.menuHover = 0;
	},
	refresh: function(){
		var	ctx = $('#text_size_disp')[0].getContext('2d');
			
		ctx.clearRect(0,0,60,30);
			
			ctx.beginPath();
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			
			ctx.fillStyle = '#' + Tools.text.color;
			ctx.strokeStyle = '#' +  Tools.text.outlineColor;
			ctx.lineWidth = Tools.text.outlineSize*2;
			
			Tools.text.font = $('#text_face').val();
			
			var font = font = this.size + "px " + Tools.text.font;
			if($("#text_bold_disp").hasClass("pressed_button")){
				Tools.text.bold = 1;
				font = "bold " + font;
			}else{
				Tools.text.bold = 0;
			}
			if($("#text_italic_disp").hasClass("pressed_button")){
				font = "italic " + font;
				Tools.text.italic = 1;
			}else{
				Tools.text.italic = 0;
			}
			if($("#text_underline_disp").hasClass("pressed_button")){
				Tools.text.underline = 1;
			}else{
				Tools.text.underline = 0;
			}
			ctx.font = font;
			ctx.strokeText("Aa", 5, 23);
			ctx.fillText("Aa", 5, 23);
			
			if(Tools.text.details){
				Tools.text.details.fontFace = Tools.text.font;
				Tools.text.details.fontColor = Tools.text.color;
				Tools.text.details.fontSize = Tools.text.size;
				Tools.text.details.outLineColor = Tools.text.outLineColor;
				Tools.text.details.outlineWidth = Tools.text.outlineSize;
				Tools.text.details.bold = Tools.text.bold;
				Tools.text.details.italic = Tools.text.italic;
				Tools.text.details.underline = Tools.text.underline;
				setTimeout(function(){$("#text_box").focus()}, 200);
			}
			
			
			
			if($("#text_underline_disp").hasClass("pressed_button")){
				ctx.beginPath();
				ctx.lineWidth = this.size/10;
				ctx.strokeStyle = '#' + $('#text_color').val();
				ctx.moveTo(5,24+this.size/10);
				ctx.lineTo(13 + this.size, 24+this.size/10);
				ctx.stroke();
			}
	},
	press: function(){
		
		if(!this.details){
			
		
		var details = {
				tool: 'text',
				x: Input.x,
				y: Input.y,
				lines: [],
				bold : Tools.text.bold,
				italic : Tools.text.italic,
				underline : Tools.text.underline,
				textAlign : Tools.text.textAlign,
				lineHeight : Tools.text.lineSpacing,
				fontFace : Tools.text.font,
				fontSize : Tools.text.size,
				fontColor : Tools.text.color,
				outlineColor : Tools.text.outlineColor,
				outlineWidth : Tools.text.outlineSize,
				layer: Yang.layer
		};
		
		this.details = details;
		var textBoxStr = '<textarea id="text_box" class="text_box active_text_box" ';
		textBoxStr += 'style="position:absolute;z-index:9999;overflow:hidden;line-height:' + Tools.text.lineHeight + ';top:-1000;left:-1000;"></textarea>';
		$("#picture").append(textBoxStr);
	}else{
		Tools.text.finish();
		Tools.text.press();
	}
	},
	finish: function(){
		if(Tools.text.details){
			$("#text_box").remove();
			delete Tools.text.details.cursorSpot;
			History.act(Tools.text.details);
			if(Tools.text.details.lines.length > 0 && Tools.text.details.lines[0].length > 0){
				History.add($.extend({},Tools.text.details));
			}
			Tools.text.details = null;
		}
	},
	hold: function(){
		
	},
	release: function(){
		if($("#text_box").length && !$("#text_box").val().length){
				$("#text_box").focus();
		}
	
	}
}

Tools.text.act = function(ctx,d){
	
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.fillStyle = '#' + d.fontColor;
	ctx.strokeStyle = '#' + d.fontColor;
	ctx.lineWidth = d.fontSize / 10;
	
	var font = font = d.fontSize + "px " + d.fontFace;
	if(d.bold){
		font = "bold " + font;
	}
	if(d.italic){
		font = "italic " + font;
	}
	ctx.font = font;
	
	ctx.font = font;
	ctx.textAlign = d.textAlign;

	ctx.beginPath();
	ctx.lineWidth = d.outlineWidth;
	ctx.strokeStyle = "#" + d.outlineColor;
	
	var j = 0;
	var shortString;
	var fullString;
	
	ctx.save();
	if(is_firefox){
		ctx.translate(2,4);
	}else{
		ctx.translate(3,0);
	}
	
	var longestLine = 0;
	for(var i = 0; i < d.lines.length; i++){
		longestLine = Math.max(longestLine,ctx.measureText(d.lines[i]).width);
	}
	d.w = longestLine;
	
	var charsToCursor = -1;
	if(d.cursorSpot != undefined){
		charsToCursor = d.cursorSpot;
		for(var i = 0; i < d.lines.length; i++){
			if(charsToCursor > d.lines[i].length){
				charsToCursor -= d.lines[i].length;
				charsToCursor--;
			}else{
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = "#" + d.fontColor;
				
				
				
				var xSpace;
				switch (d.textAlign){
					case "left":
						xSpace = d.x + ctx.measureText(d.lines[i].substring(0,charsToCursor)).width;
					break;
					case "right":
						xSpace = d.x + d.w - ctx.measureText(d.lines[i].substring(0,d.lines[i].length-charsToCursor)).width;
					break;
					case "center":
						xSpace = d.x + ctx.measureText(d.lines[i].substring(0,charsToCursor)).width + (d.w-ctx.measureText(d.lines[i]).width)/2;// + 0.5*(d.w-ctx.measureText(d.lines[i]));
					break;
				}
				ctx.moveTo(xSpace, d.y+d.fontSize*d.lineHeight*(i));
				ctx.lineTo(xSpace, d.y+d.fontSize*d.lineHeight*(i+1));
				ctx.stroke();
				ctx.beginPath();
				ctx.lineWidth = 1;
				
				ctx.strokeStyle = "#" + d.outlineColor;
				ctx.moveTo(xSpace, d.y+d.fontSize*d.lineHeight*(i));
				ctx.lineTo(xSpace, d.y+d.fontSize*d.lineHeight*(i+1));
				ctx.stroke();
				ctx.restore();
				i = d.lines.length;
			}
		}
		
	}
	if(d.textAlign == "center"){
		ctx.translate(d.w/2,0);
	}else if(d.textAlign == "right"){
		ctx.translate(d.w,0);
	}
	
	for(var i = 0; i < d.lines.length; i++){
		fullString = d.lines[i];
		shortString = "";
		
			while(ctx.measureText(fullString).width > d.w){
				for(k = 0; k < d.lines[i].length; k++){
					if(ctx.measureText(fullString.substring(0,k+1)).width > d.w){
						shortString = fullString.substring(0,k);
						break;
					}
				}
				if(d.outlineWidth > 0){
					ctx.strokeText(shortString, d.x,d.y+d.fontSize*d.lineHeight*(i+j+0.5) + d.fontSize/3);//+d.lineHeight-1));
				}
				ctx.fillText(shortString, d.x,d.y+d.fontSize*d.lineHeight*(i+j+0.5) + d.fontSize/3);//+d.lineHeight-1));
				fullString = fullString.substring(k);
				j++;
			}
			
			if(d.outlineWidth > 0){
				ctx.strokeText(fullString, d.x,d.y+d.fontSize*d.lineHeight*(i+j+0.5) + d.fontSize/3);//+d.lineHeight-1));
			}
			ctx.fillText(fullString, d.x,d.y+d.fontSize*d.lineHeight*(i+j+0.5) + d.fontSize/3);//+d.lineHeight-1));
			
	}
	
	
	ctx.restore();
	ctx.stroke();
	if(d.underline){
		ctx.beginPath;
		ctx.strokeStyle = "#" + d.outlineColor;
		ctx.lineWidth = d.fontSize / 12;
		for(var i = 0; i < d.lines.length; i++){
			switch(d.textAlign){
				case "left":
					ctx.moveTo(d.x, d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
					ctx.lineTo(d.x + ctx.measureText(d.lines[i]).width,  d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
				break;
				case "center":
				var space = d.w - ctx.measureText(d.lines[i]).width;
					ctx.moveTo(d.x+space/2, d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
					ctx.lineTo(d.x + d.w - space/2,  d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
				break;
				case "right":
					ctx.moveTo(d.x+d.w, d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
					ctx.lineTo(d.x +d.w - ctx.measureText(d.lines[i]).width,  d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
				break;
				
				
			}
			

		}
		ctx.stroke();
		ctx.beginPath;
		ctx.strokeStyle = "#" + d.fontColor;
		ctx.lineWidth = d.fontSize / 18;
		for(var i = 0; i < d.lines.length; i++){
		switch(d.textAlign){
			case "left":
				ctx.moveTo(d.x, d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
				ctx.lineTo(d.x + ctx.measureText(d.lines[i]).width,  d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
			break;
			case "center":
			var space = d.w - ctx.measureText(d.lines[i]).width;
				ctx.moveTo(d.x+space/2, d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
				ctx.lineTo(d.x + d.w - space/2,  d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
			break;
			case "right":
				ctx.moveTo(d.x+d.w, d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
				ctx.lineTo(d.x +d.w - ctx.measureText(d.lines[i]).width,  d.y+d.fontSize*d.lineHeight*(i+j+0.65) + d.fontSize/3);
			break;
			
			
		}
		}
		ctx.stroke();
	}
}

Tools.text.initSubMenu = function(ctx){
	Menus.addButtonCover(5,264,"text");
	var subMenu = "<input id='text_color' class='color jl_color'  value='000000' style='width:92px;position:absolute;top:0px;left:0px;padding-left:5px;height:20px;'/>";
		subMenu += "<select id='text_face' class='jl_minimal_input' style='position:absolute;top:20px;left:-3px;background-color:white;width:96px;font-size:10px;height:15px;'><option>Courier New</option><option>Arial</option><option>Times</option><option>Comic Sans MS</option><option>Symbol</option><option>Verdana</option></select>";
		subMenu += "<canvas id='text_size_disp' width='60' height='30' style='position:absolute;top:35px;left:1px;background-color:white;'></canvas>";
		subMenu += "<input id='text_size' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:35px;height:22px;margin:0px;position:absolute;top:35px;left:56px;font-size:10px;height:30px;'/>";
		subMenu += "<canvas id='text_size_slider' class='yang_slider' width='90' height='10' style='position:absolute;top:65px;left:1px;'></canvas>";
		subMenu += "<input id='text_outline_color' class='color jl_color'  value='F7F7F7' style='width:61px;position:absolute;top:85px;left:1px;padding-left:5px;height:20px;'/>";
		subMenu += "<canvas id='text_outline_slider' class='yang_slider' width='60' height='10' style='position:absolute;top:75px;left:1px;'></canvas>";		
		subMenu += "<input id='text_outline' class='yang_integer' type='text' min='0' max='1000' step='1'  style='width:35px;height:32px;margin:0px;position:absolute;top:75px;left:56px;font-size:10px;'/>";
		subMenu += "<canvas class='menu_minibutton' id='text_bold_disp' width='30' height='30' style='position:absolute;top:105px;left:0px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton' id='text_italic_disp' width='30' height='30' style='position:absolute;top:105px;left:30px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton' id='text_underline_disp' width='30' height='30' style='position:absolute;top:105px;left:60px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton text_spacing_button' data-line-spacing-val='10' id='text_singleSpace_disp' width='30' height='30' style='position:absolute;top:135px;left:0px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton text_spacing_button' data-line-spacing-val='15' id='text_middleSpace_disp' width='30' height='30' style='position:absolute;top:135px;left:30px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton text_spacing_button' data-line-spacing-val='20' id='text_doubleSpace_disp' width='30' height='30' style='position:absolute;top:135px;left:60px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton text_align_button pressed_button' data-text-align-val='left' id='text_alignLeft_disp' width='30' height='30' style='position:absolute;top:165px;left:0px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton text_align_button' data-text-align-val='center' id='text_alignCenter_disp' width='30' height='30' style='position:absolute;top:165px;left:30px;'></canvas>";
		subMenu += "<canvas class='menu_minibutton text_align_button' data-text-align-val='right' id='text_alignRight_disp' width='30' height='30' style='position:absolute;top:165px;left:60px;'></canvas>";
$("#text_submenu").append(subMenu);
$("#text_submenu").find(".menu_minibutton").each(function(){scaleUp(this);});
FontIcons.init();
}


Tools.text.draw = function(ctx){
	
	
	ctx.save();
			ctx.translate(-0.5,-3);
			ctx.scale(1.1,1.2);
	
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'white';
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(4, 9);
	ctx.lineTo(6, 9);
	ctx.lineTo(7, 10);
	ctx.lineTo(7, 20);
	ctx.lineTo(8, 22);
	ctx.lineTo(10, 22);

	ctx.moveTo(4, 22);
	ctx.lineTo(6, 22);
	ctx.lineTo(7, 20);
	ctx.lineTo(7, 10);
	ctx.lineTo(8, 9);
	ctx.lineTo(10, 9);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.font = 'Bold 15pt Courier New';
	ctx.fillText('T', 12, 22);
	ctx.restore();
	
};

var FontIcons = {
	init : function(){
				var ctx = $('#text_singleSpace_disp')[0].getContext('2d');
				FontIcons["singleSpace"].draw(ctx);
				ctx = $('#text_middleSpace_disp')[0].getContext('2d');
				FontIcons["middleSpace"].draw(ctx);
				ctx = $('#text_doubleSpace_disp')[0].getContext('2d');
				FontIcons["doubleSpace"].draw(ctx);
				
				ctx = $('#text_alignLeft_disp')[0].getContext('2d');
				FontIcons["alignLeft"].draw(ctx);
				ctx = $('#text_alignCenter_disp')[0].getContext('2d');
				FontIcons["alignCenter"].draw(ctx);
				ctx = $('#text_alignRight_disp')[0].getContext('2d');
				FontIcons["alignRight"].draw(ctx);	
			
				ctx = $('#text_bold_disp')[0].getContext('2d');
				FontIcons["bold"].draw(ctx);
				ctx = $('#text_italic_disp')[0].getContext('2d');
				FontIcons["italic"].draw(ctx);
				ctx = $('#text_underline_disp')[0].getContext('2d');
				FontIcons["underline"].draw(ctx);
					
	},
	"bold" : {
		draw : function(ctx){
			ctx.beginPath();
			ctx.strokeStyle='#c4c4c4';
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);
		
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.font = "bold 14pt Times";
		ctx.fillText("B", 9, 22);
		ctx.fillText("B", 10, 22);
		}
	},
	"italic" : {
		draw : function(ctx){
			ctx.beginPath();
			ctx.strokeStyle='#c4c4c4';
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);
			
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.moveTo(18, 10);
			ctx.lineTo(12, 20);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.moveTo(15, 10);
			ctx.lineTo(21, 10);
			ctx.stroke();
			ctx.moveTo(9, 20);
			ctx.lineTo(15, 20);
			ctx.stroke();
		}
	},
	"underline" : {
		draw : function(ctx){
			ctx.beginPath();
			ctx.strokeStyle='#c4c4c4';
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);
			
			
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.font = "13pt Times";
			ctx.fillText("U", 9, 19);

			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.moveTo(9, 22);
			ctx.lineTo(21, 22);
			ctx.stroke();
			ctx.restore();
		}
	},
	"singleSpace" : {
		draw: function(ctx){
			ctx.strokeStyle = "#c4c4c4";
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);

			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.moveTo(7,7);
			ctx.lineTo(21,7);
			ctx.moveTo(7,9);
			ctx.lineTo(23,9);
			ctx.moveTo(7,11);
			ctx.lineTo(14,11);
			ctx.moveTo(7,13);
			ctx.lineTo(24,13);
			ctx.moveTo(7,15);
			ctx.lineTo(20,15);
			ctx.moveTo(7,17);
			ctx.lineTo(12,17);
			ctx.stroke();
		}
	},
	"middleSpace" : {
		draw: function(ctx){
			ctx.beginPath();
			ctx.strokeStyle = "#c4c4c4";
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);

			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			
			ctx.moveTo(7,7);
			ctx.lineTo(21,7);
			ctx.moveTo(7,10);
			ctx.lineTo(23,10);
			ctx.moveTo(7,13);
			ctx.lineTo(14,13);
			ctx.moveTo(7,16);
			ctx.lineTo(24,16);
			ctx.moveTo(7,19);
			ctx.lineTo(20,19);
			ctx.moveTo(7,22);
			ctx.lineTo(12,22);
			ctx.stroke();
		}
	},
	"doubleSpace" : {
		draw: function(ctx){
			ctx.beginPath();
			ctx.strokeStyle = "#c4c4c4";
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);
			
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;

			ctx.moveTo(7,7);
			ctx.lineTo(21,7);
			ctx.moveTo(7,11);
			ctx.lineTo(23,11);
			ctx.moveTo(7,15);
			ctx.lineTo(14,15);
			ctx.moveTo(7,19);
			ctx.lineTo(24,19);
			ctx.moveTo(7,23);
			ctx.lineTo(20,23);
			ctx.stroke();
		}
	},
	"alignLeft" : {
		draw: function(ctx){
			ctx.beginPath();
			ctx.strokeStyle = "#c4c4c4";
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);
			
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.moveTo(7,7);
			ctx.lineTo(21,7);
			ctx.moveTo(7,10);
			ctx.lineTo(23,10);
			ctx.moveTo(7,13);
			ctx.lineTo(14,13);
			ctx.moveTo(7,16);
			ctx.lineTo(24,16);
			ctx.moveTo(7,19);
			ctx.lineTo(20,19);
			ctx.moveTo(7,22);
			ctx.lineTo(12,22);
			ctx.stroke();
		}
	},
	"alignCenter" : {
		draw: function(ctx){
			ctx.beginPath();
			ctx.strokeStyle = "#c4c4c4";
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);
			
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.moveTo(9,7);
			ctx.lineTo(21,7);
			ctx.moveTo(8,10);
			ctx.lineTo(22,10);
			ctx.moveTo(12,13);
			ctx.lineTo(18,13);
			ctx.moveTo(7,16);
			ctx.lineTo(23,16);
			ctx.moveTo(8,19);
			ctx.lineTo(22,19);
			ctx.moveTo(13,22);
			ctx.lineTo(17,22);
			ctx.stroke();
		}
	},
	"alignRight" : {
		draw: function(ctx){
			ctx.beginPath();
			ctx.strokeStyle = "#c4c4c4";
			ctx.lineWidth = 0.5;
			ctx.strokeRect(4,4,22,22);
			
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.moveTo(23,7);
			ctx.lineTo(9,7);
			ctx.moveTo(23,10);
			ctx.lineTo(7,10);
			ctx.moveTo(23,13);
			ctx.lineTo(16,13);
			ctx.moveTo(23,16);
			ctx.lineTo(6,16);
			ctx.moveTo(23,19);
			ctx.lineTo(10,19);
			ctx.moveTo(23,22);
			ctx.lineTo(18,22);
			ctx.stroke();
		}
	}
}

function getCaret(el) { 
  if (el.selectionStart) { 
    return el.selectionStart; 
  } else if (document.selection) { 
    el.focus(); 

    var r = document.selection.createRange(); 
    if (r == null) { 
      return 0; 
    } 

    var re = el.createTextRange(), 
        rc = re.duplicate(); 
    re.moveToBookmark(r.getBookmark()); 
    rc.setEndPoint('EndToStart', re); 

    return rc.text.length; 
  }  
  return 0;
};