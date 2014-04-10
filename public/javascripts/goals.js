

var app = app || {};

// Box Class

app.Box = (function(){

	/*
		Box Constructor
			x, y - position
		Optional:
			3 - x, y, radius
			4 - x, y, width, height
	*/
	function init(x, y){
		var x, y, width, height;
		var r, g, b;

		var el = this.el = document.createElement('div');
		var radius = el.radius = arguments[2] || 70;

		if (arguments.length === 3){
			el.width = width = radius;
			el.height = height = radius;
		} else if (arguments.length > 3){
			el.width = width = arguments[2];
			el.height = height = arguments[3];
		} else {
			el.width = width = 80;
			el.height = height = 60;
		}


		x = el.x = x || Math.floor(Math.random()*window.innerWidth-radius);
		y = el.y = y || Math.floor(Math.random()*window.innerHeight-radius);

		// initialize random color
		el.r = r = Math.floor(Math.random()*255);
		el.g = g = Math.floor(Math.random()*255);
		el.b = b = Math.floor(Math.random()*255);

		this.draw = _proto.draw;
		this.appear = _proto.appear;
		this.grow = _proto.grow;
		this.shrink = _proto.shrink;

		console.log("Box Maker", el)

		$('body').append(el);		// change to the container
		return this;
	}

	var _proto = init.prototype;

	_proto.draw = function(){
		var el = this.el;
		$(el).css({
			'position': 'absolute',
			'left': el.x,
			'top': el.y,
			'width': el.radius*2,
			'height': el.radius*2,
			'background-color': 'rgb('+el.r+','+el.g+','+el.b+')'
		});
	}

	_proto.appear = function(){
		var el = this.el;
		$(el).css({
			'position': 'absolute',
			'left': el.x + el.width,
			'top': el.y + el.height,
			'width': 10,
			'height': 10,
			'background-color': 'rgb('+el.r+','+el.g+','+el.b+')'
		}).animate({
			'left': el.x,
			'top': el.y,
			'width': el.width*2,
			'height': el.height*2,
		});
	}

	_proto.grow = function(d){
		d = d || 20;
		$(this.el).animate({
			'left': '-='+(d/2),
			'top': '-='+(d/2),
			'width': '+='+d,
			'height': '+='+d,
		});
		this.el.radius += d;
	}
	_proto.shrink = function(d){
		d = d || 20;
		$(this.el).animate({
			'left': '+='+(d/2),
			'top': '+='+(d/2),
			'width': '-='+d,
			'height': '-='+d,
		});
		this.el.radius -= d;
	}

	// Makes Box the constructor
	return init;

})();




// Dot Class

app.Dot = function(x, y, radius){
	var Box = app.Box;
	var radius = parseInt(radius, 10) || 30;

	var dot = Box(x, y, radius);
	console.log(dot.el)
	this.el = dot.el;
	$(dot.el).css({'border-radius': '50%'});

	dot.grow = Box.prototype.grow;
	dot.shrink = Box.prototype.shrink;

	return this;
};
app.Dot.prototype = new app.Box;
	/*
		Dot Constructor
			x, y, radius
	*/
	// function init(x, y, radius){
	// 	var Box = app.Box;
	// 	var radius = parseInt(radius, 10) || 30;
	// 	var dot = Box(x, y, radius);
	// 	$(dot).css({'border-radius': '50%'});

	// 	dot.grow = Box.prototype.grow;
	// 	dot.shrink = Box.prototype.shrink;

	// 	return dot;
	// }

// 	// Inherit from Box Class
// 	init.prototype = new app.Box;

// 	return init;
// });





