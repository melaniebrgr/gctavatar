// Utility functions
function log(m) {
	console.log(m);
}

$(function() {

// If access_token is available in the cookie skip authorization
if ( Cookies.get('access_token') ) {
	$(".getAuth").remove();
	$(".description").append("<button class='getData'>Get Data</button>");
	$(".getData").click(function() {
		$.get( "/results.php", function(data) {
			console.log(data);
		} );
	});
}

// SVG Animation
// var $avatar = $(".avatar");
// $avatar.height( $avatar.width() );	
// var $boy = $("#boy");
// var Tl = new TimelineMax();
// Tl
// 	.set($boy, {autoAlpha: 0, scale: 0.5})
// 	.to($boy, 0.8, {autoAlpha: 1, scale: 1}, '+=1');
});