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
            //表格
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: []
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
        selectSummit() {
            this.activeName = 'second';//切换tabs
            // 放一条提示信息
            this.$message({
                message: '切换到字段视图',
                type: 'success'
            });
            vueObjectSteps.curActive = 1;//步骤组件也切换
        },
        //表格
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    }
});
//============================================================================================================================================================================