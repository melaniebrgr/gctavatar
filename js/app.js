// Utility functions
function log(m) {
	console.log(m);
}

// App logic
var APP = APP || {};

APP.model = function(data) {
	var publicModel = data;
	return {
		publicModel: publicModel
	}
}();

// handleRes module parses the initial data from 23andMe
APP.handleRes = function() {
	
	// TODO: Handle each possible outcome, getting user input
	function setErrField(rawdata, prop) {
		var data = rawdata;
		switch (prop) {
			case 'firstName':
				break;
			case 'lastName':
				break;
			case 'ancestry':
				break;
			case 'genotypes':
				break;
			case 'sex':
				data['sex'] = {
					phenotype_id: "sex",
					value: prompt("Male or female?").toLowerCase()
				}
				break;
			case 'neanderthal':
				break;
		}
		return data;
	}
	function publicValidate(rawdata) {
		var data = rawdata;
		for (var prop in data) {
			// log( "data." + prop + " = " + data[prop] );
			try {
				if (data[prop].error) {
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
		validate: publicValidate
	}
}();

// Run on document ready
$(function() {
$('.getAuth').click(function() {
	window.location.href = 'https://api.23andme.com/authorize/?redirect_uri=http://localhost:8888/redirect.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry rs12913832 rs2153271 rs7349332 rs10034228 rs3827760 rs12896399 rs1667394 rs12821256 rs1805007 rs1805008 i3002507';
});

// If access_token is available in the cookie skip authorization
if ( Cookies.get('access_token') ) {
	$('.getAuth').remove();
	//display loader div
	$.get( '/results.php', function(data) {
		//hide loader here
		log(APP.handleRes.validate(data));
	});
}
});