<?php

///********** MAP FILENAME **********\\\
include 'map1.php';
///**********************************\\\



header('Content-Type: text/json;');

if (!isset($_GET['dir']) || strlen($_GET['dir']) == 0
        || !isset($_GET['items']))
    die ('{"type":"error","data":{"message":"Unknown request."}}');


function getData($tempArr, $type)
{
    switch ($type) {
        case 'text':
            return (array_key_exists('text', $tempArr)
                ? $tempArr['text']
                : []);
            break;
        case 'pick':
            // items mean current user's items
            if (isset($_GET['items'])) {
                if (array_key_exists('pick', $tempArr)) {
                    $picks = $tempArr['pick'];
                    $items = explode(',', $_GET['items']);
                    $toPick = [];
                    for ($i=0; $i < count($picks); $i++)
                    {
                        $newPicks = $picks;
                        for ($j=0; $j < count($newPicks); $j++)
                        {
                            $newPicks[$i] = strtolower($newPicks[$i]);
                        }
                        if (!in_array(strtolower($newPicks[$i]), $items))
                            array_push($toPick, $picks[$i]);
                    }
                    return $toPick;
                } else
                    return [];
            } else
            {
                return (array_key_exists('pick', $tempArr)
                    ? $tempArr['pick']
                    : []);
            }
            break;
        case 'dirs':
            return (array_key_exists('dirs', $tempArr)
                ? array_keys($tempArr['dirs'])
                : array_keys($tempArr));
        case 'items':
            $gitems = $_GET['items'];
            if (array_key_exists('items', $tempArr))
            {
                $items = explode(',', $gitems);
                $exists = false;
                $newItems = $tempArr['items'];
                for ($j=0; $j < count($newItems); $j++)
                {
                    $newItems[$j] = strtolower($newItems[$j]);
                }

                for ($i=0; $i < count($items); $i++)
                {
                    $item = $items[$i];
                    if (in_array(strtolower($item), $newItems))
                        $exists = true;
                }
                return $exists;
            } else
            {
                return true;
            }
        break;
    }
}
function getByPath($path, $type)
{
    $re = "/^[\\S\\/]+$/";
    preg_match($re, $path, $matches);
    if(count($matches) == 0)
        return [];

    global $map;

    if (strtolower($path) == 'home')
        return getData($map, $type);

    $slicePath = explode('/', $path);
    $tempArr = $map;
    for ($i=0; $i < count($slicePath); $i++) {
        if (array_key_exists($slicePath[$i], $tempArr['dirs']))
            $tempArr = $tempArr['dirs'][$slicePath[$i]];
        else return [];
    }
    return getData($tempArr, $type);
}
$dir = $_GET['dir'];
$items = getByPath($dir, 'items');
$dirs = getByPath($dir, 'dirs');
$text = getByPath($dir, 'text');
$pick = getByPath($dir, 'pick');



echo '{"type":"map","data":{"dirs":'
    .json_encode(
        $items ? $dirs : []
    )
    .',"text":'
    .json_encode(
        $items ? $text : []
    )
    .',"pick":'
    .json_encode(
        $items ? $pick : []
    )
    .',"items":'.
        json_encode($items)
    .'}}';
