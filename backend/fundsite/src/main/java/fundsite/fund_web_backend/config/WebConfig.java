package fundsite.fund_web_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/donation/**")
                .addResourceLocations("file:C:/Users/jjs_0/Desktop/mnt/data/donation-images/");
        registry.addResourceHandler("/images/review/**")
                .addResourceLocations("file:C:/Users/jjs_0/Desktop/mnt/data/reviewImages/");
        registry.addResourceHandler("/images/user/**")
                .addResourceLocations("file:C:/Users/jjs_0/Desktop/mnt/data/userProfiles/");
    }
}






	