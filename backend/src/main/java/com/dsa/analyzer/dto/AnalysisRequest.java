package com.dsa.analyzer.dto;

public class AnalysisRequest {
    private String problemStatement;
    private String code;

    public AnalysisRequest() {
    }

    public AnalysisRequest(String problemStatement, String code) {
        this.problemStatement = problemStatement;
        this.code = code;
    }

    public String getProblemStatement() {
        return problemStatement;
    }

    public void setProblemStatement(String problemStatement) {
        this.problemStatement = problemStatement;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
