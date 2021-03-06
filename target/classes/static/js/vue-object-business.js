//============================================================================================================================================================================
new Vue({el: '#business-divider-top'});//一个顶部的切割线组件
new Vue({el: '#backToTop', data: {vhHeight: 15}});//一个回到顶部的组件
//============================================================================================================================================================================
/**
 *主抽屉组件：左侧边栏组件
 * 含组件,组件的属性放到一起
 * @type {Vue}
 */
let vueObjectMainDrawer = new Vue({
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
let notificationBusiness = new Vue({
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
let vueObjectSteps = new Vue({
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
        selectArray: [],//其length也经常被调用
        fullscreenLoading: false,
        msgStatus: 0,
        //全部的表名和字段名；
        allTableAndFields: [],
        allTableAndFields_select: [],
        allTableAndFieldsLoading: false,
        currentFieldxml: {alias: 'p1'},
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
        // InputNumber计数器组件数据
        InputNumberParams: {fewNum: 0},
        //表格按钮的dialog
        currentFieldFunctionZone: {
            currentChooseDictionary: '',
            bscDictionaryInfoTree: [],
            centerDialogVisible: false,
            innerVisible: false,
            index: -1,
            row: {},
            column: {},
            width_1: 3,
            width_2: 4,
            width_3: 8,
            currentShowData: '',
            ifCurrentTable: false,
            fieldIndex: -1,
            fieldTypes: [{value: "String", label: "String"}, {value: "int", label: "int"}, {value: "BigDecimal", label: "BigDecimal"}, {value: "Date", label: "Date"}],
            currentfieldTypes: ''
        },
        //存放其他自定义的信息
        myObjects: {
            myCurrentTime: '',
            FFFFFFFFFFFFFFFFObj: {msg: '请选择数据源', choose: -1},
            dealBusiness: {
                getColNames: {doing: false, percentage: 0, data: {ColNames: '', colModel: ''}, whatToShow: [], whatToShow_2: '', whatToShow_2_show: true, done: false, url: '/getColNames', dialogShow: false},
            },
            tableHelpMessage: {noMoreTips: false}
        }
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
            //将选择信息存进localStorage:localStorageController
            var tableHistory = localStorageController('get', "tableHistory");
            console.log(tableHistory);
            var tableHistoryStr = tableHistory != null ? tableHistory : "{\"data\":[]}";
            var jsonData = JSON.parse(tableHistoryStr);
            for (let i = 0; i < this.selectArray.length; i++) {
                if (($.inArray(this.selectArray[i], jsonData.data)) == -1) {
                    if (jsonData.data.length == 10) {
                        jsonData.data.splice(9, 1);
                    }
                    jsonData.data.splice(0, 0, this.selectArray[i]);
                }
            }
            localStorageController('set', "tableHistory", JSON.stringify(jsonData));
        }
        ,
        /**
         * 为表格隔行换色的方法
         * @param row
         * @param rowIndex
         * @returns {string}
         */
        tableRowClassName
            ({row, rowIndex}) {
            if (rowIndex % 2 === 0) {
                return 'warning-row';
            }
            return '';
        }
        ,
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
                myLayer('#tab-first', {message: '请选择至少一张表格', tips: 1});
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
                    this.fullscreenLoading = true;
                },
                success: function (data) {
                    vueObjectBusinessTabs.tableFieldData = data.data;//原始数据份
                    vueObjectBusinessTabs.newData = data.data;//首次也要加载动态份
                    vueObjectBusinessTabs.InputNumberParams.fewNum = data.data.length;
                    vueObjectBusinessTabs.globalForceUpdate();
                    // bulidSortableAfterGetData();//对表格做可拖拽的增强处理即添加sortable.js
                    vueObjectBusinessTabs.sortableJsBuffer();
                    vueObjectBusinessTabs.openImportMessage();
                },
                complement: function () {
                    this.fullscreenLoading = false;
                }
            });
        }
        ,
        /**
         *选择数据源：选择下拉按钮的选项时触发的回调函数
         * @constructor
         */
        FFFFFFFFFFFFFFFF(command) {
            if (command == 0) {
                this.myObjects.FFFFFFFFFFFFFFFFObj.msg = '点击从数据库实时加载';
                this.myObjects.FFFFFFFFFFFFFFFFObj.choose = command;
            } else if (command == 1) {
                this.myObjects.FFFFFFFFFFFFFFFFObj.msg = '点击从本地历史加载(最后10条)';
                this.myObjects.FFFFFFFFFFFFFFFFObj.choose = command;
            }
        }
        ,
        FFFFFFFFFFFFFFFFLoad() {
            if (this.myObjects.FFFFFFFFFFFFFFFFObj.choose == 0) {
                testConnection();
            } else if (this.myObjects.FFFFFFFFFFFFFFFFObj.choose == 1) {
                var dataStr = JSON.parse(localStorageController('get', 'tableHistory'));
                this.selectArray = dataStr.data;
                this.$forceUpdate();
            }
        }
        ,
        /**
         * 展示服务器回来的数据
         */
        showAllReturnData(code) {
            if (code == 99) {
                this.myObjects.dealBusiness.getColNames.whatToShow_2 = JSON.stringify(this.myObjects.dealBusiness.getColNames.data);
            } else if (code == 1) {
                console.log(this.myObjects.dealBusiness.getColNames.data.ColNames);
                this.myObjects.dealBusiness.getColNames.whatToShow_2 = this.myObjects.dealBusiness.getColNames.data.ColNames;
            } else if (code == 2) {
                // console.log(JSON.parse(this.myObjects.dealBusiness.getColNames.data.colModel));
                this.myObjects.dealBusiness.getColNames.whatToShow_2_show = true;
                var temp = (JSON.parse(this.myObjects.dealBusiness.getColNames.data.colModel));
                var string = "";
                for (let i = 0; i < temp.length; i++) {
                    var tempItem = temp[i];
                    string = string + tempItem + "\n";//目的
                }
                this.myObjects.dealBusiness.getColNames.whatToShow_2 = string;
            }
            // 打开统一展板
            this.myObjects.dealBusiness.getColNames.dialogShow = true;
        }
        ,
        /**
         * 最大化maxedInputNumber计数器的最大值
         */
        maxedInputNumberParams() {
            this.InputNumberParams.fewNum = this.newData.length;
            myLayer('#locationInputNumber', {tips: 1, message: 'done' + ' max=' + this.newData.length});
        }
        ,
        /**
         * 指定当前选中的行
         * 也是利用splice()方法，思路是先删除再添加
         * @param index
         * @param row
         * @param column
         */
        topOneJson(index, row, column) {
            // console.log(index);
            let temp = {
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
        }
        ,
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
        }
        ,
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
        }
        ,
        /**
         * 表格组件中添加一行按钮的画面中的确认事件
         * 利用splice()方法
         * 缺失校验
         * @constructor
         */
        InsertTableParam() {
            let insertIndex = this.TableDialog.form.currentRowIndex;
            let temp = {
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
        }
        ,
        /**
         *点击表格操作去的更多功能按钮的触发事件，用于展示更多的按钮
         */
        currentFieldFunction(index, row, column) {
            this.currentFieldFunctionZone.centerDialogVisible = true;
            this.currentFieldFunctionZone.index = index;
            this.currentFieldFunctionZone.row = row;
            this.currentFieldFunctionZone.column = column;
            this.currentFieldFunctionZone.title = "当前处理字段：" + row.COLUMN_COMMENT + "\t使用代码\t" + row.FINAL_COLUMN_NAME;
            //数据赋值之后，dialog里面的按钮操作就会从这里读数据，dialog写在html底部body前
            // Layout布局的参数初始化一下
            this.currentFieldFunctionZone.width_1 = 3;
            this.currentFieldFunctionZone.width_2 = 4;
            this.currentFieldFunctionZone.width_3 = 8;
        }
        ,
        /**
         *更多代码的按钮
         */
        moreFunction(type) {
            var _COLUMN_COMMENT = this.currentFieldFunctionZone.row.COLUMN_COMMENT;
            var _COLUMN_NAME = this.currentFieldFunctionZone.row.FINAL_COLUMN_NAME;//使用FINAL_COLUMN_NAME
            var _width_1 = this.currentFieldFunctionZone.width_1;
            var _width_2 = this.currentFieldFunctionZone.width_2;
            var _width_3 = this.currentFieldFunctionZone.width_3;
            var _currentChooseDictionary = this.currentFieldFunctionZone.currentChooseDictionary;//字典值,是一个["1003", "10030002"]
            var _ifCurrentTable = this.currentFieldFunctionZone.ifCurrentTable;
            var _fieldIndex = this.currentFieldFunctionZone.fieldIndex;
            var _currentfieldTypes = this.currentFieldFunctionZone.currentfieldTypes;
            var _alias = this.currentFieldxml.alias;
            console.log(_currentChooseDictionary);
            $.ajax({
                url: '/forMoreCode',
                type: 'post',
                data: {
                    type: type,
                    COLUMN_COMMENT: _COLUMN_COMMENT,
                    COLUMN_NAME: _COLUMN_NAME,
                    width_1: _width_1,
                    width_2: _width_2,
                    width_3: _width_3,
                    currentChooseDictionary: JSON.stringify(_currentChooseDictionary),
                    ifCurrentTable: _ifCurrentTable,
                    fieldIndex: _fieldIndex,
                    currentfieldTypes: _currentfieldTypes,
                    alias: _alias
                },
                dataType: 'text',
                success: function (data) {
                    console.log(data);
                    vueObjectBusinessTabs.currentFieldFunctionZone.currentShowData = data;
                }
            });
        }
        ,
        /**
         * 通过原始的dom操作读取整个表格的数据（可能是各种操作之后）：所以但凡是最终获取表格内容的话可以调这个方法
         * ElementUI和sortables.js不互动，所以要自己手动更新数据。
         */
        updateTableFieldData() {
            console.log("JS reading DOM of Tables...........");
            let tempNewData = [];
            let tableTbody = $(".tableDocker tbody:first>tr");//tr对象数组
            // 改造$.each，踩了一坑，因为查阅资料得知这个循环并不是按照页面显示的顺序来遍历的；
            for (let i = 0; i < tableTbody.length; i++) {
                $.each(tableTbody, function (index, domElement) {
                    let td_0 = domElement.getElementsByTagName("td")[0];//拿到第1个td
                    let td_1 = domElement.getElementsByTagName("td")[1];//拿到第2个td
                    let td_2 = domElement.getElementsByTagName("td")[2];//拿到第3个td
                    let td_3 = domElement.getElementsByTagName("td")[3];//拿到第4个td
                    let td_4 = domElement.getElementsByTagName("td")[4];//拿到第5个td
                    //从第一列获取序号
                    let _index = td_0.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML;
                    let _TABLE_NAME = td_1.getElementsByTagName("div")[0].innerHTML;
                    let _COLUMN_COMMENT = $(td_2).find("span[class*='el-tag']")[0].innerText;//$(js对象)是将js对象转jQuery对象；find()是找后代元素，children()是找子元素，“*=”是指包含；jquery除了get()得到是jQuery对象之外，其他find()等方法得到都是js对象
                    let _COLUMN_NAME = $(td_3).find("div[class='cell']")[0].innerHTML;
                    let _FINAL_COLUMN_NAME = $($(td_4).find("div[class='el-input']")[0]).find("input[class=el-input__inner]")[0].value;
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
            // localStorageController('remove', 'tableDataInLocalStorage', null);//存localStorage
            // localStorageController('set', 'tableDataInLocalStorage', JSON.stringify(tempNewData));//存localStorage
            return tempNewData;
        }
        ,

        /**
         * 目的是能在这里调用this
         */
        globalForceUpdate() {
            this.$forceUpdate();
        }
        ,
        /**
         * dealBusiness:加载业务数据，ajax
         */
        dealBusinessFunction(VueData) {
            var _fewNum = this.InputNumberParams.fewNum;
            if (_fewNum > 0) {
                var tempArray = this.updateTableFieldData();//原始js变量dom获取数据
                //利用splice()函数删除指定index之后的数据
                tempArray.splice(_fewNum, (tempArray.length - _fewNum));
                // console.log(tempArray);
                // console.log(this.finalTableData);
                $.ajax({
                    url: VueData.url,
                    type: 'post',
                    data: {list: JSON.stringify(tempArray)},
                    dataType: 'json',
                    beforeSend: function () {
                        VueData.percentage = 75;
                        VueData.done = false;
                        VueData.doing = true;
                    },
                    success: function (data) {
                        VueData.percentage = 100;
                        VueData.data = data;
                        myLayer('.ajaxGetColNames', {tips: 1, message: '加载完成！'});
                        console.log(vueObjectBusinessTabs.myObjects.dealBusiness.getColNames.data);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        VueData.done = true;
                        VueData.doing = false;
                    }
                });
            } else {
            }
        }
        ,
        /**
         * 按需加载字典表
         */
        loadBscDictionaryInfoTree() {
            $.ajax({
                url: '/loadBscDictionaryInfoTree',
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                },
                success: function (data) {
                    vueObjectBusinessTabs.currentFieldFunctionZone.bscDictionaryInfoTree = data;
                },
                complete: function (XMLHttpRequest, textStatus) {
                }
            });
        }
        ,
        openImportMessage() {
            if (this.myObjects.tableHelpMessage.noMoreTips == false) {
                this.$alert('表格支持拖拽排序', '重要功能', {
                    confirmButtonText: '不再提示',
                    callback: action => {
                        this.myObjects.tableHelpMessage.noMoreTips = true;
                    }
                });
            }

        },
        /**
         * 参考【Vue中使用Sortable - 简书 https://www.jianshu.com/p/d92b9efe3e6a】解决拖拽诡异事件
         */
        sortableJsBuffer() {
            let el = $(".tableDocker tbody:first").get(0);//选中ul类型的元素，这里因为是ElementUI渲染出来的所以是tbody下面一组tr;然后将jQuery对象转成js对象，因为这是Sortable.min.js插件要求的
            var that = this;
            new Sortable(el, {
                onUpdate: function (event) {
                    var newIndex = event.newIndex,
                        oldIndex = event.oldIndex,
                        $li = el.children[newIndex],
                        $oldLi = el.children[oldIndex];
                    // 先删除移动的节点
                    el.removeChild($li);
                    // 再插入移动的节点到原有节点，还原了移动的操作
                    if (newIndex > oldIndex) {
                        el.insertBefore($li, $oldLi);
                    } else {
                        el.insertBefore($li, $oldLi.nextSibling);
                    }
                    // 更新items数组
                    var item = that.newData.splice(oldIndex, 1);
                    that.newData.splice(newIndex, 0, item[0]);
                    // 下一个tick就会走patch更新
                }
            })
        },
        testClose() {
            console.log("按时大大所大所大所撒多");
        },
        /**
         * 加载scm数据库全部的表名和字段名
         */
        loadDataAllTableAndFields() {
            $.ajax({
                url: '/loadDataAllTableAndFields',
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    vueObjectBusinessTabs.allTableAndFieldsLoading = true;
                },
                success: function (data) {
                    console.log(data);
                    vueObjectBusinessTabs.allTableAndFields = data.data;
                },
                complete: function (XMLHttpRequest, status) {
                    vueObjectBusinessTabs.allTableAndFieldsLoading = false;
                }
            });
        },
        fillallTableAndFields_select() {
            this.TableDialog.form.TABLE_NAME = this.allTableAndFields_select[0];
            this.TableDialog.form.COLUMN_NAME = this.allTableAndFields_select[1];
        },
        getEntityFields() {
            $.ajax({
                url: '/getEntityFields',
                type: 'post',
                data: {selectArray: JSON.stringify(vueObjectBusinessTabs.selectArray)},
                dataType: 'json',
                beforeSend: function () {
                },
                success: function (data) {
                    vueObjectBusinessTabs.myObjects.dealBusiness.getColNames.whatToShow_2 = data.data;
                    vueObjectBusinessTabs.myObjects.dealBusiness.getColNames.dialogShow = true;
                },
                complete: function (XMLHttpRequest, status) {
                }
            });
        }
        //metheds END
    },
    /**
     * Vue对象的$watch方法，不知道为什么单独写不行，得写在对象里面的watch属性
     */
    watch: {
        /**
         * 监测vueObjectBusinessTabs对象的newData属性
         * @param newVal
         * @param oldVal
         */
        newData: function (newVal, oldVal) {
            this.InputNumberParams.fewNum = this.newData.length;
        },
    }
});
//============================================================================================================================================================================

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
    let el = $(".tableDocker tbody:first").get(0);//选中ul类型的元素，这里因为是ElementUI渲染出来的所以是tbody下面一组tr;然后将jQuery对象转成js对象，因为这是Sortable.min.js插件要求的
    let sortable = Sortable.create(el, {
        // 参数列表，参考http://www.sortablejs.com/             或者 https://www.jianshu.com/p/887ab28bdea0
        animation: 150,
        ghostClass: 'blue-background-class',
        /**
         * 每次拖拽结束事件,这里更新页面展示的序号
         * @param evt
         */
        onEnd: function (/**Event*/evt) {
            // 每次拖拽后刷新排序值，
            let tableTbody = $(".tableDocker tbody:first>tr");//tr对象数组
            $.each(tableTbody, function (index, domElement) {
                let temp = domElement.getElementsByTagName("td")[0];//拿到第一个td
                // let temp = domElement.children("td").eq(0);
                let nextTemp = temp.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
                nextTemp.innerHTML = index + 1;//注意是等于号，不是方法
            })
            //完成之后更新数据
            // vueObjectBusinessTabs.updateTableFieldData();//实际是调成功的了；20200705124630：决定此数据在提交的时候再更新
        }
    });
}

//============================================================================================================================================================================
let CarouselWithAlertObj = new Vue({
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
let textingObj = new Vue({
    el: '#texting', methods: {
        getCookie: function () {
            console.log(localStorageController('get', 'tableDataInLocalStorage'));
        }
    }
});

//============================================================================================================================================================================

//============================================================================================================================================================================