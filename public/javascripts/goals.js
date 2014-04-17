var UI = UI || {
	newGoal : true,
	currGoal : null,		// when editing
	selectedGoal : null,	// when dragging
	binRadius : 20000,		// detection radius for dropping goals into bins
	dotRadius : 60,			// default dot size
	friction : 0.95,		// friction for moving goals
	dragging : false,
	lastPageX : null,
	lastPageY : null,
	dx : 0,
	dy : 0,
	vScale : 5,				// amplify velocity, 0-no momentum
	lastUpdate : -1,		// used to calculate time
	goals: [],
};

// Create Goal Button

$('#main-create-button').click(function(e){
	if (!UI.dragging){
		var d = new UI.Dot(150, 50, UI.dotRadius);
		d.appear();
		d.el.className = "main-goal-bubble";

		var body = document.createElement('span');
		body.className = "goal-body";

		var title = document.createElement('span');
		title.className = "goal-title";
		title.textContent = "Do: ";
		title.contentEditable = "true";

		var edit = document.createElement('a');
		edit.href = '#';
		edit.className = 'goal-edit';
		edit.textContent = 'edit';

		body.appendChild(title);
		body.appendChild(document.createElement('br'));
		body.appendChild(edit);
		d.el.appendChild(body);

		$('#main-goals-container').append(d.el);
		title.focus();
		UI.goals.push(d);
	}
});


// Click Goal -> Focus on Title

$('#main-goals-container').on('click', '.goal', function (e) {
	$('goal-title', this).focus();
})




// Update internal model when typing in goal

$('#main-goals-container').on('keyup', '.goal-title', function(){
	var el = $(this).parent().parent()[0];
	el.master.title = $(this).text();
});


// Edit Goal Button

$('#main-goals-container').on('click', '.goal-edit', function (e) {
	var el = $(this).parent().parent()[0];
	el.master.gliding = false;
	el.master.grow(window.innerWidth*2);
	$('.main-goal-bubble').removeClass('high');
	$(el).addClass('high');
	$('#main-create-goal-form').fadeIn();

	$('#goal-edit-title').val(el.master.title);
	$('#main-goal-description').val(el.master.description);
	$('#main-goal-deadline').val(el.master.deadline);

	UI.currGoal = el;
});


// Edit Form Save Button

$('#main-edit-form').submit(function(e){
	e.preventDefault();

	var t = $('#goal-edit-title').val();
	var d = $('#main-goal-description').val();
	var dl = $('#main-goal-deadline').val();

	UI.currGoal.master.title = t;
	UI.currGoal.master.description = d;
	UI.currGoal.master.deadline = dl;

	// send save request to the server
});



// Close Edit Form

$('#main-close-form').click(function(){
	UI.currGoal.master.shrink(window.innerWidth*2);
	UI.currGoal = null;
	$(UI.currGoal).removeClass('high');
	$('#main-create-goal-form').fadeOut();
});



// Hover over goal

$('#main-goals-container').on('mouseover', '.main-goal-bubble', function(e){
	var el = $(this).finish()[0];
	if (el.master.big === false && el !== UI.currGoal && !(el.master.gliding || el.dragging)){
		el.master.big = true;
		el.master.updateSize();
		// $('.goal-description', el).finish().slideDown(100);
	}
}).on('mouseover', '.main-goal-bubble > *', function(e){
	var el = $(this).parent().finish()[0];
	if (el.master.big === false && el !== UI.currGoal && !(el.master.gliding || el.dragging)){
		el.master.big = true;
		el.master.updateSize();
		// $('.goal-description', el).finish().slideDown(100);
	}
}).on('mouseout', '.main-goal-bubble', function (e) {
	var el = $(this)[0];
	if (e.toElement === el){	// don't capture when exiting to itself
		return;
	}
	if (el.master.big === true && el !== UI.currGoal && !(el.master.gliding || el.dragging)){
		el.master.big = false;
		el.master.updateSize();
		// $('.goal-description', el).slideUp(100);
	}
});


// Drag Testing

$('#main-goals-container').on('mousedown', '.main-goal-bubble', function(e){
	var el = $(this)[0];
	if (!el){
		return;
	}
	UI.selectedGoal = el;

	if (el.master.big && !(el.dragging || el.master.gliding)){
		$(el).finish();
		el.master.big = false;
		el.master.updateSize();
	}

	el.dragging = true;
	// console.log("now i'm dragging")
}).on('mouseup', '.main-goal-bubble', function (e) {
	var el = $(this)[0];
	if (!el){
		return;
	}


	el.dragging = false;
	UI.selectedGoal = null;

	// glide
	if (Math.abs(UI.dx) > 1 || Math.abs(UI.dy) > 1){
		el.dx = UI.dx * UI.vScale;
		el.dy = UI.dy * UI.vScale;
		el.master.glide();
	}

	// reset global velocity
	UI.dx = UI.dy = 0;

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
	UI.dx = UI.dy = 0;			// reset global velocity


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


			// calculate distance to bins
			var distLeft = (e.pageX*e.pageX) + (e.pageY*e.pageY);
			var distRight = (window.innerWidth-e.pageX)*(window.innerWidth-e.pageX) + (e.pageY*e.pageY);
			if (distLeft < UI.binRadius){
				$('#main-complete-bin').removeClass('small-circle')
					.addClass('big-circle');
			}
			if (distRight < UI.binRadius){
				$('#main-delete-bin').removeClass('small-circle')
					.addClass('big-circle');
			}
		}
	}
});




// Dropping goals into bins

$('.main-bins').mouseout(function (e) {
	$(this).removeClass('big-circle').addClass('small-circle');
})



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
		this.gliding = false;
		this.big = false;

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

	_proto.updateSize = function(){
		var diff = parseInt(this.el.style.width, 10) - UI.dotRadius*2;
		if (this.big){
			this.grow(10-diff);
		} else {
			this.shrink(diff, 0);
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

	_proto.grow = function(d, duration){
		d = (typeof d === 'undefined') ? 20 : d;
		$(this.el).animate({
			'left': '-='+(d/2),
			'top': '-='+(d/2),
			'width': '+='+d,
			'height': '+='+d,
		}, duration);
		this.el.radius += d;
		return this;
	}
	_proto.shrink = function(d, duration){
		d = (typeof d === 'undefined') ? 20 : d;
		$(this.el).animate({
			'left': '+='+(d/2),
			'top': '+='+(d/2),
			'width': '-='+d,
			'height': '-='+d,
		}, duration);
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
	





