package com.chengfeng.data.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MyCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {

        if (true) {
            String cmd = "C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe" + " " + "http://localhost:6688";
            System.out.println("========================================================");
            Runtime run = Runtime.getRuntime();
            try {
                run.exec(cmd);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
