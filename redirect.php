<?php
//CALLBACK URI FROM 23ANDME DURING OAUTH
$code = $_GET['code'];

// Post these fields to 23andMe.
$post_field_array = array(
  'client_id' => '4fb9c5d63e52a08920c3c0c49183901f',
  'client_secret' => '122f530d3904f0781b8f637d8aeefa3c',
  'grant_type'    => 'authorization_code',
  'code'          => $code,
  'redirect_uri'  => 'http://localhost:8888/redirect.php',
  'scope'         => 'basic names phenotypes:read:sex ancestry rs12913832 rs2153271 rs7349332 rs10034228 rs3827760 rs12896399 rs1667394 rs12821256 rs1805007 rs1805008 i3002507');

// Encode field values for HTTP.
$post_fields = '';
foreach ($post_field_array as $key => $value)
  $post_fields .= "$key=" . urlencode($value) . '&';
$post_fields = rtrim($post_fields, '&');

// Use cURL to get the JSON response from 23andMe
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.23andme.com/token/');
curl_setopt($ch, CURLOPT_POST, count($post_field_array));
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$encoded_json = curl_exec($ch);

// The access token is returned via the 'access_token' key.
$response = json_decode($encoded_json, true);
$access_token = $response['access_token'];

// Set cookie
$name = "access_token";
$value = $access_token;
$expire = time()+86400;
$path = "/";
$domain = "localhost";
$secure = false;
$httponly = false;
setcookie($name, $value, $expire, $path, $domain, $secure, $httponly);

// If access token then set header location to index, else "There was a problem with your request"
// ? > There was ... <a href="/">try again <?php
// Redirect to index.html
header("Location: http://localhost:8888/index.html");
?>