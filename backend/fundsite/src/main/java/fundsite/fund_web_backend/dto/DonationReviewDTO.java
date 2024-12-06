package fundsite.fund_web_backend.dto;

import fundsite.fund_web_backend.model.DonationReview;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonationReviewDTO {
    private Long id;
    private String content;
    private Boolean isCompleted;
    private String donationTitle; // Donation 제목

    // Constructor
    public DonationReviewDTO(DonationReview review) {
        this.id = review.getId();
        this.content = review.getContent();
        this.isCompleted = review.getIsCompleted();
        this.donationTitle = review.getDonation().getTitle();
    }
}
