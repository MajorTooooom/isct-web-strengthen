$(function () {
    $("#logo").fadeIn(800);
    vueObjectNotificationIndexFirst.openNotifiction();//打开一条消息提醒
    $("#logo").click(function () {
        $("#logo").addClass('animated bounceOutLeft');
        $("#logo").fadeOut(800);
    });
});