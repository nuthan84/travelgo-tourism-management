package com.travelgo.service;

import com.travelgo.dto.AuthResponse;
import com.travelgo.dto.LoginRequest;
import com.travelgo.dto.RegisterRequest;
import com.travelgo.dto.UserDTO;
import com.travelgo.entity.Role;
import com.travelgo.entity.User;
import com.travelgo.entity.UserStatus;
import com.travelgo.exception.BadRequestException;
import com.travelgo.exception.ResourceNotFoundException;
import com.travelgo.repository.UserRepository;
import com.travelgo.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                Role.USER,
                UserStatus.ACTIVE
        );

        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Account is inactive. Please contact support.");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }

    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new UserDTO(user);
    }
}
