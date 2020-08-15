<div id="result">&nbsp;</div>
<h1 style="display: inline">Режим contenteditable</h1> &nbsp;&nbsp;&nbsp;<b style="font-size: 120%;color:blue"><a
            href="/admin/content/update?id=<?= $model['id'] ?>">Назад в редактор</a></b>
<h2>Страница <?= $model['page'] ?></h2>
<div class="contenteditable" contenteditable="true">
    <?= $model['page_text'] ?>
</div>
<button id="edit_but" class="but_gr">Отправить</button>
<script>
    /* AJAX */
    // отправка контента в режиме редактирования contenteditable
    // content объект с данными {content': 'ghjgjjj'}
    function form_call(content, id) {
        $.ajax({
            type: 'POST',
            url: '/admin/content/update?id=' + id + '&contenteditable=1',
            data: content,
            success: function (res) {
                // alert(res);
                $('#result').html(res);
            },
            error: function (xhr, str) {
                alert('Возникла ошибка: ' + xhr.responseCode);
            },
            cache: false,
            beforeSend: function () {
                loading();
            },
            complete: function () {
                loading_stop();
                $('#result').css('display', 'block');
                $('body,html').animate({scrollTop: 0}, 400);
            }
        });
    }
    // анимация загрузки
    function loading() {
        document.body.style.cursor = 'progress';
    }
    // стоп анимации
    function loading_stop() {
        document.body.style.cursor = "";
    }
    //
    $('#edit_but').on('click', function () {
        var page_text = {
            page_text: $('.contenteditable').html()
        };
        form_call(page_text, <?= $model['id'] ?>);
    });
</script>