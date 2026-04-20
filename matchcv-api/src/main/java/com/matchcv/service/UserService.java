package com.matchcv.service;

import com.matchcv.dto.CreateUserRequest;
import com.matchcv.dto.LoginRequest;
import com.matchcv.dto.LoginResponse;
import com.matchcv.model.Plan;
import com.matchcv.model.UserProfile;
import com.matchcv.model.UsernameToUid;
import com.matchcv.repository.UserProfileRepository;
import com.matchcv.repository.UsernameToUidRepository;
import com.matchcv.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final UsernameToUidRepository usernameToUidRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserProfile createUser(CreateUserRequest req) {
        if (usernameToUidRepository.existsById(req.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        Instant now = Instant.now();
        UserProfile profile = UserProfile.builder()
                .id(UUID.randomUUID())
                .fullName(req.getFullName())
                .username(req.getUsername())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .plan(Plan.FREE)
                .title(req.getTitle())
                .email(req.getEmail())
                .phone(req.getPhone())
                .location(req.getLocation())
                .linkedin(req.getLinkedin())
                .summary(req.getSummary())
                .skills(req.getSkills())
                .createdAt(now)
                .updatedAt(now)
                .build();

        userProfileRepository.save(profile);
        usernameToUidRepository.save(new UsernameToUid(profile.getUsername(), profile.getId()));

        return profile;
    }

    public LoginResponse login(LoginRequest req) {
        UsernameToUid lookup = usernameToUidRepository.findById(req.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        UserProfile profile = userProfileRepository.findById(lookup.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), profile.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return new LoginResponse(
                jwtUtil.generate(profile.getId(), profile.getUsername()),
                profile.getId(),
                profile.getUsername()
        );
    }
}
