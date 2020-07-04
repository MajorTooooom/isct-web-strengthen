//============================================================================================================================================================================
new Vue({el: '#business-divider-top'});//一个顶部的切割线组件
new Vue({el: '#backToTop', data: {vhHeight: 15}});//一个回到顶部的组件
//============================================================================================================================================================================
/**
 *主抽屉组件：左侧边栏组件
 * 含组件,组件的属性放到一起
 * @type {Vue}
 */
var vueObjectMainDrawer = new Vue({
    el: "#vue-main-drawer",
    data: {
        drawer: true,
        //方向左边向右打开
        direction: 'ltr',
        size: '20%',
        icon: 'el-icon-s-tools',
        //我的自定义属性对象
        myObjects: {
            imgSrc: 'static/img/cat-day.png',// 头像地址
            systemMessage: {status: '未连接....', time: '', showLoadingDataBase: true, showSystemStatus: false}
        }
    }
});
//============================================================================================================================================================================
/**
 * notification消息提醒组件
 * @type {Vue}
 */
var notificationBusiness = new Vue({
    el: '#notificationBusiness',
    data: {
        // messageGroup: {}
    },
    methods: {
        businessOpenNotification(options) {
            let notifyObj = this.$notify({
                    title: options.title == undefined || options.title == '' ? '未知消息' : options.title,
                    message: options.message == undefined || options.message == '' ? '未知消息' : options.message,
                    offset: options.offset == undefined || options.offset == '' ? 100 : options.offset,
                    duration: options.duration == undefined || options.duration == '' ? 3000 : options.duration,
                    // top-right/top-left/bottom-right/bottom-left
                    position: options.position == undefined || options.position == '' ? 'top-right' : options.position
                })
            ;
            // this.messageGroup[options.cid] = notifyObj;
        }
    }
});
//============================================================================================================================================================================
/**
 * 步骤条组件
 * @type {Vue}
 */
var vueObjectSteps = new Vue({
    el: '#business-steps',
    data: {
        // 下标：0~3
        curActive: 0
    }
});
//============================================================================================================================================================================
/**
 *标签tabs组件
 * 因为其下元素是主要的展示区，而VueJs模式下不允许嵌套绑定对象的设定，所以其他很多组件添加的话需要挂在
 * 这个Vue对象下，所以很多data属性值或者方法需要对方在一起，需要结合注释进行区分；
 * @type {Vue}
 */
var vueObjectBusinessTabs = new Vue({
    el: '#business-tabs',
    data: {
        // tabs组件部分
        activeName: 'first',
        stretch: true,
        // select组件部分
        selectDataTableNames: [],
        selectArray: '',
        msgStatus: 0,
        //table表格部分
        tableFieldData: [],
        newData: [],//列表变动之后的新数据集合
        //存放其他自定义的信息
        myObjects: {myCurrentTime: '', FFFFFFFFFFFFFFFFObj: {msg: '请选择数据源', choose: -1}}
    },
    methods: {
        // tabs方法
        /**
         *tabs被点击切换时间
         * @param tab
         * @param event
         */
        handleClick(tab, event) {
            // console.log(tab, event);
            if (this.activeName == 'first') {
                vueObjectSteps.curActive = 0;
                CarouselWithAlertObj.showCarouselWithAlert = true;
            } else {
                CarouselWithAlertObj.showCarouselWithAlert = false;
            }
            if (this.activeName == 'second') {
                vueObjectSteps.curActive = 1;
            }
            if (this.activeName == 'third') {
                vueObjectSteps.curActive = 2;
            }
            if (this.activeName == 'fourth') {
                vueObjectSteps.curActive = 3;
            }
        },
        messageForSelect() {
            this.msgStatus++;
            // console.log(this.msgStatus);
            if (this.msgStatus < 3) {
                this.$message({
                    message: '当前选择框支持以下功能：多选、可搜索、清空',
                    type: 'success'
                });
            }
        },
        /**
         *选择了表格之后的确认&跳转事件
         */
        selectSummit() {
            if (this.selectArray.length <= 0) {
                this.$message({
                    message: '然而，你并没有选择任何数据',
                    type: 'warning'
                });
            } else {
                this.activeName = 'second';//切换tabs
                // 放一条提示信息
                this.$message({
                    message: '切换到字段视图',
                    type: 'success'
                });
                CarouselWithAlertObj.showCarouselWithAlert = false;//联动
                vueObjectSteps.curActive = 1;//步骤组件也切换
            }
        },
        /**
         * 为表格隔行换色的方法
         * @param row
         * @param rowIndex
         * @returns {string}
         */
        tableRowClassName({row, rowIndex}) {
            if (rowIndex % 2 === 0) {
                return 'warning-row';
            }
            return '';
        },
        /**
         * 加载表的全部字段
         */
        loadTableFields() {
            // console.log('cookie=' + $.cookie('cckk'));
            let tables = this.selectArray;
            if (tables.length == 0) {
                this.$message({
                    message: '请选择至少一张表格',
                    type: 'warning'
                });
                return false;
            }
            // this.tableData.push({TABLE_NAME:123});
            $.ajax({
                url: '/loadtablefields',
                type: 'post',
                traditional: true,
                data: {tables: tables},
                dataType: 'json',
                beforeSend: function () {
                },
                success: function (data) {
                    vueObjectBusinessTabs.tableFieldData = data.data;
                    bulidSortableAfterGetData();//对表格做可拓展的增强处理
                },
                complement: function () {

                }
            });
        },
        /**
         *选择数据源：选择下拉按钮的选项时触发的回调函数
         * @constructor
         */
        FFFFFFFFFFFFFFFF(command) {
            if (command == 0) {
                this.myObjects.FFFFFFFFFFFFFFFFObj.msg = '点击从数据库实时加载';
                this.myObjects.FFFFFFFFFFFFFFFFObj.choose = command;
            } else if (command == 1) {
                this.myObjects.FFFFFFFFFFFFFFFFObj.msg = '点击从cookie加载';
                this.myObjects.FFFFFFFFFFFFFFFFObj.choose = command;
            }
        },
        FFFFFFFFFFFFFFFFLoad() {
            if (this.myObjects.FFFFFFFFFFFFFFFFObj.choose == 0) {
                testConnection();
            } else if (this.myObjects.FFFFFFFFFFFFFFFFObj.choose == 1) {
                alert("cookie代码未实现");
            }
        }
    }
});
//============================================================================================================================================================================
//
/**
 * 方法区：Vue对象需要用到的方法进行封装
 */

/**
 * 给列表元素添加可拓展插件【Sortable.js】的支持
 */
function bulidSortableAfterGetData() {
    // ==================================================
    var el = $(".tableDocker tbody:first").get(0);//选中ul类型的元素，这里因为是ElementUI渲染出来的所以是tbody下面一组tr;然后将jQuery对象转成js对象，因为这是Sortable.min.js插件要求的
    var sortable = Sortable.create(el, {
        // 参数列表，参考http://www.sortablejs.com/             或者 https://www.jianshu.com/p/887ab28bdea0
        animation: 150,
        ghostClass: 'blue-background-class',
        /**
         * 每次拖拽结束事件
         * @param evt
         */
        onEnd: function (/**Event*/evt) {
            // 每次拖拽后刷新排序值，
            var tableTbody = $(".tableDocker tbody:first>tr");//tr对象数组
            $.each(tableTbody, function (index, domElement) {
                var temp = domElement.getElementsByTagName("td")[0];//拿到第一个td
                // var temp = domElement.children("td").eq(0);
                var nextTemp = temp.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
                nextTemp.innerHTML = index + 1;//注意是等于号，不是方法
            })
            //完成之后刷新Vue对象数据
            updateTableFieldData();
        }
    });
}

//============================================================================================================================================================================
var CarouselWithAlertObj = new Vue({
    el: '#CarouselWithAlert',
    data: {
        showCarouselWithAlert: true,
        intervalTime: 5000,
        helpMessages: [
            {title: '选择表格', type: 'success', description: '表格加载完成后，点击下拉框选择表格，所选表格将加载其全部字段'},
            {title: '下拉框支持功能', type: 'warning', description: '当前选择框支持以下功能：多选、可搜索、清空'},
            {title: '点击USE按钮进行界面跳转', type: 'info', description: '表格加载完成后，点击下拉框选择表格，所选表格将加载其全部字段'}
        ]
    }
});

//============================================================================================================================================================================
/**
 * 将手动拓展后的表格数据按照顺序重新封装成Vue数据，然后更新之。
 * ElementUI和sortables.js不互动，所以要自己手动更新数据。
 */
function updateTableFieldData() {
    var tempNewData = [];
    var tableTbody = $(".tableDocker tbody:first>tr");//tr对象数组
    $.each(tableTbody, function (index, domElement) {
        var td_0 = domElement.getElementsByTagName("td")[0];//拿到第1个td
        var td_1 = domElement.getElementsByTagName("td")[1];//拿到第2个td
        var td_2 = domElement.getElementsByTagName("td")[2];//拿到第3个td
        var td_3 = domElement.getElementsByTagName("td")[3];//拿到第4个td
        var td_4 = domElement.getElementsByTagName("td")[4];//拿到第5个td
        //从第一列获取序号
        var _index = td_0.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML;
        var _TABLE_NAME = td_1.getElementsByTagName("div")[0].innerHTML;
        var _COLUMN_COMMENT = $(td_2).find("span[class*='el-tag']")[0].innerText;//$(js对象)是将js对象转jQuery对象；find()是找后代元素，children()是找子元素，“*=”是指包含；jquery除了get()得到是jQuery对象之外，其他find()等方法得到都是js对象
        var _COLUMN_NAME = $(td_3).find("div[class='cell']")[0].innerHTML;
        var _FINAL_COLUMN_NAME = $($(td_4).find("div[class='el-input']")[0]).find("input[class=el-input__inner]")[0].value;
        // 都获取之后拼装json数组
        tempNewData.push({
            index: _index - 1,//因为页面是序号
            TABLE_NAME: _TABLE_NAME,
            COLUMN_COMMENT: _COLUMN_COMMENT,
            COLUMN_NAME: _COLUMN_NAME,
            FINAL_COLUMN_NAME: _FINAL_COLUMN_NAME
        });
        // console.log(FINAL_COLUMN_NAME);
        // var nextTemp = temp.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
        // nextTemp.innerHTML = index + 1;//注意是等于号，不是方法
    })
    // console.log(newData);//循环结束后，查看结果，检查通过
    //将新的类别数据给到
    vueObjectBusinessTabs.newData = tempNewData;
    $
}

//============================================================================================================================================================================