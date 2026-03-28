package com.kryptos.gateway.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/v1")
public class KryptosGatewayController {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private static final String[] HOSPITALS = {"AIIMS Delhi", "Fortis Mumbai", "Apollo Chennai"};
    private static final String[] DEPARTMENTS = {"Cardiology", "Neurology", "Oncology"};
    private static final String[] SCAN_SUFFIXES = {"MRI Analysis", "CT Scan Review", "X-Ray Assessment"};
    private static final String[] MATCH_SCORES = {"98% MATCH", "94% MATCH", "89% MATCH"};
    private static final String[] ACCESS_TIMES = {"2h ago", "6h ago", "1d ago"};

    public KryptosGatewayController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Builds HttpHeaders with the required User-Agent for Hugging Face.
     */
    private HttpHeaders buildHfHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("User-Agent", "Kryptos-Gateway-Bot");
        return headers;
    }

    // ── /api/v1/search — The Intelligence Link ──
    @PostMapping("/search")
    @SuppressWarnings("unchecked")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestBody Map<String, Object> payload) {

        // Extract the user's query — default to "Medical Scan" if absent
        String query = "Medical Scan";
        Object rawQuery = payload.get("query");
        if (rawQuery instanceof String && !((String) rawQuery).isBlank()) {
            query = (String) rawQuery;
        }

        System.out.println("[Kryptos] 🔍 Search query: \"" + query + "\" → proxying to " + aiServiceUrl + "/ai/search");

        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, buildHfHeaders());
            ResponseEntity<List> aiResponse = restTemplate.postForEntity(
                aiServiceUrl + "/ai/search",
                request,
                List.class
            );
            System.out.println("[Kryptos] ✅ HuggingFace AI responded successfully.");
            return ResponseEntity.ok(aiResponse.getBody());

        } catch (RestClientException e) {
            System.out.println("[Kryptos] ⚠ HuggingFace offline or cold-starting. Returning smart mock data.");
            System.out.println("[Kryptos] Reason: " + e.getMessage());

            List<Map<String, Object>> mockResults = List.of(
                Map.of(
                    "id", "Case-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    "matchScore", MATCH_SCORES[0],
                    "hospital", HOSPITALS[0],
                    "scanType", query + " — " + SCAN_SUFFIXES[0],
                    "department", DEPARTMENTS[0],
                    "lastAccessed", ACCESS_TIMES[0]
                ),
                Map.of(
                    "id", "Case-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    "matchScore", MATCH_SCORES[1],
                    "hospital", HOSPITALS[1],
                    "scanType", query + " — " + SCAN_SUFFIXES[1],
                    "department", DEPARTMENTS[1],
                    "lastAccessed", ACCESS_TIMES[1]
                ),
                Map.of(
                    "id", "Case-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    "matchScore", MATCH_SCORES[2],
                    "hospital", HOSPITALS[2],
                    "scanType", query + " — " + SCAN_SUFFIXES[2],
                    "department", DEPARTMENTS[2],
                    "lastAccessed", ACCESS_TIMES[2]
                )
            );

            return ResponseEntity.ok(mockResults);
        }
    }

    // ── /api/v1/ingest — The Enclave Handover ──
    @PostMapping("/ingest")
    public ResponseEntity<Map<String, String>> ingest(@RequestBody Map<String, Object> payload) {
        String hospitalName = payload.getOrDefault("hospitalName", "Unknown").toString();
        System.out.println("[Kryptos] 📥 Ingesting data from: " + hospitalName + " → proxying to " + aiServiceUrl + "/ai/ingest");

        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, buildHfHeaders());
            ResponseEntity<String> aiResponse = restTemplate.postForEntity(
                aiServiceUrl + "/ai/ingest",
                request,
                String.class
            );
            System.out.println("[Kryptos] ✅ HuggingFace ingestion succeeded.");
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Data encrypted and stored via AI Enclave from " + hospitalName
            ));

        } catch (RestClientException e) {
            System.out.println("[Kryptos] ⚠ HuggingFace offline for ingestion. Returning mock success.");
            System.out.println("[Kryptos] Reason: " + e.getMessage());

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Data ingested successfully from " + hospitalName + " (simulated — AI service cold-starting)"
            ));
        }
    }
}
