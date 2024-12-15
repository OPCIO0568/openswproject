package fundsite.fund_web_backend.dto;

import fundsite.fund_web_backend.model.DonationReview;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonationReviewDTO {
    private Long id;
    private Long donationId;
    private String username; // 사용자 이름 추가
    private String donationTitle; // 기부 제목
    private String imagePath; // 이미지 경로
    private String content; // 후기 내용
    private Boolean isReviewed; // 후기 작성 여부

    // 엔티티를 DTO로 변환하는 생성자
    public DonationReviewDTO(DonationReview review, String username) {
        this.id = review.getId();
        this.donationId = review.getDonation().getId();
        this.username = username; // 전달받은 username 사용
        this.donationTitle = review.getDonation().getTitle();
        this.imagePath = review.getImagePath();
        this.content = review.getContent();
        this.isReviewed = review.getIsReviewed();
    }
    
}

