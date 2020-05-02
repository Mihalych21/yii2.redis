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