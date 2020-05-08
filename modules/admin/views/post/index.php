<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;
/* @var $this yii\web\View */
/* @var $searchModel app\modules\admin\models\PostSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Входящие письма';
$this->params['breadcrumbs'][] = $this->title;
?>
<style>
    .glyphicon.glyphicon-pencil {
        display: none;
    }
</style>
<div class="post-index">

    <h1><?= Html::encode($this->title) ?></h1><a class="btn btn-danger" style="float: right;margin-bottom: 1em"
                                                 href="/admin/post/del_all">Удалить все</a>
    <?php Pjax::begin(); ?>
    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>
    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            'name',
            'email:email',
            'tel',
            'body:ntext',
            'date',

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>
    <?php Pjax::end(); ?>
</div>
