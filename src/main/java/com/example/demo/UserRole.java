package com.example.demo;

public enum UserRole {
    ADMIN,
    USER;

    public static UserRole fromString(String value) {
        if (value == null || value.isBlank()) {
            return USER;
        }
        try {
            return UserRole.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported role: " + value);
        }
    }
}
