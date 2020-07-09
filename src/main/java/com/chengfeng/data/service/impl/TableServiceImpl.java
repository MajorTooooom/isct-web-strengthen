package com.chengfeng.data.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.chengfeng.data.service.TableService;
import com.chengfeng.data.utils.HumpUtils;
import com.chengfeng.data.utils.ReturnMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TableServiceImpl implements TableService {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public String loadAllTableFields(String[] tables) {
        if (tables.length > 0) {
            StringBuffer sb = new StringBuffer();
            sb.append("SELECT TABLE_NAME, COLUMN_TYPE, COLUMN_COMMENT, COLUMN_NAME,COLUMN_NAME AS FINAL_COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'scm' AND (");
            for (int i = 0; i < tables.length; i++) {
                if (i == 0) {
                    sb.append("TABLE_NAME = '" + tables[i] + "'");
                } else {
                    sb.append("OR TABLE_NAME = '" + tables[i] + "'");
                }
            }
            sb.append(") ORDER BY TABLE_NAME, ORDINAL_POSITION;");
            List<Map<String, Object>> list = jdbcTemplate.queryForList(sb.toString());
            return ReturnMessage.build(1, "查询成功！", list);
        } else {
            return ReturnMessage.build(-1, "未指定查询的表格");

        }
    }

    @Override
    public String loadDataAllTableAndFields() {
        List<Map<String, Object>> list = new ArrayList<>();//结果集
        //查到内存再处理，不搞数据库
        List<Map<String, Object>> tables = jdbcTemplate.queryForList("SELECT DISTINCT TABLE_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'scm'");
        List<Map<String, Object>> tablesAndFields = jdbcTemplate.queryForList("SELECT TABLE_NAME, COLUMN_TYPE, COLUMN_COMMENT, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'scm'");
        Map<String, Object> map;
        List<Map<String, Object>> tempList;
        for (int i = 0; i < tables.size(); i++) {
            map = new HashMap<>();
            map.put("value", tables.get(i).get("TABLE_NAME"));
            map.put("label", tables.get(i).get("TABLE_NAME"));
            tempList = new ArrayList<>();
            for (int j = 0; j < tablesAndFields.size(); j++) {
                if (tablesAndFields.get(j).get("TABLE_NAME").equals(tables.get(i).get("TABLE_NAME"))) {
                    Map<String, Object> tempMap = new HashMap<>();
                    tempMap.put("value", tablesAndFields.get(j).get("COLUMN_NAME"));
                    tempMap.put("label", tablesAndFields.get(j).get("COLUMN_NAME"));
                    tempList.add(tempMap);
                }
            }
            map.put("children", tempList);
            list.add(map);
        }
        return ReturnMessage.build(1, "查询成功！", list);
    }

    @Override
    public String getEntityFields(JSONArray jsonArray) {
        List<Map<String, Object>> list = null;
        StringBuffer finalsb = new StringBuffer();
        if (jsonArray.size() > 0) {
            StringBuffer sb = new StringBuffer();
            sb.append("SELECT TABLE_NAME, COLUMN_TYPE, COLUMN_COMMENT, COLUMN_NAME,COLUMN_NAME AS FINAL_COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'scm' AND (");
            for (int i = 0; i < jsonArray.size(); i++) {
                if (i == 0) {
                    sb.append("TABLE_NAME = '" + jsonArray.get(i) + "'");
                } else {
                    sb.append("OR TABLE_NAME = '" + jsonArray.get(i) + "'");
                }
            }
            sb.append(") ORDER BY TABLE_NAME, ORDINAL_POSITION;");
            list = jdbcTemplate.queryForList(sb.toString());
            for (int i = 0; i < list.size(); i++) {
                String column_type = list.get(i).get("COLUMN_TYPE").toString();
                finalsb.append("private" + "\t");
                if (column_type.indexOf("int") != -1) {
                    finalsb.append("int" + "\t");
                } else if (column_type.indexOf("char") != -1) {
                    finalsb.append("String" + "\t");
                } else if (column_type.indexOf("date") != -1) {
                    finalsb.append("Date" + "\t");
                } else if (column_type.indexOf("decimal") != -1) {
                    finalsb.append("BigDecimal" + "\t");
                }
                finalsb.append(HumpUtils.dealHump(list.get(i).get("COLUMN_NAME").toString()) + ";//" + list.get(i).get("COLUMN_COMMENT").toString() + "\t" + list.get(i).get("COLUMN_NAME").toString() + "\n");
            }
        }
        return ReturnMessage.build(1, "查询成功！", finalsb.toString());
    }
}