package com.matchcv.service;

import com.matchcv.dto.api.OptimizedCvResponse;
import com.matchcv.model.UserEducation;
import com.matchcv.model.UserExperience;
import com.matchcv.model.UserProfile;
import com.matchcv.model.UserProject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);

    public byte[] generateCvPdf(UserProfile profile,
                                List<UserExperience> experiences,
                                List<UserProject> projects,
                                List<UserEducation> education,
                                OptimizedCvResponse optimized) {
        Path tempDir = null;
        try {
            String template = loadTemplate();
            String latex = injectData(template, profile, experiences, projects, education, optimized);

            tempDir = Files.createTempDirectory("matchcv_");
            Path texFile = tempDir.resolve("cv.tex");
            Files.writeString(texFile, latex, StandardCharsets.UTF_8);

            compile(texFile, tempDir);

            return Files.readAllBytes(tempDir.resolve("cv.pdf"));

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        } finally {
            if (tempDir != null) cleanup(tempDir);
        }
    }

    private String loadTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("cv_template.tex");
            try (InputStream is = resource.getInputStream()) {
                return new String(is.readAllBytes(), StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load LaTeX template", e);
        }
    }

    private String injectData(String template,
                              UserProfile profile,
                              List<UserExperience> experiences,
                              List<UserProject> projects,
                              List<UserEducation> education,
                              OptimizedCvResponse optimized) {
        return template
                .replace("{{fullName}}",        escapeLatex(nvl(profile.getFullName())))
                .replace("{{title}}",            escapeLatex(nvl(profile.getTitle())))
                .replace("{{contact_line}}",     buildContactLine(profile))
                .replace("{{links}}",            buildLinks(profile))
                .replace("{{summary}}",          escapeLatex(nvl(profile.getSummary())))
                .replace("{{experience_block}}", buildExperienceBlock(experiences, optimized))
                .replace("{{projects_block}}",   buildProjectsBlock(projects))
                .replace("{{skills}}",           buildSkills(profile))
                .replace("{{education}}",        buildEducationBlock(education));
    }

    // ── Contact ───────────────────────────────────────────────────────────────

    private String buildContactLine(UserProfile profile) {
        List<String> parts = new ArrayList<>();
        String email = nvl(profile.getEmail());
        String phone = nvl(profile.getPhone());
        if (!email.isBlank()) {
            parts.add("\\href{mailto:" + email + "}{" + escapeLatex(email) + "}");
        }
        if (!phone.isBlank()) {
            parts.add("\\href{tel:" + phone + "}{" + escapeLatex(phone) + "}");
        }
        if (parts.isEmpty()) return "";
        return String.join(" | ", parts) + "\\\\";
    }

    private String buildLinks(UserProfile profile) {
        String linkedin = nvl(profile.getLinkedin());
        if (linkedin.isBlank()) return "";
        return "\\textbf{\\href{" + linkedin + "}{LinkedIn}}";
    }

    // ── Experience ────────────────────────────────────────────────────────────

    private String buildExperienceBlock(List<UserExperience> experiences,
                                        OptimizedCvResponse optimized) {
        if (experiences == null || experiences.isEmpty()) return "";

        List<String> bullets = optimized.optimized_bullets();
        int total = experiences.size();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < total; i++) {
            sb.append(formatExperience(experiences.get(i), sliceBullets(i, total, bullets)));
            sb.append("\n");
        }
        return sb.toString();
    }

    private List<String> sliceBullets(int index, int total, List<String> all) {
        if (all == null || all.isEmpty()) return List.of();
        int perExp = Math.max(1, all.size() / total);
        int start = index * perExp;
        if (start >= all.size()) return List.of();
        int end = (index == total - 1) ? all.size() : Math.min(start + perExp, all.size());
        return all.subList(start, end);
    }

    private String formatExperience(UserExperience exp, List<String> bullets) {
        String company = escapeLatex(nvl(exp.getCompany()));
        String role    = escapeLatex(nvl(exp.getRole()));
        String period  = buildPeriod(exp.getStartDate(), exp.getEndDate(),
                                     Boolean.TRUE.equals(exp.getIsCurrent()));

        StringBuilder sb = new StringBuilder();
        sb.append("   \\textbf{").append(company).append("}\\textbf{ | ").append(role)
          .append("} \\hfill  ").append(period).append("\\\\\n");

        if (!bullets.isEmpty()) {
            sb.append("\\vspace{-3mm}\n");
            sb.append("\\begin{itemize} \\itemsep -3pt\n");
            for (String bullet : bullets) {
                sb.append("    \\item ").append(escapeLatex(bullet)).append("\n");
            }
            sb.append("\\end{itemize}\n");
        }
        return sb.toString();
    }

    // ── Projects ──────────────────────────────────────────────────────────────

    private String buildProjectsBlock(List<UserProject> projects) {
        if (projects == null || projects.isEmpty()) return "";

        StringBuilder sb = new StringBuilder();
        for (UserProject p : projects) {
            String name = escapeLatex(nvl(p.getName()));
            String role = escapeLatex(nvl(p.getRole()));
            String date = p.getDate() != null ? p.getDate().format(DATE_FMT) : "";

            sb.append("    \\textbf{").append(name).append("}");
            if (!role.isBlank()) {
                sb.append("\\text{ | ").append(role).append("}");
            }
            sb.append(" \\hfill  ").append(date).append("\\\\\n");

            if (hasText(p.getDescription())) {
                sb.append("\\vspace{-3mm}\n");
                sb.append("\\begin{itemize} \\itemsep -3pt\n");
                sb.append("    \\item ").append(escapeLatex(p.getDescription())).append("\n");
                sb.append("\\end{itemize}\n");
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    // ── Education ─────────────────────────────────────────────────────────────

    private String buildEducationBlock(List<UserEducation> education) {
        if (education == null || education.isEmpty()) return "";

        StringBuilder sb = new StringBuilder();
        for (UserEducation edu : education) {
            String institution = escapeLatex(nvl(edu.getInstitution()));
            String degree      = escapeLatex(nvl(edu.getDegree()));
            String field       = escapeLatex(nvl(edu.getField()));
            String period      = buildPeriod(edu.getStartDate(), edu.getEndDate(), false);

            sb.append("    \\textbf{").append(institution).append("}\\hfill \\\\\n");

            String degreeField = degree + (field.isBlank() ? "" : " $\\bullet$ " + field);
            sb.append("    ").append(degreeField).append(" \\hfill ").append(period).append("\\\\\n");
            sb.append("\\vspace*{5pt}\n");
        }
        return sb.toString();
    }

    // ── Skills ────────────────────────────────────────────────────────────────

    private String buildSkills(UserProfile profile) {
        List<String> skills = profile.getSkills();
        if (skills == null || skills.isEmpty()) return "";
        return "\\begin{longtable}{p{4cm}p{12cm}}\n"
             + "    Skills: & " + escapeLatex(String.join(", ", skills)) + " \\\\\n"
             + "\\end{longtable}";
    }

    // ── Compile ───────────────────────────────────────────────────────────────

    private void compile(Path texFile, Path outputDir) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
                "pdflatex",
                "-interaction=nonstopmode",
                "-output-directory=" + outputDir.toAbsolutePath(),
                texFile.toAbsolutePath().toString()
        );
        pb.redirectErrorStream(true);
        pb.directory(outputDir.toFile());

        Process process = pb.start();
        String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("pdflatex failed (exit " + exitCode + "):\n" + output);
        }
    }

    private void cleanup(Path dir) {
        try {
            Files.walk(dir)
                 .sorted(Comparator.reverseOrder())
                 .forEach(p -> {
                     try { Files.deleteIfExists(p); } catch (IOException ignored) {}
                 });
        } catch (IOException ignored) {}
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String buildPeriod(java.time.LocalDate start, java.time.LocalDate end, boolean isCurrent) {
        String s = start != null ? start.format(DATE_FMT) : "";
        String e = isCurrent ? "Present" : (end != null ? end.format(DATE_FMT) : "");
        if (s.isEmpty()) return e;
        return e.isEmpty() ? s : s + " - " + e;
    }

    private String escapeLatex(String text) {
        if (text == null) return "";
        return text
                .replace("\\", "\\textbackslash{}")
                .replace("&",  "\\&")
                .replace("%",  "\\%")
                .replace("$",  "\\$")
                .replace("#",  "\\#")
                .replace("_",  "\\_")
                .replace("{",  "\\{")
                .replace("}",  "\\}")
                .replace("~",  "\\textasciitilde{}")
                .replace("^",  "\\textasciicircum{}");
    }

    private String nvl(String s) { return s != null ? s : ""; }
    private boolean hasText(String s) { return s != null && !s.isBlank(); }
}
