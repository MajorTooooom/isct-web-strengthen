package com.chengfeng.data.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface StringbufferTableFieldsService {
    String forGetColNames(String list);

    String forMoreCode(Map<String, Object> options);

    String loadBscDictionaryInfoTree();
}
