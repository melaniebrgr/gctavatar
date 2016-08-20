var APP = APP || {};

// Animation logic
APP.anim = function() {

	// Libraries to lookup values for animation
	function getEyeColor(color) {
		// var colorHex = {
		// 	blue: '#1f74ad',
		// 	green: '#3a7c41',
		// 	brown: '#916b66'
		// };
		var baseHue = 193;
		var colorShift = {
			blue: {spin: (221-baseHue), hue: '#1f74ad'},
			green: {spin: (128-baseHue), hue: '#3a7c41'},
			brown: {spin: (21-baseHue), hue: '#916b66'}
		};	
		return colorShift[color];
	}
	function getEyeDialatorMuscleColor(color) {
		var colorHex = {
			blue: '#91C2C3',
			green: '#8CA986',
			brown: '#D6B08C'
		};
		return colorHex[color];
	}
	function getGlasses(glasses) {
		var glassesBool = {
			'does not wear glasses': false,
			'may wear glasses': APP.math.random() < 0.5 ? true : false,
			'wears glasses': true
		};
		return glassesBool[glasses];
	}
	function getHairColor(color) {
		var colorHex = {
			brown: '#916b66',
			blond: '#ddc29b',
			red: '#af4938'
		};
		return colorHex[color];
	}
	function getFreckles(amount) {
		var numFrecklePolys = $('#freckles polygon').length;
		var numFreckles = {
			many: numFrecklePolys,
			some: Math.floor(numFrecklePolys/2),
			few: 0
		};
		return numFreckles[amount];
	}
	function getNeanderthal(neanderthalness) {
		var neanderValues = {
			low: {scale: 0.75, stroke: 4},
			normal: {scale: 1, stroke: 7},
			high: {scale: 1.5, stroke: 11}
		};
		return neanderValues[neanderthalness];
		// return neanderValues['high'];
	}

	// Returns values used to create animation
	function publicCreateAnimModel(usermodel) {
		return {
			base: usermodel,
			eyecolor: getEyeColor(usermodel.eyecolor),
			eyedialatormuscle: getEyeDialatorMuscleColor(usermodel.eyecolor),
			haircolor: getHairColor(usermodel.haircolor),
			freckles: getFreckles(usermodel.freckles),
			glasses: getGlasses(usermodel.eyesight),
			neanderthal: getNeanderthal(usermodel.neanderthal),
			sex: usermodel.sex
			//ANIM MODEL
		};
	}

	// Functions to create GSAP animations
	function animText(text, td, tr) {
		var txtTl = new TimelineMax();
		txtTl
			.to(tr, 0.4, {className: '+=is-highlighted'})
			.to(td, 0.2, {text: ""})
			.to(td, 2, {text: text, ease:Power2.easeIn})
			.to(tr, 0.4, {className: '-=is-highlighted'});
		return txtTl;
	}
	function animEyes(animodel) {
		var irisesFill = $('[id$=radial-gradient-2] stop'),
			// irisesFill = $('#radial-gradient-2 stop'),
			irisesStroke = $('#iris-color-gradient, #iris-color-gradient-2'),
			irisDialatorMuscle = $('#triangles g g path, #triangles-2 g g path'),
			td = $('[data-trait="eyecolor"] + td'),
			tr = td.parent();
		var eyeTl = new TimelineMax();
		eyeTl
			.add(animText(animodel.base.eyecolor, td, tr))
			.addLabel('eye-animation-start');
		irisesFill.each( function(i, el) {
			var color = tinycolor(APP.init.gradients.eyes[i]).spin(animodel.eyecolor.spin);
			eyeTl.to(el, 1.2, {attr: {'stop-color': color.toString()}}, 'eye-animation-start');
		});
		eyeTl
			.to(irisesStroke, 1.2, {attr: {stroke: animodel.eyecolor.hue}}, 'eye-animation-start')
			.to(irisDialatorMuscle, 1.2, {attr: {fill: animodel.eyedialatormuscle}}, 'eye-animation-start');
		return eyeTl;	
	}
	function animGlasses(animodel) {
		// Determine if starting with glasses on or off. They should both start in the same position, but glasses off should not be visible
		// Determine if glasses should still be visible. There are accordingly four possible scenarios
		// 1) Start visible, end on visible: glasses should bob up and down
		// 2) Start visible, end hidden: glasses should fly off to the right and fade out, then be positioned back 'on the nose', display off
		// 3) Start hidden, end visible: glasses should fly in from the left and fade in (will be at start position)
		// 4) Start hidden, end hidden: glasses shoulf fly in then out, then be positioned back 'on the nose'
		// In all cases, glasses should end back on the nose, either visible or hidden
		var glasses = $('#glasses'),
			td = $('[data-trait="eyesight"] + td'),
			tr = td.parent();
		var glassesTl = new TimelineMax();
		glassesTl.add(animText(animodel.base.eyesight, td, tr));
	
		if (glasses.css('visibility') !== 'hidden') {
			// 1,2) Glasses start visible
			if (animodel.glasses) {
				// 1) Glasses end visible
				glassesTl
					.to(glasses, 0.2, {y: '+=4px', ease: Circ.easeOut})
					.to(glasses, 0.75, {y: '-=4px', ease: Elastic.easeOut.config(1, 0.75)});
				return glassesTl;
			} else {
				// 2) Glasses end hidden
				glassesTl
					.to(glasses, 1, {autoAlpha: 0, transformOrigin: '90% top', rotation: 50, y: '-=110px', x: '+=10px', ease: Elastic.easeIn.config(1.2, 1)})
					.set(glasses, {rotation: 0, y: 0, x: 0, autoAlpha: 0});
				return glassesTl;			
			}
		} else if (glasses.css('visibility') === 'hidden') {
			// 3,4) Glasses start hidden
			if (animodel.glasses) {
				// 3) Glasses end visible
				glassesTl
					.fromTo(glasses, 1, {transformOrigin: '10% top', rotation: -50, y: '-=110px', x: '-=10px', ease: Elastic.easeOut.config(1.2, 1), immediateRender: false}, {autoAlpha: 1});
				return glassesTl;
			} else {
				// 4) Glasses end hidden
				// glassesTl
				// 	.fromTo(glasses, 1, {transformOrigin: '10% top', rotation: -50, y: '-=110px', x: '-=10px', ease: Elastic.easeOut.config(1.2, 1), immediateRender: false}, {autoAlpha: 1})
				// 	.to(glasses, 1, {transformOrigin: '90% top', rotation: 50, y: '-=110px', x: '+=10px', ease: Elastic.easeIn.config(1.2, 1), autoAlpha: 0})
				// 	.set(glasses, {rotation: 0, y: 0, x: 0, autoAlpha: 0});
				// return glassesTl;		
				glassesTl.addLabel('no-label');
				return glassesTl;	
			}
		}
	}
	function animHaircolor(animodel) {
	// TO DO: Use tinycolor spin instead of luminance for hair colour
		var hairClr = $('#linear-gradient stop'),
			eyebrows = $('#eyebrow path, #eyebrow-2 path'),
			baseColor = tinycolor(animodel.haircolor),
			td = $('[data-trait="haircolor"] + td'),
			tr = td.parent();
		var hairClrTl = new TimelineMax();
		hairClrTl
			.add(animText(animodel.base.haircolor, td, tr))
			.add('start');
		hairClr.each( function(i, el) {
			var luminance = (tinycolor($(el).attr('stop-color')).getLuminance()*10);
			var color = baseColor.clone();
			color.brighten(luminance*luminance);
			hairClrTl.to(el, 0.8, {attr: {'stop-color': color.toString()}}, 'start');
		});		
		hairClrTl.to(eyebrows, 0.8, {attr: {stroke: baseColor.darken(5).toString()}}, '-=0.8');
		return hairClrTl;
	}
	function animFreckles(animodel) {
		//all freckles hidden to some freckles showing: 0 to half
		var freckles = $('#freckles polygon'),
			currFreckleCount = animodel.freckles,
			prevFreckleCount = 0,
			td = $('[data-trait="freckles"] + td'),
			tr = td.parent();
		freckles.each(function() {
			//count number of freckles currently visible
			if ($(this).css('visibility') !== 'hidden') prevFreckleCount++;
		});
		var frecklesTl = new TimelineMax();
		frecklesTl.add(animText(animodel.base.freckles, td, tr));
		if (currFreckleCount > prevFreckleCount) {
		//amount of freckles in the current model is greater than in the previous model
		//we want to add more freckles, but only those that are not yet shown
		//remove the freckles that are already showing from the start of the freckles array
			freckles.splice(0,prevFreckleCount);
			freckles = freckles.splice(0,currFreckleCount);
			frecklesTl
				.staggerTo(freckles, 0.1, {visibility:'visible', ease: Power3.easeOut}, 0.05);
			return frecklesTl;
		}
		if (currFreckleCount < prevFreckleCount) { 
		//amount of freckles in the current model is less than in the previous model
		//we want to hide the extra freckles from the end of the freckles array
			freckles.splice(0,currFreckleCount);
			frecklesTl
				.staggerTo(freckles, 0.1, {visibility:'hidden', ease: Power3.easeOut}, 0.05);
			return frecklesTl;
		}
		if (currFreckleCount === prevFreckleCount && prevFreckleCount > 0) {
			freckles = freckles.splice(0,currFreckleCount);
			var position = freckles.length * 0.05 + 0.05 - 0.1;
			position = '-=' + position;
			frecklesTl
				.staggerTo(freckles, 0.1, {visibility:'hidden', ease: Power3.easeOut}, 0.05)
				.staggerTo(freckles, 0.1, {visibility:'visible', ease: Power3.easeOut}, 0.05, position);
			return frecklesTl;
		}
	}
	function animNeanderthal(animodel) {
		var eyebrows = $('#eyebrow path, #eyebrow-2 path'),
			nose = $('#nose path'),
			td = $('[data-trait="neanderthalness"] + td'),
			tr = td.parent();
		var neanderTl = new TimelineMax();
		neanderTl
			.add(animText(animodel.base.neanderthal, td, tr))
			.to(eyebrows, 0.8, {attr: {'stroke-width': animodel.neanderthal.stroke}})
			.to(nose, 0.8, {transformOrigin:'right top', scale: animodel.neanderthal.scale});
		return neanderTl;
	}
	function animSex(animodel) {
		var currSex = animodel.sex,
			prevSVG = $('.vis__avatar svg'),
			prevSex = prevSVG.attr('class'),
			td = $('[data-trait="sex"] + td'),
			tr = td.parent();
		var sexTl = new TimelineMax();
		sexTl.add(animText(animodel.sex, td, tr));

		if (currSex === prevSex) {
			return sexTl;
		} else if (currSex === "female") {
			sexTl
				.set(APP.girlSVG, {autoAlpha:0})
				.to(prevSVG, 1, {autoAlpha: 0, onComplete: function() {$('.vis__avatar').html(APP.girlSVG);}})
				.to(APP.girlSVG, 1, {autoAlpha: 1});
			return sexTl;
		} else if (currSex === "male") {
			sexTl
				.set(APP.boySVG, {autoAlpha:0})
				.to(prevSVG, 1, {autoAlpha: 0, onComplete: function() {$('.vis__avatar').html(APP.boySVG);}})
				.to(APP.boySVG, 1, {autoAlpha: 1});
			return sexTl;			
		}
		return sexTl;
	}

	function publicSetMainTl(animodel) {
		window.mainTl = new TimelineMax({delay: 1.5});
		function addTls() {
			mainTl
				.add(animEyes(animodel))
				.add(animGlasses(animodel))
				.add(animHaircolor(animodel))
				.add(animFreckles(animodel))
				.add(animNeanderthal(animodel));
		}
		mainTl
			.add(animSex(animodel))
			.addCallback(addTls);
		// mainTl.seek('freckles+=1');
		// mainTl.timeScale(3);
	}

	return {
		createAnimModel: publicCreateAnimModel,
		setMainTl: publicSetMainTl
	};
}();