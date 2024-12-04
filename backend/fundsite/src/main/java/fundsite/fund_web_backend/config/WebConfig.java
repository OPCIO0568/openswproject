package fundsite.fund_web_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**") // URL 경로
                .addResourceLocations("file:/Users/jjs_0/Desktop/mnt/data/donation-images/"); // 실제 파일 경로
    }
}









