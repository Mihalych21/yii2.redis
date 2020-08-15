<?php
use yii\bootstrap\Modal;

if (!$flag) {
    $msg = '<h4>Удалено :</h4> <br> Файлов: <b>' . $fileCount . '</b><br>
    Папок : <b>' . $dirCount . '</b>';
    if ($errCount) {
        $msg .= '<br>Не удалось удалить :' . $errCount;
    }
}else{
    $msg = $result ? 'Успешно!' : '<span style="color:red">Сбой!</span>';
}

Modal::begin([
        'header' => $header,
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

