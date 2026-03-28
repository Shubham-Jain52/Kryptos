package com.kryptos.gateway.dto;

import lombok.Data;

@Data
public class IngestRequest {
    private String hospitalName;
    private String condition;
    private String dataType;
    private String content;
}
