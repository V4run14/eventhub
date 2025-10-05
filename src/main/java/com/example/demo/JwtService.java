package com.example.demo;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(String email, UserRole role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS256, jwtSecret.getBytes())
                .compact();
    }
}
