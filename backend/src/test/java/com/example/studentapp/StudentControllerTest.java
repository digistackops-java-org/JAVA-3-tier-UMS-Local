package com.example.studentapp;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentRepository repo;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllStudents() throws Exception {
        Student s1 = new Student(1L, "Alice", "alice@example.com", "Math", 1000.0, FeesStatus.Paid);
        Student s2 = new Student(2L, "Bob", "bob@example.com", "Science", 1200.0, FeesStatus.Unpaid);

        when(repo.findAll()).thenReturn(Arrays.asList(s1, s2));

        mockMvc.perform(get("/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Alice"))
                .andExpect(jsonPath("$[1].name").value("Bob"));
    }

    @Test
    void testCreateStudentDefaultsToPaid() throws Exception {
        Student input = new Student(null, "Alice", "alice@example.com", "Math", 1000.0, null);
        Student saved = new Student(1L, "Alice", "alice@example.com", "Math", 1000.0, FeesStatus.Paid);

        when(repo.save(any(Student.class))).thenReturn(saved);

        mockMvc.perform(post("/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.feesStatus").value("Paid"));
    }

    @Test
    void testUpdateStudentFound() throws Exception {
        Student existing = new Student(1L, "Alice", "alice@example.com", "Math", 1000.0, FeesStatus.Paid);
        Student updated = new Student(1L, "Alice Updated", "alice2@example.com", "Science", 2000.0, FeesStatus.Unpaid);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Student.class))).thenReturn(updated);

        mockMvc.perform(put("/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice Updated"))
                .andExpect(jsonPath("$.feesStatus").value("Unpaid"));
    }

    @Test
    void testUpdateStudentNotFound() throws Exception {
        Student updated = new Student(1L, "Alice Updated", "alice2@example.com", "Science", 2000.0, FeesStatus.Unpaid);

        when(repo.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(updated)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteStudentFound() throws Exception {
        when(repo.existsById(1L)).thenReturn(true);
        Mockito.doNothing().when(repo).deleteById(1L);

        mockMvc.perform(delete("/students/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteStudentNotFound() throws Exception {
        when(repo.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/students/1"))
                .andExpect(status().isNotFound());
    }
}
