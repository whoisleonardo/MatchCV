package com.matchcv.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateUserRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String title;
    private String email;
    private String phone;
    private String location;
    private String linkedin;
    private String summary;
    private List<String> skills;
}
