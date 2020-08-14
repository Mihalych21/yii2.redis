<?php
use yii\bootstrap4\Modal;

if ($success) {
    $msg = '<h3 style="color:green;text-align: center">Спасибо,'. $name .'  мы с Вами обязательно свяжемся!</h3>';
} else{
    $msg = '<h3 style="color:red;text-align: center">Произошла ошибка!Попробуйте еще раз или свяжитесь другим способом.</h3>';
}

$msg .= $res;

Modal::begin([
        'id' => 'mail-modal',
]);
echo $msg;

Modal::end();
?>

<script>
    $('#mail-modal').modal();

     // через 4 сек удаляем сообщение
    setTimeout(function() {
        $('#mail-modal').modal('hide');
    }, 4000);
</script>
