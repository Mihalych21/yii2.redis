<div id="result">&nbsp;</div>
<h1 style="display: inline">Режим contenteditable</h1> &nbsp;&nbsp;&nbsp;<b style="font-size: 120%;color:blue"><a
            href="/admin/content/update?id=<?= $model['id'] ?>">Назад в редактор</a></b>
<h2>Страница <?= $model['page'] ?></h2>
<div class="contenteditable" contenteditable="true">
    <?= $model['page_text'] ?>
</div>
<button id="edit_but" class="but_gr">Отправить</button>
<script>
    $('#edit_but').on('click', function () {
        var page_text = {
            page_text: $('.contenteditable').html()
        };
        form_call(page_text, <?= $model['id'] ?>);
    });
</script>