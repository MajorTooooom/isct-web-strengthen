package com.chengfeng.data.utils;

import com.alibaba.fastjson.JSON;

import java.util.HashMap;
import java.util.Map;

/**
 * 返回json格式信息
 */
public class returnMessage {
    public static String build(int resultCode, String message) {
        Map<String, Object> map = new HashMap<>();
        map.put("resultCode", resultCode);
        map.put("message", message);
        return JSON.toJSONString(map);
    }

    public static String build(int resultCode, String message, Object data) {
        Map<String, Object> map = new HashMap<>();
        map.put("resultCode", resultCode);
        map.put("message", message);
        map.put("data", data);
        return JSON.toJSONString(map);
    }
}
