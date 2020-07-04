/**
 * event-xxx.js主要用于处理业务逻辑
 */

$(function () {
    // $.cookie('cckk', '读取cookie成功', {expires: 1});
    notificationBusiness.businessOpenNotification({title: '正在测试连接状态', message: 'waiting..........', offset: 100, duration: 0, position: 'bottom-right'});
    testConnection();
});


/**
 *页面加载时读取一次数据库表信息
 */
function testConnection() {
    vueObjectMainDrawer.myObjects.systemMessage.showLoadingDataBase = true;
    vueObjectMainDrawer.myObjects.systemMessage.showSystemStatus = false;
    var ajaxTimeOut = $.ajax({
        url: '/startTimeTest',
        type: 'post',
        async: true,
        data: {},
        dataType: 'json',
        timeout: 5000,
        success: function (data) {
            fillSelectDocker(data.data);//将获取的数据填充到Vue对象，使得select组件填充数据
            vueObjectMainDrawer.myObjects.systemMessage.status = '已连接';
            vueObjectBusinessTabs.myObjects.FFFFFFFFFFFFFFFFObj.msg = '已加载表格' + data.data.length + '张';
            setTimeout(function () {
            }, 300);
            setTimeout(function () {
                notificationBusiness.businessOpenNotification({title: '消息', message: data.message, offset: 100, duration: 0, position: 'top-right'});
            }, 500);
        },
        complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
            vueObjectMainDrawer.myObjects.systemMessage.showSystemStatus = true;
            vueObjectMainDrawer.myObjects.systemMessage.showLoadingDataBase = false;
            vueObjectMainDrawer.myObjects.systemMessage.time = getCurrentSystemDateTime();
            //status == 'timeout'，超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
            if (status == 'timeout') {
                //取消请求
                ajaxTimeOut.abort();
                notificationBusiness.businessOpenNotification({title: '消息', message: '连接超时，请检查连接和VPN', offset: 100, duration: 0, position: 'top-right'});

            }
        }
    })
}


/**
 * 给选择器填充数据
 * 后台传了List<Map<String,Object>>  例如：name:pur_order
 * UI框架要求格式：[{value:'',label:''},{}]
 * @param list
 */
function fillSelectDocker(list) {
    if (list != undefined && list.length > 0) {
        var target = [];
        for (let i = 0; i < list.length; i++) {
            var temp = {};
            var tableName = list[i]['name'];
            var tableComment = list[i]['note'];
            tableComment = tableComment == undefined || tableComment == '' ? '' : tableComment;
            temp["value"] = tableName;
            temp["label"] = tableComment + '\xa0\xa0\xa0' + tableName;
            target.push(temp);
        }
        //传递给
        vueObjectBusinessTabs.selectDataTableNames = target;
    }
}


// ==================================================
// var myDate = new Date();
// myDate.getYear();        //获取当前年份(2位)
// myDate.getFullYear();    //获取完整的年份(4位,1970-????)
// myDate.getMonth();       //获取当前月份(0-11,0代表1月)
// myDate.getDate();        //获取当前日(1-31)
// myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
// myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
// myDate.getHours();       //获取当前小时数(0-23)
// myDate.getMinutes();     //获取当前分钟数(0-59)
// myDate.getSeconds();     //获取当前秒数(0-59)
// myDate.getMilliseconds();    //获取当前毫秒数(0-999)
// myDate.toLocaleDateString();     //获取当前日期
// var mytime = myDate.toLocaleTimeString();     //获取当前时间
// myDate.toLocaleString();        //获取日期与时间
function getCurrentSystemDateTime() {
    var myDate = new Date();
    let fullYear = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    let date = myDate.getDate();
    let hours = myDate.getHours();       //获取当前小时数(0-23)
    let minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
    let seconds = myDate.getSeconds();     //获取当前秒数(0-59)
    return fullYear + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

// ==================================================