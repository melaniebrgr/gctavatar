// Utility functions
function log(m) {
	console.log(m);
}

var APP = APP || {};

// Animation logic
APP.anim = function() {
	// Animate!
}();

// Build the user model that will be reference by the animation, html template
APP.model = function() {
	var modelStart = null;

	// Create user prototype

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
	function publicGetRandomData() {
		// If data is missing or bad(?) get random data
		// For names, age: https://randomuser.me/
		// This function runs after setErrField
		// If a trait or value is missing or inappropriate it will be set to a random value

		function publicFirstName() {
			return APP.ranUser.results[0].user.name.first;
		}
		function publicLastName() {
			return APP.ranUser.results[0].user.name.last;
		}
		function publicGender() {
			return APP.ranUser.results[0].user.gender;
		}
		// function publicAncestry() {
			// use switch for nationalities from ran user API
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
			gender: publicGender
			// ancestry: publicAncestry
		}
	}
	// log(publicGetRandomData());


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
					value: publicGetRandomData().gender() // eventually want to prompt for this
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

APP.getData = function getData() {
	$.ajax({
		url: 'https://randomuser.me/api/',
		dataType: 'json'
	})
	.done( function(data) {
		APP.ranUser = data;
		log(APP.ranUser);

		// If access_token is available, remove access button and skip authorization
		if ( Cookies.get('access_token') && !APP.model.get() ) {
			// Remove button to access 23andMe
			$('.getAuth').remove();
			// Load spinner
			$('.text').append('<img src=\"/img/loading_spinner.gif\" alt=\"loading spinner\" class=\"loading-spinner\">');
			// Get genetic data from 23andMe
			$.get( '/results.php', function(data) {
				// Check the data for errors, then set to the model data
				APP.model.set( APP.res.errCheck(data) );
				log(APP.model.get());
				// Remove spinner
				$('.text .loading-spinner').remove();
			});
		}
	});
}

// On document ready
$(function() {
	// Set button as link to 23andMe authorization
	$('.getAuth').click(function() {
		window.location.href = 'https://api.23andme.com/authorize/?redirect_uri=http://localhost:8888/redirect.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry rs12913832 rs2153271 rs7349332 rs10034228 rs3827760 rs12896399 rs1667394 rs12821256 rs1805007 rs1805008 i3002507';
	});

	// get randomData then get 23andMe data in callback
	APP.getData();
});