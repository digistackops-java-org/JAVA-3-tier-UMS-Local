package com.example.studentapp;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

class FeesStatusTest {

    @Test
    void testEnumValues() {
        assertEquals("Paid", FeesStatus.Paid.name());
        assertEquals("Unpaid", FeesStatus.Unpaid.name());
        assertEquals("Half_paid", FeesStatus.Half_paid.name());
    }

    @Test
    void testValueOf() {
        assertEquals(FeesStatus.Paid, FeesStatus.valueOf("Paid"));
        assertEquals(FeesStatus.Unpaid, FeesStatus.valueOf("Unpaid"));
        assertEquals(FeesStatus.Half_paid, FeesStatus.valueOf("Half_paid"));
    }

    @Test
    void testEnumContainsOnlyExpectedValues() {
        List<String> expected = Arrays.asList("Paid", "Unpaid", "Half_paid");

        for (FeesStatus status : FeesStatus.values()) {
            assertTrue(expected.contains(status.name()),
                       "Unexpected enum value: " + status.name());
        }

        for (String exp : expected) {
            assertTrue(Arrays.stream(FeesStatus.values())
                             .anyMatch(e -> e.name().equals(exp)),
                       "Expected enum value missing: " + exp);
        }
    }
}