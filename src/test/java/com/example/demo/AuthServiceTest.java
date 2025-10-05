package com.example.demo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private final ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

    @Test
    void registerCreatesAdminUserWhenRoleProvided() {
        when(passwordEncoder.encode("secret")).thenReturn("ENCODED-secret");
        when(userRepository.existsByEmail("admin@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = authService.register("admin@example.com", "secret", "ADMIN");

        verify(passwordEncoder).encode("secret");
        verify(userRepository).save(userCaptor.capture());

        assertThat(saved.getRole()).isEqualTo(UserRole.ADMIN);
        assertThat(userCaptor.getValue().getPasswordHash()).isEqualTo("ENCODED-secret");
    }

    @Test
    void registerDefaultsToUserWhenRoleMissing() {
        when(passwordEncoder.encode("secret")).thenReturn("ENCODED-secret");
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = authService.register("user@example.com", "secret", null);

        assertThat(saved.getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    void registerRejectsUnknownRoles() {
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);

        assertThatThrownBy(() -> authService.register("user@example.com", "secret", "manager"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unsupported role");

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginReturnsUserWhenPasswordMatches() {
        User existing = new User();
        existing.setEmail("user@example.com");
        existing.setPasswordHash("ENCODED-secret");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("secret", "ENCODED-secret")).thenReturn(true);

        Optional<User> result = authService.login("user@example.com", "secret");

        assertThat(result).containsSame(existing);
    }

    @Test
    void loginEmptyWhenPasswordDoesNotMatch() {
        User existing = new User();
        existing.setEmail("user@example.com");
        existing.setPasswordHash("ENCODED-secret");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("secret", "ENCODED-secret")).thenReturn(false);

        Optional<User> result = authService.login("user@example.com", "secret");

        assertThat(result).isEmpty();
    }
}
