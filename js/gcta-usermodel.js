var APP = APP || {};

// Create user model
APP.model = function() {
	// modelData variable will hold the error-checked reponse from 23andMe
	var modelData = {};

	// Functions to decode 23andMe genotype to phenotypes
	function getEyeColor(b) {
		// Determine if bases are AA, AG, or GG
		// Given bases, set blue, green, and brown eye colour percentages
		// Pass to function that returns predicted colour
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
			// Get a random number between 0 + 100
			// Check if number is in range of 0 - pBlue, pBlue - pGreen, pGreen - pBrown
			// Return colour number it is in range of
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
		// Set default hair color to brown
		// Determine number of variants present that predispose to blond and red hair
		// Determine percent probablity of blond and red hair based on number of variants
		// Get random number random number, if <= to percent Blond or percent Red, update hair color
		// Return haircolor

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

	// Create user prototype, and getter and setter
	function publicCreateUserModel(data) {
		return {
			fullname: `${data.firstName} ${data.lastName}`,
			eyecolor: getEyeColor(data.genotypes[0].call), //eventually use a switch statement to sort through SNPs
			freckles: getFreckles(data.genotypes[1].call),
			haircurl: getHairCurl(data.genotypes[2].call),
			eyesight: getGlasses(data.genotypes[3].call),
			neanderthal: getNeanderthal(data.neanderthal.proportion),
			haircolor: getHaircolor(
				data.genotypes[5].call,
				data.genotypes[6].call,
				data.genotypes[7].call,
				data.genotypes[8].call,
				data.genotypes[9].call,
				data.genotypes[10].call
			),
			sex: data.sex.value
		};
	}
	function publicSet(animModel) {
		// Setter expects animation object model
		modelData[animModel.base.fullname] = animModel;
	}
	function publicGet() {
		return modelData;
	}

	return {
		set: publicSet,
		get: publicGet,
		createUserModel: publicCreateUserModel
	};
}();