/*
 * This file describes the user interface for Goalkeeper
 * The 'UI' namespace holds a set of options for configuring the frontend
 */
var UI = UI || {
	searching: false,		// is the search window open?
	currGoal : null,		// goal when editing, null when not editing
	selectedGoal : null,	// when dragging
	binRadius : 20000,		// detection radius for dropping goals into bins
	dotRadius : 30,			// default dot size
	smallDotRadius: 20,		// size when hovering over bin
	hoverGrowth: 60,		// growth in px when hovering over a goal
	friction : 0.95,		// friction for moving goals
	dragging : false,
	lastPageX : null,
	lastPageY : null,
	dx : 0,
	dy : 0,
	vScale : 5,				// amplify velocity, 0-no momentum
	lastUpdate : -1,		// used to calculate time
	goals: [],
	hoverComplete: false,
	hoverDelete: false,
	marginX: 170,			// goals will spawn within window margins
	marginY: 80,
	rowMax: 8,				// max # of goals in a row
	colMax: 5,				// max # of goals in a col
	relaxedMode: false,		// is in relaxed mode?
	sound: false, 			// is sound on?
};

// Sources: http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser/4238971#4238971
UI.placeCaretAtEnd = function (el) {
	el.focus();
	if (typeof window.getSelection != "undefined"
			&& typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}




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
			this.grow(UI.hoverGrowth-diff, 200);
		} else {
			this.shrink(diff, 0);
		}
	}

	_proto.resetSize = function(small){
		if (small){
			$(this.el).css({
				'width': UI.smallDotRadius*2,
				'height': UI.smallDotRadius*2,
				'line-height': UI.smallDotRadius*2+'px',
				'top': this.el.y - UI.smallDotRadius,
				'left': this.el.x - UI.smallDotRadius,
			});
		} else {
			$(this.el).css({
				'width': UI.dotRadius*2,
				'height': UI.dotRadius*2,
				'line-height': UI.dotRadius*2+'px',
				'top': this.el.y - UI.dotRadius,
				'left': this.el.x - UI.dotRadius,
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
UI.Dot = function(x, y, radius, data){
	data = data || {};
	var radius = parseInt(radius, 10) || 30;
	var marginX = UI.marginX + UI.dotRadius, marginY = UI.marginY + UI.dotRadius;
	if (x == null){
		x = Math.floor(Math.random()*(window.innerWidth - 2*marginX) + marginX);
	}
	if (y == null){
		y = Math.floor(Math.random()*(window.innerHeight - 2*marginY) + marginY);
	}

	var dot = UI.Box(x, y, radius);
	this.el = dot.el;
	this.el.master = this;
	$(this.el).css({'border-radius': '50%'});

	this.el.className = "main-goal-bubble";

	var body = document.createElement('span');
	body.className = "goal-body";

	var title = document.createElement('span');
	title.className = "goal-title";
	title.textContent = data['title'] || "Do: ";
	title.contentEditable = "true";
	this.titleEl = title;

	var edit = document.createElement('a');
	edit.href = '#';
	edit.className = 'goal-edit';
	edit.textContent = 'edit';

	body.appendChild(title);
	body.appendChild(document.createElement('br'));
	body.appendChild(edit);
	this.el.appendChild(body);

	// load data
	this.title = data['title'] || title.textContent;
	this.description = data['description'];
	this.date = data['date'];
	this.priority = data['priority'];
	this.tags = data['tags'];

	// Add to UI goals array
	UI.goals.push(this);

	return this;
};
UI.Dot.prototype = new UI.Box;