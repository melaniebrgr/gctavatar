function log(m) {
	console.log(m);
}

$(function() {
var $avatar = $(".avatar");
$avatar.height( $avatar.width() );

//Animation	
	var $boy = $("#boy");

	var Tl = new TimelineMax();
	Tl
		.set($boy, {autoAlpha: 0, scale: 0.5})
		.to($boy, 0.8, {autoAlpha: 1, scale: 1}, '+=1');
});