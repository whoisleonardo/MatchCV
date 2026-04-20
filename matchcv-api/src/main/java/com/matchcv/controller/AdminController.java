package com.matchcv.controller;

import com.matchcv.dto.CreateUserRequest;
import com.matchcv.model.UserProfile;
import com.matchcv.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public UserProfile createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }
}
