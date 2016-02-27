// Utility functions
function log(m) {
	console.log(m);
}

var APP = APP || {};

// Animation logic here
APP.anim = function() {
	// Animate!
}();

// Build the user model that will be reference by the animation, html template
APP.model = function() {
	var modelStart;

	// var User = class {
	// 	constructor(height, width) {
	// 		this.name = {
	// 			first: firstName,
	// 			last: lastName
	// 		}
	// 	}
	// };

	function publicSet(data) {
		modelStart = data;
	}
	function publicGet() {
		return modelStart;
	}

	return {
		set: publicSet,
		get: publicGet
	}
}();

// res module parses the response from 23andMe
APP.res = function() {
	function randomUser() {
		var ranUser;
		$.ajax({
			url: 'https://randomuser.me/api/',
			dataType: 'json',
			async: false
		})
		.done( function(data) {
			ranUser = data;
		})
		return ranUser;
	}
	log(randomUser())
	
	function publicGetRandomData() {
		// If data is missing or bad(?) get random data
		// For names, age: https://randomuser.me/
		// This function runs after setErrField
		// If a trait or value is missing or inappropriate it will be set to a random value
		var ranUser = randomUser();

		function publicFirstName() {
			return ranUser.results[0].user.name.first;
		}
		function publicLastName() {
			return ranUser.results[0].user.name.last;
		}
		// function publicAncestry() {
		// 	var ranProportion;
		// 	return [
		// 		{ label: "Sub-Saharan African", proportion: ranProportion },
		// 		{ label: "European", proportion: ranProportion, sub_populations: [
					
		// 			] },
		// 	]
		// }

		return {
			firstName: publicFirstName,
			lastName: publicLastName,
			// ancestry: publicAncestry
		}
	}
	log(publicGetRandomData());


	// For traits with error, obtain user input where possible
	function setErrField(data, prop) {
		switch (prop) {
			case 'firstName':
				data.firstName = prompt('First name?').toLowerCase();
				break;
			case 'lastName':
				data.lastName = prompt('Last name?').toLowerCase();
				break;
			case 'ancestry':
				data.ancestry = [{
					label: prompt('Background?').toLowerCase(),
					proportion: 1
				}];
				break;
			case 'genotypes':
				data.genotypes = [];
				break;
			case 'sex':
				data.sex = {
					phenotype_id: 'sex',
					value: prompt('Male or female?').toLowerCase()
				}
				break;
			case 'neanderthal':
				data.neanderthal = {}
				break;
		}
		return data;
	}

	function publicErrCheck(data) {
		for (var prop in data) {
			try {
				if (data[prop] === null || data[prop].error) {
					throw new Error( `no data available for ${prop}`);
				}
			} 
			catch (error) {
				console.error(error);
				data = setErrField(data, prop);
			}
		}
		return data;
	}

	return {
		errCheck: publicErrCheck
	}
}();


$(function() {

// Set button as link to 23andMe authorization
$('.getAuth').click(function() {
	window.location.href = 'https://api.23andme.com/authorize/?redirect_uri=http://localhost:8888/redirect.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry rs12913832 rs2153271 rs7349332 rs10034228 rs3827760 rs12896399 rs1667394 rs12821256 rs1805007 rs1805008 i3002507';
});

// Toggle spinner on AJAX request
$(document).ajaxStart(function () {
	$('.text').append('<img src=\"/img/loading_spinner.gif\" alt=\"loading spinner\" class=\"loading-spinner\">');
}).ajaxStop(function () {
	$('.text .loading-spinner').remove();
});

// If access_token is available, skip authorization and get data
if ( Cookies.get('access_token') ) {
	$('.getAuth').remove();
	$.get( '/results.php', function(data) {
		APP.model.set( APP.res.errCheck(data) );
		log(APP.model.get());
	});
}
});