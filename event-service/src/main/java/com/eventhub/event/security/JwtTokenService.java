package com.eventhub.event.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Service
public class JwtTokenService {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    public Authentication getAuthentication(String token) {
        if (token == null || token.isBlank()) {
            throw new JwtException("JWT token is empty");
        }

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8))
                .build()
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        String role = claims.get("role", String.class);

        if (username == null || role == null) {
            throw new JwtException("JWT token is missing subject or role");
        }

        return new UsernamePasswordAuthenticationToken(
                username,
                token,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}