<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
/* @var $this yii\web\View */
/* @var $searchModel app\modules\admin\callbackSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Callbacks';
$this->params['breadcrumbs'][] = $this->title;
?>
<style>
    .glyphicon.glyphicon-pencil{
        display: none;
    }
</style>
<div class="callback-index">

    <h1>Заказы обратного звонка</h1>
    <a class="btn btn-danger" style="float: right;margin-bottom: 1em" href="/admin/callback/del_all">Удалить все</a>
    <?php Pjax::begin(); ?>
    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            'name',
            'tel',
            'date',

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>
    <?php Pjax::end(); ?>
</div>
