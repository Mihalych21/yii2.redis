<?php
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Last-Modified:' . gmdate("D, d M Y H:i:s \G\M\T", $data[0]['last_mod']));
$this->title = $data[0]['title'];
//$this->registerMetaTag(['name' => 'keywords', 'content' => $data[0]['keywords']]);
$this->registerMetaTag(['name' => 'description', 'content' => $data[0]['description']]);
?>

<?php $this->beginBlock('h1'); ?>
Парсинг сайтов
<?php $this->endBlock(); ?>
<script>
    titleSave('<?= $data[0]['title'] ?>');
    $('#top_h').text('Парсинг сайтов');
</script>
<?php
echo $data[0]['page_text'];
?>

