package com.matchcv.service;

import com.datastax.oss.driver.api.core.uuid.Uuids;
import com.matchcv.dto.api.CertificationRequest;
import com.matchcv.dto.api.EducationRequest;
import com.matchcv.dto.api.ExperienceRequest;
import com.matchcv.dto.api.ProfileUpdateRequest;
import com.matchcv.dto.api.ProjectRequest;
import com.matchcv.model.*;
import com.matchcv.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserExperienceRepository experienceRepository;
    private final UserEducationRepository educationRepository;
    private final UserCertificationRepository certificationRepository;
    private final UserProjectRepository projectRepository;

    public UserProfile getUserProfile(UUID userId) {
        return userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserProfile updateUserProfile(UUID userId, ProfileUpdateRequest req) {
        UserProfile profile = getUserProfile(userId);
        if (req.fullName() != null)  profile.setFullName(req.fullName());
        if (req.title() != null)     profile.setTitle(req.title());
        if (req.phone() != null)     profile.setPhone(req.phone());
        if (req.location() != null)  profile.setLocation(req.location());
        if (req.linkedin() != null)  profile.setLinkedin(req.linkedin());
        if (req.summary() != null)   profile.setSummary(req.summary());
        if (req.skills() != null)    profile.setSkills(req.skills());
        profile.setUpdatedAt(Instant.now());
        return userProfileRepository.save(profile);
    }

    // ── Experience ────────────────────────────────────────────────────────────

    public UserExperience addExperience(UUID userId, ExperienceRequest req) {
        UserExperience exp = UserExperience.builder()
                .key(new UserExperienceKey(userId, Uuids.timeBased()))
                .company(req.company())
                .role(req.role())
                .description(req.description())
                .startDate(req.startDate())
                .endDate(req.endDate())
                .isCurrent(req.isCurrent())
                .build();
        return experienceRepository.save(exp);
    }

    public List<UserExperience> listExperiences(UUID userId) {
        return experienceRepository.findByKeyUserId(userId);
    }

    public void deleteExperience(UUID userId, UUID expId) {
        experienceRepository.deleteById(new UserExperienceKey(userId, expId));
    }

    // ── Education ─────────────────────────────────────────────────────────────

    public UserEducation addEducation(UUID userId, EducationRequest req) {
        UserEducation edu = UserEducation.builder()
                .key(new UserEducationKey(userId, Uuids.timeBased()))
                .institution(req.institution())
                .degree(req.degree())
                .field(req.field())
                .startDate(req.startDate())
                .endDate(req.endDate())
                .build();
        return educationRepository.save(edu);
    }

    public List<UserEducation> listEducation(UUID userId) {
        return educationRepository.findByKeyUserId(userId);
    }

    public void deleteEducation(UUID userId, UUID eduId) {
        educationRepository.deleteById(new UserEducationKey(userId, eduId));
    }

    // ── Certifications ────────────────────────────────────────────────────────

    public UserCertification addCertification(UUID userId, CertificationRequest req) {
        UserCertification cert = UserCertification.builder()
                .key(new UserCertificationKey(userId, Uuids.timeBased()))
                .name(req.name())
                .issuer(req.issuer())
                .issuedDate(req.issuedDate())
                .expiresAt(req.expiresAt())
                .url(req.url())
                .build();
        return certificationRepository.save(cert);
    }

    public List<UserCertification> listCertifications(UUID userId) {
        return certificationRepository.findByKeyUserId(userId);
    }

    public void deleteCertification(UUID userId, UUID certId) {
        certificationRepository.deleteById(new UserCertificationKey(userId, certId));
    }

    // ── Projects ──────────────────────────────────────────────────────────────

    public UserProject addProject(UUID userId, ProjectRequest req) {
        UserProject project = UserProject.builder()
                .key(new UserProjectKey(userId, Uuids.timeBased()))
                .name(req.name())
                .role(req.role())
                .description(req.description())
                .url(req.url())
                .date(req.date())
                .build();
        return projectRepository.save(project);
    }

    public List<UserProject> listProjects(UUID userId) {
        return projectRepository.findByKeyUserId(userId);
    }

    public void deleteProject(UUID userId, UUID projectId) {
        projectRepository.deleteById(new UserProjectKey(userId, projectId));
    }
}
