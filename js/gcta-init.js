var APP = APP || {};

// Initialize app: perform the AJAX requests, attach event handlers
APP.init = function() {

	// Functions to perform AAJX requests
	// Genes accessed from 23andMe
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

	// Preserves gradient data from initial SVG
	var publicGradients = {};

	function showResults() {
		// hide connect view and show results view
		$('.text__connect').toggle();
		$('.text__results').toggle();

		// Set up drowpdown menu and PNG download button
		step2();		
	}

	// AJAX request to 23andMe
	function get23andMeData() {
		// Show loading animation
		var modal = $('.loading'),
			letters = $('.loading span');
		TweenMax.to(modal, 0.3, {autoAlpha: 1});
		var loadingTl = new TimelineMax({delay: 0.4, repeat: -1, repeatDelay: 0.8});
		loadingTl
			.to(letters[0], 0.4, {y: '-=25', ease: Power3.easeOut})
			.to(letters[0], 0.4, {y: 0, ease: Back.easeOut.config(2.5)})
			.to(letters[1], 0.4, {y: '-=25', ease: Power3.easeOut}, '-=0.4')
			.to(letters[1], 0.4, {y: 0, ease: Back.easeOut.config(2.5)})
			.to(letters[2], 0.4, {y: '-=25', ease: Power3.easeOut}, '-=0.4')
			.to(letters[2], 0.4, {y: 0, ease: Back.easeOut.config(2.5)})
			.to(letters[3], 0.4, {y: '-=25', ease: Power3.easeOut}, '-=0.4')
			.to(letters[3], 0.4, {y: 0, ease: Back.easeOut.config(2.5)});

		//Second, get genetic data from 23andMe
		$.get( 'results.php', function(data) {
			// console.log('data', data);
			// console.log( APP.res.errCheck(data));
			// console.log( APP.model.createUserModel(APP.res.errCheck(data)));
			// console.log( APP.anim.createAnimModel(APP.model.createUserModel(APP.res.errCheck(data))));
			// console.log( APP.anim.createAnimModel(APP.model.createUserModel(APP.res.getRandom23andMeUser())));

			// Set 23andMe user to public object properties
			APP.model.set( APP.anim.createAnimModel( APP.model.createUserModel( APP.res.errCheck(data))));
			// Hide loading modal, show results
			TweenMax.to(modal, 0.3, {autoAlpha: 0});
			// Change view
			showResults();
			// Start animation
			APP.anim.setMainTl(APP.model.get()[0]);
		});
	}
	// AJAX request to Randomuser API; get 23andMe data on done
	function getRandomData() {
		$.ajax({
			url: 'https://randomuser.me/api/',
			dataType: 'json'
		})
		.done( function(data) {
			APP.ranUser = data;
			// Random user to public object properties
			APP.model.set( APP.anim.createAnimModel( APP.model.createUserModel( APP.res.getRandom23andMeUser())));
		});
	}

	// AJAX request for boy and girl SVG; get random data on done
	function getSVG() {
		$.ajax({
			url: 'img/boy-05.svg',
			dataType: 'xml'
		})
		.done(function( data, textStatus, jqXHR ){ 
			APP.boySVG = $(data).find('svg');
		});
		$.ajax({
			url: 'img/girl-08.svg',
			dataType: 'xml'
		})
		.done(function( data, textStatus, jqXHR ){ 
			APP.girlSVG = $(data).find('svg');

			// Display girl SVG
			var svgTl = new TimelineMax();
			$('.vis__avatar').html($(data).find('svg'));

			// With SVG loaded into document record gradient data
			setGradients();

			// Get random user data
			getRandomData();
		});		
	}
	
	// Functions to set up UI
	// Set button as link to 23andMe authorization
	function handle23andMeConnectBtn() {
		var link = 'https://api.23andme.com/authorize/?redirect_uri=http://www.lab3d.io/GCTAvatar/redirect.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry'
		publicGeneScope.forEach(function(el) {
			link += ` ${el}`;
		});
		$('.getAuth').click(function() {
			// If access_token is available skip authorization and retrieve data
			if (Cookies.get('access_token')) { 
				get23andMeData(); 
			} else {
				window.location.href = link;
			}
		});
	}

	function handleGenerateRanUserBtn() {
		$('.noAuth').click(function() {
			showResults();
			APP.anim.setMainTl(APP.model.get()[0]);
		});		
	}

	// Set height of avatar image to match width
	function setVisAvatarHeight() {
		$('.vis__avatar').height( $('.vis__avatar').width() );
		$( window ).resize(function() { 
			$('.vis__avatar').height( $('.vis__avatar').width() );
		}); 
	}
	// Create dropdown menu based on select element
	function createDropdown() {
		// Create a dropdown HTML element container
		// Get every select option and append it as a div to the container
		// On list-item click, set button text
		var users = APP.model.get(),
				userFilter = $('#user-filter');
		users.forEach(function(el) {
			userFilter.append(`<option>${el.base.fullname}</option`);
		});
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
				click: function(e) {
					var text = $(this).text();
					$('.dropdown-menu button').text( text);
					$('#user-filter > option').each(function() {
						if ($(this).text() === text ) {
							$(this).attr('selected', true);
						} else {
							$(this).attr('selected', false);
						}
					});

					// Retrieve animation model and start animation
					mainTl.progress(0);
					mainTl.pause();
					mainTl.clear();
					APP.anim.setMainTl(APP.model.get()[i]);
				}
			});
			listItems.append(item);
		});
		dropdownMenu.append(listItems);
		$('.text__results thead th').prepend(dropdownMenu);
	}
	function downloadPNG() {
		var counter = 1;

		function svgData() {
			// use vanilla JS to retrieve viewBox attribute info
			// (jQuery converts attr name to lowercase by default, returning 'undefined')
			var svg = document.querySelector('svg');
			var viewBox = svg.getAttribute('viewBox');
				viewBox = viewBox.split(/\s+|,/);
			var html = $(svg).parent().html();
			var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
			
			return {
				src: imgsrc,
				w: viewBox[2],
				h: viewBox[3]
			}
		}

		$('a.getSVG').click(function() {
			var svg = svgData();
			var canvas = $('<canvas/>')[0],
			    ctx = canvas.getContext('2d');
			    canvas.setAttribute('width', svg.w);
			    canvas.setAttribute('height', svg.h);

			var image = new Image;
			image.src = svg.src;
			ctx.drawImage(image, 0, 0);
			var canvasdata = canvas.toDataURL("image/png");
			$(this).attr('download', `GCTAvatar_${counter}.png`);
			$(this).attr('href', canvasdata);
			counter++;
		});
	}
	function setGradients() {
		var irises = $('#radial-gradient-2 stop'),
			colors = [];
		irises.each(function(i, el) {
			colors.push($(el).attr('stop-color'));
		});
		publicGradients.eyes = colors;
	}		
	function publicStep1() {
		setVisAvatarHeight();
		handle23andMeConnectBtn();
		handleGenerateRanUserBtn();
		getSVG();
	}
	function step2() {
		createDropdown();
		downloadPNG();
	}

	return {
		geneScope: publicGeneScope,
		step1: publicStep1,
		gradients: publicGradients,
		get23andMeData: get23andMeData
	};
}();

// On document ready
$(function() {
	APP.init.step1();
	if (Cookies.get('access_token')) { 
		APP.init.get23andMeData();
	}
});