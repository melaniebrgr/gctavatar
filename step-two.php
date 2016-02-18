<?php
$code = $_GET['code'];

// We will post these fields to 23andMe.
$post_field_array = array(
  'client_id' => '4fb9c5d63e52a08920c3c0c49183901f',
  'client_secret' => '122f530d3904f0781b8f637d8aeefa3c',
  'grant_type'    => 'authorization_code',
  'code'          => $code,
  'redirect_uri'  => 'http://melanies-macbook-pro.local:5757/step-two.php',
  'scope'         => 'basic names phenotypes:read:sex ancestry rs12913832 rs2153271');

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
//Y basic: /1/demo/user/
//Y names: /1/demo/names/profile_id/ -> /1/demo/names/SP1_FATHER_V4/
//Y ancestry: /1/demo/ancestry/profile_id/ -> /1/demo/ancestry/SP1_FATHER_V4/
//N phenotype: /1/demo/phenotypes/profile_id/phenotype_id/ -> /1/demo/phenotypes/SP1_FATHER_V4/sex/
//Y genotypes:  /1/demo/genotypes/profile_id/?locations=&unfiltered=&format=... -> /1/demo/genotypes/SP1_FATHER_V4/?locations=rs12913832

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

$curlz = curl_init();
$headers = array();
$headers[] = 'Authorization: Bearer ' . $access_token;
curl_setopt_array($curlz, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.23andme.com/1/demo/names/' . $res["profiles"][1]["id"] . '/'
));
curl_setopt($curlz, CURLOPT_HTTPHEADER, $headers);
$res1 = curl_exec($curlz);
curl_close($curlz);


$curl = curl_init();
$headers = array();
$headers[] = 'Authorization: Bearer ' . $access_token;
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.23andme.com/1/demo/names/'
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$res2 = curl_exec($curl);
curl_close($curl);
?>
<script> 
var apiJSON = <?php print_r($res) ?>;
var apiJSON1 = <?php print_r($res1) ?>;
var apiJSON2 = <?php print_r($res2) ?>;
console.log(apiJSON);
console.log(apiJSON1);
console.log(apiJSON2);
// console.log( <?php print_r($res["email"]) ?> );
var test = JSON.parse( JSON.stringify(<?php print_r($res) ?>) );
console.log( test["email"] );


</script>
<script>
//location.href="endpoints.html?token=<?=$access_token?>"
</script>
