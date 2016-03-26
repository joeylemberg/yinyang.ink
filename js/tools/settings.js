/*
	settings.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.settings = {
	selectable: 0,
	edge:'top',
	enText:'settings',
	chText:'系统偏好',
	init: function(){
		Menus.addButtonCover(582,5,"settings");
		var cover = "<div id='settings_cover' style='position:fixed;top:0;left:0;z-index:99999;width:100%;height:100%;background-color:rgba(0,0,0,0.7);display:none;cursor:auto;padding:0px;'>";
		cover += '<canvas id="settings_x_box" class="x_box" width="20" height="20"></canvas>';
		cover += "<div style='background-color:white;position:fixed;top:6%;left:6%;padding:4%;position:relative;overflow-y:scroll;height:75%;width:80%;'>";
		cover += "<b style='font-size:32px;position:relative;top:-15px;left:28px;'>settings</b>";
		cover += "<div id='settings_pages'>";
		cover += "<span data-page='general' class='settings_page_tab' id='basic_settings'><canvas class='settings_canvas' width='26' height='26'></canvas>basics</span>";
		cover += "<span data-page='shortcuts' class='settings_page_tab' id='shortcut_settings'><canvas class='settings_canvas' width='26' height='26'></canvas>shortcuts</span>";
		//cover += "<span data-page='advanced' class='settings_page_tab'><canvas class='settings_canvas' width='26' height='26'></canvas>advanced</span>";
		cover += "</div>";
		cover += "<div id='settings_content' style='margin-top:24px;'></div>";
		cover += "</div>";
		cover += "</div>";
		cover += "</div>";
		$("body").prepend(cover);
		
		$(".settings_canvas").each(function(){
			scaleUp(this);
		var ctx = this.getContext("2d");
			ctx.scale(0.9,0.9);
			Tools.settings.draw(ctx);
		});
		
		$(".settings_page_tab").click(function(){
			$(".active_settings_tab").removeClass("active_settings_tab");
			$(this).addClass("active_settings_tab");
			//$("#settings_content").html(Tools.settings.pages[$(this).attr("data-page")]);
			Tools.settings.pages[$(this).attr("data-page")]();
		});
		
		if(Tools.settings.opts.checkered_background){
			$("#picture").addClass("checkeredbg");
		}else{
			$("#picture").removeClass("checkeredbg");
		}
	
	},
	shortcuts: {
		undo: 90,
		redo: 89,
		cut: 88,
		copy: 67,
		paste: 86,
		deleter:8,
		//pencil: 80,
		//brush: 66,
		//eraser: 69,
		//text: 84,
		//selectbox: 83,
		//selectfree: 70,
		//magicwand: 87,
		//smudge: 81,
		//dropper:68,
		//size:65,
		grabber:77,
		zoomin:187,
		zoomout:189//,
	//	left:37,
	//	up:38,
	//	right:39,
	//	down:40
	},
	toggleOption: function(e){
		if(Tools.settings.opts[$(e.target).attr("data-option")]){
			Tools.settings.opts[$(e.target).attr("data-option")] = false;
		}else{
			Tools.settings.opts[$(e.target).attr("data-option")] = true;
		}
		if(Tools.settings.opts.checkered_background){
			$("#picture").addClass("checkeredbg");
		}else{
			$("#picture").removeClass("checkeredbg");
		}
		if(Tools.settings.opts.show_clipboard){
			$("#clipboard_list, #clipboard_menu").show();
		}else{
			$("#clipboard_list, #clipboard_menu").hide();
		}
		if(Tools.settings.opts.show_layers){
			$("#layer_list, #layer_menu").show();
		}else{
			$("#layer_list, #layer_menu").hide();
		}
		if(Tools.settings.opts.show_history){
			$("#history_tiles, #history_menu").show();
		}else{
			$("#history_tiles, #history_menu").hide();
		}
	},
	opts: {
		helper_text : true,
		checkered_background: true,
		new_layers_for_uploads: false,
		show_clipboard: true,
		show_layers: true,
		show_history: true
		//hide_other_layers_during_action: false
	},
	pages : {
		general: function(){
			var table = "<table>";
			for(i in Tools.settings.opts){
				table += "<tr><td><input data-option='" + i + "' onclick='Tools.settings.toggleOption(event);' type='checkbox' " + (Tools.settings.opts[i]?"checked":"") + " ></td><td>" + i + "</td></tr>";
			}
			table += "</table>";
			$("#settings_content").html(table);
		},
		shortcuts: function(){
			var table = "<table>";
			for(i in Tools.settings.shortcuts){
				table += "<tr><td><input readonly class='shortcut_input' type='text' value='";
				switch(Tools.settings.shortcuts[i]){
					case 187:
						table += "+";
						break;
						case 189:
							table += "-";
							break;
					case 8:
					table += "del";
					break;
					
					case 89: case 90: case 88: case 67: case 86:
						table += (isMac?"⌘":"ctrl") + "+" + String.fromCharCode(Tools.settings.shortcuts[i]);
					break;
					//case 37:
					//break;
				//	case
				//	grabber:77,
				/*	zoomin:187,
					zoomout:189,
					left:37,
					up:38,
					right:39,
					down:40*/
					
					default:
						table += String.fromCharCode(Tools.settings.shortcuts[i]);
					break;
				}
				var side = pxRatio * 30;
				table += "'></td><td><canvas class='shortcut_canvas' height='" + side + "' width='" + side + "' data-name='" + i + "'></canvas></td><td>" + i + "</td><td>&nbsp;&nbsp;&nbsp;</td></tr>";
			}
			table += "</table>";
			table += "<div><i style='font-size:10px;margin-left:24px;'>Shortcuts are not customizable.  Sorry.</i></div>";
			$("#settings_content").html(table);
			$(".shortcut_canvas").each(function(){
				this.getContext('2d').scale(pxRatio, pxRatio);
				this.getContext('2d').lineJoin = "round";
				Tools[$(this).attr("data-name")].draw(this.getContext('2d'));
			});
		},
		advanced: function(){
			var table = "Nothing here...";
			$("#settings_content").html(table);
		}
	},
	click: function(){
		$("#settings_cover").fadeIn();
		$("#basic_settings").trigger("click");
	}
	
}

Tools.settings.draw = function(ctx){
	
	function drawGear(ctx, teeth, xtra){
			if(xtra == undefined){
				xtra = 0;
			}
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = "black";
			ctx.fillStyle = "#727272";
			ctx.lineWidth = 1;
			ctx.rotate(Math.PI/9);
			ctx.moveTo(3,9);
			ctx.lineJoin = "round";
			for(var i = 0; i < teeth; i++){
				ctx.lineTo(3+xtra,9);
				ctx.lineTo(2,12+xtra);
				ctx.lineTo(-2,12+xtra);
				ctx.lineTo(-3-xtra,9);
				ctx.rotate(Math.PI*2/teeth);
			}
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(0,0,2,0,6.3,1);
			ctx.strokeStyle = "#3d3d3d";
			ctx.fillStyle = "#DBDBDB";
			ctx.lineWidth = 8;
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		}
	
	ctx.save();
	
	ctx.translate(11,19);
	ctx.scale(0.75,0.75);
	ctx.rotate(0.45);
	drawGear(ctx, 7);
	ctx.restore();
	
	ctx.save();
	ctx.translate(21.5,8.5);
	ctx.scale(0.5,0.5);
	ctx.rotate(0.35);
	drawGear(ctx, 5, 1);
	ctx.restore();	
	
};