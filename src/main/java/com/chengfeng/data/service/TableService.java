package com.chengfeng.data.service;


import com.alibaba.fastjson.JSONArray;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public interface TableService {
    String loadAllTableFields(String[] tables);

    String loadDataAllTableAndFields();

    String getEntityFields(JSONArray jsonArray);
}
