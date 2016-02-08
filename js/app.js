$(function() {
	$.ajax({
		url: "https://api.23andme.com/1/demo/user/",
		dataType: "json",
		password: "122f530d3904f0781b8f637d8aeefa3c",
		username: "4fb9c5d63e52a08920c3c0c49183901f"
	})
	.done(function( data ) {
		console.log(data);
	})
	.fail(function( jqXHR, textStatus ) {
		console.log(textStatus);
	});
});