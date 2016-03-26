/*
	dropper.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.dropper = {
	edge:'top',
	enText:'color picker',
	chText:'拾色器',
	selectable: 1,
	color: 0,
	xOffset: -5,
	yOffset: -25,
	colors: [],
	init: function(){
		Menus.addButtonCover(5,441,"dropper");
		var subMenu = "<input id='dropper_color0' class='dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:0px;left:0px;height:20px;'/>";
		subMenu += "<input id='dropper_color1' class='color dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:15px;left:0px;height:20px;'/>";
		subMenu += "<input id='dropper_color2' class='dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:30px;left:0px;height:20px;'/>";
		subMenu += "<input id='dropper_color3' class='dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:45px;left:0px;height:20px;'/>";
		subMenu += "<input id='dropper_color4' class='dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:60px;left:0px;height:20px;'/>";
		subMenu += "<input id='dropper_color5' class='dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:75px;left:0px;height:20px;'/>";
		subMenu += "<input id='dropper_color6' class='dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:90px;left:0px;height:20px;'/>";
		subMenu += "<input id='dropper_color7' class='dropper_input'  value='FFFFFF' style='width:50px;position:absolute;top:105px;left:0px;height:20px;'/>";
		$('#dropper_submenu').append(subMenu);
		$(".dropper_input").click(function(){
			Tools.dropper.color = $(this).val();
			Tools.dropper.refresh();
		});
	},
	select: function(){
		$('#dropper_submenu').addClass('expanded_submenu').animate({'width':'50px'}, 100).css("border-left","2px solid #2d2d2d");
	},
	unselect: function(clicked){
		if(this.color){
			if(clicked.name != undefined && clicked.name == "pencil"){
				$("#pencil_color").val(this.color).trigger("change").css("background-color", "#" + this.color);
			}else 	if(clicked.name != undefined && clicked.name == "brush"){
					$("#brush_color").val(this.color).trigger("change").css("background-color", "#" + this.color);
				}	else 	if(clicked.name != undefined && clicked.name == "text"){
							$("#text_color").val(this.color).trigger("change").css("background-color", "#" + this.color);
						}
		}
		
		//$(".active_button_cover").css("opacity", "").css("background-color","");
		
		$('#dropper_submenu').removeClass('expanded_submenu').animate({'width':'0px'}, 100).css("border-left","none");
	},
	isDark: 0,
	press: function(){
		this.pos = [Input.x,Input.y];
		if(this.pos[0] > 0 && this.pos[1] > 0 && this.pos[0] < Pic.w && this.pos[1] < Pic.h){
			var p = Pic.Layers[Yang.layer].ctx.getImageData(Math.floor(this.pos[0]), Math.floor(this.pos[1]), 1, 1).data;
			//console.log(p);
			var hex;
			if(!p[0] && !p[1] && !p[2] && !p[3]){
			//	hex = "FFFFFF";
			//	$('#dropper_color').css('color','#FFFFFF');
			}else{
				if(p[0] + p[1] + p[2] < 200){
					this.isDark = 1;
				}else{
					this.isDark = 0;
				}
				hex = ("000000" + Util.rgbToHex(p[0], p[1], p[2])).slice(-6).toUpperCase();
				this.color = hex;
				this.fillNextSlot(hex);   
				$('#dropper_color').val(hex);
				$('#dropper_color').css('background-color',hex);
				this.refresh();
			}
			
		}
	},
	refresh: function(){
		var ctx = $('#selector_menu')[0].getContext('2d');
		ctx.beginPath();
		ctx.fillStyle='#DBDBDB';
		ctx.strokeStyle=silverGrad;
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,30,30);
		ctx.strokeRect(0,0,30,30);
		Tools.dropper.draw(ctx);
		Main.setCursor();
		/*$(".active_button_cover").css({
			"background-color":"#" + Tools.dropper.color,
			"opacity":0.5
		});*/
	},
	hold: function(){
		this.press();	
	},
	release: function(){
		this.fillNextSlot(this.color);
		this.colors.push(this.color);
	},
	fillNextSlot: function(hex){
		if(this.colors.length > 7){
			this.colors = [];
		}
		$("#dropper_color" + this.colors.length).val(hex).css("background-color", "#" + hex);
		if(this.isDark){
			$("#dropper_color" + this.colors.length).css("color","white");
		}else{
			$("#dropper_color" + this.colors.length).css("color","black");
		}
	}
};

Tools.dropper.draw = function(ctx){
	//glass
	ctx.beginPath();
	//ctx.translate(1.5,1.5);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(17.5,9.5);
	ctx.lineTo(7.5,19.5);
	ctx.quadraticCurveTo(9,19,5,24);
	ctx.lineTo(6,25);
	//ctx.lineTo(6,25);
	ctx.quadraticCurveTo(6,25,11,21);
	ctx.lineTo(10.5,22.5);
	ctx.lineTo(20.5,12.5);
	ctx.closePath();
	ctx.fillStyle="rgba(225,225,225,0.8)";
	ctx.stroke();
	ctx.fill();
	
	ctx.save();
	
	ctx.clip();
	if(Tools.dropper.color){
		ctx.fillStyle = '#' + Tools.dropper.color;
		//console.log("SEBULBA " + ctx.fillStyle);
		ctx.globalCompositeOperation = "source-over";
		ctx.fillRect(0,18,20,20);
	}
	
	ctx.restore();
	
//	ctx.stroke();
	
	//rubber
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.lineWidth = 6;
	ctx.moveTo(23,7);
	ctx.lineTo(19,11);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.moveTo(16.5,8.5);
	ctx.lineTo(21.5,13.5);
	ctx.stroke();
};