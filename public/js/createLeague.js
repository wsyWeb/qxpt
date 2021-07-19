var carousel1, carousel2, carousel3;
layui.use(["carousel", "element", "form"], function () {
    var carousel = layui.carousel;
    (form = layui.form), ($ = layui.jquery), (element = layui.element); //Tab的切换功能，切换事件监听等，需要依赖element模块
    //改变下时间间隔、动画类型、高度
    carousel1 = function () {
        carousel.render({
            elem: "#carousel1",
            interval: 1800,
            anim: "fade",
            height: "280px",
            width: "990px",
            autoplay: false,
        });
    };
    carousel2 = function () {
        carousel.render({
            elem: "#carousel2",
            interval: 1800,
            anim: "fade",
            height: "280px",
            width: "990px",
            autoplay: false,
        });
    };
    carousel3 = function () {
        carousel.render({
            elem: "#carousel3",
            interval: 1800,
            anim: "fade",
            height: "280px",
            width: "990px",
            autoplay: false,
        });
    };
    carousel1();
    carousel2();
    carousel3();
});
