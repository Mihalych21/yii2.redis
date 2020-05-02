<?php

use yii\helpers\Html;

//use Yii;

//var_dump(Yii::$app->requestedAction->id);
/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\Content */

$this->title = 'Create Content';
$this->params['breadcrumbs'][] = ['label' => 'Contents', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="content-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
