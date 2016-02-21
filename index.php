<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>GCTAvatar</title>
	<link href='https://fonts.googleapis.com/css?family=Poppins:300,500,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="css/styles.css">
</head>
<body>
	<header id="header">
		<h1>GCTAvatar</h1>
	</header>
	<main>
		<section class="visualization">
			<div class="avatar">
			</div>
		</section>
		<section class="description">
			<h2>Your GCTAvatar results:</h2>
			<p class="getAuth"><a href="https://api.23andme.com/authorize/?redirect_uri=http://localhost:8888/test2.php&response_type=code&client_id=4fb9c5d63e52a08920c3c0c49183901f&scope=basic names phenotypes:read:sex ancestry rs12913832 rs2153271 rs7349332 rs10034228 rs3827760 rs12896399 rs1667394 rs12821256 rs1805007 rs1805008 i3002507">Get Authorized!</a></p>
			
		</section>
	</main>
	<footer id="footer">
		<ul>
			<li>footnote 1</li>
		</ul>
	</footer>
	
	<script src="js/jquery.min.js"></script>
	<script src="js/js.cookie.js"></script>
	<script>
		// console.log(Cookies.get('access_token'));
		$(document).ready(function() {
			if ( Cookies.get('access_token') ) {
				$(".getAuth").remove();
				$(".description").append("<button class='getData'>Get Data</button>");
				$(".getData").click(function() {
					$.get( "/results.php", function(data) {
						// console.log(JSON.parse(data));
						console.log(data);
					} );
				});
			}
		}); 
	</script>
</body>
</html>