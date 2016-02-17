<?php
$code = $_GET['code'];

// We will post these fields to 23andMe.
$post_field_array = array(
  'client_id' => '4fb9c5d63e52a08920c3c0c49183901f',
  'client_secret' => '122f530d3904f0781b8f637d8aeefa3c',
  'grant_type'    => 'authorization_code',
  'code'          => $code,
  'redirect_uri'  => 'http://melanies-macbook-pro.local:5757/step-two.php',
  'scope'         => 'basic names phenotypes:read:sex ancestry analyses');

// Encode the field values for HTTP.
$post_fields = '';
foreach ($post_field_array as $key => $value)
  $post_fields .= "$key=" . urlencode($value) . '&';
$post_fields = rtrim($post_fields, '&');

// Use cURL to get the JSON response from 23andMe.
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.23andme.com/token/');
curl_setopt($ch, CURLOPT_POST, count($post_field_array));
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$encoded_json = curl_exec($ch);

// The access token is returned via the 'access_token' key.
$response = json_decode($encoded_json, true);
$access_token = $response['access_token'];

// Use access token to call enpoints
$curl = curl_init();

$headers = array();
$headers[] = 'Authorization: Bearer ' . $access_token;

curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.23andme.com/1/demo/user/'
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$res = curl_exec($curl);
curl_close($curl);

print_r($res);
?>
<script> 
var apiJSON = <?php print_r($res) ?>;
console.log(apiJSON);
</script>
<script>
//location.href="endpoints.html?token=<?=$access_token?>"
</script>
