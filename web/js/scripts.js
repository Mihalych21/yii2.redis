"use strict";
// заголовок в тег title после AJAX загрузки
function parse_hash() {
    var hash = document.location.hash.slice(2); // строка хеша без символов "#!"
    if (hash) {
        if (hash.indexOf('news') < 0) { // кроме новостей
            var title;
            switch (hash) {
                case 'contact':
                    title = 'Контактная информация группы веб-разработчиков Алекс-арт21';
                    document.title = title;
                    break;
                case 'portfolio':
                    title = 'Портфолио группы веб-разработчиков Алекс-арт21';
                    document.title = title;
                    break;
            }
        } else { // раздел новости
            var arr = hash.split('|');
            var my_title;
            if (arr.length == 1) { // первая страница новостей news
                my_title = 'Разные интересности из мира веб разработки';
            } else if (arr.length == 2) { // выбрана конкретная новость вида news|2
                hash_link_color('news'); // красим ссылку в меню
                my_title = $('h2.news_title').text();
            } else if (arr.length == 3) { // пейджинг страниц новостей news|page|2
                hash_link_color('news'); // красим ссылку в меню
                my_title = 'Разные интересности из мира веб разработки страница ' + arr[2];
            }
            window.document.title = my_title; // пишем в title
        }
    }
}
/* AJAX запрос методом GET с параметром "param" результат в блок с id "result_block" */
/**
 * @param  {string} param        вида id=mail
 * @param  {string} result_block id блока куда загружаем контент без знака #
 */
function get_query(param, result_block) {
    var bl; // блок который затемняем
    if ((param == 'id=zvonok') || (param == 'id=mail')) bl = 'container';
    else bl = 'inc';
    $.ajax({
        url: '/response.php', // url
        // type: 'GET', // по умолчанию GET
        data: param, // передаваемые данные (строка или объект)
        success: function (data) { // ошибок не возникло
            if (param == 'id=zvonok') {
                // $('#zvonok').slideDown(300);
                showModal('#zvonok');
            }
            if (param == 'id=mail') {
                // $('#mail').slideDown(300);
                showModal('#mail');
            }
            $('#' + result_block).html(data); // данные в нужный блок
        },
        error: function (xhr, str) {
            document.body.style.cursor = 'default';
            alert('Возникла ошибка: ' + xhr.responseCode);
        },
        cache: false,
        beforeSend: function () { // выполняеться перед отпракой
            loading(bl);
        },
        complete: function () { // срабатывает по окончанию запроса
            document.body.style.cursor = 'default';
            parse_hash(); // заголовок в тег title
            komplete(bl);
        }
    });
}
/* AJAX передача методом POST данных формы с полей с классом "send", результаты в блок с id "result_block" */
/**
 * @param  {string} result_block - id блока куда подгружаем контент без символа #
 */
function form_call(result_block) {
    var msg = $('.send').serialize(); // данные лишь с полей с классом "send"
    $.ajax({
        type: 'POST',
        url: '/response.php',
        data: msg,
        success: function (data) {
            $('#' + result_block).html(data);
        },
        error: function (xhr, str) {
            document.body.style.cursor = 'default';
            alert('Возникла ошибка: ' + xhr.responseCode);
        },
        cache: false,
        beforeSend: function () {
            document.body.style.cursor = 'progress';
        },
        complete: function () {
            document.body.style.cursor = 'default';
        }
    });
}
/* Заявка на заказ сайта или продвижение */
/**
 * @param  {string} site - вида id=seo
 */
function zayavka(site) {
    $.ajax({
        url: '/response.php', // url
        type: 'GET', // по умолчанию GET
        data: site, // передаваемые данные (строка или объект)
        success: function (data) { // если ошибок не возникло
            $('#inc').html(data);
        },
        error: function (xhr, str) {
            document.body.style.cursor = 'default';
            alert('Возникла ошибка: ' + xhr.responseCode);
        },
        cache: false,
        beforeSend: function () { // выполняеться перед отпракой
            loading('inc');
        },
        complete: function () { // срабатывает по окончанию запроса
            komplete();
        }
    });
}

/* показать модальное окно */
function showModal(modal) {
    document.querySelector(modal).style.display = 'block';
}

/* скрыть модальное окно */
/**
 * @param  {string} modal    css селектор модального окна
 * @param  {number} animTime время анимации в мс
 */
function hideModal(modal, animTime) {
    document.querySelector(modal).style.display = 'none';
    komplete(false, true);
    /*var close = document.querySelector('.close');
     var block = document.querySelector(modal);
     block.classList.add('close-anim');
     setTimeout(function(){
     block.style.display = "none";
     block.classList.remove('close-anim');
     komplete(false, true);
     }, animTime);*/
}

/* анимация AJAX загрузки */
/**
 * @param  {string} block - блок где будет анимация (inc или container)
 */
function loading(block) {
    if (block == 'inc') { // только при AJAX загрузке в блок #inc
        $('#inc').prepend('<div id="overlay"></div>');
        $('#inc').prepend('<output id="inc_loading" class="loading spinner"><div class="dot1"></div><div class="dot2"></div></output>');
        $('#overlay').css('border-radius', '10px');
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('#inc_loading').style.display = 'block';
    } else { // затемняем весь экран при отправке email или заказе обратного звонка
        $('#container').prepend('<div id="overlay"></div>');
        $('#overlay').css('border-radius', 'none');
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('#container_loading').style.display = 'block';
    }
    document.body.style.cursor = 'progress';
}
/* стоп анимации */
/**
 * @param  {string} result_block - блок где анимация загрузки
 * @param  {boolean} flag        - true когда удалить блок с данными полностью
 */
function komplete(result_block, flag) { // стоп анимации загр.
    if (result_block == 'container') document.querySelector('#container_loading').style.display = 'none';
    if (flag) {
        document.getElementById('mail').style.display = 'none';
        document.getElementById('zvonok').style.display = 'none';
    }
    document.body.style.cursor = 'default';
    if (!result_block) {
        $('#overlay').remove();
    }
}
/*Мобильное левое меню*/
function mobLeft() {
    var menuBtn = document.querySelector('.mob-menu-button'); //кнопка
    var menu = document.querySelector('.mob-menu-list'); // выезжающий блок
    var menuCol = document.querySelector('.mob-menu-col'); // "колонка"
    var mobLink = document.querySelectorAll('.mob-link'); // ссылки в меню
    // var y = menuBtn.getBoundingClientRect().top; // запоминаем смещение по y
    menu.style.height = screen_h + 'px'; // высоту выехавшему блоку по всей высоте
    menuBtn.addEventListener('click', function () {
        var has = menuBtn.classList.contains('btn-pos');
        /*if(!has) { // при открытии меню
         menuBtn.style.top = y+'px';
         }else { // при закрытии меню
         menuBtn.style.top = '';
         menuBtn.style.left = '';
         }*/
        menu.classList.toggle('menu-animate');
        menuBtn.classList.toggle('btn-pos');
        menuCol.classList.toggle('open');
    });
    var c = mobLink.length;
    // чтоб меню закрывалось при клике на любую ссылку
    for (var i = 0; i < c; i++) {
        mobLink[i].addEventListener('click', function () {
            menu.classList.toggle('menu-animate');
            menuBtn.classList.toggle('btn-pos');
            menuCol.classList.toggle('open');
        });
    }
}
//
/* По окончании загрузки страницы */
function onLoad() {
    // шторка
    var shtorka = document.querySelector('.shtorka');
    shtorka.classList.add('shtorka-animate');
    //
    // мобильное левое меню
    // if(screen_w>=930){
    mobLeft();
    // }
    //girla
    // begunok();
    // по клику проскролить вверх
    var z = document.querySelectorAll('.scroll-top');
    var l = z.length;
    for (var i = 0; i < l; i++) {
        z[i].addEventListener('click', function () {
            scrollTo(0, 0);
        });
    }
    //
    if (!location.hash) {
        $(window).scroll(function () {
            menu_fix(); // фиксация верхнего меню
        });
    } else { // чтобы при переходе по анкорным ссылкам меню не фиксилось
        var j = 0;
        document.onscroll = function () {
            j++;
            if (j > 1) menu_fix();
        };
    }
    my_hash(); // если вход извне
    // отлов изменения хеша
    if ("addEventListener" in window) {
        // для всех веб-браузеров кроме старых IE 
        window.addEventListener("hashchange", my_hash);
    } else if ("attachEvent" in window) {
        // для обладателей счастливых браузеров 
        window.attachEvent("onhashchange", my_hash);
    }
    /* кнопка наверх */
    var scr = document.getElementById('scroller');
    window.addEventListener('scroll', function (e) {
        var top = window.pageYOffset; // сколько проскролено
        if (top > 500) {
            scr.style.display = 'block';
            /*if (document.body.clientWidth > 930) {
                document.querySelector('.vetka').style.display = 'block';
            }*/
        } else {
            scr.style.display = 'none';
        }
    });
    scr.addEventListener('click', function () {
        // scrollTo(0, 0);
        $('body,html').animate({scrollTop: 0}, 300);
    });
    // Замена  "руб." на знак рубля
    price_replace();
}
//////
// окраска текущей ссылки верхнего меню
function hash_link_color(hash_link) {
    var l = [ // массив с анкорами. использую для css анимации через атрибут data-m
        'главная',
        'создание сайтов',
        'продвижение',
        'портфолио',
        'контакты',
        'новости'
    ];
    var link = document.querySelectorAll('.resp li a');
    for (var i = 0; i < link.length; i++) {
        var y = link[i].hash.slice(2);
        if (y == hash_link) { // если оно красим
            link[i].classList.add('a_activ');
            link[i].removeAttribute('data-m'); // css анимацию выключаем
        } else { // возврат к умолчанию
            link[i].classList.remove('a_activ');
            link[i].setAttribute('data-m', l[i]);
        }

    }
}
// Функция замены текста "руб." на знак рубля
function price_replace() {
    // var rep = /\sруб(.|\s)?$/;
    var r = document.getElementsByClassName('rubl');
    for (var i = 0; i < r.length; i++) {
        var rub = r[i].innerHTML;
        rub = rub.replace('руб.', '<span class="rub_img"></span>');
        r[i].innerHTML = rub;
    }
}
// на изм. хеша
// console.log(window.location);
function my_hash() { //
    // анимируем шторку
    /*var sh = parseInt($('header').css('width'))-520;
     $('#shtorka').css('width', sh+'px')
     $('#shtorka').animate({width: 0}, 600);*/
    //
    var s = window.location.hash;
    if (s) {
        var hash_link = s.indexOf('#!'); // вытаскиваем хеш
        if (hash_link > -1) {
            hash_link = s.slice(2);
            get_query('id=' + hash_link, 'inc'); // посылаем AJAX запрос
            hash_link_color(hash_link); // красим ссылку
            // window.history.pushState(null, null, '#!'+hash_link);
            // if(window.location.search) window.location.href = '/#!' + hash_link;
        }
    }
}
/* Анимация на странице контакты */
function contactHover() {
    var li = document.getElementById('contact').getElementsByTagName('li');
    // var li = document.querySelector('#contact li');
    for (var i = 0; i < li.length; i++) {
        li[i].addEventListener("mouseover", function (e) {
            e = e || event; // перестраховка
            var obj = e.target || e.srcElement;
            if (obj.nodeName != 'LI') {
                while (obj.nodeName != 'LI') { // пока не упремся в LI прыгаем вверх к родителю
                    obj = obj.parentNode;
                }
            }
            var rot = obj.firstChild; // вертеть будем первое дитя
            rot.classList.add('rotate');
        });
        li[i].addEventListener("mouseout", function (e) { // мыша ушла
            e = e || event; // перестраховка
            var obj = e.target || e.srcElement;
            if (obj.nodeName != 'LI') {
                while (obj.nodeName != 'LI') {
                    obj = obj.parentNode;
                }
            }
            var rot = obj.firstChild;
            rot.classList.remove('rotate');
        });
    }
}
/* фиксация верхнего меню */
function menu_fix() {
    var h_hght = 500; // высота шапки
    var h_mrg = 0; // отступ когда шапка уже не видна
    if (screen_w >= 930) { // при какой высоте экрана применять
        $(function () {
            var top = $(this).scrollTop(); // сколько проскролено
            var elem = $('#menu_outer'); // блок меню
            if ((top + h_mrg) > h_hght) {
                elem.css({
                    'top': h_mrg,
                    'position': 'fixed',
                    'border-bottom': '2px solid #003333',
                    'border-radius': '0 0 5px 5px',
                    'box-shadow': '0 0 20px #777',
                    'background-color': '#eee',
                    'z-index': '10'
                });
                $('nav.resp ul').css('background-color', '#eee');
                $('nav.resp ul').css('border', 'none');
            } else {
                elem.css({
                    'top': 0,
                    'position': 'relative',
                    'border': '',
                    'border-radius': '',
                    'box-shadow': '',
                    'background-color': '',
                    'z-index': ''
                });
                $('nav.resp ul').css('background-color', '');
                $('nav.resp ul').css('border', '');
            }
        });
    }
}
/* маска  ввода телефона с переключателем */
/**
 * @param  {string} tabindex значение атрибута tabindex инпута с телефоном
 */
function maskTogl(tabindex) {
    $(".phone").mask('+7   (999) 999-99-99');
    document.getElementById('tel').focus();
    var ms = document.getElementsByClassName('mask-togl')[0]; // переключатель
    var flag = true; // на true маска выкл.
    ms.addEventListener('click', function () {
        var rep = document.getElementById('rep'); // контейнер где инпут который заменяем
        if (flag) { // маска выключена
            // инпут без класса phone
            rep.innerHTML = '<input tabindex="' + tabindex + '" id="tel" type="text" name="tel"  class="send" placeholder="в любом формате"  autofocus required />';
            ms.innerText = 'включить маску';
            flag = false;
        } else { // маска включена
            // инпут с классом phone
            rep.innerHTML = '<input tabindex="' + tabindex + '" id="tel" name="tel" type="tel" class="send phone"  autofocus required />';
            $(".phone").mask('+7 (999) 999-99-99');
            ms.innerText = 'выключить маску';
            flag = true;
        }
        document.getElementById('tel').focus();
    });
}
///
function preloadImages() {
    for (var i = 0; i < arguments.length; i++) {
        new Image().src = arguments[i];
    }
}
///
function titleSave(title) {
    window.document.title = title;
}