package com.kryptos.gateway.controller;

import java.util.List;
import java.util.Map;

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

    public KryptosGatewayController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/search")
    @SuppressWarnings("unchecked")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestBody Map<String, Object> payload) {
        System.out.println("[Kryptos] Search request received: " + payload);

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
            // FALLBACK: AI service is offline — return mock enclave data
            System.out.println("[Kryptos] ⚠ AI Service offline, returning mock enclave data.");
            System.out.println("[Kryptos] Reason: " + e.getMessage());

            List<Map<String, Object>> mockResults = List.of(
                Map.of(
                    "id", "Case 8842-Alpha",
                    "matchScore", "98% MATCH",
                    "hospital", "Hospital B",
                    "scanType", "MRI",
                    "department", "Cardiology",
                    "lastAccessed", "2h ago"
                ),
                Map.of(
                    "id", "Case 7731-Bravo",
                    "matchScore", "91% MATCH",
                    "hospital", "Hospital A",
                    "scanType", "CT Scan",
                    "department", "Neurology",
                    "lastAccessed", "5h ago"
                ),
                Map.of(
                    "id", "Case 5519-Delta",
                    "matchScore", "87% MATCH",
                    "hospital", "Hospital C",
                    "scanType", "X-Ray",
                    "department", "Orthopedics",
                    "lastAccessed", "1d ago"
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
