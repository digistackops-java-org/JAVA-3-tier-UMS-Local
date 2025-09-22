package com.example.studentapp;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StudentTest {

    @Test
    void testConstructorAndGetters() {
        Student s = new Student(1L, "Alice", "alice@example.com", "Math", 1000.0, FeesStatus.Paid);

        assertEquals(1L, s.getId());
        assertEquals("Alice", s.getName());
        assertEquals("alice@example.com", s.getEmail());
        assertEquals("Math", s.getCourse());
        assertEquals(1000.0, s.getAmount());
        assertEquals(FeesStatus.Paid, s.getFeesStatus());
    }

    @Test
    void testSetters() {
        Student s = new Student();

        s.setId(2L);
        s.setName("Bob");
        s.setEmail("bob@example.com");
        s.setCourse("Science");
        s.setAmount(1200.0);
        s.setFeesStatus(FeesStatus.Unpaid);

        assertEquals(2L, s.getId());
        assertEquals("Bob", s.getName());
        assertEquals("bob@example.com", s.getEmail());
        assertEquals("Science", s.getCourse());
        assertEquals(1200.0, s.getAmount());
        assertEquals(FeesStatus.Unpaid, s.getFeesStatus());
    }
}
