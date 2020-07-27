<?php
use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AdminAsset;

AdminAsset::register($this);
?>
<?php $this->beginPage() ?>
    <!DOCTYPE html>
    <html lang="<?= Yii::$app->language ?>">
    <head>
        <meta charset="<?= Yii::$app->charset ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?= Html::csrfMetaTags() ?>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <link rel="icon" href="favicon.ico" type="image/x-icon">
        <meta name="robots" content="robots.txt">
        <title>Админка | <?= Html::encode($this->title) ?></title>
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
                'class' => 'navbar navbar-expand navbar-dark bg-dark',
            ],
        ]);
        ?>
        <span class="user"
              style="color: #000;background: #fff;line-height: 50px;text-transform: uppercase;float: right;margin-left: 1em;padding: 0 1em"><?= Yii::$app->user->identity->username ?></span>

        <?php
        echo Nav::widget([
            'options' => ['class' => 'navbar-nav navbar-right'],
            'items' => [
                ['label' => 'на сайт', 'url' => ['/']],
                ['label' => 'главная', 'url' => ['/admin']],
                ['label' => 'выйти', 'url' => ['/site/logout'], 'linkOptions' => ['data' => ['method' => 'post']]], // разлогиниваем админа
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
    <script>
        $(document).on('pjax:beforeSend', function () {
            document.body.style.cursor = 'progress';
        });
        $(document).on('pjax:complete', function () {
            document.body.style.cursor = 'default';
        });
    </script>
    </body>
    </html>
<?php $this->endPage() ?>