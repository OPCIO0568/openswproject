package fundsite.fund_web_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonationDTO {
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private Double goalAmount;
    private Long donationType;

    // Getter, Setter, Constructor
}
