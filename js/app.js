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

	// If data is missing get random data from https://randomuser.me/
	function getRandomData() {
		function capFirstLetter(str) {
			var word = str.split('');
			word[0] = word[0].toUpperCase();
			return word.join('');
		}

		function publicFirstName() {
			return capFirstLetter(APP.ranUser.results[0].user.name.first) || "Jane";
		}

		function publicLastName() {
			return capFirstLetter(APP.ranUser.results[0].user.name.last) || "Doe";
		}

		function publicGender() {
			return { phenotype_id: 'sex', value: APP.ranUser.results[0].user.gender || "female" };
		}

		function publicAncestry() {
			// 23andMe ancestry array structure:
			var ancestry = [
				{ label: "Sub-Saharan African", proportion: 0 },
				{ label: "European", proportion: 0, unassigned: 0, sub_populations:
					[{ label: "Northwestern European", proportion: 0, unassigned: 0, sub_populations: 
						[{ label: "French and German", proportion: 0 },
						{ label: "Scandinavian", proportion: 0 },
						{ label: "Finnish", proportion: 0 },
						{ label: "British and Irish", proportion: 0 }]},
					{ label: "Ashkenazi", proportion: 0 },
					{ label: "Eastern European", proportion: 0 },
					{ label: "Southern European", proportion: 0, unassigned: 0, sub_populations:
						[{ label: "Balkan", proportion: 0 },
						{ label: "Iberian", proportion: 0 },
						{ label: "Italian", proportion: 0 },
						{ label: "Sardinian", proportion: 0 }]}
				]},
				{ label: "Oceanian", proportion: 0 },
				{ label: "East Asian & Native American", proportion: 0, unassigned: 0, sub_populations: 
					[{ label: "Native American", proportion: 0 },
					{ label: "East Asian", proportion: 0 }
				]},
				{ label: "South Asian", proportion: 0 },
				{ label: "Middle Eastern & North African", proportion: 0, unassigned: 0, sub_populations: 
					[{ label: "North African", proportion: 0 },
					{ label: "Middle Eastern", proportion: 0 }
				]}
			];

			// get ranUser probable ancestry given nationality
			var ranLabel = getLabel();
			function getLabel() {
				switch (APP.ranUser.nationality) {
					case 'AU':
						return 'Oceanian';
					case 'BR':
						return 'British and Irish';
					case 'CA':
						return 'European';
					case 'CH':
						return 'European';
					case 'DE':
						return 'European';
					case 'ES':
						return 'Iberian';
					case 'FI':
						return 'Finnish';
					case 'FR': 
						return 'French and German';
					case 'GB':
						return 'Northwestern European';
					case 'IE':
						return 'British and Irish';
					case 'IR':
						return 'Middle Eastern & North African';
					case 'NL':
						return 'Northwestern European';
					case 'NZ':
						return 'Oceanian';
					case 'US':
						return 'European';
					default: 
						return false;
				}
			}

			// Generate a random number
			// If the population label matches the random user label, 
			// increase the proportion by a random coefficient
			// else, if the proportion falls below a certain threshold, set it to 0
			// FIX THIS, cant be more than parent

			function ranNum(max, label) {
				var ranNum = Math.random() * max;
				if ( label === ranLabel ) {
					return +(ranNum * (1 + Math.random())).toFixed(4);
				}
				ranNum *= Math.random();
				if (ranNum < 0.005) {
					return 0;
				}
				return +ranNum.toFixed(4);
			}

			// Recursively loop through nested sub_population arrays, 
			// setting proportion as a fraction of the parent population proportion
			function assignProportion(arr, initNum) {
				var proportionStart = initNum || 1;
				for (var i = 0; i < arr.length; i++) {
					var randomProportion = ranNum(proportionStart, arr[i].label);
					arr[i].proportion = randomProportion;
					if (arr[i].sub_populations) assignProportion(arr[i].sub_populations, randomProportion);
					proportionStart -= randomProportion;
				}		
			}
			assignProportion(ancestry);
			return ancestry;
		}

		function publicGenotypes() {
			// This array will hold the bases for the locations defined in the 23andMe scope
			var genotypes = [];
			// Base object factory
			function createGene(call, location) {
				var gene = {};
				gene.call = call;
				gene.location = location;
				return gene;
			}
			// Location dictionary, to lookup possible base pair values given a lcoation
			var baseDictionary = {
				'rs12913832': ['A','G'],
				'rs2153271': ['C','T'],
				'rs7349332': ['C','T'],
				'rs10034228': ['C','T'],
				'rs3827760': ['A','G'],
				'rs12896399': ['G','T'],
				'rs1667394': ['C','T'],
				'rs12821256': ['T','C'],
				'rs1805007': ['C','T'],
				'rs1805008': ['C','T'],
				'i3002507': ['G','C']
			};
			// Returns either 1 or 0
			function getRanIndex() {
				return Math.floor(Math.random()*2);
			}
			// Returns random base pairs given a location
			function getRanCall(location) {
				var genotype = '';
				var bases;
				try {
					bases = baseDictionary[location];
					if (baseDictionary[location] === undefined) 
						throw new Error(`Base pairs have not been defined for location: ${location}`);
				} catch (error) {
					console.log(error);
					bases = ['-','-'];
				}
				genotype += bases[getRanIndex()];
				genotype += bases[getRanIndex()];
				return genotype;
			}
			// Return array of randmo base-pairs and the location
			APP.init.geneScope.forEach(function(el) {
				genotypes.push( createGene( getRanCall(el), el));
			});
			return genotypes;
		}
		function publicNeanderthal() {
			// Return a random value between 0.005 and 0.05 (normal range is between 0.01 and 0.04)
			return { proportion: +(Math.random() * ( 0.050 - 0.010 ) + 0.010).toFixed(3) };
		}

		return {
			firstName: publicFirstName,
			lastName: publicLastName,
			gender: publicGender,
			ancestry: publicAncestry,
			genotypes: publicGenotypes,
			neanderthal: publicNeanderthal
		}
	}

	// Random 23andMe user factory
	function publicGetRandom23andMeUser() {
		var user = {};
		var ranData = getRandomData();
		user.ancestry = ranData.ancestry();
		user.firstName = ranData.firstName();
		user.genotypes = ranData.genotypes();
		user.lastName = ranData.lastName();
		user.neanderthal = ranData.neanderthal();
		return user;
	}

	// For traits with error, set to random variables
	// eventually would want to prompt user for values, where reasonable
	function setErrField(data, prop) {
		switch (prop) {
			case 'firstName':
				data.firstName = getRandomData().firstName();
				break;
			case 'lastName':
				data.lastName = getRandomData().lastName();
				break;
			case 'ancestry':
				data.ancestry = getRandomData().ancestry(); 
				break;
			case 'genotypes':
				data.genotypes = getRandomData().genotype();
				break;
			case 'sex':
				data.sex = getRandomData().gender();
				break;
			case 'neanderthal':
				data.neanderthal = getRandomData().neanderthal();
				break;
		}
		return data;
	}

	function publicErrCheck(data) {
		for (var prop in data) {
			try {
				if (data[prop] === null || data[prop].error) {
					throw new Error( `No data available for trait: ${prop}`);
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
		errCheck: publicErrCheck,
		getRandom23andMeUser: publicGetRandom23andMeUser
	}
}();

APP.init = function() {
	var publicGeneScope = [
		'rs12913832', 
		'rs2153271', 
		'rs7349332', 
		'rs10034228', 
		'rs3827760', 
		'rs12896399', 
		'rs1667394', 
		'rs12821256', 
		'rs1805007', 
		'rs1805008', 
		'i3002507'
	];
	
	function publicHandle23andMeConnect() {
		var link = 'https://api.23andme.com/authorize/?redirect_uri=http://localhost:8888/redirect.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry'
		publicGeneScope.forEach(function(el) {
			link += ` ${el}`;
		});
		$('.getAuth').click(function() {
			window.location.href = link;
		});
	}

	function publicGetData() {
		$.ajax({
			url: 'https://randomuser.me/api/',
			dataType: 'json'
		})
		.done( function(data) {
			APP.ranUser = data;
			console.log(APP.ranUser);
			console.log(APP.res.getRandom23andMeUser());
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
					console.log(APP.model.get());
					// Remove spinner
					$('.text .loading-spinner').remove();
				});
			}
		});
	}

	return {
		geneScope: publicGeneScope,
		handle23andMeConnect: publicHandle23andMeConnect,
		getData: publicGetData
	}
}();

// On document ready
$(function() {
	// Set button as link to 23andMe authorization
	APP.init.handle23andMeConnect();
	// get randomData then get 23andMe data in callback
	APP.init.getData();
});