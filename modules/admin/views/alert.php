<?php
if ($result){
    $msg = 'Успешно!';
}else{
    $msg = '<span style="color:red">Сбой!</span>';
}

?>

<style>
    .alert-success {
        max-width: 50%;
        background: rgba(15, 39, 51, .5);
        color: #fff;
    }
</style>
<br>
<?php
use yii\bootstrap4\Alert;

Alert::begin([
    'options' => [
        'class' => 'alert-success hr'
    ]
]);
?>

<h3><?= $msg ?></h3>

<?php
Alert::end();
?>
<script>
    setTimeout("$('.alert-success').remove()", 3000);
</script>