package com.example.studentapp;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class StudentTest {

    @Test
    void testConstructorAndGetters() {
        Student s = new Student();
        s.setId(1L);
        s.setName("Alice");
        s.setEmail("alice@example.com");
        s.setCourse("Math");
        s.setAmount(new BigDecimal("1000.0"));
        s.setFeesStatus(FeesStatus.Paid);

        assertEquals(1L, s.getId());
        assertEquals("Alice", s.getName());
        assertEquals("alice@example.com", s.getEmail());
        assertEquals("Math", s.getCourse());
        assertEquals(new BigDecimal("1000.0"), s.getAmount());
        assertEquals(FeesStatus.Paid, s.getFeesStatus());
    }

    @Test
    void testSetters() {
        Student s = new Student();
        s.setId(2L);
        s.setName("Bob");
        s.setEmail("bob@example.com");
        s.setCourse("Science");
        s.setAmount(new BigDecimal("1200.0"));
        s.setFeesStatus(FeesStatus.Half_paid);

        assertEquals(2L, s.getId());
        assertEquals("Bob", s.getName());
        assertEquals("bob@example.com", s.getEmail());
        assertEquals("Science", s.getCourse());
        assertEquals(new BigDecimal("1200.0"), s.getAmount());
        assertEquals(FeesStatus.Half_paid, s.getFeesStatus());
    }
}
