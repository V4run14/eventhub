package com.eventhub.auth.controllers;

import com.eventhub.auth.entities.User;
import com.eventhub.auth.entities.UserRole;
import com.eventhub.auth.services.AuthService;
import com.eventhub.auth.services.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            User user = authService.register(
                    body.get("email"),
                    body.get("password"),
                    body.get("role")
            );
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        return authService.login(body.get("email"), body.get("password"))
                .map(u -> ResponseEntity.ok(Map.of(
                        "token", jwtService.generateToken(u.getEmail(), u.getRole()),
                        "role", u.getRole().name(),
                        "email", u.getEmail()
                )))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
