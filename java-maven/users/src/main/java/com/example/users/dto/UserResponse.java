package com.example.users.dto;

public record UserResponse(
        Long id,
        String userName,
        String fullName,
        String email) {}
