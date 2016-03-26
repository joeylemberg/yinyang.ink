// Copyright Joey Lemberg and other contributors.
// Released under the MIT license; http://yinyang.ink/license

Tools.upload = {
	holder: null,
	tests: null,
	support: null,
	acceptedTypes: null,
	progress: null,
	fileupload: null,
	image: null,
	imgObj: null,
	dragged: true,
	active: 0,
	
	init : function(){
		
		$("body").append('<input id="browse_for_upload" type="file" style="display:none;"/>');
		
		this.holder = document.getElementById('doc_body');
		this.progress = document.getElementById('uploadprogress');
		this.fileupload = document.getElementById('upload');
		
		this.tests = {
	      filereader: typeof FileReader != 'undefined',
	      dnd: 'draggable' in document.createElement('span'),
	      formdata: !!window.FormData,
	      progress: "upload" in new XMLHttpRequest
	    };
	
		this.support = {
	      filereader: document.getElementById('filereader'),
	      formdata: document.getElementById('formdata'),
	      progress: document.getElementById('progress')
	    };
		
		"filereader formdata progress".split(' ').forEach(function (api) {
		  if (Tools.upload.tests[api] === false) {
		    Tools.upload.support[api].className = 'fail';
		  }
		});
		
		this.acceptedTypes = {
	      'image/png': true,
	      'image/jpeg': true,
	      'image/gif': true,
	'text/yyc': true
	    };
	
		$("#browse_for_upload").change(function(e){
			//console.log(e);
			this.className = '';
			$('#biggest_div').removeClass('greened_up',100);
		    e.preventDefault();
			Tools.upload.dragged = false;
		    Tools.upload.readfiles(this.files);
		
		});
	
		if (Tools.upload.tests.dnd) { 
			document.ondragover = function () {
				this.className = 'hover';
				$('#biggest_div').addClass('greened_up',100);
				return false;
			};
			document.ondragleave = function () {
				this.className = '';
				$('#biggest_div').removeClass('greened_up', 100);
				return false;
			};
			document.ondragend = function () {
				this.className = '';
				$('#biggest_div').removeClass('greened_up',100);
				return false;
			};
			document.ondrop = function (e) {
				//console.log(e);
		    this.className = '';
			Tools.upload.dragged = true;
			$('#biggest_div').removeClass('greened_up',100);
		    e.preventDefault();
		    Tools.upload.readfiles(e.dataTransfer.files);
		  }
		} else {
		  Tools.upload.fileupload.className = 'hidden';
		  Tools.upload.fileupload.querySelector('input').onchange = function () {
		    Tools.upload.readfiles(this.files);
		  };
		}
		
		//Web image draggin
		$(document).on('dragover', function(e) {
		     e.preventDefault();
		});
		$(document).on('drop', function(e) {
		    e.preventDefault();
				var imgSrc = "";
				
				for(var i = 0; i < e.originalEvent.dataTransfer.items.length && !imgSrc.length; i++){
				    e.originalEvent.dataTransfer.items[i].getAsString(function(str){
						var endDex = 0;
						var startDex = 0;
						if(str.indexOf(".jpg") > 0){
							endDex = str.indexOf(".jpg") + 4;
						}else if(str.indexOf(".jpeg") > 0){
							endDex = str.indexOf(".jpeg") + 5;
						}else if(str.indexOf(".png") > 0){
							endDex = str.indexOf(".png") + 4;
						}else if(str.indexOf(".gif") > 0){
							endDex = str.indexOf(".gif") + 4;
						}
						if(endDex){
							console.log("LETS DOIT");
							console.log(str);
							str = str.substring(0,endDex);
							console.log(str)
							console.log("now trim the front");
							var trimming = true;
							while(trimming){
								var lastQuote = -1;
								if(str.indexOf("'") != -1){
									lastQuote = str.indexOf("'");
								}else if(str.indexOf('"') != -1){
									lastQuote = str.indexOf('"');
								}
								if(lastQuote != -1){
									str = str.slice(lastQuote+1);
								}else{
									trimming = false;
								}
							}
							if(!Tools.upload.busy){
								Tools.upload.busy = 1;
								try{
									Tools.upload.addImage(str);
								}catch (e){
									Tools.upload.busy = 0;
									console.log(e);
								}
								
							}
						}
					});
				}
		});
		
	},
	
	addImage: function(src, filename, noDummy){
		
		var imageObj = new Image();
			imageObj.src = src;
		
		
	      imageObj.onload = function() {
				if(Yang.tool.unselect){
					Yang.tool.unselect();
				}
				
				$("#selector").trigger("click");
				
				var details = {
	 				tool:"upload",
	 				name:"img",
	 				data:document.createElement("canvas"),
	 				layer:Yang.layer
	 				};
		
			
						var scaler = 1;
						
						var w = imageObj.width;
						var h = imageObj.height;
					if(!History.actions.length){
						scaler = Math.min(scaler, Config.maxSize/imageObj.width);
						scaler = Math.min(scaler, Config.maxSize/imageObj.width);
						
						
					}else{
						if(Tools.settings.opts.new_layers_for_uploads){
							if(filename == undefined){
								filename = "upload_" + (Date.now()%281);
							}
							details.newLayer = filename;
							details.layer = Pic.Layers.length;
							Yang.newLayer(filename);
							Yang.selectLayer(details.layer);
						}
						scaler = Math.min(scaler, Pic.w/imageObj.width);
						scaler = Math.min(scaler, Pic.h/imageObj.height);
					}
					w = Math.round(w*scaler);
					h = Math.round(h*scaler);
					details.w = w;
					details.h = h;
					details.data.width = w;
					details.data.height = h;
					details.data.getContext("2d").drawImage(imageObj, 0,0,w,h);
					
					
					details.layer = Yang.layer;
					if(!History.actions.length){
						if(filename != undefined){
							$("#picture_title").val(filename).trigger("blur");
						}
						Tools.size.resize(w,h);
						$(".history_tile").remove();
						History.act(details);
							History.add(details);/*{
								tool:"upload",
								layer: Yang.layer,
								isDummy: 1
							});*/
						//History.add(details);
						$("#picture_size_button").trigger("click");
						var z = 0.7 * Math.min($(window).width()/w,$(window).height()/h);
						Yang.left = 145;
						Yang.top = 105;
						$("#zoom_disp").val(z*100).trigger("blur");
					}else{
						History.act(details, Yang.ctx);
						History.add({
							tool:"upload",
							layer: Yang.layer,
							isDummy: 1
						});
						//History.add(details);
						Clipboard.start = {
							x : 0,
							y : 0,
							w : w,
							h : h,
							nodelete: 1,
							path : [],
							theta : 0
						};
						Clipboard.data = imageObj;
						Clipboard.range = $.extend({}, Clipboard.start);
						Clipboard.prev = $.extend({}, Clipboard.start);
						Clipboard.start.realTool = "upload";
						Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
						Clipboard.makeRange();
						Clipboard.dashRange();
						Clipboard.drawData(Yang.ctx);
					}
					
					
					Tools.upload.busy = 0;
			}
	},
	
	previewfile : function(file) {
	  if (Tools.upload.tests.filereader === true && Tools.upload.acceptedTypes[file.type] === true) {
		
	    var reader = new FileReader();
	    reader.onload = function (event) {
			if(!Tools.upload.busy){
				Tools.upload.busy = 1;
				try{
					if(file.name != undefined){
						Tools.upload.addImage(event.target.result, file.name.split(".")[0]);
					}else{
						Tools.upload.addImage(event.target.result);
					}
					
				}catch (e){
					Tools.upload.busy = 0;
					console.log(e);
				}
			}
		      };
		      
	    }
		try{
			reader.readAsDataURL(file);
		}catch (e){
			alert("File couldn't be read as an image.");
		}
	    
	},
	readfiles: function(files) {
		//console.log(files);
	    var formData = Tools.upload.tests.formdata ? new FormData() : null;
	    for (var i = 0; i < files.length; i++) {
	      	if (Tools.upload.tests.formdata){
				formData.append('file', files[i]);
	      		Tools.upload.previewfile(files[i]);
			}
	    }
	}
};

Tools.upload.draw = function(ctx){
	ctx.beginPath();
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
	radgrad.addColorStop(0, 'rgba(0, 188, 0, 1)');
	radgrad.addColorStop(1, 'rgba(0, 218, 0, 1)');

	ctx.closePath();
	ctx.fillStyle = radgrad;
	ctx.fill();
	ctx.stroke();
	
};