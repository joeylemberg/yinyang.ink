/*
	filters.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.filters = {
	selectable: 0,
	edge:'top',
	enText:'filters',
	chText:'系统偏好',
	init: function(){
		Menus.addButtonCover(530,5,"filters");
		var cover = "<div id='filters_cover' style='position:fixed;top:0;left:0;z-index:99999;width:100%;height:100%;background-color:rgba(0,0,0,0.7);display:none;cursor:auto;padding:0px;'>";
		cover += '<canvas id="settings_x_box" class="x_box" width="20" height="20"></canvas>';
		cover += "<div style='background-color:white;position:fixed;top:6%;left:6%;padding:4%;position:relative;overflow-y:scroll;width:80%;'>";
		cover += "<b style='font-size:32px;position:relative;top:-15px;left:28px;'>filters</b>";
		cover += "<div id='filter_buttons'>";
		cover += "<span data-filter='black_and_white' class='filter_button' id='black_and_white_filter'>Black&nbsp;&amp;&nbsp;White</span>";
		cover += "<span data-filter='sepia' class='filter_button' id='black_and_white_filter'>Sepia</span>";
		cover += "<span data-filter='negative' class='filter_button' id='black_and_white_filter'>Negative</span>";
		cover += "<span data-filter='trippy' class='filter_button' id='black_and_white_filter'>Damaged</span><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		cover += "<span data-filter='blurred' class='filter_button' id='black_and_white_filter'>Blurry</span>";
		cover += "<span data-filter='burned' class='filter_button' id='black_and_white_filter'>NightTiming</span>";
		cover += "<span data-filter='melting' class='filter_button' id='black_and_white_filter'>Streaked</span>";
		cover += "</div>";
		cover += "</div>";
		$("body").prepend(cover);
		
		$(".filter_button").click(function(){
			console.log($(this).attr("data-filter"));
			Tools.filters.apply[$(this).attr("data-filter")]();
		});
	
	},
	operations : {
		rgbaBW : function(imageData, i)
		{
		    var newValue=(Tools.filters.MaxMin("max",imageData[i],imageData[i+1],imageData[i+2])+
		                  Tools.filters.MaxMin("min",imageData[i],imageData[i+1],imageData[i+2]))/2.0;

		newValue = Math.round(newValue);
				return "rgba(" + newValue + "," + newValue + "," + newValue + "," + imageData[i+3] + ")" ;
		},

		rgbaSepia : function(imageData, i)
		{
		    var newValue=(Tools.filters.MaxMin("max",imageData[i],imageData[i+1],imageData[i+2])+
		                  Tools.filters.MaxMin("min",imageData[i],imageData[i+1],imageData[i+2]))/2.0;

		newValue = Math.round(newValue);
				return "rgba(" + Math.min(255,newValue+75) + "," + newValue + "," + Math.max(0,newValue-75) + "," + imageData[i+3] + ")" ;
		},

		rgbaNegative : function(imageData, i)
		{
				return "rgba(" + (255-imageData[i]) + "," + (255-imageData[i+1]) + "," + (255-imageData[i+2]) + "," + imageData[i+3] + ")" ;

		},
		rgbaTrippy : function(imageData, i)
		{
				return "rgba(" + Math.max(0,Math.min(255, Math.round(-50+Math.random()*100+imageData[i]))) + "," + Math.max(0,Math.min(255, Math.round(-50+Math.random()*100+imageData[i+1]))) + "," + Math.max(0,Math.min(255, Math.round(-50+Math.random()+imageData[i+2]))) + "," + imageData[i+3] + ")" ;

		},
		rgbaBurned : function(imageData, i)
		{
				return "rgba(" + Math.max(0,Math.min(255, Math.round(imageData[i]/2-Math.random()*10))) + "," + Math.round(Math.max(0,Math.min(255, imageData[i+1]/2-Math.random()*10))) + "," + Math.max(0,Math.min(255, Math.round(imageData[i+2]/2-Math.random()*10))) + "," + imageData[i+3] + ")" ;

		}
	},

	MaxMin: function(type,val1,val2,val3)
	{
	    switch(type)
	    {
	        case "max":
	        {
	            var max=val1;
	            if (max<val2)
	            {
	                max=val2;
	            }

	            if (max<val3)
	            {
	                max=val3;
	            }
	            return max;
	        }
	        case "min":
	        {
	            var min=val1;
	            if (min>val2)
	            {
	                min=val2;
	            }

	            if (min>val3)
	            {
	                min=val3;
	            }   
	            return min;
	        }
	    }
	},
	click: function(){
		$("#filters_cover").fadeIn();
	},
	apply:{
		eachOne: function(operation){
				$(document).ready(function(){
					for(var l = 0; l < Pic.Layers.length; l++){
						var lay = Pic.Layers[l];
						if(lay){
							var pxData = lay.ctx.getImageData(0,0,Pic.w,Pic.h).data;
							lay.ctx.clearRect(0,0,Pic.w,Pic.h);
							for(var i = 0; i < Pic.h; i++){
								for(var j = 0; j < Pic.w; j++){
									lay.ctx.fillStyle = Tools.filters.operations[operation](pxData, i*Pic.w*4 + j*4);
									lay.ctx.fillRect(j,i,1,1);
								}
							}
						}
					}
				});
				History.rebase();
		},
		black_and_white: function(){
			Tools.filters.apply.eachOne("rgbaBW");
		},
		sepia: function(){
			Tools.filters.apply.eachOne("rgbaSepia");
		}	,
			negative: function(){
				Tools.filters.apply.eachOne("rgbaNegative");
			}	,
					trippy: function(){
						Tools.filters.apply.eachOne("rgbaTrippy");
					}	,
								burned: function(){
									Tools.filters.apply.eachOne("rgbaBurned");
								},
								blurred: function(){
									History.rebase();
										$(document).ready(function(){
											for(var l = 0; l < Pic.Layers.length; l++){
												var lay = Pic.Layers[l];
												
												if(lay){
													lay.ctx.globalAlpha = 0.5;
													var pxData = lay.ctx.getImageData(0,0,Pic.w,Pic.h).data;
													lay.ctx.clearRect(0,0,Pic.w,Pic.h);
													for(var i = 0; i < Pic.h; i++){
														for(var j = 0; j < Pic.w; j++){
															var k = i*Pic.w*4 + j*4;
															lay.ctx.fillStyle = "rgba(" + pxData[k] + "," + pxData[k+1] + "," + pxData[k+2] + ","+ pxData[k+3] + ")";
															lay.ctx.fillRect(j-0.25,i-0.25,2,2);
														}
													}
													lay.ctx.globalAlpha = 1;
												}
												
											}
											
										});
								},
								melting: function(){
									History.rebase();
										$(document).ready(function(){
											for(var l = 0; l < Pic.Layers.length; l++){
												var lay = Pic.Layers[l];
												if(lay){
													lay.ctx.globalAlpha = 0.01;
													var pxData = lay.ctx.getImageData(0,0,Pic.w,Pic.h).data;
													for(var i = 0; i < Pic.h; i++){
														for(var j = 0; j < Pic.w; j++){
															var k = i*Pic.w*4 + j*4;
															lay.ctx.fillStyle = "rgba(" + pxData[k] + "," + pxData[k+1] + "," + pxData[k+2] + ","+ pxData[k+3] + ")";
															lay.ctx.fillRect(j-1,i,2,1 + Math.random()*100);
														}
													}
													lay.ctx.globalAlpha = 1;
												}
											}
										});
								}
	}
};

Tools.filters.draw = function(ctx){
	
	ctx.save();
	ctx.lineJoin = "round";
	ctx.translate(15,15);
	ctx.scale(0.85,0.85);
	ctx.translate(-15,-15);
	ctx.beginPath();
	var gradient = ctx.createLinearGradient(1, 30, 29, 30);
	gradient.addColorStop(0, '#919191');
	gradient.addColorStop(0.1, '#a3a3a3');
	gradient.addColorStop(0.4, '#dbdbdb');
	gradient.addColorStop(0.8, '#a3a3a3');
	gradient.addColorStop(1, '#5b5b5b');
	ctx.fillStyle = gradient;
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2.5;
	ctx.moveTo(27,3);
	ctx.lineTo(3,3);
	ctx.lineTo(13,13);
	ctx.lineTo(13,23);
	ctx.lineTo(17,27);
	ctx.lineTo(17,13);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	ctx.restore();
	
};