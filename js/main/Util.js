/*
	Util.js
	Part of the Yang Canvas Paint Application
	By Joey Lemberg, joeylemberg@gmail.com
	January 29, 2014
	copyright Yang Canvas LLC, all rights reserved
*/

jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg) translate(-' +  Math.round(degrees/90) + '%, ' +  Math.round(degrees/90) + '%)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)',
				'webkit-transform-origin': '0 ' +  Math.round(degrees/90) + '%',
				'-moz-transform-origin': '0 ' +  Math.round(degrees/90) + '%'});

};

var Util = {
	hexToRgb: function (hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
	rgbToHex : function(r, g, b) {
		var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
		if (luma < 128) {
			$('#dropper_color').css('color','white');
		}else{
			$('#dropper_color').css('color','black');
		}
		return ((r << 16) | (g << 8) | b).toString(16);
	},
	dist: function(p1,p2){
		var dx = p1[0] - p2[0];
		var dy = p1[1] - p2[1];
		return Math.sqrt(dx*dx+dy*dy);
	},
	theta: function(p1,p2){
		var dx = p2[0] - p1[0];
		var dy = p2[1] - p1[1];
		return Math.atan2(dx,dy)
	},
	round2: function(n){
		return Math.round(n*100)/100;
	},
	isNumber: function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	},
	isHexColor : function(str) {
		if (str.indexOf("#") == 0)
		str = str.substring(1);
		if (str.length != 6)
		return false;
		return !/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(str);
	},
	humanFileSize: function(bytes, si) {
	    var thresh = si ? 1000 : 1024;
	    if(bytes < thresh) return bytes + ' B';
	    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	    var u = -1;
	    do {
	        bytes /= thresh;
	        ++u;
	    } while(bytes >= thresh);
	    return bytes.toFixed(1)+' '+units[u];
	}
};