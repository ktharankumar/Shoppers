package com.example.users.mapper;

import com.example.users.dto.CreateUserRequest;
import com.example.users.dto.UserResponse;
import com.example.users.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toUser(CreateUserRequest createUserRequest);

    @Mapping(target = "fullName", expression = "java(user.getFirstName() + \" \" + user.getLastName())")
    UserResponse toUserRegisterDTO(User user);

}
