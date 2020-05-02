<?php
//var_dump($data[1]);die;
use yii\widgets\Pjax;
use yii\widgets\ActiveForm;
use yii\widgets\MaskedInput;
//use yii\helpers\Html;

//$this->title = 'Создание и продвижение сайтов в Чебоксарах';
header('Last-Modified:' . gmdate("D, d M Y H:i:s \G\M\T", $data[0]['last_mod']));
$this->title = $data[0]['title'];
$this->registerMetaTag(['name' => 'keywords', 'content' => $data[0]['keywords']]);
$this->registerMetaTag(['name' => 'description', 'content' => $data[0]['description']]);
?>

<!-- <section> -->
<article>
    <img width="250" height="179" class="resp_img" src="/img/main_img/web2.jpg" alt="веб дизайн" title="веб дизайн">
    <h2 class="header_shadow">Алекс-арт21 — создание только эффективных сайтов</h2>
    <p>
        У нас сформирован профессиональный коллектив из дизайнеров, web-разработчиков, <abbr
                title="англ. search engine optimization — комплекс мер по внутренней и внешней оптимизации, для поднятия позиций сайта в результатах выдачи поисковых систем">SEO</abbr>
        специалистов.
        Каждый из нас отлично знает свое дело, будь то
        разработка дизайн-макета сайта-визитки или проектирование базы данных интернет магазина. Все вместе мы
        уже команда способная решить поставленные задачи в установленные сроки.
    </p>
    <p><strong class="mark">Мы не просто делаем сайты "под ключ", но и предоставляем комплексные и эффективные решения
            для современного бизнеса.</strong>
    </p>
    <p class="strong_text">
        Разрабатываем только современные сайты и добиваемся роста посещаемости и конверсии.
        <br/>
        Применяем только бизнес подход ориентированный не на "креативность", а на результат.
        <br/>
        Предлагаем только свежие решения.
        <br/>
    </p>
    <h3 class="h_2 punkt no_border">Предоставляемые услуги:</h3>
    <div id="uslugi_outer" class="list_block">
        <ul id="uslugi">
            <li>
                <span class="l1"></span> <strong><a title="создание сайтов" class="list_link link-anim"
                                                    href="/sozdanie_saitov/">создание сайтов</a></strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong title="редизайн сайтов">редизайн существующих сайтов</strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong title="модернизация сайтов">модернизация сайтов под стандарты <abbr
                            title="англ. HyperText Markup Language, version 5 — язык для структурирования и представления содержимого всемирной паутины">HTML5</abbr>
                    и <abbr
                            title="англ. Cascading Style Sheets, version 3 — каскадные таблицы стилей">CSS3</abbr></strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong>
                    <a title="адаптивная верстка" class="list_link link-anim" href="/sozdanie_saitov/#response">адаптивная
                        верстка</a>
                </strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong title="постановка статичных html сайтов на движок">постановка статичных html сайтов на
                    "движок"</strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong title="разработка системы управления сайтом">разработка индивидуальной <abbr
                            title="англ. Content Management System (система управления содержимым) — информационная система или компьютерная программа для обеспечения и организации совместного процесса создания, редактирования и управления контентом">CMS</abbr></strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong>
                    <abbr
                            title="англ. search engine optimization — комплекс мер по внутренней и внешней оптимизации, для поднятия позиций сайта в результатах выдачи поисковых систем">SEO </abbr><a
                            title="продвижение сайтов" class="list_link link-anim" href="/prodvijenie_saitov/">продвижение
                        сайтов</a>
                </strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong>
                    <a title="контекстная реклама" class="list_link link-anim" href="/prodvijenie_saitov/#context">контекстная
                        реклама</a>
                    на Яндекс и Google</strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong title="рерайт копирайт">наполнение оригинальным контентом (рерайт, копирайт)</strong>
            </li>
            <li>
                <span class="l1"></span> <strong>консультации, обучение персонала</strong>
            </li>
            <li>
                <span class="l1"></span>
                <strong title="техническая и информационная поддержка веб-ресурсов">техническая и информационная
                    поддержка веб-ресурсов</strong>
            </li>
        </ul>
    </div>
    <br/>
    <br/>
    <div id="site">
        <div id="s1">
            <div class="site_block">
                <a href="/sozdanie-saitov#sait_vizitka" title="сайт визитка">
                    <h2 class="h_2 punkt link-anim">Сайт визитка</h2>
                </a>
                <p>
                    Идеальный вариант для старта в интернете.
                    <br>
                    В дальнейшем можно улучшать и развивать
                    <br>
                    возможности сайта и его наполнение.
                    <br/>
                </p>
                <ul>
                    <li>
                        <span class="l2"></span>
                        до 5 страниц информации
                    </li>
                    <li>
                        <span class="l2"></span>
                        размещение прайс листов
                    </li>
                    <li>
                        <span class="l2"></span>
                        форма обратной связи
                    </li>
                    <li>
                        <span class="l2"></span>
                        срок исполнения от 7 дней
                    </li>
                    <li>
                        <span class="l2"></span>
                        цена от
                        <span class="red">7&#8202;000</span>
                        <span class="rubl">руб.</span>
                    </li>
                </ul>
                <a href="/#contacts" title="заказать сайт визитку" class="zayavka link-anim"><span class="l3"></span> заказать сайт визитку</a>
            </div>
        </div>
        <div id="s2">
            <div class="site_block">
                <a href="/sozdanie-saitov#korporativniy_sait" title="корпоративный сайт">
                    <h2 class="h_2 punkt link-anim">Корпоративный сайт</h2>
                </a>
                <p>
                    Многофункциональный портал для компании
                    <br>
                    и важный маркетинговый инструмент для
                    <br>
                    продвижения ваших товаров и(или) услуг.
                    <br>
                </p>
                <ul>
                    <li>
                        <span class="l2"></span>
                        каталог товаров и услуг
                    </li>
                    <li>
                        <span class="l2"></span>
                        система управления сайтом
                    </li>
                    <li>
                        <span class="l2"></span>
                        базовая <abbr
                                title="англ. search engine optimization — комплекс мер по внутренней и внешней оптимизации, для поднятия позиций сайта в результатах выдачи поисковых систем">SEO</abbr>
                        оптимизация
                    </li>
                    <li>
                        <span class="l2"></span>
                        срок исполнения от 21 дня
                    </li>
                    <li>
                        <span class="l2"></span>
                        цена от
                        <span>12&#8202;000</span>
                        <span class="rubl">руб.</span>
                    </li>
                </ul>
                <a href="/#contacts" title="заказать корпоративный сайт" class="zayavka link-anim"><span class="l3"></span> заказать корпоративный сайт</a>
            </div>
        </div>
        <div id="s3">
            <div class="site_block">
                <a href="/sozdanie-saitov#internet_magazin" title="интернет магазин">
                    <h2 class="h_2 punkt link-anim">Интернет магазин</h2>
                </a>
                <p>
                    Оптимально для увеличения продаж.
                    <br/>
                    Обязательно включает системы для добавления
                    товара и оформления заказа.
                    <br/>
                </p>
                <ul>
                    <li>
                        <span class="l2"></span>
                        полноценный интернет магазин
                    </li>
                    <li>
                        <span class="l2"></span>
                        система управления сайтом
                    </li>
                    <li>
                        <span class="l2"></span>
                        система добавления/удаления товаров
                    </li>
                    <li>
                        <span class="l2"></span>
                        срок исполнения от 21 дня
                    </li>
                    <li>
                        <span class="l2"></span>
                        цена от
                        <span>20&#8202;000</span>
                        <span class="rubl">руб.</span>
                    </li>
                </ul>
                <a href="/#contacts" title="заказать интернет магазин" class="zayavka link-anim"><span class="l3"></span> заказать интернет магазин</a>
            </div>
        </div>
    </div>
    <div id="bonus">
        <h2 class="header_shadow">Для всех сайтов :</h2>
        <ul>
            <li>
                <span class="l1"></span>
                Индивидуальный дизайн
            </li>
            <li>
                <span class="l1"></span>
                Форма обратной связи(заявки)
            </li>
            <li>
                <span class="l1"></span>
                Регистрация домена и размещение на выбранном хостинге
            </li>
            <li>
                <span class="l1"></span>
                Регистрация в поисковых системах Яндекс и Google
            </li>
            <li>
                <span class="l1"></span>
                Счетчик посетителей (по желанию заказчика)
            </li>
        </ul>
    </div>
    <h2 class="h_2 header_shadow">Процесс работы над сайтом и контакты с заказчиком</h2>
    <p>
        Взаимодействие с заказчиком идет на всем процессе создания сайта от первого телефонного звонка.
        На всю свою работу даем бессрочную гарантию. Обучим Ваш персонал если необходимо.
    </p>
    <p>
        Конечно же как и всякий уважающий себя коллектив мы беремся не за все заказы. Если встает выбор взяться
        за заказ или отклонить его то тут у нас действует нехитрое правило которое мы условно называем
        "правилом двух плюсов". Если из трех критериев а именно <b>проект</b>
        ,
        <b>гонорар</b>
        и
        <b>заказчик</b>
        нас устраивают минимум два, то мы беремся за заказ. За интересный проект можно взяться и при низкой
        оплате. Другой вариант — проект интересный, гонорар отличный, а заказчик невероятный зануда.
        Конечно же беремся (кто же откажется от денег :) ).
    </p>
    <div id="etap">
        <h2>Этапы создания сайта можно условно разделить на:</h2>
        <br/>
        <ul>
            <li class="link-anim">постановку целей</li>
            <li class="link-anim">дизайн</li>
            <li class="link-anim">верстку</li>
            <li class="link-anim">программирование</li>
            <li class="link-anim">наполнение</li>
            <li class="link-anim">тестирование</li>
            <li class="link-anim">запуск</li>
        </ul>
    </div>
    <output id="etap_target"></output>
    <script>
        var etap = [
            "Уяснение задач заказчика, определение целевой аудитории сайта, написание брифа(в народном фольклоре ТЗ).Прототипирование или составление эскиза где определяются расположения элементов страниц.",
            "Определение концепции дизайна.Цветовое и графическое решение будущего сайта, выбор шрифтов и др.",
            "Страницы сайта должны корректно отображаться во всех браузерах.Как правило хорошего тона нынче можно говорить об <a href=\"/sozdanie_saitov/#response\"><b> адаптивной верстке</b></a> т.е. сайт должен быть хорошо читаем без потери функционала и на смартфонах и на планшетах и на настольных пк, и даже на тех устройствах, которые появятся в будущем.",
            "Программирование идет параллельно с версткой.Постановка сайта \"на движок\" выбранный заказчиком(или разработанный нами).Проектирование и наполнение контентом базы данных(если требуется).Можем предложить собственную CMS которая в отличии от \"универсальных\" будет заточена под Ваш конкретный сайт и очень проста в использовании.",
            "Наполнение содержимым.Если сайт будет продвигаться в поисковиках, пишутся грамотные SEO тексты под поисковые запросы по ключевым словам.",
            "Здесь идет полная проверка работоспособности сайта.Так же тестируется стойкость к XSS атакам и SQL инъекциям.",
            "Собственно выкладка на выбранный хостинг.Этот этап может быть сделан уже в процессе верстки.Например когда коммерческий сайт планируеться к SEO продвижению.Ведь SEO&mdash; процесс нескорый и тут время-деньги."
        ];
        var allLi = document.querySelectorAll('#etap li'); // выбрали все li
        for (var i = 0; i < allLi.length; i++) {
            allLi[i].addEventListener("click", target);
        }
        function target(e) {
            e = e || event;
            var obj = e.target || e.srcElement; // перестраховка
            for (var i = 0; i < allLi.length; i++) {
                if (obj == allLi[i]) { // красим нажатую ссылку
                    obj.classList.add('etap_active'); // добавим класс нажатой ссылки
                    obj.classList.remove('link-anim'); // у нажатой не нужна анимация
                } else { // возврат к умолчанию
                    var a = allLi[i].classList;
                    if (a.contains('etap_active')) a.remove('etap_active');
                    if (!a.contains('link-anim')) a.add('link-anim');
                }
            }
            var txt = obj.firstChild.nodeValue; // получаем текст ссылки
            var n; // индекс в массиве описания etap
            switch (txt) {
                case "постановку целей":
                    n = 0;
                    break;
                case "дизайн":
                    n = 1;
                    break;
                case "верстку":
                    n = 2;
                    break;
                case "программирование":
                    n = 3;
                    break;
                case "наполнение":
                    n = 4;
                    break;
                case "тестирование":
                    n = 5;
                    break;
                case "запуск":
                    n = 6;
                    break;
            }
            document.getElementById('etap_target').innerHTML = etap[n]; // впендюриваем описание куда надо
        }
    </script>
    <br/>
</article>
<div id="cms">
    <strong>Мы используем CMS и фреймворки :</strong>
    <br>
    <div>
        <div id="joomla"></div>
        <div id="wordpress"></div>
        <div id="dle"></div>
        <img width="40" height="40" alt="Yii" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAC7lBMVEUAAACl034Cb7HlcjGRyT/H34fyy5PxqlSfzjwQeb5PmtX71HAMdrWOxkDzmU3qcDSPx0HzhUGNxT+/2lX2olDmUy/Q1l+TyD7rgjq21k3ZRzDQ4GGFw0Ghzz6MwOkKdrTA2lTzzMVjo9mhzkCIxUPk1MLynU7qWS33vmbP1rm011Fwqsj123/r44tUltTyq1aCxEOo0EL1tFuCw0Npp9v7xGVHkM8Ddrza0pvC3FboczHmXSvE21h+wkRkpNHvjkS92FPW3avpeDT2t1zX5GefzUD6wGQReLtMltPN417oczPZ0L+62FF+tuJgqtXZUzNzrN3s4Y7n65y72FLwmk7xjESr0kYof8MQe8DY5Gc6jMnN32DoaDLbTiLulUo1hsni45vuwnIigMXC21dqq8vKzaaBt+XU4mUMd7wDdr7xlUrU4a7A2VTD0LbVx5vvpFP/0m9godp/tuTD0LVyrsfZVDUuhMjkPChsrMt3suK92VDd52oEc7un0EKjzj7D21e01EuSyD2fzDvH3Fqu0kcDdL641k+x00rmXy0EdLiayzzynU2XyTzxmUur0ETshD7lZDDvkUbtiUDrgTvqfjrkWS292FPujEKAuObQ4GH3vWH1slr0r1j0pVLulEiPxj7oeDRnptn4zWrM31/1t13A2lb1rFb1qVS72FKHw0CLxD/qdTfnazL4wGPJ3VzwpFLpcjKFveljo9dfn9ZbntUYfcEIdr35w2XyoFH0ok/pfDZ9tONUmNRPltJIj89Ais388IL85Hn82nL80W33uV72tFy611DxlUnujkSCwkGlz0DqeTnocDJ3r99yrN1Xm9RFjc42hsorgsYhgMQPer/81XD5yGbT4mTriD/lbS3laCvjTiluqN5NktAxhMf853v84He/2VTgVCnmVSg8h8sHcrf6633+3nb8zGr2xmR/wEGcyzt3r+T/6n7tm01tqNnfSCnfPyO4zLmFwkDVRDGOweLP1aX55nrZTTOaxdjuY9uiAAAAfHRSTlMABv7+9hAJ/vMyGP2CbV5DOA+NbyYeG/DV0sC/ubaonYN5blZRQT41MSUk/v797+zj49PR0MXEw8PDu6imppqYlpOGhYN+bldWVFJROjAM+fPy8fDw8O7t6+vp5+Lh4N7e3Nvb2NPQ0MW8urm2rqiimJKFg3t5amZTT0k1ewExHwAABPVJREFUSMed1Xc81HEYB/DvhaOUEe29995777333ntv2sopUTQ4F104hRBSl8ohldCwOqfuuEiKaPdfz/P7/u6Syuu+ff727vM8z+8bhDHNB3TrXI38V6p1fvSosLBwgICd1qx/5cqVT8jrl9c1Wlm2qmFdgbWq5X316lXKq5dxu+ouyNWePevo6JjVd6il9T/soUPe3t48tyI0LeqWlpbk5oJ1dXVVKpNCH/e1/NO2rXXy5CEI5Y+6EZomn0tLSlS50OuaFZQUGuojl7vXtii/VQMnp5MQPW/+C6tUXDFnfeTubm4utVv+fud3EPTIUdfXYZVKpQULxTp75sz5h4PK7C4wO8zFCT1XbkxHG/cdZuaLqXV5Afb0xYW2etxsPxfg73htbEUPBhgXDgoKCg30kbu58Pai8/SW+o3t7e0TExPBYzuObkyXFk7SAnYFnBQYyPeePn3R2fnEiZsWPO5y6pQ9JpHXgPlHWlcLxWiTAh/LqX3wAOlNiYTXRzGn8F9I5LUx/052aLWOWVnwgQMfu7u7UQu9t26FhISYcpObHMdwHstxcR2uAc1ZSlgYsJsL7kutRCKT+XeyxWMfxHAeykE7OQGm6ecIOInaF3grmPkEWn8vL3FXIfxEnWMY8FTD5GYjeNwK3pbSCDEsTC30ysCK79/3HQY/MTggICABOZRTbYYHo9WuSiMjvhi/EWf90frGe3q2JmR8Ts65cwEJCVAOGgc3a6bD1vOVRj5wLVwY7U2dvR/vGRy1BB7TsgMH/HKAQzfVZlZEF0sjwHgtLC7GbySjvWCjojYS0vjIEcpBH8WTmwmIPmON4GEChksXF8MnotYX7NuMDGkb0vbaEeQ50E11A1R67SOnUzsjlsjgzvHx8cFRQKUFvQmpd/kaaD+sPoiYrqyfvDY39QPYOMTU1F8shn09g98WSOPi4szbEBuPy8BRY7V9l3L/34VDy2AvsdgXLfTGmZun9yY1PTw8Ll+DwenWI0j52A6awWGJzNQLj0VtenpsbHshWZXpQasTYO6ZJuTPCC3WQjFeix5LKpWap8dqNJohZHgmaA5DtQ35e6wtNnXS4wwojn2jUSimkH2ZtBpxnYp+67ce1pX7xBkF1KrV+S3IHIrxYuNJxbEd2SM4qoDDim/5+THrSD09bmzIn5eRPTiMNmYqLM2PDUMblNabzaE5PwbSZowHPdi0tsTQmKxor1EXFcXEDKnJf6q9xOBMCPvyVQG6aDGZhw80x8ZwK1h5ISzsRwe1Wt2B1MPHPZgYnqa3b1+4gOUKhUl/sP0Z7ITJycmowz5q3oxrfMBvvYBh6O7ZKcnvqY7dZuPXR8hQvOXSJdQc/7hhTB8TBjs6Ivz6pezsbKobmggYbJWOT1ADT8HFGxKW9LwTjRp4CujbTHj007t37kRHhGP5h5Tk5K0MduLce0/vvoyOjoiIuH4ddMoeBrzz2WvUMDrMDvpDFQa89Pkr4KCBo+7OYEdFpqLGcqqbMuDVaZGpqc/1OjycYerKohtpkZFl9ECG4qoihxvA9aN3ZDlXL5GDXR7Vr56BZtlYcAOwnQMdHXRPlmdd2U5kh5gffRHL0GSUXR5gKBeJ0tIiZ1UmLKlqlydygHD1s8EyYYe8PBFMjulVhbClEdy6kohLVTaJGEYW4eBr6MhsY1fi0ggoe7a3a7d84O6J5L8iNOiX3U+uoa/p8UPtoQAAAABJRU5ErkJggg==">
    </div>
    <br/>
    <pre>joomla  wordpress drupal     yii2</pre>
</div>
<!-- </section> -->
    <br>
    <br>
    <br>
<!--noindex-->
    <a name="contacts"></a>
<div class="h1 text-center">Возникли вопросы ?</div>
<div class="h2 text-center">Напишите нам и получите исчерпывающую консультацию.</div>
<br>
<?php Pjax::begin([
    'clientOptions' => [
        'method' => 'POST',
        'url' => '/mail_ok',
        'container' => '#my-modal',
    ],
    'enablePushState' => false, // не обновлять url
    'formSelector' => '#index-form',
    'timeout' => '20000',

]);
?>
<?php ActiveForm::begin([
                  'id' => 'index-form',
                  'options' => [
                          'action' => '/mail_ok',
                          'data-pjax' => true
                  ],
]);
?>
<div class="field name-box animated bounceInDown wow"  data-wow-delay="0.9s">
    <input class="input" type="text" name="name" id="name" placeholder="Ваше имя" required="true"/>
    <label for="name">Имя</label>
</div>

<div class="field email-box animated bounceInDown wow"  data-wow-delay="0.7s">
    <input class="input" type="email" name="email" id="email" placeholder="Ваш E-mail" required="true"/>
    <label for="email">Email</label>
</div>

<div class="field tel-box animated bounceInDown wow" data-wow-delay="0.5s">
    <?php
    echo MaskedInput::widget([
        'options' => [
            'required' => true,
            'placeholder' => 'тел',
            'name' => 'tel',
            'id' => 'tel',
            'class' => 'phone input',
        ],
        'name' => 'tel',
        'mask' => '+7 (999)-999-99-99',
    ]);
    ?>
    <label for="tel">Тел.</label>
</div>

<div class="field msg-box animated bounceInDown wow"  data-wow-delay="0.3s">
    <textarea class="input" name="text" id="msg" rows="4" placeholder="Введите текст сообщения" required="true"></textarea>
    <label for="msg">Текст</label>
</div>
<button type="submit" class="success-button animated bounceInDown wow"  data-wow-delay="0.1s">Отправить</button>
<?php ActiveForm::end(); ?>

<?php Pjax::end(); ?>