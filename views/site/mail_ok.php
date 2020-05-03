<?php
use yii\bootstrap\Modal;

if ($success) {
    $msg = '<h3 style="color:green;text-align: center">Спасибо,'. $name .'  мы с Вами обязательно свяжемся!</h3>';
} else{
    $msg = '<h3 style="color:red;text-align: center">Произошла ошибка!Попробуйте еще раз или свяжитесь другим способом.</h3>';
}
Modal::begin([
        'id' => 'mail-modal',
]);
echo $msg;

Modal::end();
?>

<script>
    $('#mail-modal').modal();

    // через 4 сек удаляем сообщение
    var timerId = setInterval(function() {
        $('#mail-modal').modal('hide');
    }, 3000);
    setTimeout(function() {
        clearInterval(timerId);
    }, 4000);
</script>
