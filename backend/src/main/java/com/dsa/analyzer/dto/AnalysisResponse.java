package com.dsa.analyzer.dto;

import com.google.gson.annotations.SerializedName;

public class AnalysisResponse {
    @SerializedName("time_complexity")
    private String timeComplexity;

    @SerializedName("space_complexity")
    private String spaceComplexity;

    @SerializedName("is_optimal")
    private Boolean isOptimal;

    @SerializedName("suggested_pattern")
    private String suggestedPattern;

    private String explanation;

    public AnalysisResponse() {
    }

    public AnalysisResponse(String timeComplexity, String spaceComplexity, Boolean isOptimal, 
                           String suggestedPattern, String explanation) {
        this.timeComplexity = timeComplexity;
        this.spaceComplexity = spaceComplexity;
        this.isOptimal = isOptimal;
        this.suggestedPattern = suggestedPattern;
        this.explanation = explanation;
    }

    public String getTimeComplexity() {
        return timeComplexity;
    }

    public void setTimeComplexity(String timeComplexity) {
        this.timeComplexity = timeComplexity;
    }

    public String getSpaceComplexity() {
        return spaceComplexity;
    }

    public void setSpaceComplexity(String spaceComplexity) {
        this.spaceComplexity = spaceComplexity;
    }

    public Boolean getIsOptimal() {
        return isOptimal;
    }

    public void setIsOptimal(Boolean isOptimal) {
        this.isOptimal = isOptimal;
    }

    public String getSuggestedPattern() {
        return suggestedPattern;
    }

    public void setSuggestedPattern(String suggestedPattern) {
        this.suggestedPattern = suggestedPattern;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
