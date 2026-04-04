package com.dsa.analyzer.service;

import com.dsa.analyzer.dto.AnalysisRequest;
import com.dsa.analyzer.dto.AnalysisResponse;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AnalysisService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    // private String geminiApiUrl;
    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final Gson gson = new Gson();

    public AnalysisResponse analyzeCode(AnalysisRequest request) throws IOException, InterruptedException {
        String prompt = constructPrompt(request.getProblemStatement(), request.getCode());
        String geminiResponse = callGeminiApi(prompt);
        return parseGeminiResponse(geminiResponse);
    }

    private String constructPrompt(String problemStatement, String code) {
        StringBuilder promptBuilder = new StringBuilder();

        if (problemStatement != null && !problemStatement.trim().isEmpty()) {
            promptBuilder.append("Problem Statement: ").append(problemStatement).append("\n\n");
            promptBuilder.append("Code:\n").append(code).append("\n\n");
            promptBuilder.append("Please analyze if this code correctly solves the given problem. ");
        } else {
            promptBuilder.append("Code:\n").append(code).append("\n\n");
            promptBuilder.append("Please analyze this code without a specific problem context. ");
        }

        promptBuilder.append("Analyze the code for Time Complexity, Space Complexity, optimality, and suggest an algorithmic pattern if applicable. ")
                .append("Return ONLY a raw JSON object with this exact schema (no markdown, no backticks, no explanation text before or after):\n")
                .append("{\n")
                .append("  \"time_complexity\": \"String (e.g., O(n), O(n log n), O(n^2))\",\n")
                .append("  \"space_complexity\": \"String (e.g., O(1), O(n), O(n^2))\",\n")
                .append("  \"is_optimal\": boolean,\n")
                .append("  \"suggested_pattern\": \"String (e.g., Sliding Window, Two Pointers, Dynamic Programming, etc.)\",\n")
                .append("  \"explanation\": \"String (Max 3 sentences explaining the analysis)\"\n")
                .append("}\n")
                .append("Return ONLY the JSON object, nothing else.");

        return promptBuilder.toString();
    }

    private String callGeminiApi(String prompt) throws IOException, InterruptedException {
        String requestBody = gson.toJson(new GeminiRequest(prompt));

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(geminiApiUrl + "?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        }

        return extractTextFromGeminiResponse(response.body());
    }

    private String extractTextFromGeminiResponse(String responseBody) {
        GeminiResponse response = gson.fromJson(responseBody, GeminiResponse.class);
        if (response.getCandidates() != null && response.getCandidates().length > 0) {
            GeminiCandidate candidate = response.getCandidates()[0];
            if (candidate.getContent() != null && candidate.getContent().getParts() != null 
                    && candidate.getContent().getParts().length > 0) {
                return candidate.getContent().getParts()[0].getText();
            }
        }
        throw new RuntimeException("Invalid Gemini API response structure");
    }

    private AnalysisResponse parseGeminiResponse(String jsonText) {
        // Clean the response - remove markdown code block syntax if present
        String cleanJson = jsonText.trim();
        if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
        } else if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
        }
        cleanJson = cleanJson.trim();

        return gson.fromJson(cleanJson, AnalysisResponse.class);
    }

    // Inner classes for Gemini API request/response structures
    private static class GeminiRequest {
        private Content[] contents;

        public GeminiRequest(String prompt) {
            this.contents = new Content[]{new Content(prompt)};
        }

        public Content[] getContents() {
            return contents;
        }

        public void setContents(Content[] contents) {
            this.contents = contents;
        }

        private static class Content {
            private Part[] parts;

            public Content(String text) {
                this.parts = new Part[]{new Part(text)};
            }

            public Part[] getParts() {
                return parts;
            }

            public void setParts(Part[] parts) {
                this.parts = parts;
            }

            private static class Part {
                private String text;

                public Part(String text) {
                    this.text = text;
                }

                public String getText() {
                    return text;
                }

                public void setText(String text) {
                    this.text = text;
                }
            }
        }
    }

    private static class GeminiResponse {
        private GeminiCandidate[] candidates;

        public GeminiCandidate[] getCandidates() {
            return candidates;
        }

        public void setCandidates(GeminiCandidate[] candidates) {
            this.candidates = candidates;
        }
    }

    private static class GeminiCandidate {
        private Content content;

        public Content getContent() {
            return content;
        }

        public void setContent(Content content) {
            this.content = content;
        }

        private static class Content {
            private Part[] parts;

            public Part[] getParts() {
                return parts;
            }

            public void setParts(Part[] parts) {
                this.parts = parts;
            }

            private static class Part {
                private String text;

                public String getText() {
                    return text;
                }

                public void setText(String text) {
                    this.text = text;
                }
            }
        }
    }
}
