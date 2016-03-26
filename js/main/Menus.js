// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

var Menus = {
	bgGradient: null,
	init: function(){
		this.initGradient();
		
		//this.drawUserMenu();
			//UserBox.init();
		
		this.drawTitleMenu();
		
		this.drawSizeMenu();
			Tools.size.init();
		
		this.drawFileMenu();
			Tools.file.init();
		
		this.drawViewMenu();
		
		this.drawSettingsMenu();
			Tools.settings.init();
			Tools.about.init();
			
		this.drawFiltersMenu();
			Tools.filters.init();
		
		this.drawPaintMenu();
			Tools.pencil.init();
			Tools.brush.init();
			Tools.eraser.init();
		
		this.drawTextMenu();
			Tools.zoom.init();
			Tools.grabber.init();
			Tools.text.init();
			
		this.drawSelectorMenu();
			Tools.selectbox.init();
			Tools.selectfree.init();
			Tools.magicwand.init();
			Tools.smudge.init();
			Tools.dropper.init();
			
		this.drawHistoryMenu();
		
		this.drawLayerMenu();
			Tools.layers.init();
			
		this.drawClipboardMenu();
			Tools.clipboard.init();
		
			$(".x_box").each(function(){
				var ctx = this.getContext("2d");
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = "#000000";
				ctx.moveTo(4,4);
				ctx.lineTo(16,16);
				ctx.moveTo(4,16);
				ctx.lineTo(16,4);
				ctx.stroke();
			});
			
			$(".x_box").click(function(){
				switch($(this).attr("id")){
					case "user_box_x_box":
						UserBox.hideBox();
					break;
					
					default:
						$(this).parent().fadeOut();
					break;
				}
			});
			
		if(Config.helperText){
			this.initHelperText();	
		}
		
	},
	addButtonCover: function(left,top,key,fromRight, coverId, fromBottom){
		var buttonCover = "<div data-key='" + key + "' class='button_cover' ";
		if(coverId != undefined){
			buttonCover += "id='" + coverId + "' ";
		}
		buttonCover += "style='";
		if(fromRight == undefined){
			buttonCover += "left:" + left + "px;";
		}else{
			buttonCover += "right:" + left + "px;";
		}
		if(fromBottom == undefined){
			buttonCover += "top:" + top + "px;";
		}else{
			buttonCover += "bottom:" + top + "px;";
		}
		buttonCover += "'></div>";
		$("#biggest_div").append(buttonCover);
	},
	initGradient: function(){
		this.bgGradient = document.createElement('canvas');
		this.bgGradient.width = 1000;
		this.bgGradient.height = 1000;
		var ctx = this.bgGradient.getContext("2d");
		var gradient = ctx.createLinearGradient(0, 500, 800, 0);
		gradient.addColorStop(0, '#ffd28e');
		gradient.addColorStop(0.1, '#ffbb47');
		gradient.addColorStop(0.2, '#fc9b00');
		gradient.addColorStop(0.3, '#ffc877');
		gradient.addColorStop(0.4, '#ffbb47');
		gradient.addColorStop(0.5, '#ffbb47');
		gradient.addColorStop(0.6, '#ffd28e');
		gradient.addColorStop(0.7, '#fc9b00');
		gradient.addColorStop(0.8, '#ffc877');
		gradient.addColorStop(0.9, '#ffc877');
		gradient.addColorStop(1, '#ffbb47');
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0,800,800);
	},
	silverGrad: function(ctx){
		
		var gradient = ctx.createLinearGradient(0, 400, 400, 0);
		gradient.addColorStop(0, '#7c7c7c');
		gradient.addColorStop(0.1, '#595959');
		gradient.addColorStop(0.2, '#9b9b9b');
		gradient.addColorStop(0.3, '#c4c4c4');
		gradient.addColorStop(0.4, '#707070');
		gradient.addColorStop(0.5, '#999999');
		gradient.addColorStop(0.6, '#303030');
		gradient.addColorStop(0.7, '#707070');
		gradient.addColorStop(0.8, '#898989');
		gradient.addColorStop(0.9, '#9b9b9b');
		gradient.addColorStop(1, '#303030');
		
		return 	gradient;
		
	},
	whiteSilverGrad: function(ctx){
		
		var gradient = ctx.createLinearGradient(0, 400, 210, 0);
		gradient.addColorStop(0, '#e2e2e2');
		gradient.addColorStop(0.2, '#efefef');
		gradient.addColorStop(0.4, '#f9f9f9');
		gradient.addColorStop(0.8, '#e0e0e0');
		gradient.addColorStop(1, '#efefef');
		
		return 	gradient;
		
	},
	drawUserMenu:function(){
		ctx = $('#user_menu')[0].getContext('2d');
			ctx.beginPath();
			ctx.moveTo(2,0);
			ctx.lineTo(2,193);
			ctx.quadraticCurveTo(2,198,7,198);
			ctx.lineTo(300,198);
			ctx.lineTo(300,0);
			ctx.closePath();
			ctx.strokeStyle=Menus.silverGrad(ctx);
			ctx.lineWidth = 2;
			ctx.save();
			ctx.clip();
			ctx.drawImage(this.bgGradient,-1,-2);
			ctx.restore();
			ctx.stroke();
	},
	drawTitleMenu: function(){
		var ctx = $('#title_menu')[0].getContext('2d');
		//title menu
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(0,75);
		ctx.lineTo(205,75);
		ctx.quadraticCurveTo(215,75,215,65);
		ctx.lineTo(215,0);
		ctx.closePath();
		ctx.strokeStyle = Menus.silverGrad(ctx);
		ctx.lineWidth = 2;	
		ctx.save();
		ctx.clip();
		ctx.drawImage(this.bgGradient,-1,-2);
		ctx.restore();
		
		ctx.stroke();
		ctx.translate(10,10);
		ctx.scale(0.68,0.68);	
		Tools.yinyang.draw(ctx);
		ctx.beginPath();
		ctx.lineJoin = "round";
		
		//title text
		ctx.lineWidth = 8;
		ctx.fillStyle = 'black';
		ctx.strokeStyle = this.whiteSilverGrad(ctx);
		ctx.font = 'bold 26px Courier';
		//gaton
		//ctx.translate(0,20);
		//this.home = window.location;
		ctx.lineWidth = 5;
		ctx.strokeText('YinYangPaint',100,70);
		ctx.fillText('YinYangPaint',100,70);
		ctx.beginPath();
		ctx.lineWidth = 6;
		ctx.font = 'bold 36px Courier';
		ctx.strokeText('阴阳画',99,34);
		ctx.fillText('阴阳画',99,34);
		//subtitle text
			//阴阳画
	/*	ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.strokeStyle = this.whiteSilverGrad(ctx);
		ctx.font = 'bold 17px Courier';
		ctx.lineWidth = 5;
		ctx.strokeText('HTML5 Image Editor',100,43);
		ctx.fillText('HTML5 Image Editor',100,43);*/
		
		/*ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.strokeStyle = this.whiteSilverGrad(ctx);
		ctx.font = 'bold 17px Courier';
		ctx.lineWidth = 4;
		ctx.strokeText("HTML5 Image Editor",100,65);
		ctx.fillText("HTML5 Image Editor",100,65);*/
		//ctx.strokeText('阳画 图像编辑器',100,68);
		//ctx.fillText('阳画 图像编辑器',100,68);
	
	},
	drawSizeMenu: function(){
		var ctx = $('#pic_size_menu')[0].getContext('2d');
		//text menu
		ctx.beginPath();
		ctx.moveTo(0,2);
		ctx.lineTo(35,2);
		ctx.quadraticCurveTo(40,2,40,7);
		ctx.lineTo(40,37);
		ctx.quadraticCurveTo(40,42,35,42);
		ctx.lineTo(0,42);
		ctx.closePath();
		silverGrad = Menus.silverGrad(ctx);
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.save();
		ctx.clip();
		ctx.drawImage(this.bgGradient,0,-100);
		ctx.restore();
		ctx.stroke();
		//text
		ctx.translate(5,7);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.size.draw(ctx);
	},
	drawFileMenu: function(){
		var ctx = $('#file_menu')[0].getContext('2d');
		silverGrad = Menus.silverGrad(ctx);
		ctx.strokeStyle=silverGrad;
			ctx.beginPath();
			ctx.moveTo(2,0);
			ctx.lineTo(2,55);
			ctx.quadraticCurveTo(2,60,7,60);
			ctx.lineTo(127,60);
			ctx.quadraticCurveTo(132,60,132,55);
			ctx.lineTo(132,0);
			ctx.closePath();
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;			
			ctx.save();
			ctx.clip();
			ctx.drawImage(this.bgGradient,0,-100);
			ctx.restore();
		ctx.stroke();

		ctx.translate(7,5);

		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.openfile.draw(ctx);
		ctx.translate(30,0);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.savefile.draw(ctx);
		ctx.translate(30,0);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.newfile.draw(ctx);
		ctx.translate(30,0);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.downloadfile.draw(ctx);
	},
	drawViewMenu: function(){
		var ctx = $('#view_menu')[0].getContext('2d');
		silverGrad = Menus.silverGrad(ctx);
			ctx.beginPath();
			ctx.moveTo(2,0);
			ctx.lineTo(2,35);
			ctx.quadraticCurveTo(2,40,7,40);
			ctx.lineTo(30,40);
			ctx.quadraticCurveTo(36,40,36,46);
			
			
			ctx.lineTo(126,46);
			ctx.quadraticCurveTo(126,40,132,40);
			ctx.lineTo(137,40);
			ctx.quadraticCurveTo(142,40,142,35);
			ctx.lineTo(142,0);
			ctx.closePath();
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;
			
			ctx.save();
			ctx.clip();
		ctx.drawImage(this.bgGradient,0,-100);
		ctx.restore();
		ctx.stroke();

		ctx.translate(7,5);

		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.grabber.draw(ctx)
		ctx.translate(30,0);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.zoomin.draw(ctx);
		ctx.translate(30,0);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.zoomout.draw(ctx);
	},
	drawSettingsMenu: function(){
		var ctx = $('#settings_menu')[0].getContext('2d');
		silverGrad = Menus.silverGrad(ctx);
			ctx.beginPath();
			ctx.moveTo(2,0);
			ctx.lineTo(2,35);
			ctx.quadraticCurveTo(2,40,7,40);
			ctx.lineTo(67,40);
			ctx.quadraticCurveTo(72,40,72,35);
			ctx.lineTo(72,0);
			ctx.closePath();
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;
			ctx.save();
			ctx.clip();
			ctx.drawImage(this.bgGradient,-1,-2);
			ctx.restore();
			ctx.stroke();

		ctx.beginPath();
		ctx.translate(7,5);
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.settings.draw(ctx);
		ctx.beginPath();
		ctx.translate(30,0);
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.about.draw(ctx);
	},
	drawFiltersMenu: function(){
		var ctx = $('#filters_menu')[0].getContext('2d');
		silverGrad = Menus.silverGrad(ctx);
			ctx.beginPath();
			ctx.moveTo(2,0);
			ctx.lineTo(2,35);
			ctx.quadraticCurveTo(2,40,7,40);
			ctx.lineTo(37,40);
			ctx.quadraticCurveTo(42,40,42,35);
			ctx.lineTo(42,0);
			ctx.closePath();
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;
			ctx.save();
			ctx.clip();
			ctx.drawImage(this.bgGradient,-1,-2);
			ctx.restore();
			ctx.stroke();

		ctx.beginPath();
		ctx.translate(7,5);
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.filters.draw(ctx);
		ctx.beginPath();
	},
	drawPaintMenu: function(){
		var ctx = $('#paint_menu')[0].getContext('2d');
		//paint menu
		ctx.beginPath();
		ctx.moveTo(0, 2);
		ctx.lineTo(35, 2);
		ctx.quadraticCurveTo(40, 2, 40, 7);
		ctx.lineTo(40, 97);
		ctx.quadraticCurveTo(40, 102, 35, 102);
		ctx.lineTo(0, 102);
		ctx.closePath();
		silverGrad = Menus.silverGrad(ctx);
		ctx.strokeStyle = silverGrad;
		ctx.lineWidth = 2;
		ctx.save();
		ctx.clip();
		ctx.drawImage(this.bgGradient, 0, -100);
		ctx.restore();
		ctx.stroke();
		//pencil
		ctx.translate(5,7);	
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.pencil.draw(ctx);
		//brush
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.brush.draw(ctx);
		//eraser
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.eraser.draw(ctx);
	},
	drawTextMenu: function(){
		var ctx = $('#text_menu')[0].getContext('2d');
		//text menu
		ctx.beginPath();
		ctx.moveTo(0,2);
		ctx.lineTo(35,2);
		ctx.quadraticCurveTo(40,2,40,7);
		ctx.lineTo(40,37);
		ctx.quadraticCurveTo(40,42,35,42);
		ctx.lineTo(0,42);
		ctx.closePath();
		silverGrad = Menus.silverGrad(ctx);
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.save();
		ctx.clip();
		ctx.drawImage(this.bgGradient,0,-100);
		ctx.restore();
		ctx.stroke();
		//text
		ctx.translate(5,7);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.text.draw(ctx);
	},
	drawSelectorMenu: function(){
		var ctx = $('#selector_menu')[0].getContext('2d');
		silverGrad = Menus.silverGrad(ctx);
			ctx.beginPath();
			ctx.moveTo(0,2);
			ctx.lineTo(35,2);
			ctx.quadraticCurveTo(40,2,40,7);
			ctx.lineTo(40,157);
			ctx.quadraticCurveTo(40,162,35,162);
			ctx.lineTo(0,162);
			ctx.strokeStyle=silverGrad;
			ctx.closePath();
			ctx.lineWidth = 2;
			ctx.save();
			ctx.clip();
		ctx.drawImage(this.bgGradient,0,-100);
		ctx.restore();
		ctx.stroke();

		ctx.translate(5,7);

		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.selectbox.draw(ctx);
		
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.selectfree.draw(ctx);
		
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.magicwand.draw(ctx);
		
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.smudge.draw(ctx);
		
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.dropper.draw(ctx);
	},
	drawHistoryMenu: function(){
		var ctx = $('#history_menu')[0].getContext('2d');
		silverGrad = Menus.silverGrad(ctx);
				ctx.beginPath();
				ctx.translate(-40,0);
				ctx.moveTo(200,2);
				ctx.lineTo(125,2);
				ctx.quadraticCurveTo(120,2,120,7);
				ctx.quadraticCurveTo(120,35,87,35);
				ctx.lineTo(47,35);
				//ctx.bezierCurveTo(120,35,97,35,7,35);
				ctx.quadraticCurveTo(42,35,42,40);
				ctx.lineTo(42,193);
				ctx.quadraticCurveTo(42,198,47,198);
				ctx.lineTo(200,198);
				ctx.closePath();
				ctx.strokeStyle=silverGrad;
				ctx.lineWidth = 2;
				ctx.save();
				ctx.clip();
				ctx.drawImage(this.bgGradient,0,-100);
				ctx.restore();
				ctx.stroke();
				
				
		
		
		ctx.translate(128,10);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.undo.draw(ctx);
		ctx.translate(30,0);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.redo.draw(ctx);
		Tools.undo.init();
	},
	drawLayerMenu: function(){
			var ctx = $('#layer_menu')[0].getContext('2d');
			silverGrad = Menus.silverGrad(ctx);
					ctx.beginPath();
					ctx.moveTo(160,2);
					ctx.lineTo(25,2);
					ctx.quadraticCurveTo(25,2,20,7);
					//ctx.lineTo(60,35);
					//ctx.quadraticCurveTo(60,40, 27, 40);
					ctx.quadraticCurveTo(22,40, 5, 40);
					//ctx.lineTo(20,40);
					ctx.quadraticCurveTo(2,40,2,45);
					ctx.lineTo(2,218);
					ctx.quadraticCurveTo(2,223,7,223);
					ctx.lineTo(200,223);
					ctx.closePath();
					ctx.strokeStyle=silverGrad;
					ctx.lineWidth = 2;
					ctx.save();
					
					ctx.clip();
			ctx.drawImage(this.bgGradient,0,-100);
			ctx.restore();
			ctx.stroke();
			ctx.translate(28,10);
			ctx.beginPath();
			ctx.fillStyle='#DBDBDB';
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;
			ctx.fillRect(0,0,30,30);
			ctx.strokeRect(0,0,30,30);
			Tools.sortlayers.draw(ctx);
			ctx.translate(30,0);
			ctx.beginPath();
			ctx.fillStyle='#DBDBDB';
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;
			ctx.fillRect(0,0,30,30);
			ctx.strokeRect(0,0,30,30);
			Tools.flatten.draw(ctx);
			ctx.translate(30,0);
			ctx.beginPath();
			ctx.fillStyle='#DBDBDB';
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;
			ctx.fillRect(0,0,30,30);
			ctx.strokeRect(0,0,30,30);
			Tools.addlayer.draw(ctx);
			ctx.translate(30,0);
			ctx.beginPath();
			ctx.fillStyle='#DBDBDB';
			ctx.strokeStyle=silverGrad;
			ctx.lineWidth = 2;
			ctx.fillRect(0,0,30,30);
			ctx.strokeRect(0,0,30,30);
			Tools.removelayer.draw(ctx);
	},
	drawClipboardMenu: function(){
		ctx = $('#clipboard_menu')[0].getContext('2d');
		silverGrad = Menus.silverGrad(ctx);
				ctx.beginPath();
				ctx.moveTo(340,2);
				ctx.lineTo(12,2);
				ctx.quadraticCurveTo(7,2,2,7);
				ctx.lineTo(2,160);
				ctx.lineTo(350,160);
				ctx.save();
				
				ctx.clip();
		ctx.drawImage(this.bgGradient,0,-100);
		ctx.restore();
		ctx.stroke();
		ctx.translate(12,10);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.cut.draw(ctx);
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.copy.draw(ctx);
		ctx.translate(0,30);
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.paste.draw(ctx);
	},
	initHelperText: function(){
		Yang.hoverCtx = $('#hover-text-canvas')[0].getContext('2d');
		
		$('.button_cover, .menu_minibutton, .yang_slider').mouseenter(function(){
			Yang.hoverButton = 1;
			var pos = $(this).position();
			if($(this).hasClass("yang_slider")){
				var parPos = $(this).parent().position();
				var str = $(this).attr("id");
				str = str.split("slider")[0];
				str = str.split("_").join(" ");
				$('#hover-text-canvas').show().css({
					'top':(pos.top +parPos.top)+ "px",
					'left':(pos.left+parPos.left + 4 + $(this).width()) + "px"
				});
				var ctx = Yang.hoverCtx;
				ctx.clearRect(0,0,210,50);
				
					ctx.beginPath();
					ctx.lineJoin = "round";
					ctx.beginPath();
					ctx.strokeStyle = 'white';
					ctx.font = 'bold 17px Courier';
					ctx.lineWidth = 2.5;
					ctx.strokeText(str, 3,13);
					ctx.fillText(str, 3,13);
			}
			
			if(Tools[$(this).attr('data-key')] != undefined){
				var button = Tools[$(this).attr('data-key')];
				if(Tools.settings.opts.helper_text){
					$('#hover-text-canvas').hide();

					switch(button.edge){
						case 'left':
							$('#hover-text-canvas').show().css({
								'top':pos.top + "px",
								'left':(pos.left+39) + "px"
							});
						break;
						case 'top':
							$('#hover-text-canvas').show().css({
								'top':(pos.top+40) + "px",
								'left':pos.left + "px"
							});
						break;
						case 'top-right':
							$('#hover-text-canvas').show().css({
								'top':(pos.top+40) + "px",
								'left':(pos.left-180) + "px"
							});
						break;
						case 'bottom':
							$('#hover-text-canvas').show().css({
								'top':(pos.top-10) + "px",
								'left':(pos.left-220) + "px"
							});
						break;
						case 'deep_left':
							$('#hover-text-canvas').show().css({
								'top':(pos.top+95) + "px",
								'left':(pos.left+70) + "px"
							});
						
					}

					var ctx = Yang.hoverCtx;
					ctx.clearRect(0,0,210,50);
					if(button.enText != undefined){
						ctx.beginPath();
						ctx.lineJoin = "round";
						ctx.beginPath();
						ctx.strokeStyle = 'white';
						ctx.font = 'bold 17px Courier';
						ctx.lineWidth = 2.5;
						ctx.strokeText(button.enText, 3,13);
						ctx.fillText(button.enText, 3,13);
					}

					if(button.chText != undefined){
						ctx.beginPath();
						ctx.lineJoin = "round";
						ctx.beginPath();
						ctx.strokeStyle = 'white';
						ctx.font = 'bold 22px Courier';
						ctx.lineWidth = 2.5;
						ctx.strokeText(button.chText, 3,43);
						ctx.fillText(button.chText, 3,43);
					}
				}
			}
			


		}).mouseleave(function(){
			Yang.hoverButton = 0;
			$('#hover-text-canvas').hide();
		}).mousedown(function(){
			Yang.hoverButton = 0;
			$('#hover-text-canvas').hide();
		});
		
		
	}
};