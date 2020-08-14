<?php
echo $success, $res;
?>
<script>
    // через 4 сек удаляем сообщение
    var timerId = setInterval(function() {
        $('#callback').modal('hide');
    }, 4000);

    setTimeout(function() {
        clearInterval(timerId);
    }, 4000);
</script>
