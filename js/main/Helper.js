var Helper = {
	canvas: null,
	ctx: null,
	enabled: true,
	showing: false,
	help: [
		{
			onlyIf: function(){return true;},
			arrow: null,
			arrow: {x: 224, y:56, t:0, clase:"animated bounce"},
			tools: ["openfile"],
			str: "Hello!  Thanks for trying out YinYangPaint. <br> Drag and drop a picture or just start drawing to get started. <br> <br> You can also click the open button ..... to import a picture the old fashioned way."
		
		},
			{
				onlyIf: function(){
					if(Yang.toolName != "grabber"){
						return true;
					}
					return false;
				},
				arrow: {x: 428, y:50, t:0, clase:"animated wobble"},
				tools: ["zoomin", "zoomout", "grabber"],
				str: "These are the view controls.  Click and drag the zoom slider to set the zoom level. The zoom buttons  ..... ..... also work. <br> <br> To position the canavas use the mover tool .....  Once selected, click and drag the canvas around as you please."
			},
		{
			onlyIf: function(){
				if(Yang.toolName != "size"){
					return true;
				}
				return false;
			},
			arrow: {x: 70, y:130, t:270, clase:"animated bounce"},
			tools: ["size",function(ctx){Tools.size.drawStretch(ctx);},function(ctx){Tools.size.drawLock(ctx);}],
			str: "Select the resizer ..... resize, flip, rotate, or flip your picture. <br> <br> Click the lock ... crop your image without stretching. <br> <br> WARNING: Using the size tool erases your history, so after resizing your image you will not be able to undo your past edits."
		}
	],
	init: function(){
        
        if(!Config.tutorial){
            return;
        }
        
		$("#helper-text-button-1").click(function(e){
			Helper.clear();
			e.stopPropagation();
		});
		$("#helper-text-button-2").click(function(e){
			Tools.settings.opts.helper_text = false;
			Helper.clear();
			e.stopPropagation();
		});
		
		this.canvas = $("#helper-text-canvas")[0];
		this.ctx = this.canvas.getContext("2d");
		
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.globalCompositeOperation = "destination-over";
		ctx.lineJoin = "round";
		ctx.beginPath();
		ctx.strokeStyle = '#d6d6d6';
		ctx.font = 'bold 15px Arial';
		ctx.lineWidth = 2;
		setTimeout(function(){
			Helper.write(Helper.help.shift());
		}, 1000);
	},
	clear: function(){
		var ctx = this.ctx;
		$(".helper-text").fadeOut("slow");
		setTimeout(function(){
			if(Helper.help.length){
				Helper.write(Helper.help.shift());
			};
		}, 500);
	},
	write: function(obj){
		
		var str = obj.str;
		var arrow = obj.arrow;
		var tile = obj.tile;
		var tools = obj.tools;
		
		if(Tools.settings.opts.helper_text){
		
			var ctx = this.ctx;
			ctx.clearRect(0,0,600,200);
		
			
		
		
			var words = str.split(" ");
			var line = "";
			var n = 0;
			var max = 0;
			var tool = 0;
		
			ctx.beginPath();
			ctx.strokeStyle = 'black';//rgba(225,225,225,0.8)';
			ctx.fillStyle = 'white';
			ctx.lineWidth = 3;
			
			
			if(tile){
				Tools[tile].draw(ctx);
			}
			
			while(words.length){
				line = "";
				while(words.length && ctx.measureText(line).width < 460){
					if(words[0] == "<br>"){
						words.shift();
						break;
					}
					if(words[0] == "....."){
						ctx.save();
						ctx.translate(ctx.measureText(line).width+14, 13 + n*18);
						ctx.scale(0.8,0.8);
						ctx.fillStyle="white";
						ctx.strokeStyle = "#c9c9c9";
						ctx.lineWidth = 2;
						ctx.globalCompositeOperation = "source-over";
						//ctx.fillRect(1,1,28,28);
						//ctx.strokeRect(0,0,30,30);
						Tools[tools[tool]].draw(ctx);
						ctx.restore();
						words[0] = "     ";
						tool++;
					}
					if(words[0] == "..."){
						ctx.save();
						ctx.translate(ctx.measureText(line).width+16, 15 + n*18);
						ctx.beginPath();
						//ctx.fillStyle="white";
						//ctx.strokeStyle = "#c9c9c9";
						ctx.lineWidth = 1;
						ctx.globalCompositeOperation = "source-over";
						//ctx.fillRect(1,1,18,18);
						tools[tool](ctx);
						ctx.restore();
						words[0] = "  .  ";
						tool++;
					}
					line += (line.length?" ":"") + words.shift();
				}
				ctx.beginPath();
				ctx.fillText(line, 11,30 + n*18);
				ctx.strokeText(line, 11,30 + n*18);
				if(ctx.measureText(line).width > max){
					max = ctx.measureText(line).width;
				}
				n++;
			}
		
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#d6d6d6';
			ctx.fillStyle = 'rgba(0,0, 208, 0.3)';
			ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(3,3,max+20,n*18 + 24);
			ctx.strokeRect(3,3,max+20,n*18 + 24);
			
			
			$("#helper-text-canvas, #helper-text-button-1, #helper-text-button-2").fadeIn("slow");
			clearTimeout(Helper.timer);
			Helper.timer = setTimeout(function(){
				Helper.clear();
			}, 3000 + str.length*50);
			
			if(arrow){
				setTimeout(function(){
					$("#helper-arrow").fadeIn("slow");
					$("#helper-arrow").css({"top":arrow.y+"px","left":arrow.x+"px"});
					$("#helper-arrow").rotate(arrow.t);
					$("#animated-example").attr("class", arrow.clase);
				}, 2000);
			}else{
				$("#helper-arrow").hide();
			}
			
			
		}
		
			
	}
}