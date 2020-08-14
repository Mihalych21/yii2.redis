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

function mb_ucfirst($text)
{
    return mb_strtoupper(mb_substr($text, 0, 1)) . mb_substr($text, 1);
}