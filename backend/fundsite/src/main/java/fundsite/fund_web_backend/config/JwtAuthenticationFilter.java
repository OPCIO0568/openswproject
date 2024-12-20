package fundsite.fund_web_backend.config;

import java.io.IOException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import fundsite.fund_web_backend.util.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getServletPath();

        // 인증이 필요 없는 경로 처리
        if (path.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // JWT 토큰 처리
        String token = jwtTokenProvider.resolveToken(request);
        if (token == null) {
            System.out.println("JWT Token is missing");
        } else if (!jwtTokenProvider.validateToken(token)) {
            System.out.println("JWT Token is invalid or expired");
        } else {
            System.out.println("JWT Token is valid, setting authentication");
            SecurityContextHolder.getContext().setAuthentication(jwtTokenProvider.getAuthentication(token));
        }
        filterChain.doFilter(request, response);
    }
}
