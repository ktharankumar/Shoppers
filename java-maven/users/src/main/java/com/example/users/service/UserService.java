package com.example.users.service;

import com.example.users.dto.CreateUserRequest;
import com.example.users.dto.UserResponse;
import com.example.users.entity.User;
import com.example.users.mapper.UserMapper;
import com.example.users.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private final UserRepo userRepo;

    @Autowired
    private final UserMapper userMapper;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(CreateUserRequest createUserRequest) {
        User newUser = userMapper.toUser(createUserRequest);
        newUser.setPassword(passwordEncoder.encode(createUserRequest.password()));
        User savedUser = userRepo.save(newUser);
        return userMapper.toUserRegisterDTO(savedUser);
    }

    public List<UserResponse> getAllUsers() {
        return userRepo.findAll().stream()
                .map(userMapper::toUserRegisterDTO)
                .toList();
    }


}
