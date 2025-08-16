package com.example.studentapp;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository repo;

    public StudentController(StudentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Student> all() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Student> create(@RequestBody Student s) {
        if (s.getFeesStatus() == null && s instanceof Student) {
            // normalize textual values from frontend, if any
            // (handled in enum as well, but keep robustness)
        }
        if (s.getFeesStatus() == null && s instanceof Student) {
            // default to Paid if not provided
            s.setFeesStatus(FeesStatus.Paid);
        }
        return ResponseEntity.ok(repo.save(s));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable Long id, @RequestBody Student updated) {
        return repo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setEmail(updated.getEmail());
            existing.setCourse(updated.getCourse());
            existing.setAmount(updated.getAmount());
            existing.setFeesStatus(updated.getFeesStatus());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
