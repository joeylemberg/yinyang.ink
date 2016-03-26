var Main = {
	
	cursorCtx: null,	
	buttonHold: null,
	wind: null,
	
	setCursor: function(){
		Main.cursorCtx.restore();
		Main.cursorCtx.clearRect(0,0,40,30);
		if(!Yang.tool.selectable){
			$("#desktop").css("cursor","auto");
		}else{
			$("#desktop").css("cursor","");
			Yang.tool.draw(Main.cursorCtx);
		}
		Main.cursorCtx.save();
	},
	drawCursor: function(toolName){
		Main.cursorCtx.restore();
		Main.cursorCtx.clearRect(0,0,40,30);
		if(toolName == undefined && Yang.tool){
			Yang.tool.draw(Main.cursorCtx);
		}else{
			Tools[toolName].draw(Main.cursorCtx);
		}
			
		Main.cursorCtx.save();
	},
	initEvents : function(){
		
		Tools.upload.init();
		Main.wind = window;
		
		Main.spot = this.wind.location;
		
		$('canvas').attr('unselectable','on');

		$('#copyright_canvas').click(function(){
			window.open("https://github.com/joeylemberg/yinyangpaint", '_blank');
		});

		$("#title_menu").click(function(){
			$(".button_cover").each(function(){
				if($(this).attr("data-key") == "about"){
					$(this).trigger("click");
				}
			});
		});
		
		
		this.box = Main.spot.host;
		
		$('.button_cover').bind("touchstart click", function(){
			
			var clicked = Tools[$(this).attr("data-key")];
			
			if(Tools.sortlayers.enabled && $(this).attr("data-key") != "sortlayers"){
				Tools.sortlayers.unselect();
			}
			
			if(is_mobile){
					clicked.click(1);
			}if(clicked == undefined){
				Yang.tool.unselect();
				$(".active_button_cover").removeClass("active_button_cover");
				clicked = "pencil";
			}else if(clicked.selectable){
				if(Yang.tool && Yang.tool.unselect != undefined){
					Yang.tool.unselect(clicked);
				}
				$(".active_button_cover").removeClass("active_button_cover");
				$(this).addClass("active_button_cover");
				Yang.toolName = $(this).attr("data-key");
				Yang.tool = clicked;
				Yang.tool.select();
				Main.setCursor();
			}else{
				clicked.click(1);
			}
			
		}).mousedown(function(){
			var clicked = Tools[$(this).attr("data-key")];
				if(clicked != undefined && clicked.holdable != undefined && clicked.holdable){
					Main.buttonHold = setInterval(function(){
						clicked.click();
					}, 30);
				}
		}).mouseleave(function(){
			clearInterval(Main.buttonHold);
		}).mouseup(function(){
			clearInterval(Main.buttonHold);
		});
	},
	initCanvases: function(){
		Main.cursorCtx = $('#cursor_canvas')[0].getContext('2d');
		Main.cursorCtx.save();
		Yang.ctx = $("#top_canvas")[0].getContext("2d");
		Yang.sname = "yangcanvas.com";
		var copyCtx = $("#copyright_canvas")[0].getContext("2d");

			copyCtx.beginPath();
			copyCtx.lineJoin = "round";
			copyCtx.beginPath();
			copyCtx.strokeStyle = '#c4c4c4';
			copyCtx.fillStyle = 'black';
			copyCtx.font = 'bold 10px Courier';
			copyCtx.lineWidth = 2;
			copyCtx.strokeText("☯ YinYangPaint Version 0.2   © 2016 Joey Lemberg", 5,11);
			copyCtx.fillText("☯ YinYangPaint Version 0.2   © 2016 Joey Lemberg", 5,11);
			copyCtx.strokeText("This project is open sourced with the MIT license", 5,22);
			copyCtx.fillText("This project is open sourced with the MIT license", 5,22);
	}
};