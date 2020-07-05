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
        //table表格部分,tableFieldData主要是用于储存从数据库加载的原始备份，后面在页面无论对于表格怎么操作，都不要影响这个数据
        tableFieldData: [],
        //用于Vue启动表格组件时候的数据存储，同时与sortable.js交互必须得有一个介质——比如操作dom；此时在直接赋值newData=newData的话会出现问题，可能是2个插件直接的战争，所以方法是不
        //动这个变量，引入finalTableData，利用原始的变量dom获取数据反组装json数组，给到引入finalTableData[]进行储存；
        newData: [],
        finalTableData: [],//页面所有的操作结束之后，会通过dom的方式，从新获取一个json数据，这是目前最好的方案
        // TableDialog是放在组件内部的隐藏对话框，在table组件的事件里面触发
        TableDialog: {
            form: {
                currentRowIndex: -1,
                TABLE_NAME: '',
                COLUMN_COMMENT: '',
                COLUMN_NAME: ''
            },
            dialogFormVisible: false,//初始化不可见

        },
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
                // CarouselWithAlertObj.showCarouselWithAlert = true;
            } else {
                // CarouselWithAlertObj.showCarouselWithAlert = false;
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
                myLayer('.locationCs', {message: '点击加载数据', tips: 2, setTimeout: true, time: 1000})
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
            let tables = this.selectArray;
            if (tables.length == 0) {
                this.$message({
                    message: '请选择至少一张表格',
                    type: 'warning'
                });
                return false;
            }
            $.ajax({
                // 后端服务器查询数据
                url: '/loadtablefields',
                type: 'post',
                traditional: true,
                data: {tables: tables},
                dataType: 'json',
                beforeSend: function () {
                    vueObjectBusinessTabs.tableFieldData = [];//先清空
                    vueObjectBusinessTabs.newData = [];//先清空
                },
                success: function (data) {
                    vueObjectBusinessTabs.tableFieldData = data.data;//原始数据份
                    vueObjectBusinessTabs.newData = data.data;//首次也要加载动态份
                    vueObjectBusinessTabs.globalForceUpdate();
                    bulidSortableAfterGetData();//对表格做可拖拽的增强处理即添加sortable.js
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
        },
        /**
         * 指定当前选中的行
         * 也是利用splice()方法，思路是先删除再添加
         * @param index
         * @param row
         * @param column
         */
        topOneJson(index, row, column) {
            // console.log(index);
            var temp = {
                COLUMN_COMMENT: row.COLUMN_COMMENT,
                COLUMN_NAME: row.COLUMN_NAME,
                FINAL_COLUMN_NAME: row.COLUMN_NAME,
                TABLE_NAME: row.TABLE_NAME,
                index: row.index
            };
            // console.log(temp);
            this.newData.splice(index, 1);//强无敌,注意：一旦调用了splice()方法就已经改变其本身了。意思是在index的位置删除一个元素
            this.newData.splice(0, 0, temp);//在index=0的位置删除0个元素并添加一个元素temp
            this.$forceUpdate();//Vue强制刷新组件，解决页面不刷新的问题，而且不用自己更像index
            // this.updateTableFieldData();//更新finalTableData[]
        },
        /**
         * 删除一行
         * @param index
         * @param row
         * @param column
         */
        deleteOneJson(index, row, column) {
            this.newData.splice(index, 1);
            this.$forceUpdate();//Vue强制刷新组件，解决页面不刷新的问题，而且不用自己更像index
            // this.updateTableFieldData();//更新finalTableData[]
        },
        /**
         * 表格组件的方法：在当前选择的行的前面插入一条数据
         * @param index  经测试是页面显示值
         * @param row 经测试是行数据
         * @param column 经测试时表头信息
         */
        addOneJson(index, row, column) {
            // 此处再打开一个组件dialog对话框
            //先清空dialog对话框的的内容防止冲突
            this.TableDialog.form.TABLE_NAME = '';
            this.TableDialog.form.COLUMN_COMMENT = '';
            this.TableDialog.form.COLUMN_NAME = '';
            // 然后设置对话框可见
            this.TableDialog.dialogFormVisible = true;
            // 关键配置
            this.TableDialog.form.currentRowIndex = index;//设置之后，就是对话框的确认按钮之后的事情了即InsertTableParam()
        },
        /**
         * 表格组件中添加一行按钮的画面中的确认事件
         * 利用splice()方法
         * 缺失校验
         * @constructor
         */
        InsertTableParam() {
            var insertIndex = this.TableDialog.form.currentRowIndex;
            var temp = {
                COLUMN_COMMENT: this.TableDialog.form.COLUMN_COMMENT,
                COLUMN_NAME: this.TableDialog.form.COLUMN_NAME,
                FINAL_COLUMN_NAME: this.TableDialog.form.COLUMN_NAME,
                TABLE_NAME: this.TableDialog.form.TABLE_NAME,
                index: 99999
            };
            this.TableDialog.dialogFormVisible = false;
            this.newData.splice(insertIndex, 0, temp);//强无敌,注意：一旦调用了splice()方法就已经改变其本身了
            this.$forceUpdate();//Vue强制刷新组件，解决页面不刷新的问题，而且不用自己更像index
            // this.updateTableFieldData();//更新finalTableData[]
        },
        /**
         * 将手动拓展后的表格数据按照顺序重新封装成Vue数据，然后更新之。
         * ElementUI和sortables.js不互动，所以要自己手动更新数据。
         */
        updateTableFieldData() {
            console.log("更新数据中...........");
            var tempNewData = [];
            var tableTbody = $(".tableDocker tbody:first>tr");//tr对象数组
            // 改造$.each，踩了一坑，因为查阅资料得知这个循环并不是按照页面显示的顺序来遍历的；
            for (let i = 0; i < tableTbody.length; i++) {
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
                    //从中定位到目标
                    if ((i + 1) == _index) {
                        // 都获取之后拼装json数组
                        tempNewData.push({
                            index: (_index - 1),//因为页面是序号
                            TABLE_NAME: _TABLE_NAME,
                            COLUMN_COMMENT: _COLUMN_COMMENT,
                            COLUMN_NAME: _COLUMN_NAME,
                            FINAL_COLUMN_NAME: _FINAL_COLUMN_NAME
                        });
                        // jQuery中each不能使用break结束循环，也不能使用continue来结束本次循环，想要实现类似的功能就只能用return,
                        // break           用return false
                        // continue      用return true
                        return true;
                    }
                })
            }
            // console.log(tempNewData);//循环结束后，查看结果，检查通过
            //将新的类别数据给到
            // vueObjectBusinessTabs.newData = tempNewData;
            vueObjectBusinessTabs.finalTableData = tempNewData;
            // console.log(this.newData);
            // console.log(this.finalTableData);
            // this.$forceUpdate();//Vue强制刷新组件，解决页面不刷新的问题
            localStorageController('set', 'tableDataInLocalStorage', JSON.stringify(tempNewData));//存localStorage
        },
        /**
         * 目的是能在这里调用this
         */
        globalForceUpdate() {
            this.$forceUpdate();
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
         * 每次拖拽结束事件,这里更新页面展示的序号
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
            //完成之后更新数据
            // vueObjectBusinessTabs.updateTableFieldData();//实际是调成功的了；20200705124630：决定此数据在提交的时候再更新
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
var textingObj = new Vue({
    el: '#texting', methods: {
        getCookie: function () {
            console.log(localStorageController('get', 'tableDataInLocalStorage'));
        }
    }
});

//============================================================================================================================================================================

//============================================================================================================================================================================