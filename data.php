<?php

$apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
$gtin 	= $_POST['data'];
$ch 	= curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.outpan.com/v1/products/$gtin");
curl_setopt($ch, CURLOPT_USERPWD, "$apiKey:");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
echo curl_exec($ch);
curl_close($ch);

?>