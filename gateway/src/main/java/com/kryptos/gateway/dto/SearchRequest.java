package com.kryptos.gateway.dto;

import lombok.Data;

@Data
public class SearchRequest {
    private String query;
    private int limit;
}
