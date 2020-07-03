package com.chengfeng.data.service.impl;

import com.chengfeng.data.service.TableService;
import com.chengfeng.data.utils.ReturnMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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
}
