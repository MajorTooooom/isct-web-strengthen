package com.chengfeng.data.utils;

public class HumpUtils {
    /**
     * 驼峰命名法处理
     * 示例：_g12345_abcde_dororo_gzh_hmj_
     * 示例：_g_
     * 示例：_g
     */
    public static String dealHump(String source) {
        int curLen;
        int curIndex;
        String left;
        String flag;
        String right;
        if (source != null && !source.equals("") && source.indexOf("_") != -1) {
            while (source.indexOf("_") != -1 && source.indexOf("_") != source.length() - 1) {
                curLen = source.length();
                curIndex = source.indexOf("_");
                //只要“_”的位置不是字符串最后一位，那么都将它的下一位字母替换成大写
                if (curIndex != curLen) {
                    left = source.substring(0, curIndex);//将左边的“_”去掉，如果不想去掉则改成left = source.substring(0, curIndex+1);
                    flag = source.substring(curIndex + 1, curIndex + 2);
                    right = (curIndex + 2) >= source.length() ? "" : source.substring(curIndex + 2);
                    source = left + flag.toUpperCase() + right;
                }
            }
        }//end if
        return source;
    }
}
