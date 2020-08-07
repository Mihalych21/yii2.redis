<?php

namespace app\assets;

use yii\web\AssetBundle;

class GaleryAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
//        'css/style.min.css',
        'css/style.css',
//  'css/animate.css',
        'css/animate.min.css',
//  'css/font-awesome.css',
//        'css/font-awesome.min.css',
//        'css/galery.css',
//        'css/galery.min.css',
    ];
    public $js = [
        'js/scripts.js',
        'js/wow.min.js',
    ];
    public $depends = [
//        'yii\web\JQueryAsset',
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapPluginAsset',
    ];

    public $jsOptions = ['position' => \yii\web\View::POS_END];
}
