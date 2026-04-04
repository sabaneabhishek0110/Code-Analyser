package com.dsa.analyzer.controller;

import com.dsa.analyzer.dto.AnalysisRequest;
import com.dsa.analyzer.dto.AnalysisResponse;
import com.dsa.analyzer.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analyze")
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<AnalysisResponse> analyzeCode(@RequestBody AnalysisRequest request) {
        try {
            if (request.getCode() == null || request.getCode().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            AnalysisResponse response = analysisService.analyzeCode(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
