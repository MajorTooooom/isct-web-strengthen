package com.chengfeng.data.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.chengfeng.data.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
public class TableController {
    @Autowired
    TableService tableService;

    @RequestMapping("/loadtablefields")
    @ResponseBody
    public String loadAllTableFields(HttpServletRequest request) {
        String[] tables = request.getParameterValues("tables");
        return tableService.loadAllTableFields(tables);
    }


    @RequestMapping("/loadDataAllTableAndFields")
    @ResponseBody
    public String loadDataAllTableAndFields() {
        return tableService.loadDataAllTableAndFields();
    }

    @RequestMapping("/getEntityFields")
    @ResponseBody
    public String getEntityFields(String selectArray) {
        JSONArray jsonArray = JSONArray.parseArray(selectArray);
        return tableService.getEntityFields(jsonArray);
    }
}
