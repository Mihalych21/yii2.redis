<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AdminAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/admin_style.css',
//        'css/bootsrap.css',
    ];
    public $js = [
//        'js/jquery-1.11.2.min.js',
//        'js/script.js',
        'js/admin_script.js',
    ];
    public $depends = [
//        'css/style.css',
//        'yii\web\JQueryAsset',
        'yii\bootstrap4\BootstrapPluginAsset',
    ];

    public $jsOptions = ['position' => \yii\web\View::POS_HEAD];
}
