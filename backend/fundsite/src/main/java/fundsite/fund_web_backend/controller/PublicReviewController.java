package fundsite.fund_web_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fundsite.fund_web_backend.dto.DonationReviewDTO;
import fundsite.fund_web_backend.model.DonationReview;
import fundsite.fund_web_backend.model.ReviewComment;
import fundsite.fund_web_backend.repository.DonationReviewRepository;

@RestController
@RequestMapping("/api/public/reviews")
public class PublicReviewController {

    @Autowired
    private DonationReviewRepository donationReviewRepository;

    /**
     * 모든 리뷰 조회
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllReviews() {
        List<DonationReview> reviews = donationReviewRepository.findAll();

        // DTO로 변환하여 반환
        List<DonationReviewDTO> reviewDTOs = reviews.stream()
                .map(DonationReviewDTO::new)
                .toList();

        return ResponseEntity.ok(reviewDTOs);
    }

    /**
     * 특정 리뷰의 댓글 목록 조회
     */
    @GetMapping("/{reviewId}/comments")
    @Transactional(readOnly = true) // Lazy 로딩 문제 방지
    public ResponseEntity<?> getComments(@PathVariable("reviewId") Long reviewId) {
        DonationReview review = donationReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // 댓글 목록 변환
        List<ReviewComment> comments = review.getComments();
        List<Map<String, Object>> response = comments.stream().map(comment -> Map.of(
                "id", comment.getId(),
                "content", comment.getContent(),
                "createdBy", Map.of(
                        "id", comment.getCreatedBy().getId(),
                        "username", comment.getCreatedBy().getUsername()
                ),
                "createdAt", comment.getCreatedAt()
        )).toList();

        return ResponseEntity.ok(response);
    }
}
