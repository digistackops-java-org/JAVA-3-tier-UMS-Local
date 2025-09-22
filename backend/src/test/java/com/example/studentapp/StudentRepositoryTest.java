package com.example.studentapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository repo;

    @Test
    void testSaveAndFindById() {
        Student s = new Student(null, "Alice", "alice@example.com", "Math", 1000.0, FeesStatus.Paid);
        Student saved = repo.save(s);

        assertThat(saved.getId()).isNotNull();
        assertThat(repo.findById(saved.getId())).isPresent();
    }

    @Test
    void testFindAll() {
        repo.saveAll(List.of(
                new Student(null, "Alice", "alice@example.com", "Math", 1000.0, FeesStatus.Paid),
                new Student(null, "Bob", "bob@example.com", "Science", 1200.0, FeesStatus.Unpaid)
        ));

        List<Student> all = repo.findAll();
        assertThat(all).hasSize(2);
    }

    @Test
    void testDeleteById() {
        Student s = new Student(null, "Charlie", "charlie@example.com", "Physics", 1500.0, FeesStatus.Paid);
        Student saved = repo.save(s);

        repo.deleteById(saved.getId());

        assertThat(repo.findById(saved.getId())).isNotPresent();
    }
}
