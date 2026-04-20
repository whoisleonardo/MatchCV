package com.matchcv.service;

import com.matchcv.dto.api.GenerateCvRequest;
import com.matchcv.dto.api.OptimizedCvResponse;
import com.matchcv.dto.llm.OptimizeCvRequest;
import com.matchcv.model.*;
import com.matchcv.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CvOrchestratorService {

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);

    private final UserProfileRepository userProfileRepository;
    private final UserExperienceRepository userExperienceRepository;
    private final UserEducationRepository userEducationRepository;
    private final UserProjectRepository userProjectRepository;
    private final LlmService llmService;
    private final PdfGeneratorService pdfGeneratorService;

    public byte[] generate(UUID userId, GenerateCvRequest request) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<UserExperience> experiences = userExperienceRepository.findByKeyUserId(userId);
        List<UserEducation>  education   = userEducationRepository.findByKeyUserId(userId);
        List<UserProject>    projects    = userProjectRepository.findByKeyUserId(userId);

        String cvText = buildCvText(profile, experiences, education, projects);

        OptimizedCvResponse optimized = llmService.optimizeCv(
                new OptimizeCvRequest(cvText, request.jobDescription(), request.language())
        );

        return pdfGeneratorService.generateCvPdf(profile, experiences, projects, education, optimized);
    }

    private String buildCvText(UserProfile profile,
                                List<UserExperience> experiences,
                                List<UserEducation> education,
                                List<UserProject> projects) {
        StringBuilder sb = new StringBuilder();

        sb.append("Name: ").append(nvl(profile.getFullName())).append("\n");

        if (hasText(profile.getTitle())) {
            sb.append("Title: ").append(profile.getTitle()).append("\n");
        }
        if (hasText(profile.getSummary())) {
            sb.append("\nSummary:\n").append(profile.getSummary()).append("\n");
        }
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            sb.append("\nSkills: ").append(String.join(", ", profile.getSkills())).append("\n");
        }

        if (!experiences.isEmpty()) {
            sb.append("\nExperience:\n");
            for (UserExperience exp : experiences) {
                sb.append("\n- ").append(nvl(exp.getCompany()))
                  .append(" | ").append(nvl(exp.getRole()));
                if (exp.getStartDate() != null) {
                    sb.append(" | ").append(exp.getStartDate().format(DATE_FMT));
                    if (Boolean.TRUE.equals(exp.getIsCurrent())) {
                        sb.append(" - Present");
                    } else if (exp.getEndDate() != null) {
                        sb.append(" - ").append(exp.getEndDate().format(DATE_FMT));
                    }
                }
                if (hasText(exp.getDescription())) {
                    sb.append("\n  ").append(exp.getDescription());
                }
                sb.append("\n");
            }
        }

        if (!projects.isEmpty()) {
            sb.append("\nProjects:\n");
            for (UserProject p : projects) {
                sb.append("\n- ").append(nvl(p.getName()));
                if (hasText(p.getRole())) sb.append(" | ").append(p.getRole());
                if (hasText(p.getDescription())) sb.append("\n  ").append(p.getDescription());
                sb.append("\n");
            }
        }

        if (!education.isEmpty()) {
            sb.append("\nEducation:\n");
            for (UserEducation edu : education) {
                sb.append("\n- ").append(nvl(edu.getInstitution()));
                if (hasText(edu.getDegree())) sb.append(" | ").append(edu.getDegree());
                if (hasText(edu.getField()))  sb.append(", ").append(edu.getField());
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    private String nvl(String s) { return s != null ? s : ""; }
    private boolean hasText(String s) { return s != null && !s.isBlank(); }
}
