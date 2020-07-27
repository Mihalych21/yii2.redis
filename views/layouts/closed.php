<?php
header('HTTP/1.1 503 Service Temporarily Unavailable');
header('Retry-After: 3600');
?>
<!doctype html>
<html lang="Ru-ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Сайт временно не работает</title>
</head>
<style>
    body{
        background-image: url("/img/closed.jpg");
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>
<body>
</body>
</html>