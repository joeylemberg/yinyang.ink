/*
	Sliders.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

var Sliders = {
	init: function(){
		this.bindSlider("pencil_size");
		this.bindSlider("brush_size");
		this.bindSlider("brush_hardness");	
		this.bindSlider("eraser_size");
		this.bindSlider("eraser_hardness");
		this.bindSlider("text_size");
		this.bindSlider("text_outline");
		this.bindSlider("zoom_disp");
		this.bindSlider("smudge_size");
		//gaton
		//this.quickSlide = Menus.home.href;
		$('body').on("focus", ".yang_integer", function(){
			$(this).val(parseInt($(this).val(),10));
		}).on("blur", ".yang_integer", function(){
			var slide = Sliders[$(this).attr("id")];
			var slideVal = parseInt($(this).val(),10);
			if(Util.isNumber(slideVal)){
				slide.value = Math.round(Math.min(Math.max(slideVal,slide.min),slide.max));
			}
			Sliders.setInput(slide);
			Sliders.drawSlide(slide);
			slide.onUpdate();
		});
	},
	drawSlide: function(slide){
		var ctx = slide.ctx;
		
		//clear slide canvas
		ctx.clearRect(0,0,slide.width,10);
		
		//redraw background and track
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.strokeStyle = "#3a3a3a";
		ctx.lineCap = "round"
		ctx.lineWidth = 1;
		ctx.fillRect(0,0,100,100);
		ctx.moveTo(3,5);
		ctx.lineTo(slide.width-3,5);
		ctx.stroke();
		
		//draw knob
		var x = slide.width/2;
		if(slide.value <= slide.med){
			x = ((slide.value-slide.min)/(slide.med-slide.min)) * (slide.width-6)/2 + 3;
		}else{
			x = ((slide.value-slide.med)/(slide.max-slide.med)/2 + 0.5)*(slide.width-6)+3;
		}
		ctx.beginPath();
		ctx.arc(x,5,3,0,6.29,1);
		ctx.fill();
		ctx.stroke();
	},
	setInput: function(slider){
		$("#" + slider.name).val(slider.value + "" + slider.unit);
	},
	bindSlider: function(id){
		var slideCanvas = $("#" + id + "_slider");
		var ctx = slideCanvas[0].getContext("2d");
		var slide = this[id];
		slide.ctx = ctx;
		this.drawSlide(slide);
		var binder = function(e){
			//click value on [0,1];
			if(!Input.toolState){
				var clickPix;
				if(e.offsetX != undefined){
					clickPix  = e.offsetX;
				}else{
					clickPix = e.originalEvent.layerX;
				}
				var clix = (clickPix-3)/(slide.width-6);
				clix = Math.min(Math.max(clix,0),1);
				if(clix <= 0.5){
					slide.value = slide.min + (clix*2)*(slide.med-slide.min);
				}else{
					slide.value = slide.med + (clix-0.5)*2*(slide.max-slide.med);
				}
				slide.value = Math.round(slide.value);
				Sliders.setInput(slide);
				Sliders.drawSlide(slide);
				slide.onUpdate();
			}
		};
		slideCanvas.click(binder);
		slideCanvas.mousemove(function(e){
			if(Input.click){// && !(Yang.tool && Yang.tool.path && Yang.tool.path)){
				binder(e);
			}
		});
		
		Sliders.setInput(slide);
		Sliders.drawSlide(slide);
		slide.onUpdate();
		
	},
	pencil_size: {
		name: "pencil_size",
		unit: "px",
		width: 60,
		value: 12,
		min: 1,
		med: 100,
		max: 999,
		onUpdate: function(){
			Tools.pencil.size = Sliders.pencil_size.value;
			Tools.pencil.refresh();
		}
	},
	brush_size: {
		name: "brush_size",
		unit: "px",
		width: 60,
		value: 60,
		min: 1,
		med: 88,
		max: 495,
		onUpdate: function(){
			Tools.brush.size = Sliders.brush_size.value;
			Tools.brush.refresh();
		}
	},
	brush_hardness: {
		name: "brush_hardness",
		unit: "",
		width: 60,
		value: 5,
		min: 1,
		med: 6,
		max: 12,
		onUpdate: function(){
			Tools.brush.hardness = Sliders.brush_hardness.value;
			Tools.brush.refresh();
		}
	},
	eraser_size: {
		name: "eraser_size",
		unit: "px",
		width: 60,
		value: 40,
		min: 1,
		med: 100,
		max: 999,
		onUpdate: function(){
			Tools.eraser.size = Sliders.eraser_size.value;
			Tools.eraser.refresh();
		}
	},
	eraser_hardness: {
		name: "eraser_hardness",
		unit: "",
		width: 60,
		value: 9,
		min: 1,
		med: 6,
		max: 12,
		onUpdate: function(){
			Tools.eraser.hardness = Sliders.eraser_hardness.value;
			Tools.eraser.refresh();
		}
	},
	text_size: {
		name: "text_size",
		unit: "px",
		width: 90,
		value: 32,
		min: 1,
		med: 30,
		max: 160,
		onUpdate: function(){
			Tools.text.size = Sliders.text_size.value;
			Tools.text.refresh();
			setTimeout(function(){$("#text_box").focus()}, 200);
		}
	},
	text_outline: {
		name: "text_outline",
		unit: "px",
		width: 60,
		value: 6,
		min: 0,
		med: 20,
		max: 60,
		onUpdate: function(){
			Tools.text.outlineSize = Sliders.text_outline.value;
			Tools.text.refresh();
			setTimeout(function(){$("#text_box").focus()}, 200);
		}
	},
	zoom_disp : {
		name: "zoom_disp",
		unit: "%",
		width: 90,
		value: 0,
		min: 5,
		med: 100,
		max: 999,
		onUpdate: function(){
			if(!Sliders.zoom_disp.value){
				Sliders.zoom_disp.value = Math.round(100/pxRatio);
				Sliders.setInput(Sliders.zoom_disp);
				Sliders.drawSlide(Sliders.zoom_disp);
			}
			Yang.setZoom(Sliders.zoom_disp.value/100);
			if($("#clipped_range").length){
				Clipboard.transformRange();
				Yang.ctx.clearRect(0,0,Pic.w,Pic.h);
				Clipboard.dashRange();
				Clipboard.drawData(Yang.ctx);
			}
			//if(Yang.tool && Yang.tool.name != "grabber" && Yang.tool.name != "painting_size"){
			//	$("#painting_size_cover").trigger("click");
			//}
			//Buttons.grabber.badTry = 1;
			//Yang.zoom = Sliders.zoom_disp.value/100;
			//Yang.Triggers.DispZoom();
		}
	},
	smudge_size: {
		name: "smudge_size",
		unit: "px",
		width: 60,
		value: 25,
		min: 1,
		med: 50,
		max: 259,
		onUpdate: function(){
			Tools.smudge.size = Sliders.smudge_size.value;
			Tools.smudge.refresh();
		}
	}/*,
	doc_width : {
		name: "doc_width",
		unit: "px",
		width: 90,
		value: 100,
		min: 5,
		med: 250,
		max: 999,
		onUpdate: function(){
			Yang.zoom = Sliders.zoom_disp.value/100;
			Yang.Triggers.DispZoom();
		}
	},
	doc_height : {
		name: "zoom_disp",
		unit: "px",
		width: 90,
		value: 100,
		min: 5,
		med: 250,
		max: 999,
		onUpdate: function(){
			Yang.zoom = Sliders.zoom_disp.value/100;
			Yang.Triggers.DispZoom();
		}
	},
	doc_unit_change: function(){
		var unit = $(this).val();
		Sliders.doc_height.unit = unit;
		Sliders.doc_width.unit = unit;
	}*/
};