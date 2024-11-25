package com.LDMSAppBackend.BackendModule.Dtos;

public class LinkProgress {
    private Long totalLinks;
    private Long completedLinks;

    public LinkProgress(Long totalLinks, Long completedLinks) {
        this.totalLinks = totalLinks;
        this.completedLinks = completedLinks;
    }

    public Long getTotalLinks() {
        return totalLinks;
    }

    public Long getCompletedLinks() {
        return completedLinks;
    }
}

