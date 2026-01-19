package org.task_manager.backend.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

/**
 * Custom deserializer for LocalDateTime that handles multiple date formats
 * Supports:
 * - 2026-01-30T00:00:00 (ISO 8601 with time)
 * - 2026-01-30 (ISO 8601 date only - converts to T00:00:00)
 */
public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    private static final DateTimeFormatter[] FORMATTERS = {
        DateTimeFormatter.ISO_DATE_TIME,           // 2026-01-30T00:00:00
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),  // 2026-01-30T00:00:00
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),  // 2026-01-30
    };

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        // Try each formatter
        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                // For date-only format, append time
                if (value.length() == 10) { // "yyyy-MM-dd" format
                    value = value + "T00:00:00";
                }
                return LocalDateTime.parse(value, formatter);
            } catch (Exception e) {
                // Try next formatter
            }
        }

        // If no formatter worked, throw an exception with helpful message
        throw new IOException(
            "Cannot parse LocalDateTime from value '" + value + 
            "'. Expected format: yyyy-MM-dd or yyyy-MM-dd'T'HH:mm:ss"
        );
    }
}
