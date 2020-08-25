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
    <a class="btn btn-danger" style="" href="/admin/callback/del_all">Удалить все</a>
    <?php
    if (!empty($_SESSION['newCallCount'])) :
    ?>
    <a href="/admin/default/zvonoklabel" class="pjax btn btn-dark">Пометить прочиттанными</a>
    <?php
        endif;
    ?>
    <br>
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
                window.location.replace('/admin/callback/view?id=' + id);
            });
        }
    }
</script>
