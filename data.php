<?php

$apiKey = '0df1d4e16e8a702f9c4e8954fae00121';
$gtin 	= $_POST['upc'];
$ch 	= curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.outpan.com/v1/products/$gtin");
curl_setopt($ch, CURLOPT_USERPWD, "$apiKey:");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
echo curl_exec($ch);
curl_close($ch);

?>