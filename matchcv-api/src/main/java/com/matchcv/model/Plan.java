package com.matchcv.model;

public enum Plan {

    FREE(1, 3, true),
    PRO(5, Integer.MAX_VALUE, false),
    LIFETIME(5, Integer.MAX_VALUE, false);

    private final int maxProfiles;
    private final int maxMonthlyGenerations;
    private final boolean watermark;

    Plan(int maxProfiles, int maxMonthlyGenerations, boolean watermark) {
        this.maxProfiles = maxProfiles;
        this.maxMonthlyGenerations = maxMonthlyGenerations;
        this.watermark = watermark;
    }

    public int getMaxProfiles()            { return maxProfiles; }
    public int getMaxMonthlyGenerations()  { return maxMonthlyGenerations; }
    public boolean hasWatermark()          { return watermark; }
}
