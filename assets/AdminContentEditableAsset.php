<?php

namespace app\assets;

use yii\web\AssetBundle;


class AdminContentEditableAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/style.css',
        'css/admin_style.css',
    ];    public $js = [
        'js/admin_script.js',
];
    public $depends = [
//        'css/style.css',
        'yii\web\JQueryAsset',
        'yii\bootstrap\BootstrapPluginAsset',
    ];

    public $jsOptions = ['position' => \yii\web\View::POS_HEAD];
}