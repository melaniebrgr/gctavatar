var APP = APP || {};

//Utility functions
APP.math = function() {
	function publicMathRandom(max, min, int) {
		var max = max || 1;
		var min = min || 0;
		if (int) {
			return Math.floor(Math.random()*(max-min+1)+min);
		}
		return Math.random()*(max-min)+min;
	}
	return {
		random: publicMathRandom
	}
}();

// Animation logic
APP.anim = function() {
	// Animate!
}();

// Build the user model that will be reference by the animation, html template
APP.model = function() {
	var modelData = null;

	function getEyeColor(b) {
		//determine if bases are AA, AG, or GG
		//given bases, set blue, green, and brown eye colour percentages
		//pass to function that returns predicted colour
		switch (b) {
			case 'AA':
				return probEyeColor(1, 14, 85);
			case 'AG':
			case 'GA':
				return probEyeColor(7, 37, 56);
			case 'GG':
				return probEyeColor(1, 27, 72);
		}
		function probEyeColor(pBlue, pGreen, pBrown) {
			//get a random number between 0 + 100
			//check if number is in range of 0 - pBlue, pBlue - pGreen, pGreen - pBrown
			//return colour number it is in range of
			var bluex2 = 0 + pBlue,
				greenx2 = bluex2 + pGreen,
				ranNum = Math.floor(Math.random() * (100 + 1));
			if ( ranNum < bluex2 ) {
				return 'blue';
			} else if ( ranNum >= bluex2 && ranNum < greenx2 ) {
				return 'green';
			} else {
				return 'brown';
			}
		}
	}

	function getFreckles(b) {
		switch (b) {
			case 'TT':
				return 'many';
			case 'TC':
			case 'CT':
				return 'some';
			case 'CC':
				return 'few';
		}
	}

	function getHairCurl(b) {
		switch (b) {
			case 'TT':
				return 'curly';
			case 'TC':
			case 'CT':
				return 'wavy';
			case 'CC':
				return 'straight';
		}
	}

	function getGlasses(b) {
		switch (b) {
			case 'TT':
				return 'does not wear glasses';
			case 'TC':
			case 'CT':
				return 'may wear glasses';
			case 'CC':
				return 'wears glasses';		
		}
	}
	function getNeanderthal(p) {
		if (p < 0.015) {
			return 'low';
		} else if (p >= 0.015 && p < 0.035) {
			return 'normal';
		} else {
			return 'high';
		}
	}
	function getHaircolor(blond1, blond2, blond3, red1, red2, red3) {
		//Set default hair color to brown
		//Determine number of variants present that predispose to blond and red hair
		//Determine percent probablity of blond and red hair based on number of variants
		//Get random number random number, if <= to percent Blond or percent Red, update hair color
		//Return haircolor

		var haircolor = 'brown',
			numBlondVariants = 0,
			numRedVariants = 0,
			percentBlond = 0,
			percentRed = 0;

		function numVariants(b, B) {
			var re = new RegExp(B,"g");
			return b.match(re) ? b.match(re).length : 0;
		}

		numBlondVariants += numVariants(blond1, 'T') + numVariants(blond2, 'T') + numVariants(blond3, 'C');
		numRedVariants += numVariants(red1, 'T') + numVariants(red2, 'T') + numVariants(red3, 'C');

		switch (numBlondVariants) {
			case 0:
				percentBlond = 0.005;
				break;
			case 1:
			case 2:
				percentBlond = 0.104;
				break;
			case 3:
			case 4:
				percentBlond = 0.282;
				break;
			case 5:
			case 6:
				percentBlond = 0.529;
				break;
			default:
				percentBlond = 0.005;
				break;
		}

		switch (numRedVariants) {
			case 0:
				percentRed = 0.006;
				break;
			case 1:
				percentRed = 0.057;
				break;
			case 2:
				percentRed = 0.726;
				break;
			default:
				percentRed = 0.006;
				break;
		}

		if (APP.math.random() < percentBlond) {
			haircolor = 'blond';
		}
		if (APP.math.random() < percentRed) {
			haircolor = 'red';
		}
		return haircolor;
	}

	// Create user prototype
	function publicCreateUserModel(data) {
		var user = {};
		user.fullname = `${data.firstName} ${data.lastName}`;
		user.eyecolor = getEyeColor(data.genotypes[0].call);//eventually use a switch statement to sort through SNPs
		user.freckles = getFreckles(data.genotypes[1].call);
		user.haircurl = getHairCurl(data.genotypes[2].call);
		user.eyesight = getGlasses(data.genotypes[3].call);
		user.neanderthal = getNeanderthal(data.neanderthal.proportion);
		user.haircolor = getHaircolor(
			data.genotypes[5].call,
			data.genotypes[6].call,
			data.genotypes[7].call,
			data.genotypes[8].call,
			data.genotypes[9].call,
			data.genotypes[10].call
		);
		return user;
	}

	function publicSet(data) {
		modelData = data;
	}
	function publicGet() {
		return modelData;
	}

	return {
		set: publicSet,
		get: publicGet,
		createUserModel: publicCreateUserModel
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
			// if the proportion falls below a certain threshold, set it to 0
			function ranNum(max, label) {
				var ranNum = Math.random() * max;
				if ( label === ranLabel ) {
					ranNum = +(ranNum * (1 + Math.random())).toFixed(4);
				}
				if (ranNum > max)
					ranNum = max;
				if (ranNum < 0.01) {
					ranNum = 0;
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
		user.sex = ranData.gender();
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

// init module initializes the app, e.g. performs the AJAX request, attaches event handlers
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

	function publicGetData() {
		$.ajax({
			url: 'https://randomuser.me/api/',
			dataType: 'json'
		})
		.done( function(data) {
			APP.ranUser = data;
			// console.log(APP.ranUser);
			// console.log(APP.res.getRandom23andMeUser());
			// If access_token is available, remove access button and skip authorization
			if ( Cookies.get('access_token') && !APP.model.get() ) {
				// Load spinner
				$('.text').append('<img src=\"/img/loading_spinner.gif\" alt=\"loading spinner\" class=\"loading-spinner\">');
				// Get genetic data from 23andMe
				$.get( '/results.php', function(data) {
					// Check the data for errors, then set to the model data
					APP.model.set( APP.res.errCheck(data) );
					console.log(APP.model.get());
					console.log(APP.model.createUserModel(APP.model.get()));
					// Remove spinner
					$('.text .loading-spinner').remove();
					$('.text__connect').toggle();
					$('.text__results').toggle();
				});
			}
		});
	}
	
	// Set button as link to 23andMe authorization
	function handle23andMeConnect() {
		var link = 'https://api.23andme.com/authorize/?redirect_uri=http://localhost:8888/redirect.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry'
		publicGeneScope.forEach(function(el) {
			link += ` ${el}`;
		});
		$('.getAuth').click(function() {
			window.location.href = link;
		});
	}

	// Set height of avatar image to match width
	function setVisAvatarHeight() {
		$('.vis__avatar').height( $('.vis__avatar').width() );
	}

	// Create dropdown manu based on select element
	function createDropdown() {
		// Create a dropdown HTML element container
		// Get every select option and append it as a div to the container
		// On list-item click, set button text
		var dropdownMenu = $('<span>', { 
			class: 'dropdown-menu',
		    click: function(){ $(this).find('.list-items').slideToggle(100)}
		});
		var listItems = $('<ul>', { class: 'list-items' });
		$('#user-filter > option').each(function(i) {
			var text = $(this).text();
			if ( i === 0 ) {
				dropdownMenu.append(`<button>${text}</button> <span>'s results</span>`);
			} 
			var item = $('<li>', {
				text: text,
				click: function() {
					var text = $(this).text();
					$('.dropdown-menu button').text( text );
					$('#user-filter > option').each(function() {
						if ($(this).text() === text ) {
							$(this).attr('selected', true);
						} else {
							$(this).attr('selected', false);
						}
					});
				}
			});
			listItems.append(item);
		});
		dropdownMenu.append(listItems);
		$('.text__results thead th').prepend(dropdownMenu);
	}

	function publicSetUI() {
		setVisAvatarHeight();
		handle23andMeConnect();
		createDropdown();
	}

	return {
		geneScope: publicGeneScope,
		getData: publicGetData,
		setUI: publicSetUI
	}
}();

// On document ready
$(function() {
	APP.init.setUI();
	// get randomData then get 23andMe data in callback
	APP.init.getData();
});