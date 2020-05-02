<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use app\assets\GaleryAsset;
use yii\widgets\Pjax;

//use yii\widgets\Spaceless;

GaleryAsset::register($this);
?>
<?php $this->beginPage() ?>
<?php //Spaceless::begin(); // удаляет пробелы между HTML тегами?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
<div class="wrap">
    <main class="container">
        <?= $content ?>
    </main>
</div>
<footer class="footer">
    <div class="container">
        <p class="pull-left">&copy; <strong class="brand-footer"><?= YII::$app->params['company'] ?></strong>&nbsp;&nbsp;
            2014&mdash;<?= date('Y') ?></p>
    </div>
</footer>
<?php $this->endBody() ?>
</body>
</html>
<?php //Spaceless::end()?>
<?php $this->endPage() ?>
