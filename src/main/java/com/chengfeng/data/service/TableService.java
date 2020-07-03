package com.chengfeng.data.service;


import org.springframework.stereotype.Service;

@Service
public interface TableService {
    String loadAllTableFields(String[] tables);
}
