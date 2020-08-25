<?php
//die('view');
use yii\bootstrap4\ActiveForm;
use yii\bootstrap4\Modal;
use yii\helpers\Html;
use yii\widgets\MaskedInput;
use yii\widgets\Pjax;

$this->title = 'Call';
?>
<?php
Modal::begin([
    'id' => 'callback',
    'title' => '<h3>Укажите Ваш номер телефона и мы перезвоним Вам</h3>',
    //    'footer' => 'TEST'
]);
?>
<div class="row" style="padding: 1em">
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

        <?= $form->field($formModel, 'name')->textInput(['required' => true, 'placeholder' => 'Ваше имя'])->label(false) ?>


        <?= $form->field($formModel, 'tel')->textInput(['class' => 'phone', 'required' => true])
            ->widget(MaskedInput::className(), [
                'mask' => '+7 (999) - 999 - 99 - 99',
            ]);
        ?>

        <?/*= $form->field($formModel, 'reCaptcha')->widget(
            \himiklab\yii2\recaptcha\ReCaptcha2::className(),
            [
                'siteKey' => '6LftVL4ZAAAAAPQq_Sj_9_6Cyguka6qMJpDJRyWs', // unnecessary is reCaptcha component was set up
            ]
        ) */?>

        <?/*= \himiklab\yii2\recaptcha\ReCaptcha3::widget([
            'name' => 'reCaptcha',
            'siteKey' => '6LfNdr4ZAAAAAIKLdnRzRCWwNM6HyP0qo0nYglbN', // unnecessary is reCaptcha component was set up
            'action' => 'call',
        ]) */?>

        <div class="form-group">
            <?= Html::submitButton('жду звонка!', ['class' => 'btn success-button button-anim']) ?>
        </div>
        <?php ActiveForm::end(); ?>
        <?php Pjax::end(); ?>
</div>
<?php
Modal::end();
?>

<script>
    $('#callback').modal('show');
</script>
