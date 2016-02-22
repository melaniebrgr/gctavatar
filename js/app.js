// Utility functions
function log(m) {
	console.log(m);
}

$(function() {
$(".getAuth").click(function() {
	window.location.href = "https://api.23andme.com/authorize/?redirect_uri=http://localhost:8888/redirect.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry rs12913832 rs2153271 rs7349332 rs10034228 rs3827760 rs12896399 rs1667394 rs12821256 rs1805007 rs1805008 i3002507";
});


// If access_token is available in the cookie skip authorization
if ( Cookies.get('access_token') ) {
	$(".getAuth").remove();
	$(".text").append("<button class='getData'>Get Data</button>"); //remove need for this button
	$(".getData").click(function() {
		$.get( "/results.php", function(data) {
			console.log(data);
		} );
	});
}
});