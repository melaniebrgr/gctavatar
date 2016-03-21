<?php
// get access token from cookie
$access_token = $_COOKIE["access_token"];

// make cURL request to endpoints
$curl = curl_init();
$headers = array();
$headers[] = 'Authorization: Bearer ' . $access_token;

// get User ID: /1/demo/user/
$endpoint = 'https://api.23andme.com/1/demo/user/';
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $endpoint
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$res = curl_exec($curl);
$decodeRes = json_decode($res, true);
$profileID = $decodeRes["profiles"][0]["id"];

// get Names: /1/demo/names/profile_id/
$endpoint = 'https://api.23andme.com/1/demo/names/' . $profileID . '/';
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $endpoint
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$res1 = curl_exec($curl);
$decodeRes1 = json_decode($res1, true);

// get Ancestry: /1/demo/ancestry/profile_id/
$endpoint = 'https://api.23andme.com/1/demo/ancestry/' . $profileID . '/';
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $endpoint
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$res2 = curl_exec($curl);
$decodeRes2 = json_decode($res2, true);

// get Genotypes: /1/demo/genotypes/profile_id/?locations=&unfiltered=&format=...
$endpoint = 'https://api.23andme.com/1/demo/genotypes/'. $profileID . '/?format=embedded&locations=rs12913832%20rs2153271%20rs7349332%20rs10034228%20rs3827760%20rs12896399%20rs1667394%20rs12821256%20rs1805007%20rs1805008%20i3002507';
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $endpoint
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$res3 = curl_exec($curl);
$decodeRes3 = json_decode($res3, true);

// get Phenotype:sex /1/phenotypes/profile_id/phenotype_id/
$endpoint = 'https://api.23andme.com/1/phenotypes/' . $profileID . '/sex/';
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $endpoint
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$res4 = curl_exec($curl);
$decodeRes4 = json_decode($res4, true);

// get Neanderthal percentage: /1/demo/neanderthal/profile_id/
$endpoint = 'https://api.23andme.com/1/demo/neanderthal/' . $profileID . '/';
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $endpoint
));
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$res5 = curl_exec($curl);
$decodeRes5 = json_decode($res5, true);

curl_close($curl);

$traits = array(
	"firstName" => $decodeRes1["first_name"],
	"lastName" => $decodeRes1["last_name"],
	"ancestry" => $decodeRes2["ancestry"]["sub_populations"],
	"genotypes" => $decodeRes3["genotypes"],
	"sex" => $decodeRes4,
	"neanderthal" => $decodeRes5["neanderthal"]
);

header('Content-Type: application/json');
echo json_encode($traits);
?>