package org.task_manager.backend.util;

import java.time.LocalDateTime;

/**
 * Utility class for handling time range calculations
 */
public class TimeRangeUtil {

    public static LocalDateTime[] getDateRange(String timeRange) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fromDate;

        switch (timeRange.toLowerCase()) {
            case "7days":
                fromDate = now.minusDays(7);
                break;
            case "30days":
                fromDate = now.minusDays(30);
                break;
            case "90days":
                fromDate = now.minusDays(90);
                break;
            case "year":
                fromDate = now.minusYears(1);
                break;
            default:
                fromDate = now.minusDays(7); // Default to 7 days
        }

        return new LocalDateTime[]{fromDate, now};
    }

    public static LocalDateTime getStartOfDay(LocalDateTime dateTime) {
        return dateTime.withHour(0).withMinute(0).withSecond(0).withNano(0);
    }

    public static LocalDateTime getEndOfDay(LocalDateTime dateTime) {
        return dateTime.withHour(23).withMinute(59).withSecond(59).withNano(999999999);
    }

    public static boolean isInDateRange(LocalDateTime date, LocalDateTime fromDate, LocalDateTime toDate) {
        return !date.isBefore(fromDate) && !date.isAfter(toDate);
    }

    public static double getDaysBetween(LocalDateTime from, LocalDateTime to) {
        long hours = java.time.temporal.ChronoUnit.HOURS.between(from, to);
        return hours / 24.0;
    }
}
