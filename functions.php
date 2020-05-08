<?php

function debug($arr)
{
    echo '<pre>' . print_r($arr, true) . '</pre>';
}

/**
 * фильтрация GET или POST данных
 * @param  string $str
 * @return string
 */
function clr_get($str)
{
    $str = trim(strip_tags($str));
    $arr = [
        "delete",
        "update",
        "select",
        "insert",
        "drop",
        "--",
        "/*",
        "*/",
        "./",
        ";"
    ];
    $str = str_ireplace($arr, "", $str);
    return $str;
}