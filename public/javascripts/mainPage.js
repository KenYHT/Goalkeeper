$(document).ready(function() {
	$("#main-goal-deadline").datepicker(function(){
		console.log("asdfasdfasdf");
	});

	var navToggle = false;
	$("#main-nav-toggle-container").click(function() {
		if (navToggle === false) {
			playSound("openNavbar");
			navToggle = true;
			$(".main-toolbar-container").animate({
				right: 0
			}, 200, function() {
				$("#main-nav-toggle").removeClass("glyphicon-chevron-left");
				$("#main-nav-toggle").addClass("glyphicon-chevron-right");
			});
		} else {
			playSound("closeNavbar");
			navToggle = false;
			$(".main-toolbar-container").animate({
				right: "-280px"
			}, 200, function() {
				$("#main-nav-toggle").removeClass("glyphicon-chevron-right");
				$("#main-nav-toggle").addClass("glyphicon-chevron-left");
			});
		}
	});

	setTimeout(function(){
		$('#welcome-sign').fadeOut();
	}, 700);
});

$(switchBackground);
var oFReader = new FileReader(),
    rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

oFReader.onload = function(oFREvent) {
    localStorage.setItem('b', oFREvent.target.result);
    switchBackground();
};

function switchBackground() {
  var backgroundImage = localStorage.getItem('b');
  if (backgroundImage) {
    $('#main-container').css('background-image', 'url(' + backgroundImage + ')');    
  } 
}

function loadImageFile(testEl) {
  if (! testEl.files.length) { return; }
  var oFile = testEl.files[0];
  if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
  oFReader.readAsDataURL(oFile);
}

function soundToggle(){
	UI.sound = !UI.sound;
	console.log("toggle");
}

function playSound(soundType){
	if (UI.sound===false)
	{
		if (soundType==="movement")
		{
			var file = "PSHEEW";
		 	file += Math.floor(Math.random()*3);
		}
		else if (soundType==="completion")
		{
			var file = "completion"
		}
		else if (soundType==="deletion")
		{
			var file = "deletion"
		}
		else if (soundType==="openNavbar")
		{
			var file = "openNavbar"
		}
		else if (soundType==="closeNavbar")
		{
			var file = "closeNavbar"
		}
		else //soundType="creation"
		{
			var file = "HUGHGH"
		 	file += Math.floor(Math.random()*3);
		    var audio = document.getElementById(file);
		}
	 	console.log(file);
	    var audio = document.getElementById(file);
	    audio.play();
	}
}
