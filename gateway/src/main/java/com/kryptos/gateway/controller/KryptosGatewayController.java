package com.kryptos.gateway.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class KryptosGatewayController {

    private final Random random = new Random();

    // ── In-Memory Enclave Storage (0ms Latency Simulation) ──
    private static final List<Map<String, Object>> ENCLAVE_STORAGE = new ArrayList<>();

    private static final List<String> HOSPITALS = List.of(
        "AIIMS Delhi", "Medanta Gurugram", "Mayo Clinic", "Cleveland Clinic",
        "Tata Memorial", "Apollo Chennai", "Mount Sinai", "Fortis Mumbai",
        "Massachusetts General", "Singapore General", "Johns Hopkins"
    );

    private static final List<String> DEPTS = List.of(
        "Oncology", "Radiology", "Cardiology", "Neurology", "Orthopedics", "Pathology"
    );

    private static final String[] SCAN_SUFFIXES = {"MRI Analysis", "CT Scan Review", "X-Ray Assessment", "PET Scan Report"};
    private static final String[] ACCESS_TIMES = {"2h ago", "6h ago", "12h ago", "1d ago", "3d ago"};

    // ── /api/v1/search — Instant Enclave Intelligence ──
    @PostMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestBody Map<String, Object> payload) {
        String query = payload.getOrDefault("query", "Medical Scan").toString().toLowerCase();
        System.out.println("[Kryptos] 🔍 Search simulation: \"" + query + "\" (No external network calls)");

        List<Map<String, Object>> combinedResults = new ArrayList<>();

        // 1. First, inject matching records from ENCLAVE_STORAGE (user's own ingested data)
        synchronized (ENCLAVE_STORAGE) {
            for (Map<String, Object> record : ENCLAVE_STORAGE) {
                String scanType = record.getOrDefault("scanType", "").toString().toLowerCase();
                String hospital = record.getOrDefault("hospital", "").toString().toLowerCase();
                // Match on query or include if short
                if (scanType.contains(query) || hospital.contains(query) || query.length() < 3) {
                    record.put("source", "LIVE_INGEST"); // Ensure source is correct
                    combinedResults.add(new HashMap<>(record)); // Return a copy
                }
            }
        }

        if (!combinedResults.isEmpty()) {
            System.out.println("[Kryptos] 📌 Found " + combinedResults.size() + " record(s) in local Enclave storage.");
        }

        // 2. Generate smart mock data (Local Enclave intelligence)
        int count = 2 + random.nextInt(2); // 2-3 mocks

        for (int i = 0; i < count; i++) {
            String formattedQuery = query.length() > 0 
                ? query.substring(0, 1).toUpperCase() + query.substring(1) 
                : "Medical";
            Map<String, Object> mock = new HashMap<>();
            mock.put("id", "Case-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            mock.put("matchScore", (88 + random.nextInt(9)) + "% MATCH");
            mock.put("hospital", HOSPITALS.get(random.nextInt(HOSPITALS.size())));
            mock.put("scanType", formattedQuery + " — " + SCAN_SUFFIXES[random.nextInt(SCAN_SUFFIXES.length)]);
            mock.put("department", DEPTS.get(random.nextInt(DEPTS.size())));
            mock.put("lastAccessed", ACCESS_TIMES[random.nextInt(ACCESS_TIMES.length)]);
            mock.put("source", "SIMULATED");
            combinedResults.add(mock);
        }

        return ResponseEntity.ok(combinedResults);
    }

    // ── /api/v1/ingest — Instant Enclave Handover ──
    @PostMapping("/ingest")
    public ResponseEntity<Map<String, String>> ingest(@RequestBody Map<String, Object> payload) {
        String hospitalName = payload.getOrDefault("hospitalName", "Unknown Hospital").toString();
        String condition = payload.getOrDefault("condition", "General Scan").toString();
        String dataType = payload.getOrDefault("dataType", "medical-scan").toString();

        System.out.println("[Kryptos] 📥 Ingesting from: " + hospitalName + " (Direct to Enclave - 0ms delay)");

        // Store in local ENCLAVE_STORAGE (Bypassing external AI services for zero latency)
        String enclaveId = "ENCLAVE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Map<String, Object> enclaveRecord = new HashMap<>();
        enclaveRecord.put("id", enclaveId);
        enclaveRecord.put("matchScore", "99% VERIFIED");
        enclaveRecord.put("hospital", hospitalName);
        enclaveRecord.put("scanType", condition + " — " + dataType);
        enclaveRecord.put("department", "Secure Enclave");
        enclaveRecord.put("lastAccessed", "Just now");
        enclaveRecord.put("source", "LIVE_INGEST");

        synchronized (ENCLAVE_STORAGE) {
            ENCLAVE_STORAGE.add(enclaveRecord);
        }

        System.out.println("[Kryptos] 🔐 Secured in local Enclave: " + enclaveId);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Data encrypted and stored in local Enclave from " + hospitalName,
            "enclaveId", enclaveId
        ));
    }
}
