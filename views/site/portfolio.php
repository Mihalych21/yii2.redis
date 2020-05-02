<?php
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Last-Modified:' . gmdate("D, d M Y H:i:s \G\M\T", $data[0]['last_mod']));
$this->title = $data[0]['title'];
$this->registerMetaTag(['name' => 'keywords', 'content' => $data[0]['keywords']]);
$this->registerMetaTag(['name' => 'description', 'content' => $data[0]['description']]);

$portfArr = [
    [
        'name' => 'HOUME21',
        'title' => 'Сайт фирмы HOUME21',
        'url' => 'houme21.ru',
    ],
    [
        'name' => 'Соло мебель',
        'title' => 'Сайт фирмы Соло мебель',
        'url' => 'www.s-solo.ru',
    ],
];
?>
<script>
    titleSave('<?= $data[0]['title'] ?>');
    $('#top_h').text('Создание и продвижение сайтов');
</script>
<div class="h2 header_shadow text-center">Наши работы</div><br/>
<div id="portf" class="min_height">

    <?php
    $i = 1;
    ?>
    <?php foreach ($portfArr as $portf) : ?>
        <div class="atv-outer">
            <div class="portf-title">сайт фирмы <a href="http://<?= $portf['url'] ?>"> <?= $portf['name'] ?></a></div>
            <a href="http://<?= $portf['url'] ?>">
                <figure class="a-image atvImg">
                    <div class="atvImg-shadow"></div>
                    <img class="atvImg-layer" data-img="/img/main_img/portfolio/img<?= $i ?>.jpg"
                         title="<?= $portf['title'] ?>"
                         alt="<?= $portf['title'] ?>">
                    <!-- <div class="atvImg-layer" data-img="/img/main_img/solo_smal.jpg"></div> -->
                </figure>
            </a>
        </div>
        <?php $i++ ?>
    <?php endforeach; ?>

</div>
<script>
    function atvImg() {
        function e(e, t, a, r, s, o) {
            var i = n.scrollTop || l.scrollTop, d = n.scrollLeft, c = t ? e.touches[0].pageX : e.pageX, m = t ? e.touches[0].pageY : e.pageY, v = a.getBoundingClientRect(), f = a.clientWidth || a.offsetWidth || a.scrollWidth, g = a.clientHeight || a.offsetHeight || a.scrollHeight, h = 320 / f, u = .52 - (c - v.left - d) / f, p = .52 - (m - v.top - i) / g, y = m - v.top - i - g / 2, E = c - v.left - d - f / 2, C = .07 * (u - E) * h, I = .1 * (y - p) * h, N = "rotateX(" + I + "deg) rotateY(" + C + "deg)", x = Math.atan2(y, E), b = 180 * x / Math.PI - 90;
            0 > b && (b += 360), -1 != a.firstChild.className.indexOf(" over") && (N += " scale3d(1.07,1.07,1.07)"), a.firstChild.style.transform = N, o.style.background = "linear-gradient(" + b + "deg, rgba(255,255,255," + (m - v.top - i) / g * .4 + ") 0%,rgba(255,255,255,0) 80%)", o.style.transform = "translateX(" + u * s - .1 + "px) translateY(" + p * s - .1 + "px)";
            for (var L = s, S = 0; s > S; S++)r[S].style.transform = "translateX(" + u * L * (2.5 * S / h) + "px) translateY(" + p * s * (2.5 * S / h) + "px)", L--
        }

        function t(e, t) {
            t.firstChild.className += " over"
        }

        function a(e, t, a, r, n) {
            var l = t.firstChild;
            l.className = l.className.replace(" over", ""), l.style.transform = "", n.style.cssText = "";
            for (var s = 0; r > s; s++)a[s].style.transform = ""
        }

        var r = document, n = (r.documentElement, r.getElementsByTagName("body")[0]), l = r.getElementsByTagName("html")[0], s = window, o = r.querySelectorAll(".atvImg"), i = o.length, d = "ontouchstart" in s || navigator.msMaxTouchPoints;
        if (!(0 >= i))for (var c = 0; i > c; c++) {
            var m = o[c], v = m.querySelectorAll(".atvImg-layer"), f = v.length;
            if (!(0 >= f)) {
                for (; m.firstChild;)m.removeChild(m.firstChild);
                var g = r.createElement("div"), h = r.createElement("div"), u = r.createElement("div"), p = r.createElement("div"), y = [];
                m.id = "atvImg__" + c, g.className = "atvImg-container", h.className = "atvImg-shine", u.className = "atvImg-shadow", p.className = "atvImg-layers";
                for (var E = 0; f > E; E++) {
                    var C = r.createElement("div"), I = v[E].getAttribute("data-img");
                    C.className = "atvImg-rendered-layer", C.setAttribute("data-layer", E), C.style.backgroundImage = "url(" + I + ")", p.appendChild(C), y.push(C)
                }
                g.appendChild(u), g.appendChild(p), g.appendChild(h), m.appendChild(g);
                var N = m.clientWidth || m.offsetWidth || m.scrollWidth;
                m.style.transform = "perspective(" + 3 * N + "px)", d ? (s.preventScroll = !1, function (r, n, l, o) {
                    m.addEventListener("touchmove", function (t) {
                        s.preventScroll && t.preventDefault(), e(t, !0, r, n, l, o)
                    }), m.addEventListener("touchstart", function (e) {
                        s.preventScroll = !0, t(e, r)
                    }), m.addEventListener("touchend", function (e) {
                        s.preventScroll = !1, a(e, r, n, l, o)
                    })
                }(m, y, f, h)) : !function (r, n, l, s) {
                    m.addEventListener("mousemove", function (t) {
                        e(t, !1, r, n, l, s)
                    }), m.addEventListener("mouseenter", function (e) {
                        t(e, r)
                    }), m.addEventListener("mouseleave", function (e) {
                        a(e, r, n, l, s)
                    })
                }(m, y, f, h)
            }
        }
    }
    atvImg();
</script>


