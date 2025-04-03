package com.e101.nift.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class AdminIpFilter extends OncePerRequestFilter {

    private final AdminIpProperties adminIpProperties;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String remoteIp = request.getRemoteAddr();

        System.out.println("📌 요청 경로: " + path + ", IP: " + remoteIp);

        if (path.startsWith("/api/admin/") && !request.getMethod().equals("OPTIONS")) {
            if (!adminIpProperties.getAllowedIps().contains(remoteIp)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"message\": \"허용되지 않은 IP입니다.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}