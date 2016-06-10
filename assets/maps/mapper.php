<?php

///********** MAP FILENAME **********\\\
include 'map1.php';
///**********************************\\\



header('Content-Type: text/json;');

if (!isset($_GET['dir']) || strlen($_GET['dir']) == 0)
	die ('{"type":"error","data":{"message":"Unknown request."}}');


function getData($tempArr, $getTextOnly)
{
	return $getTextOnly
		? (array_key_exists('text', $tempArr)
			? $tempArr['text']
			: [])
		: (array_key_exists('dirs', $tempArr)
			? array_keys($tempArr['dirs'])
			: array_keys($tempArr));
}
function getByPath($path, $getTextOnly)
{
	$re = "/^[\\S\\/]+$/";
	preg_match($re, $path, $matches);
	if(count($matches) == 0)
		return [];

	global $map;

	if (strtolower($path) == 'home')
		return getData($map, $getTextOnly);

	$slicePath = explode('/', $path);
	$tempArr = $map;
	for ($i=0; $i < count($slicePath); $i++) {
		if (array_key_exists($slicePath[$i], $tempArr['dirs']))
			$tempArr = $tempArr['dirs'][$slicePath[$i]];
		else return [];
	}
	return getData($tempArr, $getTextOnly);
}
echo '{"type":"map","data":{"dirs":'
	.json_encode(
		getByPath($_GET['dir'], false)
	)
	.',"text":'
	.json_encode(
		getByPath($_GET['dir'], true)
	)
	.'}}';