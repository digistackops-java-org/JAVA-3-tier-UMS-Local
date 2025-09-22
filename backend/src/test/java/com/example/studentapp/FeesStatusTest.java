package com.example.studentapp;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FeesStatusTest {

    @Test
    void testEnumValues() {
        assertEquals("Paid", FeesStatus.Paid.name());
        assertEquals("Unpaid", FeesStatus.Unpaid.name());
    }

    @Test
    void testValueOf() {
        assertEquals(FeesStatus.Paid, FeesStatus.valueOf("Paid"));
        assertEquals(FeesStatus.Unpaid, FeesStatus.valueOf("Unpaid"));
    }

    @Test
    void testEnumCount() {
        assertEquals(2, FeesStatus.values().length);
    }
}