// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

$(document).bind('touchmove', false);
var Input = {
	click: 0,
	toolState: 0,
	overPic: 0,
	isAction: 0,
	shiftDown: 0,
	macDown: 0,
	contextHover: 0,
	init: function(){
		

		$(document).bind('touchstart', function(){
			if(Clipboard.active){
				Clipboard.checkMouse();
			}
			
			if(e.pageX && e.pageY){
				Input.mouseX = e.pageX;
			 	Input.mouseY = e.pageY;
				if(Yang.tool){
					$('#cursor_canvas').css({
						'left': (Input.mouseX + Yang.tool.xOffset) + 'px',
						'top': (Input.mouseY + Yang.tool.yOffset) + 'px'
					});
				}
				Input.x = (Input.mouseX - Yang.left) / Yang.zoom;
				Input.y = (Input.mouseY - Yang.top) / Yang.zoom;
				
			}
			if(Yang.tool){
				try{
					Yang.tool.press();
				}catch(e){}
				
			}
		});

		$(document).bind('touchstart', function(){
			if(Clipboard.active){
				Clipboard.checkMouse();
			}
			
			if(e.pageX && e.pageY){
				Input.mouseX = e.pageX;
			 	Input.mouseY = e.pageY;
				if(Yang.tool){
					$('#cursor_canvas').css({
						'left': (Input.mouseX + Yang.tool.xOffset) + 'px',
						'top': (Input.mouseY + Yang.tool.yOffset) + 'px'
					});
				}
				Input.x = (Input.mouseX - Yang.left) / Yang.zoom;
				Input.y = (Input.mouseY - Yang.top) / Yang.zoom;
				
			}
			if(Yang.tool){
				try{
					Yang.tool.hold();
				}catch(e){}
				
			}
		});

		$(document).bind('touchend', function(){
			if(Clipboard.active){
				Clipboard.checkMouse();
			}
			
			if(e.pageX && e.pageY){
				Input.mouseX = e.pageX;
			 	Input.mouseY = e.pageY;
				if(Yang.tool){
					$('#cursor_canvas').css({
						'left': (Input.mouseX + Yang.tool.xOffset) + 'px',
						'top': (Input.mouseY + Yang.tool.yOffset) + 'px'
					});
				}
				Input.x = (Input.mouseX - Yang.left) / Yang.zoom;
				Input.y = (Input.mouseY - Yang.top) / Yang.zoom;
				
			}
			if(Yang.tool){
				try{
					Yang.tool.release();
				}catch(e){}
				
			}
		});


		$("#context_menu").hover(function(){
			Input.contextHover = 1;
		},	function(){
				Input.contextHover = 0;
			});
			
		//gaton
		//this.place = window.location.origin;
		
		$(document).mousedown(function(){
			
			if(!Input.contextHover){
				$("#context_menu").hide();
			}
			
			Input.click = 1;
			if(Yang.tool && Input.toolState == 0){
				
				if(Yang.tool.noPreviewClear == undefined){
					Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
				}
				
				
				
				
				if(Input.overPic){
					Input.isAction = 1;
					Yang.tool.press();
					//Tools.layers.fadeOthers();
					Input.toolState = 1;
				}else{
					Input.isAction = 0;
					if(Yang.toolName == "text"){
						if(!Tools.text.menuHover && !$(":focus").length){
							Yang.stopTool();
						}
					}else{
						Yang.stopTool();
					}
				}
			}
		}).mouseup(function(){
			Input.click = 0;
			if(Yang.tool && Input.toolState > 0){
				if(Input.isAction){
					Yang.tool.release();
					//Tools.layers.showOthers();
				}
				Input.toolState = 0;
			}
		}).mousemove(function(e){
			
			if(Clipboard.active){
				Clipboard.checkMouse();
			}
			
			if(e.pageX && e.pageY){
				Input.mouseX = e.pageX;
			 	Input.mouseY = e.pageY;
				if(Yang.tool){
					$('#cursor_canvas').css({
						'left': (Input.mouseX + Yang.tool.xOffset) + 'px',
						'top': (Input.mouseY + Yang.tool.yOffset) + 'px'
					});
				}
				Input.x = (Input.mouseX - Yang.left) / Yang.zoom;
				Input.y = (Input.mouseY - Yang.top) / Yang.zoom;
				
			}
			if(Input.click && Yang.tool && Input.toolState == 1){
				Yang.tool.hold();
			}
			
			
			
			if(Yang.tool && !Input.click && Yang.tool.drawPreview != undefined){
				Yang.tool.drawPreview();
			}
			
			if(Yang.tool && Input.toolState == 0 && Input.click){
				if(Input.overPic){
					Input.isAction = 1;
					Yang.tool.press();
					//Tools.layers.fadeOthers();
					Input.toolState = 1;
				}
			}
			
		});
		
	
		$("#picture").hover(
			function(){
				if($(':focus').hasClass("color")){
					$(':focus').trigger("blur");
				}
				if(Input.toolState){
					Input.isAction = 1;
				}
				Input.overPic = 1;
				Tools.layers.fadeOthers();
			},
			function(){
				Tools.layers.showOthers();
				Input.overPic = 0;
			}
		);
		
		$(document).keyup(function(e){
			if(e.keyCode == 16){
				Input.shiftDown = 0;
			}
			if(e.keyCode == 91){
				Input.macDown = 0;
			}
		});
		
			$(document).keydown(function(e){
				
				if(e.keyCode == 16){
					Input.shiftDown = 1;
				}
				if(e.keyCode == 91){
					Input.macDown = 1;
				}
				
				if(e.keyCode == 8){
					if(!$(":focus").length){
						e.preventDefault();
					}
				}
				
				if(!$(":focus").length){
					if(Input.macDown){
						e.ctrlKey = true;
					}
					switch(e.keyCode){
						case 88: case 89: case 90: case 86: case 67:
							if(e.keyCode == 88 && e.ctrlKey){
								ContextMenu.context_cut();
							}else if(e.keyCode == 67 && e.ctrlKey){
								ContextMenu.context_copy();
							}else if(e.keyCode ==  86 && e.ctrlKey){
								ContextMenu.context_paste();
							}else if(e.keyCode == 89 && e.ctrlKey){
								Tools.redo.click();
							}else if(e.keyCode ==  90 && e.ctrlKey){
								Tools.undo.click();
							}
							break;
							
						default:
							if(e.keyCode == 8 || e.keyCode == 46){
													ContextMenu.context_delete();
												}else{
													for(i in Tools.settings.shortcuts){
														if(e.keyCode == Tools.settings.shortcuts[i]){
															if(Tools[i].no_cover != undefined){Tools[i].click();
															}else{
																$(".button_cover").each(function(){
																	if($(this).attr("data-key") == i){
																		Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
																		$(this).trigger("click");
																	}
																});
															}
														}
													}
												}
							
							break;
						
						
					}
					
					
				
					
				}
				
			});
		
		
	}
};