/*
	about.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

Tools.about = {
	edge:'top-right',
	enText:'about Yin Yang Paint',
	chText:'       关于阴阳画',
	selectable: 0,
	lilyInt: 0,
	init: function(){
		Menus.addButtonCover(612,5,"about");
		var cover = "<div id='about_cover' class='user-selectable' style='position:fixed;top:0;left:0;z-index:99999;width:100%;height:100%;background-color:rgba(0,0,0,0.7);display:none;cursor:auto;padding:0px;'>";
		cover += '<canvas id="about_x_box" class="x_box" width="20" height="20"></canvas>';
		cover += "<div style='background-color:white;position:fixed;top:6%;left:6%;padding:4%;position:relative;overflow-y:scroll;height:75%;width:80%;'>";
		cover += "<b style='font-size:32px;position:relative;top:-15px;left:28px;'>About YinYangPaint</b>";
		cover += "<div id='about_pages'>";
		cover += "<span data-page='basics' class='about_page_tab' id='about_basics'><canvas class='about_canvas' width='26' height='26'></canvas>Overview</span>";
		cover += "<span data-page='how' class='about_page_tab'><canvas class='about_canvas' width='26' height='26'></canvas>Author</span>";
		cover += "<span data-page='tools' class='about_page_tab'><canvas class='about_canvas' width='26' height='26'></canvas>Dedication</span>";
		cover += "<span data-page='more' class='about_page_tab'><canvas class='about_canvas' width='26' height='26'></canvas>Donate</span>";
		//cover += "<span data-page='author' class='about_page_tab'><canvas class='about_canvas' width='26' height='26'></canvas>author</span>";
		cover += "</div>";
		cover += "<div id='about_content' style='margin-top:24px;'></div>";
		cover += "</div>";
		cover += "</div>";
		
		cover += "</div>";
		$("body").prepend(cover);
		
		$(".about_canvas").each(function(){
		var ctx = this.getContext("2d");
			ctx.scale(0.9,0.9);
			Tools.about.draw(ctx);
		});
		
		$("#about_x_box").click(function(){
			clearInterval(Tools.about.lilyInt);
		});
		
		$(".about_page_tab").click(function(){
			$(".active_about_tab").removeClass("active_about_tab");
			$(this).addClass("active_about_tab");
			$("#about_content").html(Tools.about.pages[$(this).attr("data-page")]);
			clearInterval(Tools.about.lilyInt);
			if($(this).attr("data-page") == "tools"){
				$(document).ready(function(){
					$("#lily").fadeIn();
					$("#lily>img").css("position","relative").css("margin-right","5px").css("height","100%");;

						var first = $("#lily>img").first();
						var left = -1 * $("#lily>img").width();
					Tools.about.lilyInt = setInterval(function(){

						left++;
						first.css("margin-left",left + "px");

						if(left >= 0){
							first.css("margin-left",left + "px");
							first = $("#lily>img").last();
							left = -1 * first.width() -4;
							first.css("margin-left",left + "px");
							first.prependTo($("#lily"));
						}
					},50);
				});
			}else{
				clearInterval(Tools.about.lilyInt);
			}
			
			
		});
		
		this.pages.init();
	},
	click: function(){
		$("#about_cover").fadeIn();
		$("#about_content").html(Tools.about.pages.basics);
		$("#about_basics").addClass("active_about_tab").siblings().removeClass("active_about_tab");
	},
	pages: {
		init: function(){
			
			
			this.basics = "<h3>What is YinYangPaint?</h3>";
			this.basics += "YinYangPaint is an image editor built around the HTML canvas.  It is much more than merely a demo, but is evidently not complete enough to compete with commercial image editors.<br/><br/>";
			this.basics += "It seems inevitable that an in-browser image editor will rise to join the most popular graphics software.  YinYangPaint is not that application, but it is still quite capable and I hope you might find it useful";
			this.basics += "<br/><blockquote style='border-left:5px solid #1b3f6d;color:#1b3f6d;font-size:12px;font-family:Courier, monospace;padding-left:24px;padding-right:24px;'>";
			this.basics += "As powerful as <i>Photoshop</i><sup style='font-size:9px;'>*</sup> and as easy to use as <i>Paint</i>, <i>YinYangPaint</i> provides a complete toolset for editing and creating images in the browser.  The full program works with all modern browsers without any installation or plugins.<br/><br/>";
			this.basics += "Features include full support of layers, drag and drop image importing, resizing, rotating, color sampling, text with outlines, gradients, smudging, history with undo/redo, png exporting with alpha, and much more.<br/><br/>";
			this.basics += "<span style='font-size:8px;margin-left:24px;'><sup>*</sup>obvious exaggeration</i>";
			this.basics += "</blockquote><br/>";
			this.basics += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;So there you have it.  Have fun with YinYangPaint.<br/>";
			this.basics += "<i style='font-size:12px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—Joey Lemberg</i>";
			this.author = "YinYangPaint was programmed by Joey Lemberg.<br/><br/>";
			this.author += "The project is open sourced using the MIT license, so please <a href='https://github.com/joeylemberg/yinyangpaint'>check it out on github</a> if you are at all interested.  I have already given a lot of myself to this project, and I am very seriously hoping that you might want to pick this project up.  I'm the project owner for now, but I am hoping to pass the reigns to a fresh soul.<br/><br/>";
			this.author += "Shoot an email to <a href='mailto:joeylemberg@gmail.com'>joeylemberg@gmail.com</a> if you would like to get in touch for any reason.<br/><br/>";
			//this.author += "YangCanvas is dedicated to <a href='lily.html' target='_blank'>Lily Campbell</a>, a very special cat who is no longer with us.<br/><br/>";
			//this.author += "© Copyright 2014, YangCanvas LLC, all rights reserved.";
			/*this.how = "<b>How to Use YangCanvas</b><br/><br/>";
			this.how += "YangCanvas is best for modifying and enhancing exisiting pictures, though it can also be used to produces pictures from scratch.</br></br>";
			this.how += "Editing a picture is easy as could be, and you can import an image in the following ways:<br/><br/>";
			this.how += "<ul><li  style='margin-bottom:1em;'>drag and drop a picture from your computer</li><li  style='margin-bottom:1em;'>click the folder icon in the top left to open an image from your computer.</li></ul>";
			this.how += "Once your picture is loaded, you can edit it freely and download your final work directly and immediately.  Other pictures can be added to one another by dragging them into an open picture.<br/><br/>";
			this.how += "Layer controls in the bottom left are an essential tool for making complex composite works.<br/><br/>";
			this.how += "This text you are reading is merely a stub of what I hope to write here in the near future.  Until then, you will just have to play around to figure it out!";
			*/
			this.how = this.author;
			this.tools = "<h3 style='text-align:center;'>Dedicated to the memory of Lily Campbell</h3>";
			this.tools += "<div id='lily' style='display:none;width:100%;white-space: nowrap;position:relative;overflow:hidden;height:240px;margin-bottom:12px;'><img src='img/lily/lily_suitcase_old.png'><img src='img/lily/lily_floor.png'><img src='img/lily/lily_tummy.png'><img src='img/lily/lily_suitcase.png'><img src='img/lily/lily_sit.png'><img src='img/lily/lily_basket.png'><img src='img/lily/lily_and_lacy.png'></div>";
			this.tools += "<p id='for_lily' style='font-size:14px;text-align:left;max-width:450px;margin:auto;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I never really had a pet growing up, so Lily was the first furry little animal with whom I formed a meaningful relationship.&nbsp;  Lily and I lived together for more than a year, and at times she was the person I spent the most time with.&nbsp;  No matter what was going on in the world or in my head, Lily was perfect--always a little bundle of positive energy and warm emotions.&nbsp;  Her company  raised spirits anytime day or night, and in return she showed her appreciation for the company of those around her.&nbsp;  Her purr conveyed pure comfort and happiness so clearly that you couldn't help but share in her good feelings.&nbsp; She could hold a grudge and get angry, but this just made her affection feel all the more real.<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For her last 3 months among us, Lily was a part-time outdoor cat living alongside 4 other cats, 2 dogs, and 2 humans.&nbsp;  We take comfort in knowing that she was very happy during this final chapter of her life.&nbsp;  On the night of Sunday November 10th, 2013, a reckless driver cut Lily's life short.<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This silly Yin Yang Paint program has a lot of my heart, mind, and soul in it, so I dedicate it to Lily.&nbsp;  She was with me when I started working on this project, and I will keep her in my thoughts as I finish my work on it.&nbsp; I am very grateful to have known such a wonderful cat.&nbsp;  Qu&#x00E9; buena gat&#x00F3;n.<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I miss you Lily, and you'll always have a place in my heart.</p>";
			//this.tools = "<a href='tools.html' target='_blank'>Link to a detailed guide on how to use every single tool.</a>";
			/*this.tools = "<b>Details on Using Every Tool</b><br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='size'></canvas> <b class='about_tool_title'>Picture Size</b></br>";
			this.tools += "Set and modify picture width and height.  Use to <canvas width='20' height='20' class='about_tools_canvas button_drawing' data-tool='rotate'></canvas> rotate pictures too.  Flip pictures horizontally <canvas width='20' height='20' class='about_tools_canvas button_drawing' data-tool='width'></canvas> and vertically <canvas width='20' height='20' class='about_tools_canvas button_drawing' data-tool='height'></canvas>.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='pencil'></canvas> <b class='about_tool_title'>Pencil</b></br>";
			this.tools += "Click and drag to draw solid lines.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='brush'></canvas> <b class='about_tool_title'>Brush</b></br>";
			this.tools += "Like the pencil, but the strokes made with the brush are textured.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='eraser'></canvas> <b class='about_tool_title'>Eraser</b></br>";
			this.tools += "Click and drag delete content from your picture.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='text'></canvas> <b class='about_tool_title'>Text</b></br>";
			this.tools += "Add text to pictures.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='selectbox'></canvas> <b class='about_tool_title'>Box Select</b></br>";
			this.tools += "Blur and blend pieces of pictures.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='selectfree'></canvas> <b class='about_tool_title'>Free Select</b></br>";
			this.tools += "Cut or copy a rectangular selection to the clipboard.  Then you may move, rotoes, and resize the selection.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='smudge'></canvas> <b class='about_tool_title'>Smudge</b></br>";
			this.tools += "Like Box Select, except you can select a range of any shape.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='magicwand'></canvas> <b class='about_tool_title'>Magic Wand</b></br>";
			this.tools += "Select a range of pixels of similar color.<br/><br/>";
			this.tools += "<canvas width='30' height='30' class='about_tools_canvas' data-tool='dropper'></canvas> <b class='about_tool_title'>Dropper</b></br>";
			this.tools += "Sample colors from pictures.<br/><br/>";*/
			
			this.more = '<div style="text-align:center">YinYangPaint is free with no ads, so if can spare it,<br/>please consider donating to the person who made this.<br><br>';
			this.more += '<br/>';
			this.more += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">';
			this.more += '<input type="hidden" name="cmd" value="_s-xclick">';
			this.more += '<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----">';
			this.more += '<input id="paypal-clicker" type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">';
			this.more += '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">';
			this.more += '</form>';
			this.more += '<img src="img/bitcoin-qr.png" style="padding:24px;background-color:white;"><br/>';
			this.more += '<b style="background-color:#c4c4c4;padding:8px;display:inline-block;margin-bottom:16px;-moz-user-select: auto;-khtml-user-select: auto;-webkit-user-select: auto;-o-user-select: auto;" id="bitcoin-address">1KG8xKUinXBDjq3TTkizPUFvdvPnqfZVae</b>';
			this.more += '</div>';
		},
		basics: "Hello World!"
	}
}

Tools.about.draw = function(ctx){
	ctx.save();
	ctx.scale(1.25,1);
	ctx.beginPath();
	ctx.fillStyle = '#A0C9FF';
	ctx.strokeStyle='#000';
	ctx.lineWidth = 4;
	ctx.font = "17pt Tahoma";

	ctx.strokeText("?", 7, 24);
	ctx.fillText("?", 7, 24);
	//ctx.fillText("?", 10, 22);
	ctx.restore();
};