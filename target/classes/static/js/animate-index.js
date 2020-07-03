$(function () {
    $("#logo").fadeIn(800);
    setTimeout(function () {
        vueObjectNotificationIndexFirst.openNotifiction();//打开一条消息提醒
    }, 1000);
    $("#logo").click(function () {
        $("#logo").addClass('animated bounceOutLeft');
        $("#logo").fadeOut(800);
    });
});