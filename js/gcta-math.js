var APP = APP || {};

// Utility functions
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
	};
}();