package com.example.studentapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

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
        Student s = new Student(null, "Alice", "alice@example.com", "Math", 1000.0, FeesStatus.Paid);

        ResponseEntity<Student> createResponse =
                restTemplate.postForEntity(url("/students"), s, Student.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Student saved = createResponse.getBody();
        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();

        ResponseEntity<Student[]> getResponse =
                restTemplate.getForEntity(url("/students"), Student[].class);

        List<Student> all = List.of(getResponse.getBody());
        assertThat(all).extracting(Student::getName).contains("Alice");
    }
}
