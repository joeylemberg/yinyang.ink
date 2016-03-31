var drawDropper = function(ctx){
	//glass
	ctx.beginPath();
	//ctx.translate(1.5,1.5);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(17.5,9.5);
	ctx.lineTo(7.5,19.5);
	ctx.quadraticCurveTo(9,19,5,24);
	ctx.lineTo(6,25);
	//ctx.lineTo(6,25);
	ctx.quadraticCurveTo(6,25,11,21);
	ctx.lineTo(10.5,22.5);
	ctx.lineTo(20.5,12.5);
	ctx.closePath();
	ctx.fillStyle="rgba(225,225,225,0.8)";
	ctx.stroke();
	ctx.fill();
	
	ctx.save();
	
	ctx.clip();
	
	ctx.restore();
	
//	ctx.stroke();
	
	//rubber
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.lineWidth = 6;
	ctx.moveTo(23,7);
	ctx.lineTo(19,11);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.moveTo(16.5,8.5);
	ctx.lineTo(21.5,13.5);
	ctx.stroke();
};
            
            var drawEraser = function(ctx) {
	var radgrad = ctx.createRadialGradient(4, 4, 4, 15, 15, 20);
	radgrad.addColorStop(0, '#9F5969');
	radgrad.addColorStop(1, '#CE7991');

	ctx.lineJoin = 'round';

	ctx.fillStyle = radgrad;
	ctx.beginPath();
	ctx.moveTo(4, 12);
	ctx.lineTo(19, 15);
	ctx.lineTo(22, 21);
	ctx.lineTo(7, 18);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#D07E95';
	ctx.lineWidth = 2;
	ctx.moveTo(4, 12);
	ctx.lineTo(9, 9);
	ctx.lineTo(24, 12);
	ctx.lineTo(19, 15);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#C36F86';
	ctx.lineWidth = 2;
	ctx.moveTo(24, 12);
	ctx.lineTo(19, 15);
	ctx.lineTo(22, 21);
	ctx.lineTo(27, 18);
	ctx.closePath();
	ctx.fill();
};
            
            var drawWand = function(ctx){
	
	//rod
	ctx.save();
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(20,10);
	ctx.lineWidth = 3.5;
	ctx.strokeStyle = "#000000";
	ctx.lineTo(5,25);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(20,10);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#c97474";
	ctx.lineTo(5,25);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#eaeaea";
	ctx.moveTo(7,23);
	ctx.lineTo(8,22);
	ctx.moveTo(11,19);
	ctx.lineTo(12,18);
	ctx.moveTo(15,15);
	ctx.lineTo(17,13);
	ctx.stroke();
	ctx.restore();
	
	//star
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = "#000000";
	ctx.translate(20,10);
	ctx.rotate(0.1);
	
	ctx.moveTo(2,0);
	
	for(var i = 0; i < 8; i++){
		ctx.lineTo(2.5,0);
		ctx.rotate(Math.PI/7);
		ctx.lineTo(6,0);
		ctx.rotate(Math.PI/7);
	}
	ctx.stroke();
	ctx.fillStyle="#ffbf00";
	ctx.fill();
	ctx.restore();
};
            
            var drawPencil = function(ctx) {

	var color = 'black';

	ctx.save();

	ctx.beginPath();
	ctx.strokeStyle = '#ff6868';
	ctx.lineWidth = 8.5;
	ctx.lineCap = 'round';
	ctx.moveTo(23, 7);
	ctx.lineTo(15, 15);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#ce9506';
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'butt';
	ctx.moveTo(18, 8);
	ctx.lineTo(8, 18);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#bc8c10';
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'butt';
	ctx.moveTo(22, 12);
	ctx.lineTo(12, 22);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#eac054';
	ctx.lineWidth = 3;
	ctx.lineCap = 'butt';
	ctx.moveTo(20, 10);
	ctx.lineTo(10, 20);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#b7b7b7';
	ctx.lineWidth = 2;
	ctx.lineCap = 'butt';
	ctx.moveTo(17, 7);
	ctx.lineTo(23, 13);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.lineCap = 'butt';
	ctx.moveTo(7, 17);
	ctx.lineTo(13, 23);
	ctx.lineTo(5, 25);
	ctx.fillStyle = "#DAB870";
	ctx.strokeStyle = '#DAB870';
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.lineCap = 'butt';
	ctx.moveTo(6, 22);
	ctx.lineTo(4, 26);
	ctx.lineTo(8, 24);
	ctx.fillStyle = color;
	ctx.closePath();
	ctx.fill();

	ctx.lineJoin = 'miter';

	ctx.restore();
};
            
            var drawBrush = function(ctx) {
	ctx.beginPath();
	ctx.strokeStyle = 'brown';
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';
	ctx.moveTo(20, 6);
	ctx.lineTo(13, 20);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = '#a5a5a5';
	ctx.moveTo(16, 14);
	ctx.lineTo(11, 23);
	ctx.lineWidth = 5;
	ctx.lineCap = 'butt';
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#474747';
	ctx.moveTo(10, 20);
	ctx.bezierCurveTo(7, 21, 8, 24, 5, 24);
	ctx.quadraticCurveTo(17, 24, 14, 22);
	ctx.closePath();
	ctx.lineWidth = 1;
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.fill();
};
            
            var drawYang = draw = function(ctx){
	ctx.save();
	
	ctx.beginPath();
	ctx.moveTo(60,0);
	ctx.lineTo(20,0);
	ctx.quadraticCurveTo(0,0,0,20);
	ctx.lineTo(0,60);
	ctx.quadraticCurveTo(0,80,20,80);
	ctx.lineTo(60,80);
	ctx.quadraticCurveTo(80,80,80,60);
	ctx.lineTo(80,20);
	ctx.quadraticCurveTo(80,0,60,0);
	ctx.closePath();
	ctx.clip();
	
	ctx.beginPath();
	ctx.lineJoin = 'bevel';
	ctx.lineWidth=3;
	ctx.strokeStyle='black';
	ctx.fillStyle='rgb(0, 0, 0)';
	ctx.moveTo(80,0);
	ctx.lineTo(20,0);
	ctx.quadraticCurveTo(0,0,0,20);
	ctx.lineTo(0,80);
	ctx.quadraticCurveTo(60,70,40,40);
	ctx.quadraticCurveTo(20,10,80,0);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle='#ffffff';
	ctx.moveTo(80,0);
	ctx.lineTo(80,60);
	ctx.quadraticCurveTo(80,80,60,80);
	ctx.lineTo(0,80);
	ctx.quadraticCurveTo(60,70,40,40);
	ctx.quadraticCurveTo(20,10,80,0);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle='#000000';
	ctx.arc(60,30,10,0,6.3,1);
	ctx.closePath();
	ctx.fill();


	ctx.beginPath();
	ctx.fillStyle='#ffffff';
	ctx.arc(20,50,10,0,6.3,1);
	ctx.closePath();
	ctx.fill();

ctx.beginPath();
ctx.restore();
ctx.save();

var gradient = ctx.createLinearGradient(0, 100, 80, 0);
gradient.addColorStop(0, '#7c7c7c');
gradient.addColorStop(0.1, '#dddddd');
gradient.addColorStop(0.2, '#9b9b9b');
gradient.addColorStop(0.3, '#c4c4c4');
gradient.addColorStop(0.4, '#707070');
gradient.addColorStop(0.5, '#999999');
gradient.addColorStop(0.6, '#c9c9c9');
gradient.addColorStop(0.7, '#707070');
gradient.addColorStop(0.8, '#898989');
gradient.addColorStop(0.9, '#9b9b9b');
gradient.addColorStop(1, '#c4c4c4');
ctx.beginPath();
ctx.strokeStyle = gradient;
ctx.lineWidth = 4;
ctx.moveTo(60,0);
ctx.lineTo(20,0);
ctx.quadraticCurveTo(0,0,0,20);
ctx.lineTo(0,60);
ctx.quadraticCurveTo(0,80,20,80);
ctx.lineTo(60,80);
ctx.quadraticCurveTo(80,80,80,60);
ctx.lineTo(80,20);
ctx.quadraticCurveTo(80,0,60,0);
ctx.closePath();
ctx.stroke();

ctx.restore();
ctx.save();

ctx.restore();

};

var makeGradient = function(){
		var bgGradient = document.createElement('canvas');
		bgGradient.width = 1000;
		bgGradient.height = 1000;
		var ctx = bgGradient.getContext("2d");
        ctx.globalAlpha = 0.04;
		var gradient = ctx.createLinearGradient(0, 500, 800, 0);
		gradient.addColorStop(0, '#ffd28e');
		gradient.addColorStop(0.1, '#ffbb47');
		gradient.addColorStop(0.2, '#fc9b00');
		gradient.addColorStop(0.3, '#ffc877');
		gradient.addColorStop(0.4, '#ffbb47');
		gradient.addColorStop(0.5, '#ffbb47');
		gradient.addColorStop(0.6, '#ffd28e');
		gradient.addColorStop(0.7, '#fc9b00');
		gradient.addColorStop(0.8, '#ffc877');
		gradient.addColorStop(0.9, '#ffc877');
		gradient.addColorStop(1, '#ffbb47');
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0,800,800);
        return bgGradient;
	}

var silverGrad = function(ctx){
		
		var gradient = ctx.createLinearGradient(0, 400, 400, 0);
		gradient.addColorStop(0, '#7c7c7c');
		gradient.addColorStop(0.1, '#595959');
		gradient.addColorStop(0.2, '#9b9b9b');
		gradient.addColorStop(0.3, '#c4c4c4');
		gradient.addColorStop(0.4, '#707070');
		gradient.addColorStop(0.5, '#999999');
		gradient.addColorStop(0.6, '#303030');
		gradient.addColorStop(0.7, '#707070');
		gradient.addColorStop(0.8, '#898989');
		gradient.addColorStop(0.9, '#9b9b9b');
		gradient.addColorStop(1, '#303030');
		
		return 	gradient;
		
	};
    
    var whiteSilverGrad = function(ctx){
		
		var gradient = ctx.createLinearGradient(0, 400, 210, 0);
		gradient.addColorStop(0, '#e2e2e2');
		gradient.addColorStop(0.2, '#efefef');
		gradient.addColorStop(0.4, '#f9f9f9');
		gradient.addColorStop(0.8, '#e0e0e0');
		gradient.addColorStop(1, '#efefef');
		
		return 	gradient;
		
	};

$(document).ready(function(){
        var ctx = $('#title_menu')[0].getContext('2d');
        var bgGradient = makeGradient();
        ctx.scale(1.6,1.6);
		//title menu
		/*ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(0,75);
		ctx.lineTo(205,75);
		ctx.quadraticCurveTo(215,75,215,65);
		ctx.lineTo(215,0);
		ctx.closePath();
		ctx.strokeStyle = silverGrad(ctx);
		ctx.lineWidth = 2;	
		ctx.save();
		ctx.clip();
		ctx.drawImage(bgGradient,-1,-2);
		ctx.restore();*/
		
		ctx.stroke();
		ctx.translate(10,10);
		ctx.scale(0.68,0.68);	
		drawYang(ctx);
		ctx.beginPath();
		ctx.lineJoin = "round";
		
		//title text
		ctx.lineWidth = 8;
		ctx.fillStyle = 'black';
		ctx.strokeStyle = whiteSilverGrad(ctx);
		ctx.font = 'bold 36px Courier';
		//gaton
		//ctx.translate(0,20);
		//this.home = window.location;
		ctx.lineWidth = 5;
		ctx.strokeText('YinYangPaint 阴阳画',105,50);
		ctx.fillText('YinYangPaint 阴阳画',105,50);
		ctx.beginPath();
		ctx.lineWidth = 6;
		ctx.font = 'bold 26px Courier';
		//ctx.strokeText('阴阳画',99,34);
		//ctx.fillText('阴阳画',99,34);
        
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.font = 'bold 12px Courier';
        ctx.scale(1.25,1);
        ctx.strokeText('   Open Source HTML5 Image Editor',90,105);
		ctx.fillText('   Open Source HTML5 Image Editor',90,105);
        ctx.restore();
        
        
        
        /*ctx.translate(375,22)
        ctx.scale(1,1);
        drawBrush(ctx);
        ctx.translate(30,0);
        drawPencil(ctx);
        ctx.translate(30,0);
        drawWand(ctx);
        ctx.translate(30,0);
        drawEraser(ctx);
        ctx.translate(30,0);
        drawDropper(ctx);*/
        
        var ctx = $('#brush-icon-canvas')[0].getContext('2d');
        ctx.scale(4,4);
        drawBrush(ctx);
        
        var ctx = $('#eraser-icon-canvas')[0].getContext('2d');
        ctx.scale(4,4);
        drawEraser(ctx);
        
        var ctx = $('#wand-icon-canvas')[0].getContext('2d');
        ctx.scale(4,4);
        drawWand(ctx);
});