/*
 *	Shape Object Classes
 *		Box, Dot
 */

// Box Class

UI.Box = (function(){

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
		var dx, dy;
		this.gliding = false;
		this.big = false;
		this.completed = false;
		this.deleted = false;

		var el = this.el = document.createElement('div');
		this.el.className = 'goal';
		
		el.master = this;		// retain reference to master object
		
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

		// attach velocities to element
		el.dx = 0;
		el.dy = 0;

		// attach position to element
		x = el.x = x || Math.floor(Math.random()*window.innerWidth-radius);
		y = el.y = y || Math.floor(Math.random()*window.innerHeight-radius);

		// initialize random color
		el.r = r = Math.floor(Math.random()*155)+100;
		el.g = g = Math.floor(Math.random()*155)+100;
		el.b = b = Math.floor(Math.random()*155)+100;


		return this;
	}

	var _proto = init.prototype;

	// save the goal internal data
	_proto.save = function () {
		
	}

	_proto.updateSize = function(){
		var diff = parseInt(this.el.style.width, 10) - UI.dotRadius*2;
		if (this.big){
			this.grow(UI.hoverGrowth-diff, 2000);
		} else {
			this.shrink(diff, 02000);
		}
	}

	_proto.resetSize = function(small){
		if (small){
			$(this.el).css({
				'width': UI.smallDotRadius*2,
				'height': UI.smallDotRadius*2,
				// 'line-height': UI.smallDotRadius*2,
			});
		} else {
			$(this.el).css({
				'width': UI.dotRadius*2,
				'height': UI.dotRadius*2,
				// 'line-height': UI.dotRadius*2,
			});
		}
	}

	_proto.glide = function(){
		this.gliding = true;
		this._updateGlide();
	}

	_proto._updateGlide = function(){
		var el = this.el;
		this.moveTo(el.x + el.dx, el.y + el.dy);

		// update & check
		el.dx *= UI.friction;
		el.dy *= UI.friction;

		if (this.gliding && (Math.abs(el.dx) > 0.02 || Math.abs(el.dy) > 0.02)){
			requestAnimationFrame(this._updateGlide.bind(this));
		} else {
			this.gliding = false;
			UI.dx = UI.dy = 0;
		}
	}


	_proto.moveTo = function (x, y, slide, duration, callback) {
		callback = callback || function(){};
		var el = this.el;
		x = (x > window.innerWidth) ? 0 : (x < 0) ? window.innerWidth : x;
		y = (y > window.innerHeight) ? 0 : (y < 0) ? window.innerHeight : y;

		// update internals
		el.x = x;
		el.y = y;

		if (slide == true){
			$(el).animate({
				'left': el.x - el.radius,
				'top': el.y - el.radius,
			}, duration, callback);
		} else {
			$(el).css({
				'left': el.x - el.radius,
				'top': el.y - el.radius,
			}, callback);
		}
		return this;
	}

	_proto.draw = function(){
		var el = this.el;
		$(el).css({
			'position': 'absolute',
			'left': el.x,
			'top': el.y,
			'line-height': 2*el.height+'px',
			'width': el.radius*2,
			'height': el.radius*2,
			'background-color': 'rgb('+el.r+','+el.g+','+el.b+')'
		});
		return this;
	}

	_proto.appear = function(){
		var el = this.el;
		$(el).css({
			'position': 'absolute',
			'left': el.x + el.width,
			'top': el.y + el.height,
			'line-height': 2*el.height+'px',
			'width': 10,
			'height': 10,
			'background-color': 'rgb('+el.r+','+el.g+','+el.b+')'
		}).animate({
			'left': el.x,
			'top': el.y,
			'width': el.width*2,
			'height': el.height*2,
		});
		return this;
	}

	_proto.grow = function(d, duration, cb){
		d = (typeof d === 'undefined') ? 20 : d;
		$(this.el).animate({
			'left': '-='+(d/2),
			'top': '-='+(d/2),
			'width': '+='+d,
			'height': '+='+d,
			'line-height': '+='+d,
		}, duration, function() {
			if (cb){
				cb();
			}
		});
		this.el.radius += d;
		return this;
	}
	_proto.shrink = function(d, duration, cb){
		d = (typeof d === 'undefined') ? 20 : d;
		$(this.el).animate({
			'left': '+='+(d/2),
			'top': '+='+(d/2),
			'width': '-='+d,
			'height': '-='+d,
			'line-height': '-='+d,
		}, duration, function() {
			if (cb){
				cb();
			}
		});
		this.el.radius -= d;
		return this;
	}

	// Makes Box the constructor
	return init;

})();



// Dot Class
/*
	Dot Constructor
		x, y, radius
*/
UI.Dot = function(x, y, radius){
	var radius = parseInt(radius, 10) || 30;

	var dot = UI.Box(x, y, radius);
	this.el = dot.el;
	this.el.master = this;
	$(this.el).css({'border-radius': '50%'});

	return this;
};
UI.Dot.prototype = new UI.Box;