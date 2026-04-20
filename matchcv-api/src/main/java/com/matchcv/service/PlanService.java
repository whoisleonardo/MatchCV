package com.matchcv.service;

import com.matchcv.model.Plan;
import com.matchcv.model.UserProfile;
import org.springframework.data.cassandra.core.cql.CqlTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.YearMonth;
import java.util.List;

@Service
public class PlanService {

    private final CqlTemplate cqlTemplate;

    public PlanService(CqlTemplate cqlTemplate) {
        this.cqlTemplate = cqlTemplate;
    }

    public void validateMonthlyUsage(UserProfile user) {
        Plan plan = effectivePlan(user);
        if (plan != Plan.FREE) return;

        long used = monthlyCount(user);
        if (used >= plan.getMaxMonthlyGenerations()) {
            throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED,
                    "Monthly CV generation limit reached. Upgrade to PRO.");
        }
    }

    public void validateProfileLimit(UserProfile user, int currentProfileCount) {
        int max = effectivePlan(user).getMaxProfiles();
        if (currentProfileCount >= max) {
            throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED,
                    "Profile limit reached. Upgrade your plan.");
        }
    }

    public void incrementUsage(UserProfile user) {
        cqlTemplate.execute(
                "UPDATE user_monthly_usage SET cv_count = cv_count + 1 WHERE user_id = ? AND year_month = ?",
                user.getId(), currentYearMonth()
        );
    }

    public boolean checkWatermark(UserProfile user) {
        return effectivePlan(user).hasWatermark();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private long monthlyCount(UserProfile user) {
        List<Long> rows = cqlTemplate.query(
                "SELECT cv_count FROM user_monthly_usage WHERE user_id = ? AND year_month = ?",
                (rs, n) -> rs.getLong("cv_count"),
                user.getId(), currentYearMonth()
        );
        return rows.isEmpty() ? 0L : rows.get(0);
    }

    private Plan effectivePlan(UserProfile user) {
        return user.getPlan() != null ? user.getPlan() : Plan.FREE;
    }

    private String currentYearMonth() {
        return YearMonth.now().toString();
    }
}
