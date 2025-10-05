package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @Test
    void registerReturnsUserDetailsWithRole() throws Exception {
        User newUser = new User();
        newUser.setId(42L);
        newUser.setEmail("admin@example.com");
        newUser.setRole(UserRole.ADMIN);

        when(authService.register("admin@example.com", "secret", "ADMIN")).thenReturn(newUser);

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"secret\",\"role\":\"ADMIN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", equalTo("admin@example.com")))
                .andExpect(jsonPath("$.role", equalTo("ADMIN")));
    }

    @Test
    void registerReturnsBadRequestOnInvalidRole() throws Exception {
        when(authService.register(anyString(), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Unsupported role: manager"));

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"user@example.com\",\"password\":\"secret\",\"role\":\"manager\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", equalTo("Unsupported role: manager")));
    }

    @Test
    void loginReturnsTokenAndRole() throws Exception {
        User existing = new User();
        existing.setEmail("user@example.com");
        existing.setRole(UserRole.USER);

        when(authService.login("user@example.com", "secret")).thenReturn(Optional.of(existing));
        when(jwtService.generateToken("user@example.com", UserRole.USER)).thenReturn("jwt-token");

        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"user@example.com\",\"password\":\"secret\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", equalTo("jwt-token")))
                .andExpect(jsonPath("$.role", equalTo("USER")))
                .andExpect(jsonPath("$.email", equalTo("user@example.com")));
    }

    @Test
    void loginReturnsUnauthorizedOnFailure() throws Exception {
        when(authService.login("user@example.com", "bad"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"user@example.com\",\"password\":\"bad\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", equalTo("Invalid credentials")));
    }
}
