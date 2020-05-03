<?php
//die('view');
use yii\bootstrap\ActiveForm;
use yii\bootstrap\Modal;
use yii\helpers\Html;
use yii\widgets\MaskedInput;
use yii\widgets\Pjax;

$this->title = 'Call';
?>
<?php
Modal::begin([
    'id' => 'callback',
    'header' => '<h3>Укажите Ваш номер телефона и мы перезвоним Вам</h3>',
    //    'footer' => 'TEST'
]);
?>
<div class="row call2">
    <div style="padding: 1em">
        <?php Pjax::begin([
            'clientOptions' => [
                'method' => 'POST'
            ],
            'id' => 'call',
            'enablePushState' => false,
            'timeout' => 20000
        ]);
        ?>

        <?php $form = ActiveForm::begin(['options' => ['data-pjax' => true]], ['id' => 'mail_form', 'class' => 'call']); ?>

        <?= $form->field($model, 'name')->textInput(['required' => true, 'placeholder' => 'Ваше имя'])->label(false) ?>


        <?= $form->field($model, 'tel')->textInput(['class' => 'phone', 'required' => true])
            ->widget(MaskedInput::className(), [
                'mask' => '+7 (999) - 999 - 99 - 99',
            ]);
        ?>
        <input type="hidden" name="call" value="1">
        <div class="form-group">
            <?= Html::submitButton('жду звонка!', ['class' => 'mail_bt', 'id' => 'call-btn', 'style' => 'width:180px']) ?>
        </div>
        <?php ActiveForm::end(); ?>
        <?php Pjax::end(); ?>
    </div>
</div>
<?php
Modal::end();
?>

<script>
    $('#callback').modal('show');
</script>
