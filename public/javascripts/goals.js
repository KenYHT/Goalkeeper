
// Create Goal Button
$('#main-create-button').click(function(e){
	if (!UI.dragging){
		var d = new UI.Dot(null, null, UI.dotRadius);		// undefined, undefined for random spawn
		$('#main-goals-container').append(d.el);
		d.appear();

		$(d.titleEl).focus();

		// SHOULD ?
		d.el.dx = Math.random()*1 - 0.5;
		d.el.dy = Math.random()*1 - 0.5;
		d.glide();
	}
});

var container_text = $('#main-goals-container').text();

$(".goal_list").each(function(index, element){
	var container_text = $(this).text();

	container_text=container_text.replace("_id: ",'"id": "')
							.replace("description",'"description"')
							.replace("title",'"title"')
							.replace("user",'"user"')
							.replace("tags",'"tags"')
							.replace(/'/g, "\"");
	container_text=container_text.replace(",",'",');
	var goals = JSON.parse(container_text);

	var d = new UI.Dot(null, null, UI.dotRadius, { // undefined, undefined for random spawn
	'title': goals.title,
	'description': goals.description,
	'date': null,
	'priority': null,
	'tags': goals.tags 
	});		
	setTimeout(function(){
		$('#main-goals-container').append(d.el);
		d.appear();
	}, 75*index);
});

/*var d = new UI.Dot(null, null, UI.dotRadius { // undefined, undefined for random spawn
	'title': ,
	'description': ,
	'date': ,
	'priority': ,
	'tags':  
	});		
	$('#main-goals-container').append(d.el);
	d.appear();

container_text=container_text.replace("_id: ",'"id": "')
							.replace("description",'"description"')
							.replace("title",'"title"')
							.replace("user",'"user"')
							.replace("tags",'"tags"')
							.replace(/'/g, "\"");
container_text=container_text.replace(",",'",');
console.log(container_text);
var goals = JSON.parse(container_text);
console.log(goals);*/


// Click Goal -> Focus on Title
$('#main-goals-container').on('click', '.main-goal-bubble', function (e) {
	$('.goal-title', this).focus();
})


// Update internal model when typing in goal
$('#main-goals-container').on('keyup', '.goal-title', function(){
	var el = $(this).parent().parent()[0];
	el.master.title = $(this).text();
});


// Edit Goal Button
$('#main-goals-container').on('click', '.goal-edit', function (e) {
	var el = $(this).parent().parent()[0];
	console.log(el, el.master.deleted)
	if (el.master === undefined || el.master.deleted){
		return;
	}

	el.master.gliding = false;
	el.dx = el.dy = 0;
	$(el).stop();
	el.master.grow(window.innerWidth*2);
	$('.goal-body', el).hide();
	$('.main-goal-bubble').removeClass('high');
	$(el).addClass('high');
	$('#main-create-goal-form').fadeIn();

	$('#goal-edit-title').val(el.master.title);
	$('#main-goal-description').val(el.master.description);
	$('#main-goal-deadline').val(el.master.date);

	UI.currGoal = el;
});


// Interactive tags
$('#tag-input').keyup(function (e) {
	if (e.keyCode == 13){
		var box = $('#tag-input')[0];
		var newTag = "<span class='tag'>"+box.value+" <span class='close-tag'>&times;</span></span>";
		console.log(newTag)
		$('#goal-tags').append(newTag);
		box.value = "";

	}
});

$('#goal-tags').on('click', '.close-tag', function() {
	$(this).parent().remove();
});


// Edit Form Save Button
$('#main-edit-form').submit(function(e){
	e.preventDefault();

	// don't submit if we're adding tags
	if (document.activeElement == document.getElementById('tag-input')){
		return;
	}

	var t = $('#goal-edit-title').val();
	var d = $('#main-goal-description').val();
	var dl = $('#main-goal-deadline').val();
	var p = null;		// get priority later
	var tags = $('.tag').text().split('×')
		.filter(function(v){return v!==''})
		.map(function(e){return e.trim()});

	UI.currGoal.master.title = t;
	UI.currGoal.master.description = d;
	UI.currGoal.master.date = dl;
	UI.currGoal.master.priority = p;
	UI.currGoal.master.tags = tags;

	$('#save-goal-button').attr('disabled', 'disabled');

	// send save request to the server
	$.ajax({
        url     : $(this).attr('action'),
        type    : $(this).attr('method'),
        dataType: 'json',
        data    : {
        	'title': t,
        	'description': d,
        	'date': dl,
			'priority': p,
			'tags': tags,
        },
        success : onSubmitSuccess,
        error	: onSubmitError,
        timeout : 3000
    });

    console.log({
        	'title': t,
        	'description': d,
        	'date': dl,
			'priority': p,
			'tags': tags,
        })


	function onSubmitError(err){
		console.log("ERR", err);
		$('#save-goal-button').removeAttr('disabled');
		$('#goal-form-status').text('Error: Unable to save')
			.addClass('failed-status').removeClass('success-status')
			.fadeIn().slideDown();

    	setTimeout(function(){
			$('#goal-form-status').fadeOut();    		
    	}, 3000);
	}

    function onSubmitSuccess(data) {
    	console.log("DATA", data);
    	if (data.status === "OK"){

    	} else {
    		data.message;
    	}
    	$('#save-goal-button').removeAttr('disabled');
    	$('#goal-form-status').text('Saved')
    		.addClass('success-status').removeClass('failed')
    		.fadeIn().slideDown();

    	setTimeout(function(){
			$('#goal-form-status').fadeOut();    		
    	}, 3000);
    }
});


// Close Edit Form
$('#main-close-form').click(function(){
	// update title
	$('.goal-title', UI.currGoal).text(UI.currGoal.master.title);


	$('.goal-body', UI.currGoal).show();
	UI.currGoal.master.shrink(window.innerWidth*2);
	UI.currGoal = null;
	$(UI.currGoal).removeClass('high');
	$('#main-create-goal-form').fadeOut();
});


// Hover over goal
$('#main-goals-container').on('mouseover', '.main-goal-bubble', function(e){
	$('.main-goal-bubble').not(this)
		.each(function(i, element){
			element.master.resetSize();
		});


	var el = $(this).finish()[0];
	if (el.master.big === false && el !== UI.currGoal && !(el.master.gliding || el.dragging)){
		el.master.big = true;
		el.master.updateSize();
	}
}).on('mouseover', '.main-goal-bubble > *', function(e){
	var el = $(this).parent().finish()[0];
	if (el.master.big === false && el !== UI.currGoal && !(el.master.gliding || el.dragging)){
		el.master.big = true;
		el.master.updateSize();
	}
}).on('mouseout', '.main-goal-bubble', function (e) {
	var el = $(this)[0];
	if (e.toElement === el){	// don't capture when exiting to itself
		return;
	}
	if (el.master.big === true && el !== UI.currGoal && !(el.master.gliding || el.dragging)){
		el.master.big = false;
		$(el).finish();
		el.master.updateSize();
	}
});


// Drag Testing
$('#main-goals-container').on('mousedown', '.main-goal-bubble', function(e){
	var el = $(this)[0];
	if (UI.currGoal != null  || !el){		// if editing, or if el is invalid
		return;
	}
	UI.selectedGoal = el;
	UI.hoverComplete = UI.hoverDelete = false;

	if (el.master.big && !(el.dragging || el.master.gliding)){
		$(el).finish();
		el.master.big = false;
		el.master.updateSize();
	}

	el.dragging = true;
	// console.log("now i'm dragging")
}).on('mouseup', '.main-goal-bubble', function (e) {
	var el = $(this)[0];
	if (UI.currGoal != null  || !el){		// if editing, or if el is invalid
		return;
	}

	// update state of element
	el.dragging = false;
	UI.selectedGoal = null;

	// reset bin size
	$('#main-complete-bin').addClass('small-circle').removeClass('big-circle');
	$('#main-delete-bin').addClass('small-circle').removeClass('big-circle');

	// if releasing over a bin, then complete or delete it
	if (UI.hoverComplete){
		el.master.shrink(el.width*2, undefined, function(){
			el.remove();
		});

		// mark goal as complete
		el.master.completed = true;
		el.master.save();
		UI.goals.splice(UI.goals.indexOf(el.master), 1);
		return;
	} else if (UI.hoverDelete){
		el.master.shrink(el.width*2, undefined, function () {
			el.remove();
		});

		// mark for deletion
		el.master.deleted = true;
		el.master.save();
		UI.goals.splice(UI.goals.indexOf(el.master), 1);
		return;
	}


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
		el.master.resetSize();
		$('#main-complete-bin').addClass('small-circle').removeClass('big-circle');
		$('#main-delete-bin').addClass('small-circle').removeClass('big-circle');

		// glide
		if (Math.abs(UI.dx) > 1 || Math.abs(UI.dy) > 1){
			el.dx = UI.dx * UI.vScale;
			el.dy = UI.dy * UI.vScale;
			el.master.glide();
		}
	}
	UI.selectedGoal = null;
	UI.dx = UI.dy = 0;			// reset global velocity
})

document.onmousemove = function(e){
	console.log("mousemove")
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

			if (UI.hoverComplete == false && distLeft < UI.binRadius){
				UI.hoverComplete = true;
				$('#main-complete-bin').addClass('big-circle').removeClass('small-circle');
				el.master.resetSize(true);

			} else if (UI.hoverComplete == true && distLeft >= UI.binRadius){
				UI.hoverComplete = false;
				$('#main-complete-bin').addClass('small-circle').removeClass('big-circle');
				el.master.resetSize();

			}

			if (UI.hoverDelete == false && distRight < UI.binRadius){
				UI.hoverDelete = true;
				$('#main-delete-bin').addClass('big-circle').removeClass('small-circle');
				el.master.resetSize(true);

			} else if (UI.hoverDelete == true && distRight >= UI.binRadius) {
				UI.hoverDelete = false;
				$('#main-delete-bin').addClass('small-circle').removeClass('big-circle');
				el.master.resetSize();

			}

		}
	}
};


// Searching
document.onkeyup = function (e){
	// check for focus
	if (UI.currGoal == null && UI.selectedGoal == null && document.activeElement.className != "goal-title"){

		// update searching mode
		if (UI.searching == false){
			UI.searching = true;
			$('.main-goal-bubble, .main-bins, #main-add-goal-container, #main-sort-container').css('-webkit-filter', 'blur(10px)');

			$('#search-container').show();
			$('#searchbox')
				.val(String.fromCharCode(e.which))
				.fadeIn()
				.focus();
		}
		$('.main-goal-bubble').css('-webkit-filter', 'blur(10px)');

		var query = $('#searchbox').val();

		var results = UI.goals.filter(function(goal){
			var good = (goal.title.indexOf(query) !== -1);
			good = (goal.description) ? (good || (goal.description.indexOf(query) !== -1)) : good;
			good = (goal.tags) ? (good || (goal.tags.indexOf(query) !== -1)) : good;
			
			return good;
		}).map(function (goal) {
			// unblur good results
			$(goal.el).css('-webkit-filter', '');
			return goal.title;
		});

		// console.log(results);
		var html = "";
		for (var i=0; i<results.length; i++){
			html += "<h3>"+results[i]+"</h3>";
		}

		$('#search-results').html(html);
	}
};
$('#main-goals-container').click(function(){
	$('.main-goal-bubble, .main-bins, #main-add-goal-container, #main-sort-container').css('-webkit-filter', '');
	$('#search-container, #searchbox').hide();
	UI.searching = false;
});
$('.search-result').click(function(){
	// open search result


	$('.main-goal-bubble, .main-bins, #main-add-goal-container, #main-sort-container').css('-webkit-filter', '');
	$('#search-container, #searchbox').hide();
	UI.searching = false;
});


// Sorting
$('#sort-time').click(function () {
	var goals = UI.goals.slice(0).sort(function(a, b){return 0.5-Math.random()});
	var len = goals.length;

	// normalize sizes
	var dx = (window.innerWidth - 2*UI.marginX) / UI.rowMax;
	var dy = (window.innerHeight - 2*UI.marginX) / UI.colMax + UI.dotRadius/2;
	for (var i=0; i<len; i++){
		goals[i].moveTo(UI.marginX+(i % UI.rowMax)*dx, Math.floor(i / UI.rowMax)*dy+UI.marginY, true);
	}
});
$('#sort-priority').click(function () {
	var goals = UI.goals.slice(0).sort(function(a, b){
		var ascore = a.el.r + 2*a.el.g + 3*a.el.b;
		var bscore = b.el.r + 2*b.el.g + 3*b.el.b;
		return ascore - bscore;
	});
	var len = goals.length;

	// normalize sizes
	var dx = (window.innerWidth - 2*UI.marginX) / UI.rowMax;
	var dy = (window.innerHeight - 2*UI.marginX) / UI.colMax + UI.dotRadius/2;
	for (var i=0; i<len; i++){
		goals[i].moveTo(UI.marginX+(i % UI.rowMax)*dx, Math.floor(i / UI.rowMax)*dy+UI.marginY, true);
	}
});




	





