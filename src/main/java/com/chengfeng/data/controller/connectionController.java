package com.chengfeng.data.controller;

import com.chengfeng.data.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class connectionController {

    @Autowired
    ConnectionService connectionService;

    @RequestMapping("/startTimeTest")
    @ResponseBody
    public String startTimeCheck() {
        return connectionService.startTimeCheck();
    }
}
