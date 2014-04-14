

var UI = UI || {
	newGoal : true,
	currGoal : null,		// when editing
	selectedGoal : null,	// when dragging
	dotRadius : 80,
	dragging : false,
	lastPageX : null,
	lastPageY : null,
	goals: [],
};

// Click Testing

$('#main-create-button').click(function(e){
	if (!UI.dragging){
		var d = new UI.Dot(150, 50, UI.dotRadius);
		$('#main-goals-container').append(d.el);
		d.appear();
		d.el.className = "main-goal-bubble";
		d.el.style.lineHeight = UI.dotRadius+'px';
		d.el.contentEditable = "true";
		d.el.focus();

		UI.goals.push(d);
	}
});

// Drag Testing

$('#main-goals-container').on('mousedown', '.main-goal-bubble', function(e){
	var el = $(this)[0];
	if (!el){
		return;
	}
	UI.selectedGoal = el;

	el.dragging = true;
	console.log("now i'm dragging", el)
}).on('mouseup', '.main-goal-bubble', function () {
	var el = $(this)[0];
	if (!el){
		return;
	}

	el.dragging = false;
	UI.selectedGoal = null;
	console.log("uh done drag")
}).mousemove(function(e){
	var el = UI.selectedGoal;
	if (UI.selectedGoal){
		if (el.dragging){
			el.master.moveTo(e.pageX, e.pageY);
		}
	}
});



// Type Testing

// $('body').keyup(function(e){
// 	console.log(e)

// 	if (newGoal){
// 		var d = new UI.Dot(Math.floor(Math.random()*window.innerWidth-UI.dotRadius),
// 			Math.floor(Math.random()*window.innerHeight-radius));
// 		d.appear();
// 	} else if (currGoal !== null){

// 	}

// });


/*
 *	Object Classes
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

		this.draw = _proto.draw;
		this.appear = _proto.appear;
		this.grow = _proto.grow;
		this.shrink = _proto.shrink;
		this.moveTo = _proto.moveTo;

		return this;
	}

	var _proto = init.prototype;

	_proto.moveTo = function (x, y) {
		var el = this.el;
		$(el).css({
			'left': x - el.radius,
			'top': y - el.radius,
		});
		return this;
	}

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
		return this;
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
		return this;
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
		return this;
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

	// dot.grow = Box.prototype.grow;
	// dot.shrink = Box.prototype.shrink;

	return this;
};
UI.Dot.prototype = new UI.Box;
	





