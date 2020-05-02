<div id="close">&times;</div>
<script>
    var result = document.querySelector('#result');
    document.querySelector('#close').addEventListener('click', function () {
        result.style.display = 'none';
    });
    setTimeout("result.style.display = 'none'", 5000);
</script>
<?php
die($msg);
?>

<h1 style="color: #fff"><?= $msg ?></h1>
