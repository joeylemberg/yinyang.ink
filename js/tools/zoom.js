/*
	zoom.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.zoom = {
	init: function(){
		Menus.addButtonCover(407,5,"zoomin");
		Menus.addButtonCover(437,5,"zoomout");
		var subMenu = "<input id='zoom_disp' class='yang_integer' type='text' min='10' max = '1000' step='10' style='position:fixed;top:17px;left:467px;z-index:101;width:40px;border:1px solid #444444;text-align:center;'/>";
		subMenu += "<canvas id='zoom_disp_slider' class='yang_slider' width='90' height='10' style='position:fixed;top:36px;left:406px;z-index:101;'></canvas>";
		$("#view_submenu").append(subMenu);
	}
}

Tools.zoomin = {
	selectable: 0,
	holdable: 1,
	edge:'top',
	enText:'zoom in',
	chText:'放大',
	click : function(){
		$("#zoom_disp").val(100*Yang.zoom + 5).trigger("blur");
	}
};

Tools.zoomout = {
	selectable: 0,
	holdable: 1,
	edge:'top',
	enText:'zoom out',
	chText:'缩小',
	click : function(){
		$("#zoom_disp").val(100*Yang.zoom - 5).trigger("blur");
	}
};

Tools.left = {
	no_cover:1,
	click: function(){
		Yang.left-=3;
		Yang.placePic();
	},
	draw:function(){}
}

Tools.right = {
	no_cover:1,
	click: function(){
		Yang.left+=3;
		Yang.placePic();
	},
	draw:function(){}
}

Tools.up = {
	no_cover:1,
	click: function(){
		Yang.top-=3;
		Yang.placePic();
	},
	draw:function(){}
}

Tools.down = {
	no_cover:1,
	click: function(){
		Yang.top+=3;
		Yang.placePic();
	},
	draw:function(){}
}

Tools.zoomin.draw = function(ctx){
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.moveTo(6, 24);
		ctx.lineTo(14, 16);
		ctx.moveTo(24, 11);
		ctx.arc(19, 11, 6, 0, 6.28, 0);

		var radgrad = ctx.createRadialGradient(20, 12, 1, 19, 11, 10);
		radgrad.addColorStop(0, 'rgba(117, 218, 255, .1)');
		radgrad.addColorStop(0.5, 'rgba(117, 218, 255, .6)');
		radgrad.addColorStop(1, 'rgba(117, 218, 255, .1)');

		ctx.stroke();
		ctx.fillStyle = radgrad;
		ctx.fill();

		ctx.beginPath();
		ctx.lineCap = 'round';
		ctx.lineWidth = 1.5;
		ctx.moveTo(19, 14);
		ctx.lineTo(19, 8);
		ctx.moveTo(16, 11);
		ctx.lineTo(22, 11);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineCap = 'butt';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 4;
		ctx.moveTo(5, 25);
		ctx.lineTo(12, 18);
		ctx.stroke();
};
Tools.zoomout.draw = function(ctx){
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.moveTo(6, 24);
		ctx.lineTo(14, 16);
		ctx.moveTo(24, 11);
		ctx.arc(19, 11, 6, 0, 6.28, 0);

		var radgrad = ctx.createRadialGradient(18, 12, 1, 20, 9, 10);
		radgrad.addColorStop(0, 'rgba(117, 218, 255, .1)');
		radgrad.addColorStop(0.5, 'rgba(117, 218, 255, .6)');
		radgrad.addColorStop(1, 'rgba(117, 218, 255, .1)');

		ctx.stroke();
		ctx.fillStyle = radgrad;
		ctx.fill();

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(16, 11);
		ctx.lineTo(22, 11);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 4;
		ctx.moveTo(5, 25);
		ctx.lineTo(12, 18);
		ctx.stroke();
};