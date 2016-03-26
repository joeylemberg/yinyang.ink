// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

Tools.undo = {
	edge:'bottom',
	enText:'          undo',
	chText:'    复原动作',
	selectable: 0,
	click: function(){
		Clipboard.drop();
		History.actPending();
		if(History.actions[History.index-1] != undefined){
			History.index--;
			var layer = History.actions[History.index].layer;
			Pic.Layers[layer].ctx.clearRect(0,0,Pic.w,Pic.h);
			for(var i = 0; i < History.index; i++){
				if(History.actions[i].layer == layer){
					History.act(History.actions[i]);
				}
			}
			if(History.actions[History.index].isDummy != undefined){
				$("#history_tile" + History.index).remove();
				History.actions.splice(History.index,1);
			}else{
				$("#history_tile" + History.index).addClass("faded_history_tile");
			}
			$("#history_tiles").animate({scrollTop:Math.ceil(History.index/7)*20-20}, '500', 'swing');
			
		}
		
		if(History.actions[History.index-1] != undefined){
	//		History.afterAction(History.actions[History.index-1]);
		}
		
		
	},
	init: function(){
		this.initSubMenu();
	}
};


Tools.redo = {
	edge:'bottom',
	enText:'           redo',
	chText:'        施行',
	selectable: 0,
	click: function(){
		Clipboard.drop();
		History.actPending();
		if(History.actions.length > History.index){
			History.act(History.actions[History.index]);
			$("#history_tile" + History.index).removeClass("faded_history_tile");
			History.index++;
		}
		
		if(History.actions[History.index-1] != undefined){
	//		History.afterAction(History.actions[History.index-1]);
		}
		
	},
	init: function(){
		this.initSubMenu();
	}
};

History.afterAction = function(d){
	if(d.tool == "mover"){
		Tools.selectbox.range = $.extend({},d.range);
		Tools.selectbox.range.x = d.endpoint[0];
		Tools.selectbox.range.y = d.endpoint[1];
		Tools.selectbox.range.popped = 1;
		if(Yang.tool.unselect){
			Yang.tool.unselect();
		}
		Yang.tool = Tools.selectbox;
		$(".button_cover").each(function(){
			if($(this).attr("data-key") == "selectbox"){
				$(this).addClass("active_button_cover");
			}else{
				$(this).removeClass("active_botton_cover");
			}
		});
		Tools.selectbox.state = "idle";
		Main.setCursor();
		$(document).ready(function(){
			Tools.selectbox.release();
		});
	}else{
		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
		Clipboard.hideRangeControls();
	}
}

Tools.undo.initSubMenu = function(){
	Menus.addButtonCover(43,65,"undo","right");
	Menus.addButtonCover(13,65,"redo","right");
	var subMenu = "<div id='history_tiles' ";
	subMenu += "style='cursor:auto;position:fixed;right:7px;top:100px;width:140px;height:142px;overflow-x:hidden;overflow-y:scroll;background-color:#eeeeee;border:2px solid #c4c4c4;z-index:101;'>";
	subMenu += "</div>";
	$("#biggest_div").append(subMenu);
}

Tools.undo.draw = function(ctx){
			ctx.beginPath();
			ctx.lineCap = 'butt';
			ctx.strokeStyle = 'black';

			var radgrad = ctx.createRadialGradient(4, 19, 3, 15, 15, 15);
			radgrad.addColorStop(0, 'rgba(225, 0, 0, .1)');
			radgrad.addColorStop(1, 'rgba(225, 0, 0, .9)');

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
};
Tools.redo.draw = function(ctx){
		ctx.translate(30,0);
		ctx.scale(-1,1);
		ctx.beginPath();
		ctx.lineCap = 'butt';
		ctx.strokeStyle = 'black';

		var radgrad = ctx.createRadialGradient(4, 19, 3, 15, 15, 15);
		radgrad.addColorStop(0, 'rgba(0, 225, 0, .1)');
		radgrad.addColorStop(1, 'rgba(0, 225, 0, .9)');

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
		ctx.scale(-1,1);
		ctx.translate(-30,0);
};