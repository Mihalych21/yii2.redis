<?php
use yii\bootstrap4\Modal;
$msg = 'Удалено : <br> Файлов: ' . $fileCount . '<br>
    Папок : ' .  $dirCount;
if ($errCount){
    $msg .= '<br>Не удалось удалить :' . $errCount;
}

Modal::begin([
    'id' => 'modal',
]);
echo $msg;

Modal::end();
?>

<script>
    $('#modal').modal();

    // через 4 сек удаляем сообщение
    setTimeout(function() {
        $('#modal').modal('hide');
    }, 4000);
</script>

