<?php
use app\assets\AppAsset;
use yii\helpers\Html;
use yii\widgets\Pjax;
//use yii\bootstrap\Modal;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<?php //Spaceless::begin(); // удаляет пробелы между HTML тегами?>
<!doctype html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="HandheldFriendly" content="true">
    <?php $this->head() ?>
    <!-- Yandex.Metrika counter -->
    <script>
        /*!function (e, t, a) {
            (t[a] = t[a] || []).push(function () {
                try {
                    t.yaCounter48601655 = new Ya.Metrika({
                        id: 48601655,
                        clickmap: !0,
                        trackLinks: !0,
                        accurateTrackBounce: !0
                    })
                } catch (e) {
                }
            });
            var c = e.getElementsByTagName("script")[0], n = e.createElement("script"), r = function () {
                c.parentNode.insertBefore(n, c)
            };
            n.type = "text/javascript", n.async = !0, n.src = "https://mc.yandex.ru/metrika/watch.js", "[object Opera]" == t.opera ? e.addEventListener("DOMContentLoaded", r, !1) : r()
        }(document, window, "yandex_metrika_callbacks");*/
    </script>
    <!--<noscript>
        <div><img src="https://mc.yandex.ru/watch/48601655" style="position:absolute; left:-9999px;" alt=""/></div>
    </noscript>-->
    <!-- /Yandex.Metrika counter -->

<body>
<?php $this->beginBody() ?>
<!-- SVG loader -->
<div id="container_loading">
    <!-- 3  -->
    <div class="loader loader--style3" title="2">
        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
  <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
      <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="0.6s"
                        repeatCount="indefinite"/>
  </path>
  </svg>
    </div>
</div>
<!-- end SVG loader -->
<output id="my-modal"></output>
<div id="container">
    <!--noindex-->
    <!--<div class="vetka"></div>-->
    <!--/noindex-->
    <!--noindex-->
    <nav class="mob-menu-list">
        <strong class="mob-menu-header" title="создание сайтов">Создание сайтов</strong>
        <ul>
            <li class="mob-link"><a class="portf-call" title="сайт визитка" href="/sozdanie#sait_vizitka">сайт визитка</a></li>
            <li class="mob-link"><a class="portf-call" title="корпоративный сайт" href="/sozdanie#korporativniy_sait">корпоративный
                    сайт</a></li>
            <li class="mob-link"><a class="portf-call" title="интернет магазин" href="/sozdanie#internet_magazin">интернет
                    магазин</a></li>
        </ul>
        <strong class="mob-menu-header" title="продвижение сайтов">Продвижение</strong>
        <ul>
            <li class="mob-link"><a class="portf-call" title="базовая seo оптимизация" href="/prodvijenie#base_seo">базовая
                    оптимизация</a></li>
            <li class="mob-link"><a class="portf-call" title="продвижение по ключевым фразам" href="/prodvijenie#key_seo">продвижение
                    по фразам</a></li>
            <li class="mob-link"><a class="portf-call" title="контекстная реклама" href="/prodvijenie#context">контекстная
                    реклама</a></li>
        </ul><!--noindex--><strong class="mob-menu-header" title="другие услуги">другие услуги</strong><!--/noindex-->
        <ul>
            <li class="mob-link"><a class="portf-call" title="парсинг сайтов" href="/parsing">парсинг сайтов</a></li>
        </ul>
    </nav>
    <!--/noindex-->
    <div id="main">
        <div id="all">
            <div>
                <!--обертка -->
                <!-- тень снизу шапки -->
                <div id="header_shadow"></div>
                <!---->
                <header id="top" class="gradient3" itemscope="" itemtype="http://schema.org/LocalBusiness">

                    <h1 id="top_h">
                        <?php if (isset($this->blocks['h1'])): ?>
                            <?= $this->blocks['h1'] ?>
                        <?php else: ?>
                            Создание и продвижение сайтов
                        <?php endif; ?>
                    </h1>

                    <a href="/">
                        <div id="logo" title="Алекс-арт21 создание и продвижение сайтов">
                            <img class="svg" width="240" height="138" alt="логотип группы веб разработчиков Алекс-арт21"
                                 src="/img/main_img/logo.png">
                        </div>
                    </a>
                    <div id="right">
                        <div class="right_outer">
                            <ul>
                                <li title="написать письмо">
                                    <a href="/#contacts" class="mail">mail@alexart21.ru</a>
                                </li>
                                <li class="tel">
                                    <span class="pre">тел.</span>
                                    <a href="tel:<?= Yii::$app->params['tel1_min'] ?>" title="позвонить" itemprop="telephone"><?= Yii::$app->params['tel1'] ?></a>
                                </li>
                                <li class="smal" itemprop="openingHours" datetime="Mo-Fr 09:00−18:00">
                                    Пн - Пт 9<sup>00</sup> - 18<sup>00</sup>
                                </li>
                            </ul>
                            <?php
                            // модальное окно обратного звонка
                            Pjax::begin([
                                'clientOptions' => [
                                    'method' => 'get',
                                    'url' => '/call',
                                    'container' => '#my-modal',
                                ],
                                'enablePushState' => false, // не обновлять url
                                'linkSelector' => '.call',
                                'timeout' => '20000',

                            ]);
                            ?>
                            <div id="tel_but" class="but_gr"
                                 title="заказать обратный звонок">
                                <a class="call" href="/call">обратный звонок</a>
                            </div>
                            <?php Pjax::end(); ?>
                        </div>
                    </div>
                    <div id="center">
                        <div>
				<span itemprop="name"> <strong>Алекс-арт21</strong>
					<span>группа веб-разработчиков</span>
					<span itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
						<span itemprop="addressLocality">г. Чебоксары</span>
					</span>
				</span>
                        </div>
                        <output id="shtorka" class="shtorka gradient3"></output>
                    </div>
                    <!--noindex-->
                    <noscript>
                        Для полнофункционального отображения страницы включите JAVA SCRIPT !
                    </noscript>
                    <!--/noindex-->
                </header>
            </div>
            <?php
            // AJAX страницы в основной контент
            Pjax::begin([
                'clientOptions' => [
                    'method' => 'get',
//                                    'url' => '/call',
                    'container' => '#inc',
                    'scrollOffset' => 0,
                ],
                'enablePushState' => true, // обновлять url
                'linkSelector' => '.portf-call',
                'timeout' => '20000',
            ]);
            ?>
            <div id="menu_outer">
                <div id="top_menu">
                    <div class="menu_shadow main-menu">
                        <nav class="resp">
                            <ul class="menutop  highlightTextIn">
                                <li><a data-m="главная" href="/" title="">главная</a></li>
                                <li><a class="portf-call" data-m="создание сайтов" href="/sozdanie" title="создание сайтов">создание
                                        сайтов</a></li>
                                <li><a class="portf-call" data-m="продвижение" href="/prodvijenie" title="продвижение сайтов">продвижение</a>
                                </li>
                                <li>
                                    <a class="portf-call" data-m="портфолио"
                                                                                              href="/portfolio"
                                                                                              title="">портфолио</a>
                                </li>
                                <li><a data-m="контакты"
                                                                                              href="/#contacts" title="">контакты</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <?php
            Pjax::end();
            ?>
            <div id="block">
                <!-- начало левый блок -->
                <div id="left">
                    <!-- начало "мобильное" левое меню -->
                    <!--noindex-->
                    <div class="mob-menu-col">
                        <div class="mob-menu-button" title="меню"></div>
                    </div>
                    <!--/noindex-->
                    <!-- конец "мобильное" левое меню -->
                    <!-- начало "десктопное" левое меню -->

                    <nav id="l_menu">
                        <a class="l_header link-anim portf-call" href="/sozdanie" title="создание сайтов">Создание
                            сайтов</a>
                        <ul>
                            <li class="left_gr2"><a class="portf-call" title="сайт визитка" href="/sozdanie#sait_vizitka">сайт
                                    визитка</a></li>
                            <li class="left_gr2"><a class="portf-call" title="корпоративный сайт"
                                                    href="/sozdanie#korporativniy_sait">корпоративный сайт</a>
                            </li>
                            <li class="left_gr2"><a class="portf-call" title="интернет магазин" href="/sozdanie#internet_magazin">интернет
                                    магазин</a></li>
                        </ul>
                        <br/>
                        <a class="l_header link-anim portf-call" href="/prodvijenie" title="продвижение сайтов">Продвижение
                            сайтов</a>
                        <ul>
                            <li class="left_gr2"><a class="portf-call" title="базовая seo оптимизация"
                                                    href="/prodvijenie#base_seo">базовая оптимизация</a></li>
                            <li class="left_gr2"><a class="portf-call" title="продвижение по ключевым фразам"
                                                    href="/prodvijenie#key_seo">продвижение по фразам</a></li>
                            <li class="left_gr2"><a class="portf-call" title="контекстная реклама" href="/prodvijenie#context">контекстная
                                    реклама</a></li>
                        </ul>
                        <br/><!--noindex--><strong class="l_header">Другие услуги</strong><!--/noindex-->
                        <br/>
                        <ul>
                            <li class="left_gr2"><a class="portf-call" title="парсинг сайтов" href="/parsing">парсинг сайтов</a>
                            </li>
                        </ul>
                    </nav>
                    <!-- конец "десктопное" левое меню -->
                </div>
                <!-- конец левый блок -->
                <!-- начало основной контент -->
                <main id="inc">
                    <div id="inc_loading"></div>
                    <?php echo $content ?>
                </main>
                <!-- конец основной контент -->
            </div>
        </div>
    </div>

    <!--noindex-->
    <div style="width:100%;height:10px"></div>
    <footer class="innerShadow gradient3">
        &copy; <strong>Alexart21</strong> web developer group 2014&mdash;2020 тел. <strong
                class="corpid strong"><?= Yii::$app->params['tel1'] ?></strong><br/>
        <strong>Создание и продвижение сайтов в Чебоксарах</strong><br/>
        <span>Powered by APACHE/PHP/MYSQL</span><br/>
        <span>Ваши персональные данные могут быть использованы только в соответстввии с ФЗ №152 <a href="/politic">о персональных данных.</a></span>
    </footer>
    <!--/noindex-->
</div>
<script>
    var screen_w = document.body.clientWidth;
    var screen_h = document.body.clientHeight;
    window.onresize = function () {
        window.screen_w = document.body.clientWidth;
        window.screen_h = document.body.clientHeight;
    };
    window.onload = function () {
        onLoad();
    };
</script>
<!--<div id="scroller" title="проскролить вверх">
    <div class="triangle"></div>
    <span class="scr_text">вверх</span>
</div>-->
<?php $this->endBody() ?>
<script>
    var shtorka = document.querySelector('.shtorka');
    $(document).on('pjax:beforeSend', function () {
        document.body.style.cursor = 'progress';
        let target = $.pjax.options.container; // контейнер куда грузим AJAX данные
        let method = $.pjax.options.type;
        if(target == '#my-modal' && method == 'GET'){ // вызов модального окна(обратный звонок)
            $('#container').prepend('<div id="overlay"></div>');
            $('#overlay').show();
            $('#container_loading').show();
        }else if(method != 'POST') { // данные в блок #inc (основной контент)
            scrollTo(0,0);

            shtorka.classList.remove('shtorka-animate');
            $('#container_loading').show();
        }
    });

    $(document).on('pjax:complete', function () {
        shtorka.classList.add('shtorka-animate'); // анимация в шапке
        document.body.style.cursor = 'default';
        $('#overlay').remove();
        $('#container_loading').hide()
        let method = $.pjax.options.type;
        if (method == 'POST' && $.pjax.options.url == '/mail_ok'){ // очищаем поля формы отправки письма
            let input = document.querySelectorAll('.input');
            let l = input.length;
            for (var i = 0; i<l; i++){
                input[i].value = '';
            }
        }
    });
    ///
    (function ($) {
        new WOW().init();
    })(jQuery);

</script>
</body>
</html>
<?php //Spaceless::end()?>
<?php $this->endPage() ?>