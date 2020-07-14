package com.chengfeng.data.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chengfeng.data.entity.TableFields;
import com.chengfeng.data.service.StringbufferTableFieldsService;
import com.chengfeng.data.utils.HumpUtils;
import com.chengfeng.data.utils.MyJsonUtils;
import com.chengfeng.data.utils.TimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StringbufferTableFieldsServiceImpl implements StringbufferTableFieldsService {
    @Autowired
    JdbcTemplate jdbcTemplate;


    @Override
    public String forGetColNames(String list) {
        List<TableFields> tableFields = fillEntity(list);
        Map<String, Object> map = new HashMap<>();
        map.put("ColNames", dealColNames(tableFields));//处理表头
        map.put("colModel", dealcolModel(tableFields, 15));//处理colModel
        return JSON.toJSONString(map);
    }

    /**
     * 其他功能代码生成
     * 空格是必须保留的
     *
     * @param options
     * @return
     */
    @Override
    public String forMoreCode(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        if (type.equals("input")) {
            return forMoreCode_input(options);
        } else if (type.equals("preloadingInput")) {
            return forMoreCode_preloadingInput(options);
        } else if (type.equals("timeWithEnd")) {
            return forMoreCode_timeWithEnd(options);
        } else if (type.equals("dropDownBox")) {
            return forMoreCode_dropDownBox(options);
        } else if (type.equals("dropDownBox_other")) {
            return forMoreCode_dropDownBox_other(options);
        } else if (type.equals("entityField")) {
            return forMoreCode_entityField(options);
        } else if (type.equals("xml_timeStartEnd")) {
            return forMoreCode_xml_timeStartEnd(options);
        }


        return null;
    }


    /**
     * 加载字典表，安装ElementUI的数据格式封装
     *
     * @return
     */
    @Override
    public String loadBscDictionaryInfoTree() {
        List<Map<String, Object>> result = new ArrayList<>();

        Map<String, Object> map;
        List<Map<String, Object>> parentList = jdbcTemplate.queryForList("SELECT DISTINCT type_name,type_id FROM `bsc_dictionary_info`");
        for (int i = 0; i < parentList.size(); i++) {
            map = new HashMap<>();
            String p_type_id = parentList.get(i).get("type_id") == null ? "" : parentList.get(i).get("type_id").toString();
            String p_type_name = parentList.get(i).get("type_name") == null ? "" : parentList.get(i).get("type_name").toString();
            List<Map<String, Object>> childList = jdbcTemplate.queryForList("SELECT code as value,`name` as label FROM `bsc_dictionary_info` WHERE type_id=" + p_type_id);
            map.put("label", p_type_name);
            map.put("value", p_type_id);
            map.put("children", childList);
            result.add(map);
        }
        return JSON.toJSONString(result);
    }


    /**
     * 处理colModel
     *
     * @param tableFields
     * @return
     */
    private String dealcolModel(List<TableFields> tableFields, int len_per_char) {
        List<String> list = new ArrayList<>();
        for (int t = 0; t < tableFields.size(); t++) {
            StringBuffer sb = new StringBuffer();
            TableFields map = tableFields.get(t);
            String i = map.getCOLUMN_COMMENT();//example:申请方代码
            String j = map.getCOLUMN_NAME();//example:applicant_cd
//            Map<String, Object> alignAndWidth = textAlignAdvise(i, j);//传递字段名称和字段代码，查询外部json文件获取对齐方式和宽度的建议值
//            String k = alignAndWidth.get("align").toString();//对齐方式
//            String h = alignAndWidth.get("align").toString();//宽度
            String k = "";

            //同时需要驼峰命名法处理
            String humpJ = HumpUtils.dealHump(j);
            //拼装
            sb.append("{");
            sb.append("name: '").append(humpJ).append("', index: '").append(humpJ).append("', width: ").append(t == tableFields.size() - 1 ? (i.length() * len_per_char + 30) : (i.length() * len_per_char));
            if (!k.equals("")) {
                if (k.equals("-1")) {
                    sb.append(", align: 'left'");
                } else if (k.equals("0")) {
                    sb.append(", align: 'center'");
                } else if (k.equals("1")) {
                    sb.append(", align: 'right'");
                }
            } else {
                //默认居中
                sb.append(", align: 'center'");
            }
            if (t != tableFields.size() - 1) {
                sb.append("},").append("//").append(i).append("\t").append(j);
            } else {
                sb.append("}").append("//").append(i).append("\t").append(j);
            }
            list.add(sb.toString());
        }
        return JSON.toJSONString(list);
    }

    /**
     * 处理表头
     *
     * @param tableFields
     * @return
     */
    private String dealColNames(List<TableFields> tableFields) {
        StringBuffer sb = new StringBuffer();
        sb.append("[");
        for (int i = 0; i < tableFields.size(); i++) {
            TableFields temp = tableFields.get(i);
            if (i != tableFields.size() - 1) {
                sb.append("'" + temp.getCOLUMN_COMMENT() + "',");//逗号
            } else {
                sb.append("'" + temp.getCOLUMN_COMMENT() + "'");
            }
        }
        sb.append("]");
        return sb.toString();
    }


    /**
     * 将前端的json数组转成对象
     * 关键处理：jsonArray>>>>(强转)JSONObject>>>>object.entrySet().iterator()
     *
     * @param list
     * @return
     */
    private static List<TableFields> fillEntity(String list) {
        List<TableFields> result = new ArrayList<>();
        TableFields tableFields;
        JSONArray jsonArray = JSONObject.parseArray(list);//是个List<Map<String,Object>>的形式
        for (int i = 0; i < jsonArray.size(); i++) {
            tableFields = new TableFields();
            JSONObject object = (JSONObject) jsonArray.get(i);
            Iterator<Map.Entry<String, Object>> iterator = object.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<String, Object> next = iterator.next();
                String key = next.getKey();
                Object value = next.getValue() == null ? "" : next.getValue();
                if (key.equals("index")) {
                    tableFields.setIndex(Integer.parseInt(value.toString()));
                }
                if (key.equals("TABLE_NAME")) {
                    tableFields.setTABLE_NAME(value.toString());
                }
                if (key.equals("COLUMN_COMMENT")) {
                    tableFields.setCOLUMN_COMMENT(value.toString());
                }
                if (key.equals("COLUMN_NAME")) {
                    tableFields.setCOLUMN_NAME(value.toString());
                }
                if (key.equals("FINAL_COLUMN_NAME")) {
                    tableFields.setFINAL_COLUMN_NAME(value.toString());
                }
            }
            result.add(tableFields);
        }
        return result;
    }

    /**
     * 对齐方式的建议处理
     *
     * @param columnComment 字符描述文字
     * @param columnName    字段代码
     * @return map含2个值：alignValue：建议的对齐方式-1/0/1代表左中右；width：建议的表格宽度
     */
    private Map<String, Object> textAlignAdvise(String columnComment, String columnName) {
        Map<String, Object> result = new HashMap<>();
        List<JSONArray> arrayTemp = new ArrayList<>();
        String path = StringbufferTableFieldsServiceImpl.class.getClassLoader().getResource("json/text-align-advise.json").getPath();
        JSONObject object = MyJsonUtils.loadJsonFile(path);
        JSONObject exactMatch = (JSONObject) object.get("精确匹配");
        JSONArray exactMatch_left = (JSONArray) exactMatch.get("left");
        JSONArray exactMatch_center = (JSONArray) exactMatch.get("center");
        JSONArray exactMatch_right = (JSONArray) exactMatch.get("center");
        JSONObject vagueMatch = (JSONObject) object.get("模糊匹配");
        JSONArray vagueMatch_left = (JSONArray) vagueMatch.get("left");
        JSONArray vagueMatch_center = (JSONArray) vagueMatch.get("center");
        JSONArray vagueMatch_right = (JSONArray) vagueMatch.get("center");
        //组合成数组进行遍历
        arrayTemp.add(exactMatch_left);
        arrayTemp.add(exactMatch_center);
        arrayTemp.add(exactMatch_right);
        arrayTemp.add(vagueMatch_left);
        arrayTemp.add(vagueMatch_center);
        arrayTemp.add(vagueMatch_right);
        //状态码
        boolean isExactmath = false;
        boolean isVagueMatch = false;
        for (int i = 0; i < arrayTemp.size(); i++) {
            if (!isExactmath) {
                JSONArray jsonArray = arrayTemp.get(i);
                for (int j = 0; j < jsonArray.size(); j++) {
                    JSONObject fieldNameAndWidth = (JSONObject) jsonArray.get(j);
                    fieldNameAndWidth.entrySet().iterator();
                    System.out.println();
                }
            }
        }
        return result;
    }

    /**
     * 处理input
     *
     * @param options
     * @return
     */
    public String forMoreCode_input(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        String COLUMN_COMMENT = options.get("COLUMN_COMMENT") == null ? "" : options.get("COLUMN_COMMENT").toString();
        String COLUMN_NAME = options.get("COLUMN_NAME") == null ? "" : options.get("COLUMN_NAME").toString();
        String width_1 = options.get("width_1") == null ? "" : options.get("width_1").toString();
        String width_2 = options.get("width_2") == null ? "" : options.get("width_2").toString();
        String width_3 = options.get("width_3") == null ? "" : options.get("width_3").toString();
        StringBuffer sb = new StringBuffer();
        sb.append("<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>".replaceAll("3", width_1));
        sb.append("\n");
        sb.append("    <label class='col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label'>".replaceAll("4", width_2) + COLUMN_COMMENT + ":</label>");
        sb.append("\n");
        sb.append("    <div class='col-xs-8 col-sm-8 col-md-8 col-lg-8'>".replaceAll("8", width_3));
        sb.append("\n");
        sb.append("        <input class='form-control' name='" + HumpUtils.dealHump(COLUMN_NAME) + "' placeholder='请输入" + COLUMN_COMMENT + "...' type='text'>");
        sb.append("\n");
        sb.append("    </div>");
        sb.append("\n");
        sb.append("</div>");
        System.out.println("================================================================================================================" + TimeUtils.now());
        System.out.println(sb.toString());
        System.out.println("================================================================================================================");
        return sb.toString();
    }

    private String forMoreCode_preloadingInput(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        String COLUMN_COMMENT = options.get("COLUMN_COMMENT") == null ? "" : options.get("COLUMN_COMMENT").toString();
        String COLUMN_NAME = options.get("COLUMN_NAME") == null ? "" : options.get("COLUMN_NAME").toString();
        String width_1 = options.get("width_1") == null ? "" : options.get("width_1").toString();
        String width_2 = options.get("width_2") == null ? "" : options.get("width_2").toString();
        String width_3 = options.get("width_3") == null ? "" : options.get("width_3").toString();
//        StringBuffer sb = new StringBuffer();
        String s = "<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>\n".replaceAll("3", width_1) +
                "    <label class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label\">".replaceAll("4", width_2) + COLUMN_COMMENT + ":</label>\n" +
                "    <div class=\"col-xs-8 col-sm-8 col-md-8 col-lg-8\">\n".replaceAll("8", width_3) +
                "        <input class=\"form-control\" data-openpopup=\"SUPPLIER\" data-cdname=\"" + HumpUtils.dealHump(COLUMN_NAME) + "\" placeholder=\"请输入" + COLUMN_COMMENT + "...\" type=\"text\">\n" +
                "    </div>\n" +
                "</div>";
        return s;
    }

    private String forMoreCode_timeWithEnd(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        String COLUMN_COMMENT = options.get("COLUMN_COMMENT") == null ? "" : options.get("COLUMN_COMMENT").toString();
        String COLUMN_NAME = options.get("COLUMN_NAME") == null ? "" : options.get("COLUMN_NAME").toString();
        String width_1 = options.get("width_1") == null ? "" : options.get("width_1").toString();
        String width_2 = options.get("width_2") == null ? "" : options.get("width_2").toString();
        String width_3 = options.get("width_3") == null ? "" : options.get("width_3").toString();
        String s = "<div class=\"col-xs-3 col-sm-3 col-md-3 col-lg-3\">\n".replaceAll("3", width_1) +
                "    <label class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label\">".replaceAll("4", width_2) + COLUMN_COMMENT + ":</label>\n" +
                "    <div class=\"col-year-month\">\n" +
                "        <input class=\"form-control\" name=\"" + HumpUtils.dealHump(COLUMN_NAME) + "\" placeholder=\"" + COLUMN_COMMENT + "...\" type=\"text\" onfocus=\"WdatePicker({dateFmt: 'yyyy-MM-dd'})\" data-today=\"yyyy-MM-dd\" data-date=\"y,M,1\">\n" +
                "    </div>\n" +
                "    <div class=\"col-year-month\">\n" +
                "        <input class=\"form-control\" name=\"" + (HumpUtils.dealHump(COLUMN_NAME) + "End") + "\" placeholder=\"" + COLUMN_COMMENT + "...\" type=\"text\" onfocus=\"WdatePicker({dateFmt: 'yyyy-MM-dd'})\" data-today=\"yyyy-MM-dd\" data-date=\"y,M+1,1\">\n" +
                "    </div>\n" +
                "</div>";
        return s;
    }

    private String forMoreCode_dropDownBox(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        String COLUMN_COMMENT = options.get("COLUMN_COMMENT") == null ? "" : options.get("COLUMN_COMMENT").toString();
        String COLUMN_NAME = options.get("COLUMN_NAME") == null ? "" : options.get("COLUMN_NAME").toString();
        String width_1 = options.get("width_1") == null ? "" : options.get("width_1").toString();
        String width_2 = options.get("width_2") == null ? "" : options.get("width_2").toString();
        String width_3 = options.get("width_3") == null ? "" : options.get("width_3").toString();
        String currentChooseDictionary = options.get("currentChooseDictionary") == null ? "" : options.get("currentChooseDictionary").toString();
        //转换
        JSONArray jsonArray = JSON.parseArray(currentChooseDictionary);
        String fatherID = jsonArray.get(0).toString();
        String childID = jsonArray.get(1).toString();
        String s = "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>\n".replaceAll("4", width_1) +
                "    <label class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label\">".replaceAll("4", width_2) + COLUMN_COMMENT + ":</label>\n" +
                "    <div class=\"col-xs-8 col-sm-8 col-md-8 col-lg-8\">\n".replaceAll("8", width_3) +
                "        <select class=\"form-control\" name=\"" + HumpUtils.dealHump(COLUMN_NAME) + "\" data-dtype=\"" + fatherID + "\" value=\"" + childID + "\"></select>\n" +
                "    </div>\n" +
                "</div>";
        return s;
    }

    private String forMoreCode_dropDownBox_other(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        String COLUMN_COMMENT = options.get("COLUMN_COMMENT") == null ? "" : options.get("COLUMN_COMMENT").toString();
        String COLUMN_NAME = options.get("COLUMN_NAME") == null ? "" : options.get("COLUMN_NAME").toString();
        String width_1 = options.get("width_1") == null ? "" : options.get("width_1").toString();
        String width_2 = options.get("width_2") == null ? "" : options.get("width_2").toString();
        String width_3 = options.get("width_3") == null ? "" : options.get("width_3").toString();
        String currentChooseDictionary = options.get("currentChooseDictionary") == null ? "" : options.get("currentChooseDictionary").toString();
        String s = "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>\n".replaceAll("4", width_1) +
                "    <label class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4 control-label\">".replaceAll("4", width_2) + COLUMN_COMMENT + ":</label>\n" +
                "    <div class=\"col-xs-8 col-sm-8 col-md-8 col-lg-8\">\n".replaceAll("8", width_3) +
                "        <select class=\"form-control\" name=\"" + HumpUtils.dealHump(COLUMN_NAME) + "\" data-otype=\"请手动输入你的数据\"></select>\n" +
                "    </div>\n" +
                "</div>";
        return s;
    }

    private String forMoreCode_entityField(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        String COLUMN_COMMENT = options.get("COLUMN_COMMENT") == null ? "" : options.get("COLUMN_COMMENT").toString();
        String COLUMN_NAME = options.get("COLUMN_NAME") == null ? "" : options.get("COLUMN_NAME").toString();
        String width_1 = options.get("width_1") == null ? "" : options.get("width_1").toString();
        String width_2 = options.get("width_2") == null ? "" : options.get("width_2").toString();
        String width_3 = options.get("width_3") == null ? "" : options.get("width_3").toString();
        String currentChooseDictionary = options.get("currentChooseDictionary") == null ? "" : options.get("currentChooseDictionary").toString();
        boolean ifCurrentTable = options.get("ifCurrentTable") == null ? false : (boolean) options.get("ifCurrentTable");
        int fieldIndex = options.get("fieldIndex") == null ? -1 : Integer.parseInt(options.get("fieldIndex").toString());
        String currentfieldTypes = options.get("currentfieldTypes") == null ? "" : options.get("currentfieldTypes").toString();
        String s = "/**\n" +
                "*" + COLUMN_COMMENT + "\n" +
                "*/\n" +
                (currentfieldTypes.equals("Date") ? ("@JsonFormat(timezone = \"GMT+8\", pattern = \"yyyy-MM-dd HH:mm:ss\")" + "\n" + "@DateTimeFormat(pattern = \"yyyy-MM-dd\")" + "\n") : "") +
                //"@ExcelProperty(value = \"供应商\", index = 0)\n" +
                (fieldIndex > 0 ? "@ExcelProperty(value = \"" + COLUMN_COMMENT + "\", index = " + fieldIndex + ")\n" : ("@ExcelIgnore" + "\n")) +
//                "@TableField(exist = false)\n" +
                (ifCurrentTable ? "" : "@TableField(exist = false)\n") +
                "private " + currentfieldTypes + " " + HumpUtils.dealHump(COLUMN_NAME) + ";";
        return s;
    }

    private String forMoreCode_xml_timeStartEnd(Map<String, Object> options) {
        String type = options.get("type") == null ? "" : options.get("type").toString();
        String COLUMN_COMMENT = options.get("COLUMN_COMMENT") == null ? "" : options.get("COLUMN_COMMENT").toString();
        String COLUMN_NAME = options.get("COLUMN_NAME") == null ? "" : options.get("COLUMN_NAME").toString();
        String width_1 = options.get("width_1") == null ? "" : options.get("width_1").toString();
        String width_2 = options.get("width_2") == null ? "" : options.get("width_2").toString();
        String width_3 = options.get("width_3") == null ? "" : options.get("width_3").toString();
        String alias = options.get("alias") == null ? "" : options.get("alias").toString();
        String currentChooseDictionary = options.get("currentChooseDictionary") == null ? "" : options.get("currentChooseDictionary").toString();
        boolean ifCurrentTable = options.get("ifCurrentTable") == null ? false : (boolean) options.get("ifCurrentTable");
        int fieldIndex = options.get("fieldIndex") == null ? -1 : Integer.parseInt(options.get("fieldIndex").toString());
        String currentfieldTypes = options.get("currentfieldTypes") == null ? "" : options.get("currentfieldTypes").toString();
        //deal
        String s = "<if test=\"object." + HumpUtils.dealHump(COLUMN_NAME) + " != null\">\n" +
                "    AND date_format((" + alias + ".`" + COLUMN_NAME + "`),'%y-%m-%d') <![CDATA[ >= ]]> date_format(#{object." + HumpUtils.dealHump(COLUMN_NAME) + "},'%y-%m-%d')\n" +
                "</if>\n" +
                "<if test=\"object.orderDateEnd != null\">\n" +
                "    AND date_format((" + alias + ".`" + COLUMN_NAME + "`),'%y-%m-%d') <![CDATA[ <= ]]> date_format(#{object." + HumpUtils.dealHump(COLUMN_NAME) + "},'%y-%m-%d')\n" +
                "</if>";
        return s;
    }
}
