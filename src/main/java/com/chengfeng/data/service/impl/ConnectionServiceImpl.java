package com.chengfeng.data.service.impl;

import com.chengfeng.data.service.ConnectionService;
import com.chengfeng.data.utils.returnMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class ConnectionServiceImpl implements ConnectionService {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public String startTimeCheck() {
        //当前使用库
        String databaseName = "scm";
        String msg;
        try {
            Map<String, Object> database = jdbcTemplate.queryForMap("select database() AS name");
            if (database.get("name").equals(databaseName)) {
                msg = "连接成功！正在使用数据库  " + databaseName;
                System.out.println(msg);
                //同时查询数据库全部表格名称
                List<Map<String, Object>> list = jdbcTemplate.queryForList("select TABLE_NAME AS name,TABLE_COMMENT as note from INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='scm'  ORDER BY note desc");
                return returnMessage.build(-1, msg, list);
            }
        } catch (Exception e) {
            if (e.getClass().getName().equals("org.springframework.jdbc.CannotGetJdbcConnectionException")) {
                msg = "异常信息：无法获取Jdbc连接异常";
            } else {
                msg = e.getMessage();
            }
            return returnMessage.build(-1, msg);
        }
        return null;
    }
}
