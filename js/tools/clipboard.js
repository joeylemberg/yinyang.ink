// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

$('#clipboard_menu').ready(function(){
    window.ctx = $('#clipboard_menu')[0].getContext('2d');
});

Tools.clipboard = {
	init: function(){
		Menus.addButtonCover(297,80,"cut",1,undefined,1);
		Menus.addButtonCover(297,50,"copy",1,undefined,1);
		Menus.addButtonCover(297,20,"paste",1,undefined,1);
	},
	draw: function(ctx){
		Tools.mover.draw(ctx);
	}
}
Tools.cut = {
	selectable: 0,
	edge: 'bottom',
	enText: '                cut',
	chText:'           画笔',
	//no_cover:1,
	draw: function(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.translate(15,15);
		ctx.rotate(0.5);
		ctx.font = "24px tahoma";
		ctx.fillStyle="#444444";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.strokeText("✂",-11,8);
		ctx.fillText("✂",-11,8);
		ctx.restore();
	},
	click: function(real_press){
		if(real_press != undefined || $("#clipped_range").length || Yang.toolName == "magicwand"){
			ContextMenu.context_cut();
		}
	}
}
Tools.copy = {
	selectable: 0,
	edge: 'bottom',
	enText: '               copy',
	chText: '           复制',
	draw: function(ctx){
		ctx.save();
		ctx.scale(0.8,0.8);
		ctx.translate(-1,0);
		Tools.newfile.draw(ctx);
		ctx.translate(11,7);
		Tools.newfile.draw(ctx);
		ctx.restore();
		/*ctx.save();
		ctx.beginPath();
		ctx.translate(15,14);
		ctx.rotate(0.5);
		ctx.font = "24px tahoma";
		ctx.fillStyle="#444444";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.strokeText("C",-7,10);
		ctx.fillText("C",-7,10);
		ctx.restore();*/
	},
	click: function(real_press){
		if(real_press != undefined || $("#clipped_range").length || Yang.toolName == "magicwand"){
			ContextMenu.context_copy();
		}
	}
}
Tools.paste = {
	selectable: 0,
	edge: 'bottom',
	enText: '              paste',
	chText: '             贴',
	draw: function(ctx){
		
		ctx.save();
		
		ctx.translate(1,-2);
		Tools.newfile.draw(ctx);
		
		ctx.translate(-3,2);
		
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1.5;
		ctx.moveTo(16, 27);
		ctx.lineTo(20, 27);
		ctx.lineTo(20, 18);
		ctx.lineTo(23, 18);
		ctx.lineTo(18, 13);
		ctx.lineTo(13, 18);
		ctx.lineTo(16, 18);

		radgrad = ctx.createRadialGradient(20, 12, 1, 19, 11, 10);
		radgrad.addColorStop(0, 'rgba(0, 218, 0, 0.1)');
		radgrad.addColorStop(1, 'rgba(0, 218, 0, 1)');

		ctx.closePath();
		ctx.fillStyle = radgrad;
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
		/*ctx.save();
		ctx.beginPath();
		ctx.translate(15,14);
		ctx.rotate(0.5);
		ctx.font = "24px tahoma";
		ctx.fillStyle="#444444";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.strokeText("V",-7,11);
		ctx.fillText("V",-7,11);
		ctx.restore();*/
	},
	click: function(){
		if(Yang.tool.finish){
			Yang.tool.finish();
		}
		if($(".active_clipboard_canvas").length){
			ContextMenu.context_paste(Input.x,Input.y);
		}
	}
}

