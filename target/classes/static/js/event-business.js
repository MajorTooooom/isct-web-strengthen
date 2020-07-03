/**
 * event-xxx.js主要用于处理业务逻辑
 */

$(function () {
    notificationBusiness.businessOpenNotification({title: '正在测试连接状态', message: 'waiting..........', offset: 100, duration: 0, position: 'bottom-right'});
    testConnection();
});


/**
 *页面加载时读取一次数据库表信息
 */
function testConnection() {
    var ajaxTimeOut = $.ajax({
        url: '/startTimeTest',
        type: 'post',
        async: true,
        data: {},
        dataType: 'json',
        timeout: 5000,
        success: function (data) {
            fillSelectDocker(data.data);//将获取的数据填充到Vue对象，使得select组件填充数据
            setTimeout(function () {
            }, 300);
            setTimeout(function () {
                notificationBusiness.businessOpenNotification({title: '消息', message: data.message, offset: 100, duration: 0, position: 'top-right'});
            }, 500);
        },
        complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
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


