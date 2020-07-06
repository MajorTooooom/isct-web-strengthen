package com.chengfeng.data.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeUtils {


    public static String now() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
}
