$(function() {
var w = $(".avatar").width() - 8;
$(".avatar").css( {'height':w +'px'} );

//Animation	
	var $boy = $("#boy");

	var Tl = new TimelineMax();
	Tl
		.set($boy, {autoAlpha: 0, transformOrigin: 'center center', scale: 0.5})
		.to($boy, 0.8, {autoAlpha: 1, scale: 1}, '+=1');
});