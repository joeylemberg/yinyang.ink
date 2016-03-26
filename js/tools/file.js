/*
	file.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.file = {
	init: function(){
		this.initSubMenu();
	}
}

Tools.file.initSubMenu = function(){
	Menus.addButtonCover("234","5","openfile");
	Menus.addButtonCover("264","5","savefile");
	Menus.addButtonCover("294","5","newfile");
	Menus.addButtonCover("324","5","downloadfile");
	var subMenu = "<input id='picture_title' class='free_input' type='text' style='position:fixed;top:37px;left:234px;z-index:101;width:120px;'/>";
	$("#biggest_div").append(subMenu);
}

Tools.newfile = {
	selectable:0,
	edge:'top',
	enText:'new picture',
	chText:'新的绘画',
	click:function(){
		//window.onbeforeunload = null;
		window.location = window.location.href.split("?")[0];
	}
}

Tools.openfile = {
	selectable:0,
	edge:'top',
	enText:'open picture',
	chText:'打开画文件',
	click:function(){
		$("#browse_for_upload").trigger("click");
	}
}

Tools.savefile = {
	selectable:0,
	edge:'top',
	enText:'save picture',
	chText:'保存画',
	click:function(){
		Tools.downloadfile.click();
		/*if(!Yang.busy){
			Yang.busy = 1;
			if(user == null){
				alert("You must be signed in to save pictures online.  You can still download your picture without signing in, though creating an account is quick, easy and free");
			}else{
				Loader.show("Saving picture");
				try{
					setTimeout(function(){
						var binLength = 0;
						$("#layer_list").children(".listed_layer").each(function(){
							var i = parseInt($(this).attr("data-index"));
							console.log(i);
							if(Pic.Layers[i]){
								var l = Pic.Layers[i];
								var layerData = {
									alpha: l.alpha,
									data: $("#canvas_layer" + i)[0].toDataURL("image/png"),
									hidden: (l.hidden?1:0),
									name: l.name
								}
								binLength += layerData.data.length-22;
								layerData.data = btoa(layerData.data.split(",").pop());
								saveData.layers.push(layerData);
							}
						});
						$(document).ready(function(){
							console.log(saveData.layers[0].data);
							savePic(saveData.title, Pic.id, JSON.stringify(saveData), function(data){
								Pic.id = data.id;
								Loader.hide();
								Yang.busy = 0;
							});
						});
					}, 100);
					var saveData = {
						title: Pic.title,
						w: Pic.w,
						h: Pic.h,
						layers: []
					}
					
				}catch (e){
					alert("Error saving image");
					Loader.hide();
					Yang.busy = 0;
				}
				
				
			}
		}*/
		
		
	}
}

Tools.downloadfile = {
	selectable:0,
	edge:'top',
	enText:'download image',
	chText:'下载绘画',
	click:function(){
		
		//Loader.show("Building picture for download");
		
		var imgName = Pic.title;
		if(!imgName.length){
			imgName = "yinyangpaint";
		}
		
		imgName += ".png";
		
		var canvas = document.createElement('canvas');
		
		 var w = Pic.w;
		 var h = Pic.h;
		
		canvas.width = w;
		canvas.height = h;
		
		var ctx = canvas.getContext('2d');
		ctx.globalCompositeOperation = 'destination-over';
		
		$(document).ready(function(){
			$("#layer_list").children(".listed_layer").each(function(){
				var i = parseInt($(this).attr("data-index"),10);
				if(Pic.Layers[i]){
					var lay = $('#canvas_layer' + i)[0];
					ctx.beginPath();
					ctx.globalAlpha = Pic.Layers[i].alpha/100;
					ctx.drawImage(lay,0,0,w,h);
				}
			});
			
			
			
			$(document).ready(function(){
				
				try{	
					
					//MIKE canvas data
					var imgData = canvas.toDataURL("image/png");
					console.log(imgData);
					//console.log("IM TRYING!!!");
					//
					if(is_firefox){// || canvas.width * canvas.height < 500000){
						var img = imgData;
						var a = $("<a>").attr("href", img).attr("download", imgName).appendTo("body");
						a[0].click();
						a.remove();
					}else{
						var parts = imgData.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/);
						var binStr = atob(parts[3]);
						var buf = new ArrayBuffer(binStr.length);
						var view = new Uint8Array(buf);
						for(var i = 0; i < view.length; i++)
						  view[i] = binStr.charCodeAt(i);
							var blob = new Blob([view], {'type': parts[1]});
							var URL = webkitURL.createObjectURL(blob)
							var a = $("<a>").attr("href", URL).attr("download", imgName).appendTo("body");
							a[0].click();
							a.remove();
					}
					//Loader.hide();
					
				}catch(e){
					//Loader.hide();
					alert("Image build failed");
				}
			});
		});
	}
}


Tools.newfile.draw = function(ctx){
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'white';
	ctx.lineWidth = 1;
	ctx.moveTo(7, 5);
	ctx.lineTo(7, 25);
	ctx.lineTo(23, 25);
	ctx.lineTo(23, 12);
	ctx.lineTo(16, 5);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#e0e0e0';
	ctx.moveTo(23, 12);
	ctx.lineTo(16, 12);
	ctx.lineTo(16, 5);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

Tools.openfile.draw = function(ctx){
		ctx.save();
		ctx.translate(1,0);
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.fillStyle = '#e88e06';
		ctx.moveTo(5, 24);
		ctx.lineTo(23, 24);
		ctx.lineTo(26, 10);
		ctx.lineTo(19, 10);
		ctx.lineTo(16, 7);
		ctx.lineTo(13, 7);
		ctx.lineTo(10, 10);
		ctx.lineTo(8, 10);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.fillStyle = '#ffb949';
		ctx.moveTo(5, 24);
		ctx.lineTo(23, 24);
		ctx.lineTo(20, 14);
		ctx.lineTo(2, 14);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

Tools.savefile.draw = function(ctx){
	ctx.beginPath();
	ctx.moveTo(6, 6);
	ctx.lineTo(6, 24);
	ctx.lineTo(24, 24);
	ctx.lineTo(24, 8);
	ctx.lineTo(22, 6);
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';

	ctx.closePath();
	ctx.stroke();
	ctx.lineJoin = 'butt';

	var radgrad = ctx.createRadialGradient(1, 5, 3, 15, 20, 20);
	radgrad.addColorStop(0, '#545454');
	radgrad.addColorStop(0.7, '#2d2d2d');
	radgrad.addColorStop(1, '#545454');

	ctx.fillStyle = radgrad;

	ctx.closePath();
	ctx.fill();

	ctx.beginPath();

	radgrad = ctx.createRadialGradient(1, 5, 3, 15, 20, 20);
	radgrad.addColorStop(0, '#e5e5e5');
	radgrad.addColorStop(1, '#F8F8F8');

	ctx.fillStyle = radgrad;
	ctx.fillRect(8, 15, 14, 9);

	ctx.beginPath();
	ctx.fillStyle = "#BCBBBF";
	ctx.fillRect(9, 5, 11, 7);

	ctx.beginPath();
	ctx.fillStyle = "#545454";
	ctx.fillRect(15, 5, 3, 5);
}

Tools.downloadfile.draw = function(ctx){
	ctx.save();
	
	
	
	ctx.beginPath();
	
	ctx.translate(0,-2);
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#ffeedd';
	ctx.lineWidth = 1;
	ctx.rect(5, 5, 20, 21);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	var radgrad = ctx.createRadialGradient(5, 20, 1, 19, 11, 10);
	radgrad.addColorStop(0, '#75daff');
	radgrad.addColorStop(1, '#bea0ff');
	ctx.fillStyle = radgrad;
	ctx.fillRect(8, 8, 14, 13);
	ctx.strokeRect(8, 8, 14, 13);


	ctx.beginPath();
	ctx.translate(34,42);
	ctx.rotate(3.14);
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
	radgrad.addColorStop(0, 'rgba(0, 198, 0, 1)');
	radgrad.addColorStop(1, 'rgba(0, 218, 0, 1)');

	ctx.closePath();
	ctx.fillStyle = radgrad;
	ctx.fill();
	ctx.stroke();
	
	ctx.restore();
};