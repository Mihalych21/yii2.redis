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

    <h1><?= Html::encode($this->title) ?></h1>
    <a class="btn btn-danger" href="/admin/post/del_all">Удалить все</a>
    <?php
    if (!empty($_SESSION['newPostCount'])) :
    ?>
    <a href="/admin/default/postlabel" class="pjax btn btn-dark">Пометить все прочиттанными</a>
    <?php
    endif;
    ?>
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
            'is_read',
            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>
    <?php Pjax::end(); ?>
</div>
<script>
    let td = document.getElementsByTagName('td');
    for (i = 0; i < td.length; i++){
        if (td[i].innerText == '0'){
            let id = td[i].parentNode.firstChild.nextSibling.textContent;
            let tr = td[i].parentElement;
            tr.style.background = 'rgba(53,107,97,0.65)';
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', function () {
                window.location.replace('/admin/post/view?id=' + id);
            });
        }
    }
</script>
