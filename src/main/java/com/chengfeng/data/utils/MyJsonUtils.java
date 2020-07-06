package com.chengfeng.data.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import java.io.*;

public class MyJsonUtils {

    /**
     * @return json文件String
     */
    public static JSONObject loadJsonFile(String path) {

        StringBuffer sb = new StringBuffer();
        Reader reader = null;//通过桥梁将字节转字符
        BufferedReader bufferedReader = null;
        try {
            reader = new InputStreamReader(new FileInputStream(path), "UTF-8");
            bufferedReader = new BufferedReader(reader);//字符流增强一下
            int temp = 0;//篮子
            while ((temp = bufferedReader.read()) != -1) {
                sb.append((char) temp);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            JSONObject object = JSON.parseObject(sb.toString());
            return object;
        }
    }
}
