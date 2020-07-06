package com.chengfeng.data.controller;

import com.chengfeng.data.service.StringbufferTableFieldsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;


@Controller
public class StringbufferTableFieldsController {
    @Autowired
    StringbufferTableFieldsService stringbufferTableFieldsService;

    @RequestMapping("/getColNames")
    @ResponseBody
    public String forGetColNames(String list) {
        String result = stringbufferTableFieldsService.forGetColNames(list);
        return result;
    }

    @RequestMapping("/forMoreCode")
    @ResponseBody
    public String forMoreCode(String type, String COLUMN_COMMENT, String COLUMN_NAME, String width_1, String width_2, String width_3, String currentChooseDictionary) {
        Map<String, Object> options = new HashMap<>();
        options.put("type", type);
        options.put("COLUMN_COMMENT", COLUMN_COMMENT);
        options.put("COLUMN_NAME", COLUMN_NAME);
        options.put("width_1", width_1);
        options.put("width_2", width_2);
        options.put("width_3", width_3);
        options.put("currentChooseDictionary", currentChooseDictionary);
        return stringbufferTableFieldsService.forMoreCode(options);
    }

    @RequestMapping("/loadBscDictionaryInfoTree")
    @ResponseBody
    public String loadBscDictionaryInfoTree() {
        return stringbufferTableFieldsService.loadBscDictionaryInfoTree();
    }
}
