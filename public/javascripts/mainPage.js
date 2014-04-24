$(document).ready(function() {
	$("#main-goal-deadline").datepicker(function(){
		console.log("asdfasdfasdf");
	});

	var navToggle = false;
	$("#main-nav-toggle-container").click(function() {
		if (navToggle === false) {
			navToggle = true;
			$(".main-toolbar-container").animate({
				right: 0
			}, 200, function() {
				$("#main-nav-toggle").removeClass("glyphicon-chevron-left");
				$("#main-nav-toggle").addClass("glyphicon-chevron-right");
			});
		} else {
			navToggle = false;
			$(".main-toolbar-container").animate({
				right: "-220px"
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
