package com.matchcv.controller;

import com.matchcv.dto.api.*;
import org.springframework.web.bind.annotation.PatchMapping;
import com.matchcv.model.*;
import com.matchcv.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // ── Me ───────────────────────────────────────────────────────────────────

    @GetMapping("/me")
    public UserProfileResponse getMe(Authentication auth) {
        return UserProfileResponse.from(profileService.getUserProfile(userId(auth)));
    }

    @PatchMapping("/me")
    public UserProfileResponse updateMe(@RequestBody ProfileUpdateRequest request, Authentication auth) {
        return UserProfileResponse.from(profileService.updateUserProfile(userId(auth), request));
    }

    // ── Experience ────────────────────────────────────────────────────────────

    @PostMapping("/experiences")
    @ResponseStatus(HttpStatus.CREATED)
    public UserExperience addExperience(@Valid @RequestBody ExperienceRequest request,
                                        Authentication auth) {
        return profileService.addExperience(userId(auth), request);
    }

    @GetMapping("/experiences")
    public List<UserExperience> getExperiences(Authentication auth) {
        return profileService.listExperiences(userId(auth));
    }

    @DeleteMapping("/experiences/{expId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExperience(@PathVariable UUID expId, Authentication auth) {
        profileService.deleteExperience(userId(auth), expId);
    }

    // ── Education ─────────────────────────────────────────────────────────────

    @PostMapping("/education")
    @ResponseStatus(HttpStatus.CREATED)
    public UserEducation addEducation(@Valid @RequestBody EducationRequest request,
                                      Authentication auth) {
        return profileService.addEducation(userId(auth), request);
    }

    @GetMapping("/education")
    public List<UserEducation> getEducation(Authentication auth) {
        return profileService.listEducation(userId(auth));
    }

    @DeleteMapping("/education/{eduId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEducation(@PathVariable UUID eduId, Authentication auth) {
        profileService.deleteEducation(userId(auth), eduId);
    }

    // ── Certifications ────────────────────────────────────────────────────────

    @PostMapping("/certifications")
    @ResponseStatus(HttpStatus.CREATED)
    public UserCertification addCertification(@Valid @RequestBody CertificationRequest request,
                                              Authentication auth) {
        return profileService.addCertification(userId(auth), request);
    }

    @GetMapping("/certifications")
    public List<UserCertification> getCertifications(Authentication auth) {
        return profileService.listCertifications(userId(auth));
    }

    @DeleteMapping("/certifications/{certId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCertification(@PathVariable UUID certId, Authentication auth) {
        profileService.deleteCertification(userId(auth), certId);
    }

    // ── Projects ──────────────────────────────────────────────────────────────

    @PostMapping("/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public UserProject addProject(@Valid @RequestBody ProjectRequest request,
                                  Authentication auth) {
        return profileService.addProject(userId(auth), request);
    }

    @GetMapping("/projects")
    public List<UserProject> getProjects(Authentication auth) {
        return profileService.listProjects(userId(auth));
    }

    @DeleteMapping("/projects/{projectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable UUID projectId, Authentication auth) {
        profileService.deleteProject(userId(auth), projectId);
    }

    // ─────────────────────────────────────────────────────────────────────────

    private UUID userId(Authentication auth) {
        return UUID.fromString(auth.getName());
    }
}
