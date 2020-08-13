<?php
use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
?>

<h1>TEST ReCaptcha</h1>

<?php
$form = ActiveForm::begin();
?>

<?= $form->field($model, 'name')->textInput(['autofocus' => true]) ?>


<?= \himiklab\yii2\recaptcha\ReCaptcha3::widget([
    'name' => 'reCaptcha',
    'siteKey' => '6Ld6d7sZAAAAAL_nF5e_cXGW9SZl0o9S1ij0e8l7', // unnecessary is reCaptcha component was set up
    'action' => '/test/index',
]) ?>

<div class="form-group">
    <div class="col-lg-offset-1 col-lg-11">
        <?= Html::submitButton('Отправить', ['class' => 'btn btn-primary', 'name' => 'login-button']) ?>
    </div>
</div>

<?php
ActiveForm::end();
?>

