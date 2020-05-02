<?php

use yii\helpers\Html;
use yii\helpers\Url;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Content */

$this->title = 'Страница :' . $model->page;
$this->params['breadcrumbs'][] = ['label' => 'Contents', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->id, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = 'Update';
?>
<div class="content-update">

    <h3 style="display: inline"><?= Html::encode($this->title) ?></h3>
    &nbsp;&nbsp;&nbsp;Перейти в режим <b style="font-size: 120%"><a href="<?= Url::to('') . '&contenteditable=1' ?>">contenteditable</a></b>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
