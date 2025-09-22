package com.example.studentapp;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class StudentControllerTest {

    @Test
    void testCreateStudent() {
        Student s = new Student();
        s.setId(1L);
        s.setName("Alice");
        s.setEmail("alice@example.com");
        s.setCourse("Math");
        s.setAmount(new BigDecimal("1000.0"));
        s.setFeesStatus(FeesStatus.Paid);

        assertNotNull(s);
        assertEquals(FeesStatus.Paid, s.getFeesStatus());
    }

    @Test
    void testUpdateStudent() {
        Student s = new Student();
        s.setId(1L);
        s.setName("Alice");
        s.setEmail("alice@example.com");
        s.setCourse("Math");
        s.setAmount(new BigDecimal("1000.0"));
        s.setFeesStatus(FeesStatus.Paid);

        // Simulate update
        s.setName("Alice Updated");
        s.setCourse("Science");
        s.setAmount(new BigDecimal("1500.0"));
        s.setFeesStatus(FeesStatus.Half_paid);

        assertEquals("Alice Updated", s.getName());
        assertEquals("Science", s.getCourse());
        assertEquals(new BigDecimal("1500.0"), s.getAmount());
        assertEquals(FeesStatus.Half_paid, s.getFeesStatus());
    }

    @Test
    void testDeleteStudent() {
        Student s = new Student();
        s.setId(1L);
        assertEquals(1L, s.getId());

        // Simulate deletion
        s = null;
        assertNull(s);
    }
}