$(function () {
    getNowTime();
});

//获取当前年月日
function getNowTime() {
    let nowTime = new Date();

    let nowYear = nowTime.getFullYear();
    let nowMonth = nowTime.getMonth() + 1;
    let nowDay = nowTime.getDate();

    let week = new Array(
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
    );
    let weekDay = week[nowTime.getDay()];

    let showTime = nowYear + "年" + nowMonth + "月" + nowDay + "日 " + weekDay;
    $(".headTime").html(showTime);
}
//判断点击并渲染
$(document).ready(function () {
    $(".headList li span").each(function () {
        $this = $(this);
        // console.log(String(window.location));
        if ($this.parent()[0].href === String(window.location)) {
            $(".headList li span").removeClass("choose");
            $this.addClass("choose");
        }
    });
});

$(".headList li span").click(function () {
    $.each($(".headList li span"), function () {
        $(this).removeClass("choose");
    });
    $(this).addClass("choose");
});

$(".createPlatform").hover(function () {
    $("#createChoose").fadeToggle("200");
});
$(".resourceShowMain").hover(function () {
    $(".sourceShowList").fadeToggle("200");
});
