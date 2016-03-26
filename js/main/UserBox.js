/*
	UserBox.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

var UserBox = {
	init: function(){
		
		var cover = "<div id='user_box_cover' style='position:fixed;top:0;left:0;z-index:99999;width:100%;height:100%;background-color:rgba(0,0,0,0.7);display:none;cursor:auto;padding:0px;'>";
		cover += '<div id="register_info" style="position:fixed;top:25;right:330;width:200px;text-align:right;color:white;"></div>';
		cover += '<div id="login_info" style="position:fixed;top:25;right:330;width:200px;text-align:right;color:white;"></div>';
		cover += "</div>";
		$("body").prepend(cover);
		
		var box = '<canvas id="user_box_x_box" class="x_box" width="20" height="20" style="position:absolute;top:85px;left:5px;z-index:10001;"></canvas>';
		box += '<div id="sign_in_table" class="user_account_table" style="position:absolute;top:110px;left:-10px;display:none;z-index:10000;">';
		box += '<form id="sign_in_form">';
		box += '<span class="account_table_left">email</span><input name="email" id="email" type="text" class="account_table_right" /><br/>';
		box += '<span class="account_table_left">password</span><input name="password" id="password" type="password" class="account_table_right" /><br/>';
		box += '<span class="account_table_left"></span><input type="submit" id="sign_in_button" class="user_box_button" value="login" />';
		box += '</form>';
		box += '</div>';
		box += '<div id="sign_up_table" class="user_account_table" style="position:absolute;top:78px;left:0px;display:none;z-index:10000;">';
		box += '<form id="sign_up_form">';
		box += '<span class="account_table_left">email</span><input class="account_table_right" type="text" name="email"/><br/>';
		box += '<span class="account_table_left">password</span><input class="account_table_right" type="password" name="password"/><br/>';
		box += '<span class="account_table_left">confirm password</span><input class="account_table_right" type="password" name="confirm_password" /><br/>';
		box += '<div align="right"><span class="account_table_right" style="font-size:10px;line-height:1;border:none;">I agree to the <a id="terms_of_use">terms of use</a>&nbsp;<input type="checkbox" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>';
		box += '<span class="account_table_left"></span><input type="submit" id="sign_up_button" class="user_box_button" value="Sign Up" />';
		box += '</form>';
		box += '</div>';
		box += '<span class="account_table_left"></span><input type="submit" value="Sign Up" />';
		box += '</div>';
		
		box += '<div id="slider_button_group" style="position:absolute;top:175px;left:16px;font-size:14px;z-index:10000;"><span id="sign_in_slider" class="text_button">Sign In</span> | <span id="sign_up_slider" class="text_button">Sign Up</span></div>';
		box += '<div id="slider_hider" style="position:absolute;top:173px;left:15px;display:none;"><span id="slider_hider_button" class="text_button">Hide</span></div>';
	//	cover += '</div>';
		$("#user_account_div").append(box);
		
		$("#sign_in_slider").click(function(){
			$("#register_info").html("");
			$("#user_account_div").animate({"top":"-95px","right":"-100px"},150);
			$("#user_account_div").css("z-index","99999");
			$("#slider_button_group").hide();
			$("#slider_hider").show();
			$("#sign_in_table").show();
			$("#user_box_cover").fadeIn();
			$("#user_box_x_box").css("top","98px");
		//	Yang.alertCtx.clearRect(0,0,1000,1000);
		});
		
		$("#sign_up_slider").click(function(){
			$("#login_info").html("");
			$("#user_account_div").animate({"top":"-70px","right":"-100px"},150);
			$("#user_account_div").css("z-index","99999");
			$("#slider_button_group").hide();
			$("#slider_hider").show();
			$("#sign_up_table").show();
			$("#user_box_cover").fadeIn();
			$("#user_box_x_box").css("top","73px");
		//	Yang.alertCtx.clearRect(0,0,1000,1000);
		});
		
		$("#slider_hider_button, #user_account_x_box").click(function(){
			UserBox.hideBox();
		});
		
		    $("form").submit( function(e) {
				$("input").blur();

				console.log($(this).attr('id'));

		    	switch($(this).attr('id')){

		    	case "sign_in_form":
					if(login != undefined){
						login("sign_in_form", function(response){
							if(response.id != undefined && response.email != undefined){
								user = {
									id:response.id,
									email:response.email
								};
								UserBox.showEmail();
							}
						});
					}
		    		break;

		    	case "sign_up_form":
		    		if(register != undefined){
						register("sign_up_form", function(response){
							if(response.id != undefined && response.email != undefined){
								user = {
									id:response.id,
									email:response.email
								};
								UserBox.showEmail();
							}
						});
					}
		    		break;

		    	}
		    	e.preventDefault();

		    });
	},
	hideBox: function(){
		$("#slider_button_group").show();
		$("#slider_hider").hide();
		$("#sign_in_table, #sign_up_table").hide();
		$("#user_account_div").animate({"top":"-170px","right":"-250px"}, 150, function(){
			$("#user_account_div").css("z-index","90");
		});
		$("#user_box_cover").fadeOut();
	},
	showEmail: function(){
		UserBox.hideBox();
		$("#slider_button_group").hide();
		$("#slider_hider").hide();
		$("#sign_in_table, #sign_up_table").hide();
		$("#user_box_cover").fadeOut();
		
		var fontSize = 16;
		var ctx = $("#user_menu")[0].getContext("2d");
		ctx.font = 'bold ' + fontSize + 'px Courier';
		while(ctx.measureText(user.email).width > 250){
			fontSize--;
			ctx.font = 'bold ' + fontSize + 'px Courier';
		}
		var scaler = 200/ctx.measureText(user.email).width;
		if(200/ctx.measureText(user.email).width < 1){
			ctx.scale(scaler,1);
		}else{
			ctx.translate(5,-1);
		}
		ctx.lineJoin = "round";
		$("#user_account_div").animate({"top":"-170px","right": "-190px"}, 150, function(){
			$("#user_account_div").css("z-index","90");
		});
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'white';
		ctx.lineWidth = fontSize/5;
		ctx.strokeText(user.email,5+fontSize/8,185.5 + fontSize/6);
		ctx.fillText(user.email,5+fontSize/8,185.5 + fontSize/6);
		$("#user_account_div").click(function(){
			window.location = "account.htm";
		});
		$("#user_menu").css("cursor","pointer");
		
	}
};