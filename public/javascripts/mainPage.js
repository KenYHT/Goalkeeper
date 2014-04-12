$(document).ready(function() {
	$("#main-goal-deadline").datepicker();

	var navToggle = false;
	$("#main-nav-toggle-container").click(function() {
		if (navToggle === false) {
			navToggle = true;
			$("#main-navbar-container").animate({
				right: 0
			}, 200, function() {
				$("#main-nav-toggle").removeClass("glyphicon-chevron-left");
				$("#main-nav-toggle").addClass("glyphicon-chevron-right");
			});
		} else {
			navToggle = false;
			$("#main-navbar-container").animate({
				right: "-220px"
			}, 200, function() {
				$("#main-nav-toggle").removeClass("glyphicon-chevron-right");
				$("#main-nav-toggle").addClass("glyphicon-chevron-left");
			});
		}
	});
	
});