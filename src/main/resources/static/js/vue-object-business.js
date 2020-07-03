new Vue({el: '#business-divider-top'});
// new Vue({el: '#business-divider-bottom'});
/**
 *主抽屉
 * 含组件
 * @type {Vue}
 */
var vueObjectMainDrawer = new Vue({
    el: "#vue-main-drawer",
    data() {
        return {
            drawer: true,
            direction: 'ltr',
            size: '20%',
            icon: 'el-icon-s-tools',
        };
    },
});
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

var vueObjectSteps = new Vue({
    el: '#business-steps',
    data: {
        // 下标：0~3
        curActive: 0
    }
});
//============================================================================================================================================================================
//标签tabs,因为Vue.js无法实现嵌套绑定（即对象套对象），所以这个标签需要多为很多对象的顶级标签
var vueObjectBusinessTabs = new Vue({
    el: '#business-tabs',
    data() {
        return {
            // tabs组件部分
            activeName: 'first',
            stretch: true,
            // select组件部分
            selectDataTableNames: [],
            selectArray: '',
            msgStatus: 0,
            //table表格部分
            tableFieldData: []
        };
    },
    methods: {
        // tabs方法
        handleClick(tab, event) {
            // console.log(tab, event);
            if (this.activeName == 'first') {
                vueObjectSteps.curActive = 0;
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
            console.log(this.msgStatus);
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
            let tables = this.selectArray;
            if (tables.length == 0) {
                this.$message({
                    message: '请选择只是一张表格',
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

        }
    }
});
//============================================================================================================================================================================
// 抽方法
/**
 * 给列表元素添加可拓展插件支持
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
        }
    });
    // ==================================================
}