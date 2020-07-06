package com.chengfeng.data.entity;

import com.sun.xml.internal.ws.developer.Serialization;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Serialization
@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class TableFields {
    private int index;
    private String TABLE_NAME;
    private String COLUMN_COMMENT;
    private String COLUMN_NAME;
    private String FINAL_COLUMN_NAME;
}
