package com.example.studentapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class StudentApiIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String url(String path) {
        return "http://localhost:" + port + path;
    }

    @Test
    void testCreateAndFetchStudent() {
        // Create a new student
        Student s = new Student();
        s.setName("Alice");
        s.setEmail("alice@example.com");
        s.setCourse("Math");
        s.setAmount(new BigDecimal("1000.0"));
        s.setFeesStatus(FeesStatus.Paid);

        // POST request to create student
        ResponseEntity<Student> createResponse =
                restTemplate.postForEntity(url("/students"), s, Student.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Student saved = createResponse.getBody();
        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Alice");
        assertThat(saved.getFeesStatus()).isEqualTo(FeesStatus.Paid);

        // GET request to fetch all students
        ResponseEntity<Student[]> getResponse =
                restTemplate.getForEntity(url("/students"), Student[].class);

        List<Student> all = List.of(getResponse.getBody());
        assertThat(all).extracting(Student::getName).contains("Alice");
    }

    @Test
    void testUpdateStudent() {
        // First, create a student
        Student s = new Student();
        s.setName("Bob");
        s.setEmail("bob@example.com");
        s.setCourse("Science");
        s.setAmount(new BigDecimal("1200.0"));
        s.setFeesStatus(FeesStatus.Unpaid);

        Student saved = restTemplate.postForEntity(url("/students"), s, Student.class).getBody();
        assertThat(saved).isNotNull();

        // Update student
        saved.setName("Bob Updated");
        saved.setAmount(new BigDecimal("1500.0"));
        saved.setFeesStatus(FeesStatus.Half_paid);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Student> request = new HttpEntity<>(saved, headers);

        ResponseEntity<Student> updateResponse =
                restTemplate.exchange(url("/students/" + saved.getId()), HttpMethod.PUT, request, Student.class);

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Student updated = updateResponse.getBody();
        assertThat(updated.getName()).isEqualTo("Bob Updated");
        assertThat(updated.getAmount()).isEqualTo(new BigDecimal("1500.0"));
        assertThat(updated.getFeesStatus()).isEqualTo(FeesStatus.Half_paid);
    }

    @Test
    void testDeleteStudent() {
        // Create a student to delete
        Student s = new Student();
        s.setName("Charlie");
        s.setEmail("charlie@example.com");
        s.setCourse("History");
        s.setAmount(new BigDecimal("800.0"));
        s.setFeesStatus(FeesStatus.Paid);

        Student saved = restTemplate.postForEntity(url("/students"), s, Student.class).getBody();
        assertThat(saved).isNotNull();

        // DELETE request
        restTemplate.delete(url("/students/" + saved.getId()));

        // Verify deletion
        ResponseEntity<Student[]> getResponse =
                restTemplate.getForEntity(url("/students"), Student[].class);

        List<Student> all = List.of(getResponse.getBody());
        assertThat(all).extracting(Student::getId).doesNotContain(saved.getId());
    }
}