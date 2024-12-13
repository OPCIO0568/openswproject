package fundsite.fund_web_backend.dto;

import lombok.Getter;
import lombok.Setter;
import fundsite.fund_web_backend.model.DonationReview;

@Getter
@Setter
public class DonationReviewDTO {
    private Long id;
    private Long donationId;
    private String donationTitle; // 기부 제목
    private String imagePath; // 이미지 경로
    private String content; // 후기 내용
    private Boolean isReviewed; // 후기 작성 여부

    // 엔티티를 DTO로 변환하는 생성자
    public DonationReviewDTO(DonationReview review) {
        this.id = review.getId();
        this.donationId = review.getDonation().getId();
        this.donationTitle = review.getDonation().getTitle();
        this.imagePath = review.getImagePath();
        this.content = review.getContent();
        this.isReviewed = review.getIsReviewed();
    }
}
