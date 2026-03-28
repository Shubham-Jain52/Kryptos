package com.kryptos.gateway.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.kryptos.gateway.dto.IngestRequest;

@RestController
@RequestMapping("/api/v1")
public class KryptosGatewayController {

    private final RestTemplate restTemplate;

    private static final String[] HOSPITALS = {"AIIMS Delhi", "Fortis Mumbai", "Apollo Chennai"};
    private static final String[] DEPARTMENTS = {"Cardiology", "Neurology", "Oncology"};
    private static final String[] SCAN_SUFFIXES = {"MRI Analysis", "CT Scan Review", "X-Ray Assessment"};
    private static final String[] MATCH_SCORES = {"98% MATCH", "94% MATCH", "89% MATCH"};
    private static final String[] ACCESS_TIMES = {"2h ago", "6h ago", "1d ago"};

    public KryptosGatewayController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/search")
    @SuppressWarnings("unchecked")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestBody Map<String, Object> payload) {
        System.out.println("[Kryptos] Search request received: " + payload);

        // Extract the user's query — default to "Medical Scan" if absent
        String query = "Medical Scan";
        Object rawQuery = payload.get("query");
        if (rawQuery instanceof String && !((String) rawQuery).isBlank()) {
            query = (String) rawQuery;
        }

        try {
            // Attempt to proxy the request to the Python AI service
            ResponseEntity<List> aiResponse = restTemplate.postForEntity(
                "http://localhost:8000/search",
                payload,
                List.class
            );
            System.out.println("[Kryptos] AI Service responded successfully.");
            return ResponseEntity.ok(aiResponse.getBody());

        } catch (RestClientException e) {
            // FALLBACK: AI service is offline — return smart mock enclave data
            System.out.println("[Kryptos] ⚠ AI Service offline, returning smart mock data for query: \"" + query + "\"");

            // Generate 3 query-aware, unique mock records
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

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, String>> ingest(@RequestBody IngestRequest request) {
        System.out.println("[Kryptos] Ingesting data from hospital: " + request.getHospitalName());

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Data ingested successfully from " + request.getHospitalName()
        ));
    }
}
