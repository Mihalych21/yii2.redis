<?php

use yii\helpers\Html;
use yii\widgets\DetailView;
use app\models\Callback;

/* @var $this yii\web\View */
/* @var $model app\models\Callback */

$this->title = $model->name;
$this->params['breadcrumbs'][] = ['label' => 'Callbacks', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
\yii\web\YiiAsset::register($this);
?>
<?php
// Сразу же помечаем прочитанным
$item = Callback::findOne(['id' => $model->id]);
$item->is_read = '1';
$item->save();
?>
<div class="callback-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Удалить', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Вы действительно хотите удалить данную запись?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'name',
            'tel',
            'date',
        ],
    ]) ?>

</div>
