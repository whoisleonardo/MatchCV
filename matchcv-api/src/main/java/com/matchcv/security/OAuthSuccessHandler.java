package com.matchcv.security;

import com.matchcv.model.UserProfile;
import com.matchcv.service.OAuthUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuthUserService oAuthUserService;
    private final JwtUtil jwtUtil;

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        String provider = token.getAuthorizedClientRegistrationId(); // "google" or "github"
        OAuth2User oauth2User = token.getPrincipal();

        UserProfile profile = oAuthUserService.findOrCreate(provider, oauth2User);
        String jwt = jwtUtil.generate(profile.getId(), profile.getUsername());

        String redirectUrl = UriComponentsBuilder.fromUriString(appBaseUrl + "/auth/callback")
                .queryParam("token", jwt)
                .queryParam("provider", provider)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
