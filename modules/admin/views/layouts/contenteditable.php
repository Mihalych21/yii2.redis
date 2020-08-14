<?php

use app\assets\AdminContentEditableAsset;
use app\assets\AdminAsset;
use yii\helpers\Html;
use yii\bootstrap\NavBar;
use yii\bootstrap\Nav;
use yii\widgets\Breadcrumbs;

AdminAsset::register($this);

?>
<?php $this->beginPage() ?>
    <!doctype html>
    <html lang="Ru-ru">
    <head>
        <meta charset="UTF-8">
        <!--        <link href="/css/style.css" rel="stylesheet">-->
        <!--        <link href="/css/admin_style.css" rel="stylesheet">-->
        <!--        <script src="/js/jquery-1.10.2.min.js"></script>-->
        <!--        <script src="/js/admin_script.js"></script>-->
        <style>
            .navbar-inverse {
                height: 50px !important;
            }

        </style>
        <title></title>
        <?php $this->head() ?>
    </head>
    <body>
    <?php $this->beginBody() ?>
    <div class="wrap">
        <?php
        NavBar::begin([
            'brandLabel' => 'Powered by <span style="text-shadow: 1px 1px red">Mihalych21</span>',
            'brandUrl' => Yii::$app->homeUrl,
            'options' => [
                'class' => 'navbar-inverse navbar-fixed-top',
            ],
        ]);
        ?>
        <?php if (strtolower(Yii::$app->user->identity->username) === Yii::$app->params['admin']) {
            $_user =  Yii::$app->params['admin'] . '<span style="text-shadow: none;text-transform: lowercase"> (администратор)</span>';
        } else {
            $_user = Yii::$app->user->identity->username . '<span style="text-shadow: none;text-transform: lowercase"> (модератор)</span>';
        }
        ?>
        <span class="user"
              style="color: #000;background: #fff;line-height: 50px;text-transform: uppercase;float: right;margin-left: 1em;padding: 0 1em"><?= $_user ?></span>

        <?php
        echo Nav::widget([
            'options' => ['class' => 'navbar-nav navbar-right', 'style' => 'color:#fff'],
            'items' => [
                ['label' => 'на сайт', 'url' => ['/']],
                ['label' => 'главная', 'url' => ['/admin']],
                ['label' => 'выйти', 'url' => ['/site/logout']], // разлогиниваем админа
            ],

        ]);
        NavBar::end();
        ?>
        <div class="container">
            <?= Breadcrumbs::widget([
                'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
            ]) ?>
            <br>
            <br>
            <br>
            <?= $content ?>
        </div>
    </div>
    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>