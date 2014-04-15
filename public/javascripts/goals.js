var UI = UI || {
	newGoal : true,
	currGoal : null,		// when editing
	selectedGoal : null,	// when dragging
	dotRadius : 80,			// default dot size
	dragging : false,
	lastPageX : null,
	lastPageY : null,
	dx : 0,
	dy : 0,
	vScale : 5,				// amplify velocity, 0-no momentum
	lastUpdate : -1,		// used to calculate time
	goals: [],
};

// Click Testing

$('#main-create-button').click(function(e){
	if (!UI.dragging){
		var d = new UI.Dot(150, 50, UI.dotRadius);
		d.appear();
		d.el.className = "main-goal-bubble";
		d.el.style.lineHeight = UI.dotRadius+'px';
		d.el.contentEditable = "true";

		var edit = document.createElement('a');
		edit.href = '#';
		edit.className = 'goal-edit';
		edit.textContent = 'edit';
		d.el.appendChild(edit);

		$('#main-goals-container').append(d.el);
		d.el.focus();
		UI.goals.push(d);
	}
});


// Edit Goal Button

$('#main-goals-container').on('click', '.goal-edit', function (e) {
	$(this).parent()[0].master.grow(window.innerWidth*2);
	$('#main-create-goal-form').fadeIn();

	UI.currGoal = $(this).parent()[0];
});

// Close Edit Form

$('#main-close-form').click(function(){
	UI.currGoal.master.shrink(window.innerWidth*2);
	$('#main-create-goal-form').fadeOut();
});



// Drag Testing

$('#main-goals-container').on('mousedown', '.main-goal-bubble', function(e){
	var el = $(this)[0];
	if (!el){
		return;
	}
	UI.selectedGoal = el;

	el.dragging = true;
	console.log("now i'm dragging")
}).on('mouseup', '.main-goal-bubble', function (e) {
	var el = $(this)[0];
	if (!el){
		return;
	}

	el.dragging = false;
	UI.selectedGoal = null;
	console.log("uh done drag")

	// glide
	if (Math.abs(UI.dx) > 1 || Math.abs(UI.dy) > 1){
		el.dx = UI.dx * UI.vScale;
		el.dy = UI.dy * UI.vScale;
		el.master.glide();
	}

}).mouseleave(function (e) {
	if (UI.selectedGoal){
		var el = UI.selectedGoal;
		el.dragging = false;

		// glide
		if (Math.abs(UI.dx) > 1 || Math.abs(UI.dy) > 1){
			el.dx = UI.dx * UI.vScale;
			el.dy = UI.dy * UI.vScale;
			el.master.glide();
		}
	}
	UI.selectedGoal = null;
	console.log("dragged off mayne")


}).mousemove(function(e){
	var el = UI.selectedGoal;
	if (UI.selectedGoal){
		if (el.dragging){
			var newX = e.pageX;
			var newY = e.pageY;

			var now = Date.now();
			UI.dx = (e.pageX - UI.lastPageX) / (now - UI.lastUpdate);
			UI.dy = (e.pageY - UI.lastPageY) / (now - UI.lastUpdate);
			el.master.moveTo(newX, newY);

			UI.lastUpdate = Date.now();
			UI.lastPageX = newX;
			UI.lastPageY = newY;

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


		return this;
	}

	var _proto = init.prototype;

	_proto.glide = function(){
		var el = this.el;
		this.moveTo(el.x + el.dx, el.y + el.dy);

		// update & check
		el.dx *= 0.95;
		el.dy *= 0.95;

		if (Math.abs(el.dx) > 0.02 || Math.abs(el.dy) > 0.02){
			requestAnimationFrame(this.glide.bind(this));
		}
	}

	_proto.moveTo = function (x, y) {
		var el = this.el;
		x = (x > window.innerWidth) ? 0 : (x < 0) ? window.innerWidth : x;
		y = (y > window.innerHeight) ? 0 : (y < 0) ? window.innerHeight : y;

		// update internals
		el.x = x;
		el.y = y;

		$(el).css({
			'left': el.x - el.radius,
			'top': el.y - el.radius,
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

	return this;
};
UI.Dot.prototype = new UI.Box;
	





